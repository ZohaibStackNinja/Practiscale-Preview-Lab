import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  ownerSessionId?: string;
  activeVariantId?: mongoose.Types.ObjectId;
  status: "draft" | "active" | "archived";
  logoUrl?: string;
  bannerUrl?: string;
  shortFrameUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

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
