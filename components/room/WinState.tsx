'use client'
import { motion } from 'framer-motion'

interface WinStateProps {
  phase: 'hero_wins' | 'villain_wins'
  potSize: number
  description: string
  onReplay: () => void
  onLeave: () => void
}

export default function WinState({ phase, potSize, description, onReplay, onLeave }: WinStateProps) {
  const heroWon = phase === 'hero_wins'

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex flex-col items-center gap-4 text-center px-8"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Main outcome */}
        <div
          className="text-4xl font-bold font-mono tracking-tight"
          style={{ color: heroWon ? '#22c55e' : '#ef4444' }}
        >
          {heroWon ? '🏆 You Win!' : '💸 You Folded'}
        </div>

        {/* Amount */}
        {heroWon && (
          <motion.div
            className="text-2xl font-mono font-bold"
            style={{ color: '#c8962a' }}
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.4 }}
          >
            +${potSize} pot
          </motion.div>
        )}

        {/* Hand description */}
        <p className="text-sm font-mono text-[#a3a3a3] max-w-xs leading-relaxed">
          {description}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mt-2">
          <motion.button
            onClick={onReplay}
            className="px-6 py-2.5 rounded-lg font-mono text-sm font-bold"
            style={{
              backgroundColor: 'rgba(200,150,42,0.15)',
              border: '1.5px solid #c8962a',
              color: '#c8962a',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Replay
          </motion.button>
          <motion.button
            onClick={onLeave}
            className="px-6 py-2.5 rounded-lg font-mono text-sm font-bold"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid #333',
              color: '#a3a3a3',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Leave Table
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
