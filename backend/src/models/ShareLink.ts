import mongoose, { Schema, Document } from "mongoose";

export interface IShareLink extends Document {
  projectId: mongoose.Types.ObjectId;
  variantId: mongoose.Types.ObjectId;
  platform: "youtube" | "instagram" | "facebook" | "tiktok" | "linkedin";
  device: "desktop" | "mobile";
  context?: string;
  tokenHash: string;
  rawToken: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  durationHours: number;
  createdAt: Date;
  updatedAt: Date;
}

const ShareLinkSchema: Schema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    variantId: {
      type: Schema.Types.ObjectId,
      ref: "Variant",
      required: true,
    },
    platform: {
      type: String,
      enum: ["youtube", "instagram", "facebook", "tiktok", "linkedin"],
      default: "youtube",
    },
    device: {
      type: String,
      enum: ["desktop", "mobile"],
      default: "desktop",
    },
    context: {
      type: String,
      default: "preview",
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    rawToken: {
      type: String,
      required: true,
    },
    durationHours: {
      type: Number,
      default: 24,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// TTL index to automatically clean up documents long after expiry (optional helper)
ShareLinkSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 7 },
);

export const ShareLink = mongoose.model<IShareLink>(
  "ShareLink",
  ShareLinkSchema,
);
