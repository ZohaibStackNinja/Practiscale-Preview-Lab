import mongoose, { Schema, Document } from "mongoose";

export interface IAsset extends Document {
  projectId: mongoose.Types.ObjectId;
  variantId?: mongoose.Types.ObjectId;
  provider: "cloudinary" | "local";
  cloudinaryPublicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  mimeType?: string;
  bytes?: number;
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema: Schema = new Schema(
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
      index: true,
    },
    provider: {
      type: String,
      enum: ["cloudinary", "local"],
      default: "local",
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    secureUrl: {
      type: String,
      required: true,
    },
    width: { type: Number },
    height: { type: Number },
    mimeType: { type: String },
    bytes: { type: Number },
  },
  {
    timestamps: true,
  },
);

export const Asset = mongoose.model<IAsset>("Asset", AssetSchema);
