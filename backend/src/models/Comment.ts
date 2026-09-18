import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  shareId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  displayName: string;
  body: string;
  device?: "desktop" | "mobile";
  platform?: string;
  variantId?: mongoose.Types.ObjectId;
  variantName?: string;
  viewMode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    shareId: {
      type: Schema.Types.ObjectId,
      ref: "ShareLink",
      required: true,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 60,
      default: "Guest Reviewer",
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    device: {
      type: String,
      enum: ["desktop", "mobile"],
      default: "desktop",
    },
    platform: {
      type: String,
      default: "youtube",
    },
    variantId: {
      type: Schema.Types.ObjectId,
      ref: "Variant",
    },
    variantName: {
      type: String,
    },
    viewMode: {
      type: String,
      default: "home",
    },
  },
  {
    timestamps: true,
  },
);

CommentSchema.index({ shareId: 1, createdAt: 1 });
CommentSchema.index({ projectId: 1, createdAt: -1 });

export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
