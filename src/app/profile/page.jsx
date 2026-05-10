"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import PostCard from "../components/PostCard";
import { fetchPosts, CURRENT_USER } from "../data/mock";

export default function ProfilePage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserPosts();
  }, []);

  const loadUserPosts = async () => {
    setIsLoading(true);
    try {
      const allPosts = await fetchPosts();
      const userPosts = allPosts.filter(
        (post) => post.user.id === CURRENT_USER.id
      );
      setPosts(userPosts);
    } catch (error) {
      console.error("Failed to load user posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/home");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen w-full bg-[#0a0a0f]"
    >
      <div className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Feed</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="h-48 sm:h-56 md:h-64 bg-gradient-to-br from-[#1a1a2e] via-[#111118] to-[#0a0a0f] relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
        </div>

        <div className="px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          <div className="flex items-end gap-4 mb-4">
            <img
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.displayName}
              className="w-32 h-32 rounded-full object-cover border-4 border-[#0a0a0f]"
            />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">
              {CURRENT_USER.displayName}
            </h1>
            <p className="text-[#3b82f6] text-sm mb-2">@{CURRENT_USER.github}</p>
            <p className="text-gray-400 text-sm">{CURRENT_USER.bio}</p>
          </div>

          <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-800/50">
            <div className="text-center">
              <p className="text-white font-bold text-lg">{posts.length}</p>
              <p className="text-gray-500 text-xs">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">
                {CURRENT_USER.followers}
              </p>
              <p className="text-gray-500 text-xs">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">
                {CURRENT_USER.following}
              </p>
              <p className="text-gray-500 text-xs">Following</p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <h2 className="text-white font-medium mb-4">Posts</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => {}}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
