"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { uploadImage, createPost } from "../data/mock";

const MAX_CHARS = 280;

export default function NewPostModal({ onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showLinkField, setShowLinkField] = useState(false);
  const fileInputRef = useRef(null);

  const trimmed = content.trim();
  const canPost = trimmed.length > 0 && trimmed.length <= MAX_CHARS && !isSubmitting;

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const newImages = await Promise.all(
        files.map(async (file) => {
          const url = await uploadImage(file);
          return { file, preview: url };
        })
      );
      setImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!canPost) return;

    setIsSubmitting(true);
    try {
      const newPost = await createPost({
        content: trimmed,
        images: images.map((img) => img.preview),
        link: link.trim() || null,
      });
      onSubmit(newPost);
      onClose();
    } catch (error) {
      console.error("Create post failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const remaining = MAX_CHARS - content.length;
  const linkActive = showLinkField || Boolean(link.trim());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto bg-black/60 p-3 pt-10 backdrop-blur-md sm:p-4 sm:pt-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        className="my-2 flex max-h-[min(90vh,720px)] w-full max-w-[600px] flex-col overflow-hidden rounded-3xl bg-[#0d0d12] text-white shadow-2xl shadow-black/40 ring-1 ring-white/[0.08] sm:my-0"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center border-b border-white/[0.06] px-3 py-3 sm:px-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 touch-pan-y flex-col overflow-y-auto overscroll-y-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="px-3 pb-3 pt-4 sm:px-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              rows={5}
              className="w-full resize-none bg-transparent text-[17px] leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
              autoFocus
            />
          </div>

          {images.length > 0 && (
            <div className="px-3 pb-3 sm:px-4">
              <div className="min-w-0 overflow-x-hidden">
                <div
                  className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-6 pt-0.5 [-webkit-overflow-scrolling:touch] touch-pan-x"
                  role="list"
                  aria-label="Image previews"
                >
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative h-28 w-36 shrink-0 snap-start overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/[0.08]"
                      role="listitem"
                    >
                      <img
                        src={img.preview}
                        alt=""
                        draggable={false}
                        className="h-full w-full object-cover select-none touch-callout-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm transition-colors hover:bg-black/85"
                        aria-label="Remove image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showLinkField && (
            <div className="px-3 pb-3 sm:px-4">
              <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 ring-1 ring-white/[0.06] transition-shadow focus-within:ring-[#3b82f6]/50">
                <LinkIcon className="h-4 w-4 shrink-0 text-zinc-500" />
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://…"
                  className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="mt-auto shrink-0 border-t border-white/[0.06] bg-[#0d0d12]/95 px-3 py-3 backdrop-blur-md sm:px-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-0.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#3b82f6] transition-colors hover:bg-[#3b82f6]/15 disabled:opacity-50"
                  title={isUploading ? "Uploading…" : "Add images"}
                  aria-label="Add images"
                >
                  <ImageIcon className="h-[22px] w-[22px]" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowLinkField((v) => !v)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-[#3b82f6] transition-colors hover:bg-[#3b82f6]/15 ${linkActive ? "bg-[#3b82f6]/15" : ""}`}
                  title="Add link"
                  aria-label="Add link"
                >
                  <LinkIcon className="h-[22px] w-[22px]" strokeWidth={1.75} />
                </button>
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                {remaining < 40 && (
                  <span
                    className={`text-xs tabular-nums ${remaining < 0 ? "text-red-400" : "text-zinc-500"}`}
                  >
                    {remaining}
                  </span>
                )}
                <span className="hidden text-[11px] uppercase tracking-wide text-zinc-600 sm:inline">
                  Anyone can reply
                </span>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canPost}
                  className="rounded-full bg-[#3b82f6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSubmitting ? "Posting…" : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
