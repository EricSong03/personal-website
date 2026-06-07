// Renders a stacked pile of poker chips for a given dollar amount.
// Gold chips = $10, Silver chips = $1.  Max display: 8 chips tall.

interface ChipStackProps {
  amount: number
  label?: boolean
}

export default function ChipStack({ amount, label = true }: ChipStackProps) {
  if (amount <= 0) return null

  const gold   = Math.floor(amount / 10)
  const silver = amount % 10

  // Build chip list (gold first, then silver), max 8 visible
  const chips: Array<'gold' | 'silver'> = [
    ...Array(Math.min(gold,   6)).fill('gold'),
    ...Array(Math.min(silver, 6)).fill('silver'),
  ].slice(0, 8)

  const chipH   = 8   // px per chip height
  const chipW   = 26  // px chip diameter
  const overlap = 5   // px vertical overlap
  const stackH  = chips.length * (chipH - overlap) + overlap + 4

  return (
    <div className="flex flex-col items-center gap-0.5">
      {/* Chip pile */}
      <div className="relative" style={{ width: chipW, height: stackH }}>
        {chips.map((color, i) => {
          const bottom = i * (chipH - overlap)
          return (
            <div
              key={i}
              className="absolute left-0 right-0 rounded-full"
              style={{
                height: chipH,
                bottom,
                background: color === 'gold'
                  ? 'linear-gradient(180deg, #f5c842 0%, #b8902a 50%, #f5c842 100%)'
                  : 'linear-gradient(180deg, #d0d0d0 0%, #888 50%, #d0d0d0 100%)',
                border: color === 'gold' ? '1px solid #7a5e1a' : '1px solid #555',
                boxShadow: '0 1px 2px rgba(0,0,0,0.6)',
              }}
            />
          )
        })}
      </div>

      {/* Amount label */}
      {label && (
        <span className="text-[10px] font-mono text-[#e0c97a] font-bold leading-none">
          ${amount}
        </span>
      )}
    </div>
  )
}
