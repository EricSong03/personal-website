import { useEffect, useRef, useState, RefObject } from 'react';
import type { CSSProperties } from 'react';

interface UseCardDealOptions {
  originRef: RefObject<HTMLDivElement | null>;
  destinationRef: RefObject<HTMLDivElement | null>;
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

function getCenter(ref: RefObject<HTMLDivElement | null>) {
  const r = ref.current?.getBoundingClientRect();
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: 0, y: 0 };
}

export function useCardDeal(options: UseCardDealOptions): UseCardDealResult {
  const [phase, setPhase] = useState<Phase>('waiting');
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafsRef = useRef<number[]>([]);
  // Coords captured once when animation starts — never re-read during flight
  const coordsRef = useRef({ origin: { x: 0, y: 0 }, destination: { x: 0, y: 0 } });
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!options.enabled) {
      setPhase('waiting');
      setIsFlipped(false);
      setHasLanded(false);
      return;
    }

    // Read layout once here, not on every render
    coordsRef.current = {
      origin: getCenter(optionsRef.current.originRef),
      destination: getCenter(optionsRef.current.destinationRef),
    };

    const { duration, flipAt, delay } = optionsRef.current;

    timersRef.current.forEach(clearTimeout);
    rafsRef.current.forEach(cancelAnimationFrame);
    timersRef.current = [];
    rafsRef.current = [];

    const t1 = setTimeout(() => {
      setPhase('starting');
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => setPhase('traveling'));
        rafsRef.current.push(raf2);
      });
      rafsRef.current.push(raf1);
    }, delay);

    const t2 = setTimeout(() => setIsFlipped(true), delay + flipAt * duration);

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
