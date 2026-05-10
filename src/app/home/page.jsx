"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import PostCard from "../components/PostCard";
import NewPostModal from "../components/NewPostModal";
import { INITIAL_POSTS, CURRENT_USER } from "../data/mock";

export default function HomePage() {
  const router = useRouter();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLike = async (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likedByMe: !post.likedByMe,
            likes: post.likedByMe ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleNavigateToProfile = () => {
    router.push("/profile");
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen w-full bg-[#0a0a0f]"
    >
      <nav className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <h1
            className="text-xl font-bold text-white"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            DevHub
          </h1>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full bg-[#111118] border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          <button
            onClick={handleNavigateToProfile}
            className="flex-shrink-0"
          >
            <img
              src={CURRENT_USER.avatar}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border-2 border-gray-800 hover:border-[#3b82f6] transition-colors"
            />
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts found</p>
          </div>
        ) : (
          filteredPosts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              index={index}
            />
          ))
        )}
      </main>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowNewPostModal(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#3b82f6] rounded-full flex items-center justify-center shadow-lg shadow-[#3b82f6]/30 hover:bg-[#2563eb] transition-colors"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      <AnimatePresence>
        {showNewPostModal && (
          <NewPostModal
            onClose={() => setShowNewPostModal(false)}
            onSubmit={handleNewPost}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
