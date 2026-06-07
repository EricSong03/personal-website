"use client"

import { motion } from "framer-motion"
import { CommunityCardData } from "@/lib/types"

const isRed = (suit: string) => suit === "♥" || suit === "♦"

interface CommunityCardProps {
  card: CommunityCardData
  dealt: boolean
  dealDelay?: number
  onExpand: (card: CommunityCardData) => void
}

export default function CommunityCard({
  card,
  dealt,
  dealDelay = 0,
  onExpand,
}: CommunityCardProps) {
  const red = isRed(card.suit)

  return (
    <motion.div
      className="cursor-pointer select-none"
      style={{ width: 88, height: 124 }}
      initial={{ y: -140, opacity: 0 }}
      animate={dealt ? { y: 0, opacity: 1 } : { y: -140, opacity: 0 }}
      transition={{ duration: 0.35, delay: dealDelay, ease: "easeOut" }}
      whileHover={{ scale: 1.08, y: -6, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onExpand(card)}
    >
      <div
        className="w-full h-full rounded-lg shadow-xl flex flex-col p-1.5"
        style={{ backgroundColor: "#fafaf9" }}
      >
        {/* Corner identifier */}
        <div
          className={`text-[10px] font-mono font-bold leading-tight ${
            red ? "text-[#dc2626]" : "text-black"
          }`}
        >
          <div>{card.rank}</div>
          <div>{card.suit}</div>
        </div>

        {/* Center content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-1 gap-0.5">
          <div className="text-[11px] font-bold text-black leading-tight">
            {card.frontHeadline}
          </div>
          <div className="text-[9px] text-[#525252] leading-tight">
            {card.frontSubtext}
          </div>
        </div>

        {/* Bottom corner (rotated) */}
        <div
          className={`text-[10px] font-mono font-bold leading-tight rotate-180 ${
            red ? "text-[#dc2626]" : "text-black"
          }`}
        >
          <div>{card.rank}</div>
          <div>{card.suit}</div>
        </div>
      </div>
    </motion.div>
  )
}
