"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import LobbyDoor from "@/components/lobby/LobbyDoor"
import { usePageTransition } from "@/lib/transitionContext"
import { ROOMS } from "@/lib/roomContent"

export default function Lobby() {
  const { endTransition } = usePageTransition()

  useEffect(() => {
    const timer = setTimeout(endTransition, 80)
    return () => clearTimeout(timer)
  }, [endTransition])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-6 py-16"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Name + tagline */}
      <div className="w-full max-w-5xl">
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
      </div>

      {/* Doors */}
      <div className="flex flex-wrap justify-center gap-6 my-12">
        {ROOMS.map((room, i) => (
          <LobbyDoor key={room.id} room={room} index={i} />
        ))}
      </div>

      {/* Contact footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex flex-wrap justify-center gap-6 text-sm"
      >
        <a
          href="mailto:ericyousong@gmail.com"
          className="text-[#525252] hover:text-[#f0b429] transition-colors duration-150 font-mono"
        >
          ericyousong@gmail.com
        </a>
        <a
          href="https://www.linkedin.com/in/eric-song-0b6980274"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#525252] hover:text-[#f0b429] transition-colors duration-150 font-mono"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/EricSong03"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#525252] hover:text-[#f0b429] transition-colors duration-150 font-mono"
        >
          GitHub
        </a>
      </motion.footer>
    </div>
  )
}
