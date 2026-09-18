import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { ShareLink } from "../models/ShareLink.js";
import { Project } from "../models/Project.js";
import { Variant } from "../models/Variant.js";
import { Asset } from "../models/Asset.js";
import { Comment } from "../models/Comment.js";
import { createShareSchema } from "../validators/index.js";
import { ENV } from "../config/env.js";

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createShare(
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

    const validated = createShareSchema.parse(req.body);
    const variant = await Variant.findById(validated.variantId);
    if (!variant || variant.projectId.toString() !== projectId) {
      res.status(400).json({
        success: false,
        data: null,
        error: {
          code: "INVALID_VARIANT",
          message: "Selected variant does not belong to project",
        },
      });
      return;
    }

    // Generate high-entropy opaque token
    const rawToken = crypto.randomBytes(16).toString("hex");
    const tokenHash = hashToken(rawToken);

    const durationHours = validated.durationHours || 24; // default 24h
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

    const share = await ShareLink.create({
      projectId: project._id,
      variantId: variant._id,
      platform: validated.platform,
      device: validated.device,
      context: validated.context || "preview",
      tokenHash,
      rawToken,
      durationHours,
      expiresAt,
    });

    const shareUrl = `${ENV.FRONTEND_URL}/share/${rawToken}`;

    res.status(201).json({
      success: true,
      data: {
        id: share._id,
        rawToken,
        shareUrl,
        expiresAt: share.expiresAt,
        durationHours: share.durationHours,
        platform: share.platform,
        device: share.device,
        createdAt: share.createdAt,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function getShareByToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = String(req.params.token || "");
    if (!token) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: "TOKEN_REQUIRED", message: "Token is required" },
      });
      return;
    }

    const tokenHash = hashToken(token);
    const share = await ShareLink.findOne({ tokenHash });

    if (!share) {
      res.status(404).json({
        success: false,
        data: null,
        error: {
          code: "SHARE_NOT_FOUND",
          message: "This preview link could not be found.",
        },
      });
      return;
    }

    if (share.revokedAt) {
      res.status(410).json({
        success: false,
        data: null,
        error: {
          code: "SHARE_REVOKED",
          message: "This preview link is no longer available.",
        },
      });
      return;
    }

    if (new Date() > new Date(share.expiresAt)) {
      res.status(410).json({
        success: false,
        data: null,
        error: {
          code: "SHARE_EXPIRED",
          message: "This preview link has expired.",
        },
      });
      return;
    }

    // Load preview snapshot
    const project = await Project.findById(share.projectId).select(
      "title status logoUrl bannerUrl shortFrameUrl",
    );
    const variant = await Variant.findById(share.variantId);
    const asset = variant ? await Asset.findById(variant.assetId) : null;
    const comments = await Comment.find({ shareId: share._id }).sort({
      createdAt: 1,
    });

    res.json({
      success: true,
      data: {
        shareId: share._id,
        projectTitle: project?.title || "Preview Project",
        logoUrl: project?.logoUrl,
        bannerUrl: project?.bannerUrl,
        shortFrameUrl: project?.shortFrameUrl,
        variant: variant
          ? {
              id: variant._id,
              name: variant.name,
              width: variant.width,
              height: variant.height,
              notes: variant.notes,
              asset: asset
                ? {
                    secureUrl: asset.secureUrl,
                    width: asset.width,
                    height: asset.height,
                    mimeType: asset.mimeType,
                  }
                : null,
            }
          : null,
        platform: share.platform,
        device: share.device,
        context: share.context,
        expiresAt: share.expiresAt,
        comments,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function revokeShare(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const share = await ShareLink.findById(id);
    if (!share) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: "NOT_FOUND", message: "Share link not found" },
      });
      return;
    }

    share.revokedAt = new Date();
    await share.save();

    res.json({
      success: true,
      data: { id, revoked: true, revokedAt: share.revokedAt },
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProjectShares(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { projectId } = req.params;
    const shares = await ShareLink.find({ projectId }).sort({ createdAt: -1 });

    const results = shares.map((s) => ({
      id: s._id,
      rawToken: s.rawToken,
      shareUrl: `${ENV.FRONTEND_URL}/share/${s.rawToken}`,
      platform: s.platform,
      device: s.device,
      durationHours: s.durationHours,
      expiresAt: s.expiresAt,
      revokedAt: s.revokedAt,
      isExpired: new Date() > new Date(s.expiresAt),
      isRevoked: Boolean(s.revokedAt),
      createdAt: s.createdAt,
    }));

    res.json({
      success: true,
      data: results,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}
