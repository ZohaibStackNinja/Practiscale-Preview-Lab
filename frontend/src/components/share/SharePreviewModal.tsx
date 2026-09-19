"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Check, AlertTriangle } from "lucide-react";
import { ShareData, Platform, Device } from "@/lib/types";
import { api } from "@/lib/api";

interface SharePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  activeVariantId?: string;
  platform: Platform;
  device: Device;
}

export const SharePreviewModal: React.FC<SharePreviewModalProps> = ({
  isOpen,
  onClose,
  projectId,
  activeVariantId,
  platform,
  device,
}) => {
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [durationHours, setDurationHours] = useState<number>(24);
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [revoking, setRevoking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !projectId || !activeVariantId) return;

    const createOrFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const share = await api.createShare(projectId, {
          variantId: activeVariantId,
          platform,
          device,
          durationHours,
        });
        setShareData(share);
      } catch (err: any) {
        setError(err.message || "Failed to generate share link");
      } finally {
        setLoading(false);
      }
    };

    createOrFetch();
  }, [isOpen, projectId, activeVariantId, durationHours, platform, device]);

  // Dynamically resolve share URL against current browser origin (e.g. https://practiscale-preview.vercel.app)
  const getCleanShareUrl = (): string => {
    if (!shareData) return "";
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";
    if (origin && shareData.rawToken) {
      return `${origin}/share/${shareData.rawToken}`;
    }
    if (origin && shareData.shareUrl) {
      return shareData.shareUrl.replace(/^https?:\/\/[^/]+/, origin);
    }
    return shareData.shareUrl || "";
  };

  const activeShareUrl = getCleanShareUrl();

  const handleCopy = async () => {
    const urlToCopy = activeShareUrl || shareData?.shareUrl;
    if (!urlToCopy) return;
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleRevoke = async () => {
    if (!shareData?.id) return;
    if (
      !confirm(
        "Are you sure you want to revoke this preview link? Reviewers will no longer be able to view it.",
      )
    ) {
      return;
    }
    setRevoking(true);
    try {
      await api.revokeShare(shareData.id);
      setShareData((prev) => (prev ? { ...prev, isRevoked: true } : null));
    } catch (err: any) {
      alert(err.message || "Failed to revoke link");
    } finally {
      setRevoking(false);
    }
  };

  const formattedExpiry = shareData?.expiresAt
    ? new Date(shareData.expiresAt).toLocaleTimeString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-3xl border border-gray-200 w-full max-w-md p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Share this preview
          </h2>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Anyone with the link can view and comment without an account.
          </p>
        </div>

        <div>
          <div className="flex items-center space-x-2 border border-gray-200 rounded-2xl p-1.5 bg-gray-50 focus-within:border-[#0ABAB5] focus-within:bg-white transition-all shadow-xs">
            <input
              type="text"
              readOnly
              value={
                activeShareUrl ||
                shareData?.shareUrl ||
                (loading ? "Generating preview link..." : "")
              }
              className="flex-1 bg-transparent px-3 text-xs font-mono text-gray-800 outline-none truncate"
            />
            <button
              onClick={handleCopy}
              disabled={
                (!activeShareUrl && !shareData?.shareUrl) ||
                loading ||
                shareData?.isRevoked
              }
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition active:scale-95 shadow-xs ${
                copied
                  ? "bg-emerald-600 text-white shadow-emerald-500/20"
                  : "bg-gradient-to-r from-[#0ABAB5] to-[#089793] hover:from-[#099E9A] hover:to-[#078581] text-white"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <label className="text-xs font-bold text-gray-800 block">
              Link expiry
            </label>
            <span className="text-[11px] text-gray-400">
              Default for new links: 24 hours
            </span>
          </div>

          <select
            value={durationHours}
            onChange={(e) => setDurationHours(Number(e.target.value))}
            disabled={loading || shareData?.isRevoked}
            className="text-xs font-semibold bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-800 outline-none focus:border-[#0ABAB5] cursor-pointer shadow-xs"
          >
            <option value={1}>1 hour</option>
            <option value={12}>12 hours</option>
            <option value={24}>24 hours</option>
            <option value={72}>3 days</option>
            <option value={168}>7 days</option>
            <option value={720}>30 days</option>
          </select>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            {shareData?.isRevoked ? (
              <div className="flex items-center space-x-1.5 text-rose-600 text-xs font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Link Revoked</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-1.5 text-emerald-700 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Active link</span>
                </div>
                {formattedExpiry && (
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Expires {formattedExpiry}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleRevoke}
            disabled={!shareData || shareData.isRevoked || revoking}
            className="border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-transparent font-bold text-xs px-3.5 py-1.5 rounded-xl transition"
          >
            {revoking ? "Revoking..." : "Revoke"}
          </button>
        </div>

        {error && (
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
