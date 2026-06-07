'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { HoleCardData, Position } from '@/lib/types'
import VillainCard from '@/components/cards/VillainCard'
import HoleCard from '@/components/cards/HoleCard'
import ChipStack from '@/components/room/ChipStack'

interface PlayerSeatProps {
  position: Position
  name: string
  avatar: string
  stack: number
  streetBet: number
  holeCards?: [HoleCardData, HoleCardData]
  isHero?: boolean
  faceUp?: boolean
  folded?: boolean
  isActive?: boolean
  sweepToPot?: boolean
  chipDirection: 'up' | 'down' | 'left' | 'right'
  cardsDealt?: boolean
  dealOffset?: { x: number; y: number }
  dealDelay1?: number
  dealDelay2?: number
}

export default function PlayerSeat({
  position,
  name,
  stack,
  streetBet,
  holeCards,
  isHero = false,
  faceUp = false,
  folded = false,
  isActive = false,
  sweepToPot = false,
  chipDirection,
  cardsDealt = false,
  dealOffset,
  dealDelay1 = 0,
  dealDelay2 = 0,
}: PlayerSeatProps) {
  const chipOffset: Record<string, { x: number; y: number }> = {
    up:    { x: 0,  y: -54 },
    down:  { x: 0,  y:  54 },
    left:  { x: -52, y: 0  },
    right: { x:  52, y: 0  },
  }
  const cd = chipOffset[chipDirection]

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Bet chip floating towards pot */}
      <AnimatePresence>
        {streetBet > 0 && (
          <motion.div
            key="chip"
            className="absolute z-20 pointer-events-none"
            style={{ x: cd.x, y: cd.y }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={
              sweepToPot
                ? { opacity: 0, x: cd.x * 2.5, y: cd.y * 2.5, scale: 0.5 }
                : { opacity: 0, scale: 0.6, x: 0, y: 0 }
            }
            transition={{ duration: sweepToPot ? 0.5 : 0.3 }}
          >
            <ChipStack amount={streetBet} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards — only mount after deal triggers so they animate in */}
      {cardsDealt && (
        <div className="flex gap-0.5 mb-1">
          {isHero ? (
            <>
              {holeCards && (
                <>
                  <HoleCard card={holeCards[0]} faceUp={faceUp} dealFrom={dealOffset} dealDelay={dealDelay1} />
                  <HoleCard card={holeCards[1]} faceUp={faceUp} flipDelay={0.15} dealFrom={dealOffset} dealDelay={dealDelay2} />
                </>
              )}
            </>
          ) : (
            <>
              <VillainCard card={holeCards?.[0]} faceUp={faceUp} size="sm" dealFrom={dealOffset} dealDelay={dealDelay1} />
              <VillainCard card={holeCards?.[1]} faceUp={faceUp} size="sm" dealFrom={dealOffset} dealDelay={dealDelay2} />
            </>
          )}
        </div>
      )}

      {/* Avatar + info bubble */}
      <motion.div
        className="flex items-center gap-2 rounded-full px-3 py-1.5"
        style={{
          backgroundColor: isHero
            ? 'rgba(200, 150, 42, 0.15)'
            : 'rgba(255,255,255,0.05)',
          border: isActive
            ? '1.5px solid #c8962a'
            : folded
            ? '1px solid #262626'
            : '1px solid #333',
          opacity: folded ? 0.4 : 1,
        }}
        animate={isActive ? { boxShadow: ['0 0 0 0 rgba(200,150,42,0)', '0 0 0 6px rgba(200,150,42,0.4)', '0 0 0 0 rgba(200,150,42,0)'] } : {}}
        transition={{ repeat: Infinity, duration: 1.6 }}
      >
        {/* Position chip */}
        <span
          className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: isHero ? '#c8962a' : '#2a2a2a',
            color: isHero ? '#000' : '#737373',
          }}
        >
          {position}
        </span>

        {/* Villain name */}
        {!isHero && (
          <span className="text-[10px] font-mono text-[#737373]">{name}</span>
        )}

        {/* Stack */}
        <span className={`text-xs font-mono font-bold ${folded ? 'text-[#404040]' : 'text-[#d4d4d4]'}`}>
          ${stack}
        </span>
      </motion.div>

      {/* Folded overlay */}
      {folded && (
        <span className="text-[9px] font-mono text-[#525252] mt-0.5">folded</span>
      )}
    </div>
  )
}
