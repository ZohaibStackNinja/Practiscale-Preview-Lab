"use client";

import React, { useState } from "react";
import { Device, Variant } from "@/lib/types";
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
  Share2,
  MessageSquare,
  Music,
  Play,
  Plus,
} from "lucide-react";

interface YouTubeSimulatorProps {
  device: Device;
  variant: Variant | null;
  projectName?: string;
  bannerUrl?: string;
  logoUrl?: string;
  shortFrameUrl?: string;
  onUploadBanner?: () => void;
  onUploadLogo?: () => void;
  onUploadThumbnail?: () => void;
  onUploadShort?: () => void;
}

type YouTubeViewMode = "home" | "search" | "channel" | "shorts";
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
  projectName = "Q4 Brand Launch",
  bannerUrl,
  logoUrl,
  shortFrameUrl,
  onUploadBanner,
  onUploadLogo,
  onUploadThumbnail,
  onUploadShort,
}) => {
  const [viewMode, setViewMode] = useState<YouTubeViewMode>("home");
  const [channelTab, setChannelTab] = useState<ChannelTab>("videos");
  const [videoSort, setVideoSort] = useState<"latest" | "popular" | "oldest">(
    "latest",
  );
  const [shortsSort, setShortsSort] = useState<"latest" | "popular">("latest");
  const [searchQuery, setSearchQuery] = useState(
    "creative production strategy",
  );
  const [searchInput, setSearchInput] = useState(
    "creative production strategy",
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const thumbnailSrc = variant?.asset?.secureUrl || "/placeholder-thumb.svg";
  const thumbnailName = variant?.name || "Launch campaign";
  const shortSrc = shortFrameUrl || thumbnailSrc;

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

  const handleGoShorts = () => {
    setViewMode("shorts");
    setMobileSearchOpen(false);
  };

  const mockHomeVideos = [
    {
      id: "user-video",
      isUser: true,
      title: `${thumbnailName} - How Mission One Scaled High-Impact Video Pipelines`,
      channel: projectName || "PractiScale",
      views: "124K views",
      time: "1 hour ago",
      duration: "14:01",
      badge: "YOUR THUMBNAIL",
      gradient: "from-[#0ABAB5]/20 via-slate-900 to-black",
    },
    {
      id: "comp-1",
      isUser: false,
      title:
        "How Top Creators Design Thumbnails for 20%+ CTR (Full Masterclass)",
      channel: "Creator Studio Lab",
      views: "1.4M views",
      time: "3 days ago",
      duration: "21:34",
      badge: "CTR BREAKDOWN",
      category: "Design",
      gradient: "from-amber-600 via-orange-700 to-red-800",
      iconSubtitle: "Eye Tracking & Contrast Rules",
    },
    {
      id: "comp-2",
      isUser: false,
      title:
        "The 2026 AI Playbook: Workflows That Actually Cut Production Time",
      channel: "Matt Rivera",
      views: "640K views",
      time: "1 day ago",
      duration: "18:12",
      badge: "AI WORKFLOWS",
      category: "AI",
      gradient: "from-indigo-900 via-purple-900 to-violet-800",
      iconSubtitle: "10x Batch Generation System",
    },
    {
      id: "comp-3",
      isUser: false,
      title:
        "Why 94% of Creative Agencies Plateau Before $100k Monthly Revenue",
      channel: "Growth Systems",
      views: "310K views",
      time: "2 weeks ago",
      duration: "34:50",
      badge: "AGENCY RETROSPECTIVE",
      category: "Marketing",
      gradient: "from-emerald-900 via-teal-800 to-slate-900",
      iconSubtitle: "Operations & Retention Teardown",
    },
    {
      id: "comp-4",
      isUser: false,
      title: "I Tested 50 YouTube Hooks Across 10 Million Impressions (Data)",
      channel: "Algorithm Decoded",
      views: "890K views",
      time: "5 days ago",
      duration: "16:45",
      badge: "TEST RESULTS",
      category: "Marketing",
      gradient: "from-rose-900 via-pink-900 to-slate-900",
      iconSubtitle: "Retention Graphs & Surprises",
    },
    {
      id: "comp-5",
      isUser: false,
      title:
        "High-Performance Systems Architecture: Scalable Backend Blueprint",
      channel: "Tech Architecture Lab",
      views: "215K views",
      time: "6 days ago",
      duration: "27:18",
      badge: "INFRASTRUCTURE",
      category: "Technology",
      gradient: "from-slate-900 via-blue-950 to-black",
      iconSubtitle: "Global Edge & Microservices",
    },
  ];

  const mockSearchResults = [
    {
      id: "user-search-result",
      isUser: true,
      title: `${thumbnailName} - The Complete Guide to Creative Production & Packaging`,
      channel: projectName || "PractiScale",
      views: "124K views",
      time: "1 hour ago",
      duration: "14:01",
      description:
        "In this session, we break down end-to-end creative workflows, thumbnail CTR benchmarking, and visual hierarchy tactics that consistently double click-through rates across competitive feeds.",
      badges: ["NEW", "4K", "CC"],
      isVerified: true,
    },
    {
      id: "search-comp-1",
      isUser: false,
      title:
        "Creative Production Strategy: How to Build a Rapid Testing Machine",
      channel: "Brand Ops Academy",
      views: "890K views",
      time: "4 months ago",
      duration: "24:18",
      description:
        "Step-by-step masterclass on setting up high-velocity creative testing frameworks. Discover how top direct-to-consumer brands test 40+ variants weekly without sacrificing design quality.",
      badges: ["CC"],
      isVerified: true,
      gradient: "from-blue-950 via-slate-900 to-indigo-950",
      tagline: "VELOCITY FRAMEWORK",
    },
    {
      id: "search-comp-2",
      isUser: false,
      title:
        "Visual Hierarchy & Eye Movement in YouTube Thumbnails (2026 Edition)",
      channel: "Design Psychology",
      views: "1.2M views",
      time: "6 months ago",
      duration: "32:05",
      description:
        "We used heatmaps and eye-tracking software to see where viewers look first on YouTube search results. Learn the 3 crucial focal points you must protect on every design.",
      badges: ["4K", "CC"],
      isVerified: true,
      gradient: "from-purple-950 via-fuchsia-950 to-black",
      tagline: "HEATMAP ANALYSIS",
    },
    {
      id: "search-comp-3",
      isUser: false,
      title: "YouTube SEO & Search Ranking Signals: How Video Packages Win",
      channel: "Channel Growth Lab",
      views: "410K views",
      time: "2 months ago",
      duration: "19:40",
      description:
        "Everything you need to know about appearing in YouTube search suggestions and ranked results. Metadata optimization, query alignment, and early CTR momentum.",
      badges: ["CC"],
      isVerified: false,
      gradient: "from-teal-950 via-emerald-950 to-slate-900",
      tagline: "RANKING SIGNALS",
    },
  ];

  const mockChannelVideos = [
    {
      id: "chan-vid-user",
      isUser: true,
      title: `${thumbnailName} - The Complete Guide to Creative Production & Packaging`,
      views: "124K views",
      time: "1 hour ago",
      duration: "14:01",
      popularRank: 2,
    },
    {
      id: "chan-vid-2",
      isUser: false,
      title: "Creative Production Strategy: Scaling High-Converting Assets",
      views: "89K views",
      time: "2 weeks ago",
      duration: "24:18",
      gradient: "from-[#08202A] to-[#0E3D46]",
      tagline: "FEATURED MASTERCLASS",
      popularRank: 4,
    },
    {
      id: "chan-vid-3",
      isUser: false,
      title: "Building Rapid Creative Testing Machines for Paid Media",
      views: "340K views",
      time: "1 month ago",
      duration: "18:45",
      gradient: "from-slate-900 via-teal-950 to-emerald-900",
      tagline: "TESTING MACHINE",
      popularRank: 1,
    },
    {
      id: "chan-vid-4",
      isUser: false,
      title: "How We Designed 50+ Winning Video Hooks in Under 48 Hours",
      views: "212K views",
      time: "3 months ago",
      duration: "12:30",
      gradient: "from-indigo-950 via-purple-950 to-slate-900",
      tagline: "50+ HOOKS",
      popularRank: 3,
    },
  ];

  const sortedChannelVideos = [...mockChannelVideos].sort((a, b) => {
    if (videoSort === "popular") return a.popularRank - b.popularRank;
    if (videoSort === "oldest") return a.isUser ? 1 : -1;
    return 0;
  });

  const mockChannelShorts = [
    {
      id: "chan-short-user",
      isUser: true,
      title: `${thumbnailName} #shorts`,
      views: "320K views",
      duration: "0:45",
      popularRank: 2,
    },
    {
      id: "chan-short-2",
      isUser: false,
      title: "3 Video Mistakes Killing Your CTR 😱 #shorts",
      views: "1.4M views",
      duration: "0:30",
      gradient: "from-rose-600 via-red-700 to-amber-600",
      tagline: "CTR KILLER",
      popularRank: 1,
    },
    {
      id: "chan-short-3",
      isUser: false,
      title: "The 2026 Creative Formula you MUST know #shorts",
      views: "890K views",
      duration: "0:52",
      gradient: "from-emerald-600 via-teal-700 to-cyan-800",
      tagline: "2026 FORMULA",
      popularRank: 3,
    },
    {
      id: "chan-short-4",
      isUser: false,
      title: "How top editors save 5 hours every day ⚡ #shorts",
      views: "640K views",
      duration: "0:25",
      gradient: "from-purple-600 via-indigo-700 to-blue-800",
      tagline: "5 HOURS SAVED",
      popularRank: 4,
    },
    {
      id: "chan-short-5",
      isUser: false,
      title: "Turn 1 Longform Video into 10 Shorts Fast #shorts",
      views: "520K views",
      duration: "0:58",
      gradient: "from-amber-600 via-orange-600 to-pink-700",
      tagline: "REPURPOSE FAST",
      popularRank: 5,
    },
    {
      id: "chan-short-6",
      isUser: false,
      title: "AI Prompts for High-Converting Ad Creative #shorts",
      views: "415K views",
      duration: "0:42",
      gradient: "from-cyan-600 via-blue-700 to-indigo-900",
      tagline: "AI CREATIVE",
      popularRank: 6,
    },
  ];

  const sortedChannelShorts = [...mockChannelShorts].sort((a, b) => {
    if (shortsSort === "popular") return a.popularRank - b.popularRank;
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
      title: "Short-Form Video Playbook (TikTok, Shorts, Reels)",
      videoCount: 28,
      updated: "Updated last week",
      gradient: "from-rose-900 to-purple-950",
    },
    {
      id: "pl-3",
      title: "Podcasts & Executive Media Interviews",
      videoCount: 9,
      updated: "Updated 2 weeks ago",
      gradient: "from-amber-900 to-slate-900",
    },
  ];

  /* -------------------------------------------------------------------------- */
  /* MOBILE SIMULATOR VIEW                                                      */
  /* -------------------------------------------------------------------------- */
  if (device === "mobile") {
    return (
      <div className="flex flex-col items-center p-2 select-none">
        {/* Beautified Mobile Mode Segmented Switcher */}
        <div className="mb-3.5 inline-flex items-center p-1 bg-white rounded-2xl border border-gray-200 shadow-2xs text-xs gap-1 shrink-0 select-none">
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
            onClick={handleGoShorts}
            className={`whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewMode === "shorts"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Flame className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Shorts</span>
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
            <div className="w-20 h-4 bg-black rounded-full mx-auto" />
            <div className="flex items-center space-x-1">
              <span>5G</span>
              <div className="w-4 h-2.5 border border-black rounded-sm flex items-center p-0.5">
                <div className="w-full h-full bg-black rounded-xs" />
              </div>
            </div>
          </div>

          {/* YouTube Mobile Top Bar */}
          {mobileSearchOpen || viewMode === "search" ? (
            <div className="h-12 px-3 flex items-center space-x-2 border-b border-gray-100 bg-white shrink-0">
              <button
                onClick={() => {
                  setMobileSearchOpen(false);
                  setViewMode("home");
                }}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleExecuteSearch(searchInput);
                }}
                className="flex-1 flex items-center bg-gray-100 rounded-full px-3 py-1.5"
              >
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search YouTube"
                  autoFocus
                  className="w-full bg-transparent text-xs text-gray-900 outline-none"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-0.5 text-gray-500 hover:text-gray-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>
              <button
                onClick={() => handleExecuteSearch(searchInput)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="h-12 px-4 flex items-center justify-between border-b border-gray-100 bg-white shrink-0">
              <div
                onClick={handleGoHome}
                className="flex items-center space-x-1 cursor-pointer"
              >
                <div className="w-7 h-5 bg-red-600 rounded-md flex items-center justify-center text-white text-[10px] font-black">
                  ▶
                </div>
                <span className="font-extrabold text-sm tracking-tighter text-gray-900">
                  YouTube
                </span>
              </div>
              <div className="flex items-center space-x-4 text-gray-700">
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <Cast className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <Bell className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setMobileSearchOpen(true);
                    setViewMode("search");
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Mobile Main Scrollable Body */}
          <div
            className="flex-1 overflow-y-auto bg-gray-50 no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* 1. MOBILE HOME FEED VIEW */}
            {viewMode === "home" && (
              <div>
                {/* Mobile Filter Chips */}
                <div
                  className="flex items-center space-x-2 px-3 py-2.5 bg-white border-b border-gray-100 overflow-x-auto no-scrollbar"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        activeCategory === cat
                          ? "bg-gray-900 text-white shadow-xs"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Video Cards Stream - Edge-to-Edge */}
                <div className="space-y-2.5 pb-6">
                  {/* Card 1: User's Featured Video */}
                  <div className="bg-white pb-3 shadow-2xs">
                    <div className="relative aspect-video w-full bg-slate-900">
                      {thumbnailSrc ? (
                        <img
                          src={thumbnailSrc}
                          alt={thumbnailName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Thumbnail
                        </div>
                      )}
                      <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] px-1.5 py-0.5 rounded font-bold font-mono">
                        14:01
                      </span>

                      {/* Hotspot upload badge */}
                      <button
                        onClick={onUploadThumbnail}
                        title="Click to upload/replace thumbnail"
                        className="absolute top-2 left-2 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md border border-white/20 flex items-center space-x-1.5 transition active:scale-95 z-10"
                      >
                        <Upload className="w-3 h-3 text-[#0ABAB5]" />
                        <span>Your Thumbnail</span>
                      </button>
                    </div>

                    {/* Metadata line */}
                    <div className="px-3.5 py-3 flex space-x-3">
                      <div
                        onClick={onUploadLogo}
                        title="Click to upload logo"
                        className="w-9 h-9 rounded-full bg-teal-50 text-[#089793] font-bold text-xs flex items-center justify-center border border-teal-200 shrink-0 overflow-hidden cursor-pointer"
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
                          {thumbnailName} - How Mission One Services Scaled
                          Video Production
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1 flex items-center space-x-1">
                          <span>{projectName || "PractiScale"}</span>
                          <span>•</span>
                          <span>124K views</span>
                          <span>•</span>
                          <span>1 hour ago</span>
                        </p>
                      </div>
                      <MoreVertical className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    </div>
                  </div>

                  {/* Competitor Card 1 */}
                  <div className="bg-white pb-3 shadow-2xs">
                    <div className="relative aspect-video w-full bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 flex items-center justify-center p-4">
                      <div className="text-center text-white">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded">
                          CTR BREAKDOWN
                        </span>
                        <h4 className="text-sm font-black mt-1 leading-tight">
                          How Top Creators Design Thumbnails for 20%+ CTR
                        </h4>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                        21:34
                      </span>
                    </div>
                    <div className="px-3.5 py-3 flex space-x-3">
                      <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                        CS
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                          How Top Creators Design Thumbnails for 20%+ CTR (Full
                          Masterclass)
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Creator Studio Lab • 1.4M views • 3 days ago
                        </p>
                      </div>
                      <MoreVertical className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    </div>
                  </div>

                  {/* Competitor Card 2 */}
                  <div className="bg-white pb-3 shadow-2xs">
                    <div className="relative aspect-video w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 flex items-center justify-center p-4">
                      <div className="text-center text-white">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded">
                          AI WORKFLOWS
                        </span>
                        <h4 className="text-sm font-black mt-1 leading-tight">
                          The 2026 AI Playbook: Workflows That Cut Production
                          Time
                        </h4>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                        18:12
                      </span>
                    </div>
                    <div className="px-3.5 py-3 flex space-x-3">
                      <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0">
                        MR
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                          The 2026 AI Playbook: Workflows That Actually Cut
                          Production Time
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Matt Rivera • 640K views • 1 day ago
                        </p>
                      </div>
                      <MoreVertical className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. MOBILE SEARCH RESULTS VIEW */}
            {viewMode === "search" && (
              <div className="space-y-2.5 pb-6">
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border-b border-gray-100">
                  <div className="flex items-center space-x-1.5 text-xs text-gray-700 font-semibold">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-gray-600" />
                    <span>Filters</span>
                  </div>
                  <span className="text-[11px] text-gray-500 italic">
                    Results for &ldquo;{searchQuery}&rdquo;
                  </span>
                </div>

                {/* Search Result 1: User's video - Edge-to-Edge */}
                <div className="bg-white pb-3 shadow-2xs">
                  <div className="relative aspect-video w-full bg-slate-900">
                    {thumbnailSrc ? (
                      <img
                        src={thumbnailSrc}
                        alt={thumbnailName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Thumbnail
                      </div>
                    )}
                    <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                      14:01
                    </span>
                    <button
                      onClick={onUploadThumbnail}
                      title="Click to replace thumbnail"
                      className="absolute top-2 left-2 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md border border-white/20 flex items-center space-x-1.5 transition active:scale-95 z-10"
                    >
                      <Upload className="w-3 h-3 text-[#0ABAB5]" />
                      <span>Your Result</span>
                    </button>
                  </div>
                  <div className="px-3.5 py-3 flex space-x-3">
                    <div
                      onClick={onUploadLogo}
                      title="Click to upload logo"
                      className="w-9 h-9 rounded-full bg-teal-50 text-[#089793] font-bold text-xs flex items-center justify-center border border-teal-200 shrink-0 overflow-hidden cursor-pointer"
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
                        {thumbnailName} - The Complete Guide to Creative
                        Production & Packaging
                      </h3>
                      <div className="flex items-center space-x-1.5 text-[11px] text-gray-500 mt-1">
                        <span className="font-semibold text-gray-800">
                          {projectName || "PractiScale"}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-gray-400" />
                        <span>•</span>
                        <span>124K views</span>
                        <span>•</span>
                        <span>1 hr ago</span>
                      </div>
                      <div className="flex items-center space-x-1.5 mt-2">
                        <span className="bg-gray-100 text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded">
                          NEW
                        </span>
                        <span className="bg-gray-100 text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded">
                          4K
                        </span>
                        <span className="bg-gray-100 text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded">
                          CC
                        </span>
                      </div>
                    </div>
                    <MoreVertical className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  </div>
                </div>

                {/* Competing Search Results - Edge-to-Edge */}
                {mockSearchResults
                  .filter((item) => !item.isUser)
                  .map((item) => (
                    <div key={item.id} className="bg-white pb-3 shadow-2xs">
                      <div
                        className={`relative aspect-video w-full bg-gradient-to-br ${item.gradient} flex items-center justify-center p-3`}
                      >
                        <span className="text-[10px] font-black uppercase text-white bg-black/40 px-2 py-0.5 rounded">
                          {item.tagline}
                        </span>
                        <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                          {item.duration}
                        </span>
                      </div>
                      <div className="px-3.5 py-3 flex space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {item.channel.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-[11px] text-gray-500 mt-1">
                            {item.channel} • {item.views} • {item.time}
                          </p>
                        </div>
                        <MoreVertical className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* 3. MOBILE CHANNEL VIEW */}
            {viewMode === "channel" && (
              <div className="space-y-2.5 pb-6">
                <div className="relative w-full h-24 bg-gradient-to-r from-[#08202A] via-[#0E3D46] to-[#0ABAB5]">
                  {bannerUrl && (
                    <img
                      src={bannerUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    onClick={onUploadBanner}
                    className="absolute top-2 right-2 bg-black/75 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow flex items-center space-x-1"
                  >
                    <Camera className="w-2.5 h-2.5 text-[#0ABAB5]" />
                    <span>Banner</span>
                  </button>
                </div>

                <div className="p-3 border-b border-gray-200 bg-white">
                  <div className="flex items-center space-x-3">
                    <div
                      onClick={onUploadLogo}
                      className="w-14 h-14 rounded-full bg-teal-50 text-[#089793] font-bold text-lg flex items-center justify-center border-2 border-teal-200 overflow-hidden cursor-pointer shrink-0"
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
                    <div>
                      <h2 className="text-sm font-bold text-gray-900">
                        {projectName || "PractiScale"}
                      </h2>
                      <p className="text-[11px] text-gray-500">
                        @practiscale • 771 subscribers • 31 videos
                      </p>
                      <button className="mt-1.5 bg-black hover:bg-gray-800 text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-xs">
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>

                {/* Interactive Channel Sub-Tabs */}
                <div className="flex items-center space-x-6 px-4 border-b border-gray-200 bg-white text-xs font-semibold text-gray-500 overflow-x-auto no-scrollbar">
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
                      <button
                        onClick={() => setVideoSort("oldest")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          videoSort === "oldest"
                            ? "bg-black text-white shadow-xs"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Oldest
                      </button>
                    </div>

                    {/* Edge-to-Edge Channel Videos Stream */}
                    <div className="space-y-2.5 pt-2">
                      {sortedChannelVideos.map((video) => {
                        if (video.isUser) {
                          return (
                            <div
                              key={video.id}
                              className="bg-white pb-3 shadow-2xs"
                            >
                              <div className="relative aspect-video w-full bg-slate-900">
                                {thumbnailSrc ? (
                                  <img
                                    src={thumbnailSrc}
                                    alt="Thumb"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                    No Thumbnail
                                  </div>
                                )}
                                <button
                                  onClick={onUploadThumbnail}
                                  title="Click to upload thumbnail"
                                  className="absolute top-2 left-2 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md border border-white/20 flex items-center space-x-1.5 transition active:scale-95 z-10"
                                >
                                  <Upload className="w-3 h-3 text-[#0ABAB5]" />
                                  <span>Your Thumbnail</span>
                                </button>
                                <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                                  {video.duration}
                                </span>
                              </div>
                              <div className="px-3.5 py-3 flex justify-between items-start">
                                <div className="flex-1 pr-2">
                                  <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                                    {video.title}
                                  </h3>
                                  <p className="text-[11px] text-gray-500 mt-1">
                                    {projectName || "PractiScale"} •{" "}
                                    {video.views} • {video.time}
                                  </p>
                                </div>
                                <MoreVertical className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={video.id}
                            className="bg-white pb-3 shadow-2xs"
                          >
                            <div
                              className={`relative aspect-video w-full bg-gradient-to-br ${video.gradient} flex items-center justify-center p-4`}
                            >
                              <div className="text-center text-white">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded">
                                  {video.tagline}
                                </span>
                                <h4 className="text-sm font-black mt-1 leading-tight">
                                  {video.title}
                                </h4>
                              </div>
                              <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                                {video.duration}
                              </span>
                            </div>
                            <div className="px-3.5 py-3 flex justify-between items-start">
                              <div className="flex-1 pr-2">
                                <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                                  {video.title}
                                </h3>
                                <p className="text-[11px] text-gray-500 mt-1">
                                  {projectName || "PractiScale"} • {video.views}{" "}
                                  • {video.time}
                                </p>
                              </div>
                              <MoreVertical className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
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
                              onClick={handleGoShorts}
                              className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 group cursor-pointer shadow-xs border border-gray-200"
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
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUploadShort?.();
                                }}
                                title="Click to upload/replace 9:16 short asset"
                                className="absolute top-1.5 left-1.5 bg-black/85 hover:bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-md border border-white/20 flex items-center space-x-1 z-10 transition active:scale-95"
                              >
                                <Upload className="w-2.5 h-2.5 text-[#0ABAB5]" />
                                <span>Upload</span>
                              </button>

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

                        return (
                          <div
                            key={short.id}
                            onClick={handleGoShorts}
                            className={`relative aspect-[9/16] rounded-xl overflow-hidden bg-gradient-to-br ${short.gradient} group cursor-pointer shadow-xs border border-gray-200 p-2 flex flex-col justify-between`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-[7px] font-black uppercase text-white/90 bg-black/40 px-1 py-0.5 rounded">
                                {short.tagline}
                              </span>
                              <MoreVertical className="w-3 h-3 text-white/80" />
                            </div>

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
                      })}
                    </div>
                  </div>
                )}

                {/* 3C. CHANNEL HOME TAB */}
                {channelTab === "home" && (
                  <div className="space-y-3 pt-2">
                    {/* Featured Video Trailer */}
                    <div className="bg-white pb-3 shadow-2xs">
                      <div className="relative aspect-video w-full bg-slate-900">
                        {thumbnailSrc ? (
                          <img
                            src={thumbnailSrc}
                            alt="Thumb"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Thumbnail
                          </div>
                        )}
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                          Channel Trailer
                        </span>
                        <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                          14:01
                        </span>
                      </div>
                      <div className="px-3.5 py-3">
                        <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                          {thumbnailName} - The Complete Guide to Creative
                          Production & Packaging
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {projectName || "PractiScale"} • 124K views • 1 hour
                          ago
                        </p>
                      </div>
                    </div>

                    {/* Shorts Shelf */}
                    <div className="bg-white py-3 border-y border-gray-100">
                      <div className="flex items-center justify-between px-3.5 mb-2.5">
                        <div className="flex items-center space-x-1.5">
                          <Flame className="w-4 h-4 text-red-600" />
                          <span className="text-xs font-bold text-gray-900">
                            Shorts
                          </span>
                        </div>
                        <button
                          onClick={() => setChannelTab("shorts")}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                        >
                          View all
                        </button>
                      </div>
                      <div className="flex space-x-2 px-3.5 overflow-x-auto no-scrollbar pb-1">
                        {sortedChannelShorts.slice(0, 4).map((short) => (
                          <div
                            key={short.id}
                            onClick={handleGoShorts}
                            className={`w-28 aspect-[9/16] shrink-0 rounded-xl overflow-hidden relative cursor-pointer shadow-xs ${
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

                    {/* Additional Featured Video */}
                    <div className="bg-white pb-3 shadow-2xs">
                      <div className="relative aspect-video w-full bg-gradient-to-br from-[#08202A] to-[#0E3D46] flex items-center justify-center p-4">
                        <div className="text-center text-white">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded">
                            FEATURED MASTERCLASS
                          </span>
                          <h4 className="text-sm font-black mt-1 leading-tight">
                            Creative Production Strategy: Scaling
                            High-Converting Assets
                          </h4>
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                          24:18
                        </span>
                      </div>
                      <div className="px-3.5 py-3 flex justify-between items-start">
                        <div className="flex-1 pr-2">
                          <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                            Creative Production Strategy: How to Build a Rapid
                            Testing Machine
                          </h3>
                          <p className="text-[11px] text-gray-500 mt-1">
                            {projectName || "PractiScale"} • 89K views • 2 weeks
                            ago
                          </p>
                        </div>
                        <MoreVertical className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3D. CHANNEL PLAYLISTS TAB */}
                {channelTab === "playlists" && (
                  <div className="p-3 space-y-3 pb-6">
                    {mockPlaylists.map((pl) => (
                      <div
                        key={pl.id}
                        className="flex space-x-3 bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs hover:shadow-xs transition cursor-pointer"
                      >
                        <div
                          className={`relative w-28 aspect-video rounded-lg overflow-hidden bg-gradient-to-br ${pl.gradient} flex items-center justify-center shrink-0`}
                        >
                          <div className="absolute right-0 inset-y-0 w-8 bg-black/60 backdrop-blur-2xs flex flex-col items-center justify-center text-white">
                            <ListVideo className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-bold mt-0.5">
                              {pl.videoCount}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                            {pl.title}
                          </h4>
                          <p className="text-[10px] text-gray-500 mt-1">
                            {projectName || "PractiScale"} • {pl.updated}
                          </p>
                          <span className="text-[10px] text-[#089793] font-semibold mt-1">
                            View full playlist
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. MOBILE SHORTS IMMERSIVE VIEWER */}
            {viewMode === "shorts" && (
              <div className="relative h-full bg-black flex flex-col justify-between overflow-hidden">
                {/* Full screen short image/video frame */}
                <div className="absolute inset-0 z-0">
                  {shortSrc ? (
                    <img
                      src={shortSrc}
                      alt="Short frame"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-[#08202A] via-[#0E3D46] to-black flex items-center justify-center text-white text-xs">
                      No Short Frame
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />
                </div>

                {/* Top Header Controls */}
                <div className="relative z-10 px-4 pt-3 flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleGoHome}
                      className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md"
                    >
                      <ArrowLeft className="w-4 h-4 text-white" />
                    </button>
                    <span className="text-xs font-bold tracking-wide">
                      Shorts
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={onUploadShort}
                      title="Upload 9:16 Short frame"
                      className="bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center space-x-1 transition active:scale-95"
                    >
                      <Upload className="w-3 h-3 text-[#0ABAB5]" />
                      <span>Upload Short</span>
                    </button>
                    <Search
                      onClick={() => {
                        setViewMode("search");
                        setMobileSearchOpen(true);
                      }}
                      className="w-4 h-4 text-white cursor-pointer"
                    />
                    <MoreVertical className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Right Floating Actions Column */}
                <div className="relative z-10 self-end mr-3 flex flex-col items-center space-y-4 text-white pb-2">
                  <button className="flex flex-col items-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition">
                      <ThumbsUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold">142K</span>
                  </button>

                  <button className="flex flex-col items-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition">
                      <ThumbsDown className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold">Dislike</span>
                  </button>

                  <button className="flex flex-col items-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold">2.4K</span>
                  </button>

                  <button className="flex flex-col items-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition">
                      <Share2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold">Share</span>
                  </button>

                  <button className="flex flex-col items-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold">Remix</span>
                  </button>

                  {/* Spinning sound disc */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-800 to-black p-0.5 border border-white/30 flex items-center justify-center animate-spin">
                    <div className="w-4 h-4 rounded-full bg-teal-400 flex items-center justify-center">
                      <Music className="w-2.5 h-2.5 text-black" />
                    </div>
                  </div>
                </div>

                {/* Bottom Video Metadata */}
                <div className="relative z-10 px-4 pb-3 text-white">
                  {/* Channel info */}
                  <div className="flex items-center space-x-2.5 mb-2">
                    <div
                      onClick={onUploadLogo}
                      className="w-8 h-8 rounded-full bg-teal-50 text-[#089793] font-bold text-xs flex items-center justify-center border border-white/40 overflow-hidden cursor-pointer shrink-0"
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
                    <span
                      onClick={() => handleGoChannel("shorts")}
                      className="text-xs font-bold hover:underline cursor-pointer"
                    >
                      @
                      {projectName?.toLowerCase().replace(/\s+/g, "") ||
                        "practiscale"}
                    </span>
                    <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow transition">
                      Subscribe
                    </button>
                  </div>

                  {/* Caption */}
                  <p className="text-xs text-white/95 line-clamp-2 leading-snug font-medium mb-2">
                    {thumbnailName} - The #1 framework top creators use to 10x
                    hook rate and retention ⚡ #shorts #creative
                  </p>

                  {/* Audio strip */}
                  <div className="flex items-center space-x-2 text-[11px] text-white/80">
                    <Music className="w-3.5 h-3.5 text-white" />
                    <span className="truncate">
                      Original audio - {projectName || "PractiScale Media"}
                    </span>
                  </div>
                </div>
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
            <button
              onClick={handleGoShorts}
              className={`flex flex-col items-center ${
                viewMode === "shorts" ? "text-black font-bold" : "text-gray-500"
              }`}
            >
              <Flame
                className={`w-4 h-4 ${viewMode === "shorts" ? "text-red-600" : ""}`}
              />
              <span>Shorts</span>
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
                viewMode === "channel"
                  ? "text-black font-bold"
                  : "text-gray-500"
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
    <div className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col min-h-[820px] select-none">
      {/* 0. Beautified Simulator View Mode Control Ribbon */}
      <div className="h-13 px-4 sm:px-5 bg-white border-b border-gray-200/90 flex items-center justify-between text-xs overflow-hidden shrink-0">
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-1.5 text-gray-400 font-extrabold uppercase tracking-wider text-[10px] shrink-0 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span>Feed View:</span>
          </div>
          <div className="inline-flex items-center p-1 bg-gray-100/90 rounded-2xl border border-gray-200/80 shadow-2xs shrink-0 gap-1 select-none">
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
              onClick={handleGoShorts}
              className={`whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                viewMode === "shorts"
                  ? "bg-white text-gray-900 shadow-xs border border-gray-200/80 ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
              }`}
            >
              <Flame
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                  viewMode === "shorts" ? "text-red-600" : "text-gray-400"
                }`}
              />
              <span className="whitespace-nowrap">Shorts Feed</span>
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

        <div className="hidden xl:flex items-center space-x-2 text-[11px] text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-200/60 max-w-sm truncate shrink min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-[#0ABAB5] shrink-0" />
          <span className="truncate">
            {viewMode === "home"
              ? "Previewing your thumbnail in the multi-column YouTube Home algorithm feed"
              : viewMode === "search"
                ? "Previewing your thumbnail in horizontal search ranking cards"
                : viewMode === "shorts"
                  ? "Previewing your 9:16 vertical video in the YouTube Shorts viewer"
                  : "Previewing your channel layout, banner, video tabs, and shorts"}
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
            title="Click to go to YouTube Home"
            className="flex items-center space-x-1 cursor-pointer group"
          >
            <div className="w-7 h-5 bg-red-600 rounded-md flex items-center justify-center text-white text-[11px] font-black group-hover:scale-105 transition">
              ▶
            </div>
            <span className="font-bold text-lg tracking-tighter text-gray-900 font-sans">
              YouTube
            </span>
          </div>
        </div>

        {/* Center: Interactive Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteSearch(searchInput);
          }}
          className="flex items-center space-x-3 w-1/2 max-w-xl"
        >
          <div className="flex w-full items-center border border-gray-300 rounded-full overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-xs bg-white">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search"
              className="w-full px-4 py-2 text-sm outline-none bg-transparent text-gray-900"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              title="Search"
              className="px-5 py-2 bg-gray-50 border-l border-gray-300 hover:bg-gray-100 text-gray-600 transition"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition"
          >
            <Mic className="w-4 h-4" />
          </button>
        </form>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 text-gray-700">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Bell className="w-5 h-5" />
          </button>
          <div
            onClick={handleGoChannel}
            title="Click to view channel"
            className="w-8 h-8 rounded-full bg-rose-200 text-rose-900 font-bold text-xs flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-rose-300 transition"
          >
            P
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
              <Flame className="w-4 h-4" />
              <span>Shorts</span>
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
              onClick={handleGoChannel}
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

        {/* Dynamic Center Canvas */}
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          {/* ================================================================ */}
          {/* VIEW 1: YOUTUBE HOME FEED                                        */}
          {/* ================================================================ */}
          {viewMode === "home" && (
            <div className="p-5">
              {/* Category Chips Bar */}
              <div
                className="flex items-center space-x-2 pb-5 overflow-x-auto no-scrollbar"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      activeCategory === cat
                        ? "bg-gray-900 text-white shadow-xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* YouTube Responsive Video Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-7">
                {/* CARD 1: User's Uploaded Video Thumbnail */}
                <div className="group flex flex-col cursor-pointer">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 ring-2 ring-[#0ABAB5] shadow-sm hover:shadow-lg transition">
                    {thumbnailSrc ? (
                      <img
                        src={thumbnailSrc}
                        alt={thumbnailName}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Thumbnail Asset
                      </div>
                    )}

                    <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] px-1.5 py-0.5 rounded font-mono font-bold">
                      14:01
                    </span>

                    {/* Beautified Hotspot upload badge */}
                    <button
                      onClick={onUploadThumbnail}
                      title="Click to upload or replace thumbnail"
                      className="absolute top-2.5 left-2.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md border border-white/20 flex items-center space-x-1.5 transition-all hover:scale-105 active:scale-95 z-10"
                    >
                      <Upload className="w-3 h-3 text-[#0ABAB5]" />
                      <span>Your Thumbnail</span>
                    </button>
                  </div>

                  <div className="flex space-x-3 pt-3">
                    <div
                      onClick={onUploadLogo}
                      title="Click to upload logo"
                      className="w-9 h-9 rounded-full bg-teal-50 text-[#089793] font-bold text-xs flex items-center justify-center border border-teal-200 shrink-0 overflow-hidden cursor-pointer hover:opacity-90 transition"
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
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-black">
                        {thumbnailName} - How Mission One Services Scaled Video
                        Production
                      </h3>
                      <div className="flex items-center space-x-1 text-xs text-gray-600 mt-1">
                        <span className="font-semibold hover:text-gray-900">
                          {projectName || "PractiScale"}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      </div>
                      <p className="text-xs text-gray-500">
                        124K views • 1 hour ago
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-700 p-1 self-start">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* CARDS 2-6: Competitor / Organic Videos */}
                {mockHomeVideos
                  .filter((v) => !v.isUser)
                  .map((video) => (
                    <div
                      key={video.id}
                      className="group flex flex-col cursor-pointer"
                    >
                      <div
                        className={`relative aspect-video w-full rounded-2xl overflow-hidden bg-gradient-to-br ${video.gradient} flex items-center justify-center p-4 shadow-xs group-hover:shadow-md transition`}
                      >
                        <div className="text-center text-white px-2">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded">
                            {video.badge}
                          </span>
                          <h4 className="text-sm md:text-base font-black mt-2 leading-tight drop-shadow">
                            {video.title}
                          </h4>
                          <p className="text-[11px] text-gray-200 mt-1 opacity-90">
                            {video.iconSubtitle}
                          </p>
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] px-1.5 py-0.5 rounded font-mono font-bold">
                          {video.duration}
                        </span>
                      </div>

                      <div className="flex space-x-3 pt-3">
                        <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {video.channel.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                            {video.title}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            {video.channel}
                          </p>
                          <p className="text-xs text-gray-500">
                            {video.views} • {video.time}
                          </p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-700 p-1 self-start">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* YouTube Shorts Shelf in Feed */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Flame className="w-5 h-5 text-red-600" />
                  <h3 className="text-base font-bold text-gray-900">Shorts</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-[9/16] relative ring-2 ring-[#0ABAB5] shadow-sm group">
                    {shortSrc && (
                      <img
                        src={shortSrc}
                        alt="Short"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      onClick={onUploadShort}
                      className="absolute top-2.5 left-2.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow border border-white/20"
                    >
                      ↑ Short
                    </button>
                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <p className="text-[11px] font-bold line-clamp-2 leading-tight">
                        {thumbnailName} - Quick Take
                      </p>
                      <span className="text-[9px] text-gray-300">
                        12K views
                      </span>
                    </div>
                  </div>

                  {[2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="bg-slate-200 rounded-2xl overflow-hidden aspect-[9/16] relative opacity-70 flex items-end p-2.5"
                    >
                      <p className="text-xs text-gray-700 font-semibold">
                        Shorts Highlight #{i}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* VIEW 2: YOUTUBE SEARCH RESULTS                                   */}
          {/* ================================================================ */}
          {viewMode === "search" && (
            <div className="p-5 max-w-5xl">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-5">
                <button className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-800 transition active:scale-95 shadow-2xs">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>
                <div className="text-xs text-gray-500">
                  About 1,840 results for{" "}
                  <span className="font-bold text-gray-800">
                    &ldquo;{searchQuery}&rdquo;
                  </span>
                </div>
              </div>

              {/* Horizontal YouTube Search Results List */}
              <div className="space-y-5">
                {/* Result 1: User's Featured Thumbnail */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 p-3.5 rounded-2xl ring-2 ring-[#0ABAB5] bg-white shadow-sm hover:shadow-md transition">
                  <div className="relative w-full sm:w-[340px] md:w-[360px] aspect-video rounded-xl overflow-hidden bg-slate-900 shrink-0">
                    {thumbnailSrc ? (
                      <img
                        src={thumbnailSrc}
                        alt={thumbnailName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        Thumbnail Asset
                      </div>
                    )}
                    <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] px-1.5 py-0.5 rounded font-mono font-bold">
                      14:01
                    </span>
                    <button
                      onClick={onUploadThumbnail}
                      title="Click to replace thumbnail"
                      className="absolute top-2.5 left-2.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md border border-white/20 flex items-center space-x-1.5 transition-all hover:scale-105 active:scale-95 z-10"
                    >
                      <Upload className="w-3 h-3 text-[#0ABAB5]" />
                      <span>Your Result</span>
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col justify-start">
                    <h3 className="text-base md:text-lg font-normal text-gray-900 hover:text-blue-600 line-clamp-2 leading-snug cursor-pointer">
                      {thumbnailName} - The Complete Guide to Creative
                      Production & Packaging
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      124K views • 1 hour ago
                    </p>

                    <div className="flex items-center space-x-2 my-2">
                      <div
                        onClick={onUploadLogo}
                        className="w-6 h-6 rounded-full bg-teal-50 text-[#089793] text-[10px] font-bold flex items-center justify-center border border-teal-200 overflow-hidden cursor-pointer"
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
                      <span className="text-xs font-medium text-gray-600 hover:text-gray-900">
                        {projectName || "PractiScale"}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      In this session, we break down end-to-end creative
                      workflows, thumbnail CTR benchmarking, and visual
                      hierarchy tactics that consistently double click-through
                      rates across competitive feeds.
                    </p>

                    <div className="flex items-center space-x-1.5 mt-3">
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded">
                        NEW
                      </span>
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded">
                        4K
                      </span>
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded">
                        CC
                      </span>
                    </div>
                  </div>
                </div>

                {/* Results 2-4: Competitor Search Results */}
                {mockSearchResults
                  .filter((r) => !r.isUser)
                  .map((res) => (
                    <div
                      key={res.id}
                      className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 p-3.5 rounded-2xl border border-gray-200 bg-white hover:shadow-md transition"
                    >
                      <div
                        className={`relative w-full sm:w-[340px] md:w-[360px] aspect-video rounded-xl overflow-hidden bg-gradient-to-br ${res.gradient} flex items-center justify-center p-4 shrink-0`}
                      >
                        <span className="text-xs font-black uppercase text-white bg-black/40 px-2.5 py-1 rounded">
                          {res.tagline}
                        </span>
                        <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] px-1.5 py-0.5 rounded font-mono font-bold">
                          {res.duration}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col justify-start">
                        <h3 className="text-base md:text-lg font-normal text-gray-900 hover:text-blue-600 line-clamp-2 leading-snug cursor-pointer">
                          {res.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {res.views} • {res.time}
                        </p>

                        <div className="flex items-center space-x-2 my-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-[10px] font-bold flex items-center justify-center">
                            {res.channel.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-xs font-medium text-gray-600">
                            {res.channel}
                          </span>
                          {res.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                          )}
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {res.description}
                        </p>

                        <div className="flex items-center space-x-1.5 mt-3">
                          {res.badges.map((b) => (
                            <span
                              key={b}
                              className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* VIEW 3: YOUTUBE CHANNEL PAGE                                     */}
          {/* ================================================================ */}
          {viewMode === "channel" && (
            <div className="p-5">
              <div className="relative w-full h-36 md:h-48 rounded-2xl overflow-hidden bg-gradient-to-r from-[#08202A] via-[#0E3D46] to-[#0ABAB5] shadow-sm mb-5 group">
                {bannerUrl ? (
                  <img
                    src={bannerUrl}
                    alt="Channel Banner"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white px-4">
                        <span className="text-xs uppercase tracking-widest font-extrabold text-teal-200">
                          {projectName || "PractiScale Enterprise Media"}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black mt-1">
                          Scale Your Creative Production
                        </h2>
                      </div>
                    </div>
                  </>
                )}

                <button
                  onClick={onUploadBanner}
                  title="Click to upload or replace banner"
                  className="absolute top-3 right-3 bg-black/75 hover:bg-black backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow border border-white/20 flex items-center space-x-1.5 transition active:scale-95 cursor-pointer z-10"
                >
                  <Camera className="w-3.5 h-3.5 text-[#0ABAB5]" />
                  <span>↑ Banner</span>
                </button>
              </div>

              {/* Channel Profile Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <div
                      onClick={onUploadLogo}
                      title="Click to upload or change logo"
                      className="w-16 h-16 rounded-full bg-teal-50 text-[#089793] font-black text-xl flex items-center justify-center border-2 border-teal-300 shadow-sm overflow-hidden cursor-pointer hover:opacity-90 transition"
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
                    <button
                      onClick={onUploadLogo}
                      title="Click to upload logo"
                      className="absolute -bottom-1 -right-1 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow border border-white/20 flex items-center space-x-0.5 cursor-pointer transition active:scale-95"
                    >
                      <Camera className="w-2.5 h-2.5 text-[#0ABAB5]" />
                      <span>↑ Logo</span>
                    </button>
                  </div>

                  <div>
                    <h1 className="text-xl font-extrabold text-gray-900">
                      {projectName || "PractiScale"}
                    </h1>
                    <p className="text-xs text-gray-500 font-medium">
                      @practiscale · 771 subscribers · 31 videos
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-1.5 rounded-full shadow-xs">
                        Subscribe
                      </button>
                      <button className="border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold text-xs px-3.5 py-1.5 rounded-full">
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Channel Tabs */}
              <div className="flex items-center space-x-6 border-b border-gray-200 text-xs font-semibold text-gray-500 mb-5">
                <button
                  onClick={() => setChannelTab("home")}
                  className={`pb-2.5 relative whitespace-nowrap transition-colors ${
                    channelTab === "home"
                      ? "text-black font-bold border-b-2 border-black"
                      : "hover:text-black"
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setChannelTab("videos")}
                  className={`pb-2.5 relative whitespace-nowrap transition-colors ${
                    channelTab === "videos"
                      ? "text-black font-bold border-b-2 border-black"
                      : "hover:text-black"
                  }`}
                >
                  Videos
                </button>
                <button
                  onClick={() => setChannelTab("shorts")}
                  className={`pb-2.5 relative whitespace-nowrap transition-colors ${
                    channelTab === "shorts"
                      ? "text-black font-bold border-b-2 border-black"
                      : "hover:text-black"
                  }`}
                >
                  Shorts
                </button>
                <button
                  onClick={() => setChannelTab("playlists")}
                  className={`pb-2.5 relative whitespace-nowrap transition-colors ${
                    channelTab === "playlists"
                      ? "text-black font-bold border-b-2 border-black"
                      : "hover:text-black"
                  }`}
                >
                  Playlists
                </button>
              </div>

              {/* TAB 1: VIDEOS */}
              {channelTab === "videos" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setVideoSort("latest")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          videoSort === "latest"
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Latest
                      </button>
                      <button
                        onClick={() => setVideoSort("popular")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          videoSort === "popular"
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Popular
                      </button>
                      <button
                        onClick={() => setVideoSort("oldest")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          videoSort === "oldest"
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Oldest
                      </button>
                    </div>

                    <button
                      onClick={onUploadThumbnail}
                      className="text-xs font-bold text-[#089793] hover:text-[#0ABAB5] flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Video Thumbnail</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedChannelVideos.map((video) => {
                      if (video.isUser) {
                        return (
                          <div
                            key={video.id}
                            className="bg-white rounded-2xl overflow-hidden ring-2 ring-[#0ABAB5] shadow-sm hover:shadow-md transition group"
                          >
                            <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                              {thumbnailSrc ? (
                                <img
                                  src={thumbnailSrc}
                                  alt={thumbnailName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-gray-400 text-xs">
                                  Thumbnail Asset
                                </div>
                              )}

                              <button
                                onClick={onUploadThumbnail}
                                title="Click to upload or replace thumbnail"
                                className="absolute top-2.5 left-2.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1 transition active:scale-95 cursor-pointer z-10"
                              >
                                <Upload className="w-3 h-3 text-[#0ABAB5]" />
                                <span>↑ Thumbnail</span>
                              </button>

                              <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] px-1.5 py-0.5 rounded font-bold font-mono">
                                {video.duration}
                              </span>
                            </div>
                            <div className="p-3">
                              <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                                {video.title}
                              </h4>
                              <p className="text-[11px] text-gray-500 mt-1">
                                {projectName || "PractiScale"} • {video.views} •{" "}
                                {video.time}
                              </p>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={video.id}
                          className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 shadow-xs hover:shadow-md transition group"
                        >
                          <div
                            className={`relative aspect-video w-full bg-gradient-to-br ${video.gradient} flex items-center justify-center p-3`}
                          >
                            <span className="text-[10px] font-extrabold uppercase text-white bg-black/40 px-2 py-0.5 rounded">
                              {video.tagline}
                            </span>
                            <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] px-1.5 py-0.5 rounded font-mono">
                              {video.duration}
                            </span>
                          </div>
                          <div className="p-3">
                            <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug">
                              {video.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 mt-1">
                              {projectName || "PractiScale"} • {video.views} •{" "}
                              {video.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: SHORTS */}
              {channelTab === "shorts" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShortsSort("latest")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          shortsSort === "latest"
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Latest
                      </button>
                      <button
                        onClick={() => setShortsSort("popular")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          shortsSort === "popular"
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Popular
                      </button>
                    </div>

                    <button
                      onClick={onUploadShort}
                      className="text-xs font-bold text-[#089793] hover:text-[#0ABAB5] flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload 9:16 Short Asset</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                    {/* User's Short */}
                    <div
                      onClick={handleGoShorts}
                      className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer shadow-sm hover:shadow-md ring-2 ring-[#0ABAB5] transition"
                    >
                      {shortSrc ? (
                        <img
                          src={shortSrc}
                          alt={thumbnailName}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2">
                          Short Asset
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUploadShort?.();
                        }}
                        title="Click to upload or replace short"
                        className="absolute top-2 left-2 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1 transition active:scale-95 z-10"
                      >
                        <Upload className="w-3 h-3 text-[#0ABAB5]" />
                        <span>↑ Short</span>
                      </button>

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex flex-col justify-end">
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                          {thumbnailName} #shorts
                        </h4>
                        <span className="text-[11px] text-gray-200 font-semibold mt-1">
                          320K views
                        </span>
                      </div>
                    </div>

                    {/* Competitor Shorts */}
                    {sortedChannelShorts
                      .filter((s) => !s.isUser)
                      .map((s) => (
                        <div
                          key={s.id}
                          onClick={handleGoShorts}
                          className={`relative aspect-[9/16] rounded-2xl overflow-hidden bg-gradient-to-br ${s.gradient} group cursor-pointer shadow-sm hover:shadow-md transition p-3 flex flex-col justify-between`}
                        >
                          <span className="text-[9px] font-black uppercase text-white/90 bg-black/40 px-2 py-0.5 rounded self-start">
                            {s.tagline}
                          </span>

                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex flex-col justify-end">
                            <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                              {s.title}
                            </h4>
                            <span className="text-[11px] text-gray-200 font-semibold mt-1">
                              {s.views}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 3: HOME OVERVIEW */}
              {channelTab === "home" && (
                <div>
                  {/* Latest Uploads Row */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-gray-900">
                        Featured releases
                      </h3>
                      <button
                        onClick={() => setChannelTab("videos")}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Play all
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-white rounded-2xl overflow-hidden ring-2 ring-[#0ABAB5] shadow-sm hover:shadow-md transition group">
                        <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                          {thumbnailSrc ? (
                            <img
                              src={thumbnailSrc}
                              alt={thumbnailName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-gray-400 text-xs">
                              Thumbnail Asset
                            </div>
                          )}
                          <button
                            onClick={onUploadThumbnail}
                            title="Click to upload or replace thumbnail"
                            className="absolute top-2.5 left-2.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1 transition active:scale-95 cursor-pointer z-10"
                          >
                            <Upload className="w-3 h-3 text-[#0ABAB5]" />
                            <span>↑ Thumbnail</span>
                          </button>
                          <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] px-1.5 py-0.5 rounded font-bold font-mono">
                            14:01
                          </span>
                        </div>
                        <div className="p-3">
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                            {thumbnailName} - The Complete Guide to Creative
                            Production & Packaging
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-1">
                            124K views · 1 hour ago
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 opacity-80 hover:opacity-100 transition">
                        <div className="relative aspect-video w-full bg-gradient-to-br from-[#08202A] to-[#0E3D46] flex items-center justify-center text-xs text-white font-bold p-3 text-center">
                          <span>
                            Creative Production Strategy: Scaling
                            High-Converting Assets
                          </span>
                          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] px-1.5 py-0.5 rounded font-mono">
                            24:18
                          </span>
                        </div>
                        <div className="p-3">
                          <h4 className="text-xs font-semibold text-gray-800 line-clamp-2">
                            Creative Production Strategy: Scaling
                            High-Converting Assets
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-1">
                            89K views · 2 weeks ago
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 opacity-80 hover:opacity-100 transition">
                        <div className="relative aspect-video w-full bg-gradient-to-br from-slate-900 to-teal-950 flex items-center justify-center text-xs text-white font-bold p-3 text-center">
                          <span>Building Rapid Creative Testing Machines</span>
                          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] px-1.5 py-0.5 rounded font-mono">
                            18:45
                          </span>
                        </div>
                        <div className="p-3">
                          <h4 className="text-xs font-semibold text-gray-800 line-clamp-2">
                            Building Rapid Creative Testing Machines for Paid
                            Media
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-1">
                            340K views · 1 month ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shorts Row */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Flame className="w-4 h-4 text-red-600" />
                      <h3 className="text-sm font-bold text-gray-900">
                        Shorts
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      <div
                        onClick={handleGoShorts}
                        className="bg-slate-900 rounded-2xl overflow-hidden aspect-[9/16] relative ring-2 ring-[#0ABAB5] shadow-sm group cursor-pointer"
                      >
                        {shortSrc ? (
                          <img
                            src={shortSrc}
                            alt={thumbnailName}
                            className="w-full h-full object-cover"
                          />
                        ) : null}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUploadShort?.();
                          }}
                          title="Click to upload or replace short frame"
                          className="absolute top-2.5 left-2.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow border border-white/20 flex items-center space-x-1 transition active:scale-95 cursor-pointer z-10"
                        >
                          <Upload className="w-2.5 h-2.5 text-[#0ABAB5]" />
                          <span>↑ Short</span>
                        </button>

                        <div className="absolute bottom-2 left-2 right-2 text-white">
                          <p className="text-[11px] font-bold line-clamp-2 leading-tight drop-shadow">
                            {thumbnailName} #shorts
                          </p>
                          <span className="text-[9px] text-gray-300">
                            320K views
                          </span>
                        </div>
                      </div>

                      {mockChannelShorts.slice(1, 5).map((s) => (
                        <div
                          key={s.id}
                          onClick={handleGoShorts}
                          className={`rounded-2xl overflow-hidden aspect-[9/16] relative flex items-end p-2.5 cursor-pointer shadow-xs bg-gradient-to-br ${s.gradient}`}
                        >
                          <div className="text-white">
                            <p className="text-[10px] font-bold line-clamp-2 leading-tight">
                              {s.title}
                            </p>
                            <span className="text-[9px] text-gray-200">
                              {s.views}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PLAYLISTS */}
              {channelTab === "playlists" && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-gray-900">
                      Created playlists
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {mockPlaylists.map((pl) => (
                      <div
                        key={pl.id}
                        className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer"
                      >
                        <div
                          className={`relative aspect-video w-full bg-gradient-to-br ${pl.gradient} flex items-center justify-center text-white`}
                        >
                          <div className="absolute right-0 inset-y-0 w-20 bg-black/60 backdrop-blur-2xs flex flex-col items-center justify-center">
                            <ListVideo className="w-5 h-5 text-white" />
                            <span className="text-xs font-bold mt-1">
                              {pl.videoCount} videos
                            </span>
                          </div>
                        </div>
                        <div className="p-3.5">
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                            {pl.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {projectName || "PractiScale"} • {pl.updated}
                          </p>
                          <span className="text-xs font-semibold text-[#089793] mt-2 inline-block">
                            View full playlist
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* VIEW 4: YOUTUBE SHORTS VIEWER (DESKTOP)                          */}
          {/* ================================================================ */}
          {viewMode === "shorts" && (
            <div className="p-8 flex items-center justify-center bg-gray-900/5 min-h-[720px]">
              <div className="flex items-center space-x-6">
                {/* 9:16 Vertical Player Card */}
                <div className="relative w-[360px] h-[640px] rounded-3xl overflow-hidden shadow-2xl bg-black flex flex-col justify-between">
                  {/* Short Media */}
                  <div className="absolute inset-0">
                    {shortSrc ? (
                      <img
                        src={shortSrc}
                        alt="Short frame"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-gray-400 text-sm">
                        Short Asset
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />
                  </div>

                  {/* Top bar on short */}
                  <div className="relative z-10 p-4 flex items-center justify-between text-white">
                    <button
                      onClick={handleGoHome}
                      className="p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md transition"
                    >
                      <ArrowLeft className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={onUploadShort}
                      title="Upload 9:16 Short frame"
                      className="bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow flex items-center space-x-1.5 transition active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#0ABAB5]" />
                      <span>Upload Short</span>
                    </button>
                  </div>

                  {/* Bottom info on short */}
                  <div className="relative z-10 p-5 text-white">
                    <div className="flex items-center space-x-3 mb-2.5">
                      <div
                        onClick={onUploadLogo}
                        className="w-9 h-9 rounded-full bg-teal-50 text-[#089793] font-bold text-xs flex items-center justify-center border border-white/40 overflow-hidden cursor-pointer shrink-0"
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
                      <span
                        onClick={() => handleGoChannel("shorts")}
                        className="text-sm font-bold hover:underline cursor-pointer"
                      >
                        @
                        {projectName?.toLowerCase().replace(/\s+/g, "") ||
                          "practiscale"}
                      </span>
                      <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow transition">
                        Subscribe
                      </button>
                    </div>

                    <p className="text-sm font-medium text-white/95 line-clamp-2 leading-snug mb-2">
                      {thumbnailName} - The exact workflow we use to scale video
                      creative 10x #shorts #marketing
                    </p>

                    <div className="flex items-center space-x-2 text-xs text-white/80">
                      <Music className="w-3.5 h-3.5 text-white" />
                      <span className="truncate">
                        Original sound - {projectName || "PractiScale Media"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop Action Column on Right */}
                <div className="flex flex-col space-y-4">
                  <button className="flex flex-col items-center space-y-1 group">
                    <div className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition active:scale-95 shadow-sm">
                      <ThumbsUp className="w-5 h-5 text-gray-800" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">
                      142K
                    </span>
                  </button>

                  <button className="flex flex-col items-center space-y-1 group">
                    <div className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition active:scale-95 shadow-sm">
                      <ThumbsDown className="w-5 h-5 text-gray-800" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">
                      Dislike
                    </span>
                  </button>

                  <button className="flex flex-col items-center space-y-1 group">
                    <div className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition active:scale-95 shadow-sm">
                      <MessageSquare className="w-5 h-5 text-gray-800" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">
                      2.4K
                    </span>
                  </button>

                  <button className="flex flex-col items-center space-y-1 group">
                    <div className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition active:scale-95 shadow-sm">
                      <Share2 className="w-5 h-5 text-gray-800" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">
                      Share
                    </span>
                  </button>

                  <button className="flex flex-col items-center space-y-1 group">
                    <div className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition active:scale-95 shadow-sm">
                      <Sparkles className="w-5 h-5 text-gray-800" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">
                      Remix
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
