"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Project, Variant, Platform, Device, CommentItem } from "@/lib/types";
import { api } from "@/lib/api";
import { TopNav } from "@/components/shell/TopNav";
import { PlatformTabBar } from "@/components/shell/PlatformTabBar";
import { ThumbnailInsightsPanel } from "@/components/insights/ThumbnailInsightsPanel";
import { YouTubeSimulator } from "@/components/simulator/YouTubeSimulator";
import { InstagramSimulator } from "@/components/simulator/InstagramSimulator";
import { FacebookSimulator } from "@/components/simulator/FacebookSimulator";
import { TikTokSimulator } from "@/components/simulator/TikTokSimulator";
import { LinkedInSimulator } from "@/components/simulator/LinkedInSimulator";
import { SharePreviewModal } from "@/components/share/SharePreviewModal";
import { AddVariantModal } from "@/components/variants/AddVariantModal";
import { Loader2 } from "lucide-react";

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

  // Modals
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAddVariantOpen, setIsAddVariantOpen] = useState(false);

  // Hidden file inputs for direct simulator click uploads
  const simBannerInputRef = useRef<HTMLInputElement>(null);
  const simLogoInputRef = useRef<HTMLInputElement>(null);
  const simThumbInputRef = useRef<HTMLInputElement>(null);
  const simShortInputRef = useRef<HTMLInputElement>(null);

  // Fetch project comments (client reviews)
  const loadComments = async () => {
    if (!projectId) return;
    try {
      const data = await api.getProjectComments(projectId);
      setComments(data);
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
      if (data.activeVariant) {
        setActiveVariant(data.activeVariant);
      } else if (data.variants && data.variants.length > 0) {
        setActiveVariant(data.variants[0]);
      }
      loadComments();
    } catch (err: any) {
      setError(err.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadProject();
      loadComments();
    }
  }, [projectId]);

  // Platform navigation
  const handleSelectPlatform = (newPlatform: Platform) => {
    router.push(`/project/${projectId}/${newPlatform}`);
  };

  // Switch active creative variant
  const handleSelectVariant = async (variantId: string) => {
    if (!project) return;
    const chosen = project.variants.find((v) => v._id === variantId);
    if (chosen) {
      setActiveVariant(chosen);
      setSaveStatus("Saving changes...");
      try {
        await api.updateProject(projectId, { activeVariantId: variantId });
        setSaveStatus("Saved just now");
      } catch {
        setSaveStatus("Saved");
      }
    }
  };

  // Direct asset upload handler (banner, logo, shortFrame, thumbnail)
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
      );
      setProject(updatedProject);
      if (updatedProject.activeVariant) {
        setActiveVariant(updatedProject.activeVariant);
      }
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

  // Add new variant
  const handleVariantAdded = (newVariant: Variant) => {
    setProject((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        variants: [...prev.variants, newVariant],
      };
    });
    setActiveVariant(newVariant);
    setSaveStatus("Saved just now");
  };

  // Delete variant
  const handleDeleteVariant = async (variantId: string) => {
    try {
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

  const renderSimulator = () => {
    switch (currentPlatform) {
      case "youtube":
        return (
          <YouTubeSimulator
            device={device}
            variant={activeVariant}
            projectName={project?.title}
            bannerUrl={project?.bannerUrl}
            logoUrl={project?.logoUrl}
            shortFrameUrl={project?.shortFrameUrl}
            onUploadBanner={() => simBannerInputRef.current?.click()}
            onUploadLogo={() => simLogoInputRef.current?.click()}
            onUploadThumbnail={() => simThumbInputRef.current?.click()}
            onUploadShort={() => simShortInputRef.current?.click()}
          />
        );
      case "instagram":
        return <InstagramSimulator device={device} variant={activeVariant} />;
      case "facebook":
        return <FacebookSimulator device={device} variant={activeVariant} />;
      case "tiktok":
        return <TikTokSimulator device={device} variant={activeVariant} />;
      case "linkedin":
        return <LinkedInSimulator device={device} variant={activeVariant} />;
      default:
        return (
          <YouTubeSimulator
            device={device}
            variant={activeVariant}
            projectName={project?.title}
            bannerUrl={project?.bannerUrl}
            logoUrl={project?.logoUrl}
            shortFrameUrl={project?.shortFrameUrl}
            onUploadBanner={() => simBannerInputRef.current?.click()}
            onUploadLogo={() => simLogoInputRef.current?.click()}
            onUploadThumbnail={() => simThumbInputRef.current?.click()}
            onUploadShort={() => simShortInputRef.current?.click()}
          />
        );
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
          }
        }}
        className="hidden"
      />

      {/* 1. Global Top Navigation (56px) - Figma Node 82:6 */}
      <TopNav
        projectName={project?.title || "Q4 Brand Launch"}
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

      {/* 2. Platform Context Bar (48px) - Figma Node 82:6 */}
      <PlatformTabBar
        currentPlatform={currentPlatform}
        onSelectPlatform={handleSelectPlatform}
        currentDevice={device}
        onSelectDevice={(d) => setDevice(d)}
        activeImageName={activeVariant?.name || "Hero Banner.png"}
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
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-brand-surface flex flex-col items-center">
          <div className="w-full max-w-6xl">{renderSimulator()}</div>
        </main>

        {/* Right Fixed Panel: Asset Tracker & Thumbnail Insights & Client Reviews */}
        <ThumbnailInsightsPanel
          variants={project?.variants || []}
          activeVariant={activeVariant}
          project={project}
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
        />
      </div>

      {/* Share Preview Modal */}
      <SharePreviewModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        projectId={projectId}
        activeVariantId={activeVariant?._id || project?.variants?.[0]?._id}
        platform={currentPlatform}
        device={device}
      />

      {/* Add Variant Modal */}
      <AddVariantModal
        isOpen={isAddVariantOpen}
        onClose={() => setIsAddVariantOpen(false)}
        projectId={projectId}
        onVariantAdded={handleVariantAdded}
      />
    </div>
  );
}
