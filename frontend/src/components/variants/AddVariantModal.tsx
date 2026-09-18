"use client";

import React, { useState } from "react";
import { X, Upload, Check } from "lucide-react";
import { api } from "@/lib/api";
import { Variant } from "@/lib/types";

interface AddVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onVariantAdded: (newVariant: Variant) => void;
}

export const AddVariantModal: React.FC<AddVariantModalProps> = ({
  isOpen,
  onClose,
  projectId,
  onVariantAdded,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [variantName, setVariantName] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!variantName) {
        setVariantName(selected.name.replace(/\.[^/.]+$/, ""));
      }
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
      const created = await api.uploadVariant(projectId, file, variantName);
      onVariantAdded(created);
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
          <h2 className="text-xl font-extrabold text-gray-900">
            Add Creative Variant
          </h2>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Upload another image option to compare in this project.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">
              Variant Name
            </label>
            <input
              type="text"
              placeholder="e.g. High Contrast Variant B"
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#0ABAB5] focus:ring-1 focus:ring-[#0ABAB5] transition shadow-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">
              Choose Image (PNG, JPG, WebP)
            </label>
            <label className="border-2 border-dashed border-gray-200 hover:border-[#0ABAB5] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-gray-50/50 hover:bg-[#0ABAB5]/5 group shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-gray-200 flex items-center justify-center mb-2.5 group-hover:scale-105 transition text-gray-500 group-hover:text-[#089793]">
                <Upload className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-gray-800">
                {file ? file.name : "Click to browse files"}
              </span>
              <span className="text-[11px] text-gray-400 mt-0.5">
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
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
            className="px-5 py-2 bg-gradient-to-r from-[#0ABAB5] to-[#089793] hover:from-[#099E9A] hover:to-[#078581] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-95"
          >
            {uploading ? "Uploading..." : "Add Variant"}
          </button>
        </div>
      </div>
    </div>
  );
};
