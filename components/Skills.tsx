import FadeIn from "./FadeIn";

const groups = [
  {
    label: "Languages",
    skills: ["Python", "TypeScript", "JavaScript", "C++", "SQL", "Java", "HTML/CSS"],
  },
  {
    label: "Frameworks",
    skills: ["React", "Next.js", "FastAPI", "Flask", "Django", "Node.js"],
  },
  {
    label: "Tools",
    skills: ["Git", "Google Cloud", "VS Code", "Vercel", "Jupyter", "Anaconda"],
  },
  {
    label: "Libraries & ML",
    skills: ["PyTorch", "TensorFlow", "scikit-learn", "NumPy", "pandas", "Matplotlib"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl font-bold mb-12">Skills</h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {groups.map((group, i) => (
            <FadeIn key={group.label} delay={i * 0.08}>
              <p className="text-xs font-mono text-[#525252] uppercase tracking-wider mb-3">{group.label}</p>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span key={skill} className="font-mono text-xs px-2 py-1 border border-[#262626] text-[#a3a3a3] bg-[#141414]">
                    {skill}
                  </span>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
