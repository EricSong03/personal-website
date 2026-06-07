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
              backgroundColor: "#fafaf9",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className={`text-xs font-mono font-bold leading-tight ${red ? "text-[#dc2626]" : "text-black"}`}>
              <div>{card.rank}</div>
              <div>{card.suit}</div>
            </div>
            <div className={`flex-1 flex items-center justify-center text-4xl ${red ? "text-[#dc2626]" : "text-black"}`}>
              {card.suit}
            </div>
            <div className={`text-xs font-mono font-bold leading-tight rotate-180 ${red ? "text-[#dc2626]" : "text-black"}`}>
              <div>{card.rank}</div>
              <div>{card.suit}</div>
            </div>
          </div>

          {/* Back face */}
          <div
            className="absolute inset-0 rounded-lg shadow-xl"
            style={{
              backgroundColor: "#1a2e1a",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              border: "2px solid #c8962a",
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-[#c8962a] text-2xl opacity-40">
              ♠
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
