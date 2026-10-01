"use client";

import React, { useState } from "react";
import { X, Upload, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { Platform, Variant } from "@/lib/types";

interface AddVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  platform?: Platform;
  onVariantAdded: (newVariant: Variant) => void;
}

const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
};

export const AddVariantModal: React.FC<AddVariantModalProps> = ({
  isOpen,
  onClose,
  projectId,
  platform = "youtube",
  onVariantAdded,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [variantName, setVariantName] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const platformLabel = PLATFORM_LABELS[platform] || "YouTube";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      // Never auto-populate variantName with raw image file.name!
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image file");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const created = await api.uploadVariant(
        projectId,
        file,
        variantName.trim() || undefined,
        platform,
      );
      onVariantAdded({ ...created, platform });
      setFile(null);
      setVariantName("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to upload variant");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-3xl border border-gray-200 w-full max-w-md p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#00A67E]/10 text-[#008B68] mb-1.5">
            {platformLabel} Only
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Add {platformLabel} Variant
          </h2>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Upload an image option specifically for{" "}
            <span className="font-bold text-gray-700">{platformLabel}</span>. It
            will not change or overwrite your other platforms.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">
              Variant Label{" "}
              <span className="text-gray-400 font-normal">
                (Optional — defaults to Variant B, C, etc.)
              </span>
            </label>
            <input
              type="text"
              placeholder={`e.g. ${platformLabel} Option B — High Contrast`}
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#00A67E] focus:ring-1 focus:ring-[#00A67E] transition shadow-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">
              Choose Image (PNG, JPG, WebP)
            </label>
            <label className="border-2 border-dashed border-gray-200 hover:border-[#00A67E] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-gray-50/50 hover:bg-[#00A67E]/5 group shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-gray-200 flex items-center justify-center mb-2.5 group-hover:scale-105 transition text-gray-500 group-hover:text-[#008B68]">
                {file ? (
                  <CheckCircle2 className="w-6 h-6 text-[#00A67E] stroke-[2.2]" />
                ) : (
                  <Upload className="w-6 h-6 stroke-[2.2]" />
                )}
              </div>
              <span className="text-xs font-bold text-gray-800">
                {file ? "Creative Image Selected & Ready" : "Click to browse files"}
              </span>
              <span className="text-[11px] text-gray-400 mt-0.5">
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB · Ready to preview`
                  : "Supports PNG, JPG, WebP up to 10MB"}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl">
            {error}
          </p>
        )}

        <div className="flex justify-end space-x-2.5 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 rounded-xl transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="px-5 py-2 bg-[#00A67E] hover:bg-[#008B68] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-95"
          >
            {uploading ? "Uploading..." : `Add to ${platformLabel}`}
          </button>
        </div>
      </div>
    </div>
  );
};
