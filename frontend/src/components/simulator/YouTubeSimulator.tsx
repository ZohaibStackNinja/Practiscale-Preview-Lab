"use client";

import React, { useState, useRef, useEffect } from "react";
import { Device, Variant } from "@/lib/types";
import {
  DUMMY_THUMBNAILS,
  REAL_YOUTUBE_VIDEO_POOL,
  extractYouTubeVideoId,
  getYouTubeThumbnailUrl,
} from "@/lib/dummyThumbnails";
import {
  Menu,
  Search,
  Mic,
  Video,
  Bell,
  Home,
  Clock,
  ThumbsUp,
  ThumbsDown,
  ListVideo,
  History,
  User,
  Tv,
  Flame,
  MoreVertical,
  Cast,
  Camera,
  Upload,
  SlidersHorizontal,
  ArrowLeft,
  X,
  CheckCircle2,
  Sparkles,
  Play,
  Plus,
} from "lucide-react";

export interface YouTubeSimulatorProps {
  shortFrameUrl?: string;
  onUploadShort?: () => void;
  device: Device;
  variant: Variant | null;
  projectName?: string;
  customTitle?: string;
  bannerUrl?: string;
  logoUrl?: string;
  isReviewMode?: boolean;
  onUploadBanner?: () => void;
  onUploadLogo?: () => void;
  onUploadThumbnail?: () => void;
  customSlotThumbs?: Record<string, string>;
  onUploadSlotThumbnail?: (file: File, slotId: string) => Promise<string | undefined> | void;
  onResetSlotThumbnail?: (slotId: string) => void;
  primaryVariantUrl?: string;
}

type YouTubeViewMode = "home" | "search" | "channel";
type ChannelTab = "home" | "videos" | "shorts" | "playlists";

const CATEGORIES = [
  "All",
  "Podcasts",
  "Design",
  "Marketing",
  "Technology",
  "AI",
  "Recently uploaded",
  "Watched",
];

export const YouTubeSimulator: React.FC<YouTubeSimulatorProps> = ({
  device,
  variant,
  projectName = "PractiScale Studio",
  customTitle,
  bannerUrl,
  logoUrl,
  shortFrameUrl,
  isReviewMode = false,
  onUploadBanner,
  onUploadLogo,
  onUploadThumbnail,
  onUploadShort,
  customSlotThumbs: externalCustomSlotThumbs,
  onUploadSlotThumbnail,
  onResetSlotThumbnail,
  primaryVariantUrl,
}) => {
  const isEditable = !isReviewMode;
  const [viewMode, setViewMode] = useState<YouTubeViewMode>("home");
  const [channelTab, setChannelTab] = useState<ChannelTab>("videos");
  const [shortsSort, setShortsSort] = useState<"latest" | "popular">("latest");
  const [videoSort, setVideoSort] = useState<"latest" | "popular" | "oldest">(
    "latest"
  );
  const [searchQuery, setSearchQuery] = useState(
    "creative production strategy"
  );
  const [searchInput, setSearchInput] = useState(
    "creative production strategy"
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [ytPoolOffset, setYtPoolOffset] = useState(0);

  const hasUploadedMainThumb = Boolean(variant?.asset?.secureUrl);
  const shortSrc = shortFrameUrl || (variant?.asset?.secureUrl ? variant.asset.secureUrl : "");
  const thumbnailSrc =
    variant?.asset?.secureUrl ||
    REAL_YOUTUBE_VIDEO_POOL[(ytPoolOffset + 17) % REAL_YOUTUBE_VIDEO_POOL.length].thumbUrl;
  const thumbnailName = "Preview Thumbnail";
  const videoTitle =
    customTitle?.trim() ||
    "How Top Creators Design Thumbnails for 20%+ CTR (Full Masterclass)";
  const searchVideoTitle =
    customTitle?.trim() ||
    "The Complete Guide to Creative Production & High-Converting Packaging";

  // Per-video custom thumbnail uploads for all other videos in the feed
  const [internalSlotThumbs, setInternalSlotThumbs] = useState<Record<string, string>>({});
  const customSlotThumbs = { ...internalSlotThumbs, ...(externalCustomSlotThumbs || {}) };
  const [mirrorMainToAll, setMirrorMainToAll] = useState(false);
  const activeSlotIdRef = useRef<string | null>(null);
  const slotFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("practiscale_other_video_thumbs_v1");
      if (saved) {
        setInternalSlotThumbs(JSON.parse(saved));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const triggerSlotUpload = (slotId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isEditable) return;
    activeSlotIdRef.current = slotId;
    slotFileInputRef.current?.click();
  };

  const handleSlotFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const slotId = activeSlotIdRef.current;
    if (!file || !slotId) return;

    if (onUploadSlotThumbnail) {
      onUploadSlotThumbnail(file, slotId);
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) return;
      setInternalSlotThumbs((prev) => {
        const next = { ...prev, [slotId]: dataUrl };
        try {
          window.localStorage.setItem("practiscale_other_video_thumbs_v1", JSON.stringify(next));
        } catch {
          // ignore quota errors
        }
        return next;
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleResetSlotThumb = (slotId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isEditable) return;
    if (onResetSlotThumbnail) {
      onResetSlotThumbnail(slotId);
    }
    setInternalSlotThumbs((prev) => {
      const next = { ...prev };
      delete next[slotId];
      try {
        window.localStorage.setItem("practiscale_other_video_thumbs_v1", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const getYtPreset = (index: number) =>
    REAL_YOUTUBE_VIDEO_POOL[(index + ytPoolOffset) % REAL_YOUTUBE_VIDEO_POOL.length];

  const resolveOtherThumb = (slotId: string, defaultThumb: string) => {
    // When testing this slot's variant as Main, swap the primary variant into this slot for head-to-head A/B comparison!
    if (variant?.notes === `slot:${slotId}` && primaryVariantUrl) {
      return primaryVariantUrl;
    }
    if (customSlotThumbs[slotId]) return customSlotThumbs[slotId];
    if (mirrorMainToAll && thumbnailSrc) return thumbnailSrc;
    return defaultThumb;
  };

  const handleExecuteSearch = (queryToSearch: string) => {
    const q = queryToSearch.trim() || searchQuery;
    setSearchQuery(q);
    setSearchInput(q);
    setViewMode("search");
    setMobileSearchOpen(false);
  };

  const handleClearSearch = () => {
    setSearchInput("");
  };

  const handleGoHome = () => {
    setViewMode("home");
    setMobileSearchOpen(false);
  };

  const handleGoChannel = (tab: ChannelTab = "videos") => {
    setViewMode("channel");
    setChannelTab(tab);
    setMobileSearchOpen(false);
  };

  const mockHomeVideos = [
    {
      id: "user-video",
      isUser: true,
      title: videoTitle,
      channel: projectName || "PractiScale",
      views: "124K views",
      time: "1 hour ago",
      duration: "14:01",
      badge: "YOUR THUMBNAIL",
      gradient: "from-[#00A67E]/20 via-slate-900 to-black",
      category: "Technology",
      defaultThumb: "",
    },
    ...[0, 1, 2, 3, 4].map((idx) => {
      const preset = getYtPreset(idx);
      return {
        id: `comp-${idx + 1}`,
        isUser: false,
        title: preset.title,
        channel: preset.channel,
        views: preset.views,
        time: preset.time,
        duration: preset.duration,
        badge: preset.category.toUpperCase(),
        category: preset.category,
        gradient: "from-slate-900 via-gray-900 to-black",
        defaultThumb: preset.thumbUrl,
      };
    }),
  ];

  const mockSearchResults = [
    {
      id: "search-user-video",
      isUser: true,
      title: searchVideoTitle,
      channel: projectName || "PractiScale",
      views: "124K views",
      time: "1 hour ago",
      duration: "14:01",
      description:
        "High-performance video creative production, thumbnail packaging frameworks, and CTR testing methodology for fast-growing brands.",
      badges: ["YOUR THUMBNAIL", "NEW", "4K"],
      isVerified: true,
      gradient: "from-[#00A67E]/20 via-slate-900 to-black",
      tagline: "YOUR THUMBNAIL",
      defaultThumb: "",
    },
    ...[5, 6, 7].map((idx, i) => {
      const preset = getYtPreset(idx);
      return {
        id: `search-comp-${i + 1}`,
        isUser: false,
        title: preset.title,
        channel: preset.channel,
        views: preset.views,
        time: preset.time,
        duration: preset.duration,
        description: `Complete guide by ${preset.channel} exploring production systems, testing velocity, and actionable creative insights.`,
        badges: [preset.category.toUpperCase(), "4K"],
        isVerified: true,
        gradient: "from-slate-900 via-gray-900 to-black",
        tagline: preset.category.toUpperCase(),
        defaultThumb: preset.thumbUrl,
      };
    }),
  ];

  const mockChannelShorts = [
    {
      id: "chan-short-user",
      isUser: true,
      title: `${videoTitle} #shorts`,
      views: "320K views",
      duration: "0:45",
      popularRank: 2,
      defaultThumb: "",
    },
    {
      id: "chan-short-2",
      isUser: false,
      title: "When Kim Dokja Meets Naruto 😂 🔥 #anime #shorts",
      views: "1.4M views",
      duration: "0:30",
      gradient: "from-rose-600 via-red-700 to-amber-600",
      tagline: "ANIME",
      popularRank: 1,
      defaultThumb: REAL_YOUTUBE_VIDEO_POOL[(ytPoolOffset + 11) % REAL_YOUTUBE_VIDEO_POOL.length].thumbUrl,
    },
    {
      id: "chan-short-3",
      isUser: false,
      title: "It hurts 🥺 💔 3 Video Mistakes Killing Your CTR #shorts",
      views: "890K views",
      duration: "0:52",
      gradient: "from-emerald-600 via-teal-700 to-cyan-800",
      tagline: "CTR KILLER",
      popularRank: 4,
      defaultThumb: REAL_YOUTUBE_VIDEO_POOL[(ytPoolOffset + 12) % REAL_YOUTUBE_VIDEO_POOL.length].thumbUrl,
    },
    {
      id: "chan-short-4",
      isUser: false,
      title: "Reasons To Watch Anime 🥰 💔 #anime #shorts #recommendations",
      views: "640K views",
      duration: "0:25",
      gradient: "from-purple-600 via-indigo-700 to-blue-800",
      tagline: "MUST WATCH",
      popularRank: 5,
      defaultThumb: REAL_YOUTUBE_VIDEO_POOL[(ytPoolOffset + 13) % REAL_YOUTUBE_VIDEO_POOL.length].thumbUrl,
    },
    {
      id: "chan-short-5",
      isUser: false,
      title: "Denji's Search History 👾 #anime #gojo #luffy #humor",
      views: "651K views",
      duration: "0:58",
      gradient: "from-amber-600 via-orange-600 to-pink-700",
      tagline: "SEARCH HISTORY",
      popularRank: 3,
      defaultThumb: REAL_YOUTUBE_VIDEO_POOL[(ytPoolOffset + 14) % REAL_YOUTUBE_VIDEO_POOL.length].thumbUrl,
    },
    {
      id: "chan-short-6",
      isUser: false,
      title: "When He Finally Watches Anime 🐱 #shorts #humor #anime",
      views: "573K views",
      duration: "0:42",
      gradient: "from-cyan-600 via-blue-700 to-indigo-900",
      tagline: "FINALLY",
      popularRank: 6,
      defaultThumb: REAL_YOUTUBE_VIDEO_POOL[(ytPoolOffset + 15) % REAL_YOUTUBE_VIDEO_POOL.length].thumbUrl,
    },
    {
      id: "chan-short-7",
      isUser: false,
      title: "How Top Editors Save 5 Hours Every Day ⚡ #editing #shorts",
      views: "520K views",
      duration: "0:35",
      gradient: "from-blue-600 via-indigo-700 to-violet-800",
      tagline: "PRODUCTIVITY",
      popularRank: 7,
      defaultThumb: REAL_YOUTUBE_VIDEO_POOL[(ytPoolOffset + 16) % REAL_YOUTUBE_VIDEO_POOL.length].thumbUrl,
    },
    {
      id: "chan-short-8",
      isUser: false,
      title: "Turn 1 Longform Video Into 10 Shorts Fast #repurpose #growth",
      views: "480K views",
      duration: "0:48",
      gradient: "from-teal-600 via-emerald-700 to-green-800",
      tagline: "SCALE 10X",
      popularRank: 8,
      defaultThumb: REAL_YOUTUBE_VIDEO_POOL[(ytPoolOffset + 17) % REAL_YOUTUBE_VIDEO_POOL.length].thumbUrl,
    },
    {
      id: "chan-short-9",
      isUser: false,
      title: "AI Prompts for High-Converting Ad Creative #shorts #ai",
      views: "415K views",
      duration: "0:29",
      gradient: "from-fuchsia-600 via-pink-700 to-rose-800",
      tagline: "AI PROMPTS",
      popularRank: 9,
      defaultThumb: REAL_YOUTUBE_VIDEO_POOL[(ytPoolOffset + 18) % REAL_YOUTUBE_VIDEO_POOL.length].thumbUrl,
    },
    {
      id: "chan-short-10",
      isUser: false,
      title: "The 2026 Creative Formula You MUST Know #shorts #strategy",
      views: "380K views",
      duration: "0:51",
      gradient: "from-amber-500 via-red-600 to-purple-800",
      tagline: "FORMULA",
      popularRank: 10,
      defaultThumb: REAL_YOUTUBE_VIDEO_POOL[(ytPoolOffset + 19) % REAL_YOUTUBE_VIDEO_POOL.length].thumbUrl,
    },
  ];

  const sortedChannelShorts = [...mockChannelShorts].sort((a, b) => {
    if (shortsSort === "popular") return a.popularRank - b.popularRank;
    return 0;
  });

  const mockChannelVideos = [
    {
      id: "chan-user-vid",
      isUser: true,
      title: videoTitle,
      views: "124K views",
      time: "1 hour ago",
      duration: "14:01",
      popularRank: 2,
      gradient: "from-[#00A67E]/20 via-slate-900 to-black",
      defaultThumb: "",
    },
    ...[8, 9, 10, 1, 2, 3, 4, 5].map((idx, i) => {
      const preset = getYtPreset(idx);
      return {
        id: `chan-vid-${i + 2}`,
        isUser: false,
        title: preset.title,
        views: preset.views,
        time: preset.time,
        duration: preset.duration,
        popularRank: i === 0 ? 1 : i === 1 ? 3 : i + 3,
        gradient: "from-slate-900 via-gray-900 to-black",
        defaultThumb: preset.thumbUrl,
      };
    }),
  ];

  const sortedChannelVideos = [...mockChannelVideos].sort((a, b) => {
    if (videoSort === "popular") return a.popularRank - b.popularRank;
    if (videoSort === "oldest") return a.isUser ? 1 : -1;
    return 0;
  });

  const mockPlaylists = [
    {
      id: "pl-1",
      title: "Creative Strategy & Performance Masterclasses",
      videoCount: 14,
      updated: "Updated yesterday",
      gradient: "from-teal-900 to-slate-900",
    },
    {
      id: "pl-2",
      title: "Production Frameworks & Growth Playbooks",
      videoCount: 28,
      updated: "Updated last week",
      gradient: "from-blue-900 to-slate-900",
    },
    {
      id: "pl-3",
      title: "Packaging & Title Testing Case Studies",
      videoCount: 9,
      updated: "Updated 2 weeks ago",
      gradient: "from-emerald-900 to-slate-900",
    },
  ];

  /* -------------------------------------------------------------------------- */
  /* MOBILE SIMULATOR VIEW                                                      */
  /* -------------------------------------------------------------------------- */
  if (device === "mobile") {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        {/* Hidden File Input for Other Video Slot Uploads */}
        <input
          type="file"
          ref={slotFileInputRef}
          accept="image/png,image/jpeg,image/webp"
          onChange={handleSlotFileChange}
          className="hidden"
        />

        {/* Mobile View Switcher */}
        <div className="flex items-center space-x-2 mb-3 bg-white p-1 rounded-2xl border border-gray-200 shadow-xs text-xs">
          <button
            type="button"
            onClick={handleGoHome}
            className={`whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewMode === "home"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Home className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Home</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode("search");
              setMobileSearchOpen(true);
            }}
            className={`whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewMode === "search"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Search</span>
          </button>
          <button
            type="button"
            onClick={() => handleGoChannel("videos")}
            className={`whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewMode === "channel"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Tv className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Channel</span>
          </button>
        </div>

        {/* Mobile Phone Mockup */}
        <div className="w-[375px] max-w-full bg-white rounded-[44px] border-[10px] border-[#202628] shadow-2xl overflow-hidden flex flex-col h-[780px] mobile-device-viewport">
          {/* Status Bar */}
          <div className="bg-white px-6 pt-3 pb-2 flex justify-between items-center text-[11px] font-bold text-gray-800 shrink-0">
            <span>9:41</span>
            <div className="w-20 h-4 bg-black rounded-full" />
            <div className="flex items-center space-x-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 border border-gray-800 rounded-sm p-0.5">
                <div className="w-full h-full bg-gray-800 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* YouTube Mobile App Header */}
          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
            <div
              onClick={handleGoHome}
              className="flex items-center space-x-1 cursor-pointer"
            >
              <div className="w-7 h-5 bg-red-600 rounded-lg flex items-center justify-center">
                <Play className="w-2.5 h-2.5 text-white fill-white ml-0.5" />
              </div>
              <span className="font-black text-sm tracking-tighter text-gray-900">
                YouTube
              </span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Cast className="w-4 h-4 cursor-pointer" />
              <Bell className="w-4 h-4 cursor-pointer" />
              <Search
                onClick={() => {
                  setViewMode("search");
                  setMobileSearchOpen(true);
                }}
                className="w-4 h-4 cursor-pointer"
              />
              <div
                onClick={() => handleGoChannel("videos")}
                className="w-6 h-6 rounded-full bg-teal-50 text-[#008B68] font-bold text-[10px] flex items-center justify-center border border-gray-200 overflow-hidden cursor-pointer"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>PS</span>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto bg-gray-100">
            {/* 1. MOBILE HOME FEED */}
            {viewMode === "home" && (
              <div>
                {/* Horizontal Category Chips */}
                <div className="bg-white px-3 py-2 border-b border-gray-100 flex space-x-2 overflow-x-auto no-scrollbar">
                  {CATEGORIES.slice(0, 6).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                        activeCategory === cat
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Video Feed Cards */}
                <div className="space-y-3 pt-2">
                  {/* Primary Video Card */}
                  <div className="bg-white pb-3 shadow-2xs">
                    <div className="relative aspect-video w-full bg-slate-900 overflow-hidden group">
                      <img
                        src={thumbnailSrc}
                        alt="User Thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                        14:01
                      </span>
                      {isEditable && onUploadThumbnail && (
                        <button
                          onClick={onUploadThumbnail}
                          className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1"
                        >
                          <Upload className="w-2.5 h-2.5 text-[#00A67E]" />
                          <span>Replace</span>
                        </button>
                      )}
                    </div>
                    <div className="p-3 flex space-x-3">
                      <div
                        onClick={() => handleGoChannel("videos")}
                        className="w-9 h-9 rounded-full bg-teal-50 text-[#008B68] font-bold text-xs flex items-center justify-center border border-gray-200 overflow-hidden shrink-0 cursor-pointer"
                      >
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt="Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>PS</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                          {videoTitle}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {projectName || "PractiScale"} • 124K views • 1 hour ago
                        </p>
                      </div>
                      <MoreVertical className="w-4 h-4 text-gray-400 shrink-0" />
                    </div>
                  </div>

                  {/* Mobile Shorts Shelf in Feed */}
                  <div className="bg-white py-3 my-2 border-y border-gray-100">
                    <div className="flex items-center justify-between px-3.5 mb-2.5">
                      <div className="flex items-center space-x-1.5">
                        <Flame className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-bold text-gray-900">
                          Shorts
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleGoChannel("shorts")}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        View channel shorts
                      </button>
                    </div>
                    <div className="flex space-x-2 px-3.5 overflow-x-auto no-scrollbar pb-1">
                      {/* User's Short Card */}
                      <div className="w-28 aspect-[9/16] shrink-0 rounded-xl overflow-hidden relative shadow-xs bg-slate-900 ring-2 ring-[#00A67E]">
                        {shortSrc ? (
                          <img
                            src={shortSrc}
                            alt="Short"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-[9px] p-1 text-center font-medium">
                            Short Asset
                          </div>
                        )}
                        {isEditable && onUploadShort && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUploadShort();
                            }}
                            className="absolute top-1.5 left-1.5 bg-black/85 hover:bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow border border-white/20 flex items-center space-x-0.5 z-10 cursor-pointer"
                            title="Upload/Replace Your 9:16 Short"
                          >
                            <Upload className="w-2 h-2 text-[#00A67E]" />
                            <span>↑ Short</span>
                          </button>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2">
                          <p className="text-[9px] font-bold text-white line-clamp-2 leading-tight">
                            {videoTitle} #shorts
                          </p>
                          <span className="text-[8px] text-gray-200 mt-0.5 block">
                            320K views
                          </span>
                        </div>
                      </div>

                      {/* Mock Shorts */}
                      {mockChannelShorts.slice(1).map((s) => {
                        const resolvedThumb = resolveOtherThumb(s.id, s.defaultThumb || "");
                        const hasCustom = Boolean(customSlotThumbs[s.id]);
                        return (
                          <div
                            key={s.id}
                            className={`w-28 aspect-[9/16] shrink-0 rounded-xl overflow-hidden relative shadow-xs ${
                              resolvedThumb ? "bg-slate-900" : `bg-gradient-to-br ${s.gradient}`
                            }`}
                          >
                            {resolvedThumb && (
                              <img
                                src={resolvedThumb}
                                alt={s.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                            {isEditable && (
                              <div className="absolute top-1 right-1 flex items-center space-x-0.5 z-10">
                                <button
                                  type="button"
                                  onClick={(e) => triggerSlotUpload(s.id, e)}
                                  className="bg-black/80 hover:bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow border border-white/20 flex items-center space-x-0.5 cursor-pointer"
                                >
                                  <Upload className="w-2 h-2 text-[#00A67E]" />
                                  <span>{hasCustom ? "Rep" : "Up"}</span>
                                </button>
                                {hasCustom && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleResetSlotThumb(s.id, e)}
                                    className="bg-black/80 hover:bg-rose-600 text-white p-0.5 rounded-full shadow border border-white/20 cursor-pointer"
                                  >
                                    <X className="w-2 h-2" />
                                  </button>
                                )}
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2">
                              <p className="text-[9px] font-bold text-white line-clamp-2 leading-tight">
                                {s.title}
                              </p>
                              <span className="text-[8px] text-gray-200 mt-0.5 block">
                                {s.views}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Competitor Video Cards */}
                  {mockHomeVideos
                    .filter((v) => !v.isUser)
                    .map((video) => {
                      const resolvedThumb = resolveOtherThumb(video.id, video.defaultThumb);
                      const hasCustom = Boolean(customSlotThumbs[video.id]);
                      return (
                        <div key={video.id} className="bg-white pb-3 shadow-2xs">
                          <div className="relative aspect-video w-full bg-slate-900 overflow-hidden group">
                            <img
                              src={resolvedThumb}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                              {video.duration}
                            </span>
                            {isEditable && (
                              <div className="absolute top-2 right-2 flex items-center space-x-1">
                                <button
                                  type="button"
                                  onClick={(e) => triggerSlotUpload(video.id, e)}
                                  className="bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1 cursor-pointer"
                                >
                                  <Upload className="w-2.5 h-2.5 text-[#00A67E]" />
                                  <span>{hasCustom ? "Replace" : "Upload"}</span>
                                </button>
                                {hasCustom && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleResetSlotThumb(video.id, e)}
                                    className="bg-black/80 hover:bg-rose-600 text-white p-1 rounded-full shadow border border-white/20 cursor-pointer"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="p-3 flex space-x-3">
                            <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {video.channel.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                                {video.title}
                              </h3>
                              <p className="text-[11px] text-gray-500 mt-1">
                                {video.channel} • {video.views} • {video.time}
                              </p>
                            </div>
                            <MoreVertical className="w-4 h-4 text-gray-400 shrink-0" />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 2. MOBILE SEARCH RESULTS */}
            {viewMode === "search" && (
              <div className="p-3 space-y-4">
                {/* Search Bar Input Modal / Inline */}
                <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl shadow-2xs border border-gray-200">
                  <ArrowLeft
                    onClick={handleGoHome}
                    className="w-4 h-4 text-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleExecuteSearch(searchInput);
                    }}
                    placeholder="Search YouTube"
                    className="flex-1 text-xs outline-none bg-transparent"
                  />
                  {searchInput && (
                    <X
                      onClick={handleClearSearch}
                      className="w-3.5 h-3.5 text-gray-400 cursor-pointer"
                    />
                  )}
                  <Search
                    onClick={() => handleExecuteSearch(searchInput)}
                    className="w-4 h-4 text-gray-600 cursor-pointer"
                  />
                </div>

                {/* Search Results List */}
                <div className="space-y-4">
                  {mockSearchResults.map((result) => {
                    const isUser = result.isUser;
                    const resolvedThumb = isUser
                      ? thumbnailSrc
                      : resolveOtherThumb(result.id, result.defaultThumb);
                    const hasCustom = Boolean(customSlotThumbs[result.id]);

                    return (
                      <div
                        key={result.id}
                        className="bg-white rounded-2xl overflow-hidden shadow-2xs border border-gray-100"
                      >
                        <div className="relative aspect-video w-full bg-slate-900">
                          <img
                            src={resolvedThumb}
                            alt={result.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                            {result.duration}
                          </span>
                          {isUser && isEditable && onUploadThumbnail && (
                            <button
                              onClick={onUploadThumbnail}
                              className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1"
                            >
                              <Upload className="w-2.5 h-2.5 text-[#00A67E]" />
                              <span>Replace</span>
                            </button>
                          )}
                          {!isUser && isEditable && (
                            <div className="absolute top-2 right-2 flex items-center space-x-1">
                              <button
                                type="button"
                                onClick={(e) => triggerSlotUpload(result.id, e)}
                                className="bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1 cursor-pointer"
                              >
                                <Upload className="w-2.5 h-2.5 text-[#00A67E]" />
                                <span>{hasCustom ? "Replace" : "Upload"}</span>
                              </button>
                              {hasCustom && (
                                <button
                                  type="button"
                                  onClick={(e) => handleResetSlotThumb(result.id, e)}
                                  className="bg-black/80 hover:bg-rose-600 text-white p-1 rounded-full shadow border border-white/20 cursor-pointer"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                            {result.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-1">
                            {result.channel} • {result.views} • {result.time}
                          </p>
                          <p className="text-[10px] text-gray-600 mt-1.5 line-clamp-2">
                            {result.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. MOBILE CHANNEL PAGE */}
            {viewMode === "channel" && (
              <div>
                {/* Channel Banner */}
                <div className="relative aspect-[16/5] w-full bg-slate-800 overflow-hidden">
                  {bannerUrl ? (
                    <img
                      src={bannerUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-teal-900 via-slate-900 to-black text-gray-400 text-xs font-medium">
                      Channel Banner
                    </div>
                  )}
                  {isEditable && onUploadBanner && (
                    <button
                      onClick={onUploadBanner}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1"
                    >
                      <Camera className="w-3 h-3 text-[#00A67E]" />
                      <span>Edit Banner</span>
                    </button>
                  )}
                </div>

                {/* Channel Header Profile */}
                <div className="bg-white p-3.5 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-teal-50 text-[#008B68] font-black text-lg flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt="Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>PS</span>
                        )}
                      </div>
                      {isEditable && onUploadLogo && (
                        <button
                          onClick={onUploadLogo}
                          className="absolute -bottom-1 -right-1 bg-black text-white p-1 rounded-full shadow border border-white"
                        >
                          <Camera className="w-2.5 h-2.5 text-[#00A67E]" />
                        </button>
                      )}
                    </div>
                    <button className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow transition">
                      Subscribe
                    </button>
                  </div>

                  <h2 className="text-base font-extrabold text-gray-900 mt-2">
                    {projectName || "PractiScale Studio"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-medium">
                    @{projectName?.toLowerCase().replace(/\s+/g, "") || "practiscale"} • 840K subscribers • 142 videos
                  </p>
                  <p className="text-[11px] text-gray-700 mt-1 line-clamp-2">
                    The creative testing, thumbnail packaging, and production velocity lab for top creators.
                  </p>

                  {/* Channel Tabs */}
                  <div className="flex space-x-6 border-b border-gray-200 mt-3 text-xs font-semibold text-gray-500">
                    <button
                      onClick={() => setChannelTab("videos")}
                      className={`py-2.5 relative whitespace-nowrap transition-colors ${
                        channelTab === "videos"
                          ? "text-black font-bold"
                          : "hover:text-black"
                      }`}
                    >
                      Videos
                      {channelTab === "videos" && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                      )}
                    </button>
                    <button
                      onClick={() => setChannelTab("shorts")}
                      className={`py-2.5 relative whitespace-nowrap transition-colors ${
                        channelTab === "shorts"
                          ? "text-black font-bold"
                          : "hover:text-black"
                      }`}
                    >
                      Shorts
                      {channelTab === "shorts" && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                      )}
                    </button>
                    <button
                      onClick={() => setChannelTab("home")}
                      className={`py-2.5 relative whitespace-nowrap transition-colors ${
                        channelTab === "home"
                          ? "text-black font-bold"
                          : "hover:text-black"
                      }`}
                    >
                      Home
                      {channelTab === "home" && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                      )}
                    </button>
                    <button
                      onClick={() => setChannelTab("playlists")}
                      className={`py-2.5 relative whitespace-nowrap transition-colors ${
                        channelTab === "playlists"
                          ? "text-black font-bold"
                          : "hover:text-black"
                      }`}
                    >
                      Playlists
                      {channelTab === "playlists" && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 3A. CHANNEL VIDEOS TAB */}
                {channelTab === "videos" && (
                  <div>
                    {/* Sort Filter Chips */}
                    <div className="flex items-center space-x-2 px-3.5 py-2 bg-white border-b border-gray-100">
                      <button
                        onClick={() => setVideoSort("latest")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          videoSort === "latest"
                            ? "bg-black text-white shadow-xs"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Latest
                      </button>
                      <button
                        onClick={() => setVideoSort("popular")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          videoSort === "popular"
                            ? "bg-black text-white shadow-xs"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Popular
                      </button>
                    </div>

                    {/* Videos Grid */}
                    <div className="p-3 space-y-3">
                      {sortedChannelVideos.map((video) => {
                        const isUser = video.isUser;
                        const resolvedThumb = isUser
                          ? thumbnailSrc
                          : resolveOtherThumb(video.id, video.defaultThumb);
                        const hasCustom = Boolean(customSlotThumbs[video.id]);

                        return (
                          <div
                            key={video.id}
                            className="bg-white rounded-xl overflow-hidden shadow-2xs border border-gray-100 flex space-x-3 p-2.5"
                          >
                            <div className="relative aspect-video w-36 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                              <img
                                src={resolvedThumb}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute bottom-1 right-1 bg-black/85 text-white text-[9px] px-1 py-0.5 rounded font-mono font-bold">
                                {video.duration}
                              </span>
                              {isUser && isEditable && onUploadThumbnail && (
                                <button
                                  onClick={onUploadThumbnail}
                                  className="absolute top-1 left-1 bg-black/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow border border-white/20"
                                >
                                  Replace
                                </button>
                              )}
                              {!isUser && isEditable && (
                                <button
                                  type="button"
                                  onClick={(e) => triggerSlotUpload(video.id, e)}
                                  className="absolute top-1 left-1 bg-black/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow border border-white/20"
                                >
                                  {hasCustom ? "Replace" : "Upload"}
                                </button>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                              <div>
                                <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">
                                  {video.title}
                                </h4>
                                <p className="text-[11px] text-gray-500 mt-1">
                                  {video.views} • {video.time}
                                </p>
                              </div>
                              <MoreVertical className="w-3.5 h-3.5 text-gray-400 self-end" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3B. CHANNEL SHORTS TAB */}
                {channelTab === "shorts" && (
                  <div>
                    {/* Sort Filter Chips */}
                    <div className="flex items-center space-x-2 px-3.5 py-2 bg-white border-b border-gray-100">
                      <button
                        onClick={() => setShortsSort("latest")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          shortsSort === "latest"
                            ? "bg-black text-white shadow-xs"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Latest
                      </button>
                      <button
                        onClick={() => setShortsSort("popular")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          shortsSort === "popular"
                            ? "bg-black text-white shadow-xs"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Popular
                      </button>
                    </div>

                    {/* 3-Column Native YouTube Mobile Shorts Grid */}
                    <div className="p-1.5 grid grid-cols-3 gap-1.5 pb-6">
                      {sortedChannelShorts.map((short) => {
                        if (short.isUser) {
                          return (
                            <div
                              key={short.id}
                              className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 group shadow-xs border border-gray-200"
                            >
                              {shortSrc ? (
                                <img
                                  src={shortSrc}
                                  alt={short.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] p-2 text-center">
                                  Short Frame
                                </div>
                              )}

                              {/* Upload hotspot button */}
                              {isEditable && onUploadShort && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onUploadShort();
                                  }}
                                  title="Click to upload/replace 9:16 short asset"
                                  className="absolute top-1.5 left-1.5 bg-black/85 hover:bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-md border border-white/20 flex items-center space-x-1 z-10 transition active:scale-95 cursor-pointer"
                                >
                                  <Upload className="w-2.5 h-2.5 text-[#00A67E]" />
                                  <span>Upload</span>
                                </button>
                              )}

                              {/* Shorts bottom overlay */}
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 flex flex-col justify-end">
                                <h4 className="text-[10px] font-bold text-white line-clamp-2 leading-tight">
                                  {short.title}
                                </h4>
                                <span className="text-[9px] text-gray-200 font-semibold mt-0.5">
                                  {short.views}
                                </span>
                              </div>
                            </div>
                          );
                        }

                        const resolvedThumb = resolveOtherThumb(short.id, short.defaultThumb || "");
                        const hasCustom = Boolean(customSlotThumbs[short.id]);

                        return (
                          <div
                            key={short.id}
                            className={`relative aspect-[9/16] rounded-xl overflow-hidden shadow-xs border border-gray-200 p-2 flex flex-col justify-between ${
                              resolvedThumb ? "bg-slate-900" : `bg-gradient-to-br ${short.gradient}`
                            }`}
                          >
                            {resolvedThumb && (
                              <img
                                src={resolvedThumb}
                                alt={short.title}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            )}
                            <div className="relative z-10 flex justify-between items-start">
                              <span className="text-[7px] font-black uppercase text-white/90 bg-black/40 px-1 py-0.5 rounded">
                                {short.tagline || "SHORT"}
                              </span>
                              {isEditable && (
                                <div className="flex items-center space-x-0.5">
                                  <button
                                    type="button"
                                    onClick={(e) => triggerSlotUpload(short.id, e)}
                                    className="bg-black/80 hover:bg-black text-white text-[7px] font-bold px-1 py-0.5 rounded-full shadow border border-white/20 cursor-pointer"
                                  >
                                    {hasCustom ? "Rep" : "Up"}
                                  </button>
                                  {hasCustom && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleResetSlotThumb(short.id, e)}
                                      className="bg-black/80 hover:bg-rose-600 text-white p-0.5 rounded-full shadow border border-white/20 cursor-pointer"
                                    >
                                      <X className="w-2 h-2" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 flex flex-col justify-end z-10">
                              <h4 className="text-[10px] font-bold text-white line-clamp-2 leading-tight">
                                {short.title}
                              </h4>
                              <span className="text-[9px] text-gray-200 font-semibold mt-0.5">
                                {short.views}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3C. CHANNEL HOME TAB */}
                {channelTab === "home" && (
                  <div className="space-y-3 pt-2">
                    <div className="bg-white pb-3 shadow-2xs">
                      <div className="relative aspect-video w-full bg-slate-900">
                        <img
                          src={thumbnailSrc}
                          alt="Thumb"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                          Channel Trailer
                        </span>
                        <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                          14:01
                        </span>
                      </div>
                      <div className="px-3.5 py-3">
                        <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                          {videoTitle}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {projectName || "PractiScale"} • 124K views • 1 hour ago
                        </p>
                      </div>
                    </div>

                    {/* Shorts Shelf in Channel Home */}
                    <div className="bg-white py-3 border-y border-gray-100">
                      <div className="flex items-center justify-between px-3.5 mb-2.5">
                        <div className="flex items-center space-x-1.5">
                          <Flame className="w-4 h-4 text-red-600" />
                          <span className="text-xs font-bold text-gray-900">
                            Shorts
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setChannelTab("shorts")}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          View all
                        </button>
                      </div>
                      <div className="flex space-x-2 px-3.5 overflow-x-auto no-scrollbar pb-1">
                        {sortedChannelShorts.slice(0, 4).map((short) => (
                          <div
                            key={short.id}
                            className={`w-28 aspect-[9/16] shrink-0 rounded-xl overflow-hidden relative shadow-xs ${
                              short.isUser
                                ? "bg-slate-900"
                                : `bg-gradient-to-br ${short.gradient}`
                            }`}
                          >
                            {short.isUser && shortSrc && (
                              <img
                                src={shortSrc}
                                alt={short.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2">
                              <p className="text-[9px] font-bold text-white line-clamp-2 leading-tight">
                                {short.title}
                              </p>
                              <span className="text-[8px] text-gray-200 mt-0.5 block">
                                {short.views}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Featured Releases */}
                    <div className="bg-white p-3 space-y-3">
                      <h4 className="text-xs font-bold text-gray-900">Featured releases</h4>
                      {sortedChannelVideos
                        .filter((v) => !v.isUser)
                        .slice(0, 3)
                        .map((video) => (
                          <div
                            key={video.id}
                            className="flex space-x-3 items-center border-t border-gray-100 pt-2.5"
                          >
                            <div className="relative aspect-video w-28 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                              <img
                                src={resolveOtherThumb(video.id, video.defaultThumb)}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-[11px] font-bold text-gray-900 line-clamp-2 leading-tight">
                                {video.title}
                              </h5>
                              <span className="text-[10px] text-gray-500 mt-0.5 block">
                                {video.views}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* 3C. CHANNEL PLAYLISTS TAB */}
                {channelTab === "playlists" && (
                  <div className="p-3 space-y-3">
                    {mockPlaylists.map((pl) => (
                      <div
                        key={pl.id}
                        className="bg-white rounded-xl overflow-hidden shadow-2xs border border-gray-100 flex space-x-3 p-2.5"
                      >
                        <div className={`w-28 aspect-video rounded-lg bg-gradient-to-br ${pl.gradient} flex items-center justify-center text-white shrink-0 relative`}>
                          <ListVideo className="w-5 h-5 text-white/90" />
                          <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] px-1 py-0.5 rounded font-bold">
                            {pl.videoCount}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-2">
                            {pl.title}
                          </h4>
                          <span className="text-[10px] text-gray-500 mt-1">
                            {pl.updated}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Bottom Tab Bar */}
          <div className="h-12 border-t border-gray-200 bg-white flex justify-around items-center text-gray-700 text-[10px] shrink-0">
            <button
              onClick={handleGoHome}
              className={`flex flex-col items-center ${
                viewMode === "home" ? "text-black font-bold" : "text-gray-500"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <div className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-base font-medium">
              +
            </div>
            <button
              onClick={() => {
                setViewMode("search");
                setMobileSearchOpen(true);
              }}
              className={`flex flex-col items-center ${
                viewMode === "search" ? "text-black font-bold" : "text-gray-500"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button
              onClick={() => handleGoChannel("videos")}
              className={`flex flex-col items-center ${
                viewMode === "channel" ? "text-black font-bold" : "text-gray-500"
              }`}
            >
              <User className="w-4 h-4" />
              <span>You</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* DESKTOP SIMULATOR VIEW                                                     */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="bg-[#f9f9f9] min-h-[820px] rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Hidden File Input for Other Video Slot Uploads */}
      <input
        type="file"
        ref={slotFileInputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={handleSlotFileChange}
        className="hidden"
      />

      {/* Top Simulator Viewport Mode Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 flex-wrap">
        <div className="flex items-center space-x-2 shrink-0 flex-wrap gap-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mr-1">
            Simulate View:
          </span>
          <div className="inline-flex rounded-xl bg-gray-100 p-0.5 border border-gray-200/80 shadow-2xs">
            <button
              type="button"
              onClick={handleGoHome}
              className={`whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                viewMode === "home"
                  ? "bg-white text-gray-900 shadow-xs border border-gray-200/80 ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
              }`}
            >
              <Home
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                  viewMode === "home" ? "text-red-600" : "text-gray-400"
                }`}
              />
              <span className="whitespace-nowrap">Home Feed</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("search")}
              className={`whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                viewMode === "search"
                  ? "bg-white text-gray-900 shadow-xs border border-gray-200/80 ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
              }`}
            >
              <Search
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                  viewMode === "search" ? "text-red-600" : "text-gray-400"
                }`}
              />
              <span className="whitespace-nowrap">Search Results</span>
            </button>
            <button
              type="button"
              onClick={() => handleGoChannel("videos")}
              className={`whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                viewMode === "channel"
                  ? "bg-white text-gray-900 shadow-xs border border-gray-200/80 ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
              }`}
            >
              <Tv
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                  viewMode === "channel" ? "text-red-600" : "text-gray-400"
                }`}
              />
              <span className="whitespace-nowrap">Channel Page</span>
            </button>
          </div>
        </div>

        {/* Real YouTube Controls (Shuffle & Mirror) */}
        {isEditable && (
          <div className="flex items-center space-x-2 shrink-0 flex-wrap gap-y-1">
            <button
              type="button"
              onClick={() => setYtPoolOffset((prev) => (prev + 3) % REAL_YOUTUBE_VIDEO_POOL.length)}
              className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center space-x-1.5 cursor-pointer border bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              title="Load another set of real YouTube thumbnails from i.ytimg.com"
            >
              <span>▶ Shuffle Real YouTube Thumbs</span>
            </button>

            {thumbnailSrc && (
              <button
                type="button"
                onClick={() => setMirrorMainToAll((prev) => !prev)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center space-x-1.5 cursor-pointer border ${
                  mirrorMainToAll
                    ? "bg-[#00A67E] text-white border-[#00A67E] shadow-2xs"
                    : "bg-gray-50 hover:bg-[#E6F7F3]/60 text-gray-700 hover:text-[#008B68] border-gray-200"
                }`}
                title="Show your active thumbnail across all video slots in the feed"
              >
                <Sparkles className="w-3 h-3" />
                <span>{mirrorMainToAll ? "Showing Your Thumb on All" : "Show My Thumb on All"}</span>
              </button>
            )}
          </div>
        )}

        <div className="hidden 2xl:flex items-center space-x-2 text-[11px] text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-200/60 max-w-xs truncate shrink min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-[#00A67E] shrink-0" />
          <span className="truncate">
            {viewMode === "home"
              ? "Previewing your thumbnail in the multi-column YouTube Home algorithm feed"
              : viewMode === "search"
                ? "Previewing your thumbnail in horizontal search ranking cards"
                : "Previewing your channel layout, banner, and video tabs"}
          </span>
        </div>
      </div>

      {/* 1. YouTube Top Bar (56px) */}
      <div className="h-14 px-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <div
            onClick={handleGoHome}
            className="flex items-center space-x-1 cursor-pointer select-none"
          >
            <div className="w-8 h-5 bg-red-600 rounded-lg flex items-center justify-center">
              <Play className="w-3 h-3 text-white fill-white ml-0.5" />
            </div>
            <span className="font-bold text-lg tracking-tighter text-gray-900">
              YouTube
            </span>
            <span className="text-[10px] text-gray-500 font-semibold self-start ml-0.5">
              US
            </span>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="flex items-center flex-1 max-w-xl mx-8">
          <div className="flex items-center w-full border border-gray-300 rounded-l-full px-4 py-2 focus-within:border-blue-500 shadow-inner bg-white">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleExecuteSearch(searchInput);
              }}
              placeholder="Search"
              className="w-full text-sm outline-none bg-transparent text-gray-800"
            />
            {searchInput && (
              <X
                onClick={handleClearSearch}
                className="w-4 h-4 text-gray-400 hover:text-gray-700 cursor-pointer"
              />
            )}
          </div>
          <button
            onClick={() => handleExecuteSearch(searchInput)}
            className="bg-gray-100 hover:bg-gray-200 border border-l-0 border-gray-300 rounded-r-full px-5 py-2 transition"
          >
            <Search className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 ml-3 bg-gray-100 hover:bg-gray-200 rounded-full transition">
            <Mic className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3 text-gray-700">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full" />
          </button>
          <div
            onClick={() => handleGoChannel("videos")}
            className="w-8 h-8 rounded-full bg-teal-50 text-[#008B68] font-bold text-xs flex items-center justify-center border border-gray-300 overflow-hidden cursor-pointer"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>PS</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-56 border-r border-gray-200 bg-white p-3 space-y-4 select-none shrink-0 overflow-y-auto hidden md:block">
          <div className="space-y-0.5">
            <button
              onClick={handleGoHome}
              className={`w-full flex items-center space-x-5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                viewMode === "home"
                  ? "bg-gray-100 text-gray-900 font-bold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setViewMode("home")}
              className="w-full flex items-center space-x-5 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <Tv className="w-4 h-4" />
              <span>Subscriptions</span>
            </button>
          </div>

          <div className="h-[1px] bg-gray-200" />

          <div className="space-y-0.5">
            <span className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              You
            </span>
            <button
              onClick={() => handleGoChannel()}
              className={`w-full flex items-center space-x-5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                viewMode === "channel"
                  ? "bg-gray-100 text-gray-900 font-bold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Your channel</span>
            </button>
            <div className="flex items-center space-x-5 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-xs text-gray-700 cursor-pointer">
              <History className="w-4 h-4" />
              <span>History</span>
            </div>
            <div className="flex items-center space-x-5 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-xs text-gray-700 cursor-pointer">
              <ListVideo className="w-4 h-4" />
              <span>Playlists</span>
            </div>
            <div className="flex items-center space-x-5 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-xs text-gray-700 cursor-pointer">
              <Clock className="w-4 h-4" />
              <span>Watch later</span>
            </div>
            <div className="flex items-center space-x-5 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-xs text-gray-700 cursor-pointer">
              <ThumbsUp className="w-4 h-4" />
              <span>Liked videos</span>
            </div>
          </div>
        </aside>

        {/* Dynamic Center Stage */}
        <div className="flex-1 overflow-y-auto bg-white">
          {/* ================================================================ */}
          {/* VIEW 1: YOUTUBE HOME FEED                                        */}
          {/* ================================================================ */}
          {viewMode === "home" && (
            <div className="p-6">
              {/* Category Filter Chips */}
              <div className="flex items-center space-x-2.5 mb-6 overflow-x-auto no-scrollbar pb-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                      activeCategory === cat
                        ? "bg-black text-white shadow-xs"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Multi-Column Home Feed Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8">
                {/* 1A. User's Thumbnail Card */}
                <div className="flex flex-col group cursor-pointer">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-sm hover:shadow-md transition">
                    <img
                      src={thumbnailSrc}
                      alt={thumbnailName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] font-mono font-bold px-1.5 py-0.5 rounded">
                      14:01
                    </span>

                    {/* Upload Hotspot */}
                    {isEditable && onUploadThumbnail && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUploadThumbnail();
                        }}
                        className="absolute top-2.5 left-2.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1.5 transition active:scale-95 z-10"
                        title="Upload/Replace Your Thumbnail"
                      >
                        <Upload className="w-3 h-3 text-[#00A67E]" />
                        <span>{variant?.notes?.startsWith("slot:") ? `Testing ${variant.name}` : "Your Thumbnail"}</span>
                      </button>
                    )}
                    {variant?.notes?.startsWith("slot:") && (
                      <span className="absolute bottom-2 left-2.5 bg-[#00A67E] text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow-sm z-10">
                        Testing as Main Video
                      </span>
                    )}
                  </div>

                  {/* Card Meta */}
                  <div className="flex space-x-3 mt-3">
                    <div
                      onClick={() => handleGoChannel("videos")}
                      className="w-9 h-9 rounded-full bg-teal-50 text-[#008B68] font-bold text-xs flex items-center justify-center border border-gray-300 overflow-hidden shrink-0 cursor-pointer"
                    >
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="Logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>PS</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition">
                        {videoTitle}
                      </h3>
                      <div className="flex items-center space-x-1.5 mt-1 text-xs text-gray-600">
                        <span
                          onClick={() => handleGoChannel("videos")}
                          className="hover:text-gray-900 cursor-pointer"
                        >
                          {projectName || "PractiScale Studio"}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-gray-500 fill-gray-500" />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        124K views • 1 hour ago
                      </p>
                    </div>
                  </div>
                </div>

                {/* 1B. Competitor Mock Cards */}
                {mockHomeVideos
                  .filter((v) => !v.isUser)
                  .map((video) => {
                    const resolvedThumb = resolveOtherThumb(video.id, video.defaultThumb);
                    const hasCustom = Boolean(customSlotThumbs[video.id]);

                    return (
                      <div
                        key={video.id}
                        className="flex flex-col group cursor-pointer"
                      >
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-sm hover:shadow-md transition">
                          <img
                            src={resolvedThumb}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                          />
                          <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] font-mono font-bold px-1.5 py-0.5 rounded">
                            {video.duration}
                          </span>

                          {/* Upload Slot Hotspot */}
                          {isEditable && (
                            <div className="absolute top-2.5 left-2.5 flex items-center space-x-1 z-10">
                              <button
                                type="button"
                                onClick={(e) => triggerSlotUpload(video.id, e)}
                                className="bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1.5 transition active:scale-95 cursor-pointer"
                                title="Click to upload a custom thumbnail on this video"
                              >
                                <Upload className="w-3 h-3 text-[#00A67E]" />
                                <span>{hasCustom ? "Replace" : "Upload"}</span>
                              </button>
                              {hasCustom && (
                                <button
                                  type="button"
                                  onClick={(e) => handleResetSlotThumb(video.id, e)}
                                  className="bg-black/80 hover:bg-rose-600 text-white p-1 rounded-full shadow border border-white/20 transition cursor-pointer"
                                  title="Reset to default dummy thumbnail"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          )}

                          {variant?.notes === `slot:${video.id}` && primaryVariantUrl ? (
                            <span className="absolute bottom-2 left-2.5 bg-[#00A67E] text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow-sm pointer-events-none z-10">
                              Swapped with Main
                            </span>
                          ) : !hasCustom && !mirrorMainToAll ? (
                            <span className="absolute bottom-2 left-2.5 bg-black/75 backdrop-blur-xs text-teal-300 border border-white/15 text-[9px] font-bold px-2 py-0.5 rounded pointer-events-none">
                              Dummy Thumbnail
                            </span>
                          ) : null}
                        </div>

                        {/* Card Meta */}
                        <div className="flex space-x-3 mt-3">
                          <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {video.channel.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition">
                              {video.title}
                            </h3>
                            <div className="flex items-center space-x-1.5 mt-1 text-xs text-gray-600">
                              <span className="hover:text-gray-900">
                                {video.channel}
                              </span>
                              <CheckCircle2 className="w-3 h-3 text-gray-500 fill-gray-500" />
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {video.views} • {video.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* YouTube Shorts Shelf in Feed */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Flame className="w-5 h-5 text-red-600" />
                  <h3 className="text-base font-bold text-gray-900">Shorts</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {/* User's Short Card */}
                  <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-[9/16] relative ring-2 ring-[#00A67E] shadow-sm group">
                    {shortSrc ? (
                      <img
                        src={shortSrc}
                        alt="Short"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
                        Short Asset
                      </div>
                    )}
                    {isEditable && onUploadShort && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUploadShort();
                        }}
                        className="absolute top-2.5 left-2.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1 z-10 cursor-pointer"
                        title="Upload/Replace Your 9:16 Short"
                      >
                        <Upload className="w-2.5 h-2.5 text-[#00A67E]" />
                        <span>↑ Short</span>
                      </button>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 text-white">
                      <p className="text-xs font-bold line-clamp-2 leading-tight">
                        {videoTitle} #shorts
                      </p>
                      <span className="text-[10px] text-gray-300 mt-0.5 block">
                        320K views
                      </span>
                    </div>
                  </div>

                  {/* Competitor / Channel Shorts */}
                  {mockChannelShorts.slice(1).map((s) => {
                    const resolvedThumb = resolveOtherThumb(s.id, s.defaultThumb || "");
                    const hasCustom = Boolean(customSlotThumbs[s.id]);
                    return (
                      <div
                        key={s.id}
                        className={`rounded-2xl overflow-hidden aspect-[9/16] relative group shadow-xs ${
                          resolvedThumb ? "bg-slate-900" : `bg-gradient-to-br ${s.gradient}`
                        }`}
                      >
                        {resolvedThumb && (
                          <img
                            src={resolvedThumb}
                            alt={s.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                          />
                        )}
                        {isEditable && (
                          <div className="absolute top-2 right-2 flex items-center space-x-1 z-10">
                            <button
                              type="button"
                              onClick={(e) => triggerSlotUpload(s.id, e)}
                              className="bg-black/80 hover:bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow border border-white/20 flex items-center space-x-1 cursor-pointer"
                              title="Upload custom thumbnail for this short"
                            >
                              <Upload className="w-2.5 h-2.5 text-[#00A67E]" />
                              <span>{hasCustom ? "Replace" : "Upload"}</span>
                            </button>
                            {hasCustom && (
                              <button
                                type="button"
                                onClick={(e) => handleResetSlotThumb(s.id, e)}
                                className="bg-black/80 hover:bg-rose-600 text-white p-1 rounded-full shadow border border-white/20 cursor-pointer"
                                title="Reset to default dummy thumbnail"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 text-white">
                          <p className="text-xs font-bold line-clamp-2 leading-tight">
                            {s.title}
                          </p>
                          <span className="text-[10px] text-gray-300 mt-0.5 block">
                            {s.views}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* VIEW 2: YOUTUBE SEARCH RESULTS                                   */}
          {/* ================================================================ */}
          {viewMode === "search" && (
            <div className="p-6 max-w-5xl">
              {/* Search Filters Row */}
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200">
                <span className="text-xs text-gray-500 font-medium">
                  About 14,200 results for &quot;<span className="font-bold text-gray-800">{searchQuery}</span>&quot;
                </span>
                <button className="flex items-center space-x-1.5 text-xs font-semibold text-gray-700 hover:text-black">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Horizontal Search Cards List */}
              <div className="space-y-5">
                {mockSearchResults.map((video) => {
                  const isUser = video.isUser;
                  const resolvedThumb = isUser
                    ? thumbnailSrc
                    : resolveOtherThumb(video.id, video.defaultThumb);
                  const hasCustom = Boolean(customSlotThumbs[video.id]);

                  return (
                    <div
                      key={video.id}
                      className="flex flex-col sm:flex-row gap-4 p-3 rounded-2xl hover:bg-gray-50 transition border border-transparent hover:border-gray-200 group cursor-pointer"
                    >
                      {/* Left Thumbnail Aspect 16:9 */}
                      <div className="relative w-full sm:w-80 md:w-96 aspect-video rounded-2xl overflow-hidden bg-slate-900 shrink-0 shadow-sm">
                        <img
                          src={resolvedThumb}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                        />
                        <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] font-mono font-bold px-1.5 py-0.5 rounded">
                          {video.duration}
                        </span>

                        {isUser && isEditable && onUploadThumbnail && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUploadThumbnail();
                            }}
                            className="absolute top-2 left-2 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1"
                          >
                            <Upload className="w-3 h-3 text-[#00A67E]" />
                            <span>Replace</span>
                          </button>
                        )}

                        {!isUser && isEditable && (
                          <div className="absolute top-2 left-2 flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={(e) => triggerSlotUpload(video.id, e)}
                              className="bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1 cursor-pointer"
                            >
                              <Upload className="w-3 h-3 text-[#00A67E]" />
                              <span>{hasCustom ? "Replace" : "Upload"}</span>
                            </button>
                            {hasCustom && (
                              <button
                                type="button"
                                onClick={(e) => handleResetSlotThumb(video.id, e)}
                                className="bg-black/80 hover:bg-rose-600 text-white p-1 rounded-full shadow border border-white/20 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Video Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-start">
                        <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition">
                          {video.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {video.views} • {video.time}
                        </p>
                        <div className="flex items-center space-x-2 my-2.5">
                          <div className="w-6 h-6 rounded-full bg-teal-50 text-[#008B68] font-bold text-[10px] flex items-center justify-center border border-gray-200 overflow-hidden">
                            {isUser && logoUrl ? (
                              <img
                                src={logoUrl}
                                alt="Logo"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{video.channel.slice(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                          <span className="text-xs font-medium text-gray-700 hover:text-gray-900">
                            {video.channel}
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-gray-500 fill-gray-500" />
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-3">
                          {video.badges.map((b) => (
                            <span
                              key={b}
                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* VIEW 3: YOUTUBE CHANNEL PAGE                                     */}
          {/* ================================================================ */}
          {viewMode === "channel" && (
            <div>
                        {/* Channel Banner 16:9 Aspect Header */}
              <div className="px-8 pt-6 pb-2">
                <div className="relative aspect-[16/3.2] w-full bg-slate-900 rounded-2xl overflow-hidden shadow-xs border border-gray-100">
                  {bannerUrl ? (
                    <img
                      src={bannerUrl}
                      alt="Channel Banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-teal-900 via-slate-900 to-black flex items-center justify-center text-gray-400 text-sm font-semibold tracking-wide">
                      2560 × 1440 Channel Banner
                    </div>
                  )}
                  {isEditable && onUploadBanner && (
                    <button
                      onClick={onUploadBanner}
                      className="absolute top-4 right-4 bg-black/75 hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center space-x-1.5 transition active:scale-95 cursor-pointer z-10"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#00A67E]" />
                      <span>Edit Banner</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Channel Meta Information (Matches Native YouTube Channel Layout) */}
              <div className="px-8 pt-4 pb-2">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex items-start space-x-6">
                    <div className="relative shrink-0">
                      <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-teal-50 text-[#008B68] font-black text-3xl flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt="Channel Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>PS</span>
                        )}
                      </div>
                      {isEditable && onUploadLogo && (
                        <button
                          onClick={onUploadLogo}
                          className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full shadow-md border-2 border-white hover:bg-gray-800 transition cursor-pointer"
                          title="Upload/Replace Channel Logo"
                        >
                          <Camera className="w-3.5 h-3.5 text-[#00A67E]" />
                        </button>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                          {projectName || "Daddy Vyuk"}
                        </h1>
                        <CheckCircle2 className="w-5 h-5 text-gray-700 fill-gray-700 shrink-0" />
                      </div>
                      <div className="flex items-center space-x-2 text-xs font-medium text-gray-600 mt-1.5 flex-wrap">
                        <span className="font-semibold text-gray-800">@{projectName?.toLowerCase().replace(/\s+/g, "") || "DaddyVyuk"}</span>
                        <span>•</span>
                        <span>1.09M subscribers</span>
                        <span>•</span>
                        <span>587 videos</span>
                      </div>
                      <p className="text-xs text-gray-700 mt-2 max-w-2xl font-normal">
                        Kon&apos;nichiwaaaa ^_^ <span className="font-semibold text-gray-900 cursor-pointer">...more</span>
                      </p>
                      <div className="flex items-center space-x-1.5 text-xs text-blue-600 font-semibold mt-1.5">
                        <span className="text-gray-500 text-sm">🔗</span>
                        <span className="hover:underline cursor-pointer">
                          linktr.ee/{projectName?.toLowerCase().replace(/\s+/g, "") || "vyuk"}
                        </span>
                        <span className="text-gray-500 font-normal">and 3 more links</span>
                      </div>
                      <div className="mt-3.5 flex items-center space-x-2">
                        <button className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xs transition cursor-pointer">
                          Subscribe
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Channel Page Navigation Tabs */}
                <div className="flex items-center justify-between border-b border-gray-200 mt-6">
                  <div className="flex space-x-7 text-sm font-semibold text-gray-600">
                    <button
                      onClick={() => setChannelTab("home")}
                      className={`pb-3 relative whitespace-nowrap transition-colors cursor-pointer ${
                        channelTab === "home"
                          ? "text-black font-bold border-b-2 border-black"
                          : "hover:text-black"
                      }`}
                    >
                      Home
                    </button>
                    <button
                      onClick={() => setChannelTab("videos")}
                      className={`pb-3 relative whitespace-nowrap transition-colors cursor-pointer ${
                        channelTab === "videos"
                          ? "text-black font-bold border-b-2 border-black"
                          : "hover:text-black"
                      }`}
                    >
                      Videos
                    </button>
                    <button
                      onClick={() => setChannelTab("shorts")}
                      className={`pb-3 relative whitespace-nowrap transition-colors cursor-pointer ${
                        channelTab === "shorts"
                          ? "text-black font-bold border-b-2 border-black"
                          : "hover:text-black"
                      }`}
                    >
                      Shorts
                    </button>
                    <button
                      onClick={() => setChannelTab("playlists")}
                      className={`pb-3 relative whitespace-nowrap transition-colors cursor-pointer ${
                        channelTab === "playlists"
                          ? "text-black font-bold border-b-2 border-black"
                          : "hover:text-black"
                      }`}
                    >
                      Playlists
                    </button>
                    <button
                      className="pb-3 text-gray-500 hover:text-black transition-colors hidden sm:block"
                    >
                      Posts
                    </button>
                  </div>
                  <Search className="w-4 h-4 text-gray-500 cursor-pointer mr-2 hover:text-gray-900 transition" />
                </div>
              </div>

              {/* TAB 1: VIDEOS */}
              {channelTab === "videos" && (
                <div className="px-8 py-5">
                  {/* Filter Chips: Latest, Popular, Oldest */}
                  <div className="flex items-center space-x-2 mb-6">
                    <button
                      onClick={() => setVideoSort("latest")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        videoSort === "latest"
                          ? "bg-black text-white shadow-xs"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      Latest
                    </button>
                    <button
                      onClick={() => setVideoSort("popular")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        videoSort === "popular"
                          ? "bg-black text-white shadow-xs"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      Popular
                    </button>
                    <button
                      onClick={() => setVideoSort("oldest")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        videoSort === "oldest"
                          ? "bg-black text-white shadow-xs"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      Oldest
                    </button>
                  </div>

                  {/* 3 VIDEOS PER ROW GRID (Matches User Screenshot Exact Layout) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                    {sortedChannelVideos.map((video) => {
                      const isUser = video.isUser;
                      const resolvedThumb = isUser
                        ? thumbnailSrc
                        : resolveOtherThumb(video.id, video.defaultThumb);
                      const hasCustom = Boolean(customSlotThumbs[video.id]);

                      return (
                        <div
                          key={video.id}
                          className="flex flex-col group cursor-pointer"
                        >
                          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-xs group-hover:shadow-md transition">
                            <img
                              src={resolvedThumb}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                            />
                            <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] font-mono font-bold px-1.5 py-0.5 rounded">
                              {video.duration}
                            </span>

                            {isUser && isEditable && onUploadThumbnail && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUploadThumbnail();
                                }}
                                className="absolute top-2.5 left-2.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1.5 cursor-pointer z-10"
                                title="Upload / Replace Thumbnail"
                              >
                                <Upload className="w-3 h-3 text-[#00A67E]" />
                                <span>Replace</span>
                              </button>
                            )}

                            {!isUser && isEditable && (
                              <div className="absolute top-2.5 right-2.5 flex items-center space-x-1 z-10">
                                <button
                                  type="button"
                                  onClick={(e) => triggerSlotUpload(video.id, e)}
                                  className="bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1 cursor-pointer"
                                  title="Upload custom thumbnail for this video"
                                >
                                  <Upload className="w-3 h-3 text-[#00A67E]" />
                                  <span>{hasCustom ? "Replace" : "Upload"}</span>
                                </button>
                                {hasCustom && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleResetSlotThumb(video.id, e)}
                                    className="bg-black/80 hover:bg-rose-600 text-white p-1 rounded-full shadow border border-white/20 cursor-pointer"
                                    title="Reset to default dummy thumbnail"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Underneath Video Thumbnail: Title with 3-Dots & View/Time info */}
                          <div className="mt-3 flex items-start justify-between">
                            <div className="flex-1 min-w-0 pr-2">
                              <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition">
                                {video.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1 font-normal">
                                {video.views} • {video.time}
                              </p>
                            </div>
                            <MoreVertical className="w-4 h-4 text-gray-500 shrink-0 mt-0.5 hover:text-gray-900 transition" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: SHORTS */}
              {channelTab === "shorts" && (
                <div className="px-8 py-5">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShortsSort("latest")}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
                          shortsSort === "latest"
                            ? "bg-black text-white shadow-xs"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        <span>Latest</span>
                        <span className="text-[10px]">⌵</span>
                      </button>
                      <button
                        onClick={() => setShortsSort("popular")}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          shortsSort === "popular"
                            ? "bg-black text-white shadow-xs"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        Popular
                      </button>
                    </div>

                    {isEditable && onUploadShort && (
                      <button
                        onClick={onUploadShort}
                        className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow flex items-center space-x-1.5 transition active:scale-95 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#00A67E]" />
                        <span>Upload 9:16 Short Asset</span>
                      </button>
                    )}
                  </div>

                  {/* 5 SHORTS PER ROW GRID (Matches User Screenshot 2 Exact Layout) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-7">
                    {/* User's Short */}
                    <div className="flex flex-col group cursor-pointer">
                      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 shadow-xs group-hover:shadow-md transition">
                        {shortSrc ? (
                          <img
                            src={shortSrc}
                            alt="Your Short"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
                            Short Asset
                          </div>
                        )}
                        {isEditable && onUploadShort && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUploadShort();
                            }}
                            title="Click to upload or replace short"
                            className="absolute top-2.5 left-2.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1 cursor-pointer z-10"
                          >
                            <Upload className="w-2.5 h-2.5 text-[#00A67E]" />
                            <span>↑ Short</span>
                          </button>
                        )}
                      </div>

                      {/* Title & View Count Underneath Thumbnail (Matches YouTube Desktop) */}
                      <div className="mt-2.5 flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-1.5">
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition">
                            {videoTitle} #shorts
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 font-normal">
                            320K views
                          </p>
                        </div>
                        <MoreVertical className="w-4 h-4 text-gray-500 shrink-0 mt-0.5 hover:text-gray-900 transition" />
                      </div>
                    </div>

                    {/* Competitor / Channel Shorts */}
                    {sortedChannelShorts
                      .filter((s) => !s.isUser)
                      .map((short) => {
                        const resolvedThumb = resolveOtherThumb(short.id, short.defaultThumb || "");
                        const hasCustom = Boolean(customSlotThumbs[short.id]);
                        return (
                          <div
                            key={short.id}
                            className="flex flex-col group cursor-pointer"
                          >
                            <div
                              className={`relative aspect-[9/16] rounded-2xl overflow-hidden shadow-xs group-hover:shadow-md transition ${
                                resolvedThumb ? "bg-slate-900" : `bg-gradient-to-br ${short.gradient}`
                              }`}
                            >
                              {resolvedThumb && (
                                <img
                                  src={resolvedThumb}
                                  alt={short.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                                />
                              )}
                              {isEditable && (
                                <div className="absolute top-2 right-2 flex items-center space-x-1 z-10">
                                  <button
                                    type="button"
                                    onClick={(e) => triggerSlotUpload(short.id, e)}
                                    className="bg-black/80 hover:bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow border border-white/20 flex items-center space-x-1 cursor-pointer"
                                    title="Upload custom thumbnail for this short"
                                  >
                                    <Upload className="w-2.5 h-2.5 text-[#00A67E]" />
                                    <span>{hasCustom ? "Replace" : "Upload"}</span>
                                  </button>
                                  {hasCustom && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleResetSlotThumb(short.id, e)}
                                      className="bg-black/80 hover:bg-rose-600 text-white p-1 rounded-full shadow border border-white/20 cursor-pointer"
                                      title="Reset to default dummy thumbnail"
                                    >
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Title & View Count Underneath Thumbnail */}
                            <div className="mt-2.5 flex items-start justify-between">
                              <div className="flex-1 min-w-0 pr-1.5">
                                <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition">
                                  {short.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1 font-normal">
                                  {short.views}
                                </p>
                              </div>
                              <MoreVertical className="w-4 h-4 text-gray-500 shrink-0 mt-0.5 hover:text-gray-900 transition" />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* TAB 3: HOME OVERVIEW */}
              {channelTab === "home" && (
                <div className="px-8 py-5">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-gray-900">
                        Featured releases
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {sortedChannelVideos.slice(0, 4).map((v) => (
                        <div
                          key={v.id}
                          className="flex flex-col group cursor-pointer"
                        >
                          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-sm">
                            <img
                              src={v.isUser ? thumbnailSrc : resolveOtherThumb(v.id, v.defaultThumb)}
                              alt={v.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                            />
                            <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] font-mono font-bold px-1.5 py-0.5 rounded">
                              {v.duration}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight mt-2">
                            {v.title}
                          </h4>
                          <span className="text-[11px] text-gray-500 mt-1">
                            {v.views} • {v.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shorts Row */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Flame className="w-4 h-4 text-red-600" />
                        <h4 className="text-sm font-bold text-gray-900">Shorts</h4>
                      </div>
                      <button
                        onClick={() => setChannelTab("shorts")}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        View all
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {/* User's Short */}
                      <div className="aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 shadow-sm relative group">
                        {shortSrc ? (
                          <img
                            src={shortSrc}
                            alt="Short"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
                            Short Asset
                          </div>
                        )}
                        {isEditable && onUploadShort && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUploadShort();
                            }}
                            title="Click to upload or replace short frame"
                            className="absolute top-2 left-2 bg-black/80 hover:bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow border border-white/20 flex items-center space-x-1 cursor-pointer z-10"
                          >
                            <Upload className="w-2.5 h-2.5 text-[#00A67E]" />
                            <span>↑ Short</span>
                          </button>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2.5 text-white">
                          <p className="text-[11px] font-bold line-clamp-2 leading-tight">
                            {videoTitle} #shorts
                          </p>
                          <span className="text-[9px] text-gray-300 mt-0.5 block">
                            320K views
                          </span>
                        </div>
                      </div>

                      {mockChannelShorts.slice(1, 5).map((s) => {
                        const resolvedThumb = resolveOtherThumb(s.id, s.defaultThumb || "");
                        return (
                          <div
                            key={s.id}
                            className={`aspect-[9/16] rounded-2xl overflow-hidden shadow-sm relative group ${
                              resolvedThumb ? "bg-slate-900" : `bg-gradient-to-br ${s.gradient}`
                            }`}
                          >
                            {resolvedThumb && (
                              <img
                                src={resolvedThumb}
                                alt={s.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                              />
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2.5 text-white">
                              <p className="text-[11px] font-bold line-clamp-2 leading-tight">
                                {s.title}
                              </p>
                              <span className="text-[9px] text-gray-300 mt-0.5 block">
                                {s.views}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PLAYLISTS */}
              {channelTab === "playlists" && (
                <div className="px-8 py-5">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-gray-900">
                      Created playlists
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {mockPlaylists.map((pl) => (
                      <div
                        key={pl.id}
                        className="group cursor-pointer flex flex-col"
                      >
                        <div className={`relative aspect-video rounded-2xl bg-gradient-to-br ${pl.gradient} flex items-center justify-center shadow-sm overflow-hidden`}>
                          <ListVideo className="w-8 h-8 text-white/90" />
                          <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-1.5 flex justify-between items-center text-white text-xs font-bold">
                            <span className="flex items-center space-x-1.5">
                              <ListVideo className="w-3.5 h-3.5" />
                              <span>{pl.videoCount} videos</span>
                            </span>
                          </div>
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 mt-2.5 line-clamp-1 group-hover:text-blue-600">
                          {pl.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {projectName || "PractiScale"} • {pl.updated}
                        </p>
                        <span className="text-xs font-semibold text-[#008B68] mt-2 inline-block">
                          View full playlist
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
