import { ReactNode } from "react"

export default function PokerTable({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className="relative flex flex-col items-center justify-between"
        style={{
          width: "min(700px, 95vw)",
          height: "min(460px, 70vh)",
          borderRadius: "50%",
          backgroundColor: "#1a2e1a",
          border: "12px solid #c8962a",
          boxShadow: "0 0 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.3)",
          padding: "40px 60px",
        }}
      >
        {children}
      </div>
    </div>
  )
}
