import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Awards from "@/components/Awards";
import Leadership from "@/components/Leadership";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <Hero />
        <div className="border-t border-[#262626]">
          <About />
        </div>
        <div className="border-t border-[#262626]">
          <Experience />
        </div>
        <div className="border-t border-[#262626]">
          <Projects />
        </div>
        <div className="border-t border-[#262626]">
          <Skills />
        </div>
        <div className="border-t border-[#262626]">
          <Awards />
        </div>
        <div className="border-t border-[#262626]">
          <Leadership />
        </div>
        <div className="border-t border-[#262626]">
          <Contact />
        </div>
      </main>
    </>
  );
}
