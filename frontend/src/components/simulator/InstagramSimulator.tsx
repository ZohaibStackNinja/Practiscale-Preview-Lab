"use client";

import React from "react";
import { Device, Variant } from "@/lib/types";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

interface InstagramSimulatorProps {
  device: Device;
  variant: Variant | null;
}

export const InstagramSimulator: React.FC<InstagramSimulatorProps> = ({
  device,
  variant,
}) => {
  const imgSrc = variant?.asset?.secureUrl;
  const variantName = variant?.name || "Launch campaign";

  const cardContent = (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-lg mx-auto">
      {/* Post Header */}
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
            <div className="w-full h-full bg-white rounded-full p-[1.5px]">
              <div className="w-full h-full bg-brand-primary-soft text-brand-primary-dark font-extrabold text-xs flex items-center justify-center rounded-full">
                PS
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-gray-900">
                practiscale.official
              </span>
              <span className="text-brand-primary text-xs font-bold">
                · Following
              </span>
            </div>
            <p className="text-[10px] text-gray-500">
              San Francisco, California
            </p>
          </div>
        </div>
        <button className="text-gray-600 hover:text-gray-900">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Media Canvas */}
      <div className="relative aspect-square w-full bg-slate-950 flex items-center justify-center overflow-hidden border-y border-gray-100">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={variantName}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-gray-400 text-xs">No Creative Selected</div>
        )}
        <div className="absolute top-3 left-3 bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
          Instagram Feed
        </div>
      </div>

      {/* Action Row */}
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-4 text-gray-800">
            <Heart className="w-5 h-5 hover:text-red-500 cursor-pointer transition" />
            <MessageCircle className="w-5 h-5 hover:text-blue-500 cursor-pointer transition" />
            <Send className="w-5 h-5 hover:text-gray-600 cursor-pointer transition" />
          </div>
          <Bookmark className="w-5 h-5 text-gray-800 hover:text-black cursor-pointer transition" />
        </div>

        {/* Likes Count */}
        <p className="text-xs font-bold text-gray-900 mb-1.5">1,248 likes</p>

        {/* Caption */}
        <p className="text-xs text-gray-900 leading-relaxed">
          <span className="font-bold mr-1.5">practiscale.official</span>
          {variantName}: Evaluating design compositions in realistic feed
          environments before going live. How does the hierarchy feel on your
          feed? ✨
        </p>

        <p className="text-[11px] text-gray-400 mt-1.5 cursor-pointer">
          View all 18 comments
        </p>
        <span className="text-[10px] text-gray-400 uppercase tracking-wide mt-1 block">
          2 hours ago
        </span>
      </div>
    </div>
  );

  if (device === "mobile") {
    return (
      <div className="flex justify-center p-4">
        <div className="w-[360px] bg-white rounded-[40px] border-[10px] border-[#202628] shadow-2xl overflow-hidden flex flex-col mobile-device-viewport">
          {/* Phone Notch */}
          <div className="bg-white px-6 py-2 flex justify-between items-center text-[11px] font-bold text-gray-800 select-none">
            <span>9:41</span>
            <div className="w-16 h-3 bg-black rounded-full mx-auto" />
            <span>5G</span>
          </div>

          {/* App Bar */}
          <div className="h-11 px-4 flex items-center justify-between border-b border-gray-100">
            <span className="font-serif font-black text-lg tracking-tight">
              Instagram
            </span>
            <div className="flex items-center space-x-4 text-gray-800">
              <Heart className="w-5 h-5" />
              <Send className="w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white py-2">
            {cardContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F5F7F8] p-6 rounded-lg border border-brand-border flex items-center justify-center min-h-[600px]">
      {cardContent}
    </div>
  );
};
