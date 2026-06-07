"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react"
import { useRouter } from "next/navigation"

interface PageTransitionContextValue {
  isTransitioning: boolean
  triggerTransition: (href: string) => void
  endTransition: () => void
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  isTransitioning: false,
  triggerTransition: () => {},
  endTransition: () => {},
})

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()

  const triggerTransition = useCallback(
    (href: string) => {
      setIsTransitioning(true)
      setTimeout(() => {
        router.push(href)
      }, 320)
    },
    [router]
  )

  const endTransition = useCallback(() => {
    setIsTransitioning(false)
  }, [])

  return (
    <PageTransitionContext.Provider
      value={{ isTransitioning, triggerTransition, endTransition }}
    >
      {children}
    </PageTransitionContext.Provider>
  )
}

export function usePageTransition() {
  return useContext(PageTransitionContext)
}
