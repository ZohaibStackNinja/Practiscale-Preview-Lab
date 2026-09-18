"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Pencil,
  Check,
  Share2,
  ChevronDown,
  MessageSquare,
} from "lucide-react";

interface TopNavProps {
  projectName?: string;
  onRenameProject?: (newName: string) => Promise<void> | void;
  onOpenShare?: () => void;
  onOpenReviews?: () => void;
  onOpenComments?: () => void;
  commentsCount?: number;
  saveStatus?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  projectName = "Q4 Brand Launch",
  onRenameProject,
  onOpenShare,
  onOpenReviews,
  onOpenComments,
  commentsCount = 0,
  saveStatus = "Saved just now",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(projectName);

  const handleBlur = () => {
    setIsEditing(false);
    if (title.trim() && title !== projectName && onRenameProject) {
      onRenameProject(title.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setTitle(projectName);
      setIsEditing(false);
    }
  };

  const handleCommentsClick = onOpenComments || onOpenReviews;

  return (
    <header className="h-14 w-full bg-white border-b border-gray-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none shadow-2xs">
      {/* Left: Brand & Project Name */}
      <div className="flex items-center space-x-4 min-w-0">
        <Link href="/" className="flex items-center space-x-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0ABAB5] to-[#089793] flex items-center justify-center text-white font-black text-base shadow-sm transition group-hover:scale-105">
            P
          </div>
          <span className="font-extrabold text-gray-900 text-base tracking-tight hidden sm:inline">
            Practiscale Preview
          </span>
        </Link>

        <div className="h-5 w-[1px] bg-gray-200 hidden sm:block shrink-0" />

        <div className="flex items-center space-x-2 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className="px-2.5 py-1 text-sm font-semibold border border-[#0ABAB5] rounded-xl outline-none text-gray-900 bg-teal-50/50 max-w-[240px] shadow-xs"
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1.5 cursor-pointer group hover:bg-gray-100/80 px-2.5 py-1 rounded-xl transition border border-transparent hover:border-gray-200 min-w-0"
            >
              <span className="text-sm font-bold text-gray-800 truncate max-w-[180px] sm:max-w-[280px]">
                {title}
              </span>
              <Pencil className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#089793] transition shrink-0" />
            </div>
          )}
        </div>
      </div>

      {/* Right: Save Status, Comment Button, Share Button, User Avatar */}
      <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
        {/* Saved Status */}
        <div className="hidden lg:flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full shadow-2xs">
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{saveStatus}</span>
        </div>

        {/* Comment Button in Top Nav */}
        <button
          type="button"
          onClick={handleCommentsClick}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer shadow-2xs ${
            commentsCount > 0
              ? "bg-gradient-to-r from-amber-50 to-orange-50/80 text-amber-900 border-amber-300 hover:from-amber-100 hover:to-orange-100 hover:border-amber-400 ring-1 ring-amber-400/20"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
          }`}
          title="View client comments and review feedback"
        >
          <div className="relative flex items-center justify-center">
            <MessageSquare
              className={`w-3.5 h-3.5 ${
                commentsCount > 0 ? "text-amber-600" : "text-[#0ABAB5]"
              }`}
            />
            {commentsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse ring-2 ring-white" />
            )}
          </div>
          <span>Comments</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              commentsCount > 0
                ? "bg-amber-500 text-white shadow-2xs"
                : "bg-gray-150 text-gray-600"
            }`}
          >
            {commentsCount}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={onOpenShare}
          className="flex items-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-[#0ABAB5] to-[#089793] hover:from-[#099E9A] hover:to-[#078581] active:scale-[0.98] text-white px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Share</span>
        </button>

        {/* User Info / Avatar */}
        <div className="flex items-center space-x-2 pl-1 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-50 to-teal-100 text-[#089793] font-black text-xs flex items-center justify-center border border-teal-200 shadow-2xs group-hover:ring-2 group-hover:ring-teal-200 transition">
            MC
          </div>
          <span className="hidden xl:inline-block text-xs font-bold text-gray-800">
            Maya Chen
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition hidden sm:inline" />
        </div>
      </div>
    </header>
  );
};
