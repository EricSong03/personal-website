import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

// Animation durations (ms)
const STACK_DUR  = 500;  // all 3 cards fly to slot-0 stack
const FLIP_AT    = STACK_DUR;         // cards reveal when stack forms
const SPREAD_AT  = STACK_DUR + 150;   // 650ms – cards slide to final positions
const SPREAD_DUR = 500;
const TOTAL      = SPREAD_AT + SPREAD_DUR; // 1150ms

type Phase = 'waiting' | 'starting' | 'flying' | 'spreading' | 'done';

interface Pos { x: number; y: number }

interface UseFlopDealOptions {
  origin: Pos;
  slot0: Pos;  // cards[0] destination – stays here (bottom of stack)
  slot1: Pos;  // cards[1] destination – slides to middle
  slot2: Pos;  // cards[2] destination – window card, slides furthest right
  enabled: boolean;
}

export interface UseFlopDealResult {
  // styles[0] → cards[0], styles[1] → cards[1], styles[2] → window card (cards[2])
  styles: [CSSProperties, CSSProperties, CSSProperties];
  allFlipped: boolean;
}

export function useFlopDeal({ origin, slot0, slot1, slot2, enabled }: UseFlopDealOptions): UseFlopDealResult {
  const [phase, setPhase] = useState<Phase>('waiting');
  const [allFlipped, setAllFlipped] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafsRef = useRef<number[]>([]);
  // Snapshot captured when animation starts so resize mid-flight doesn't jitter
  const coordsRef = useRef({ origin, slot0, slot1, slot2 });
  const optsRef = useRef({ origin, slot0, slot1, slot2 });
  optsRef.current = { origin, slot0, slot1, slot2 };

  useEffect(() => {
    if (!enabled) {
      setPhase('waiting');
      setAllFlipped(false);
      return;
    }

    coordsRef.current = { ...optsRef.current };

    timersRef.current.forEach(clearTimeout);
    rafsRef.current.forEach(cancelAnimationFrame);
    timersRef.current = [];
    rafsRef.current = [];

    // Snap cards to origin (no transition)
    setPhase('starting');

    // Double RAF – browser paints 'starting' position, then flying transition kicks in
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setPhase('flying'));
      rafsRef.current.push(raf2);
    });
    rafsRef.current.push(raf1);

    const t1 = setTimeout(() => setAllFlipped(true), FLIP_AT);
    const t2 = setTimeout(() => setPhase('spreading'), SPREAD_AT);
    const t3 = setTimeout(() => setPhase('done'), TOTAL);
    timersRef.current = [t1, t2, t3];

    return () => {
      timersRef.current.forEach(clearTimeout);
      rafsRef.current.forEach(cancelAnimationFrame);
    };
  }, [enabled]); // intentional: only react to enabled toggle

  const { origin: o, slot0: s0, slot1: s1, slot2: s2 } = coordsRef.current;

  // Origin offsets: where each card starts (all appear to come from the same origin point)
  const ox0 = o.x - s0.x, oy0 = o.y - s0.y;
  const ox1 = o.x - s1.x, oy1 = o.y - s1.y;
  const ox2 = o.x - s2.x, oy2 = o.y - s2.y;

  // Stack offsets: card1 and card2 shift to visually land on slot0
  const dx1 = s0.x - s1.x, dy1 = s0.y - s1.y;
  const dx2 = s0.x - s2.x, dy2 = s0.y - s2.y;

  let styles: [CSSProperties, CSSProperties, CSSProperties];

  if (phase === 'waiting' || phase === 'done') {
    styles = [{}, {}, {}];
  } else if (phase === 'starting') {
    // All cards at their origin offset, no transition
    styles = [
      { position: 'relative', zIndex: 50, transform: `translate(${ox0}px, ${oy0}px)`, transition: 'none' },
      { position: 'relative', zIndex: 51, transform: `translate(${ox1}px, ${oy1}px)`, transition: 'none' },
      { position: 'relative', zIndex: 52, transform: `translate(${ox2}px, ${oy2}px)`, transition: 'none' },
    ];
  } else if (phase === 'flying') {
    // All cards fly to slot0 (stacked); card1 and card2 are offset to visually land on slot0
    const t = `transform ${STACK_DUR}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    styles = [
      { position: 'relative', zIndex: 50, transform: 'translate(0, 0)',               transition: t },
      { position: 'relative', zIndex: 51, transform: `translate(${dx1}px, ${dy1}px)`, transition: t },
      { position: 'relative', zIndex: 52, transform: `translate(${dx2}px, ${dy2}px)`, transition: t },
    ];
  } else {
    // Spreading: each card transitions back to its natural DOM position
    const t = `transform ${SPREAD_DUR}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    styles = [
      { position: 'relative', zIndex: 50, transform: 'translate(0, 0)', transition: t },
      { position: 'relative', zIndex: 51, transform: 'translate(0, 0)', transition: t },
      { position: 'relative', zIndex: 52, transform: 'translate(0, 0)', transition: t },
    ];
  }

  return { styles, allFlipped };
}
