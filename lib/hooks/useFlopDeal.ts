import { useEffect, useRef, useState, RefObject } from 'react';
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
  originRef: RefObject<HTMLDivElement | null>;
  slot0Ref: RefObject<HTMLDivElement | null>;
  slot1Ref: RefObject<HTMLDivElement | null>;
  slot2Ref: RefObject<HTMLDivElement | null>;
  enabled: boolean;
}

export interface UseFlopDealResult {
  styles: [CSSProperties, CSSProperties, CSSProperties];
  allFlipped: boolean;
}

function getCenter(ref: RefObject<HTMLDivElement | null>): Pos {
  const r = ref.current?.getBoundingClientRect();
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: 0, y: 0 };
}

export function useFlopDeal({ originRef, slot0Ref, slot1Ref, slot2Ref, enabled }: UseFlopDealOptions): UseFlopDealResult {
  const [phase, setPhase] = useState<Phase>('waiting');
  const [allFlipped, setAllFlipped] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafsRef = useRef<number[]>([]);
  // Coords captured once when animation starts — never re-read during flight
  const coordsRef = useRef({ origin: { x: 0, y: 0 }, slot0: { x: 0, y: 0 }, slot1: { x: 0, y: 0 }, slot2: { x: 0, y: 0 } });
  const refsRef = useRef({ originRef, slot0Ref, slot1Ref, slot2Ref });
  refsRef.current = { originRef, slot0Ref, slot1Ref, slot2Ref };

  useEffect(() => {
    if (!enabled) {
      setPhase('waiting');
      setAllFlipped(false);
      return;
    }

    // Read layout once here, not on every render
    const { originRef: oRef, slot0Ref: s0Ref, slot1Ref: s1Ref, slot2Ref: s2Ref } = refsRef.current;
    coordsRef.current = {
      origin: getCenter(oRef),
      slot0: getCenter(s0Ref),
      slot1: getCenter(s1Ref),
      slot2: getCenter(s2Ref),
    };

    timersRef.current.forEach(clearTimeout);
    rafsRef.current.forEach(cancelAnimationFrame);
    timersRef.current = [];
    rafsRef.current = [];

    setPhase('starting');

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

  const ox0 = o.x - s0.x, oy0 = o.y - s0.y;
  const ox1 = o.x - s1.x, oy1 = o.y - s1.y;
  const ox2 = o.x - s2.x, oy2 = o.y - s2.y;

  const dx1 = s0.x - s1.x, dy1 = s0.y - s1.y;
  const dx2 = s0.x - s2.x, dy2 = s0.y - s2.y;

  let styles: [CSSProperties, CSSProperties, CSSProperties];

  if (phase === 'waiting' || phase === 'done') {
    styles = [{}, {}, {}];
  } else if (phase === 'starting') {
    styles = [
      { position: 'relative', zIndex: 50, transform: `translate(${ox0}px, ${oy0}px)`, transition: 'none' },
      { position: 'relative', zIndex: 51, transform: `translate(${ox1}px, ${oy1}px)`, transition: 'none' },
      { position: 'relative', zIndex: 52, transform: `translate(${ox2}px, ${oy2}px)`, transition: 'none' },
    ];
  } else if (phase === 'flying') {
    const t = `transform ${STACK_DUR}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    styles = [
      { position: 'relative', zIndex: 50, transform: 'translate(0, 0)',               transition: t },
      { position: 'relative', zIndex: 51, transform: `translate(${dx1}px, ${dy1}px)`, transition: t },
      { position: 'relative', zIndex: 52, transform: `translate(${dx2}px, ${dy2}px)`, transition: t },
    ];
  } else {
    const t = `transform ${SPREAD_DUR}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    styles = [
      { position: 'relative', zIndex: 50, transform: 'translate(0, 0)', transition: t },
      { position: 'relative', zIndex: 51, transform: 'translate(0, 0)', transition: t },
      { position: 'relative', zIndex: 52, transform: 'translate(0, 0)', transition: t },
    ];
  }

  return { styles, allFlipped };
}
