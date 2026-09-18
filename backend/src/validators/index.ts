import { z } from "zod";

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title cannot exceed 120 characters")
    .default("Q4 Brand Launch"),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  activeVariantId: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]).optional(),
  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  shortFrameUrl: z.string().optional(),
});

export const createShareSchema = z.object({
  variantId: z.string().min(1, "variantId is required"),
  platform: z
    .enum(["youtube", "instagram", "facebook", "tiktok", "linkedin"])
    .default("youtube"),
  device: z.enum(["desktop", "mobile"]).default("desktop"),
  context: z.string().optional().default("preview"),
  durationHours: z.number().positive().max(720).default(24), // default 24h (1 day), max 30 days
});

export const createCommentSchema = z.object({
  displayName: z.string().max(60).optional().default("Guest Reviewer"),
  body: z
    .string()
    .min(1, "Comment text is required")
    .max(2000, "Comment cannot exceed 2000 characters"),
  device: z.enum(["desktop", "mobile"]).optional(),
  platform: z.string().optional(),
  variantId: z.string().optional(),
  variantName: z.string().optional(),
  viewMode: z.string().optional(),
});
