"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Bell, Bookmark, Settings, LogOut, Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { CURRENT_USER } from "../data/mock";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Home", icon: Home, path: "/home" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "#" },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark, path: "#" },
    { id: "settings", label: "Settings", icon: Settings, path: "#" },
  ];

  const handleNavigate = (path) => {
    if (path !== "#") {
      router.push(path);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    router.push("/");
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-gray-800/50 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>

          <h1
            className="text-xl font-bold text-white"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            DevHub
          </h1>

          <div className="w-10" />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-64 xl:w-72 border-r border-gray-800/50 bg-[#0a0a0f] flex-col z-40">
        {/* Logo */}
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

        {/* Navigation */}
        <nav className="flex-1 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <li key={item.id}>
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    onClick={() => handleNavigate(item.path)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-full transition-colors text-left ${
                      isActive ? "font-bold" : "font-normal"
                    }`}
                  >
                    <motion.div
                      animate={{
                        scale: hoveredItem === item.id ? 1.1 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}
                      />
                    </motion.div>
                    <span
                      className={`text-lg ${
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
        </nav>

        {/* User Section */}
        <div className="p-4">
          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-full transition-colors text-left"
          >
            <img
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">
                {CURRENT_USER.displayName}
              </p>
              <p className="text-gray-500 text-sm truncate">
                @{CURRENT_USER.github}
              </p>
            </div>
            <LogOut className="w-5 h-5 text-gray-400" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 bottom-0 w-72 bg-[#0a0a0f] border-r border-gray-800/50 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
              {/* Logo */}
              <div className="px-4 py-4 border-b border-gray-800/50">
                <h1
                  className="text-2xl font-bold text-[#3b82f6]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  DevHub
                </h1>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-2 py-4">
                <ul className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => handleNavigate(item.path)}
                          className={`w-full flex items-center gap-4 px-4 py-3 rounded-full transition-colors text-left ${
                            isActive
                              ? "font-bold bg-white/5"
                              : "font-normal hover:bg-white/5"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              isActive ? "text-white" : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`text-lg ${
                              isActive ? "text-white" : "text-gray-400"
                            }`}
                          >
                            {item.label}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* User & Logout */}
              <div className="p-4 border-t border-gray-800/50 space-y-2">
                <div className="flex items-center gap-3 px-4 py-3">
                  <img
                    src={CURRENT_USER.avatar}
                    alt={CURRENT_USER.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">
                      {CURRENT_USER.displayName}
                    </p>
                    <p className="text-gray-500 text-sm truncate">
                      @{CURRENT_USER.github}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-red-500 hover:bg-red-500/10 transition-colors text-left"
                >
                  <LogOut className="w-6 h-6" />
                  <span className="text-lg">Sair</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
