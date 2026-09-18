import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { Project } from "../models/Project.js";
import { Variant } from "../models/Variant.js";
import { Asset } from "../models/Asset.js";
import { ShareLink } from "../models/ShareLink.js";
import { Comment } from "../models/Comment.js";
import { uploadImageFile } from "../config/cloudinary.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/index.js";

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

    // Fetch all variants with their assets
    const variants = await Variant.find({ projectId: project._id }).sort({
      createdAt: 1,
    });
    const assetIds = variants.map((v) => v.assetId).filter(Boolean);
    const assets = await Asset.find({ _id: { $in: assetIds } });
    const assetMap = new Map(assets.map((a) => [a._id.toString(), a]));

    const variantsWithAssets = variants.map((v) => ({
      ...v.toObject(),
      asset: assetMap.get(v.assetId?.toString()) || null,
    }));

    // Find active variant
    let activeVariant = null;
    if (project.activeVariantId) {
      activeVariant =
        variantsWithAssets.find(
          (v) => v._id.toString() === project.activeVariantId?.toString(),
        ) || null;
    }
    if (!activeVariant && variantsWithAssets.length > 0) {
      activeVariant = variantsWithAssets[0];
    }

    res.json({
      success: true,
      data: {
        ...project.toObject(),
        variants: variantsWithAssets,
        activeVariant,
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

    const project = await Project.findByIdAndUpdate(
      id,
      { $set: validated },
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

    // Cascade delete variants, assets, shares, comments
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

    if (type === "banner") {
      project.bannerUrl = uploadResult.secureUrl;
    } else if (type === "logo") {
      project.logoUrl = uploadResult.secureUrl;
    } else if (type === "shortFrame") {
      project.shortFrameUrl = uploadResult.secureUrl;
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
        name:
          req.body.name?.trim() ||
          req.file.originalname.replace(/\.[^/.]+$/, ""),
        assetId: asset._id,
        width: uploadResult.width,
        height: uploadResult.height,
      });

      asset.variantId = variant._id as mongoose.Types.ObjectId;
      await asset.save();
      project.activeVariantId = variant._id as mongoose.Types.ObjectId;
    }

    await project.save();

    // Populate and return full updated project
    const variants = await Variant.find({ projectId: project._id }).sort({
      createdAt: 1,
    });
    const assetIds = variants.map((v) => v.assetId).filter(Boolean);
    const assets = await Asset.find({ _id: { $in: assetIds } });
    const assetMap = new Map(assets.map((a) => [a._id.toString(), a]));

    const variantsWithAssets = variants.map((v) => ({
      ...v.toObject(),
      asset: assetMap.get(v.assetId?.toString()) || null,
    }));

    let activeVariant = null;
    if (project.activeVariantId) {
      activeVariant =
        variantsWithAssets.find(
          (v) => v._id.toString() === project.activeVariantId?.toString(),
        ) || null;
    }
    if (!activeVariant && variantsWithAssets.length > 0) {
      activeVariant = variantsWithAssets[0];
    }

    res.json({
      success: true,
      data: {
        ...project.toObject(),
        variants: variantsWithAssets,
        activeVariant,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}
