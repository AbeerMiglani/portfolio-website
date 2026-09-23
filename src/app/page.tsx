import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import { About, Contact, Earlier } from "@/components/Sections";
import { TopBar } from "@/components/TopBar";
import { projects } from "@/content/projects";

export default function Home() {
  const [featured, ...rest] = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

  return (
    <>
      <TopBar />
      <main>
        <Hero />

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeader id="projects" command="ls ~/projects">
            Projects
          </SectionHeader>
          <div className="grid grid-cols-1 gap-4">
            <ProjectCard project={featured} />
            {rest.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          <Earlier />
        </section>

        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
