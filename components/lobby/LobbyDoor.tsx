"use client"

import { motion } from "framer-motion"
import { usePageTransition } from "@/lib/transitionContext"
import { RoomData, Suit } from "@/lib/types"

interface LobbyDoorProps {
  room: RoomData
  index: number
}

const isRed = (suit: Suit) => suit === "♥" || suit === "♦"

export default function LobbyDoor({ room, index }: LobbyDoorProps) {
  const { triggerTransition } = usePageTransition()
  const red = isRed(room.suit)

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: "easeOut" }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => triggerTransition(`/room/${room.id}`)}
      className="relative flex flex-col items-center justify-between text-left cursor-pointer group transition-[border-color,box-shadow] duration-200"
      style={{
        width: 140,
        height: 220,
        backgroundColor: "#1c1410",
        border: "2px solid #262626",
        borderRadius: 8,
        padding: "20px 16px",
      }}
    >
      {/* Hover glow via CSS group */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ boxShadow: "0 0 32px rgba(240,180,41,0.18)", border: "2px solid #404040", borderRadius: 8 }}
      />

      {/* Suit symbol */}
      <span
        className="text-4xl font-mono"
        style={{ color: red ? "#dc2626" : "#f0b429" }}
      >
        {room.suit}
      </span>

      {/* Room name */}
      <div className="text-center">
        <div className="text-white font-semibold text-sm leading-tight">
          {room.name}
        </div>
        <div className="text-[#525252] font-mono text-[10px] mt-1 uppercase tracking-wider">
          Enter
        </div>
      </div>

      {/* Door handle */}
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: "#c8962a" }}
      />
    </motion.button>
  )
}
