"use client";

import React from "react";
import { Device, Variant } from "@/lib/types";
import {
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  MoreHorizontal,
  Globe,
  Plus,
} from "lucide-react";

interface LinkedInSimulatorProps {
  device: Device;
  variant: Variant | null;
}

export const LinkedInSimulator: React.FC<LinkedInSimulatorProps> = ({
  device,
  variant,
}) => {
  const imgSrc = variant?.asset?.secureUrl;
  const variantName = variant?.name || "Launch campaign";

  const cardContent = (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-xl mx-auto">
      {/* Author Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex space-x-3">
          <div className="w-12 h-12 rounded-full bg-brand-success-soft text-brand-primary-dark font-extrabold text-sm flex items-center justify-center border border-brand-border">
            MC
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-bold text-gray-900">Maya Chen</span>
              <span className="text-xs text-gray-500">· 1st</span>
            </div>
            <p className="text-xs text-gray-600">
              Founder at Northstar Studio | Brand Strategy
            </p>
            <div className="flex items-center space-x-1 text-[11px] text-gray-400 mt-0.5">
              <span>1h</span>
              <span>·</span>
              <span>Edited</span>
              <span>·</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 hover:bg-blue-50 font-bold text-xs px-3 py-1 rounded-full flex items-center space-x-1 transition">
            <Plus className="w-3.5 h-3.5" />
            <span>Follow</span>
          </button>
          <button className="text-gray-500 hover:text-gray-800">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Post Text */}
      <div className="px-4 pb-3 text-xs text-gray-800 leading-relaxed space-y-2">
        <p>
          Big ideas deserve a clear place to grow. Today we&apos;re introducing
          a new creative variant:
          <span className="font-semibold text-brand-text-primary">
            {" "}
            &ldquo;{variantName}&rdquo;
          </span>
          .
        </p>
        <p>
          Instead of viewing designs as standalone files, seeing them inside
          realistic platform contexts empowers teams to evaluate composition,
          contrast, and messaging hierarchy before spending ad budget.
        </p>
      </div>

      {/* Media Canvas */}
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
        <div className="absolute top-3 left-3 bg-[#0A66C2] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
          LinkedIn Post
        </div>
      </div>

      {/* Social Engagement Stats */}
      <div className="px-4 py-2.5 flex items-center justify-between text-xs text-gray-500 border-b border-gray-100">
        <div className="flex items-center space-x-1">
          <div className="flex -space-x-1">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">
              👍
            </span>
            <span className="w-4 h-4 rounded-full bg-green-600 text-white flex items-center justify-center text-[9px]">
              👏
            </span>
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px]">
              💡
            </span>
          </div>
          <span className="ml-1 text-xs">124</span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span>18 comments</span>
          <span>·</span>
          <span>6 reposts</span>
        </div>
      </div>

      {/* Engagement Actions */}
      <div className="px-2 py-1 flex items-center justify-around text-xs font-semibold text-gray-600">
        <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg flex items-center justify-center space-x-1.5 transition">
          <ThumbsUp className="w-4 h-4" />
          <span>Like</span>
        </button>
        <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg flex items-center justify-center space-x-1.5 transition">
          <MessageSquare className="w-4 h-4" />
          <span>Comment</span>
        </button>
        <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg flex items-center justify-center space-x-1.5 transition">
          <Repeat2 className="w-4 h-4" />
          <span>Repost</span>
        </button>
        <button className="flex-1 py-2 hover:bg-gray-100 rounded-lg flex items-center justify-center space-x-1.5 transition">
          <Send className="w-4 h-4" />
          <span>Send</span>
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
          <div className="h-11 px-4 flex items-center border-b border-gray-100 font-black text-[#0A66C2] text-base">
            Linked
            <span className="bg-[#0A66C2] text-white px-1 ml-0.5 rounded text-xs py-0.5 font-bold">
              in
            </span>
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
