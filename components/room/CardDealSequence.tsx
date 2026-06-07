"use client"

import { useState, useEffect, useRef, useCallback, RefObject } from "react"
import type { CSSProperties } from "react"
import { RoomData, CommunityCardData } from "@/lib/types"
import { useCardDeal } from "@/lib/hooks/useCardDeal"
import { useFlopDeal } from "@/lib/hooks/useFlopDeal"
import HoleCard from "@/components/cards/HoleCard"
import CommunityCard from "@/components/cards/CommunityCard"

// Timing (ms from sequence start)
const T_HOLE1     = 200
const T_HOLE2     = 500
const T_HOLE_FLIP = 1200
const T_FLOP      = 1900
const T_FLOP_DONE = T_FLOP + 1000   // set before hook reaches 'done' at +1150
const T_TURN      = T_FLOP + 1350
const T_RIVER     = T_TURN + 900

const HOLE_DUR = 420
const COMM_DUR = 380

function getCenter(ref: RefObject<HTMLElement | null>): { x: number; y: number } {
  const r = ref.current?.getBoundingClientRect()
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: 0, y: 0 }
}

// Hook style is active (non-waiting, non-done) when it has `position` set,
// or the card has already landed. This prevents a 1-frame flash at final position.
function active(style: CSSProperties, landed: boolean): boolean {
  return landed || "position" in style
}

interface CardDealSequenceProps {
  room: RoomData
  onExpandCard: (card: CommunityCardData, rect: DOMRect) => void
}

function StaticLayout({ room, onExpandCard }: CardDealSequenceProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between py-2">
      <div className="flex-1 flex items-center justify-center">
        <div className="flex gap-3">
          {room.communityCards.map((card) => (
            <CommunityCard key={card.id} card={card} faceUp onExpand={onExpandCard} />
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <HoleCard card={room.holeCards[0]} faceUp />
        <HoleCard card={room.holeCards[1]} faceUp />
      </div>
    </div>
  )
}

export default function CardDealSequence({ room, onExpandCard }: CardDealSequenceProps) {
  const [skipped, setSkipped]         = useState(false)
  const [holeFlipped, setHoleFlipped] = useState(false)
  const [flopDone, setFlopDone]       = useState(false)
  const [ena, setEna] = useState({ hole1: false, hole2: false, flop: false, turn: false, river: false })

  // Position markers
  const deckRef = useRef<HTMLDivElement>(null)
  const h1Ref   = useRef<HTMLDivElement>(null)
  const h2Ref   = useRef<HTMLDivElement>(null)
  const c0Ref   = useRef<HTMLDivElement>(null)
  const c1Ref   = useRef<HTMLDivElement>(null)
  const c2Ref   = useRef<HTMLDivElement>(null)
  const c3Ref   = useRef<HTMLDivElement>(null)
  const c4Ref   = useRef<HTMLDivElement>(null)

  const skip = useCallback(() => setSkipped(true), [])

  useEffect(() => {
    if (skipped) return
    const ts: ReturnType<typeof setTimeout>[] = []
    const at = (fn: () => void, ms: number) => ts.push(setTimeout(fn, ms))

    at(() => setEna(e => ({ ...e, hole1: true })),  T_HOLE1)
    at(() => setEna(e => ({ ...e, hole2: true })),  T_HOLE2)
    at(() => setHoleFlipped(true),                   T_HOLE_FLIP)
    at(() => setEna(e => ({ ...e, flop: true })),   T_FLOP)
    at(() => setFlopDone(true),                      T_FLOP_DONE)
    at(() => setEna(e => ({ ...e, turn: true })),   T_TURN)
    at(() => setEna(e => ({ ...e, river: true })),  T_RIVER)

    return () => ts.forEach(clearTimeout)
  }, [skipped])

  // Hooks must be called unconditionally; positions are read from refs at enable time
  const deck  = () => getCenter(deckRef)
  const hole1 = useCardDeal({ origin: deck(), destination: getCenter(h1Ref), duration: HOLE_DUR, flipAt: 99, delay: 0, enabled: ena.hole1 })
  const hole2 = useCardDeal({ origin: deck(), destination: getCenter(h2Ref), duration: HOLE_DUR, flipAt: 99, delay: 0, enabled: ena.hole2 })
  const flop  = useFlopDeal({ origin: deck(), slot0: getCenter(c0Ref), slot1: getCenter(c1Ref), slot2: getCenter(c2Ref), enabled: ena.flop })
  const turn  = useCardDeal({ origin: deck(), destination: getCenter(c3Ref), duration: COMM_DUR, flipAt: 0.6, delay: 0, enabled: ena.turn })
  const river = useCardDeal({ origin: deck(), destination: getCenter(c4Ref), duration: COMM_DUR, flipAt: 0.6, delay: 0, enabled: ena.river })

  const cards = room.communityCards

  if (skipped) {
    return <StaticLayout room={room} onExpandCard={onExpandCard} />
  }

  const flopActive = flopDone || "position" in flop.styles[0]

  return (
    <>
      <button
        onClick={skip}
        className="absolute top-4 right-4 text-xs font-mono text-[#525252] hover:text-[#a3a3a3] transition-colors duration-150 z-10"
      >
        skip →
      </button>

      {/* Deck position marker — top center, taken out of flow */}
      <div
        ref={deckRef}
        className="absolute pointer-events-none"
        style={{ width: 88, height: 124, top: 0, left: "50%", transform: "translateX(-50%)" }}
      />

      <div className="relative w-full h-full flex flex-col items-center justify-between py-2">
        {/* All 5 community cards in a single row */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex gap-3">
            <div ref={c0Ref}>
              <div style={flopActive ? flop.styles[0] : { visibility: "hidden" }}>
                <CommunityCard card={cards[0]} faceUp={flop.allFlipped} onExpand={onExpandCard} />
              </div>
            </div>
            <div ref={c1Ref}>
              <div style={flopActive ? flop.styles[1] : { visibility: "hidden" }}>
                <CommunityCard card={cards[1]} faceUp={flop.allFlipped} onExpand={onExpandCard} />
              </div>
            </div>
            <div ref={c2Ref}>
              <div style={flopActive ? flop.styles[2] : { visibility: "hidden" }}>
                <CommunityCard card={cards[2]} faceUp={flop.allFlipped} onExpand={onExpandCard} />
              </div>
            </div>
            <div ref={c3Ref}>
              <div style={active(turn.style, turn.hasLanded) ? turn.style : { visibility: "hidden" }}>
                <CommunityCard card={cards[3]} faceUp={turn.isFlipped} onExpand={onExpandCard} />
              </div>
            </div>
            <div ref={c4Ref}>
              <div style={active(river.style, river.hasLanded) ? river.style : { visibility: "hidden" }}>
                <CommunityCard card={cards[4]} faceUp={river.isFlipped} onExpand={onExpandCard} />
              </div>
            </div>
          </div>
        </div>

        {/* Hole cards — player position */}
        <div className="flex gap-4">
          <div ref={h1Ref}>
            <div style={active(hole1.style, hole1.hasLanded) ? hole1.style : { visibility: "hidden" }}>
              <HoleCard card={room.holeCards[0]} faceUp={holeFlipped} />
            </div>
          </div>
          <div ref={h2Ref}>
            <div style={active(hole2.style, hole2.hasLanded) ? hole2.style : { visibility: "hidden" }}>
              <HoleCard card={room.holeCards[1]} faceUp={holeFlipped} flipDelay={0.12} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
