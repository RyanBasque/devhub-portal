"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Link as LinkIcon } from "lucide-react";
import ImageCarousel from "./ImageCarousel";

export default function PostCard({ post, onLike, index }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="my-8 bg-[#111118] border border-gray-800/50 rounded-2xl overflow-hidden glow-border"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={post.user.avatar}
          alt={post.user.displayName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-white font-medium text-sm">
            {post.user.displayName}
          </h3>
          <p className="text-gray-500 text-xs">@{post.user.username}</p>
        </div>
        <span className="text-gray-600 text-xs">{post.timestamp}</span>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-300 text-sm leading-relaxed">{post.content}</p>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="px-4 pb-3">
          <ImageCarousel images={post.images} />
        </div>
      )}

      {/* Link Preview */}
      {post.link && (
        <div className="px-4 pb-3">
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#0a0a0f] rounded-xl border border-gray-800/50 hover:border-[#3b82f6]/50 transition-colors"
          >
            <LinkIcon className="w-4 h-4 text-[#3b82f6] flex-shrink-0" />
            <span className="text-[#3b82f6] text-sm truncate">{post.link}</span>
          </a>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 px-4 py-3 border-t border-gray-800/50">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-2 text-sm transition-colors ${
            post.likedByMe
              ? "text-red-500"
              : "text-gray-500 hover:text-red-400"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${post.likedByMe ? "fill-current" : ""}`}
          />
          <span>{post.likes}</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#3b82f6] transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments}</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#3b82f6] transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
