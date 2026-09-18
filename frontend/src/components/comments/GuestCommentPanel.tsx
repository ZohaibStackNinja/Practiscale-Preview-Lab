"use client";

import React, { useState, useRef, useEffect } from "react";
import { CommentItem, Device, Platform } from "@/lib/types";
import {
  Send,
  MessageSquare,
  Clock,
  User,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  Monitor,
  Smartphone,
} from "lucide-react";
import { api } from "@/lib/api";

interface GuestCommentPanelProps {
  token: string;
  comments: CommentItem[];
  onCommentAdded: (newComment: CommentItem) => void;
  expiresAt?: string;
  device?: Device;
  platform?: Platform;
  variantName?: string;
  viewMode?: string;
  onClose?: () => void;
}

export const GuestCommentPanel: React.FC<GuestCommentPanelProps> = ({
  token,
  comments,
  onCommentAdded,
  expiresAt,
  device = "desktop",
  platform = "youtube",
  variantName,
  viewMode = "home",
  onClose,
}) => {
  const [displayName, setDisplayName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when comments list updates
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const created = await api.createComment(token, {
        displayName: displayName.trim() || "Guest Reviewer",
        body: body.trim(),
        device,
        platform,
        variantName,
        viewMode,
      });
      onCommentAdded(created);
      setBody("");
    } catch (err: any) {
      setError(err.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const calculateRemainingHours = () => {
    if (!expiresAt) return "";
    const diffMs = new Date(expiresAt).getTime() - Date.now();
    if (diffMs <= 0) return "Expired";
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m left`;
  };

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden select-none border-l border-gray-200/80">
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-150 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0ABAB5] to-[#08837E] flex items-center justify-center text-white shadow-xs">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-gray-900 tracking-tight flex items-center space-x-1.5">
              <span>Review Feedback</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#0ABAB5]/10 text-[#08837E] text-[10px] font-bold">
                {comments.length}
              </span>
            </h3>
            <p className="text-[10px] text-gray-400 font-medium">
              Client & team review notes
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            title="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expiry Banner */}
      {expiresAt && (
        <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50/50 border-b border-emerald-100/70 flex items-center justify-between shrink-0 text-[11px]">
          <div className="flex items-center space-x-1.5 text-emerald-800 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Review Session</span>
          </div>
          <div className="flex items-center space-x-1 text-emerald-700 font-medium">
            <Clock className="w-3 h-3 text-emerald-600" />
            <span>{calculateRemainingHours()}</span>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 divide-y-0 bg-[#FBFBFC]">
        {comments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 my-auto">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3 shadow-2xs">
              <Sparkles className="w-5 h-5 text-[#0ABAB5]" />
            </div>
            <p className="text-xs font-bold text-gray-800">No feedback yet</p>
            <p className="text-[11px] mt-1 text-gray-500 max-w-[200px] leading-relaxed">
              Share your revision notes, feedback, or approval below.
            </p>
          </div>
        ) : (
          comments.map((c) => {
            const initials =
              c.displayName
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "GR";

            const timeStr = new Date(c.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={c._id}
                className="flex space-x-2.5 text-xs leading-relaxed group animate-fadeIn"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-2xs">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-xs truncate">
                      {c.displayName}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {timeStr}
                    </span>
                  </div>

                  {/* Mode badge showing which review mode the client was using */}
                  <div className="flex items-center space-x-1.5 mt-0.5 flex-wrap gap-y-1">
                    <span
                      className={`inline-flex items-center space-x-1 px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        c.device === "mobile"
                          ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                          : "bg-purple-50 text-purple-700 border border-purple-200/60"
                      }`}
                    >
                      {c.device === "mobile" ? (
                        <>
                          <Smartphone className="w-2.5 h-2.5" />
                          <span>Mobile</span>
                        </>
                      ) : (
                        <>
                          <Monitor className="w-2.5 h-2.5" />
                          <span>Desktop</span>
                        </>
                      )}
                    </span>
                    {c.viewMode && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-gray-100 text-gray-600 capitalize">
                        {c.viewMode} feed
                      </span>
                    )}
                  </div>

                  <div className="mt-1 bg-white p-2.5 rounded-xl border border-gray-200/80 shadow-2xs text-gray-700 text-xs break-words leading-relaxed">
                    {c.body}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={commentsEndRef} />
      </div>

      {/* Comment Composer */}
      <div className="p-3.5 border-t border-gray-200 bg-white shrink-0 space-y-2.5 shadow-sm">
        {/* Context indicator showing active client review mode */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200/60">
          <span className="font-medium">Sending review as:</span>
          <span className="font-bold text-gray-800 flex items-center space-x-1">
            {device === "mobile" ? (
              <>
                <Smartphone className="w-3 h-3 text-blue-600" />
                <span>Mobile View</span>
              </>
            ) : (
              <>
                <Monitor className="w-3 h-3 text-purple-600" />
                <span>Desktop View</span>
              </>
            )}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
              <User className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder="Your name or organization (optional)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#0ABAB5] focus:bg-white transition placeholder:text-gray-400 text-gray-800"
            />
          </div>

          <div>
            <textarea
              rows={3}
              placeholder="Leave feedback, revision notes, or approval..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#0ABAB5] focus:bg-white transition resize-none placeholder:text-gray-400 text-gray-800 leading-relaxed"
            />
          </div>

          {error && (
            <p className="text-[11px] text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-xl">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[10px] text-gray-400 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>No login required</span>
            </span>
            <button
              type="submit"
              disabled={!body.trim() || submitting}
              className="px-4 py-1.5 bg-gradient-to-r from-[#0ABAB5] to-[#089793] hover:from-[#099E9A] hover:to-[#078581] disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition active:scale-95 shadow-xs cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <span>Submit</span>
                  <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
