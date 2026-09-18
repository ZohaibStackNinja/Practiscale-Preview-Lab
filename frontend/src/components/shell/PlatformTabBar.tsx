"use client";

import React from "react";
import { Platform, Device } from "@/lib/types";
import {
  Monitor,
  Smartphone,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

import { PLATFORM_CONFIG } from "@/components/common/PlatformIcons";

interface PlatformTabBarProps {
  currentPlatform: Platform;
  onSelectPlatform: (platform: Platform) => void;
  currentDevice: Device;
  onSelectDevice: (device: Device) => void;
  activeImageName?: string;
  onChangeImageClick?: () => void;
  lastTestedText?: string;
  onRetestClick?: () => void;
}

const PLATFORM_LIST: Platform[] = [
  "youtube",
  "instagram",
  "facebook",
  "tiktok",
  "linkedin",
];

export const PlatformTabBar: React.FC<PlatformTabBarProps> = ({
  currentPlatform,
  onSelectPlatform,
  currentDevice,
  onSelectDevice,
  activeImageName = "Hero Banner.png",
  onChangeImageClick,
  lastTestedText = "Last tested 2m ago",
  onRetestClick,
}) => {
  return (
    <div className="h-14 w-full bg-white border-b border-gray-200/80 px-4 md:px-6 flex items-center justify-between z-30 select-none shadow-xs">
      {/* Left: Beautiful Platform Segmented Pills with Brand Icons */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
        {PLATFORM_LIST.map((platformId) => {
          const config = PLATFORM_CONFIG[platformId];
          const Icon = config.Icon;
          const isActive = currentPlatform === platformId;
          return (
            <button
              key={platformId}
              type="button"
              onClick={() => onSelectPlatform(platformId)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-[#0ABAB5] to-[#089793] text-white shadow-sm shadow-[#0ABAB5]/30 ring-1 ring-white/20"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-all ${
                  isActive ? "text-white scale-105" : config.brandColor
                }`}
              />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Device Selection Segmented Control + Asset Controls */}
      <div className="flex items-center space-x-3 text-xs shrink-0">
        {/* Modern iOS/macOS Style Device Segmented Control */}
        <div className="flex items-center p-1 bg-gray-100/90 rounded-xl border border-gray-200/80 shadow-xs">
          <button
            onClick={() => onSelectDevice("desktop")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentDevice === "desktop"
                ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                : "text-gray-500 hover:text-gray-800 hover:bg-white/40"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => onSelectDevice("mobile")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentDevice === "mobile"
                ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                : "text-gray-500 hover:text-gray-800 hover:bg-white/40"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        <div className="h-5 w-[1px] bg-gray-200 hidden lg:block" />

        {/* Active Image Indicator */}
        <div className="hidden xl:flex items-center space-x-2 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200/60">
          <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-400 text-[11px]">Active:</span>
          <span className="font-bold text-gray-800 truncate max-w-[130px]">
            {activeImageName}
          </span>
        </div>

        {/* Change Image Action Button */}
        <button
          onClick={onChangeImageClick}
          className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 shadow-xs hover:border-gray-300 transition-all active:scale-95"
        >
          <ImageIcon className="w-3.5 h-3.5 text-[#0ABAB5]" />
          <span>Change Image</span>
        </button>

        {/* Last Tested Note */}
        <span className="text-gray-400 text-[11px] hidden md:inline-block">
          {lastTestedText}
        </span>

        {/* Re-test Button */}
        <button
          onClick={onRetestClick}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs text-white bg-gradient-to-r from-[#0ABAB5] to-[#089793] hover:from-[#099E9A] hover:to-[#078581] shadow-xs hover:shadow-sm transition-all active:scale-95 group"
        >
          <RefreshCw className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-500" />
          <span>Re-test</span>
        </button>
      </div>
    </div>
  );
};
