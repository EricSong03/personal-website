'use client'
import { motion } from 'framer-motion'
import ChipStack from '@/components/room/ChipStack'

interface PotDisplayProps {
  pot: number
  bigBlind: number
}

export default function PotDisplay({ pot, bigBlind }: PotDisplayProps) {
  if (pot <= 0) return null
  const bbs = (pot / bigBlind).toFixed(1)

  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ChipStack amount={pot} label={false} />
      <div className="flex flex-col items-center gap-0">
        <span className="text-[11px] font-mono font-bold text-[#e0c97a]">${pot}</span>
        <span className="text-[9px] font-mono text-[#737373]">{bbs}bb</span>
      </div>
    </motion.div>
  )
}
