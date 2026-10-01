import mongoose, { Schema, Document } from "mongoose";

export type PlatformType =
  | "youtube"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "linkedin";

export interface IPlatformAssets {
  logoUrl?: string;
  bannerUrl?: string;
  shortFrameUrl?: string;
}

export interface IProject extends Document {
  title: string;
  ownerSessionId?: string;
  activeVariantId?: mongoose.Types.ObjectId;
  activeVariantIds?: Partial<Record<PlatformType, mongoose.Types.ObjectId>>;
  platformAssets?: Partial<Record<PlatformType, IPlatformAssets>>;
  status: "draft" | "active" | "archived";
  logoUrl?: string;
  bannerUrl?: string;
  shortFrameUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlatformAssetsSubSchema = new Schema(
  {
    logoUrl: { type: String },
    bannerUrl: { type: String },
    shortFrameUrl: { type: String },
  },
  { _id: false },
);

const ProjectSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      default: "Q4 Brand Launch",
    },
    ownerSessionId: {
      type: String,
      index: true,
    },
    activeVariantId: {
      type: Schema.Types.ObjectId,
      ref: "Variant",
    },
    activeVariantIds: {
      youtube: { type: Schema.Types.ObjectId, ref: "Variant" },
      instagram: { type: Schema.Types.ObjectId, ref: "Variant" },
      facebook: { type: Schema.Types.ObjectId, ref: "Variant" },
      tiktok: { type: Schema.Types.ObjectId, ref: "Variant" },
      linkedin: { type: Schema.Types.ObjectId, ref: "Variant" },
    },
    platformAssets: {
      youtube: { type: PlatformAssetsSubSchema, default: () => ({}) },
      instagram: { type: PlatformAssetsSubSchema, default: () => ({}) },
      facebook: { type: PlatformAssetsSubSchema, default: () => ({}) },
      tiktok: { type: PlatformAssetsSubSchema, default: () => ({}) },
      linkedin: { type: PlatformAssetsSubSchema, default: () => ({}) },
    },
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "active",
    },
    logoUrl: { type: String },
    bannerUrl: { type: String },
    shortFrameUrl: { type: String },
  },
  {
    timestamps: true,
  },
);

ProjectSchema.index({ updatedAt: -1 });

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
