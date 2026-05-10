"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Bell,
  User,
  LogOut,
  Feather,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navigation({ onPostClick }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showMore, setShowMore] = useState(false);

  const mainTabs = [
    { id: "home", label: "Home", icon: Home, path: "/home" },
    { id: "search", label: "Search", icon: Search, path: "#" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "#" },
  ];

  const sidebarItems = [
    { id: "home", label: "Home", icon: Home, path: "/home" },
    { id: "explore", label: "Explore", icon: Search, path: "#" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "#" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  const handleNavigate = (path) => {
    if (path && path !== "#") {
      router.push(path);
      setShowMore(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowMore(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-gray-800/50 lg:hidden">
        <div className="flex items-center justify-around px-2 py-1">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.path;

            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.85 }}
                onClick={() => handleNavigate(tab.path)}
                className="relative flex flex-col items-center justify-center p-3 rounded-xl transition-colors"
              >
                <div className="relative">
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {tab.id === "notifications" && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#3b82f6] rounded-full" />
                  )}
                </div>
                {isActive && (
                  <motion.div
                    layoutId="bottomIndicator"
                    className="absolute -bottom-0.5 w-1 h-1 bg-[#3b82f6] rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}

          {/* Profile / More */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => handleNavigate("/profile")}
            className="relative flex flex-col items-center justify-center p-3 rounded-xl transition-colors"
          >
            <img
              src={user?.image || "https://i.pravatar.cc/150?u=default"}
              alt={user?.name || "User"}
              className={`w-6 h-6 rounded-full object-cover ${
                pathname === "/profile" ? "ring-2 ring-[#3b82f6]" : ""
              }`}
            />
            {pathname === "/profile" && (
              <motion.div
                layoutId="bottomIndicator"
                className="absolute -bottom-0.5 w-1 h-1 bg-[#3b82f6] rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-64 xl:w-72 border-r border-gray-800/50 bg-[#0a0a0f] flex-col z-40">
        {/* Logo */}
        <div className="px-4 py-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
            onClick={() => router.push("/home")}
          >
            <h1
              className="text-2xl font-bold text-[#3b82f6]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              DevHub
            </h1>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2">
          <ul className="space-y-0.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <li key={item.id}>
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-full transition-colors text-left ${
                      isActive
                        ? "font-bold"
                        : "font-normal hover:bg-white/5"
                    }`}
                  >
                    <div className="relative">
                      <Icon
                        className={`w-7 h-7 ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      {item.id === "notifications" && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#3b82f6] rounded-full border-2 border-[#0a0a0f]" />
                      )}
                    </div>
                    <span
                      className={`text-xl ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                </li>
              );
            })}
          </ul>

          {/* Post Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPostClick}
            className="w-full mt-6 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors"
          >
            <Feather className="w-5 h-5" />
            <span>Post</span>
          </motion.button>
        </nav>

        {/* User Section */}
        <div className="p-4">
          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            onClick={() => setShowMore(!showMore)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-full transition-colors text-left"
          >
            <img
              src={user?.image || "https://i.pravatar.cc/150?u=default"}
              alt={user?.name || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">
                {user?.name || "User"}
              </p>
              <p className="text-gray-500 text-sm truncate">
                @{user?.github || "user"}
              </p>
            </div>
            <div className="text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </motion.button>
        </div>
      </div>

      {/* User Dropdown Menu */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="hidden lg:block fixed bottom-4 left-4 w-72 bg-[#111118] border border-gray-800 rounded-2xl shadow-xl overflow-hidden z-50"
          >
            <div className="p-2">
              <button
                onClick={() => handleNavigate("/profile")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-gray-800/50 transition-colors text-left"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>

              <div className="border-t border-gray-800/50 my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
