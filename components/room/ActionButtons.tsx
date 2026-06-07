'use client'
import { motion } from 'framer-motion'
import { DecisionOption } from '@/lib/types'

interface ActionButtonsProps {
  options: DecisionOption[]
  onAct: (option: DecisionOption) => void
}

const actionColor: Record<string, string> = {
  fold:  '#ef4444',
  check: '#22c55e',
  call:  '#22c55e',
  bet:   '#c8962a',
  raise: '#c8962a',
}

export default function ActionButtons({ options, onAct }: ActionButtonsProps) {
  return (
    <motion.div
      className="flex gap-3 justify-end"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
    >
      {options.map((opt) => {
        const color = actionColor[opt.action] ?? '#737373'
        const isFold = opt.isFold

        return (
          <motion.button
            key={opt.label}
            onClick={() => onAct(opt)}
            className="px-5 py-2.5 rounded-lg font-mono text-sm font-bold transition-colors duration-100"
            style={{
              backgroundColor: isFold ? 'rgba(239,68,68,0.12)' : `${color}18`,
              border: `1.5px solid ${color}`,
              color,
              minWidth: 90,
            }}
            whileHover={{ scale: 1.04, backgroundColor: `${color}28` }}
            whileTap={{ scale: 0.97 }}
          >
            {opt.label}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
