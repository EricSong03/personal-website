import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

interface UseCardDealOptions {
  origin: { x: number; y: number };
  destination: { x: number; y: number };
  duration: number;
  flipAt: number;   // 0–1 fraction of duration when flip triggers
  delay: number;    // stagger offset in ms
  enabled: boolean;
}

interface UseCardDealResult {
  style: CSSProperties;
  isFlipped: boolean;
  hasLanded: boolean;
}

type Phase = 'waiting' | 'starting' | 'traveling' | 'done';

export function useCardDeal(options: UseCardDealOptions): UseCardDealResult {
  const [phase, setPhase] = useState<Phase>('waiting');
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafsRef = useRef<number[]>([]);
  // Capture coords when animation starts so resize mid-flight doesn't jitter
  const coordsRef = useRef({ origin: options.origin, destination: options.destination });
  // Always-fresh snapshot of options, read inside effect via ref
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!options.enabled) {
      setPhase('waiting');
      setIsFlipped(false);
      setHasLanded(false);
      return;
    }

    const { origin, destination, duration, flipAt, delay } = optionsRef.current;
    coordsRef.current = { origin, destination };

    timersRef.current.forEach(clearTimeout);
    rafsRef.current.forEach(cancelAnimationFrame);
    timersRef.current = [];
    rafsRef.current = [];

    // Step 1: after stagger delay, snap card to origin (no transition)
    const t1 = setTimeout(() => {
      setPhase('starting');
      // Double RAF ensures browser paints the 'starting' position before
      // we add the transition and move to destination
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => setPhase('traveling'));
        rafsRef.current.push(raf2);
      });
      rafsRef.current.push(raf1);
    }, delay);

    // Step 2: flip at the specified fraction of travel duration
    const t2 = setTimeout(() => setIsFlipped(true), delay + flipAt * duration);

    // Step 3: animation complete
    const t3 = setTimeout(() => {
      setPhase('done');
      setHasLanded(true);
    }, delay + duration);

    timersRef.current = [t1, t2, t3];

    return () => {
      timersRef.current.forEach(clearTimeout);
      rafsRef.current.forEach(cancelAnimationFrame);
    };
  }, [options.enabled]); // intentional: only react to enabled toggle

  const { origin: o, destination: d } = coordsRef.current;
  const offsetX = o.x - d.x;
  const offsetY = o.y - d.y;

  let style: CSSProperties;
  if (phase === 'waiting' || phase === 'done') {
    style = {};
  } else if (phase === 'starting') {
    style = {
      position: 'relative',
      zIndex: 50,
      transform: `translate(${offsetX}px, ${offsetY}px)`,
      transition: 'none',
    };
  } else {
    style = {
      position: 'relative',
      zIndex: 50,
      transform: 'translate(0, 0)',
      transition: `transform ${optionsRef.current.duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    };
  }

  return { style, isFlipped, hasLanded };
}
