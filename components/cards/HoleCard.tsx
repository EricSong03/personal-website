"use client"

import { motion } from "framer-motion"
import { HoleCardData } from "@/lib/types"

const isRed = (suit: string) => suit === "♥" || suit === "♦"

interface HoleCardProps {
  card: HoleCardData
  dealt: boolean
  faceUp: boolean
  dealDelay?: number
  flipDelay?: number
}

export default function HoleCard({
  card,
  dealt,
  faceUp,
  dealDelay = 0,
  flipDelay = 0,
}: HoleCardProps) {
  const red = isRed(card.suit)

  return (
    <motion.div
      style={{ width: 88, height: 124, perspective: 800 }}
      initial={{ y: -160, opacity: 0 }}
      animate={dealt ? { y: 0, opacity: 1 } : { y: -160, opacity: 0 }}
      transition={{ duration: 0.38, delay: dealDelay, ease: "easeOut" }}
    >
      {/* Flip container */}
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
          <div
            className={`text-xs font-mono font-bold leading-tight ${
              red ? "text-[#dc2626]" : "text-black"
            }`}
          >
            <div>{card.rank}</div>
            <div>{card.suit}</div>
          </div>
          <div
            className={`flex-1 flex items-center justify-center text-4xl ${
              red ? "text-[#dc2626]" : "text-black"
            }`}
          >
            {card.suit}
          </div>
          <div
            className={`text-xs font-mono font-bold leading-tight rotate-180 ${
              red ? "text-[#dc2626]" : "text-black"
            }`}
          >
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
    </motion.div>
  )
}
