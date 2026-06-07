"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { CommunityCardData } from "@/lib/types"

const isRed = (suit: string) => suit === "♥" || suit === "♦"

// Expanded card dimensions
const EXP_W = 300
const EXP_H = 440

export interface ExpandedCard {
  card: CommunityCardData
  rect: DOMRect
}

interface CardSpotlightProps {
  expanded: ExpandedCard | null
  onClose: () => void
}

export default function CardSpotlight({ expanded, onClose }: CardSpotlightProps) {
  useEffect(() => {
    if (!expanded) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [expanded, onClose])

  return (
    <AnimatePresence>
      {expanded && (
        <CardView key={expanded.card.id} data={expanded} onClose={onClose} />
      )}
    </AnimatePresence>
  )
}

function CardView({ data, onClose }: { data: ExpandedCard; onClose: () => void }) {
  const { card, rect } = data
  const red = isRed(card.suit)

  // Compute origin offset so the expanded card appears to come from the clicked card
  const ox = rect.left + rect.width / 2 - window.innerWidth / 2
  const oy = rect.top + rect.height / 2 - window.innerHeight / 2
  const initialScale = rect.width / EXP_W

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/80 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {/* Centered expanded card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <motion.div
          className="pointer-events-auto"
          style={{ width: EXP_W, height: EXP_H, perspective: 1200 }}
          initial={{ x: ox, y: oy, scale: initialScale }}
          animate={{ x: 0, y: 0, scale: 1 }}
          exit={{ x: ox, y: oy, scale: initialScale }}
          transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Flip wrapper — starts at front (0°), flips to back (180°) */}
          <motion.div
            className="relative w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 180 }}
            exit={{ rotateY: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut", delay: 0.15 }}
          >
            {/* Front face — same as table card, just larger */}
            <div
              className="absolute inset-0 rounded-2xl shadow-2xl flex flex-col p-4"
              style={{
                backgroundColor: "#fafaf9",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div className={`font-mono text-sm font-bold leading-tight ${red ? "text-[#dc2626]" : "text-black"}`}>
                <div>{card.rank}</div>
                <div>{card.suit}</div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center px-2 gap-2">
                <div className="text-xl font-bold text-black leading-snug">{card.frontHeadline}</div>
                <div className="text-sm text-[#525252] leading-snug">{card.frontSubtext}</div>
              </div>
              <div className={`font-mono text-sm font-bold leading-tight rotate-180 ${red ? "text-[#dc2626]" : "text-black"}`}>
                <div>{card.rank}</div>
                <div>{card.suit}</div>
              </div>
            </div>

            {/* Back face — detail content */}
            <div
              className="absolute inset-0 rounded-2xl shadow-2xl flex flex-col"
              style={{
                backgroundColor: "#141414",
                border: "1px solid #c8962a",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div className="flex items-baseline gap-2 px-6 pt-6 pb-4 border-b border-[#262626]">
                <span className={`font-mono text-sm font-bold ${red ? "text-[#dc2626]" : "text-[#c8962a]"}`}>
                  {card.rank}{card.suit}
                </span>
                <h2 className="text-lg font-bold text-white leading-tight">{card.back.title}</h2>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                {/* Bullets */}
                {card.back.bullets && (
                  <ul className="flex flex-col gap-2">
                    {card.back.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#c8962a] mt-0.5 shrink-0">▸</span>
                        <span className="text-sm text-[#a3a3a3] leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tags */}
                {card.back.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {card.back.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs px-2 py-0.5 rounded border border-[#2a2a2a] text-[#737373] bg-[#0a0a0a]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                {card.back.links && (
                  <div className="flex flex-col gap-1.5">
                    {card.back.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm text-[#c8962a] hover:text-[#f0b429] transition-colors duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {link.label} →
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-[#1a1a1a]">
                <p className="text-[10px] font-mono text-[#404040]">esc or click outside to close</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}
