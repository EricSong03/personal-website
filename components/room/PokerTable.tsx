import { ReactNode } from "react"

export default function PokerTable({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center"
      style={{
        borderRadius: "50%",
        backgroundColor: "#1a2e1a",
        border: "12px solid #c8962a",
        boxShadow: "0 0 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.3)",
      }}
    >
      {children}
    </div>
  )
}
