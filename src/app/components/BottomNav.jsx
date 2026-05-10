"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, User, Bell, Bookmark, Settings, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { CURRENT_USER } from "../data/mock";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const tabs = [
    { id: "home", label: "Home", icon: Home, path: "/home" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  const moreItems = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavigate = (path) => {
    if (path) {
      router.push(path);
    }
  };

  const handleLogout = () => {
    router.push("/");
    setShowMore(false);
  };

  return (
    <>
      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-t border-gray-800/50 lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.path;

            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNavigate(tab.path)}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors ${
                  isActive ? "text-[#3b82f6]" : "text-gray-500"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-0.5 w-1 h-1 bg-[#3b82f6] rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}

          {/* More Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors ${
              showMore ? "text-white" : "text-gray-500"
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5">
                <div className={`w-2 h-2 rounded-full ${showMore ? "bg-white" : "bg-gray-500"}`} />
                <div className={`w-2 h-2 rounded-full ${showMore ? "bg-white" : "bg-gray-500"}`} />
                <div className={`w-2 h-2 rounded-full ${showMore ? "bg-white" : "bg-gray-500"}`} />
                <div className={`w-2 h-2 rounded-full ${showMore ? "bg-white" : "bg-gray-500"}`} />
              </div>
            </div>
            <span className="text-xs font-medium">More</span>
          </motion.button>
        </div>
      </div>

      {/* More Menu Overlay */}
      {showMore && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setShowMore(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-20 left-4 right-4 bg-[#111118] border border-gray-800 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors text-left"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="border-t border-gray-800/50 my-2" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-64 xl:w-72 border-r border-gray-800/50 bg-[#0a0a0f] flex-col z-40">
        <div className="px-4 py-4">
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

        <nav className="flex-1 px-2">
          <ul className="space-y-1">
            {[...tabs, ...moreItems].map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-full transition-colors text-left ${
                      isActive
                        ? "font-bold bg-white/5 text-white"
                        : "font-normal text-gray-400 hover:bg-white/5 hover:text-gray-300"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-lg">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-red-500 hover:bg-red-500/10 transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </>
  );
}
