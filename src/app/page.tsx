import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { Pixel, SectionHeader } from "@/components/SectionHeader";
import { About, Contact, Experience } from "@/components/Sections";
import { Terminal } from "@/components/Terminal";
import { TopBar } from "@/components/TopBar";
import { projects } from "@/content/projects";

export default function Home() {
  const [featured, ...rest] = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

  return (
    <>
      <TopBar />
      <main>
        <Hero />

        <section className="border-y border-divider bg-surface/60">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[2fr_3fr]">
            <div>
              <p className="eyebrow">Try it</p>
              <h2 id="terminal" className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Prefer the <Pixel>command line?</Pixel>
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-muted">
                Everything on this page, one command away. Start with{" "}
                <code className="rounded bg-chip px-1.5 py-0.5 font-mono text-sm text-fg">help</code>, or
                try{" "}
                <code className="rounded bg-chip px-1.5 py-0.5 font-mono text-sm text-fg">set</code> and{" "}
                <code className="rounded bg-chip px-1.5 py-0.5 font-mono text-sm text-fg">get</code> for a
                tiny Redis running in your browser.
              </p>
            </div>
            <Terminal />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeader id="projects" eyebrow="Selected work">
            Things I&apos;ve <Pixel>built.</Pixel>
          </SectionHeader>
          <div className="grid gap-4">
            <ProjectCard project={featured} />
            <div className="grid gap-4 md:grid-cols-2">
              {rest.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>

        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
