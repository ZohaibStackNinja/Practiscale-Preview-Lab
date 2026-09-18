export type Platform =
  | "youtube"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "linkedin";

export type Device = "desktop" | "mobile";

export interface Asset {
  _id?: string;
  provider: "cloudinary" | "local";
  cloudinaryPublicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  mimeType?: string;
  bytes?: number;
}

export interface Variant {
  _id: string;
  projectId: string;
  name: string;
  assetId: string;
  notes?: string;
  width?: number;
  height?: number;
  asset?: Asset | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  title: string;
  status: "draft" | "active" | "archived";
  activeVariantId?: string;
  logoUrl?: string;
  bannerUrl?: string;
  shortFrameUrl?: string;
  variants: Variant[];
  activeVariant?: Variant | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShareData {
  id: string;
  rawToken: string;
  shareUrl: string;
  expiresAt: string;
  durationHours: number;
  platform: Platform;
  device: Device;
  createdAt: string;
  isExpired?: boolean;
  isRevoked?: boolean;
}

export interface CommentItem {
  _id: string;
  shareId: string;
  projectId: string;
  displayName: string;
  body: string;
  device?: Device;
  platform?: Platform;
  variantId?: string;
  variantName?: string;
  viewMode?: string;
  createdAt: string;
}

export interface ShareSnapshot {
  shareId: string;
  projectTitle: string;
  logoUrl?: string;
  bannerUrl?: string;
  shortFrameUrl?: string;
  variant: {
    id: string;
    name: string;
    width?: number;
    height?: number;
    notes?: string;
    asset?: {
      secureUrl: string;
      width?: number;
      height?: number;
      mimeType?: string;
    } | null;
  } | null;
  platform: Platform;
  device: Device;
  context?: string;
  expiresAt: string;
  comments: CommentItem[];
}
