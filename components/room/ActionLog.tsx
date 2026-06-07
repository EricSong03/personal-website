'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ActionLogProps {
  entries: string[]
}

export default function ActionLog({ entries }: ActionLogProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries])

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-0 overflow-y-auto"
      style={{ maxHeight: 220, scrollbarWidth: 'none' }}
    >
      <AnimatePresence initial={false}>
        {entries.map((entry, i) => {
          const isStreet   = entry.startsWith('—')
          const isSuit     = /^[♥♠♦♣]/.test(entry)
          const isHero     = entry.toLowerCase().startsWith('hero')
          const isBlind    = entry.includes('posts')

          const color = isStreet
            ? '#c8962a'
            : isSuit
            ? '#737373'
            : isHero
            ? '#a3d9a5'
            : isBlind
            ? '#525252'
            : '#a3a3a3'

          return (
            <motion.div
              key={`${entry}-${i}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="font-mono leading-relaxed break-words"
              style={{ fontSize: 11, color }}
            >
              {entry}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
