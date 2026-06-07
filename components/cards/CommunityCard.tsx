"use client"

import { motion } from "framer-motion"
import { CommunityCardData } from "@/lib/types"

const isRed = (suit: string) => suit === "♥" || suit === "♦"

interface CommunityCardProps {
  card: CommunityCardData
  faceUp: boolean
  onExpand: (card: CommunityCardData, rect: DOMRect) => void
}

export default function CommunityCard({ card, faceUp, onExpand }: CommunityCardProps) {
  const red = isRed(card.suit)

  return (
    <div className="flex flex-col items-center gap-1">
    <motion.div
      className="cursor-pointer select-none"
      style={{ width: 88, height: 124, perspective: 800 }}
      whileHover={faceUp ? { scale: 1.08, y: -6, transition: { duration: 0.15 } } : {}}
      whileTap={faceUp ? { scale: 0.97 } : {}}
      onClick={(e) => {
        if (!faceUp) return
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        onExpand(card, rect)
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: faceUp ? 0 : 180 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
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
          <div className={`text-[10px] font-mono font-bold leading-tight ${red ? "text-[#dc2626]" : "text-black"}`}>
            <div>{card.rank}</div>
            <div>{card.suit}</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center px-1 gap-0.5">
            <div className="text-[11px] font-bold text-black leading-tight">{card.frontHeadline}</div>
            <div className="text-[9px] text-[#525252] leading-tight">{card.frontSubtext}</div>
          </div>
          <div className={`text-[10px] font-mono font-bold leading-tight rotate-180 ${red ? "text-[#dc2626]" : "text-black"}`}>
            <div>{card.rank}</div>
            <div>{card.suit}</div>
          </div>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-lg shadow-xl flex flex-col items-center justify-center gap-1 px-1"
          style={{
            backgroundColor: "#1a2e1a",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            border: "2px solid #c8962a",
          }}
        >
          <div className="text-[#c8962a] text-xl opacity-40">♠</div>
          <div className="text-[6px] font-mono text-center leading-snug opacity-50" style={{ color: '#c8962a' }}>
            play to reveal me!
          </div>
        </div>
      </motion.div>
    </motion.div>
    <motion.span
      className="text-[7px] font-mono tracking-widest pointer-events-none"
      style={{ color: '#c8962a' }}
      animate={faceUp ? { opacity: [0.35, 1, 0.35] } : { opacity: 0 }}
      transition={faceUp ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.1 }}
    >
      CLICK
    </motion.span>
    </div>
  )
}
