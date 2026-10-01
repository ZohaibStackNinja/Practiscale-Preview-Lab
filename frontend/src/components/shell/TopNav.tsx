"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Share2, Check, Edit2, MessageSquare, ArrowUpRight } from "lucide-react";

interface TopNavProps {
  projectName?: string;
  onRenameProject?: (newName: string) => void;
  onOpenShare?: () => void;
  onOpenReviews?: () => void;
  commentsCount?: number;
  saveStatus?: string;
  isUploadScreen?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  projectName = "Q4 Brand Launch",
  onRenameProject,
  onOpenShare,
  onOpenReviews,
  commentsCount = 0,
  saveStatus = "Saved just now",
  isUploadScreen = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(projectName);

  const handleRenameSubmit = () => {
    setIsEditing(false);
    if (titleInput.trim() && onRenameProject) {
      onRenameProject(titleInput.trim());
    }
  };

  return (
    <header className="h-16 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-5 md:px-10 flex items-center justify-between z-40 select-none sticky top-0">
      {/* Left: Brand Identity */}
      <div className="flex items-center space-x-3">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-[9px] bg-[#00A67E] flex items-center justify-center text-white shadow-sm shadow-[#00A67E]/25 group-hover:bg-[#008B68] transition-colors">
            <span className="font-serif italic font-normal text-xl leading-none tracking-tighter -mt-0.5">
              .p
            </span>
          </div>
          <span className="font-extrabold text-[17px] tracking-tight text-slate-900">
            PreviewLab
          </span>
        </Link>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200/80">
          v1.1
        </span>
      </div>

      {/* Center: Navigation Links (Upload Screen) or Editable Project Name (Workspace) */}
      {isUploadScreen ? (
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <a
            href="#simulator-upload"
            className="hover:text-slate-900 transition-colors"
          >
            Platforms
          </a>
          <a
            href="#features"
            className="hover:text-slate-900 transition-colors"
          >
            Features
          </a>
          <a
            href="#workflow"
            className="hover:text-slate-900 transition-colors"
          >
            Workflow
          </a>
          <a
            href="#metrics"
            className="hover:text-slate-900 transition-colors"
          >
            Insights
          </a>
        </nav>
      ) : (
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <div className="flex items-center space-x-1">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit()}
                autoFocus
                className="text-sm font-semibold text-brand-text-primary bg-slate-50 border border-[#00A67E] rounded-lg px-2.5 py-1 outline-none"
              />
              <button
                onClick={handleRenameSubmit}
                className="p-1 text-[#00A67E] hover:bg-emerald-50 rounded"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setTitleInput(projectName);
                setIsEditing(true);
              }}
              className="flex items-center space-x-1.5 text-sm font-semibold text-slate-800 hover:text-[#00A67E] px-2.5 py-1 rounded-lg hover:bg-slate-50 transition group"
            >
              <span>Project: {projectName}</span>
              <Edit2 className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
            </button>
          )}
        </div>
      )}

      {/* Right: Save Status, Client Reviews Button & Share Action */}
      {!isUploadScreen ? (
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 hidden sm:inline-block font-medium">
            {saveStatus}
          </span>

          {onOpenReviews && (
            <button
              type="button"
              onClick={onOpenReviews}
              className="relative bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
              title="View client review comments"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#00A67E]" />
              <span className="hidden md:inline">Client Reviews</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black transition-all ${
                  commentsCount > 0
                    ? "bg-amber-500 text-white shadow-2xs animate-pulse"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {commentsCount}
              </span>
            </button>
          )}

          <button
            onClick={onOpenShare}
            className="bg-[#00A67E] hover:bg-[#008B68] text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 transition shadow-cta cursor-pointer active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Preview</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <span className="hidden lg:inline-flex items-center space-x-1.5 text-xs font-medium text-slate-500 px-3 py-1.5 rounded-lg hover:text-slate-800 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#00A67E]" />
            <span>Live Simulator</span>
          </span>
          <a
            href="#simulator-upload"
            className="bg-[#00A67E] hover:bg-[#008B68] text-white font-semibold text-xs px-4 py-2.5 rounded-xl inline-flex items-center space-x-1 transition shadow-cta active:scale-95"
          >
            <span>Try Simulator</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </header>
  );
};
