"use client";

import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";
import Globe from "./components/Globe";

export default function LandingPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/home");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen w-full min-w-0 flex flex-col items-center justify-center bg-[#0a0a0f] overflow-hidden px-4 sm:px-6"
    >
      <div className="grain-overlay" />

      <div className="relative z-10 mb-8 flex justify-center items-center w-full">
        <div className="w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]">
          <Globe />
        </div>
      </div>

      <div className="relative z-10 w-full min-w-0 max-w-lg text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold text-white mb-4"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          DevHub
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-400 mb-8"
        >
          Where devs ship and connect
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#111118] border border-gray-800 rounded-xl text-white font-medium hover:border-[#3b82f6] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
        >
          <Github className="w-5 h-5" />
          Login with GitHub
        </motion.button>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f] pointer-events-none" />
    </motion.div>
  );
}
