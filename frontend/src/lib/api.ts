import {
  Project,
  Variant,
  ShareData,
  ShareSnapshot,
  CommentItem,
  Platform,
  Device,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
      body: JSON.stringify({ title: title || "Q4 Brand Launch" }),
    }),

  getProject: (id: string) => request<Project>(`/projects/${id}`),

  updateProject: (
    id: string,
    data: { title?: string; activeVariantId?: string; status?: string },
  ) =>
    request<Project>(`/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  deleteProject: (id: string) =>
    request<{ id: string; deleted: boolean }>(`/projects/${id}`, {
      method: "DELETE",
    }),

  // Variants & Uploads
  uploadVariant: async (
    projectId: string,
    file: File,
    name?: string,
  ): Promise<Variant> => {
    const formData = new FormData();
    formData.append("image", file);
    if (name) formData.append("name", name);

    const res = await fetch(`${API_BASE}/projects/${projectId}/variants`, {
      method: "POST",
      body: formData,
    });

    const json: ApiResponse<Variant> = await res.json();
    if (!json.success) {
      throw new Error(json.error?.message || "Upload failed");
    }
    return json.data;
  },

  uploadChannelAsset: async (
    projectId: string,
    file: File,
    type: "banner" | "logo" | "shortFrame" | "thumbnail",
  ): Promise<Project> => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);

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
    return json.data;
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
      variantId: string;
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
  seedSample: () =>
    request<{ project: Project; sampleShareToken: string }>("/sample", {
      method: "POST",
    }),
};
