"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePageTransition } from "@/lib/transitionContext"

export default function TransitionOverlay() {
  const { isTransitioning } = usePageTransition()

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{ backgroundColor: "#0a0a0a" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeInOut" }}
        />
      )}
    </AnimatePresence>
  )
}
