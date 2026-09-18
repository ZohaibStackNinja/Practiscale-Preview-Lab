import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Project } from "../models/Project.js";
import { Variant } from "../models/Variant.js";
import { Asset } from "../models/Asset.js";
import { uploadImageFile } from "../config/cloudinary.js";

export async function uploadVariant(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { projectId } = req.params;
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

    // Create Asset record in MongoDB
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

    // Create Variant record
    const variantName = req.body.name?.trim() || req.file.originalname;
    const variant = await Variant.create({
      projectId: project._id,
      name: variantName,
      assetId: asset._id,
      width: uploadResult.width,
      height: uploadResult.height,
    });

    // Link asset back to variant
    asset.variantId = variant._id as mongoose.Types.ObjectId;
    await asset.save();

    // If project has no active variant, set this one
    if (!project.activeVariantId) {
      project.activeVariantId = variant._id as mongoose.Types.ObjectId;
      await project.save();
    }

    res.status(201).json({
      success: true,
      data: {
        ...variant.toObject(),
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
    const variants = await Variant.find({ projectId }).sort({ createdAt: 1 });
    const assetIds = variants.map((v) => v.assetId).filter(Boolean);
    const assets = await Asset.find({ _id: { $in: assetIds } });
    const assetMap = new Map(assets.map((a) => [a._id.toString(), a]));

    const result = variants.map((v) => ({
      ...v.toObject(),
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
    const { id } = req.params;
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
    const { id } = req.params;
    const variant = await Variant.findById(id);
    if (!variant) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: "NOT_FOUND", message: "Variant not found" },
      });
      return;
    }

    await Asset.findByIdAndDelete(variant.assetId);
    await Variant.findByIdAndDelete(id);

    // If active variant in project, pick another if available
    const project = await Project.findById(variant.projectId);
    if (project && project.activeVariantId?.toString() === id) {
      const remaining = await Variant.findOne({ projectId: project._id });
      project.activeVariantId = remaining
        ? (remaining._id as mongoose.Types.ObjectId)
        : undefined;
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
