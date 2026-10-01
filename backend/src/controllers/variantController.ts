import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Project, PlatformType } from "../models/Project.js";
import { Variant } from "../models/Variant.js";
import { Asset } from "../models/Asset.js";
import { uploadImageFile } from "../config/cloudinary.js";

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

export async function uploadVariant(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { projectId } = req.params;
    const platform = resolvePlatform(req.body.platform);

    const project = await Project.findById(projectId);
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

    const existingCount = await Variant.countDocuments({ projectId: project._id, platform });
    const fallbackVariantLabel = `Variant ${String.fromCharCode(65 + (existingCount % 26))}`;
    const rawProvidedName = req.body.name?.trim();
    const variantName = rawProvidedName || fallbackVariantLabel;
    const slotNotes = req.body.slotId ? `slot:${req.body.slotId}` : req.body.notes;
    const variant = await Variant.create({
      projectId: project._id,
      platform,
      name: variantName,
      assetId: asset._id,
      notes: slotNotes,
      width: uploadResult.width,
      height: uploadResult.height,
    });

    asset.variantId = variant._id as mongoose.Types.ObjectId;
    await asset.save();

    if (!project.activeVariantIds) {
      project.activeVariantIds = {};
    }
    const isExplicitlyInactive = req.body.setAsActive === "false";
    const shouldSetActive = !isExplicitlyInactive && (!project.activeVariantIds[platform] || req.body.setAsActive === "true");
    if (shouldSetActive || !project.activeVariantIds[platform]) {
      project.activeVariantIds[platform] = variant._id as mongoose.Types.ObjectId;
      project.markModified("activeVariantIds");
    }

    if (platform === "youtube" && (!project.activeVariantId || (shouldSetActive && !isExplicitlyInactive))) {
      project.activeVariantId = variant._id as mongoose.Types.ObjectId;
    }
    await project.save();

    res.status(201).json({
      success: true,
      data: {
        ...variant.toObject(),
        platform,
        asset: asset.toObject(),
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function listVariants(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { projectId } = req.params;
    const platformFilter = req.query.platform as string | undefined;
    const query: Record<string, any> = { projectId };
    if (platformFilter && VALID_PLATFORMS.includes(platformFilter as PlatformType)) {
      query.platform = platformFilter;
    }

    const variants = await Variant.find(query).sort({ createdAt: 1 });
    const assetIds = variants.map((v) => v.assetId).filter(Boolean);
    const assets = await Asset.find({ _id: { $in: assetIds } });
    const assetMap = new Map(assets.map((a) => [a._id.toString(), a]));

    const result = variants.map((v) => ({
      ...v.toObject(),
      platform: v.platform || "youtube",
      asset: assetMap.get(v.assetId?.toString()) || null,
    }));

    res.json({
      success: true,
      data: result,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateVariant(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: "INVALID_ID", message: "Invalid variant ID format" },
      });
      return;
    }
    const { name, notes } = req.body;

    const variant = await Variant.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(name ? { name: name.trim() } : {}),
          ...(notes !== undefined ? { notes: notes.trim() } : {}),
        },
      },
      { new: true },
    );

    if (!variant) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: "NOT_FOUND", message: "Variant not found" },
      });
      return;
    }

    const asset = await Asset.findById(variant.assetId);

    res.json({
      success: true,
      data: {
        ...variant.toObject(),
        asset: asset || null,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteVariant(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.json({
        success: true,
        data: { id, deleted: true },
        error: null,
      });
      return;
    }
    const variant = await Variant.findById(id);
    if (!variant) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: "NOT_FOUND", message: "Variant not found" },
      });
      return;
    }

    const variantPlatform: PlatformType = variant.platform || "youtube";
    await Asset.findByIdAndDelete(variant.assetId);
    await Variant.findByIdAndDelete(id);

    const project = await Project.findById(variant.projectId);
    if (project) {
      const remainingForPlatform = await Variant.findOne({
        projectId: project._id,
        platform: variantPlatform,
      });

      if (
        project.activeVariantIds?.[variantPlatform]?.toString() === id
      ) {
        project.activeVariantIds[variantPlatform] = remainingForPlatform
          ? (remainingForPlatform._id as mongoose.Types.ObjectId)
          : undefined;
        project.markModified("activeVariantIds");
      }

      if (project.activeVariantId?.toString() === id) {
        project.activeVariantId = remainingForPlatform
          ? (remainingForPlatform._id as mongoose.Types.ObjectId)
          : undefined;
      }
      await project.save();
    }

    res.json({
      success: true,
      data: { id, deleted: true },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}
