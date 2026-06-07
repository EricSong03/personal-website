import FadeIn from "./FadeIn";

interface Project {
  title: string;
  status: "Active" | "Shipped";
  description: string;
  bullets: string[];
  tags: string[];
  github?: string;
  demo?: string;
}

const featured: Project[] = [
  {
    title: "Analytical Poker Playing Platform",
    status: "Active",
    description: "Full-stack poker platform with real-time multiplayer, GTO-based leak detection, and an integrated solver for strategy study.",
    bullets: [
      "Automated leak detection analyzes VPIP, PFR, aggression factor, and positional statistics against GTO benchmarks",
      "Real-time multiplayer gameplay built on WebSockets with Redis pub/sub",
      "Integrated solver for hands-on strategy analysis — quantifies deviations from optimal play across positions",
    ],
    tags: ["Python", "TypeScript", "FastAPI", "React", "Redis", "Vite"],
  },
  {
    title: "CheetCode — Agentic Interview Trainer",
    status: "Shipped",
    description: "Real-time AI coding interviewer that watches you code, listens to your reasoning, gives strategic hints, and produces detailed feedback.",
    bullets: [
      "Multi-agent architecture via Keywords AI for prompt versioning and model routing — no redeployment needed to A/B test interviewer personalities",
      "Safe code execution in isolated Docker containers via Piston API (3s timeout, memory limits, no network access)",
      "Two interview modes (Strict / Supportive) with full telemetry: token count, latency, model, cost per call",
    ],
    tags: ["Python", "React", "Flask", "Keywords AI", "Piston API", "Web Speech API", "Vercel"],
    demo: "#",
  },
];

const other: Project[] = [];

function Tag({ label }: { label: string }) {
  return (
    <span className="font-mono text-xs px-2 py-1 border border-[#262626] text-[#525252]">
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: "Active" | "Shipped" }) {
  return (
    <span className={`font-mono text-xs px-2 py-0.5 border ${status === "Active" ? "border-[#f0b429] text-[#f0b429]" : "border-[#262626] text-[#a3a3a3]"}`}>
      {status}
    </span>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl font-bold mb-12">Projects</h2>
        </FadeIn>
        <div className="space-y-6">
          {featured.map((project, i) => (
            <FadeIn key={project.title} delay={i * 0.1}>
              <div className="bg-[#141414] border border-[#262626] hover:border-[#404040] hover:shadow-[0_0_40px_#f0b42910] transition-all duration-200 p-8 md:p-10">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-2xl font-bold pr-4">{project.title}</h3>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-[#a3a3a3] mb-6">{project.description}</p>
                <ul className="space-y-3 mb-6">
                  {project.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-[#a3a3a3]">
                      <span className="text-[#525252] mt-0.5 shrink-0">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((t) => <Tag key={t} label={t} />)}
                </div>
                <div className="flex gap-4">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-sm text-[#a3a3a3] hover:text-white transition-colors duration-150 underline underline-offset-4">
                      GitHub
                    </a>
                  )}
                  {project.demo && project.demo !== "#" && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-sm text-[#f0b429] hover:text-[#c8962a] transition-colors duration-150 underline underline-offset-4">
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {other.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {other.map((project, i) => (
              <FadeIn key={project.title} delay={i * 0.08}>
                <div className="bg-[#141414] border border-[#262626] hover:border-[#404040] transition-colors duration-200 p-6 h-full">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="text-sm text-[#a3a3a3] mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((t) => <Tag key={t} label={t} />)}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
