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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Bloom swells from the under-door light, not the click point
    const rect = e.currentTarget.getBoundingClientRect()
    triggerTransition(`/room/${room.id}`, {
      x: rect.left + rect.width / 2,
      y: rect.bottom,
    })
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      onClick={handleClick}
      className="relative cursor-pointer group"
      style={{ width: 148, height: 232 }}
    >
      {/* Door frame */}
      <div
        className="absolute -inset-[6px] rounded-[8px]"
        style={{
          background: "linear-gradient(180deg, #241a12 0%, #1a120c 60%, #120c07 100%)",
          border: "1px solid #2b2018",
          boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
        }}
      />

      {/* Door slab — dark wood */}
      <div
        className="absolute inset-0 rounded-[3px] overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #221710 0%, #1b110b 55%, #150e08 100%)",
          border: "1px solid #2e2117",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Vertical wood grain */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(91deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0) 2px, rgba(255,255,255,0.015) 3px, rgba(0,0,0,0) 7px)",
          }}
        />

        {/* Inset panel */}
        <div
          className="absolute flex flex-col items-center justify-between"
          style={{
            inset: "14px 16px 16px 16px",
            borderRadius: 3,
            background: "linear-gradient(180deg, #1d130d 0%, #170f09 100%)",
            border: "1px solid rgba(0,0,0,0.45)",
            boxShadow:
              "inset 0 2px 6px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03)",
            padding: "22px 10px 16px",
          }}
        >
          {/* Suit inlay */}
          <span
            className="text-4xl font-mono select-none"
            style={{
              color: red ? "#b3403a" : "#8a7437",
              opacity: 0.85,
              textShadow: "0 1px 2px rgba(0,0,0,0.6)",
            }}
          >
            {room.suit}
          </span>

          {/* Brass nameplate */}
          <div className="flex flex-col items-center gap-2 w-full">
            <div
              className="w-full px-2 py-2 text-center"
              style={{
                borderRadius: 2,
                background: "linear-gradient(180deg, #9a8244 0%, #8a7437 45%, #6e5c2b 100%)",
                border: "1px solid #4f4220",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 3px rgba(0,0,0,0.5)",
              }}
            >
              <span
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] leading-tight block"
                style={{ color: "#241c0a", textShadow: "0 1px 0 rgba(255,255,255,0.15)" }}
              >
                {room.name}
              </span>
            </div>
            <span className="text-[#525252] group-hover:text-[#8a7437] font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-200">
              Enter
            </span>
          </div>
        </div>
      </div>

      {/* Vertical brass handle bar */}
      <div
        className="absolute"
        style={{
          right: 7,
          top: "44%",
          width: 3,
          height: 34,
          borderRadius: 2,
          background: "linear-gradient(180deg, #d9b65f 0%, #8a7437 55%, #5c4c23 100%)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.35)",
        }}
      />

      {/* Warm light seeping from under the door — swells on hover */}
      <div
        aria-hidden
        className="absolute left-[6px] right-[6px] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        style={{ bottom: -7, height: 12 }}
      >
        <div
          className="absolute inset-x-0 bottom-[5px] h-[3px] rounded-full"
          style={{ background: "rgba(229,178,88,0.55)", filter: "blur(1px)" }}
        />
        <div
          className="absolute inset-x-[-8px] bottom-0 h-full group-hover:scale-x-110 group-hover:scale-y-150 transition-transform duration-300 origin-bottom"
          style={{
            background:
              "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(214,160,74,0.35) 0%, rgba(214,160,74,0) 70%)",
            transform: "translateY(60%)",
          }}
        />
      </div>
    </motion.button>
  )
}
