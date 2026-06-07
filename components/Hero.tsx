"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-8">
      <div className="max-w-5xl mx-auto w-full">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-mono text-sm text-[#f0b429] mb-4 tracking-wider"
        >
          ♠
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight"
        >
          Eric Song
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-4 text-xl text-[#a3a3a3] max-w-xl"
        >
          Building AI systems that actually work.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <a
            href="#projects"
            className="px-5 py-2.5 border border-[#f0b429] text-[#f0b429] text-sm font-medium hover:bg-[#f0b429] hover:text-black transition-all duration-150"
          >
            View Projects
          </a>
          <a
            href="https://github.com/EricSong03"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 border border-[#262626] text-[#a3a3a3] text-sm font-medium hover:text-white hover:border-[#404040] transition-all duration-150"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/eric-song-0b6980274"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 border border-[#262626] text-[#a3a3a3] text-sm font-medium hover:text-white hover:border-[#404040] transition-all duration-150"
          >
            LinkedIn
          </a>
        </motion.div>
      </div>
    </section>
  );
}
