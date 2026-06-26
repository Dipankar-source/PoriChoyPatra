import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineKeyboardArrowRight, MdCode } from "react-icons/md";
import { FaRegPaperPlane } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import assets from "../assets/assets";
import icons from '../assets/icons';
import { useTheme } from '../context/ThemeContext';

// ─── Data ────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: "1",
    title: "Career Nexus",
    category: "Full Stack",
    description:
      "A scalable MERN-based platform connecting job seekers, recruiters, and mentors through an integrated ecosystem with AI-powered matching.",
    tech: ["Node.js", "React.js", "TailwindCSS", "MongoDB"],
    github: "https://github.com/Dipankar-source/CareerNexus",
    demo: "https://career-nexus-demo.vercel.app",
    image: assets.careerNexusFullDetail,
  },
  {
    id: "2",
    title: "Ishani-UI",
    category: "Frontend / NPM",
    description:
      "A React component library published on NPM, designed for developers to drop in and reuse polished UI primitives with zero friction.",
    tech: ["React", "NPM", "Tailwind"],
    github: "https://github.com/Dipankar-source/ishani-ui",
    demo: "https://www.npmjs.com/package/ishani-ui",
    image: assets.NPMContribution,
  },
  {
    id: "3",
    title: "Brainu Bot",
    category: "Full Stack",
    description:
      "A helpdesk chatbot built for Brainware University students, powered by Gemini API with Firebase backend and a clean conversational UI.",
    tech: ["React", "Firebase", "Gemini API"],
    github: "https://github.com/Dipankar-source/Student-HelpDesk-ChatBot",
    demo: "https://student-helpdesk-chatbot-0do3.onrender.com/dashboard",
    image: assets.BranuBot,
  },
  {
    id: "4",
    title: "AI Portfolio",
    category: "Design / Frontend",
    description:
      "A minimalist developer portfolio with smooth motion design, custom cursor interactions, and AI-assisted content generation.",
    tech: ["React.js", "ishani-ui", "Aceternity.ui", "Framer Motion"],
    github: "https://github.com/Dipankar-source/PoriChoyPatra",
    demo: "https://porichoypatra.onrender.com/",
    image: assets.Portfolio,
  },
];

// ─── Tech chip ────────────────────────────────────────────────────────────────

const getIconForTech = (techName) => {
  const normalizedMap = {
    "node.js": icons.NodeJSIcon,
    "react.js": icons.ReactIcon,
    "react": icons.ReactIcon,
    "tailwindcss": icons.TailwindIcon,
    "tailwind": icons.TailwindIcon,
    "mongodb": icons.MongoDBIcon,
    "firebase": icons.FirebaseIcon,
    "aceternity.ui": icons.AceternityUIIcon,
    "framer motion": icons.FramerMotionIcon,
    "next.js": icons.NextJSIcon,
    "express": icons.ExpressIcon,
    "npm": icons.NPMIcon,
    "claude": icons.ClaudeIcon,
    "antigravity": icons.AntigravityIcon,
    "openai": icons.OpenAIIcon,
    "gemini api": icons.GeminiIcon,
  };

  const Icon = normalizedMap[techName.toLowerCase()];
  if (Icon) return Icon;

  // Fallback icon
  return ({ isDark }) => <MdCode size={26} color={isDark ? '#fff' : '#000'} />;
};

const TechChip = ({ name }) => {
  const { isDark } = useTheme();
  const IconComponent = getIconForTech(name);

  return (
    <div
      title={name}
      className="flex items-center justify-center transition-transform duration-200 hover:scale-110 cursor-pointer p-0.5"
    >
      <div className="scale-[0.85] sm:scale-80">
        <IconComponent isDark={isDark} />
      </div>
    </div>
  );
};

// ─── Single project row ───────────────────────────────────────────────────────

const ProjectItem = ({ project, isOpen, isAnyOpen, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);

  // When another item is open: blur + dim this one
  const shouldDim = isAnyOpen && !isOpen;

  return (
    <motion.div
      className="relative flex flex-col w-full rounded-md cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onToggle}
      animate={{
        filter: shouldDim ? "blur(1.5px)" : "blur(0px)",
        opacity: shouldDim ? 0.38 : 1,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* ── Row header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 group">

        {/* Left: title + category */}
        <div className="sm:w-1/2 flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full">
            <div className="flex items-center gap-3">
              <span
                className="font-semibold text-gray-700 dark:text-white/95 leading-snug tracking-tight"
                style={{ fontSize: "clamp(15px, 2.6vw, 18px)" }}
              >
                {project.title}
              </span>

              {/* GitHub (Desktop) */}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className={`hidden sm:flex group/gh items-center flex-shrink-0 transition-opacity duration-200 ${isOpen || isHovered ? "opacity-100" : "opacity-0"}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaGithub
                    size={16}
                    className="text-gray-500 dark:text-gray-400 group-hover/gh:text-gray-900 dark:group-hover/gh:text-white transition-colors"
                  />
                  <span className="overflow-hidden max-w-0 opacity-0 group-hover/gh:max-w-[50px] group-hover/gh:opacity-100 group-hover/gh:ml-1.5 transition-all duration-200 text-[12px] font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    GitHub
                  </span>
                </a>
              )}

              {/* Live (Desktop) */}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Live demo"
                  className={`hidden sm:flex group/live items-center flex-shrink-0 transition-opacity duration-200 ${isOpen || isHovered ? "opacity-100" : "opacity-0"}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaRegPaperPlane
                    size={14}
                    className="text-gray-500 dark:text-gray-400 group-hover/live:text-gray-900 dark:group-hover/live:text-white transition-colors"
                  />
                  <span className="overflow-hidden max-w-0 opacity-0 group-hover/live:max-w-[40px] group-hover/live:opacity-100 group-hover/live:ml-1.5 transition-all duration-200 text-[12px] font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    Live
                  </span>
                </a>
              )}
            </div>

            {/* Chevron */}
            <motion.span
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className={`flex-shrink-0 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-100 sm:opacity-0 group-hover:opacity-100"}`}
            >
              <MdOutlineKeyboardArrowRight
                size={22}
                className="text-gray-500 dark:text-gray-400"
              />
            </motion.span>
          </div>

          <p
            className="font-medium text-gray-400 dark:text-gray-500 leading-snug"
            style={{ fontSize: "clamp(10px, 1.4vw, 12px)" }}
          >
            {project.category}
          </p>
        </div>

        {/* Right: thumbnail on hover (collapsed state only) */}
        <div className="hidden sm:grid sm:w-1/2 items-center justify-items-end min-h-[64px]">
          {/* Tech chips preview — hidden when image thumbnail is showing */}
          <AnimatePresence>
            {!isHovered && !isOpen && (
              <motion.div
                key="chips"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="col-start-1 row-start-1 flex flex-wrap gap-1.5 justify-end"
              >
                {project.tech.map((t) => (
                  <TechChip key={t} name={t} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hover thumbnail — only shows when collapsed + hovered */}
          <AnimatePresence>
            {isHovered && !isOpen && (
              <motion.div
                key="thumb"
                initial={{ opacity: 0, scale: 0.92, x: 12 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.92, x: 12 }}
                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="col-start-1 row-start-1 relative flex-shrink-0 w-28 h-16 rounded-lg overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-700"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-top"
                />
                {/* subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Expanded body ── */}
      <motion.div
        initial={false}
        animate={
          isOpen
            ? { height: "auto", opacity: 1, marginTop: 8 }
            : { height: 0, opacity: 0, marginTop: 0 }
        }
        transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ overflow: "hidden" }}
      >
        <div className="pb-4">
          {/* Image + text side by side */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.3, delay: 0.08 }}
              className="flex-shrink-0 w-full sm:w-44 h-28 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-md"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-top"
              />
            </motion.div>

            {/* Description + full tech */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.3, delay: 0.12 }}
              className="flex flex-col justify-between gap-3"
            >
              <p
                className="text-gray-600 dark:text-gray-300 leading-relaxed"
                style={{ fontSize: "clamp(12px, 1.9vw, 13.5px)" }}
              >
                {project.description}
              </p>

              {/* Mobile GitHub & Live Links */}
              <div className="flex sm:hidden flex-wrap gap-4 mt-1">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <FaGithub size={16} /> GitHub
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <FaRegPaperPlane size={14} /> Live Demo
                  </a>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <TechChip key={t} name={t} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Hairline divider */}
      <div className={`w-full h-px bg-neutral-100 dark:bg-neutral-800 hidden ${isOpen ? "block" : "hidden"}`} />
    </motion.div>
  );
};

// ─── Section ──────────────────────────────────────────────────────────────────

const Projects = () => {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="w-full bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">

      <p
        className="ml-4 mt-4 font-medium text-gray-900 dark:text-white mb-2 pr-4 leading-tight tracking-tight"
        style={{ fontSize: "clamp(18px, 4vw, 24px)" }}
      >
        Projects
      </p>

      <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100 mt-5 font-sans">
        <div className="px-4 flex flex-col">
          {PROJECTS.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              isOpen={openId === project.id}
              isAnyOpen={openId !== null}
              onToggle={() => setOpenId(openId === project.id ? null : project.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;