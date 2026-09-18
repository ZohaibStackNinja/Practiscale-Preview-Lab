"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShareSnapshot, CommentItem, Device } from "@/lib/types";
import { api } from "@/lib/api";
import { YouTubeSimulator } from "@/components/simulator/YouTubeSimulator";
import { InstagramSimulator } from "@/components/simulator/InstagramSimulator";
import { FacebookSimulator } from "@/components/simulator/FacebookSimulator";
import { TikTokSimulator } from "@/components/simulator/TikTokSimulator";
import { LinkedInSimulator } from "@/components/simulator/LinkedInSimulator";
import { GuestCommentPanel } from "@/components/comments/GuestCommentPanel";
import {
  Loader2,
  X,
  Clock,
  Monitor,
  Smartphone,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Tv,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function SharedReviewPage() {
  const params = useParams();
  const router = useRouter();
  const token = String(params?.token || "");

  const [snapshot, setSnapshot] = useState<ShareSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpiredOrRevoked, setIsExpiredOrRevoked] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string>("");

  // Interactive controls for reviewer
  const [activeDevice, setActiveDevice] = useState<Device>("desktop");
  const [isCommentsOpen, setIsCommentsOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchShare = async () => {
      try {
        setLoading(true);
        const data = await api.getShareByToken(token);
        setSnapshot(data);
        if (data.device) {
          setActiveDevice(data.device);
        }
      } catch (err: any) {
        if (
          err.status === 410 ||
          err.code === "SHARE_EXPIRED" ||
          err.code === "SHARE_REVOKED"
        ) {
          setIsExpiredOrRevoked(true);
          setErrorStatus(err.code === "SHARE_REVOKED" ? "revoked" : "expired");
        } else {
          setIsExpiredOrRevoked(true);
          setErrorStatus("not_found");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShare();
  }, [token]);

  const handleCommentAdded = (newComment: CommentItem) => {
    setSnapshot((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        comments: [...prev.comments, newComment],
      };
    });
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-brand-surface flex flex-col items-center justify-center space-y-3 select-none">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-card border border-gray-200/80 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#0ABAB5] animate-spin" />
        </div>
        <p className="text-xs font-bold text-gray-700 tracking-tight">
          Loading shared review workspace...
        </p>
      </div>
    );
  }

  // Expired / Revoked Link Terminal State
  if (isExpiredOrRevoked || !snapshot) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center p-4 select-none">
        <div className="bg-white rounded-3xl border border-brand-border p-8 md:p-10 max-w-md w-full text-center shadow-card space-y-6">
          <div className="w-16 h-16 rounded-full bg-brand-danger-soft/60 flex items-center justify-center mx-auto text-brand-danger shadow-xs">
            <X className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-black text-brand-text-primary">
              {errorStatus === "revoked"
                ? "This preview link is no longer available"
                : "This preview link has expired"}
            </h1>
            <p className="text-xs md:text-sm text-brand-gray mt-2">
              The review window has ended or access was revoked.
            </p>
          </div>

          <div>
            <Link
              href="/"
              className="inline-block w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#0ABAB5] to-[#089793] hover:from-[#099E9A] hover:to-[#078581] text-white font-extrabold text-xs transition shadow-xs"
            >
              Return to PreviewLab
            </Link>
          </div>

          <p className="text-[11px] text-brand-muted">
            Ask the project owner to generate a new review link.
          </p>
        </div>
      </div>
    );
  }

  // Formatted dummy variant object for simulators
  const mockVariant: any = snapshot.variant
    ? {
        _id: snapshot.variant.id,
        name: snapshot.variant.name,
        asset: snapshot.variant.asset,
        width: snapshot.variant.width,
        height: snapshot.variant.height,
      }
    : null;

  const renderSimulator = () => {
    switch (snapshot.platform) {
      case "youtube":
        return (
          <YouTubeSimulator
            device={activeDevice}
            variant={mockVariant}
            projectName={snapshot.projectTitle}
            bannerUrl={snapshot.bannerUrl}
            logoUrl={snapshot.logoUrl}
            shortFrameUrl={snapshot.shortFrameUrl}
          />
        );
      case "instagram":
        return (
          <InstagramSimulator device={activeDevice} variant={mockVariant} />
        );
      case "facebook":
        return (
          <FacebookSimulator device={activeDevice} variant={mockVariant} />
        );
      case "tiktok":
        return <TikTokSimulator device={activeDevice} variant={mockVariant} />;
      case "linkedin":
        return (
          <LinkedInSimulator device={activeDevice} variant={mockVariant} />
        );
      default:
        return (
          <YouTubeSimulator
            device={activeDevice}
            variant={mockVariant}
            projectName={snapshot.projectTitle}
            bannerUrl={snapshot.bannerUrl}
            logoUrl={snapshot.logoUrl}
            shortFrameUrl={snapshot.shortFrameUrl}
          />
        );
    }
  };

  const calculateRemainingHours = () => {
    if (!snapshot.expiresAt) return "";
    const diffMs = new Date(snapshot.expiresAt).getTime() - Date.now();
    if (diffMs <= 0) return "Expired";
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m left`;
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-brand-surface flex flex-col select-none">
      {/* 1. Global Review Top Bar (56px) */}
      <header className="h-14 w-full bg-white border-b border-gray-200/90 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 shadow-2xs">
        {/* Left: Branding & Project Title */}
        <div className="flex items-center space-x-3 min-w-0">
          <Link href="/" className="flex items-center space-x-2 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0ABAB5] to-[#08837E] flex items-center justify-center text-white font-black text-sm shadow-xs group-hover:scale-105 transition">
              P
            </div>
            <span className="font-black text-sm text-gray-900 tracking-tight hidden md:inline">
              PreviewLab
            </span>
          </Link>

          <div className="h-4 w-px bg-gray-200 hidden sm:block" />

          <div className="flex items-center space-x-2 min-w-0">
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[11px] font-bold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Review Mode</span>
            </span>
            <span className="text-xs font-bold text-gray-900 truncate max-w-[140px] sm:max-w-[240px] md:max-w-[320px]">
              {snapshot.projectTitle}
            </span>
          </div>
        </div>

        {/* Center: Beautified Device Selector Switcher */}
        <div className="inline-flex items-center p-1 bg-gray-100/90 rounded-2xl border border-gray-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveDevice("desktop")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeDevice === "desktop"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200/70"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/50"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveDevice("mobile")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeDevice === "mobile"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200/70"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/50"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Platform Badge, Expiry & Feedback Toggle */}
        <div className="flex items-center space-x-2.5 shrink-0">
          {/* Platform Chip */}
          <div className="hidden xl:flex items-center space-x-1.5 text-gray-700 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-200/80 text-xs font-bold">
            <Tv className="w-3.5 h-3.5 text-[#0ABAB5]" />
            <span className="capitalize">{snapshot.platform}</span>
          </div>

          {/* Expiry Pill */}
          {snapshot.expiresAt && (
            <div className="hidden sm:flex items-center space-x-1 text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-xl border border-emerald-200/60 text-xs font-semibold">
              <Clock className="w-3 h-3 text-emerald-600" />
              <span>{calculateRemainingHours()}</span>
            </div>
          )}

          {/* Comments Toggle Button (Desktop) */}
          <button
            type="button"
            onClick={() => setIsCommentsOpen((prev) => !prev)}
            className={`hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
              isCommentsOpen
                ? "bg-[#0ABAB5]/10 text-[#08837E] border-[#0ABAB5]/30 shadow-2xs"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
            title="Toggle comments panel"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Comments</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                isCommentsOpen
                  ? "bg-[#0ABAB5] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {snapshot.comments?.length || 0}
            </span>
          </button>

          {/* Comments Toggle Button (Mobile/Tablet drawer trigger) */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex lg:hidden items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#0ABAB5] text-white shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{snapshot.comments?.length || 0}</span>
          </button>
        </div>
      </header>

      {/* 2. Sub-Bar: Creative Variant Context & Hint (38px) */}
      <div className="h-9.5 w-full bg-white/80 backdrop-blur-xs border-b border-gray-200/70 px-4 sm:px-6 flex items-center justify-between shrink-0 text-xs text-gray-500 z-20">
        <div className="flex items-center space-x-2 truncate">
          <span className="font-bold text-gray-400 text-[11px] uppercase tracking-wider">
            Variant:
          </span>
          <span className="font-extrabold text-gray-900 truncate">
            {snapshot.variant?.name || "Active Creative"}
          </span>
          {snapshot.variant?.width && snapshot.variant?.height && (
            <span className="text-[11px] text-gray-400 hidden sm:inline">
              ({snapshot.variant.width} × {snapshot.variant.height})
            </span>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-1.5 text-gray-400 text-[11px]">
          <Sparkles className="w-3 h-3 text-[#0ABAB5]" />
          <span>Click tabs, search, or videos to test live behavior</span>
        </div>

        <div className="text-[11px] font-semibold text-gray-600 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Guest Reviewer</span>
        </div>
      </div>

      {/* 3. Main Workspace: Center Canvas + Collapsible Feedback Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Central Canvas Simulator */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 flex flex-col items-center justify-start bg-[#F6F8FA] no-scrollbar">
          <div
            className={`w-full transition-all duration-300 ${
              activeDevice === "mobile"
                ? "max-w-md flex justify-center py-2"
                : "max-w-6xl"
            }`}
          >
            {renderSimulator()}
          </div>
        </main>

        {/* Desktop Collapsible Review Panel (w-80 or w-96) */}
        {isCommentsOpen && (
          <aside className="hidden lg:flex w-80 xl:w-96 shrink-0 h-full flex-col z-20 shadow-card">
            <GuestCommentPanel
              token={token}
              comments={snapshot.comments}
              onCommentAdded={handleCommentAdded}
              expiresAt={snapshot.expiresAt}
              device={activeDevice}
              platform={snapshot.platform}
              variantName={snapshot.variant?.name}
              onClose={() => setIsCommentsOpen(false)}
            />
          </aside>
        )}

        {/* Floating reopen feedback button when desktop panel is closed */}
        {!isCommentsOpen && (
          <button
            onClick={() => setIsCommentsOpen(true)}
            className="hidden lg:flex fixed bottom-6 right-6 z-40 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-2xl shadow-2xl items-center space-x-2.5 text-xs font-extrabold transition-all hover:scale-105 active:scale-95 border border-white/10"
          >
            <MessageSquare className="w-4 h-4 text-[#0ABAB5]" />
            <span>Show Feedback</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#0ABAB5] text-white text-[10px] font-black">
              {snapshot.comments?.length || 0}
            </span>
          </button>
        )}

        {/* Mobile / Tablet Slide-over Drawer (< 1024px) */}
        {mobileDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-2xs animate-fadeIn">
            <div
              className="absolute inset-0"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="relative w-full max-w-sm h-full bg-white shadow-2xl flex flex-col z-10 animate-slideLeft">
              <GuestCommentPanel
                token={token}
                comments={snapshot.comments}
                onCommentAdded={handleCommentAdded}
                expiresAt={snapshot.expiresAt}
                device={activeDevice}
                platform={snapshot.platform}
                variantName={snapshot.variant?.name}
                onClose={() => setMobileDrawerOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
