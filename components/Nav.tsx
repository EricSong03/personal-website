"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Awards", href: "#awards" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setHidden(y > lastY && y > 80);
    setLastY(y);
  });

  return (
    <motion.nav
      animate={{ y: hidden ? -64 : 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-[#262626] bg-[#0a0a0a]"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-8 h-full flex items-center justify-between">
        <a href="#" className="text-white font-semibold tracking-tight hover:text-[#f0b429] transition-colors duration-150">
          Eric Song
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[#a3a3a3] hover:text-white transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
