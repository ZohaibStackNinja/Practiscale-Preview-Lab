"use client";

import React, { useState, useEffect } from "react";
import { Platform } from "@/lib/types";
import { DEFAULT_PLATFORM_DUMMY_COPY } from "@/lib/api";
import { Type, Sparkles, RotateCcw, Check, ChevronDown, ChevronUp, User } from "lucide-react";

interface SimulatorCopyControlProps {
  platform: Platform;
  customTitle?: string;
  customChannelName?: string;
  onUpdateCopy: (next: { title?: string; channelName?: string }) => void;
}

export const SimulatorCopyControl: React.FC<SimulatorCopyControlProps> = ({
  platform,
  customTitle,
  customChannelName,
  onUpdateCopy,
}) => {
  const defaults = DEFAULT_PLATFORM_DUMMY_COPY[platform] || DEFAULT_PLATFORM_DUMMY_COPY.youtube;
  const [isOpen, setIsOpen] = useState(false);
  const [titleInput, setTitleInput] = useState(customTitle || "");
  const [channelInput, setChannelInput] = useState(customChannelName || "");

  useEffect(() => {
    setTitleInput(customTitle || "");
    setChannelInput(customChannelName || "");
  }, [customTitle, customChannelName, platform]);

  const isCustomActive = Boolean(customTitle?.trim() || customChannelName?.trim());
  const activeDisplayTitle = customTitle?.trim() || defaults.title;
  const activeDisplayChannel = customChannelName?.trim() || defaults.channelName;

  const titleLabel =
    platform === "youtube"
      ? "Video Title"
      : platform === "linkedin" || platform === "facebook"
        ? "Post Headline / Copy"
        : "Post Caption / Hook";

  const channelLabel =
    platform === "youtube"
      ? "Channel Name"
      : platform === "instagram" || platform === "tiktok"
        ? "Creator Handle"
        : "Brand / Page Name";

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCopy({
      title: titleInput.trim() || undefined,
      channelName: channelInput.trim() || undefined,
    });
    setIsOpen(false);
  };

  const handleResetDummy = () => {
    setTitleInput("");
    setChannelInput("");
    onUpdateCopy({ title: undefined, channelName: undefined });
  };

  const handleSelectPreset = (preset: { title: string; channelName: string }) => {
    setTitleInput(preset.title);
    setChannelInput(preset.channelName);
    onUpdateCopy({
      title: preset.title,
      channelName: preset.channelName,
    });
  };

  return (
    <div className="w-full mb-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all select-none">
      {/* Compact Summary Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
          <span
            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 border ${
              isCustomActive
                ? "bg-[#E6F7F3] text-[#008B68] border-[#00A67E]/30"
                : "bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            <Sparkles className="w-2.5 h-2.5 text-[#00A67E]" />
            <span>{isCustomActive ? "Custom Title" : "Dummy Text"}</span>
          </span>

          <div className="text-xs text-slate-700 truncate flex items-center space-x-1.5 min-w-0">
            <span className="font-bold text-slate-900 truncate max-w-[220px] sm:max-w-[360px] md:max-w-[460px]">
              &ldquo;{activeDisplayTitle}&rdquo;
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline truncate">
              {activeDisplayChannel}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {isCustomActive && (
            <button
              type="button"
              onClick={handleResetDummy}
              title="Reset to default dummy title and channel"
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition inline-flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Use Dummy</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-1.5 cursor-pointer border ${
              isOpen
                ? "bg-[#00A67E] text-white border-[#00A67E] shadow-2xs"
                : "bg-slate-50 hover:bg-[#E6F7F3]/60 text-slate-800 hover:text-[#008B68] border-slate-200/90 hover:border-[#00A67E]/40"
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>{isOpen ? "Close Editor" : "Add / Edit Title & Brand"}</span>
            {isOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Custom Title & Channel Editor */}
      {isOpen && (
        <form
          onSubmit={handleApply}
          className="px-4 pb-4 pt-3 border-t border-slate-100 bg-slate-50/60 space-y-3 animate-fadeIn"
        >
          {/* Preset Dummy Switchers */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mr-1">
              Quick Dummy Presets:
            </span>
            {defaults.presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white hover:bg-[#E6F7F3] text-slate-600 hover:text-[#008B68] border border-slate-200/80 hover:border-[#00A67E]/40 transition cursor-pointer shadow-2xs"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {titleLabel}{" "}
                <span className="text-slate-400 font-normal">
                  (Leave blank to use dummy text)
                </span>
              </label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder={defaults.title}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-[#00A67E] focus:ring-1 focus:ring-[#00A67E] text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {channelLabel}
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  placeholder={defaults.channelName}
                  className="w-full pl-8 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-[#00A67E] focus:ring-1 focus:ring-[#00A67E] text-slate-900 shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-slate-400">
              Image file names are never shown in your feed preview.
            </p>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleResetDummy}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition cursor-pointer"
              >
                Reset to Dummy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#00A67E] hover:bg-[#008B68] text-white shadow-xs transition inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Apply to Preview</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
