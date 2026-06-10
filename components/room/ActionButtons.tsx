'use client'
import { motion } from 'framer-motion'
import { DecisionOption } from '@/lib/types'

interface ActionButtonsProps {
  options: DecisionOption[]
  onAct: (option: DecisionOption) => void
}

const actionColor: Record<string, string> = {
  fold:  '#b3544e',
  check: '#7ba386',
  call:  '#7ba386',
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

        return (
          <motion.button
            key={opt.label}
            onClick={() => onAct(opt)}
            className="px-5 py-2.5 rounded-md font-mono text-xs font-semibold uppercase tracking-[0.14em] cursor-pointer transition-colors duration-150"
            style={{
              backgroundColor: `${color}14`,
              border: `1px solid ${color}80`,
              color,
              minWidth: 90,
            }}
            whileHover={{ backgroundColor: `${color}26`, borderColor: color }}
            whileTap={{ scale: 0.98 }}
          >
            {opt.label}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
