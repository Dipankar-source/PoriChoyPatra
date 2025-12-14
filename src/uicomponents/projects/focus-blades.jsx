import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import assets from "@/assets/assets";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const PROJECTS = [
  {
    id: 1,
    title: "Career Nexus",
    category: "Full Stack",
    description:
      "Designed and developed a scalable MERN-based platform connecting job seekers, recruiters, and mentors.",
    image: assets.careerNexusFullDetail,
    tech: ["Node.js", "React.js", "TailwindCSS", "MongoDB", "JWT"],
    github: "https://github.com/Dipankar-source/CareerNexus",
    demo: "https://career-nexus-demo.vercel.app",
  },
  {
    id: 2,
    title: "Ishani-Ui",
    category: "Frontend",
    description:
      "An Ui Liabrary Designed on React.js for the Developers to Reuse the Components",
    image: assets.NPMContribution,
    tech: ["React", "NPM", "Tailwind"],
    github: "https://github.com/Dipankar-source/ishani-ui",
    demo: "hhttps://www.npmjs.com/package/ishani-ui",
  },
  {
    id: 3,
    title: "Brainu Bot",
    category: "Full Stack",
    description:
      "A Chat Bot Designed for Brainware University with Decent Interation and Useful Features",
    image: assets.BranuBot,
    tech: ["React", "Firebase", "Gemini-API"],
    github: "https://github.com/Dipankar-source/Student-HelpDesk-ChatBot",
    demo: "https://student-helpdesk-chatbot-0do3.onrender.com/dashboard",
  },
  {
    id: 4,
    title: "AI Portfolio",
    category: "Design",
    description:
      "A minimalist portfolio template powered by AI content generation. Featured on Awwwards.",
    image: assets.Portfolio,
    tech: ["React.js", "ishani-ui", "Aceternity.ui", "Framer", "Render"],
    github: "https://github.com/Dipankar-source/PoriChoyPatra",
    demo: "https://porichoypatra.onrender.com/",
  },
];

export function FocusBlades({ projects = PROJECTS, defaultActive = 0 }) {
  const [active, setActive] = useState(defaultActive);

  return (
    <div className="w-full py-12 bg-white dark:bg-zinc-950 transition-colors duration-500 border-l-1 border-r-1">
      <div className="max-w-4xl mx-auto px-4 mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            Projects
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Hover to expand details.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto h-[400px] flex gap-2 px-4">
        {projects.map((project, index) => (
          <Blade
            key={project.id}
            project={project}
            isActive={active === index}
            onActivate={() => setActive(index)}
          />
        ))}
      </div>
    </div>
  );
}

function Blade({ project, isActive, onActivate }) {
  const handleGithubClick = (e) => {
    e.stopPropagation();
    if (project.github) {
      window.open(project.github, "_blank", "noopener,noreferrer");
    }
  };

  const handleDemoClick = (e) => {
    e.stopPropagation();
    if (project.demo) {
      window.open(project.demo, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      layout
      onClick={onActivate}
      onMouseEnter={onActivate}
      className={cn(
        "relative h-full rounded-2xl overflow-hidden cursor-pointer transition-colors duration-500 ease-out",
        isActive
          ? "flex-[3] border border-zinc-200 dark:border-white/10 shadow-xl"
          : "flex-[1] border border-transparent dark:border-white/5 opacity-80 hover:opacity-100"
      )}
      initial={false}
      animate={{
        flex: isActive ? 3 : 1,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{
          scale: isActive ? 1.1 : 1,
          filter: isActive
            ? "grayscale(0%) brightness(100%)"
            : "grayscale(100%) brightness(50%)",
        }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          isActive
            ? "bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100"
            : "bg-black/60 opacity-100"
        )}
      />

      <div className="absolute inset-0 p-6 flex flex-col justify-end overflow-hidden">
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/70 font-bold tracking-widest uppercase text-xs [writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
              {project.category} • {project.title}
            </p>
          </div>
        )}

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="relative z-10"
            >
              <span className="inline-block px-2 py-0.5 mb-3 text-[10px] font-bold uppercase tracking-wider text-white bg-indigo-500 rounded-md shadow-sm">
                {project.category}
              </span>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-white leading-none">
                  {project.title}
                </h3>
                <div className="flex gap-2">
                  {project.github && (
                    <button
                      onClick={handleGithubClick}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white hover:text-black text-white transition-colors"
                      title="View GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </button>
                  )}
                  {project.demo && (
                    <button
                      onClick={handleDemoClick}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white hover:text-black text-white transition-colors"
                      title="View Live Demo"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-zinc-300 text-xs md:text-sm line-clamp-2 mb-4 leading-relaxed max-w-[90%]">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 text-[10px] font-medium text-zinc-300 border border-white/10 rounded bg-black/30 backdrop-blur-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
