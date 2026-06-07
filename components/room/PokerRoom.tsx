"use client"

import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import PokerTable from "@/components/room/PokerTable"
import CardDealSequence from "@/components/room/CardDealSequence"
import CardSpotlight, { ExpandedCard } from "@/components/cards/CardSpotlight"
import { usePageTransition } from "@/lib/transitionContext"
import { RoomData, CommunityCardData } from "@/lib/types"

interface PokerRoomProps {
  room: RoomData
}

export default function PokerRoom({ room }: PokerRoomProps) {
  const { endTransition, triggerTransition } = usePageTransition()
  const [expanded, setExpanded] = useState<ExpandedCard | null>(null)

  useEffect(() => {
    const timer = setTimeout(endTransition, 80)
    return () => clearTimeout(timer)
  }, [endTransition])

  const handleLeave = useCallback(() => {
    triggerTransition("/")
  }, [triggerTransition])

  const handleExpand = useCallback((card: CommunityCardData, rect: DOMRect) => {
    setExpanded({ card, rect })
  }, [])

  return (
    <div
      className="relative w-screen h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          onClick={handleLeave}
          className="text-sm font-mono text-[#a3a3a3] hover:text-white transition-colors duration-150"
        >
          ← Leave Table
        </motion.button>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="text-sm font-mono text-[#525252] tracking-widest uppercase"
        >
          {room.suit} {room.name}
        </motion.span>
      </div>

      {/* Table — fills remaining space */}
      <div className="flex-1 flex items-center justify-center mt-14">
        <PokerTable>
          <CardDealSequence room={room} onExpandCard={handleExpand} />
        </PokerTable>
      </div>

      <CardSpotlight expanded={expanded} onClose={() => setExpanded(null)} />
    </div>
  )
}
