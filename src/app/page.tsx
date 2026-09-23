import { About } from "@/components/About";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { TopBar } from "@/components/TopBar";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

export default function Home() {
  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        <Hero />

        <section className="py-16">
          <SectionHeading id="projects" command="ls projects/" label="Projects" />
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        <section className="py-16">
          <SectionHeading id="experience" command="cat experience.log" label="Experience" />
          <ExperienceTimeline roles={experience} />
          <a
            href={profile.resume}
            className="mt-10 inline-block font-mono text-sm text-accent hover:underline"
          >
            Full résumé (PDF) →
          </a>
        </section>

        <section className="py-16">
          <SectionHeading id="about" command="cat about.md" label="About" />
          <About />
        </section>
      </main>
      <Footer />
    </>
  );
}
