"use client"

import { motion } from "framer-motion"
import { HoleCardData } from "@/lib/types"

const isRed = (suit: string) => suit === "♥" || suit === "♦"

interface HoleCardProps {
  card: HoleCardData
  faceUp: boolean
  flipDelay?: number
  dealFrom?: { x: number; y: number }
  dealDelay?: number
}

export default function HoleCard({
  card,
  faceUp,
  flipDelay = 0,
  dealFrom,
  dealDelay = 0,
}: HoleCardProps) {
  const red = isRed(card.suit)

  return (
    <motion.div
      initial={dealFrom ? { x: dealFrom.x, y: dealFrom.y, opacity: 0, rotate: -12 } : false}
      animate={dealFrom ? { x: 0, y: 0, opacity: 1, rotate: 0 } : undefined}
      transition={
        dealFrom
          ? { duration: 0.42, delay: dealDelay / 1000, ease: [0.25, 0.46, 0.45, 0.94] }
          : undefined
      }
    >
      <div style={{ width: 88, height: 124, perspective: 800 }}>
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: faceUp ? 0 : 180 }}
          transition={{ duration: 0.45, delay: faceUp ? flipDelay : 0, ease: "easeInOut" }}
        >
          {/* Front face */}
          <div
            className="absolute inset-0 rounded-lg shadow-xl flex flex-col p-1.5"
            style={{
              background: "linear-gradient(165deg, #faf8f1 0%, #f6f3ea 55%, #ece8db 100%)",
              border: "1px solid rgba(0,0,0,0.18)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className={`text-xs font-mono font-bold leading-tight ${red ? "text-[#b3403a]" : "text-[#1a1a1a]"}`}>
              <div>{card.rank}</div>
              <div>{card.suit}</div>
            </div>
            <div className={`flex-1 flex items-center justify-center text-4xl ${red ? "text-[#b3403a]" : "text-[#1a1a1a]"}`}>
              {card.suit}
            </div>
            <div className={`text-xs font-mono font-bold leading-tight rotate-180 ${red ? "text-[#b3403a]" : "text-[#1a1a1a]"}`}>
              <div>{card.rank}</div>
              <div>{card.suit}</div>
            </div>
          </div>

          {/* Back face */}
          <div
            className="absolute inset-0 rounded-lg shadow-xl p-1"
            style={{
              background: "linear-gradient(170deg, #1a1714 0%, #141210 60%, #0f0d0b 100%)",
              border: "1px solid #8a7437",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center rounded-md text-2xl"
              style={{ border: "1px solid rgba(217,182,95,0.25)", color: "rgba(217,182,95,0.35)" }}
            >
              ♠
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
