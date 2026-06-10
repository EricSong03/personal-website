"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react"
import { useRouter } from "next/navigation"

export interface TransitionOrigin {
  x: number
  y: number
}

interface PageTransitionContextValue {
  isTransitioning: boolean
  origin: TransitionOrigin | null
  triggerTransition: (href: string, origin?: TransitionOrigin) => void
  endTransition: () => void
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  isTransitioning: false,
  origin: null,
  triggerTransition: () => {},
  endTransition: () => {},
})

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [origin, setOrigin] = useState<TransitionOrigin | null>(null)
  const router = useRouter()

  const triggerTransition = useCallback(
    (href: string, clickOrigin?: TransitionOrigin) => {
      setOrigin(clickOrigin ?? null)
      setIsTransitioning(true)
      setTimeout(() => {
        router.push(href)
      }, 500)
    },
    [router]
  )

  const endTransition = useCallback(() => {
    setIsTransitioning(false)
  }, [])

  return (
    <PageTransitionContext.Provider
      value={{ isTransitioning, origin, triggerTransition, endTransition }}
    >
      {children}
    </PageTransitionContext.Provider>
  )
}

export function usePageTransition() {
  return useContext(PageTransitionContext)
}
