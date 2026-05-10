"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Navigation from "../components/Navigation";
import PostCard from "../components/PostCard";
import NewPostModal from "../components/NewPostModal";
import { useAuth } from "../context/AuthContext";
import { INITIAL_POSTS, MOCK_USERS } from "../data/mock";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  console.log(user)

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

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const suggestedUsers = MOCK_USERS.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex pb-16 lg:pb-0">
      <Navigation onPostClick={() => setShowNewPostModal(true)} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 xl:ml-72">
        <div className="max-w-2xl mx-auto min-h-screen">
          {/* Header Mobile */}
          <div className="lg:hidden sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-gray-800/50">
            <div className="px-4 py-3">
              <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                DevHub
              </h1>
            </div>
          </div>

          {/* Create Post Input */}
          <div className="px-4 py-4 border-b border-gray-800/50">
            <div className="flex gap-3">
              <img
                src={user?.image || "https://i.pravatar.cc/150?u=default"}
                alt={user?.name || "User"}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <button
                  onClick={() => setShowNewPostModal(true)}
                  className="w-full text-left px-4 py-3 bg-[#111118] border border-gray-800 rounded-xl text-gray-500 hover:bg-gray-800/30 transition-colors"
                >
                  What's happening?
                </button>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div>
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
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowNewPostModal(true)}
        className="fixed bottom-20 right-6 lg:right-8 xl:right-10 z-40 w-14 h-14 bg-[#3b82f6] rounded-full flex items-center justify-center shadow-lg shadow-[#3b82f6]/30 hover:bg-[#2563eb] transition-colors"
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
    </div>
  );
}
