import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Globe, Github, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/componants/Navbar";
import Footer from "@/componants/Footer";
import assets from "@/assets/assets";
import { AdGridSection } from "@/components/PageFrame";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */
const PROJECTS = [
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

/* ------------------------------------------------------------------ */
/* Grid primitives                                                     */
/* ------------------------------------------------------------------ */
const DASH = "border-dashed border-neutral-300/80 dark:border-neutral-800";

/**
 * Horizontal dashed line that runs edge-to-edge of the screen but is
 * anchored to the CENTER of the 840px column, so it can never drift.
 * The page root has overflow-x-hidden so it never causes a scrollbar.
 */
const HLine = ({ className = "" }) => (
  <span
    aria-hidden="true"
    className={`pointer-events-none absolute left-1/2 w-screen -translate-x-1/2 border-t ${DASH} ${className}`}
  />
);

/** Two stacked full-width dashed lines. */
const DoubleRule = () => (
  <div aria-hidden="true" className="relative h-6">
    <HLine className="top-0" />
    <HLine className="bottom-0" />
  </div>
);

const chip =
  "rounded-md bg-neutral-200/70 px-3 py-1.5 text-sm text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100";

/** Diagonal corner banner (top-right), like the "600+ active users" tag. */
const Ribbon = ({ text }) => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute -right-12 top-7 flex w-52 rotate-45 items-center justify-center gap-1.5 bg-yellow-300 py-1 text-[11px] font-semibold text-black shadow-sm"
  >
    <span className="size-1.5 rounded-full bg-emerald-500" />
    {text}
  </span>
);

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */
const ProjectCard = ({ project, onOpen }) => (
  <article className={`group flex min-w-0 flex-col border ${DASH} p-3 sm:p-4`}>
    <a
      href={project.demo}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${project.title} live demo`}
      style={{ backgroundImage: project.gradient }}
      className="relative block aspect-[1.48] overflow-hidden rounded-xl"
    >
      {/* Screenshot: inset from the left/top, bleeds off the right/bottom */}
      <img
        src={project.image}
        alt={`${project.title} preview`}
        loading="lazy"
        className="absolute bottom-0 right-0 h-[79%] w-[91%] rounded-tl-xl object-cover object-left-top shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition duration-500 ease-out group-hover:scale-[1.03] group-hover:origin-bottom-right"
      />
      {project.banner && <Ribbon text={project.banner} />}
    </a>

    <div className="mt-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="truncate text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="text-left hover:underline hover:underline-offset-4"
          >
            {project.title}
          </button>
        </h2>
        <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-300">
          {project.tagline}
        </p>
      </div>
      <span className="mt-2 inline-flex shrink-0 items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
        <span className="size-2 rounded-full bg-emerald-500" />
        Live
      </span>
    </div>

    <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400">
      {project.description}
    </p>

    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
      <ul className="flex flex-wrap gap-2">
        {project.tech.slice(0, 3).map((tech) => (
          <li key={tech} className={chip}>
            {tech}
          </li>
        ))}
      </ul>
      <div className="flex shrink-0 items-center gap-4 pb-1.5 text-neutral-500 dark:text-neutral-400">
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} live demo`}
          className="transition-colors hover:text-neutral-950 dark:hover:text-white"
        >
          <Globe className="size-5" aria-hidden="true" />
        </a>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} source code`}
          className="transition-colors hover:text-neutral-950 dark:hover:text-white"
        >
          <Github className="size-5" aria-hidden="true" />
        </a>
      </div>
    </div>
  </article>
);

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */
const iconBtn =
  "inline-flex size-9 shrink-0 items-center justify-center border border-neutral-300 text-neutral-500 hover:text-neutral-950 dark:border-neutral-700 dark:hover:text-white";

const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    if (!project) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-md"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto border border-neutral-300 bg-[#F7F7F4] p-5 shadow-2xl dark:border-neutral-800 dark:bg-[#111111] sm:p-7"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className={`absolute right-4 top-4 z-10 bg-[#F7F7F4] dark:bg-[#111111] ${iconBtn}`}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
            <img
              src={project.image}
              alt={`${project.title} preview`}
              className="aspect-[1.8] w-full rounded-lg object-cover object-top"
            />
            <div className="mt-6 flex items-start justify-between gap-4 border-b border-neutral-200 pb-5 dark:border-neutral-800">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                  {project.title}
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {project.tagline}
                </p>
              </div>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open live demo"
                className={iconBtn}
              >
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
            <p className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
              {project.details}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <li key={tech} className={chip}>
                  {tech}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-neutral-300 px-4 py-2.5 text-sm dark:border-neutral-700"
              >
                <Github className="size-4" aria-hidden="true" />
                View source
              </a>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-neutral-950 px-4 py-2.5 text-sm text-white dark:bg-white dark:text-neutral-950"
              >
                <Globe className="size-4" aria-hidden="true" />
                Open live demo
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
const Projects = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const rows = [];
  for (let i = 0; i < PROJECTS.length; i += 2) {
    rows.push(PROJECTS.slice(i, i + 2));
  }

  return (
    /* Root: full-width background, clips the edge-to-edge lines */
    <div className="min-h-screen overflow-x-hidden bg-[#F7F7F4] text-neutral-950 transition-colors duration-300 dark:bg-[#0F0F0F] dark:text-neutral-50">
      {/* Navbar: fixed, same strict 840px column */}
      <div className={`fixed left-1/2 top-0 z-50 w-full max-w-[840px] -translate-x-1/2 border-x ${DASH}`}>
        <Navbar />
      </div>

      {/* THE COLUMN: strict max-w-[840px] + mx-auto. Its border-x = the two vertical rails. */}
      <div
        className={`relative mx-auto flex min-h-screen w-full max-w-[840px] flex-col border-x ${DASH}`}
      >
        <main className="relative flex-1 pt-[54px]">
          {/* Back link */}
          <div className="relative px-6 pb-4 pt-5">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex display-font items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-neutral-500 transition-colors hover:text-neutral-950 dark:hover:text-white"
            >
              <ArrowLeft className="size-4 " aria-hidden="true" />
              Home
            </button>
          </div>

          <DoubleRule />

          {/* Title */}
          <header className="relative px-6 pb-5 pt-6">
            <h1 className="aktura-font tracking-wider text-[44px] leading-none tracking-tight sm:text-[56px]">
              Projects
            </h1>
            <p className="mt-2 dancing-font text-2xl text-neutral-500 dark:text-neutral-400">
              A curated showcase of my projects and designs.
            </p>
            <HLine className="bottom-0" />
          </header>

          <AdGridSection />

          {/* Rows of 2 cards; a dashed line closes each row */}
          <section aria-label="Project list">
            {rows.map((row) => (
              <div
                key={row.map((p) => p.id).join("-")}
                className="relative px-4 py-6 sm:px-6"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {row.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onOpen={setSelected}
                    />
                  ))}
                </div>
                <HLine className="bottom-0" />
              </div>
            ))}
          </section>
        </main>

        <Footer />
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Projects;
