import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { Project, PlatformType } from "../models/Project.js";
import { Variant } from "../models/Variant.js";
import { Asset } from "../models/Asset.js";
import { ShareLink } from "../models/ShareLink.js";
import { Comment } from "../models/Comment.js";
import { uploadImageFile } from "../config/cloudinary.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/index.js";

const VALID_PLATFORMS: PlatformType[] = [
  "youtube",
  "instagram",
  "facebook",
  "tiktok",
  "linkedin",
];

function resolvePlatform(raw?: string): PlatformType {
  if (raw && VALID_PLATFORMS.includes(raw as PlatformType)) {
    return raw as PlatformType;
  }
  return "youtube";
}

function buildActiveVariantsByPlatform(
  project: any,
  variantsWithAssets: any[],
): Record<PlatformType, any> {
  const result: Record<PlatformType, any> = {
    youtube: null,
    instagram: null,
    facebook: null,
    tiktok: null,
    linkedin: null,
  };

  for (const plat of VALID_PLATFORMS) {
    const platVariants = variantsWithAssets.filter(
      (v) => (v.platform || "youtube") === plat,
    );
    const savedId = project.activeVariantIds?.[plat]?.toString();
    if (savedId) {
      result[plat] =
        platVariants.find((v) => v._id.toString() === savedId) ||
        platVariants[0] ||
        null;
    } else if (plat === "youtube" && project.activeVariantId) {
      result[plat] =
        platVariants.find(
          (v) => v._id.toString() === project.activeVariantId?.toString(),
        ) ||
        platVariants[0] ||
        null;
    } else {
      result[plat] = platVariants[0] || null;
    }
  }

  return result;
}

export async function createProject(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const validated = createProjectSchema.parse(req.body || {});
    const project = await Project.create({
      title: validated.title,
    });

    res.status(201).json({
      success: true,
      data: project,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProject(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: "NOT_FOUND", message: "Project not found" },
      });
      return;
    }

    const variants = await Variant.find({ projectId: project._id }).sort({
      createdAt: 1,
    });
    const assetIds = variants.map((v) => v.assetId).filter(Boolean);
    const assets = await Asset.find({ _id: { $in: assetIds } });
    const assetMap = new Map(assets.map((a) => [a._id.toString(), a]));

    const variantsWithAssets = variants.map((v) => ({
      ...v.toObject(),
      platform: v.platform || "youtube",
      asset: assetMap.get(v.assetId?.toString()) || null,
    }));

    const activeVariantsByPlatform = buildActiveVariantsByPlatform(
      project,
      variantsWithAssets,
    );

    const activeVariant = activeVariantsByPlatform.youtube;

    res.json({
      success: true,
      data: {
        ...project.toObject(),
        variants: variantsWithAssets,
        activeVariant,
        activeVariantsByPlatform,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProject(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const validated = updateProjectSchema.parse(req.body);
    const { platform, activeVariantId, ...rest } = validated;

    const updateDoc: Record<string, any> = { ...rest };
    if (activeVariantId && mongoose.Types.ObjectId.isValid(activeVariantId)) {
      const targetPlatform = resolvePlatform(platform);
      updateDoc[`activeVariantIds.${targetPlatform}`] = activeVariantId;
      if (targetPlatform === "youtube") {
        updateDoc.activeVariantId = activeVariantId;
      }
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { $set: updateDoc },
      { new: true, runValidators: true },
    );

    if (!project) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: "NOT_FOUND", message: "Project not found" },
      });
      return;
    }

    res.json({
      success: true,
      data: project,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: "NOT_FOUND", message: "Project not found" },
      });
      return;
    }

    await Variant.deleteMany({ projectId: id });
    await Asset.deleteMany({ projectId: id });
    await ShareLink.deleteMany({ projectId: id });
    await Comment.deleteMany({ projectId: id });

    res.json({
      success: true,
      data: { id, deleted: true },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function listProjects(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const projects = await Project.find().sort({ updatedAt: -1 }).limit(20);
    res.json({
      success: true,
      data: projects,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadChannelAsset(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'banner' | 'logo' | 'shortFrame' | 'thumbnail'
    const platform = resolvePlatform(req.body.platform);

    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: "NOT_FOUND", message: "Project not found" },
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: "FILE_REQUIRED", message: "No image file uploaded" },
      });
      return;
    }

    const hostUrl = `${req.protocol}://${req.get("host")}`;
    const uploadResult = await uploadImageFile(
      req.file.path,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      hostUrl,
    );

    if (!project.platformAssets) {
      project.platformAssets = {};
    }
    if (!project.platformAssets[platform]) {
      project.platformAssets[platform] = {};
    }

    if (type === "banner") {
      project.platformAssets[platform]!.bannerUrl = uploadResult.secureUrl;
      if (platform === "youtube") {
        project.bannerUrl = uploadResult.secureUrl;
      }
      project.markModified("platformAssets");
    } else if (type === "logo") {
      project.platformAssets[platform]!.logoUrl = uploadResult.secureUrl;
      if (platform === "youtube") {
        project.logoUrl = uploadResult.secureUrl;
      }
      project.markModified("platformAssets");
    } else if (type === "shortFrame") {
      project.platformAssets[platform]!.shortFrameUrl = uploadResult.secureUrl;
      if (platform === "youtube") {
        project.shortFrameUrl = uploadResult.secureUrl;
      }
      project.markModified("platformAssets");
    } else if (type === "thumbnail") {
      const asset = await Asset.create({
        projectId: project._id,
        provider: uploadResult.provider,
        cloudinaryPublicId: uploadResult.publicId,
        secureUrl: uploadResult.secureUrl,
        width: uploadResult.width,
        height: uploadResult.height,
        mimeType: uploadResult.mimeType,
        bytes: uploadResult.bytes,
      });

      const variant = await Variant.create({
        projectId: project._id,
        platform,
        name:
          req.body.name?.trim() ||
          `Variant ${String.fromCharCode(65 + ((await Variant.countDocuments({ projectId: project._id, platform })) % 26))}`,
        assetId: asset._id,
        width: uploadResult.width,
        height: uploadResult.height,
      });

      asset.variantId = variant._id as mongoose.Types.ObjectId;
      await asset.save();

      if (!project.activeVariantIds) {
        project.activeVariantIds = {};
      }
      project.activeVariantIds[platform] = variant._id as mongoose.Types.ObjectId;
      project.markModified("activeVariantIds");

      if (platform === "youtube") {
        project.activeVariantId = variant._id as mongoose.Types.ObjectId;
      }
    }

    await project.save();

    const variants = await Variant.find({ projectId: project._id }).sort({
      createdAt: 1,
    });
    const assetIds = variants.map((v) => v.assetId).filter(Boolean);
    const assets = await Asset.find({ _id: { $in: assetIds } });
    const assetMap = new Map(assets.map((a) => [a._id.toString(), a]));

    const variantsWithAssets = variants.map((v) => ({
      ...v.toObject(),
      platform: v.platform || "youtube",
      asset: assetMap.get(v.assetId?.toString()) || null,
    }));

    const activeVariantsByPlatform = buildActiveVariantsByPlatform(
      project,
      variantsWithAssets,
    );

    const activeVariant = activeVariantsByPlatform[platform];

    res.json({
      success: true,
      data: {
        ...project.toObject(),
        variants: variantsWithAssets,
        activeVariant,
        activeVariantsByPlatform,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}
