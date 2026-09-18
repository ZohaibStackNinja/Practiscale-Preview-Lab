"use client";

import React from "react";
import { Device, Variant } from "@/lib/types";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Globe,
  MoreHorizontal,
} from "lucide-react";

interface FacebookSimulatorProps {
  device: Device;
  variant: Variant | null;
}

export const FacebookSimulator: React.FC<FacebookSimulatorProps> = ({
  device,
  variant,
}) => {
  const imgSrc = variant?.asset?.secureUrl;
  const variantName = variant?.name || "Launch campaign";

  const cardContent = (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-xl mx-auto">
      {/* Header */}
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            PS
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-gray-900">
                PractiScale
              </span>
              <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center text-white text-[8px]">
                ✓
              </div>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-gray-500">
              <span>1 hr</span>
              <span>·</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-800">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Post Text */}
      <div className="px-3.5 pb-3 text-xs text-gray-800 leading-relaxed">
        Big ideas deserve a clear place to grow. Today we&apos;re testing our
        latest creative:{" "}
        <span className="font-semibold text-brand-text-primary">
          [{variantName}]
        </span>
        . Previewing in real context helps our team make rapid decisions with
        absolute clarity!
      </div>

      {/* Media */}
      <div className="relative aspect-[1.91/1] w-full bg-slate-900 flex items-center justify-center overflow-hidden border-y border-gray-100">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={variantName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-xs">No Creative Selected</div>
        )}
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
          Facebook Feed
        </div>
      </div>

      {/* Metrics Row */}
      <div className="px-3.5 py-2 flex items-center justify-between text-[11px] text-gray-500 border-b border-gray-100">
        <div className="flex items-center space-x-1">
          <div className="flex -space-x-1">
            <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px]">
              👍
            </span>
            <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px]">
              ❤️
            </span>
          </div>
          <span className="ml-1 font-medium">124</span>
        </div>
        <div className="flex items-center space-x-3">
          <span>18 comments</span>
          <span>5 shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-2 py-1 flex items-center justify-around text-xs font-semibold text-gray-600">
        <button className="flex-1 py-1.5 hover:bg-gray-100 rounded-lg flex items-center justify-center space-x-1.5 transition">
          <ThumbsUp className="w-4 h-4" />
          <span>Like</span>
        </button>
        <button className="flex-1 py-1.5 hover:bg-gray-100 rounded-lg flex items-center justify-center space-x-1.5 transition">
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>
        <button className="flex-1 py-1.5 hover:bg-gray-100 rounded-lg flex items-center justify-center space-x-1.5 transition">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );

  if (device === "mobile") {
    return (
      <div className="flex justify-center p-4">
        <div className="w-[360px] bg-white rounded-[40px] border-[10px] border-[#202628] shadow-2xl overflow-hidden flex flex-col mobile-device-viewport">
          <div className="bg-white px-6 py-2 flex justify-between items-center text-[11px] font-bold text-gray-800 select-none">
            <span>9:41</span>
            <div className="w-16 h-3 bg-black rounded-full mx-auto" />
            <span>5G</span>
          </div>
          <div className="h-11 px-4 flex items-center border-b border-gray-100 font-bold text-blue-600 text-base">
            facebook
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-100 py-3">
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
