"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Link as LinkIcon, Calendar, Trash2, Edit3, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Navigation from "../components/Navigation";
import PostCard from "../components/PostCard";
import NewPostModal from "../components/NewPostModal";
import EditProfileModal from "../components/EditProfileModal";
import { useAuth } from "../context/AuthContext";
import { fetchPosts, MOCK_USERS } from "../data/mock";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    displayName: user?.name || "User",
    github: user?.github || "user",
    avatar: user?.image || "https://i.pravatar.cc/150?u=default",
    bio: "Frontend engineer • React & Three.js enthusiast • Building cool stuff",
    followers: 1284,
    following: 342,
    location: "Remote",
    website: "",
  });
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  useEffect(() => {
    loadUserPosts();
  }, []);

  const loadUserPosts = async () => {
    setIsLoading(true);
    try {
      const allPosts = await fetchPosts();
      const userPosts = allPosts.filter(
        (post) => post.user.id === 999
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

  const handleSaveProfile = (updatedData) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    }
  };

  const handleEditPost = (post) => {
    const newContent = window.prompt("Edit your post:", post.content);
    if (newContent !== null && newContent.trim() !== "") {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, content: newContent.trim() } : p
        )
      );
    }
  };

  const handleLikePost = (postId) => {
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

  const tabs = [
    { id: "posts", label: "Posts" },
    { id: "media", label: "Media" },
    { id: "likes", label: "Likes" },
  ];

  const userPosts = posts;
  const mediaPosts = posts.filter((p) => p.images && p.images.length > 0);
  const suggestedUsers = MOCK_USERS.filter((u) => u.id !== 999).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex pb-16 lg:pb-0">
      <Navigation onPostClick={() => setShowNewPostModal(true)} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 xl:ml-72">
        <div className="max-w-2xl mx-auto lg:border-x border-gray-800/50 min-h-screen">
          {/* Sticky Header */}
          <div className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-gray-800/50">
            <div className="px-4 py-3 flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">
                  {profile.displayName}
                </h1>
                <p className="text-sm text-gray-500">{posts.length} posts</p>
              </div>
            </div>
          </div>

          {/* Profile Info - No Banner */}
          <div className="px-4 pt-4">
            <div className="flex flex-col items-center mb-4 lg:flex-row lg:justify-between lg:items-start">
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={profile.avatar}
                alt={profile.displayName}
                className="w-32 h-32 rounded-full object-cover border-4 border-[#0a0a0f] bg-[#0a0a0f]"
              />
            </div>

            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-1.5 bg-transparent border border-gray-700 rounded-full text-white text-sm hover:bg-gray-800/30 transition-colors"
              >
                Edit Profile
              </button>
            </div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h1 className="text-xl font-bold text-white">
                {profile.displayName}
              </h1>
              <p className="text-gray-500 text-sm mb-3">@{profile.github}</p>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {profile.bio}
              </p>

              <div className="flex flex-wrap gap-4 mb-4 text-gray-500 text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </span>
                {profile.website && (
                  <span className="flex items-center gap-1.5">
                    <LinkIcon className="w-4 h-4" />
                    <span className="text-[#3b82f6] hover:underline cursor-pointer">
                      {profile.website}
                    </span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Joined December 2023
                </span>
              </div>

              <div className="flex gap-6 mb-6">
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold">{profile.following}</span>
                  <span className="text-gray-500 text-sm">Following</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold">{profile.followers}</span>
                  <span className="text-gray-500 text-sm">Followers</span>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="border-b border-gray-800/50">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 text-sm font-medium text-center transition-colors relative ${
                      activeTab === tab.id
                        ? "text-white"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b82f6]"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : activeTab === "posts" ? (
              userPosts.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <p className="text-gray-500 text-lg mb-2">No posts yet</p>
                  <p className="text-gray-600 text-sm">
                    When you post, it will show up here.
                  </p>
                </div>
              ) : (
                userPosts.map((post, index) => (
                  <div key={post.id} className="relative group">
                    <PostCard
                      post={post}
                      onLike={handleLikePost}
                      index={index}
                    />
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="p-2 bg-[#111118]/80 backdrop-blur-sm rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 bg-[#111118]/80 backdrop-blur-sm rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )
            ) : activeTab === "media" ? (
              mediaPosts.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <p className="text-gray-500 text-lg mb-2">No media yet</p>
                  <p className="text-gray-600 text-sm">
                    Posts with images will show up here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-0.5">
                  {mediaPosts.map((post) =>
                    post.images.map((img, idx) => (
                      <motion.div
                        key={`${post.id}-${idx}`}
                        whileHover={{ scale: 1.02 }}
                        className="aspect-square overflow-hidden bg-gray-800 cursor-pointer"
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))
                  )}
                </div>
              )
            ) : (
              <div className="text-center py-12 px-4">
                <p className="text-gray-500 text-lg mb-2">No likes yet</p>
                <p className="text-gray-600 text-sm">
                  Posts you like will show up here.
                </p>
              </div>
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

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
