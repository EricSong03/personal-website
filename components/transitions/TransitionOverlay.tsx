"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePageTransition } from "@/lib/transitionContext"

export default function TransitionOverlay() {
  const { isTransitioning, origin } = usePageTransition()

  const cx = origin ? `${origin.x}px` : "50%"
  const cy = origin ? `${origin.y}px` : "55%"

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{ backgroundColor: "#0a0a0a" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeOut" } }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Warm bloom swelling out from the door's under-glow */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${cx} ${cy}, rgba(214,160,74,0.30) 0%, rgba(122,84,33,0.14) 24%, rgba(10,10,10,0) 58%)`,
              transformOrigin: `${cx} ${cy}`,
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1.7 }}
            transition={{ duration: 0.55, ease: [0.3, 0, 0.45, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
