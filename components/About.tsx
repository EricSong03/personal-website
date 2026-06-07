import FadeIn from "./FadeIn";

export default function About() {
  return (
    <section id="about" className="py-24 px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl font-bold mb-12">About</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <FadeIn delay={0.08}>
            <p className="text-[#a3a3a3] leading-relaxed">
              Sophomore at the University of Illinois Urbana-Champaign studying Computer Science with a 4.0 GPA. My work spans full-stack development, machine learning, IoT research, and AI agent systems.
            </p>
            <p className="text-[#a3a3a3] leading-relaxed mt-4">
              I interned at Nokia in Ottawa where I improved 5G anomaly detection accuracy by 11% and reduced Cloud Mobile Gateway downtime by 100 hours/month. Concurrently, I did IoT research at the University of Guelph, publishing an IEEE Dataport dataset on smart home network traffic with 2,500+ views and 400+ downloads.
            </p>
            <p className="text-[#a3a3a3] leading-relaxed mt-4">
              I have a strong mathematics background — top 1% in multiple national and international competitions — which informs how I approach algorithmic thinking and system design.
            </p>
          </FadeIn>
          <FadeIn delay={0.16}>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-mono text-[#525252] uppercase tracking-wider mb-1">Education</p>
                <p className="text-white font-medium">University of Illinois Urbana-Champaign</p>
                <p className="text-[#a3a3a3] text-sm">B.S. Computer Science · GPA 4.0</p>
              </div>
              <div>
                <p className="text-xs font-mono text-[#525252] uppercase tracking-wider mb-1">Location</p>
                <p className="text-[#a3a3a3] text-sm">Champaign-Urbana, Illinois</p>
              </div>
              <div>
                <p className="text-xs font-mono text-[#525252] uppercase tracking-wider mb-1">Contact</p>
                <a href="mailto:ericyousong@gmail.com" className="text-[#a3a3a3] text-sm hover:text-[#f0b429] transition-colors duration-150">
                  ericyousong@gmail.com
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
