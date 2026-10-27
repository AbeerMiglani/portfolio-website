import { Footer } from "@/components/Footer";
import { Intro } from "@/components/Intro";
import { ProjectEndpoint } from "@/components/ProjectEndpoint";
import { About, Console, Contact, Experience, ProjectsIndex, Skills } from "@/components/Sections";
import { Sidebar } from "@/components/Sidebar";
import { projects } from "@/content/projects";

// Laid out like API documentation: a sidebar of endpoints, and a main column
// where every section is one endpoint (prose left, code right on wide screens).
export default function Home() {
  return (
    <div className="mx-auto max-w-[96rem] lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <Sidebar />
      <div className="min-w-0">
        <main>
          <Intro />
          <ProjectsIndex />
          {projects.map((project) => (
            <ProjectEndpoint key={project.slug} project={project} />
          ))}
          <Experience />
          <Skills />
          <About />
          <Console />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
