"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { CommunityCardData } from "@/lib/types"

const isRed = (suit: string) => suit === "♥" || suit === "♦"

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
  const accent = "#c8962a"

  const ox = rect.left + rect.width / 2 - window.innerWidth / 2
  const oy = rect.top + rect.height / 2 - window.innerHeight / 2
  const initialScale = rect.width / EXP_W

  // Stagger items in after the flip finishes (~0.6s total)
  const fadeIn = (i: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut", delay: 0.65 + i * 0.07 },
  })

  const hasBullets = !!(card.back.bullets?.length)
  const tagsDelay = hasBullets ? 2 : 1
  const linksDelay = hasBullets ? 2 : 1

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 cursor-pointer"
        style={{ backgroundColor: "rgba(0,0,0,0.82)", backdropFilter: "blur(3px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <motion.div
          className="pointer-events-auto"
          style={{ width: EXP_W, height: EXP_H, perspective: 1200 }}
          initial={{ x: ox, y: oy, scale: initialScale }}
          animate={{ x: 0, y: 0, scale: 1 }}
          exit={{ x: ox, y: oy, scale: initialScale }}
          transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div
            className="relative w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 180 }}
            exit={{ rotateY: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut", delay: 0.15 }}
          >
            {/* Front face */}
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

            {/* Back face */}
            <div
              className="absolute inset-0 shadow-2xl flex flex-col overflow-hidden"
              style={{
                backgroundColor: "#1a2e1a",
                border: "6px solid #c8962a",
                borderRadius: 18,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {/* Spade watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span style={{ fontSize: 180, lineHeight: 1, color: "#c8962a", opacity: 0.06, userSelect: "none" }}>
                  ♠
                </span>
              </div>

              {/* Card content */}
              <div className="relative flex flex-col h-full px-7 gap-6" style={{ zIndex: 1, paddingTop: 12, paddingBottom: 32 }}>

                {/* Header: rank+suit top-left, title to the right */}
                <motion.div {...fadeIn(0)} className="flex flex-col gap-3">
                  <div className="relative flex items-start justify-center">
                    <div className="absolute left-0 top-0 flex flex-col items-center" style={{ minWidth: 20 }}>
                      <span className="font-mono text-base font-bold leading-none" style={{ color: accent }}>{card.rank}</span>
                      <span className="font-mono text-base leading-none mt-1" style={{ color: accent }}>{card.suit}</span>
                    </div>
                    <h2 className="text-[20px] font-bold text-white leading-tight tracking-tight text-center px-8">
                      {card.back.title}
                    </h2>
                  </div>
                  <div
                    className="h-px w-full"
                    style={{ background: `linear-gradient(to right, ${accent}70, ${accent}10, transparent)` }}
                  />
                </motion.div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>

                  {/* Bullets */}
                  {card.back.bullets && (
                    <motion.div {...fadeIn(1)} className="flex flex-col gap-3">
                      {card.back.bullets.map((b, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div
                            className="w-0.5 shrink-0 rounded-full mt-1"
                            style={{ backgroundColor: accent, height: 14, opacity: 0.85 }}
                          />
                          <span className="text-[13px] leading-relaxed" style={{ color: "#c8c8c8" }}>{b}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Tags */}
                  {card.back.tags && (
                    <motion.div {...fadeIn(tagsDelay)} className="flex flex-wrap gap-1.5">
                      {card.back.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[10px] px-2 py-0.5 rounded-sm"
                          style={{
                            backgroundColor: `${accent}10`,
                            border: `1px solid ${accent}30`,
                            color: accent,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </motion.div>
                  )}

                  {/* Links */}
                  {card.back.links && (
                    <motion.div {...fadeIn(linksDelay)} className="flex flex-col gap-0.5">
                      {card.back.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-150"
                          style={{ color: accent, textDecoration: "none" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${accent}12` }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[10px] opacity-50 shrink-0">→</span>
                          <span className="text-[13px] leading-none">{link.label}</span>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Close hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                  className="flex justify-center"
                >
                  <span className="font-mono text-[8px] tracking-[0.2em] uppercase" style={{ color: `${accent}35` }}>
                    esc · click outside to close
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}
