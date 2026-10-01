'use client';

import React from 'react';

export const COMPETITOR_STORAGE_KEY = 'practiscale_competitor_overrides_v1';

export interface CustomVideoOverride {
  id?: string;
  title?: string;
  channel?: string;
  channelName?: string;
  views?: string;
  timestamp?: string;
  duration?: string;
  thumbnailUrl?: string;
  avatarUrl?: string;
}

export interface CompetitorThumbnailControlProps {
  videoId?: string;
  slotIndex?: number;
  override?: CustomVideoOverride;
  currentOverride?: CustomVideoOverride;
  onApply?: (videoId: string, data: CustomVideoOverride) => void;
  onRemove?: (videoId: string) => void;
  onUpdate?: (slotIndex: number, override: CustomVideoOverride | null) => void;
  onReset?: (slotIndex: number) => void;
  compact?: boolean;
  isDark?: boolean;
}

export function CompetitorThumbnailControl({
  videoId,
  slotIndex = 0,
  override,
  currentOverride,
  onRemove,
  onUpdate,
}: CompetitorThumbnailControlProps) {
  const activeOverride = override || currentOverride;
  if (!activeOverride) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (onRemove && videoId) onRemove(videoId);
        if (onUpdate) onUpdate(slotIndex, null);
      }}
      className="text-xs px-2 py-1 rounded bg-black/70 text-white hover:bg-black/90 transition-colors"
    >
      Reset Slot
    </button>
  );
}
export default CompetitorThumbnailControl;
