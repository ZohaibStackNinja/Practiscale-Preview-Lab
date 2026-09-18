import mongoose, { Schema, Document } from "mongoose";

export interface IVariant extends Document {
  projectId: mongoose.Types.ObjectId;
  name: string;
  assetId: mongoose.Types.ObjectId;
  notes?: string;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema: Schema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    assetId: {
      type: Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    width: { type: Number },
    height: { type: Number },
  },
  {
    timestamps: true,
  },
);

export const Variant = mongoose.model<IVariant>("Variant", VariantSchema);
