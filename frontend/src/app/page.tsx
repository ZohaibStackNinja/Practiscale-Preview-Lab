"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/shell/TopNav";
import { Platform } from "@/lib/types";
import { api } from "@/lib/api";
import { CloudUpload, Sparkles, ArrowRight, Loader2 } from "lucide-react";

import { PLATFORM_CONFIG } from "@/components/common/PlatformIcons";

const PLATFORM_LIST: Platform[] = [
  "youtube",
  "instagram",
  "facebook",
  "tiktok",
  "linkedin",
];

export default function StartUploadPage() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("youtube");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("Q4 Brand Launch");
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (selected: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(selected.type)) {
      setError("Please upload a valid PNG, JPG, or WebP image.");
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }
    setError(null);
    setFile(selected);
  };

  // Upload and Navigate to Project Platform Simulator
  const handleProceed = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      // 1. Create Project
      const project = await api.createProject(projectName);

      // 2. Upload image as first variant
      const variantName = file.name.replace(/\.[^/.]+$/, "");
      await api.uploadVariant(project._id, file, variantName);

      // 3. Route to canonical platform preview
      router.push(`/project/${project._id}/${selectedPlatform}`);
    } catch (err: any) {
      setError(err.message || "Failed to upload creative and create project");
      setLoading(false);
    }
  };

  // Try Sample Button (instant demo mode)
  const handleTrySample = async () => {
    setLoading(true);
    setError(null);
    try {
      const sample = await api.seedSample();
      router.push(`/project/${sample.project._id}/${selectedPlatform}`);
    } catch (err: any) {
      setError(err.message || "Failed to seed sample project");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col select-none">
      {/* Top Nav matching Figma Node 72:497 */}
      <TopNav
        projectName={projectName}
        onRenameProject={(newName) => setProjectName(newName)}
      />

      {/* Main Stage Container (Figma Node 72:518) */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-16 max-w-5xl mx-auto w-full">
        {/* Heading Block (Figma Node 72:519) */}
        <div className="text-center max-w-[800px] space-y-4 mb-8">
          {/* Feature Badge */}
          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-brand-primary-soft text-brand-primary-dark text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            <span>NEW: THUMBNAIL TESTER</span>
          </div>

          {/* H1 Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-[42px] font-black text-brand-text-primary tracking-tight leading-tight">
            Test Your Thumbnail Across Every Platform
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-brand-gray leading-relaxed max-w-2xl mx-auto">
            See how your creative looks across YouTube, Instagram, Facebook,
            TikTok, and LinkedIn — before you post. Ensure visibility,
            readability, and context in real feeds.
          </p>
        </div>

        {/* Upload Box (Figma Node 72:524) */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full max-w-[640px] bg-brand-white rounded-2xl p-8 md:p-10 border-2 border-dashed transition-all duration-200 text-center shadow-card relative ${
            isDragging
              ? "border-brand-primary bg-brand-primary-soft/30 scale-[1.01]"
              : file
                ? "border-brand-primary bg-brand-primary-soft/10"
                : "border-brand-primary/60 hover:border-brand-primary"
          }`}
        >
          {/* Upload Icon Frame */}
          <div className="w-16 h-16 rounded-full bg-brand-primary-soft flex items-center justify-center mx-auto mb-5 text-brand-primary shadow-xs">
            <CloudUpload className="w-8 h-8" />
          </div>

          {/* Drag & Drop Copy */}
          <div className="space-y-1.5 mb-4">
            <h3 className="text-base md:text-lg font-bold text-brand-text-primary">
              {file ? file.name : "Drag & drop your thumbnail image here"}
            </h3>
            <p className="text-xs md:text-sm text-brand-gray">
              or{" "}
              <label className="text-brand-primary font-bold hover:underline cursor-pointer">
                browse files
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>{" "}
              to upload
            </p>
          </div>

          {/* Format Note */}
          <p className="text-[11px] text-brand-muted">
            Supports PNG, JPG, WebP · max 10MB (recommended ratio 16:9 or 1:1)
          </p>

          {/* Secondary Quick Action: Try Sample */}
          <div className="mt-5 pt-4 border-t border-brand-border/70 flex items-center justify-center">
            <button
              type="button"
              onClick={handleTrySample}
              disabled={loading}
              className="text-xs font-bold text-brand-primary hover:text-brand-primary-dark flex items-center space-x-1.5 transition py-1 px-3 rounded-lg hover:bg-brand-primary-soft"
            >
              <span>Or try with our sample thumbnail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 max-w-[640px] w-full bg-brand-danger-soft/40 border border-brand-danger/30 text-brand-danger text-xs font-semibold p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Platform Picker Block (Figma Node 72:531) */}
        <div className="mt-8 text-center space-y-3 w-full max-w-[640px]">
          <span className="text-[12px] font-extrabold uppercase tracking-wider text-brand-gray">
            SELECT PRE-SELECTED PLATFORM FOR INITIAL RESULT:
          </span>

          {/* Platform Pills Row (Figma Node 72:533) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            {PLATFORM_LIST.map((platformId) => {
              const config = PLATFORM_CONFIG[platformId];
              const Icon = config.Icon;
              const isSelected = selectedPlatform === platformId;
              return (
                <button
                  key={platformId}
                  type="button"
                  onClick={() => setSelectedPlatform(platformId)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand-primary text-white shadow-sm ring-2 ring-brand-primary/20"
                      : "bg-white border border-brand-border text-gray-700 hover:text-gray-900 hover:border-gray-300 shadow-2xs"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? "text-white scale-105" : config.brandColor
                    }`}
                  />
                  <span>{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Dominant CTA (Figma Node 72:549) */}
        <div className="mt-8">
          <button
            type="button"
            onClick={file ? handleProceed : handleTrySample}
            disabled={loading}
            className="w-72 py-3.5 px-6 rounded-xl bg-brand-primary hover:bg-brand-primary-dark disabled:opacity-60 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Preparing Preview...</span>
              </>
            ) : (
              <span>{file ? "Test My Thumbnail" : "Test With Sample"}</span>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
