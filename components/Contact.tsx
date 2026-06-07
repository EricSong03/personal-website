import FadeIn from "./FadeIn";

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl font-bold mb-4">Contact</h2>
          <p className="text-[#a3a3a3] mb-12">Let&apos;s talk.</p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <div className="flex flex-col gap-4">
            <a
              href="mailto:ericyousong@gmail.com"
              className="text-2xl text-[#a3a3a3] hover:text-[#f0b429] transition-colors duration-150 w-fit"
            >
              ericyousong@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/eric-song-0b6980274"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-[#a3a3a3] hover:text-[#f0b429] transition-colors duration-150 w-fit"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://github.com/EricSong03"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-[#a3a3a3] hover:text-[#f0b429] transition-colors duration-150 w-fit"
            >
              GitHub ↗
            </a>
          </div>
        </FadeIn>
      </div>
      <div className="max-w-5xl mx-auto mt-24 pt-8 border-t border-[#262626]">
        <p className="text-xs font-mono text-[#525252]">Eric Song · {new Date().getFullYear()}</p>
      </div>
    </section>
  );
}
