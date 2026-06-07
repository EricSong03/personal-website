"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { CommunityCardData } from "@/lib/types"

interface CardSpotlightProps {
  card: CommunityCardData | null
  onClose: () => void
}

export default function CardSpotlight({ card, onClose }: CardSpotlightProps) {
  useEffect(() => {
    if (!card) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [card, onClose])

  return (
    <AnimatePresence>
      {card && (
        <>
          {/* Dim overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Expanded card */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4">
            <motion.div
              className="pointer-events-auto w-full max-w-md"
              initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 90, scale: 0.8 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{ perspective: 1000 }}
            >
              <div className="bg-[#141414] border border-[#404040] rounded-xl p-8 shadow-2xl">
                {/* Card identifier */}
                <div className="flex items-center gap-2 mb-6">
                  <span
                    className="font-mono text-sm font-bold"
                    style={{
                      color:
                        card.suit === "♥" || card.suit === "♦"
                          ? "#dc2626"
                          : "#ffffff",
                    }}
                  >
                    {card.rank}
                    {card.suit}
                  </span>
                  <h2 className="text-xl font-bold text-white">
                    {card.back.title}
                  </h2>
                </div>

                {/* Bullets */}
                {card.back.bullets && (
                  <ul className="space-y-2 mb-6">
                    {card.back.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#a3a3a3]">
                        <span className="text-[#f0b429] mt-0.5">▸</span>
                        <span className="text-sm leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tags */}
                {card.back.tags && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {card.back.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs px-2 py-1 rounded border border-[#262626] text-[#a3a3a3] bg-[#0a0a0a]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                {card.back.links && (
                  <div className="flex flex-col gap-2">
                    {card.back.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm text-[#f0b429] hover:text-[#c8962a] transition-colors duration-150"
                      >
                        {link.label} →
                      </a>
                    ))}
                  </div>
                )}

                {/* Dismiss hint */}
                <p className="text-xs text-[#525252] mt-6">
                  Click outside or press Esc to close
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
