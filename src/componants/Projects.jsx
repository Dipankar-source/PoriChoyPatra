import { ArrowUpRight, Github, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";
import assets from "../assets/assets";
import PageGridLines, { GridSectionHeader } from "@/components/PageGridLines";


const projects = [
  {
    id: "trust_io",
    title: "Trust-io",
    summary: "A smart platform for making confident purchase decisions.",
    description:
      "Helps users evaluate products and make informed decisions before purchasing.",
    tech: ["React", "Framer Motion", "Tailwind CSS"],
    github: "https://github.com/Dipankar-source/",
    demo: "https://trust-io-frontend.onrender.com/",
    status: "Live",
    image: assets.Trustio,
    highlight: "1000+ active users",
    gradient: "linear-gradient(135deg, #dff5ff 0%, #7dd3fc 48%, #0284c7 100%)",
  },

  {
    id: "ish-trip",
    title: "IshTrip",
    summary: "An online bus booking platform for convenient travel planning.",
    description:
      "Enables users to search for bus routes and book journeys through a simple and accessible interface.",
    tech: ["React", "Tailwind CSS", "MongoDB"],
    github: "https://github.com/Dipankar-source/CareerNexus",
    demo: "https://career-nexus-demo.vercel.app",
    status: "Suspended",
    image: assets.careerNexusFullDetail,
    gradient: "linear-gradient(135deg, #f0ffe3 0%, #a3e635 52%, #65a30d 100%)",
  },

  {
    id: "ishani-ui",
    title: "Ishani-UI",
    summary: "A reusable React component library for modern interfaces.",
    description:
      "A collection of reusable UI components designed to help developers build consistent and polished React interfaces faster.",
    tech: ["React", "NPM", "Tailwind CSS"],
    github: "https://github.com/Dipankar-source/ishani-ui",
    demo: "https://www.npmjs.com/package/ishani-ui",
    status: "Live",
    image: assets.NPMContribution,
    gradient: "linear-gradient(135deg, #fff0f3 0%, #fb7185 52%, #e11d48 100%)",
  },

  {
    id: "ishi-fy",
    title: "IshiFy",
    summary: "An AI-powered tool for creating presentations faster.",
    description:
      "Uses AI to simplify the presentation creation process, helping users generate and organize PPT content with less manual effort.",
    tech: ["React", "Firebase", "Gemini API"],
    github: "https://github.com/Dipankar-source/Student-HelpDesk-ChatBot",
    demo: "https://student-helpdesk-chatbot-0do3.onrender.com/dashboard",
    status: "Suspended",
    image: assets.BranuBot,
    gradient: "linear-gradient(135deg, #fff1e6 0%, #fb923c 52%, #ea580c 100%)",
  },
];

const ProjectCard = ({ project, index }) => (
  <article
    className={`group/project relative min-w-0 border-b border-dashed border-neutral-300/70 px-4 py-5 transition-[transform,box-shadow,background-color] duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)] dark:border-neutral-800 dark:hover:bg-neutral-900/80 sm:px-0 ${
      index % 2 === 0 ? "sm:border-r sm:pl-4 sm:pr-6" : "sm:pl-6 sm:pr-4"
    }`}
  >
    <a
      href={project.demo}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${project.title} live demo`}
      className="group/image relative isolate block aspect-[1.55] overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover/project:opacity-100"
        style={{ backgroundImage: project.gradient }}
      />
      <img
        src={project.image}
        alt={`${project.title} project preview`}
        loading="lazy"
        className="absolute left-[10%] top-[18%] h-[82%] w-[90%] rounded-tl-md border-l border-t border-white/80 bg-white object-cover object-top shadow-lg shadow-black/15 grayscale brightness-[0.78] transition-[filter,transform] duration-500 ease-out group-hover/project:-translate-y-1 group-hover/project:translate-x-1 group-hover/project:scale-[1.04] group-hover/project:grayscale-0 group-hover/project:brightness-100"
      />
      {project.highlight && (
        <span className="absolute -right-12 top-16 z-10 flex w-60 rotate-45 items-center justify-center gap-2 bg-[#ffd43b] px-3 py-2 text-[13px] font-semibold leading-none text-neutral-950 shadow-md ring-1 ring-black/10">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full bg-emerald-600"
          />
          {project.highlight}
        </span>
      )}
    </a>

    <div className="mt-3 flex items-center justify-between gap-3">
      <h3 className="min-w-0 truncate text-[20px] font-semibold leading-tight text-neutral-950 dark:text-neutral-50">
        {project.title}
      </h3>
      <span
        className={`flex shrink-0 items-center gap-1.5 text-sm ${
          project.status === "Live"
            ? "text-neutral-500 dark:text-neutral-400"
            : "text-amber-700 dark:text-amber-400"
        }`}
      >
        <span
          aria-hidden="true"
          className={`size-2 rounded-full ${
            project.status === "Live" ? "bg-emerald-500" : "bg-amber-500"
          }`}
        />
        {project.status}
      </span>
    </div>

    <p className="mt-1 text-sm leading-snug text-neutral-500 dark:text-neutral-400">
      {project.summary}
    </p>
    <p className="mt-3 min-h-[3.5em] text-[15px] leading-normal text-neutral-600 dark:text-neutral-400">
      {project.description}
    </p>

    <div className="mt-4 flex items-center justify-between gap-3">
      <div className="flex min-w-0 flex-wrap gap-1.5">
        {project.tech.map((technology) => (
          <span
            key={technology}
            className="whitespace-nowrap rounded-sm border border-neutral-200 px-2 py-1 text-xs text-neutral-700 dark:border-neutral-800 dark:text-neutral-300"
          >
            {technology}
          </span>
        ))}
      </div>
      <div className="flex shrink-0 items-center gap-3 text-neutral-500 dark:text-neutral-400">
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} website`}
          title="Open website"
          className="transition-colors hover:text-neutral-950 dark:hover:text-white"
        >
          <Globe2 className="size-5" aria-hidden="true" />
        </a>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} GitHub repository`}
          title="Open GitHub repository"
          className="transition-colors hover:text-neutral-950 dark:hover:text-white"
        >
          <Github className="size-5" aria-hidden="true" />
        </a>
      </div>
    </div>
  </article>
);

const Projects = () => (
  <section className="w-full bg-[#F7F7F4] text-black dark:bg-[#0F0F0F] dark:text-white mb-7">
    <PageGridLines section sectionOffset={27} />

    <GridSectionHeader className="flex items-center justify-between px-2 py-2 sm:px-4">
      <div className="flex items-center justify-between mt-8">
        <h2 className="aktura-font tracking-wider  text-[28px] leading-tight text-neutral-950 dark:text-neutral-50">
          Projects
        </h2>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
        >
          View all
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </GridSectionHeader>

    <div className="grid grid-cols-1 px-1 sm:grid-cols-2">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  </section>
);

export default Projects;
