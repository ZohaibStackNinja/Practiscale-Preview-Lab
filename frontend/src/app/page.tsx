"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/shell/TopNav";
import {
  Upload,
  Sparkles,
  CheckCircle2,
  Loader2,
  ArrowUpRight,
  Play,
  Layers,
  Share2,
  BarChart3,
  Type,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  api,
  saveLocalPlatformState,
  DEFAULT_PLATFORM_DUMMY_COPY,
} from "@/lib/api";
import { Platform } from "@/lib/types";
import { PLATFORM_CONFIG } from "@/components/common/PlatformIcons";

const SUPPORTED_PLATFORMS: Platform[] = [
  "youtube",
  "instagram",
  "facebook",
  "tiktok",
  "linkedin",
];

const PLATFORM_RECOMMENDED_SIZE: Record<Platform, string> = {
  youtube: "1280 × 720 (16:9)",
  instagram: "1080 × 1080 (1:1) or 4:5",
  facebook: "1200 × 630 (1.91:1)",
  tiktok: "1080 × 1920 (9:16)",
  linkedin: "1200 × 627 (1.91:1)",
};

export default function UploadScreen() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("youtube");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Optional custom title & channel/brand name (defaults to clean dummy text)
  const [showCustomOptions, setShowCustomOptions] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customChannelName, setCustomChannelName] = useState("");
  const [customVariantName, setCustomVariantName] = useState("");

  const currentPlatformConfig = PLATFORM_CONFIG[selectedPlatform];
  const dummyDefaults = DEFAULT_PLATFORM_DUMMY_COPY[selectedPlatform];

  const handleFileProcess = async (file: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Unsupported file format. Please upload PNG, JPG, or WebP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds 10MB limit. Please choose a smaller file.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Never use raw file.name! Use user's custom brand/project name or clean dummy default
      const projectTitle = customChannelName.trim() || "Q4 Brand Launch";
      const variantLabel = customVariantName.trim() || "Variant A";

      const project = await api.createProject(projectTitle);
      const variant = await api.uploadVariant(
        project._id,
        file,
        variantLabel,
        selectedPlatform,
      );

      saveLocalPlatformState(project._id, (prev) => ({
        ...prev,
        variantPlatforms: {
          ...prev.variantPlatforms,
          [variant._id]: selectedPlatform,
        },
        activeVariantsByPlatform: {
          ...prev.activeVariantsByPlatform,
          [selectedPlatform]: variant._id,
        },
        customCopy: {
          ...(prev.customCopy || {}),
          [selectedPlatform]: {
            title: customTitle.trim() || undefined,
            channelName: customChannelName.trim() || undefined,
          },
        },
      }));
      router.push(`/project/${project._id}/${selectedPlatform}`);
    } catch (err: any) {
      setError(
        err.message || "Failed to initialize workspace. Please try again.",
      );
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSampleAsset = async () => {
    setLoadingSample(true);
    setError(null);
    try {
      const { project } = await api.seedSample(selectedPlatform);
      router.push(`/project/${project._id}/${selectedPlatform}`);
    } catch (err: any) {
      setError(err.message || "Failed to load sample asset.");
      setLoadingSample(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col theme-canvas-bg select-none">
      <TopNav isUploadScreen={true} />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-16">
        <div className="max-w-4xl w-full flex flex-col items-center text-center">
          {/* Announcement Pill Badge matching reference */}
          <div className="inline-flex items-center p-1 pr-3.5 rounded-full bg-white border border-slate-200/90 shadow-2xs mb-8 space-x-2.5">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#00A67E] text-white text-[11px] font-bold tracking-wide">
              <Sparkles className="w-3 h-3" />
              <span>New</span>
            </span>
            <span className="text-xs font-medium text-slate-600">
              v1.1 is here — Multi-platform feed simulator &amp; live pixel scoring
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Editorial Mixed-Typography Hero Title */}
          <h1 className="text-4xl sm:text-6xl md:text-[68px] font-extrabold text-slate-900 tracking-[-0.03em] leading-[1.06] max-w-3xl">
            Craft &amp; test stunning{" "}
            <span className="font-serif italic font-normal text-[#009673] tracking-normal px-1">
              Thumbnails
            </span>{" "}
            in seconds
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-[17px] text-slate-600 mt-5 max-w-2xl leading-relaxed font-normal">
            Drop your creative below to preview it inside real YouTube, Instagram,
            TikTok, Facebook, and LinkedIn feeds. Test safe zones, contrast, and
            client feedback before publishing.
          </p>

          {/* Primary & Secondary Hero Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || loadingSample}
              className="px-6 py-3.5 rounded-xl bg-[#00A67E] hover:bg-[#008B68] text-white font-bold text-sm inline-flex items-center space-x-2 shadow-cta transition-all active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <span>Upload Creative</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={handleSampleAsset}
              disabled={uploading || loadingSample}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200/90 shadow-xs inline-flex items-center space-x-2 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
            >
              {loadingSample ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#00A67E]" />
                  <span>Loading Sample...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-slate-800 text-slate-800" />
                  <span>Try Sample Workspace</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Simulator Upload Card */}
          <div
            id="simulator-upload"
            className="w-full max-w-2xl mt-10 bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-7 text-left"
          >
            {/* Step 1: Target Platform Selector */}
            <div className="space-y-2.5 mb-5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  1. Select Target Platform Environment
                </p>
                <span className="text-[11px] font-semibold text-[#008B68] bg-[#E6F7F3] px-2.5 py-0.5 rounded-full">
                  {currentPlatformConfig.label} Feed
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {SUPPORTED_PLATFORMS.map((plat) => {
                  const cfg = PLATFORM_CONFIG[plat];
                  const Icon = cfg.Icon;
                  const isSelected = selectedPlatform === plat;
                  return (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setSelectedPlatform(plat)}
                      className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#00A67E] bg-[#E6F7F3]/70 text-slate-900 shadow-2xs ring-1 ring-[#00A67E]/30"
                          : "border-slate-200/80 bg-slate-50/60 text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:bg-white"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isSelected ? "scale-110" : ""
                        } ${cfg.brandColor}`}
                      />
                      <span>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2 (Optional): Custom Title & Channel Name or Dummy Default */}
            <div className="mb-4">
              <div className="flex items-center justify-between bg-slate-50/90 border border-slate-200/80 rounded-xl px-3.5 py-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <Type className="w-3.5 h-3.5 text-[#00A67E] shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 truncate">
                    {customTitle.trim() || customChannelName.trim()
                      ? `Custom: "${customTitle.trim() || dummyDefaults.title}"`
                      : "Using realistic dummy title & channel name by default"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCustomOptions((prev) => !prev)}
                  className="text-xs font-bold text-[#008B68] hover:text-[#00A67E] flex items-center space-x-1 shrink-0 ml-2 cursor-pointer"
                >
                  <span>{showCustomOptions ? "Hide Options" : "+ Add Custom Title"}</span>
                  {showCustomOptions ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {showCustomOptions && (
                <div className="mt-2.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Video / Post Title{" "}
                        <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder={dummyDefaults.title}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-[#00A67E] focus:ring-1 focus:ring-[#00A67E] text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Channel / Brand Name{" "}
                        <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={customChannelName}
                        onChange={(e) => setCustomChannelName(e.target.value)}
                        placeholder={dummyDefaults.channelName}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-[#00A67E] focus:ring-1 focus:ring-[#00A67E] text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Variant Label{" "}
                      <span className="text-slate-400 font-normal">
                        (Defaults to &ldquo;Variant A&rdquo; — never uses image filename)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={customVariantName}
                      onChange={(e) => setCustomVariantName(e.target.value)}
                      placeholder="Variant A"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-[#00A67E] focus:ring-1 focus:ring-[#00A67E] text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Drag & Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-7 sm:p-9 transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
                dragging
                  ? "border-[#00A67E] bg-[#E6F7F3]/50 scale-[1.005]"
                  : "border-slate-200/90 bg-[#F8FAFB] hover:border-[#00A67E]/60 hover:bg-[#E6F7F3]/20"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) =>
                  e.target.files?.[0] && handleFileProcess(e.target.files[0])
                }
                className="hidden"
              />

              <div className="w-12 h-12 rounded-2xl bg-[#E6F7F3] text-[#00A67E] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform shadow-2xs border border-[#00A67E]/15">
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6 stroke-[2.2]" />
                )}
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {uploading
                  ? `Creating ${currentPlatformConfig.label} Workspace...`
                  : `Drop your ${currentPlatformConfig.label} creative here, or click to browse`}
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Recommended:{" "}
                <span className="font-semibold text-slate-700">
                  {PLATFORM_RECOMMENDED_SIZE[selectedPlatform]}
                </span>
              </p>

              {/* Supported Format Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {["PNG", "JPG", "WEBP", "Max 10MB"].map((badge) => (
                  <span
                    key={badge}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200/80 shadow-2xs"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}
          </div>

          {/* Bottom Statistics Bar with Vertical Dividers matching Reference Image */}
          <div
            id="metrics"
            className="w-full max-w-2xl mt-12 pt-4 grid grid-cols-3 divide-x divide-slate-200/90"
          >
            <div className="px-3 sm:px-6 flex flex-col items-center text-center">
              <span className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                5
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1">
                Social Platforms
              </span>
            </div>

            <div className="px-3 sm:px-6 flex flex-col items-center text-center">
              <span className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                100%
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1">
                True-to-Spec Feeds
              </span>
            </div>

            <div className="px-3 sm:px-6 flex flex-col items-center text-center">
              <span className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                &lt; 2s
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1">
                Pixel Insight Analysis
              </span>
            </div>
          </div>

          {/* Compact Feature Strip */}
          <div
            id="features"
            className="w-full max-w-4xl mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left"
          >
            <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[#E6F7F3] text-[#00A67E] flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                A/B Creative Variants
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Upload multiple thumbnail options per platform and toggle
                between them in real time inside the feed.
              </p>
            </div>

            <div
              id="workflow"
              className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/80 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-lg bg-[#E6F7F3] text-[#00A67E] flex items-center justify-center mb-3">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Safe-Zone &amp; Contrast Scoring
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Automated pixel luminance, vibrancy, and timestamp-badge
                clearance checks for desktop and mobile.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[#E6F7F3] text-[#00A67E] flex items-center justify-center mb-3">
                <Share2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                1-Click Client Review Links
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Share a live interactive preview link where clients can switch
                devices and leave notes with zero login.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-5 px-6 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white/60 backdrop-blur-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00A67E]" />
            <span>Practiscale Preview Lab · Built for high-converting creative teams</span>
          </div>
          <span> PNG, JPG, WebP supported · Instant share links</span>
        </div>
      </footer>
    </div>
  );
}
