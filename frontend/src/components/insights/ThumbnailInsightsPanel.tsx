"use client";

import React, { useRef, useState, useEffect } from "react";
import { Variant, Project, CommentItem, Device } from "@/lib/types";
import {
  Check,
  X,
  Plus,
  Trash2,
  Upload,
  Camera,
  Loader2,
  Image as ImageIcon,
  Sparkles,
  Layers,
  BarChart3,
  CheckCircle2,
  MessageSquare,
  Monitor,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import {
  analyzeThumbnailImage,
  ThumbnailInsightResult,
} from "@/lib/thumbnailAnalyzer";

interface ThumbnailInsightsPanelProps {
  variants: Variant[];
  activeVariant: Variant | null;
  project?: Project | null;
  comments?: CommentItem[];
  currentDevice?: Device;
  onSwitchDevice?: (device: Device) => void;
  onSelectVariant: (variantId: string) => void;
  onAddVariantClick: () => void;
  onDeleteVariant?: (variantId: string) => void;
  onUploadAsset?: (
    type: "banner" | "logo" | "shortFrame" | "thumbnail",
    file: File,
  ) => Promise<void> | void;
  uploadingSlot?: string | null;
  activeTab?: "tracker" | "insights" | "variants" | "reviews";
  onTabChange?: (tab: "tracker" | "insights" | "variants" | "reviews") => void;
}

export const ThumbnailInsightsPanel: React.FC<ThumbnailInsightsPanelProps> = ({
  variants,
  activeVariant,
  project,
  comments = [],
  currentDevice = "desktop",
  onSwitchDevice,
  onSelectVariant,
  onAddVariantClick,
  onDeleteVariant,
  onUploadAsset,
  uploadingSlot,
  activeTab: controlledTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<
    "tracker" | "insights" | "variants" | "reviews"
  >("tracker");
  const [reviewFilter, setReviewFilter] = useState<
    "all" | "mobile" | "desktop"
  >("all");
  const [insights, setInsights] = useState<ThumbnailInsightResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Live Thumbnail Image Analysis on variant change
  useEffect(() => {
    let isCancelled = false;
    if (activeVariant?.asset?.secureUrl) {
      setIsAnalyzing(true);
      analyzeThumbnailImage(
        activeVariant.asset.secureUrl,
        activeVariant.width,
        activeVariant.height,
        activeVariant.name,
      ).then((res) => {
        if (!isCancelled) {
          setInsights(res);
          setIsAnalyzing(false);
        }
      });
    } else {
      setInsights(null);
      setIsAnalyzing(false);
    }
    return () => {
      isCancelled = true;
    };
  }, [
    activeVariant?.asset?.secureUrl,
    activeVariant?._id,
    activeVariant?.name,
  ]);

  const handleReanalyze = () => {
    if (!activeVariant?.asset?.secureUrl) return;
    setIsAnalyzing(true);
    analyzeThumbnailImage(
      activeVariant.asset.secureUrl,
      activeVariant.width,
      activeVariant.height,
      activeVariant.name,
    ).then((res) => {
      setInsights(res);
      setIsAnalyzing(false);
    });
  };

  const activeTab = controlledTab || internalTab;
  const handleTabClick = (
    tab: "tracker" | "insights" | "variants" | "reviews",
  ) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // Hidden file inputs for each asset slot
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const shortFrameInputRef = useRef<HTMLInputElement>(null);

  const handleFilePicked = (
    type: "banner" | "logo" | "shortFrame" | "thumbnail",
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0] && onUploadAsset) {
      onUploadAsset(type, e.target.files[0]);
    }
  };

  const hasThumbnail = Boolean(activeVariant?.asset?.secureUrl);
  const hasLogo = Boolean(project?.logoUrl);
  const hasBanner = Boolean(project?.bannerUrl);
  const hasShortFrame = Boolean(project?.shortFrameUrl);

  return (
    <aside className="w-[360px] bg-white border-l border-gray-200 flex flex-col h-full shrink-0 select-none overflow-hidden shadow-xs">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={thumbnailInputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => handleFilePicked("thumbnail", e)}
        className="hidden"
      />
      <input
        type="file"
        ref={logoInputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => handleFilePicked("logo", e)}
        className="hidden"
      />
      <input
        type="file"
        ref={bannerInputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => handleFilePicked("banner", e)}
        className="hidden"
      />
      <input
        type="file"
        ref={shortFrameInputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => handleFilePicked("shortFrame", e)}
        className="hidden"
      />

      {/* Tab Navigation or Reviews Header */}
      {activeTab === "reviews" ? (
        <div className="border-b border-gray-200 bg-white px-4 py-3 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => handleTabClick("variants")}
            className="flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-gray-500 group-hover:text-gray-900" />
            <span>Back to Workspace</span>
          </button>
          <div className="flex items-center space-x-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#0ABAB5]" />
            <span className="text-xs font-extrabold text-gray-900">
              Client Reviews
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-black rounded-full leading-none bg-amber-500 text-white shadow-2xs">
              {comments.length}
            </span>
          </div>
        </div>
      ) : (
        <div className="border-b border-gray-200 bg-white shrink-0 px-3">
          <nav
            className="flex items-center justify-between -mb-px"
            aria-label="Tabs"
          >
            {/* 1. Variants */}
            <button
              type="button"
              onClick={() => handleTabClick("variants")}
              className={`group relative flex-1 flex items-center justify-center gap-1.5 py-3.5 px-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "variants"
                  ? "text-[#089793]"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/80 rounded-t-lg"
              }`}
              title="Creative Variants"
            >
              <Layers
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                  activeTab === "variants"
                    ? "text-[#0ABAB5]"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              <span>Variants</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-full leading-none transition-colors ${
                  activeTab === "variants"
                    ? "bg-[#0ABAB5]/15 text-[#089793]"
                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                }`}
              >
                {variants.length}
              </span>
              {activeTab === "variants" && (
                <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#0ABAB5] rounded-full" />
              )}
            </button>

            {/* 2. Insights */}
            <button
              type="button"
              onClick={() => handleTabClick("insights")}
              className={`group relative flex-1 flex items-center justify-center gap-1.5 py-3.5 px-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "insights"
                  ? "text-[#089793]"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/80 rounded-t-lg"
              }`}
              title="Thumbnail Insights & Scores"
            >
              <BarChart3
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                  activeTab === "insights"
                    ? "text-[#0ABAB5]"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              <span>Insights</span>
              {activeTab === "insights" && (
                <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#0ABAB5] rounded-full" />
              )}
            </button>

            {/* 3. Specs */}
            <button
              type="button"
              onClick={() => handleTabClick("tracker")}
              className={`group relative flex-1 flex items-center justify-center gap-1.5 py-3.5 px-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "tracker"
                  ? "text-[#089793]"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/80 rounded-t-lg"
              }`}
              title="Asset Specs & Tracker"
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                  activeTab === "tracker"
                    ? "text-[#0ABAB5]"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              <span>Specs</span>
              {activeTab === "tracker" && (
                <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#0ABAB5] rounded-full" />
              )}
            </button>
          </nav>
        </div>
      )}

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: ASSET TRACKER */}
        {activeTab === "tracker" && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-gray-900">
                Asset Tracker
              </h3>
              <span className="text-[10px] font-bold text-[#089793] bg-teal-50 border border-teal-200/80 px-2.5 py-0.5 rounded-full">
                YouTube Specs
              </span>
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed">
              Click any asset slot to upload or replace it in your live
              simulator.
            </p>

            {/* Polished Asset Cards */}
            <div className="space-y-2.5">
              {/* 1. Thumbnail Card */}
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                className="p-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50/80 hover:border-gray-300 transition-all flex items-center justify-between group cursor-pointer shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition group-hover:scale-105 ${
                      hasThumbnail
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200/80"
                        : "bg-rose-50 text-rose-500 border-rose-200/80"
                    }`}
                  >
                    {uploadingSlot === "thumbnail" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#0ABAB5]" />
                    ) : hasThumbnail ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <X className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                      <span>Thumbnail</span>
                      <Upload className="w-3 h-3 text-[#0ABAB5] opacity-0 group-hover:opacity-100 transition" />
                    </h4>
                    <p className="text-[10px] text-gray-400 font-medium">
                      1280 × 720 (16:9)
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    hasThumbnail
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                      : "bg-rose-50 text-rose-700 border-rose-200/70"
                  }`}
                >
                  {hasThumbnail ? "Uploaded" : "Missing"}
                </span>
              </div>

              {/* 2. Channel Logo Card */}
              <div
                onClick={() => logoInputRef.current?.click()}
                className="p-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50/80 hover:border-gray-300 transition-all flex items-center justify-between group cursor-pointer shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition group-hover:scale-105 ${
                      hasLogo
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200/80"
                        : "bg-rose-50 text-rose-500 border-rose-200/80"
                    }`}
                  >
                    {uploadingSlot === "logo" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#0ABAB5]" />
                    ) : hasLogo ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <X className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                      <span>Channel Logo</span>
                      <Upload className="w-3 h-3 text-[#0ABAB5] opacity-0 group-hover:opacity-100 transition" />
                    </h4>
                    <p className="text-[10px] text-gray-400 font-medium">
                      800 × 800 (1:1)
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    hasLogo
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                      : "bg-rose-50 text-rose-700 border-rose-200/70"
                  }`}
                >
                  {hasLogo ? "Uploaded" : "Missing"}
                </span>
              </div>

              {/* 3. Channel Banner Card */}
              <div
                onClick={() => bannerInputRef.current?.click()}
                className="p-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50/80 hover:border-gray-300 transition-all flex items-center justify-between group cursor-pointer shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition group-hover:scale-105 ${
                      hasBanner
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200/80"
                        : "bg-rose-50 text-rose-500 border-rose-200/80"
                    }`}
                  >
                    {uploadingSlot === "banner" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#0ABAB5]" />
                    ) : hasBanner ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <X className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                      <span>Channel Banner</span>
                      <Upload className="w-3 h-3 text-[#0ABAB5] opacity-0 group-hover:opacity-100 transition" />
                    </h4>
                    <p className="text-[10px] text-gray-400 font-medium">
                      2560 × 1440 (16:9)
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    hasBanner
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                      : "bg-rose-50 text-rose-700 border-rose-200/70"
                  }`}
                >
                  {hasBanner ? "Uploaded" : "Missing"}
                </span>
              </div>

              {/* 4. Short Frame Card */}
              <div
                onClick={() => shortFrameInputRef.current?.click()}
                className="p-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50/80 hover:border-gray-300 transition-all flex items-center justify-between group cursor-pointer shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition group-hover:scale-105 ${
                      hasShortFrame
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200/80"
                        : "bg-rose-50 text-rose-500 border-rose-200/80"
                    }`}
                  >
                    {uploadingSlot === "shortFrame" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#0ABAB5]" />
                    ) : hasShortFrame ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <X className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                      <span>Short Frame</span>
                      <Upload className="w-3 h-3 text-[#0ABAB5] opacity-0 group-hover:opacity-100 transition" />
                    </h4>
                    <p className="text-[10px] text-gray-400 font-medium">
                      1080 × 1920 (9:16)
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    hasShortFrame
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                      : "bg-rose-50 text-rose-700 border-rose-200/70"
                  }`}
                >
                  {hasShortFrame ? "Uploaded" : "Missing"}
                </span>
              </div>
            </div>

            {/* Beautified Action Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (!hasBanner) bannerInputRef.current?.click();
                  else if (!hasShortFrame) shortFrameInputRef.current?.click();
                  else if (!hasLogo) logoInputRef.current?.click();
                  else onAddVariantClick();
                }}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#0ABAB5] to-[#089793] hover:from-[#099E9A] hover:to-[#078581] text-white shadow-xs hover:shadow-sm transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {!hasBanner
                    ? "Upload Channel Banner"
                    : !hasShortFrame
                      ? "Upload Short Frame"
                      : !hasLogo
                        ? "Upload Channel Logo"
                        : "Add New Variant"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: THUMBNAIL INSIGHTS (DYNAMIC LIVE ANALYSIS) */}
        {activeTab === "insights" && (
          <div className="space-y-4">
            {!activeVariant?.asset?.secureUrl ? (
              /* Empty State: No Thumbnail Uploaded */
              <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/60 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0ABAB5] flex items-center justify-center mx-auto border border-teal-200/60 shadow-2xs">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-900">
                    No Thumbnail Uploaded
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    Upload or select a creative variant to generate real-time
                    contrast, legibility, and safe-zone insights.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0ABAB5] to-[#089793] hover:from-[#099E9A] hover:to-[#078581] shadow-xs cursor-pointer transition active:scale-95"
                >
                  Upload Thumbnail
                </button>
              </div>
            ) : isAnalyzing && !insights ? (
              /* Scanning / Analyzing Loader */
              <div className="p-8 text-center border border-gray-200 rounded-2xl bg-white space-y-3 shadow-xs">
                <Loader2 className="w-8 h-8 text-[#0ABAB5] animate-spin mx-auto" />
                <div>
                  <h4 className="text-xs font-extrabold text-gray-900">
                    Analyzing Visual Dynamics...
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Inspecting pixel luminance, contrast, safe zones &amp;
                    mobile clarity...
                  </p>
                </div>
              </div>
            ) : insights ? (
              /* Live Dynamic Insights Content */
              <>
                {/* Header & Active Variant Indicator */}
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm text-gray-900 flex items-center space-x-1.5">
                      <span>Thumbnail Insights</span>
                    </h3>
                    <p className="text-[10px] text-gray-400 font-medium truncate max-w-[190px] mt-0.5">
                      Variant:{" "}
                      <span className="text-gray-700 font-bold">
                        {activeVariant?.name || "Active Variant"}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReanalyze}
                    disabled={isAnalyzing}
                    className="text-[11px] font-bold text-[#089793] hover:text-[#0ABAB5] flex items-center space-x-1 bg-teal-50 hover:bg-teal-100/80 px-2.5 py-1 rounded-lg border border-teal-200/60 transition active:scale-95 cursor-pointer disabled:opacity-50"
                    title="Re-run image pixel analysis"
                  >
                    <RefreshCw
                      className={`w-3 h-3 ${
                        isAnalyzing ? "animate-spin text-[#0ABAB5]" : ""
                      }`}
                    />
                    <span>{isAnalyzing ? "Scanning..." : "Re-test"}</span>
                  </button>
                </div>

                {/* Score Ring Card */}
                <div className="p-4 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-center shadow-xs">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        stroke={insights.scoreStrokeColor}
                        strokeDasharray={`${insights.overallScore}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-700"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-black text-gray-900">
                        {insights.overallScore}
                      </span>
                      <span className="text-[8px] font-extrabold text-gray-400 tracking-wider">
                        SCORE
                      </span>
                    </div>
                  </div>

                  <p
                    className={`text-xs font-bold mt-2 flex items-center space-x-1 ${insights.scoreColor}`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{insights.scoreStatus}</span>
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5 max-w-xs leading-relaxed">
                    {insights.summary}
                  </p>
                </div>

                {/* Quality Breakdown Cards */}
                <div className="space-y-2 text-xs">
                  {/* 1. Color Contrast */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-800">
                        {insights.metrics.contrast.label}
                      </p>
                      <span
                        className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full border ${insights.metrics.contrast.statusColor}`}
                      >
                        {insights.metrics.contrast.value}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      {insights.metrics.contrast.tip}
                    </p>
                  </div>

                  {/* 2. Color Vibrancy */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-800">
                        {insights.metrics.vibrancy.label}
                      </p>
                      <span
                        className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full border ${insights.metrics.vibrancy.statusColor}`}
                      >
                        {insights.metrics.vibrancy.value}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      {insights.metrics.vibrancy.tip}
                    </p>
                  </div>

                  {/* 3. Safe Area Clearance */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-800">
                        {insights.metrics.safeArea.label}
                      </p>
                      <span
                        className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full border ${insights.metrics.safeArea.statusColor}`}
                      >
                        {insights.metrics.safeArea.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      {insights.metrics.safeArea.tip}
                    </p>
                  </div>

                  {/* 4. Mobile Scaling */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-800">
                        {insights.metrics.mobileLegibility.label}
                      </p>
                      <span
                        className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full border ${insights.metrics.mobileLegibility.statusColor}`}
                      >
                        {insights.metrics.mobileLegibility.value}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      {insights.metrics.mobileLegibility.tip}
                    </p>
                  </div>

                  {/* 5. Resolution & Aspect Ratio */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-800">
                        Resolution &amp; Ratio
                      </p>
                      <span
                        className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full border ${insights.metrics.resolution.statusColor}`}
                      >
                        {insights.dimensions.aspectRatio}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      {insights.dimensions.width} × {insights.dimensions.height}{" "}
                      · {insights.metrics.resolution.tip}
                    </p>
                  </div>
                </div>

                {/* Performance Recommendations Box */}
                {insights.recommendations.length > 0 && (
                  <div className="p-3.5 bg-gradient-to-br from-teal-50/70 to-emerald-50/50 rounded-2xl border border-teal-200/70 shadow-2xs space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs font-extrabold text-[#089793]">
                      <Sparkles className="w-3.5 h-3.5 text-[#0ABAB5]" />
                      <span>Visual Recommendations</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-gray-700">
                      {insights.recommendations.map((rec, idx) => (
                        <li
                          key={idx}
                          className="flex items-start space-x-1.5 leading-relaxed"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0ABAB5] shrink-0 mt-1.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}

        {/* TAB 3: CREATIVE VARIANTS MANAGER */}
        {activeTab === "variants" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-gray-900">
                Variants ({variants.length})
              </h3>
              <button
                onClick={onAddVariantClick}
                className="text-xs font-bold text-[#089793] hover:text-[#0ABAB5] flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            </div>

            <div className="space-y-2">
              {variants.map((v) => {
                const isSelected = activeVariant?._id === v._id;
                return (
                  <div
                    key={v._id}
                    onClick={() => onSelectVariant(v._id)}
                    className={`p-2.5 rounded-2xl border cursor-pointer transition flex items-center space-x-3 ${
                      isSelected
                        ? "border-[#0ABAB5] bg-[#0ABAB5]/5 shadow-sm ring-1 ring-[#0ABAB5]/30"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {v.asset?.secureUrl ? (
                        <img
                          src={v.asset.secureUrl}
                          alt={v.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-gray-400">Asset</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {v.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {v.width && v.height
                          ? `${v.width} × ${v.height}`
                          : "Custom ratio"}
                      </p>
                    </div>

                    {onDeleteVariant && variants.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete variant "${v.name}"?`)) {
                            onDeleteVariant(v._id);
                          }
                        }}
                        className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: CLIENT REVIEWS */}
        {activeTab === "reviews" && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 flex items-center space-x-1.5">
                  <span>Client Reviews</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                    {comments.length}
                  </span>
                </h3>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                  Feedback sent by clients from Review Mode
                </p>
              </div>
            </div>

            {/* Filter pills: All / Mobile / Desktop */}
            {comments.length > 0 && (
              <div className="flex items-center space-x-1 p-0.5 bg-gray-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setReviewFilter("all")}
                  className={`flex-1 py-1 rounded-lg text-[11px] transition ${
                    reviewFilter === "all"
                      ? "bg-white text-gray-900 shadow-2xs font-bold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  All ({comments.length})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter("mobile")}
                  className={`flex-1 py-1 rounded-lg text-[11px] transition flex items-center justify-center space-x-1 ${
                    reviewFilter === "mobile"
                      ? "bg-white text-blue-700 shadow-2xs font-bold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>
                    Mobile (
                    {comments.filter((c) => c.device === "mobile").length})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter("desktop")}
                  className={`flex-1 py-1 rounded-lg text-[11px] transition flex items-center justify-center space-x-1 ${
                    reviewFilter === "desktop"
                      ? "bg-white text-purple-700 shadow-2xs font-bold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>
                    Desktop (
                    {
                      comments.filter(
                        (c) => c.device === "desktop" || !c.device,
                      ).length
                    }
                    )
                  </span>
                </button>
              </div>
            )}

            {/* Filtered Comments List */}
            {(() => {
              const filtered = comments.filter((c) => {
                if (reviewFilter === "mobile") return c.device === "mobile";
                if (reviewFilter === "desktop")
                  return c.device === "desktop" || !c.device;
                return true;
              });

              if (filtered.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-200/70 space-y-2 text-gray-400 my-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-2xs">
                      <MessageSquare className="w-5 h-5 text-[#0ABAB5]" />
                    </div>
                    <p className="text-xs font-bold text-gray-800">
                      {comments.length === 0
                        ? "No client reviews yet"
                        : "No reviews for this mode"}
                    </p>
                    <p className="text-[11px] text-gray-500 max-w-[200px] leading-relaxed">
                      {comments.length === 0
                        ? "Click the Share button at the top to send a review link to clients."
                        : "No reviews were left in this review mode filter."}
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {filtered.map((c) => {
                    const initials =
                      c.displayName
                        .split(" ")
                        .filter(Boolean)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "GR";

                    const timeStr = new Date(c.createdAt).toLocaleDateString(
                      [],
                      {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    );

                    return (
                      <div
                        key={c._id}
                        className="p-3 bg-white rounded-2xl border border-gray-200/90 shadow-2xs space-y-2.5 transition hover:border-gray-300"
                      >
                        {/* Reviewer Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-2xs">
                              {initials}
                            </div>
                            <span className="font-bold text-gray-900 text-xs truncate max-w-[140px]">
                              {c.displayName}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {timeStr}
                          </span>
                        </div>

                        {/* Prominent Review Mode Badge - Shows which mode client sent */}
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <span
                            className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              c.device === "mobile"
                                ? "bg-blue-50 text-blue-800 border border-blue-200/80"
                                : "bg-purple-50 text-purple-800 border border-purple-200/80"
                            }`}
                          >
                            {c.device === "mobile" ? (
                              <>
                                <Smartphone className="w-3 h-3 text-blue-600" />
                                <span>Client Mode: Mobile</span>
                              </>
                            ) : (
                              <>
                                <Monitor className="w-3 h-3 text-purple-600" />
                                <span>Client Mode: Desktop</span>
                              </>
                            )}
                          </span>

                          {c.viewMode && (
                            <span className="px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-semibold border border-teal-200/60 capitalize">
                              {c.viewMode} feed
                            </span>
                          )}

                          {c.variantName && (
                            <span
                              className="text-[10px] text-gray-400 truncate max-w-[120px]"
                              title={c.variantName}
                            >
                              · {c.variantName}
                            </span>
                          )}
                        </div>

                        {/* Comment Body */}
                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-150 text-xs text-gray-800 break-words leading-relaxed">
                          {c.body}
                        </div>

                        {/* Quick switch simulator to this client review mode */}
                        {onSwitchDevice && (
                          <button
                            type="button"
                            onClick={() =>
                              onSwitchDevice(c.device || "desktop")
                            }
                            className="w-full py-1.5 px-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-[#089793] hover:text-[#0ABAB5] text-[11px] font-bold flex items-center justify-between transition cursor-pointer border border-gray-200/60 group"
                          >
                            <span>
                              Inspect in{" "}
                              {c.device === "mobile" ? "Mobile" : "Desktop"}{" "}
                              View
                            </span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </aside>
  );
};
