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
      className="relative min-h-screen flex flex-col items-center justify-between px-6 py-16 overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Warm overhead spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 36%, rgba(240,180,41,0.05) 0%, rgba(10,10,10,0) 65%)",
        }}
      />
      {/* Edge vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 115% 90% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Name + tagline */}
      <div className="relative w-full max-w-5xl">
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
      <div className="relative flex flex-wrap justify-center gap-6 my-12">
        {ROOMS.map((room, i) => (
          <LobbyDoor key={room.id} room={room} index={i} />
        ))}
      </div>

      {/* Contact footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="relative w-full max-w-5xl flex flex-col items-center"
      >
        <div
          aria-hidden
          className="w-full mb-6"
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, rgba(217,182,95,0) 0%, rgba(217,182,95,0.18) 50%, rgba(217,182,95,0) 100%)",
          }}
        />
        <footer className="flex flex-wrap justify-center gap-6 text-sm">
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
        </footer>
      </motion.div>
    </div>
  )
}
