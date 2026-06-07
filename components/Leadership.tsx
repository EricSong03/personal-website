import FadeIn from "./FadeIn";

export default function Leadership() {
  return (
    <section id="leadership" className="py-24 px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl font-bold mb-12">Leadership</h2>
        </FadeIn>
        <FadeIn delay={0.08}>
          <div className="bg-[#141414] border border-[#262626] hover:border-[#404040] transition-colors duration-200 p-8">
            <div className="flex items-start justify-between mb-1">
              <p className="text-xs font-mono text-[#525252] uppercase tracking-wider">UIUC</p>
            </div>
            <h3 className="text-xl font-semibold mt-3">GTOIllini Poker Club</h3>
            <p className="text-[#f0b429] text-sm mb-4">Executive Secretary</p>
            <p className="text-[#a3a3a3] text-sm mb-5">
              UIUC&apos;s competitive poker club focused on Game Theory Optimal strategy. As Executive Secretary, I lead sponsorship strategy targeting quantitative finance firms in Chicago — building tiered packages (Joker / Ace / King / Queen tiers) based on the talent overlap between GTO poker and quant trading — alongside club operations, communications, and member materials.
            </p>
            <p className="text-sm text-[#a3a3a3]">
              This role demonstrates: leadership, organizational communication, strategic thinking, and the ability to pitch to professional audiences.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
