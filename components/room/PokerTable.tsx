import { ReactNode } from "react"

// Low-opacity fractal noise so the felt reads as fabric, not flat paint.
const FELT_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"

export default function PokerTable({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative w-full h-full"
      style={{
        borderRadius: "50%",
        // Leather rail: dark brown, lit from above
        background: "linear-gradient(180deg, #2a1d14 0%, #1c1209 55%, #140d09 100%)",
        padding: 9,
        boxShadow:
          "0 30px 80px rgba(0,0,0,0.85), 0 4px 18px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Brass hairline between rail and felt */}
      <div
        className="relative w-full h-full"
        style={{
          borderRadius: "50%",
          padding: 1,
          background: "linear-gradient(180deg, rgba(217,182,95,0.35), rgba(138,116,55,0.12))",
        }}
      >
        {/* Felt: near-black with a soft overhead spotlight */}
        <div
          className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
          style={{
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse 70% 60% at 50% 38%, #18231b 0%, #101711 55%, #0a0f0b 100%)",
            boxShadow: "inset 0 0 70px rgba(0,0,0,0.65), inset 0 2px 12px rgba(0,0,0,0.5)",
          }}
        >
          {/* Felt grain */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ borderRadius: "50%", backgroundImage: FELT_NOISE, opacity: 0.045 }}
          />
          {/* Betting line */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "9%",
              borderRadius: "50%",
              border: "1px solid rgba(217,182,95,0.09)",
            }}
          />
          {children}
        </div>
      </div>
    </div>
  )
}
