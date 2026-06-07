'use client'

import { useState, useCallback, useEffect, useRef, RefObject, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PokerTable from '@/components/room/PokerTable'
import PlayerSeat from '@/components/room/PlayerSeat'
import PotDisplay from '@/components/room/PotDisplay'
import ActionButtons from '@/components/room/ActionButtons'
import ActionLog from '@/components/room/ActionLog'
import ChipStack from '@/components/room/ChipStack'
import CommunityCard from '@/components/cards/CommunityCard'
import CardSpotlight, { ExpandedCard } from '@/components/cards/CardSpotlight'
import { usePageTransition } from '@/lib/transitionContext'
import { usePokerHand } from '@/lib/hooks/usePokerHand'
import { useFlopDeal } from '@/lib/hooks/useFlopDeal'
import { useCardDeal } from '@/lib/hooks/useCardDeal'
import { RoomData, CommunityCardData, Position } from '@/lib/types'

function getCenter(ref: RefObject<HTMLDivElement | null>) {
  const r = ref.current?.getBoundingClientRect()
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: 0, y: 0 }
}

// ---------------------------------------------------------------------------
// Seat layout constants (% of the 900×580 oval container)
// dealOffset = vector from seat to oval center (card starts at center, flies to seat)
// dealDelay1/2 = ms from cardsDealt for card 1 / card 2 (2 dealing rounds)
// ---------------------------------------------------------------------------
// Clockwise order: SB(right) → BB(bottom-center) → UTG(lower-left) → LJ(left) → HJ(upper-left) → BTN(upper-right) → SB
const SEAT_CONFIG: Record<Position, {
  left: string; top: string
  chipDir: 'up' | 'down' | 'left' | 'right'
  dealOffset: { x: number; y: number }
  dealDelay1: number; dealDelay2: number
}> = {
  BB:  { left: '50%',   top: '107%', chipDir: 'up',    dealOffset: { x: 0,    y: -330 }, dealDelay1: 600,  dealDelay2: 1320 },
  SB:  { left: '104%',  top: '54%',  chipDir: 'left',  dealOffset: { x: -486, y: -23  }, dealDelay1: 480,  dealDelay2: 1200 },
  UTG: { left: '22%',   top: '92%',  chipDir: 'up',    dealOffset: { x: 252,  y: -244 }, dealDelay1: 0,    dealDelay2: 720  },
  LJ:  { left: '-4%',   top: '54%',  chipDir: 'right', dealOffset: { x: 486,  y: -23  }, dealDelay1: 120,  dealDelay2: 840  },
  HJ:  { left: '22%',   top: '8%',   chipDir: 'down',  dealOffset: { x: 252,  y: 244  }, dealDelay1: 240,  dealDelay2: 960  },
  BTN: { left: '78%',   top: '8%',   chipDir: 'down',  dealOffset: { x: -252, y: 244  }, dealDelay1: 360,  dealDelay2: 1080 },
}

interface PokerRoomProps {
  room: RoomData
}

export default function PokerRoom({ room }: PokerRoomProps) {
  const { endTransition, triggerTransition } = usePageTransition()
  const [expanded, setExpanded] = useState<ExpandedCard | null>(null)

  const { state, startGame, heroAct } = usePokerHand(room)
  const [heroFaceUp, setHeroFaceUp] = useState(false)
  const dealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Refs for board card deal animations
  const deckRef = useRef<HTMLDivElement>(null)
  const c0Ref   = useRef<HTMLDivElement>(null)
  const c1Ref   = useRef<HTMLDivElement>(null)
  const c2Ref   = useRef<HTMLDivElement>(null)
  const c3Ref   = useRef<HTMLDivElement>(null)
  const c4Ref   = useRef<HTMLDivElement>(null)
  const commRefs = [c0Ref, c1Ref, c2Ref, c3Ref, c4Ref]

  // Flop: stack → flip → spread using legacy hook
  const flopDeal = useFlopDeal({
    origin: getCenter(deckRef),
    slot0:  getCenter(c0Ref),
    slot1:  getCenter(c1Ref),
    slot2:  getCenter(c2Ref),
    enabled: state.phase === 'deal_street' && state.street === 'flop',
  })
  // Turn + river: single card fly-in
  const turnDeal = useCardDeal({
    origin: getCenter(deckRef), destination: getCenter(c3Ref),
    duration: 380, flipAt: 0.6, delay: 0,
    enabled: state.phase === 'deal_street' && state.street === 'turn',
  })
  const riverDeal = useCardDeal({
    origin: getCenter(deckRef), destination: getCenter(c4Ref),
    duration: 380, flipAt: 0.6, delay: 0,
    enabled: state.phase === 'deal_street' && state.street === 'river',
  })

  // Lock body scroll while the poker room is mounted so page-level scroll
  // (triggered by Framer Motion DOM measurements or layout reflows) doesn't
  // visually shift the table.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    const timer = setTimeout(endTransition, 80)
    return () => clearTimeout(timer)
  }, [endTransition])

  // Auto-deal after 2 seconds on mount
  useEffect(() => {
    const timer = setTimeout(() => handleStartGame(), 2000)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleStartGame = useCallback(() => {
    startGame()
    // Hero cards flip after all 12 cards have landed (~1740ms) + brief pause
    dealTimerRef.current = setTimeout(() => setHeroFaceUp(true), 2100)
  }, [startGame])

  const handleLeave = useCallback(() => {
    triggerTransition('/')
  }, [triggerTransition])

  const handleExpand = useCallback((card: CommunityCardData, rect: DOMRect) => {
    setExpanded({ card, rect })
  }, [])

  // Look up villain config by position
  const getVillain = (pos: Position) => room.villains.find(v => v.position === pos)
  const getVillainState = (pos: Position) => state.villainStates[pos]

  const isMainVillain  = (pos: Position) => pos === room.mainVillainPosition
  const villainFaceUp  = (pos: Position) =>
    isMainVillain(pos) && state.showVillainCards

  // Board card revealed state
  const cardFaceUp = (idx: number) => {
    const { revealedBoardCards } = state
    return idx < revealedBoardCards
  }

  const positions: Position[] = ['UTG', 'LJ', 'HJ', 'BTN', 'SB']

  return (
    <div
      className="relative w-screen h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
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

      {/* ── Main layout: table + action log ── */}
      <div className="flex-1 flex items-stretch mt-14 mb-0">

        {/* Action log — left side */}
        <motion.div
          className="w-52 max-w-[13rem] shrink-0 flex flex-col justify-end px-4 pb-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <ActionLog entries={state.actionLog} />
        </motion.div>

        {/* Table area — center */}
        <div className="flex-1 flex items-center justify-center relative overflow-visible">
          {/* Oval table with seats */}
          <div
            className="relative overflow-visible"
            style={{
              width: 'min(900px, 95vw)',
              height: 'min(520px, 65vh)',
            }}
          >
            {/* ── Villain seats ��─ */}
            {positions.map((pos) => {
              const villain    = getVillain(pos)
              const vState     = getVillainState(pos)
              const cfg        = SEAT_CONFIG[pos]
              if (!villain || !vState) return null

              return (
                <div
                  key={pos}
                  className="absolute z-10"
                  style={{
                    left: cfg.left,
                    top: cfg.top,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <PlayerSeat
                    position={pos}
                    name={villain.name}
                    avatar={villain.avatar}
                    stack={vState.stack}
                    streetBet={vState.streetBet}
                    holeCards={isMainVillain(pos) ? room.villainHoleCards : undefined}
                    faceUp={villainFaceUp(pos)}
                    folded={vState.folded}
                    sweepToPot={state.phase === 'collect_bets'}
                    chipDirection={cfg.chipDir}
                    cardsDealt={state.phase !== 'idle'}
                    dealOffset={cfg.dealOffset}
                    dealDelay1={cfg.dealDelay1}
                    dealDelay2={cfg.dealDelay2}
                  />
                </div>
              )
            })}

            {/* ── Hero seat (BB) ── */}
            <div
              className="absolute z-10"
              style={{
                left: SEAT_CONFIG.BB.left,
                top: SEAT_CONFIG.BB.top,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <PlayerSeat
                position="BB"
                name="You"
                avatar="E"
                stack={state.heroStack}
                streetBet={state.heroStreetBet}
                holeCards={room.holeCards}
                isHero={true}
                faceUp={heroFaceUp}
                sweepToPot={state.phase === 'collect_bets'}
                chipDirection={SEAT_CONFIG.BB.chipDir}
                isActive={state.phase === 'hero_deciding'}
                cardsDealt={state.phase !== 'idle'}
                dealOffset={SEAT_CONFIG.BB.dealOffset}
                dealDelay1={SEAT_CONFIG.BB.dealDelay1}
                dealDelay2={SEAT_CONFIG.BB.dealDelay2}
              />
            </div>

            {/* Deck origin marker — used by flop/turn/river deal hooks */}
            <div
              ref={deckRef}
              className="absolute pointer-events-none"
              style={{ width: 0, height: 0, left: '50%', top: '45%' }}
            />

            {/* Pot sweep to winner */}
            {(state.phase === 'hero_wins' || state.phase === 'villain_wins') && (() => {
              const heroWins = state.phase === 'hero_wins'
              const cfg = heroWins ? SEAT_CONFIG.BB : SEAT_CONFIG[room.mainVillainPosition]
              // dealOffset points from seat → center, so negate to get center → seat
              const tx = -cfg.dealOffset.x * 0.75
              const ty = -cfg.dealOffset.y * 0.75
              return (
                <div
                  className="absolute pointer-events-none z-30"
                  style={{ left: '50%', top: '45%', transform: 'translate(-50%, -50%)' }}
                >
                  <motion.div
                    initial={{ x: 0, y: 0, scale: 1.2, opacity: 1 }}
                    animate={{ x: tx, y: ty, scale: 0.3, opacity: 0 }}
                    transition={{ duration: 0.65, ease: [0.4, 0, 1, 1] }}
                  >
                    <ChipStack amount={state.pot} />
                  </motion.div>
                </div>
              )
            })()}

            {/* ── The felt oval (PokerTable) ── */}
            <div className="absolute inset-0">
              <PokerTable>
                {/* Board + pot */}
                <div className="flex flex-col items-center gap-3">
                  {/* Pot */}
                  <PotDisplay pot={state.pot} bigBlind={room.bigBlind} />

                  {/* Community cards — wrappers carry flop/turn/river animation styles */}
                  <div className="flex gap-2">
                    {room.communityCards.map((card, i) => {
                      const ref = commRefs[i]
                      let wrapStyle: CSSProperties = {}
                      let faceUp: boolean
                      if (i < 3 && 'position' in flopDeal.styles[i]) {
                        wrapStyle = flopDeal.styles[i]
                        faceUp = flopDeal.allFlipped
                      } else if (i === 3 && 'position' in turnDeal.style) {
                        wrapStyle = turnDeal.style
                        faceUp = turnDeal.isFlipped
                      } else if (i === 4 && 'position' in riverDeal.style) {
                        wrapStyle = riverDeal.style
                        faceUp = riverDeal.isFlipped
                      } else {
                        faceUp = cardFaceUp(i)
                      }
                      return (
                        <div key={card.id} ref={ref} style={wrapStyle}>
                          <CommunityCard card={card} faceUp={faceUp} onExpand={handleExpand} />
                        </div>
                      )
                    })}
                  </div>

                  {/* Hand result description (showdown) */}
                  <AnimatePresence>
                    {(state.phase === 'showdown' || state.phase === 'hero_wins' || state.phase === 'villain_wins') && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs font-mono text-[#c8962a] text-center max-w-[220px] leading-snug"
                      >
                        {room.handScript.showdown.description}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </PokerTable>
            </div>
          </div>
        </div>

        {/* Right side — blank balance */}
        <div className="w-52 shrink-0" />
      </div>

      {/* ── Action buttons — bottom right ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 24, paddingRight: 24, minHeight: 72 }}>
        <AnimatePresence mode="wait">
          {state.phase === 'hero_deciding' && state.currentOptions && (
            <ActionButtons key="action" options={state.currentOptions} onAct={heroAct} />
          )}

          {(state.phase === 'villain_acting' || state.phase === 'collect_bets' || state.phase === 'deal_street') && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs font-mono text-[#525252]"
            >
              {state.phase === 'villain_acting' ? '…' : ''}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

{/* ── Card spotlight (click to expand) ── */}
      <CardSpotlight expanded={expanded} onClose={() => setExpanded(null)} />
    </div>
  )
}
