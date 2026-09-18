import { Request, Response, NextFunction } from "express";
import { Comment } from "../models/Comment.js";
import { ShareLink } from "../models/ShareLink.js";
import { Variant } from "../models/Variant.js";
import { createCommentSchema } from "../validators/index.js";
import { hashToken } from "./shareController.js";

export async function listComments(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = String(req.params.token || "");
    const tokenHash = hashToken(token);
    const share = await ShareLink.findOne({ tokenHash });

    if (!share || share.revokedAt || new Date() > new Date(share.expiresAt)) {
      res.status(404).json({
        success: false,
        data: null,
        error: {
          code: "SHARE_NOT_AVAILABLE",
          message: "Preview is not accessible",
        },
      });
      return;
    }

    const comments = await Comment.find({ shareId: share._id }).sort({
      createdAt: 1,
    });

    res.json({
      success: true,
      data: comments,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function createComment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = String(req.params.token || "");
    const tokenHash = hashToken(token);
    const share = await ShareLink.findOne({ tokenHash });

    if (!share) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: "SHARE_NOT_FOUND", message: "Preview link not found" },
      });
      return;
    }

    if (share.revokedAt) {
      res.status(410).json({
        success: false,
        data: null,
        error: {
          code: "SHARE_REVOKED",
          message: "This preview link is no longer available",
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
          message: "This preview link has expired",
        },
      });
      return;
    }

    const validated = createCommentSchema.parse(req.body);
    const variant = share.variantId
      ? await Variant.findById(share.variantId).select("name")
      : null;

    const comment = await Comment.create({
      shareId: share._id,
      projectId: share.projectId,
      displayName: validated.displayName?.trim() || "Guest Reviewer",
      body: validated.body.trim(),
      device: validated.device || share.device || "desktop",
      platform: validated.platform || share.platform || "youtube",
      variantId: share.variantId,
      variantName: validated.variantName || variant?.name || "Active Creative",
      viewMode: validated.viewMode || "home",
    });

    res.status(201).json({
      success: true,
      data: comment,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

// List all comments across a project (for workspace reviews view)
export async function listProjectComments(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { projectId } = req.params;
    const comments = await Comment.find({ projectId })
      .populate("shareId", "platform device variantId context")
      .sort({ createdAt: -1 });

    const formatted = await Promise.all(
      comments.map(async (c: any) => {
        let variantName = c.variantName;
        if (!variantName && c.shareId?.variantId) {
          const variant = await Variant.findById(c.shareId.variantId).select(
            "name",
          );
          variantName = variant?.name;
        }

        return {
          _id: c._id,
          shareId: c.shareId?._id || c.shareId,
          projectId: c.projectId,
          displayName: c.displayName,
          body: c.body,
          device: c.device || c.shareId?.device || "desktop",
          platform: c.platform || c.shareId?.platform || "youtube",
          variantName: variantName || "Active Creative",
          viewMode: c.viewMode || "home",
          createdAt: c.createdAt,
        };
      }),
    );

    res.json({
      success: true,
      data: formatted,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}
