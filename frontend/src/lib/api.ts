import {
  Project,
  Variant,
  ShareData,
  ShareSnapshot,
  CommentItem,
  Platform,
  Device,
  PlatformAssets,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface PlatformCustomCopy {
  title?: string;
  channelName?: string;
}

export interface LocalPlatformIsolationState {
  variantPlatforms: Record<string, Platform>;
  activeVariantsByPlatform: Partial<Record<Platform, string | null>>;
  platformAssets: Partial<Record<Platform, PlatformAssets>>;
  customCopy?: Partial<Record<Platform, PlatformCustomCopy>>;
}

export const DEFAULT_PLATFORM_DUMMY_COPY: Record<
  Platform,
  { title: string; channelName: string; presets: { label: string; title: string; channelName: string }[] }
> = {
  youtube: {
    title: "How Top Creators Design Thumbnails for 20%+ CTR (Full Masterclass)",
    channelName: "PractiScale Studio",
    presets: [
      {
        label: "Creator Masterclass",
        title: "How Top Creators Design Thumbnails for 20%+ CTR (Full Masterclass)",
        channelName: "PractiScale Studio",
      },
      {
        label: "SaaS / Tech Launch",
        title: "We Rebuilt Our Entire AI Production Pipeline in 48 Hours (Full Breakdown)",
        channelName: "Mission One Labs",
      },
      {
        label: "Podcast / Interview",
        title: "Why 94% of Brands Fail at Visual Packaging (ft. Alex Hormozi)",
        channelName: "Founders Unfiltered",
      },
    ],
  },
  instagram: {
    title: "Testing our new visual framework built for high-retention social feeds ✨ #design #creative #launch",
    channelName: "practiscale",
    presets: [
      {
        label: "Brand Carousel",
        title: "Testing our new visual framework built for high-retention social feeds ✨ #design #creative #launch",
        channelName: "practiscale",
      },
      {
        label: "Product Drop",
        title: "Our Q4 collection is officially live. Tap to explore the full lookbook 🔥 #newdrop #studio",
        channelName: "velvetstudio",
      },
      {
        label: "Creator Tip",
        title: "Save this 3-step visual hook checklist for your next campaign 📌 #creativestrategy #growth",
        channelName: "creatorlab.io",
      },
    ],
  },
  facebook: {
    title: "Big ideas deserve a clear place to grow. See how our team validates visual hooks before launch.",
    channelName: "PractiScale",
    presets: [
      {
        label: "Sponsored Campaign",
        title: "Big ideas deserve a clear place to grow. See how our team validates visual hooks before launch.",
        channelName: "PractiScale",
      },
      {
        label: "Direct-to-Consumer Ad",
        title: "Over 10,000 creative teams switched to this workflow in 2026. Try it free today.",
        channelName: "Nova Creative Cloud",
      },
      {
        label: "Case Study Post",
        title: "How we doubled paid social click-through rates in 14 days without increasing ad spend.",
        channelName: "GrowthOps Agency",
      },
    ],
  },
  tiktok: {
    title: "How top creative teams test 50+ hooks before launch 🚀 #tiktok #creative #growth #marketing",
    channelName: "practiscale",
    presets: [
      {
        label: "Viral Hook Breakdown",
        title: "How top creative teams test 50+ hooks before launch 🚀 #tiktok #creative #growth #marketing",
        channelName: "practiscale",
      },
      {
        label: "Behind The Scenes",
        title: "POV: You finally test your thumbnail in a real feed before publishing ⚡ #creator #fyp",
        channelName: "studiolabs",
      },
      {
        label: "3-Step Tutorial",
        title: "Stop guessing which creative will win. Use this 10-second test instead 👇 #marketingtips",
        channelName: "growthdaily",
      },
    ],
  },
  linkedin: {
    title: "How do high-performing B2B marketing teams validate visual packaging before launch? 🎯",
    channelName: "PractiScale",
    presets: [
      {
        label: "B2B Thought Leadership",
        title: "How do high-performing B2B marketing teams validate visual packaging before launch? 🎯",
        channelName: "PractiScale",
      },
      {
        label: "Enterprise Report",
        title: "We analyzed 1.2M enterprise ad impressions across Q3. Here are the 4 visual patterns that won:",
        channelName: "Apex B2B Ventures",
      },
      {
        label: "Product Announcement",
        title: "Introducing PreviewLab 2.0: Real-time feed simulation and pixel scoring for modern creative teams.",
        channelName: "PreviewLab Inc.",
      },
    ],
  },
};

/**
 * Detects if a string looks like a raw image filename (e.g., "WhatsApp Image...",
 * "Screenshot_2026...", "IMG_4821.PNG", "my-thumb.jpg", "media_179070...", etc.)
 */
export function isRawFilename(name?: string | null): boolean {
  if (!name) return true;
  const trimmed = name.trim();
  if (!trimmed) return true;

  // Ends with common image extensions
  if (/\.(png|jpe?g|webp|gif|svg|bmp|avif|heic|tiff?)$/i.test(trimmed)) {
    return true;
  }

  // Common OS / camera / chat app auto-generated filenames
  if (
    /^(whatsapp\s*image|screenshot|screen\s*shot|img[_\-\s]?\d|dsc[_\-\s]?\d|pxl[_\-\s]?\d|photo[_\-\s]?\d|image[_\-\s]?\d|untitled|download|asset[_\-\s]?\d|media[_\-]\d|frame[_\-\s]?\d| pic[_\-\s]?\d|chat_gpt|chatgpt|gemini_generated|dall[e\-])/i.test(
      trimmed,
    )
  ) {
    return true;
  }

  // Contains file-like underscore/hyphen timestamp sequences (e.g. 2026-09-29_14-22 or 1790702539751)
  if (/\d{4}[-_]\d{2}[-_]\d{2}|\d{9,}/.test(trimmed)) {
    return true;
  }

  // Looks like a slugged filename with underscores and no spaces (e.g. "final_thumb_v2_export")
  if (!trimmed.includes(" ") && /[_]/.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Returns a clean project title, replacing any raw image filename with a realistic dummy project title.
 */
export function formatProjectTitle(title?: string | null, fallback = "Q4 Brand Launch"): string {
  if (!title || isRawFilename(title)) {
    return fallback;
  }
  return title.trim();
}

/**
 * Returns a clean variant label ("Variant A", "Variant B", or user's custom label),
 * replacing any raw image filename.
 */
export function formatSlotFriendlyName(slotId?: string): string {
  if (!slotId) return "Primary Video";
  const s = slotId.toLowerCase();
  if (s === "user-video") return "Primary Video";
  if (s === "comp-1") return "Feed Video 2 (Competitor)";
  if (s === "comp-2") return "Feed Video 3 (Competitor)";
  if (s === "comp-3") return "Feed Video 4 (Competitor)";
  if (s === "comp-4") return "Feed Video 5 (Competitor)";
  if (s === "comp-5") return "Feed Video 6 (Competitor)";
  if (s.startsWith("search-comp-")) return `Search Result ${s.replace("search-comp-", "")}`;
  if (s.startsWith("chan-vid-")) return `Channel Video ${s.replace("chan-vid-", "")}`;
  if (s.startsWith("chan-short-")) return `Short ${s.replace("chan-short-", "")}`;
  if (s.startsWith("grid-")) return `Grid Slot ${s.replace("grid-", "")}`;
  return `Slot: ${slotId}`;
}

export function formatVariantLabel(name?: string | null, index = 0): string {
  const letter = String.fromCharCode(65 + (Math.max(0, index) % 26));
  const fallback = `Variant ${letter}`;
  if (!name || isRawFilename(name)) {
    return fallback;
  }
  return name.trim();
}

const getStorageKey = (projectId: string) =>
  `practiscale_platform_isolation_v1_${projectId}`;

export function getLocalPlatformState(
  projectId: string,
): LocalPlatformIsolationState {
  if (typeof window === "undefined" || !projectId) {
    return {
      variantPlatforms: {},
      activeVariantsByPlatform: {},
      platformAssets: {},
      customCopy: {},
    };
  }
  try {
    const raw = window.localStorage.getItem(getStorageKey(projectId));
    if (!raw)
      return {
        variantPlatforms: {},
        activeVariantsByPlatform: {},
        platformAssets: {},
        customCopy: {},
      };
    const parsed = JSON.parse(raw);
    return {
      variantPlatforms: parsed.variantPlatforms || {},
      activeVariantsByPlatform: parsed.activeVariantsByPlatform || {},
      platformAssets: parsed.platformAssets || {},
      customCopy: parsed.customCopy || {},
    };
  } catch {
    return {
      variantPlatforms: {},
      activeVariantsByPlatform: {},
      platformAssets: {},
      customCopy: {},
    };
  }
}

export function saveLocalPlatformState(
  projectId: string,
  updater: (prev: LocalPlatformIsolationState) => LocalPlatformIsolationState,
) {
  if (typeof window === "undefined" || !projectId) return;
  try {
    const prev = getLocalPlatformState(projectId);
    const next = updater(prev);
    window.localStorage.setItem(getStorageKey(projectId), JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: { code: string; message: string } | null;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options?.headers || {}),
    },
  });

  const json: ApiResponse<T> = await res.json();
  if (!json.success) {
    const err: any = new Error(json.error?.message || "API request failed");
    err.code = json.error?.code || "ERROR";
    err.status = res.status;
    throw err;
  }

  return json.data;
}

export const api = {
  // Health
  checkHealth: () => request<{ status: string }>("/health"),

  // Projects
  createProject: (title?: string) =>
    request<Project>("/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: formatProjectTitle(title, "Q4 Brand Launch") }),
    }),

  getProject: (id: string) => request<Project>(`/projects/${id}`),

  updateProject: (
    id: string,
    data: {
      title?: string;
      activeVariantId?: string;
      platform?: Platform;
      status?: string;
    },
  ) => {
    if (data.platform && data.activeVariantId !== undefined) {
      saveLocalPlatformState(id, (prev) => ({
        ...prev,
        activeVariantsByPlatform: {
          ...prev.activeVariantsByPlatform,
          [data.platform!]: data.activeVariantId || null,
        },
      }));
    }
    return request<Project>(`/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  deleteProject: (id: string) =>
    request<{ id: string; deleted: boolean }>(`/projects/${id}`, {
      method: "DELETE",
    }),

  // Variants & Uploads
  uploadVariant: async (
    projectId: string,
    file: File | Blob,
    name?: string,
    platform: Platform = "youtube",
    options?: { setAsActive?: boolean; slotId?: string },
  ): Promise<Variant> => {
    const localState = getLocalPlatformState(projectId);
    const existingForPlat = Object.values(localState.variantPlatforms || {}).filter(
      (p) => p === platform,
    ).length;
    const cleanVariantName =
      name && !isRawFilename(name)
        ? name.trim()
        : formatVariantLabel(undefined, existingForPlat);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", cleanVariantName);
    formData.append("platform", platform);
    if (options?.setAsActive !== undefined) {
      formData.append("setAsActive", String(options.setAsActive));
    }
    if (options?.slotId) {
      formData.append("slotId", options.slotId);
      formData.append("notes", `slot:${options.slotId}`);
    }

    const res = await fetch(`${API_BASE}/projects/${projectId}/variants`, {
      method: "POST",
      body: formData,
    });

    const json: ApiResponse<Variant> = await res.json();
    if (!json.success) {
      throw new Error(json.error?.message || "Upload failed");
    }
    const created = json.data;
    if (created && created._id) {
      saveLocalPlatformState(projectId, (prev) => ({
        ...prev,
        variantPlatforms: {
          ...prev.variantPlatforms,
          [created._id]: platform,
        },
        activeVariantsByPlatform: {
          ...prev.activeVariantsByPlatform,
          [platform]: created._id,
        },
      }));
    }
    return { ...created, name: cleanVariantName, platform: created.platform || platform };
  },

  uploadChannelAsset: async (
    projectId: string,
    file: File,
    type: "banner" | "logo" | "shortFrame" | "thumbnail",
    platform: Platform = "youtube",
  ): Promise<Project> => {
    const prevProject = await request<Project>(`/projects/${projectId}`).catch(
      () => null,
    );
    const prevVariantIds = new Set(
      (prevProject?.variants || []).map((v) => v._id),
    );

    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);
    formData.append("platform", platform);
    if (type === "thumbnail") {
      const existingCount = (prevProject?.variants || []).filter(
        (v) => (v.platform || "youtube") === platform,
      ).length;
      formData.append("name", formatVariantLabel(undefined, existingCount));
    }

    const res = await fetch(
      `${API_BASE}/projects/${projectId}/channel-assets`,
      {
        method: "POST",
        body: formData,
      },
    );

    const json: ApiResponse<Project> = await res.json();
    if (!json.success) {
      throw new Error(json.error?.message || "Upload failed");
    }
    const updatedProject = json.data;

    if (type === "thumbnail" && updatedProject?.variants) {
      const newlyCreated =
        updatedProject.variants.find((v) => !prevVariantIds.has(v._id)) ||
        updatedProject.activeVariant ||
        updatedProject.variants[updatedProject.variants.length - 1];
      if (newlyCreated?._id) {
        saveLocalPlatformState(projectId, (prev) => ({
          ...prev,
          variantPlatforms: {
            ...prev.variantPlatforms,
            [newlyCreated._id]: platform,
          },
          activeVariantsByPlatform: {
            ...prev.activeVariantsByPlatform,
            [platform]: newlyCreated._id,
          },
        }));
      }
    } else if (type === "banner" || type === "logo" || type === "shortFrame") {
      const fieldKey =
        type === "logo"
          ? "logoUrl"
          : type === "banner"
            ? "bannerUrl"
            : "shortFrameUrl";
      const uploadedUrl =
        updatedProject?.platformAssets?.[platform]?.[fieldKey] ||
        updatedProject?.[fieldKey];
      if (uploadedUrl) {
        saveLocalPlatformState(projectId, (prev) => ({
          ...prev,
          platformAssets: {
            ...prev.platformAssets,
            [platform]: {
              ...(prev.platformAssets[platform] || {}),
              [fieldKey]: uploadedUrl,
            },
          },
        }));
      }
    }

    return updatedProject;
  },

  updateVariant: (id: string, data: { name?: string; notes?: string }) =>
    request<Variant>(`/variants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  deleteVariant: (id: string) =>
    request<{ id: string; deleted: boolean }>(`/variants/${id}`, {
      method: "DELETE",
    }),

  // Shares
  createShare: (
    projectId: string,
    payload: {
      variantId?: string;
      platform: Platform;
      device: Device;
      durationHours?: number;
      context?: string;
    },
  ) =>
    request<ShareData>(`/projects/${projectId}/shares`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  getProjectShares: (projectId: string) =>
    request<ShareData[]>(`/projects/${projectId}/shares`),

  getShareByToken: (token: string) =>
    request<ShareSnapshot>(`/shares/${token}`),

  revokeShare: (id: string) =>
    request<{ id: string; revoked: boolean }>(`/shares/${id}/revoke`, {
      method: "POST",
    }),

  // Comments
  getComments: (token: string) =>
    request<CommentItem[]>(`/shares/${token}/comments`),

  getProjectComments: (projectId: string) =>
    request<CommentItem[]>(`/projects/${projectId}/comments`),

  createComment: (
    token: string,
    payload: {
      displayName?: string;
      body: string;
      device?: Device;
      platform?: Platform;
      variantName?: string;
      viewMode?: string;
    },
  ) =>
    request<CommentItem>(`/shares/${token}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  // Seed sample
  seedSample: async (platform: Platform = "youtube") => {
    const res = await request<{ project: Project; sampleShareToken: string }>(
      "/sample",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      },
    );
    if (res?.project?._id && res.project.variants?.length) {
      saveLocalPlatformState(res.project._id, (prev) => {
        const nextMap = { ...prev.variantPlatforms };
        for (const v of res.project.variants) {
          nextMap[v._id] = v.platform || platform;
        }
        return {
          ...prev,
          variantPlatforms: nextMap,
          activeVariantsByPlatform: {
            ...prev.activeVariantsByPlatform,
            [platform]:
              res.project.activeVariant?._id ||
              res.project.variants[0]?._id ||
              null,
          },
        };
      });
    }
    return res;
  },
};
