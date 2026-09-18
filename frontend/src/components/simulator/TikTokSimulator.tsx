"use client";

import React from "react";
import { Device, Variant } from "@/lib/types";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Music,
  Plus,
} from "lucide-react";

interface TikTokSimulatorProps {
  device: Device;
  variant: Variant | null;
}

export const TikTokSimulator: React.FC<TikTokSimulatorProps> = ({
  device: _device,
  variant,
}) => {
  const imgSrc = variant?.asset?.secureUrl;
  const variantName = variant?.name || "Launch campaign";

  return (
    <div className="flex justify-center p-4">
      {/* Mobile-first phone canvas */}
      <div className="w-[340px] h-[640px] bg-black rounded-[36px] border-[8px] border-[#202628] shadow-2xl overflow-hidden relative flex flex-col justify-between select-none mobile-device-viewport">
        {/* Top Header: Following | For You */}
        <div className="pt-4 px-4 flex justify-center items-center space-x-4 text-white text-xs font-bold z-20">
          <span className="opacity-60 cursor-pointer">Following</span>
          <span className="border-b-2 border-white pb-0.5 cursor-pointer">
            For You
          </span>
        </div>

        {/* Media Background */}
        <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={variantName}
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="text-gray-500 text-xs">No Creative Selected</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
        </div>

        {/* Right Action Stack */}
        <div className="absolute right-3 bottom-16 flex flex-col items-center space-y-4 z-20 text-white">
          {/* Creator Profile Plus */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-white bg-brand-primary text-white font-extrabold text-xs flex items-center justify-center shadow">
              PS
            </div>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shadow">
              <Plus className="w-3 h-3" />
            </div>
          </div>

          {/* Likes */}
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <span className="text-[10px] font-bold mt-1">45.2K</span>
          </div>

          {/* Comments */}
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold mt-1">1,280</span>
          </div>

          {/* Bookmark */}
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition">
              <Bookmark className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold mt-1">3.4K</span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold mt-1">Share</span>
          </div>

          {/* Rotating Vinyl Disc */}
          <div className="w-9 h-9 rounded-full bg-black border-2 border-gray-700 flex items-center justify-center animate-spin [animation-duration:4s]">
            <div className="w-3 h-3 rounded-full bg-brand-primary" />
          </div>
        </div>

        {/* Bottom Overlay: Handle, Caption, Sound */}
        <div className="p-4 z-20 text-white space-y-1.5">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-xs">@practiscale</span>
            <span className="bg-white/20 text-[9px] px-1 py-0.2 rounded">
              Creator
            </span>
          </div>
          <p className="text-[11px] leading-snug line-clamp-2 text-gray-100">
            Testing our creative{" "}
            <span className="font-bold">[{variantName}]</span> across
            multi-platform feeds. What grabs your attention first? 🚀 #preview
            #marketing
          </p>
          <div className="flex items-center space-x-1.5 text-[10px] text-gray-200">
            <Music className="w-3 h-3 animate-pulse" />
            <span className="truncate max-w-[200px]">
              PractiScale Sound · Trending Audio
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
