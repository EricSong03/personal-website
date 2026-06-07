import FadeIn from "./FadeIn";
import Counter from "./Counter";

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl font-bold mb-12">Experience</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nokia */}
          <FadeIn delay={0.08}>
            <div className="bg-[#141414] border border-[#262626] hover:border-[#404040] transition-colors duration-200 p-6 h-full">
              <div className="flex items-start justify-between mb-1">
                <p className="text-xs font-mono text-[#525252] uppercase tracking-wider">Jun – Aug 2024</p>
                <span className="text-xs font-mono text-[#a3a3a3] border border-[#262626] px-2 py-0.5">Ottawa, Canada</span>
              </div>
              <h3 className="text-lg font-semibold mt-3">Nokia Corporation</h3>
              <p className="text-[#f0b429] text-sm mb-4">Software Engineer Intern</p>
              <ul className="space-y-3 text-sm text-[#a3a3a3]">
                <li className="flex gap-2">
                  <span className="text-[#525252] mt-0.5">▸</span>
                  <span>Improved anomaly detection accuracy by <span className="text-white font-medium"><Counter target={11} suffix="%" /></span> in 5G network infrastructure using Isolation Forest and RNN algorithms</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#525252] mt-0.5">▸</span>
                  <span>Reduced Cloud Mobile Gateway downtime by <span className="text-white font-medium"><Counter target={100} suffix=" hrs/month" /></span> by eliminating infrastructure inefficiencies</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#525252] mt-0.5">▸</span>
                  <span>Designed data sorting algorithms to process raw CMG data for internal engineering teams</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-2 mt-5">
                {["Python", "ML", "5G", "Isolation Forest", "RNN"].map((tag) => (
                  <span key={tag} className="font-mono text-xs px-2 py-1 border border-[#262626] text-[#525252]">{tag}</span>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Guelph */}
          <FadeIn delay={0.16}>
            <div className="bg-[#141414] border border-[#262626] hover:border-[#404040] transition-colors duration-200 p-6 h-full">
              <div className="flex items-start justify-between mb-1">
                <p className="text-xs font-mono text-[#525252] uppercase tracking-wider">Jun – Aug 2024</p>
                <span className="text-xs font-mono text-[#a3a3a3] border border-[#262626] px-2 py-0.5">Guelph, Canada</span>
              </div>
              <h3 className="text-lg font-semibold mt-3">University of Guelph</h3>
              <p className="text-[#f0b429] text-sm mb-4">IoT Researcher</p>
              <ul className="space-y-3 text-sm text-[#a3a3a3]">
                <li className="flex gap-2">
                  <span className="text-[#525252] mt-0.5">▸</span>
                  <span>Built a smart home IoT testbed with 24+ Zigbee/IP devices, collecting 50+ days of network traffic via Wireshark, Killerbee, and ApiMote v4</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#525252] mt-0.5">▸</span>
                  <span>Published IEEE Dataport dataset: <span className="text-white font-medium"><Counter target={2500} suffix="+" /></span> views and <span className="text-white font-medium"><Counter target={400} suffix="+" /></span> downloads</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-2 mt-5">
                {["IoT", "Wireshark", "Zigbee", "Network Security", "IEEE"].map((tag) => (
                  <span key={tag} className="font-mono text-xs px-2 py-1 border border-[#262626] text-[#525252]">{tag}</span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
