// Renders a stacked pile of poker chips for a given dollar amount.
// Gold chips = $10, Graphite chips = $1.  Max display: 8 chips tall.

interface ChipStackProps {
  amount: number
  label?: boolean
}

// Matte clay chips: flat base color, alternating edge ticks like real chips,
// a faint top highlight instead of a glossy gradient.
const CHIP_STYLE = {
  gold: {
    base: "#9a7b26",
    tick: "rgba(246,243,234,0.55)",
    border: "#5e4b18",
  },
  graphite: {
    base: "#3a3f44",
    tick: "rgba(246,243,234,0.4)",
    border: "#1f2225",
  },
} as const

export default function ChipStack({ amount, label = true }: ChipStackProps) {
  if (amount <= 0) return null

  const gold = Math.floor(amount / 10)
  const graphite = amount % 10

  // Build chip list (gold first, then graphite), max 8 visible
  const chips: Array<keyof typeof CHIP_STYLE> = [
    ...Array(Math.min(gold, 6)).fill("gold"),
    ...Array(Math.min(graphite, 6)).fill("graphite"),
  ].slice(0, 8)

  const chipH = 8 // px per chip height
  const chipW = 26 // px chip diameter
  const overlap = 5 // px vertical overlap
  const stackH = chips.length * (chipH - overlap) + overlap + 4

  return (
    <div className="flex flex-col items-center gap-0.5">
      {/* Chip pile */}
      <div className="relative" style={{ width: chipW, height: stackH }}>
        {chips.map((kind, i) => {
          const c = CHIP_STYLE[kind]
          const bottom = i * (chipH - overlap)
          return (
            <div
              key={i}
              className="absolute left-0 right-0 rounded-full"
              style={{
                height: chipH,
                bottom,
                backgroundColor: c.base,
                // Edge ticks: short vertical stripes around the visible rim
                backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 4px, ${c.tick} 4px, ${c.tick} 6px, transparent 6px, transparent 10px), linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 45%)`,
                border: `1px solid ${c.border}`,
                boxShadow: "0 1px 2px rgba(0,0,0,0.7)",
              }}
            />
          )
        })}
      </div>

      {/* Amount label */}
      {label && (
        <span className="text-[10px] font-mono text-[#d9b65f] font-bold leading-none">
          ${amount}
        </span>
      )}
    </div>
  )
}
