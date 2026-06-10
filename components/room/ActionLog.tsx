'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface ActionLogProps {
  entries: string[]
}

function entryColor(entry: string): string {
  if (entry.startsWith('—')) return '#d9b65f'
  if (/^[♥♠♦♣]/.test(entry)) return '#737373'
  if (entry.toLowerCase().startsWith('hero')) return '#8fae97'
  if (entry.includes('posts')) return '#525252'
  return '#a3a3a3'
}

export default function ActionLog({ entries }: ActionLogProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries])

  const lastIdx = entries.length - 1

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-0 overflow-y-auto"
      style={{ maxHeight: 220, scrollbarWidth: 'none' }}
    >
      {entries.map((entry, i) => {
        const color = entryColor(entry)
        const baseStyle = { fontSize: 11, color }

        if (i === lastIdx) {
          return (
            <motion.div
              key={`${entry}-${i}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="font-mono leading-relaxed break-words"
              style={baseStyle}
            >
              {entry}
            </motion.div>
          )
        }

        return (
          <div
            key={`${entry}-${i}`}
            className="font-mono leading-relaxed break-words"
            style={baseStyle}
          >
            {entry}
          </div>
        )
      })}
    </div>
  )
}
