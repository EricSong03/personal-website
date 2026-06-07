"use client"

import { useState, useEffect, useCallback } from "react"
import HoleCard from "@/components/cards/HoleCard"
import CommunityCard from "@/components/cards/CommunityCard"
import { RoomData, CommunityCardData } from "@/lib/types"

// Timing (ms from sequence start)
const T_HOLE1_DEAL = 200
const T_HOLE2_DEAL = 500
const T_HOLE_FLIP = 1100
const T_FLOP1 = 1800
const T_FLOP2 = 2100
const T_FLOP3 = 2400
const T_TURN = 3500
const T_RIVER = 4600

interface DealState {
  hole: [boolean, boolean]
  holeFlipped: boolean
  community: [boolean, boolean, boolean, boolean, boolean]
}

const INITIAL: DealState = {
  hole: [false, false],
  holeFlipped: false,
  community: [false, false, false, false, false],
}

const COMPLETE: DealState = {
  hole: [true, true],
  holeFlipped: true,
  community: [true, true, true, true, true],
}

interface CardDealSequenceProps {
  room: RoomData
  onExpandCard: (card: CommunityCardData) => void
}

export default function CardDealSequence({ room, onExpandCard }: CardDealSequenceProps) {
  const [state, setState] = useState<DealState>(INITIAL)
  const [skipped, setSkipped] = useState(false)

  const skip = useCallback(() => {
    setSkipped(true)
    setState(COMPLETE)
  }, [])

  useEffect(() => {
    if (skipped) return

    const timers: ReturnType<typeof setTimeout>[] = []

    const at = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms))
    }

    at(() => setState((s) => ({ ...s, hole: [true, false] })), T_HOLE1_DEAL)
    at(() => setState((s) => ({ ...s, hole: [true, true] })), T_HOLE2_DEAL)
    at(() => setState((s) => ({ ...s, holeFlipped: true })), T_HOLE_FLIP)
    at(
      () => setState((s) => ({ ...s, community: [true, false, false, false, false] })),
      T_FLOP1
    )
    at(
      () => setState((s) => ({ ...s, community: [true, true, false, false, false] })),
      T_FLOP2
    )
    at(
      () => setState((s) => ({ ...s, community: [true, true, true, false, false] })),
      T_FLOP3
    )
    at(
      () => setState((s) => ({ ...s, community: [true, true, true, true, false] })),
      T_TURN
    )
    at(
      () => setState((s) => ({ ...s, community: [true, true, true, true, true] })),
      T_RIVER
    )

    return () => timers.forEach(clearTimeout)
  }, [skipped])

  const { hole, holeFlipped, community } = state
  const cards = room.communityCards

  return (
    <>
      {/* Skip button */}
      {!skipped && (
        <button
          onClick={skip}
          className="absolute top-4 right-4 text-xs font-mono text-[#525252] hover:text-[#a3a3a3] transition-colors duration-150 z-10"
        >
          skip →
        </button>
      )}
      <div className="w-full h-full flex flex-col items-center justify-between py-2">
        {/* Community cards — center */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="flex gap-3">
            {cards.slice(0, 3).map((card, i) => (
              <CommunityCard
                key={card.id}
                card={card}
                dealt={community[i]}
                onExpand={onExpandCard}
              />
            ))}
          </div>
          {cards.length > 3 && (
            <div className="flex gap-3">
              {cards.slice(3, 5).map((card, i) => (
                <CommunityCard
                  key={card.id}
                  card={card}
                  dealt={community[i + 3]}
                  onExpand={onExpandCard}
                />
              ))}
            </div>
          )}
        </div>

        {/* Hole cards — player position */}
        <div className="flex gap-4">
          <HoleCard card={room.holeCards[0]} dealt={hole[0]} faceUp={holeFlipped} dealDelay={0} flipDelay={0} />
          <HoleCard card={room.holeCards[1]} dealt={hole[1]} faceUp={holeFlipped} dealDelay={0} flipDelay={0.12} />
        </div>
      </div>
    </>
  )
}
