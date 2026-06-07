'use client'
import { motion } from 'framer-motion'
import { HoleCardData } from '@/lib/types'

interface VillainCardProps {
  card?: HoleCardData
  faceUp?: boolean
  size?: 'sm' | 'md'
  dealFrom?: { x: number; y: number }
  dealDelay?: number
}

const isRed = (suit: string) => suit === '♥' || suit === '♦'

export default function VillainCard({
  card,
  faceUp = false,
  size = 'sm',
  dealFrom,
  dealDelay = 0,
}: VillainCardProps) {
  const w = size === 'sm' ? 44 : 56
  const h = size === 'sm' ? 62 : 78
  const red = card ? isRed(card.suit) : false

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
      <div style={{ width: w, height: h, perspective: 600 }}>
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: faceUp ? 0 : 180 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-md shadow-lg flex flex-col p-1"
            style={{
              backgroundColor: '#fafaf9',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            {card && (
              <>
                <div className={`text-[9px] font-mono font-bold leading-tight ${red ? 'text-[#dc2626]' : 'text-black'}`}>
                  <div>{card.rank}</div>
                  <div>{card.suit}</div>
                </div>
                <div className={`flex-1 flex items-center justify-center text-xl ${red ? 'text-[#dc2626]' : 'text-black'}`}>
                  {card.suit}
                </div>
              </>
            )}
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-md shadow-lg"
            style={{
              backgroundColor: '#1a2e1a',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              border: '1.5px solid #c8962a',
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-[#c8962a] opacity-40 text-sm">
              ♠
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
