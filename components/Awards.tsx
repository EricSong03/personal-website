import FadeIn from "./FadeIn";

const math = [
  { title: "UWaterloo Euclid Mathematics Contest", detail: "Top 1% of 24,000 students — Honor Roll" },
  { title: "Canadian Senior Mathematics Contest", detail: "Top 1% of 15,000 students — Honor Roll" },
  { title: "AIME", detail: "Qualified twice · Scored top 25%" },
  { title: "AMC 12B Distinction Award", detail: "Top 5%" },
];

const poker = [
  { title: "IPA Challengers Division", detail: "2nd place — Intercollegiate Poker Association" },
];

export default function Awards() {
  return (
    <section id="awards" className="py-24 px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl font-bold mb-12">Awards</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <FadeIn delay={0.08}>
            <p className="text-xs font-mono text-[#525252] uppercase tracking-wider mb-5">Mathematics</p>
            <ul className="space-y-4">
              {math.map((a) => (
                <li key={a.title}>
                  <p className="text-white font-medium">{a.title}</p>
                  <p className="text-sm text-[#a3a3a3] mt-0.5">{a.detail}</p>
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="text-xs font-mono text-[#525252] uppercase tracking-wider mb-5">Competitive Poker</p>
            <ul className="space-y-4">
              {poker.map((a) => (
                <li key={a.title}>
                  <p className="text-white font-medium text-lg">{a.title}</p>
                  <p className="text-sm text-[#a3a3a3] mt-0.5">{a.detail}</p>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
