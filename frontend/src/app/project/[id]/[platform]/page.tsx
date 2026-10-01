"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Project,
  Variant,
  Platform,
  Device,
  CommentItem,
  PlatformAssets,
} from "@/lib/types";
import {
  api,
  getLocalPlatformState,
  saveLocalPlatformState,
  formatProjectTitle,
  formatVariantLabel,
  formatSlotFriendlyName,
  DEFAULT_PLATFORM_DUMMY_COPY,
} from "@/lib/api";
import { TopNav } from "@/components/shell/TopNav";
import { PlatformTabBar } from "@/components/shell/PlatformTabBar";
import { ThumbnailInsightsPanel } from "@/components/insights/ThumbnailInsightsPanel";
import { YouTubeSimulator } from "@/components/simulator/YouTubeSimulator";
import { InstagramSimulator } from "@/components/simulator/InstagramSimulator";
import { FacebookSimulator } from "@/components/simulator/FacebookSimulator";
import { TikTokSimulator } from "@/components/simulator/TikTokSimulator";
import { LinkedInSimulator } from "@/components/simulator/LinkedInSimulator";
import { SimulatorCopyControl } from "@/components/simulator/SimulatorCopyControl";
import { SharePreviewModal } from "@/components/share/SharePreviewModal";
import { AddVariantModal } from "@/components/variants/AddVariantModal";
import { Loader2, MessageSquare, ArrowRight, X } from "lucide-react";

const VALID_PLATFORMS: Platform[] = [
  "youtube",
  "instagram",
  "facebook",
  "tiktok",
  "linkedin",
];

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();

  const projectId = String(params?.id || "");
  const platformParam = String(
    params?.platform || "youtube",
  ).toLowerCase() as Platform;
  const currentPlatform: Platform = VALID_PLATFORMS.includes(platformParam)
    ? platformParam
    : "youtube";

  const [project, setProject] = useState<Project | null>(null);
  const [activeVariant, setActiveVariant] = useState<Variant | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [insightsTab, setInsightsTab] = useState<
    "tracker" | "insights" | "variants" | "reviews"
  >("tracker");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState("Saved just now");
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [localPlatformVersion, setLocalPlatformVersion] = useState(0);
  const [customSlotThumbs, setCustomSlotThumbs] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("practiscale_other_video_thumbs_v1");
      if (saved) {
        setCustomSlotThumbs(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Modals
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAddVariantOpen, setIsAddVariantOpen] = useState(false);

  // Live real-time comments toast & tracking
  const [newCommentToast, setNewCommentToast] = useState<CommentItem | null>(
    null,
  );
  const initialCommentsLoadedRef = useRef(false);

  // Hidden file inputs for direct simulator click uploads
  const simBannerInputRef = useRef<HTMLInputElement>(null);
  const simLogoInputRef = useRef<HTMLInputElement>(null);
  const simThumbInputRef = useRef<HTMLInputElement>(null);
  const simShortInputRef = useRef<HTMLInputElement>(null);

  // Helper to resolve which platform a variant belongs to (backend field + localStorage fallback)
  const resolveVariantPlatform = (
    v: Variant,
    localMap: Record<string, Platform>,
  ): Platform => {
    if (v.platform && VALID_PLATFORMS.includes(v.platform)) {
      return v.platform;
    }
    if (localMap[v._id] && VALID_PLATFORMS.includes(localMap[v._id])) {
      return localMap[v._id];
    }
    return "youtube";
  };

  // Strictly filter variants for the current platform ONLY and sanitize any raw image filenames
  const platformVariants = useMemo(() => {
    const localState = getLocalPlatformState(projectId);
    const serverFiltered = (project?.variants || [])
      .map((v) => ({
        ...v,
        platform: resolveVariantPlatform(v, localState.variantPlatforms),
      }))
      .filter((v) => v.platform === currentPlatform);

    // Also synthesize any slot thumbnails from customSlotThumbs (e.g. comp-1, comp-2) not yet on server
    const synthesizedSlotVariants: Variant[] = [];
    if (currentPlatform === "youtube") {
      Object.entries(customSlotThumbs).forEach(([slotId, dataUrl]) => {
        if (!dataUrl) return;
        const existsOnServer = serverFiltered.some(
          (v) => v.notes === `slot:${slotId}` || v.asset?.secureUrl === dataUrl
        );
        if (!existsOnServer) {
          const idx = serverFiltered.length + synthesizedSlotVariants.length;
          synthesizedSlotVariants.push({
            _id: `local-slot-${slotId}`,
            projectId,
            platform: "youtube",
            name: formatVariantLabel(undefined, idx),
            notes: `slot:${slotId}`,
            assetId: `asset-${slotId}`,
            asset: {
              provider: "local",
              cloudinaryPublicId: "",
              secureUrl: dataUrl,
              width: 1280,
              height: 720,
            },
            createdAt: new Date().toISOString(),
          });
        }
      });
    }

    const combined = [...serverFiltered, ...synthesizedSlotVariants];
    return combined.map((v, idx) => ({
      ...v,
      name: formatVariantLabel(v.name, idx),
    }));
  }, [project, projectId, currentPlatform, localPlatformVersion, customSlotThumbs]);

  // Custom or Dummy Copy for current platform
  const currentCustomCopy = useMemo(() => {
    const localState = getLocalPlatformState(projectId);
    return localState.customCopy?.[currentPlatform] || {};
  }, [projectId, currentPlatform, localPlatformVersion]);

  const handleUpdateCustomCopy = (next: {
    title?: string;
    channelName?: string;
  }) => {
    saveLocalPlatformState(projectId, (prev) => ({
      ...prev,
      customCopy: {
        ...(prev.customCopy || {}),
        [currentPlatform]: next,
      },
    }));
    setLocalPlatformVersion((v) => v + 1);
    setSaveStatus("Saved preview text");
    setTimeout(() => setSaveStatus("Saved just now"), 1200);
  };

  // Strictly resolve channel/profile assets for the current platform ONLY
  const currentPlatformAssets: PlatformAssets = useMemo(() => {
    const localState = getLocalPlatformState(projectId);
    const fromBackend = project?.platformAssets?.[currentPlatform] || {};
    const fromLocal = localState.platformAssets?.[currentPlatform] || {};
    const fallbackYoutube: PlatformAssets =
      currentPlatform === "youtube"
        ? {
            logoUrl: project?.logoUrl,
            bannerUrl: project?.bannerUrl,
            shortFrameUrl: project?.shortFrameUrl,
          }
        : {};
    return {
      logoUrl:
        fromBackend.logoUrl || fromLocal.logoUrl || fallbackYoutube.logoUrl,
      bannerUrl:
        fromBackend.bannerUrl ||
        fromLocal.bannerUrl ||
        fallbackYoutube.bannerUrl,
      shortFrameUrl:
        fromBackend.shortFrameUrl ||
        fromLocal.shortFrameUrl ||
        fallbackYoutube.shortFrameUrl,
    };
  }, [project, projectId, currentPlatform, localPlatformVersion]);

  // Keep activeVariant strictly scoped to currentPlatform whenever platform or variants change
  useEffect(() => {
    if (!project) return;
    const localState = getLocalPlatformState(projectId);
    const preferredId =
      project.activeVariantsByPlatform?.[currentPlatform]?._id ||
      project.activeVariantIds?.[currentPlatform] ||
      localState.activeVariantsByPlatform?.[currentPlatform] ||
      (currentPlatform === "youtube" ? project.activeVariantId : undefined);

    if (preferredId) {
      const found = platformVariants.find((v) => v._id === preferredId);
      if (found) {
        setActiveVariant(found);
        return;
      }
    }
    setActiveVariant(platformVariants[0] || null);
  }, [project, projectId, currentPlatform, platformVariants]);

  // Fetch project comments (client reviews)
  const loadComments = async () => {
    if (!projectId) return;
    try {
      const data = await api.getProjectComments(projectId);
      setComments((prev) => {
        if (initialCommentsLoadedRef.current && data.length > prev.length) {
          const newest = data[0];
          if (newest && !prev.some((c) => c._id === newest._id)) {
            setNewCommentToast(newest);
            setTimeout(() => {
              setNewCommentToast((curr) =>
                curr?._id === newest._id ? null : curr,
              );
            }, 6000);
          }
        }
        initialCommentsLoadedRef.current = true;

        if (
          prev.length === data.length &&
          prev.every((c, i) => c._id === data[i]?._id)
        ) {
          return prev;
        }
        return data;
      });
    } catch {
      // ignore
    }
  };

  // Fetch project data
  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await api.getProject(projectId);
      setProject(data);
      loadComments();
    } catch (err: any) {
      setError(err.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) return;

    loadProject();
    loadComments();

    const interval = setInterval(() => {
      loadComments();
    }, 3500);

    const handleFocus = () => {
      loadComments();
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [projectId]);

  // Platform navigation
  const handleSelectPlatform = (newPlatform: Platform) => {
    router.push(`/project/${projectId}/${newPlatform}`);
  };

  // Switch active creative variant for currentPlatform only
  const handleSelectVariant = async (variantId: string) => {
    if (!project) return;
    const chosen = platformVariants.find((v) => v._id === variantId);
    if (chosen) {
      setActiveVariant(chosen);
      saveLocalPlatformState(projectId, (prev) => ({
        ...prev,
        activeVariantsByPlatform: {
          ...prev.activeVariantsByPlatform,
          [currentPlatform]: variantId,
        },
      }));
      setLocalPlatformVersion((v) => v + 1);
      setSaveStatus("Saving changes...");
      try {
        await api.updateProject(projectId, {
          activeVariantId: variantId,
          platform: currentPlatform,
        });
        setSaveStatus("Saved just now");
      } catch {
        setSaveStatus("Saved");
      }
    }
  };

  // Direct asset upload handler (banner, logo, shortFrame, thumbnail) scoped to currentPlatform
  const handleUploadAsset = async (
    type: "banner" | "logo" | "shortFrame" | "thumbnail",
    file: File,
  ) => {
    if (!projectId) return;
    setUploadingSlot(type);
    setSaveStatus(`Uploading ${type}...`);
    try {
      const updatedProject = await api.uploadChannelAsset(
        projectId,
        file,
        type,
        currentPlatform,
      );
      setLocalPlatformVersion((v) => v + 1);
      setProject(updatedProject);
      setSaveStatus("Saved just now");
    } catch (err: any) {
      alert(err.message || `Failed to upload ${type}`);
      setSaveStatus("Upload error");
    } finally {
      setUploadingSlot(null);
    }
  };

  // Rename project
  const handleRenameProject = async (newTitle: string) => {
    if (!project) return;
    setSaveStatus("Saving title...");
    try {
      const updated = await api.updateProject(projectId, { title: newTitle });
      setProject((prev) => (prev ? { ...prev, title: updated.title } : null));
      setSaveStatus("Saved just now");
    } catch {
      setSaveStatus("Saved");
    }
  };

  // Upload thumbnail for a specific slot and register as a project Variant
  const handleUploadSlotThumbnail = async (file: File, slotId: string) => {
    if (!projectId) return;
    setSaveStatus(`Uploading variant for ${formatSlotFriendlyName(slotId)}...`);
    try {
      const nextIndex = platformVariants.length;
      const cleanName = formatVariantLabel(undefined, nextIndex);
      const newVariant = await api.uploadVariant(
        projectId,
        file,
        cleanName,
        currentPlatform,
        { setAsActive: false, slotId }
      );

      const taggedVariant: Variant = {
        ...newVariant,
        name: cleanName,
        platform: currentPlatform,
        notes: `slot:${slotId}`,
      };

      saveLocalPlatformState(projectId, (prev) => ({
        ...prev,
        variantPlatforms: {
          ...prev.variantPlatforms,
          [taggedVariant._id]: currentPlatform,
        },
      }));

      // Update customSlotThumbs with secureUrl
      const secureUrl = taggedVariant.asset?.secureUrl;
      if (secureUrl) {
        setCustomSlotThumbs((prev) => {
          const next = { ...prev, [slotId]: secureUrl };
          try {
            window.localStorage.setItem("practiscale_other_video_thumbs_v1", JSON.stringify(next));
          } catch {}
          return next;
        });
      }

      setProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          variants: [...prev.variants, taggedVariant],
        };
      });

      setLocalPlatformVersion((v) => v + 1);
      setSaveStatus(`Saved as ${cleanName}`);
      setTimeout(() => setSaveStatus("Saved just now"), 1500);
      return secureUrl;
    } catch (err: any) {
      console.error("Failed to upload slot variant:", err);
      setSaveStatus("Saved locally");
    }
  };

  const handleResetSlotThumbnail = (slotId: string) => {
    setCustomSlotThumbs((prev) => {
      const next = { ...prev };
      delete next[slotId];
      try {
        window.localStorage.setItem("practiscale_other_video_thumbs_v1", JSON.stringify(next));
      } catch {}
      return next;
    });

    // Also remove from project if it was a server variant
    const linked = project?.variants.find((v) => v.notes === `slot:${slotId}`);
    if (linked) {
      api.deleteVariant(linked._id).catch(() => {});
      setProject((prev) =>
        prev
          ? {
              ...prev,
              variants: prev.variants.filter((v) => v._id !== linked._id),
            }
          : null
      );
      setLocalPlatformVersion((v) => v + 1);
    }
  };

  // Add new variant scoped to currentPlatform
  const handleVariantAdded = (newVariant: Variant) => {
    const cleanName = formatVariantLabel(
      newVariant.name,
      platformVariants.length,
    );
    const taggedVariant: Variant = {
      ...newVariant,
      name: cleanName,
      platform: newVariant.platform || currentPlatform,
    };
    saveLocalPlatformState(projectId, (prev) => ({
      ...prev,
      variantPlatforms: {
        ...prev.variantPlatforms,
        [taggedVariant._id]: currentPlatform,
      },
      activeVariantsByPlatform: {
        ...prev.activeVariantsByPlatform,
        [currentPlatform]: taggedVariant._id,
      },
    }));
    setLocalPlatformVersion((v) => v + 1);
    setProject((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        variants: [...prev.variants, taggedVariant],
      };
    });
    setActiveVariant(taggedVariant);
    setSaveStatus("Saved just now");
  };

  // Delete variant (supports both regular and slot variants)
  const handleDeleteVariant = async (variantId: string) => {
    try {
      if (variantId.startsWith("local-slot-")) {
        const slotId = variantId.replace("local-slot-", "");
        handleResetSlotThumbnail(slotId);
        return;
      }

      const toDelete = project?.variants.find((v) => v._id === variantId);
      if (toDelete?.notes?.startsWith("slot:")) {
        const slotId = toDelete.notes.replace("slot:", "");
        setCustomSlotThumbs((prev) => {
          const next = { ...prev };
          delete next[slotId];
          try {
            window.localStorage.setItem("practiscale_other_video_thumbs_v1", JSON.stringify(next));
          } catch {}
          return next;
        });
      }

      await api.deleteVariant(variantId);
      loadProject();
    } catch (err: any) {
      alert(err.message || "Failed to delete variant");
    }
  };

  if (loading && !project) {
    return (
      <div className="min-h-screen bg-brand-surface flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        <p className="text-xs font-bold text-brand-gray">
          Loading Practiscale Workspace...
        </p>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-brand-surface flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-lg font-black text-brand-text-primary mb-2">
          Project Not Found
        </h2>
        <p className="text-xs text-brand-gray mb-4">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold"
        >
          Return to Upload
        </button>
      </div>
    );
  }

  const cleanProjectName = formatProjectTitle(
    project?.title,
    "Q4 Brand Launch",
  );
  const simulatorBrandName =
    currentCustomCopy.channelName?.trim() ||
    DEFAULT_PLATFORM_DUMMY_COPY[currentPlatform].channelName ||
    cleanProjectName;

  const renderSimulator = () => {
    switch (currentPlatform) {
      case "youtube":
        return (
          <YouTubeSimulator
            device={device}
            variant={activeVariant}
            projectName={simulatorBrandName}
            customTitle={currentCustomCopy.title}
            bannerUrl={currentPlatformAssets.bannerUrl}
            logoUrl={currentPlatformAssets.logoUrl}
            customSlotThumbs={customSlotThumbs}
            onUploadBanner={() => simBannerInputRef.current?.click()}
            onUploadLogo={() => simLogoInputRef.current?.click()}
            onUploadThumbnail={() => simThumbInputRef.current?.click()}
            onUploadSlotThumbnail={handleUploadSlotThumbnail}
            onResetSlotThumbnail={handleResetSlotThumbnail}
          />
        );
      case "instagram":
        return (
          <InstagramSimulator
            device={device}
            variant={activeVariant}
            projectName={simulatorBrandName}
            customTitle={currentCustomCopy.title}
            logoUrl={currentPlatformAssets.logoUrl}
            shortFrameUrl={currentPlatformAssets.shortFrameUrl}
            onUploadLogo={() => simLogoInputRef.current?.click()}
            onUploadThumbnail={() => simThumbInputRef.current?.click()}
            onUploadShort={() => simShortInputRef.current?.click()}
          />
        );
      case "facebook":
        return (
          <FacebookSimulator
            device={device}
            variant={activeVariant}
            projectName={simulatorBrandName}
            customTitle={currentCustomCopy.title}
            bannerUrl={currentPlatformAssets.bannerUrl}
            logoUrl={currentPlatformAssets.logoUrl}
            shortFrameUrl={currentPlatformAssets.shortFrameUrl}
            onUploadBanner={() => simBannerInputRef.current?.click()}
            onUploadLogo={() => simLogoInputRef.current?.click()}
            onUploadThumbnail={() => simThumbInputRef.current?.click()}
            onUploadShort={() => simShortInputRef.current?.click()}
          />
        );
      case "tiktok":
        return (
          <TikTokSimulator
            device={device}
            variant={activeVariant}
            projectName={simulatorBrandName}
            customTitle={currentCustomCopy.title}
            logoUrl={currentPlatformAssets.logoUrl}
            shortFrameUrl={currentPlatformAssets.shortFrameUrl}
            onUploadLogo={() => simLogoInputRef.current?.click()}
            onUploadThumbnail={() => simThumbInputRef.current?.click()}
            onUploadShort={() => simShortInputRef.current?.click()}
          />
        );
      case "linkedin":
        return (
          <LinkedInSimulator
            device={device}
            variant={activeVariant}
            projectName={simulatorBrandName}
            customTitle={currentCustomCopy.title}
            bannerUrl={currentPlatformAssets.bannerUrl}
            logoUrl={currentPlatformAssets.logoUrl}
            onUploadBanner={() => simBannerInputRef.current?.click()}
            onUploadLogo={() => simLogoInputRef.current?.click()}
            onUploadThumbnail={() => simThumbInputRef.current?.click()}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col select-none overflow-x-hidden">
      {/* Hidden simulator file pickers */}
      <input
        type="file"
        ref={simBannerInputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleUploadAsset("banner", e.target.files[0]);
            e.target.value = "";
          }
        }}
        className="hidden"
      />
      <input
        type="file"
        ref={simLogoInputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleUploadAsset("logo", e.target.files[0]);
            e.target.value = "";
          }
        }}
        className="hidden"
      />
      <input
        type="file"
        ref={simThumbInputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleUploadAsset("thumbnail", e.target.files[0]);
            e.target.value = "";
          }
        }}
        className="hidden"
      />
      <input
        type="file"
        ref={simShortInputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleUploadAsset("shortFrame", e.target.files[0]);
            e.target.value = "";
          }
        }}
        className="hidden"
      />

      {/* 1. Global Top Navigation (56px) */}
      <TopNav
        projectName={cleanProjectName}
        onRenameProject={handleRenameProject}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenReviews={() =>
          setInsightsTab((prev) =>
            prev === "reviews" ? "variants" : "reviews",
          )
        }
        commentsCount={comments.length}
        saveStatus={saveStatus}
      />

      {/* 2. Platform Context Bar (48px) */}
      <PlatformTabBar
        currentPlatform={currentPlatform}
        onSelectPlatform={handleSelectPlatform}
        currentDevice={device}
        onSelectDevice={(d) => setDevice(d)}
        activeImageName={
          activeVariant
            ? formatVariantLabel(activeVariant.name, 0)
            : `No ${currentPlatform} creative uploaded`
        }
        onChangeImageClick={() => setIsAddVariantOpen(true)}
        lastTestedText="Last tested 2m ago"
        onRetestClick={() => {
          setSaveStatus("Refreshing preview...");
          loadComments();
          setTimeout(() => setSaveStatus("Saved just now"), 600);
        }}
      />

      {/* 3. Main Workspace: Simulator Body + Right Insights Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Central Canvas Simulator */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 theme-workspace-bg flex flex-col items-center">
          <div className="w-full max-w-6xl">
            <SimulatorCopyControl
              platform={currentPlatform}
              customTitle={currentCustomCopy.title}
              customChannelName={currentCustomCopy.channelName}
              onUpdateCopy={handleUpdateCustomCopy}
            />
            {renderSimulator()}
          </div>
        </main>

        {/* Right Fixed Panel: Asset Tracker & Thumbnail Insights & Client Reviews */}
        <ThumbnailInsightsPanel
          variants={platformVariants}
          activeVariant={activeVariant}
          project={project}
          currentPlatform={currentPlatform}
          platformAssets={currentPlatformAssets}
          comments={comments}
          currentDevice={device}
          onSwitchDevice={(d) => setDevice(d)}
          onSelectVariant={handleSelectVariant}
          onAddVariantClick={() => setIsAddVariantOpen(true)}
          onDeleteVariant={handleDeleteVariant}
          onUploadAsset={handleUploadAsset}
          uploadingSlot={uploadingSlot}
          activeTab={insightsTab}
          onTabChange={(t) => setInsightsTab(t)}
          onRefreshComments={loadComments}
        />
      </div>

      {/* Share Preview Modal */}
      <SharePreviewModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        projectId={projectId}
        activeVariantId={activeVariant?._id}
        platform={currentPlatform}
        device={device}
      />

      {/* Add Variant Modal */}
      <AddVariantModal
        isOpen={isAddVariantOpen}
        onClose={() => setIsAddVariantOpen(false)}
        projectId={projectId}
        platform={currentPlatform}
        onVariantAdded={handleVariantAdded}
      />

      {/* Real-time Floating Live Comment Notification Toast */}
      {newCommentToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className="bg-gray-900/95 backdrop-blur-md text-white border border-[#00A67E]/40 rounded-2xl p-4 shadow-2xl max-w-sm flex items-start space-x-3 transition ring-1 ring-[#00A67E]/20">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00A67E] to-[#008B68] flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm">
              <MessageSquare className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300 truncate">
                  New review from {newCommentToast.displayName}
                </span>
                <button
                  type="button"
                  onClick={() => setNewCommentToast(null)}
                  className="text-gray-400 hover:text-white transition p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-gray-200 mt-1 line-clamp-2">
                &ldquo;{newCommentToast.body}&rdquo;
              </p>
              <div className="mt-2.5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setInsightsTab("reviews");
                    setNewCommentToast(null);
                  }}
                  className="text-[11px] font-extrabold text-[#00A67E] hover:text-teal-200 flex items-center space-x-1 transition"
                >
                  <span>Open Client Reviews</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <span className="text-[10px] text-gray-400 font-mono">
                  {newCommentToast.device === "mobile"
                    ? "📱 Mobile"
                    : "💻 Desktop"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
