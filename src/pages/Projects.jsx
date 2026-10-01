import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { ArrowUpRight, Github, ExternalLink, Search } from "lucide-react";
import CustomMouseFollower from "@/componants/CustomMouseFollower";
import Navbar from "@/componants/Navbar";
import assets from "@/assets/assets";
import Footer from "@/componants/Footer";
import PremiumSort from "@/uicomponents/dropdown/premium-sort";

const PROJECTS = [
  {
    id: 1,
    title: "Career Nexus",
    category: "Full Stack",
    description:
      "Designed and developed a scalable MERN-based platform connecting job seekers, recruiters, and mentors.",
    longDescription:
      "A comprehensive AI-powered professional networking platform that bridges the gap between education and career opportunities. Features real-time job matching, mentor connections, and a collaborative community space.",
    image: assets.careerNexusFullDetail,
    tech: ["Node.js", "React.js", "TailwindCSS", "MongoDB", "JWT", "AI/ML"],
    github: "https://github.com/Dipankar-source/CareerNexus",
    demo: "https://career-nexus-demo.vercel.app",
    stats: { downloads: "2.5K+", rating: "4.8", contributors: "5" },
    trailColor: "rgba(24,95,165,0.7)",
  },
  {
    id: 2,
    title: "Ishani-Ui",
    category: "Frontend",
    description:
      "A comprehensive UI library designed on React.js for developers to reuse and customize components.",
    longDescription:
      "An open-source component library providing production-ready components with excellent documentation, accessibility features, and extensive customization options.",
    image: assets.NPMContribution,
    tech: ["React", "NPM", "Tailwind", "TypeScript", "Storybook"],
    github: "https://github.com/Dipankar-source/ishani-ui",
    demo: "https://www.npmjs.com/package/ishani-ui",
    stats: { downloads: "15K+", rating: "4.9", contributors: "12" },
    trailColor: "rgba(80,180,140,0.7)",
  },
  {
    id: 3,
    title: "Brainu Bot",
    category: "Full Stack",
    description:
      "An intelligent chat bot designed for Brainware University with seamless interaction and useful features.",
    longDescription:
      "A conversational AI assistant providing real-time support to students, with NLP capabilities and integration with university systems for course information and assistance.",
    image: assets.BranuBot,
    tech: ["React", "Firebase", "Gemini-API", "Node.js", "Express"],
    github: "https://github.com/Dipankar-source/Student-HelpDesk-ChatBot",
    demo: "https://student-helpdesk-chatbot-0do3.onrender.com/dashboard",
    stats: { downloads: "1.2K+", rating: "4.7", contributors: "3" },
    trailColor: "rgba(200,100,80,0.7)",
  },
  {
    id: 4,
    title: "AI Portfolio",
    category: "Design",
    description:
      "A minimalist portfolio template powered by AI content generation and modern design patterns.",
    longDescription:
      "A sophisticated personal portfolio website showcasing modern web design principles with AI-powered content generation, smooth animations, and responsive layouts.",
    image: assets.Portfolio,
    tech: ["React.js", "ishani-ui", "Aceternity.ui", "Framer", "Render"],
    github: "https://github.com/Dipankar-source/PoriChoyPatra",
    demo: "https://porichoypatra.onrender.com/",
    stats: { downloads: "5K+", rating: "4.9", contributors: "1" },
    trailColor: "rgba(140,80,200,0.7)",
  },
];

const CATEGORIES = ["All", "Full Stack", "Frontend", "Design"];

/* ─── Tilted separator lines ─── */
const TiltedLines = ({ isDark }) => (
  <svg
    className="w-full h-full"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <defs>
      <pattern
        id="tilted"
        x="0"
        y="0"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(-45)"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="20"
          stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
          strokeWidth="1"
        />
      </pattern>
    </defs>
    <rect width="100" height="100" fill="url(#tilted)" />
  </svg>
);

/* ─── Hover Detail Panel (follows cursor) ─── */
const HoverDetailPanel = ({ project, isDark, position, visible }) => {
  const bg = isDark ? "bg-zinc-900" : "bg-white";
  const border = isDark ? "border-white/10" : "border-black/10";
  const text = isDark ? "text-white" : "text-gray-900";
  const sub = isDark ? "text-zinc-400" : "text-zinc-500";
  const techBg = isDark
    ? "bg-blue-500/20 text-blue-300 border-blue-400/20"
    : "bg-blue-100 text-blue-700 border-blue-200";

  return (
    <AnimatePresence>
      {visible && project && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            position: "fixed",
            left: position.x,
            top: position.y,
            width: 300,
            zIndex: 9999,
            pointerEvents: "none",
          }}
          className={`rounded-2xl border ${border} ${bg} overflow-hidden`}
        /* Subtle box shadow using Tailwind — no blur flicker */
        >
          {/* Image */}
          <div className="h-44 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 space-y-3">
            {/* Category badge */}
            <span
              className={`inline-block text-[10px] font-semibold tracking-widest uppercase px-2.5 py-0.5 rounded-full ${isDark
                  ? "bg-blue-500/20 text-blue-300"
                  : "bg-blue-100 text-blue-700"
                }`}
            >
              {project.category}
            </span>

            {/* Title */}
            <h3 className={`text-base font-bold leading-snug ${text}`}>
              {project.title}
            </h3>

            {/* Description */}
            <p className={`text-xs leading-relaxed ${sub}`}>
              {project.longDescription}
            </p>

            {/* Tech pills */}
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${techBg}`}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{ pointerEvents: "auto" }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-all ${isDark
                    ? "border-white/10 text-white hover:bg-white/10"
                    : "border-black/10 text-gray-800 hover:bg-black/5"
                  }`}
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-3 h-3" /> GitHub
              </a>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                style={{ pointerEvents: "auto" }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3 h-3" /> Live Demo
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─── Project Card ─── */
const ProjectCard = ({
  project,
  isDark,
  cardTitleColor,
  cardExcerptColor,
  onViewDetails,
  onHoverChange,
}) => {
  const cardRef = useRef(null);
  const rafRef = useRef(null);

  const categoryColor = isDark ? "text-blue-400" : "text-blue-600";
  const borderTopColor = isDark ? "border-white/10" : "border-zinc-200";

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // CSS custom props for the conic trail
      card.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
      card.style.setProperty("--my", `${(y / rect.height) * 100}%`);
      const angle = (Math.atan2(y - cy, x - cx) * 180) / Math.PI + 90;
      card.style.setProperty("--angle", `${angle}deg`);

      // Subtle 3-D tilt
      const tiltX = ((y - cy) / rect.height) * 7;
      const tiltY = (-(x - cx) / rect.width) * 7;
      card.style.transform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "";
    onHoverChange(null, null);
  }, [onHoverChange]);

  const handleMouseEnter = useCallback(
    (e) => {
      onHoverChange(project, e);
    },
    [project, onHoverChange],
  );

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        "--trail-color": project.trailColor,
        willChange: "transform",
        transition: "border-color 0.2s",
      }}
      className={`
        group cursor-pointer flex flex-col h-full relative
        rounded-xl border p-6
        ${isDark ? "border-white/8 bg-zinc-900/40" : "border-black/8 bg-white/70"}
        backdrop-blur-sm
        card-trail-border
      `}
    >
      {/* Conic border trail — injected via global style below */}
      <div className="card-trail-overlay" aria-hidden="true" />

      {/* Image */}
      <div className="mb-5 overflow-hidden rounded-lg h-44 bg-gradient-to-br from-zinc-900 to-black">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500 ease-out"
        />
      </div>

      {/* Category */}
      <div
        className={`text-[10px] font-semibold tracking-widest uppercase mb-2.5 ${categoryColor}`}
      >
        {project.category}
      </div>

      {/* Title & description */}
      <div className="flex-1">
        <h3
          className={`text-base md:text-lg font-semibold mb-2 ${cardTitleColor} line-clamp-2
            group-hover:text-blue-500 transition-colors duration-300`}
        >
          {project.title}
        </h3>
        <p className={`text-sm line-clamp-3 mb-4 ${cardExcerptColor}`}>
          {project.description}
        </p>
      </div>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tech.slice(0, 2).map((tech) => (
          <span
            key={tech}
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${isDark
                ? "bg-white/8 text-zinc-300 border-white/10"
                : "bg-black/5 text-zinc-700 border-black/8"
              }`}
          >
            {tech}
          </span>
        ))}
        {project.tech.length > 2 && (
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${isDark
                ? "bg-white/8 text-zinc-300 border-white/10"
                : "bg-black/5 text-zinc-700 border-black/8"
              }`}
          >
            +{project.tech.length - 2}
          </span>
        )}
      </div>

      {/* Footer */}
      <div
        className={`flex items-center justify-between pt-3 border-t ${borderTopColor}`}
      >
        <div className="flex gap-2">
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-all ${isDark
                ? "hover:bg-blue-500/20 text-zinc-400 hover:text-blue-400"
                : "hover:bg-blue-100 text-zinc-500 hover:text-blue-600"
              }`}
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </motion.a>
          <motion.a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-all ${isDark
                ? "hover:bg-blue-500/20 text-zinc-400 hover:text-blue-400"
                : "hover:bg-blue-100 text-zinc-500 hover:text-blue-600"
              }`}
            title="Live Demo"
          >
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(project);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-lg transition-all group/btn ${isDark
              ? "hover:bg-blue-500/20 text-zinc-400 hover:text-blue-400"
              : "hover:bg-blue-100 text-zinc-500 hover:text-blue-600"
            }`}
          title="View Details"
        >
          <ArrowUpRight className="w-4 h-4 group-hover/btn:rotate-45 transition-transform duration-300" />
        </motion.button>
      </div>
    </motion.article>
  );
};

/* ─── Full-screen modal with glass morphism & progressive blur ─── */
const ProjectModal = ({ project, isDark, onClose }) => {
  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-lg"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 35 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border backdrop-blur-xl ${isDark
            ? "border-white/10 bg-zinc-900/50 shadow-2xl"
            : "border-white/20 bg-white/40 shadow-2xl"
          }`}
      >
        {/* Progressive blur background layers */}
        <div
          className={`absolute inset-0 rounded-3xl -z-10 ${isDark ? "bg-zinc-950/40" : "bg-white/30"
            } blur-2xl`}
        />

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.08, backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className={`absolute top-6 right-6 z-50 p-2.5 rounded-full backdrop-blur-md transition-all ${isDark
              ? "bg-white/8 hover:bg-white/15 text-white/80 hover:text-white"
              : "bg-black/5 hover:bg-black/10 text-black/60 hover:text-black"
            }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>

        <div className="p-8 space-y-7">
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`relative rounded-2xl overflow-hidden h-72 ${isDark ? "bg-zinc-800/40" : "bg-white/40"
              } border backdrop-blur-md ${isDark ? "border-white/10" : "border-white/20"}`}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? "from-zinc-900/60 to-transparent" : "from-black/20 to-transparent"
              }`} />
          </motion.div>

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-lg backdrop-blur-md border ${isDark
                    ? "bg-white/8 text-white/80 border-white/10"
                    : "bg-black/5 text-black/70 border-white/20"
                  }`}
              >
                {project.category}
              </span>
            </div>
            <h2
              className={`text-3xl font-bold leading-tight ${isDark ? "text-white" : "text-gray-900"
                }`}
            >
              {project.title}
            </h2>
            <p
              className={`text-base leading-relaxed ${isDark ? "text-zinc-300" : "text-gray-700"
                }`}
            >
              {project.description}
            </p>
          </motion.div>

          {/* Details Section */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-gray-600"
              }`}
          >
            {project.longDescription}
          </motion.p>

          {/* Divider */}
          <div
            className={`h-px ${isDark ? "bg-white/8" : "bg-black/10"
              }`}
          />

          {/* Technologies Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-3"
          >
            <h3
              className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"
                }`}
            >
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm border transition-all ${isDark
                      ? "bg-white/8 text-white/80 border-white/10 hover:bg-white/12"
                      : "bg-black/5 text-black/70 border-white/20 hover:bg-black/8"
                    }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-3"
          >
            {Object.entries(project.stats).map(([key, value]) => (
              <div
                key={key}
                className={`p-4 rounded-xl backdrop-blur-md border transition-all ${isDark
                    ? "bg-white/8 border-white/10 hover:bg-white/12"
                    : "bg-black/5 border-white/20 hover:bg-black/8"
                  }`}
              >
                <p
                  className={`text-[10px] font-medium uppercase tracking-widest mb-2 ${isDark ? "text-white/60" : "text-black/50"
                    }`}
                >
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p
                  className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"
                    }`}
                >
                  {value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex gap-3 pt-2"
          >
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium backdrop-blur-md border transition-all ${isDark
                  ? "bg-white/8 border-white/10 text-white/80 hover:bg-white/12 hover:text-white"
                  : "bg-black/5 border-white/20 text-black/70 hover:bg-black/8 hover:text-black"
                }`}
            >
              <Github className="w-4 h-4" />
              <span>Repository</span>
            </motion.a>
            <motion.a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium backdrop-blur-md border transition-all ${isDark
                  ? "bg-white/12 border-white/20 text-white hover:bg-white/16"
                  : "bg-blue-500/10 border-blue-300/20 text-blue-600 hover:bg-blue-500/15"
                }`}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demo</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Main Page ─── */
const Projects = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [detailPos, setDetailPos] = useState({ x: 0, y: 0 });
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const hideTimerRef = useRef(null);

  const handleHoverChange = useCallback((project, e) => {
    clearTimeout(hideTimerRef.current);
    if (!project) {
      hideTimerRef.current = setTimeout(() => setDetailVisible(false), 120);
      return;
    }
    setHoveredProject(project);
    setDetailVisible(true);
    if (e) updateDetailPos(e);
  }, []);

  const updateDetailPos = (e) => {
    const dw = 316,
      dh = 430;
    const vw = window.innerWidth,
      vh = window.innerHeight;
    let x = e.clientX + 22;
    let y = e.clientY - 90;
    if (x + dw > vw - 10) x = e.clientX - dw - 22;
    if (y + dh > vh - 10) y = vh - dh - 10;
    if (y < 10) y = 10;
    setDetailPos({ x, y });
  };

  const borderColor = isDark ? "border-white/10" : "border-black/10";
  const textColor = isDark ? "text-white" : "text-zinc-900";
  const subText = isDark ? "text-zinc-400" : "text-zinc-500";
  const bgMain = isDark ? "bg-[#050505]" : "bg-[#F7F7F4]";
  const separatorBg = isDark ? "bg-[#0a0a0a]" : "bg-zinc-50/50";
  const cardTitleColor = isDark ? "text-zinc-100" : "text-zinc-900";
  const cardExcerptColor = isDark ? "text-zinc-400" : "text-zinc-600";

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...PROJECTS];
    if (selectedCategory !== "All")
      result = result.filter((p) => p.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tech.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (sortOption === "newest") result.reverse();
    return result;
  }, [selectedCategory, searchQuery, sortOption]);

  const chunkArray = (arr, size) => {
    const chunks = [];
    const copy = [...arr];
    while (copy.length) chunks.push(copy.splice(0, size));
    return chunks;
  };

  const chunkedProjects = chunkArray(filteredAndSortedProjects, 2);

  return (
    <>
      {/*
       * ── Global styles for the conic border trail effect ──
       * Injected once. The `::before` pseudo-element uses CSS custom props
       * set live via JS in each card's onMouseMove handler.
       */}
      <style>{`
        .card-trail-border {
          position: relative;
          transition: transform 0.08s ease-out;
        }
        .card-trail-overlay {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--angle, 0deg) at var(--mx, 50%) var(--my, 50%),
            transparent 55%,
            var(--trail-color, rgba(120,120,220,0.6)) 70%,
            transparent 85%
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.25s ease;
          pointer-events: none;
          z-index: 1;
        }
        .card-trail-border:hover .card-trail-overlay {
          opacity: 1;
        }
      `}</style>

      <div
        className={`min-h-screen transition-all duration-300 overflow-x-hidden ${bgMain} ${textColor} font-sans`}
      >
        {/* <CustomMouseFollower className="hidden lg:block" /> */}

        <div className={`lg:mx-92 ${bgMain}`}>
          <div className="fixed top-0 left-0 right-0 z-50 lg:ml-92 lg:mr-92">
            <Navbar />
          </div>

          <main className="w-full px-4 sm:px-6 md:px-8 lg:px-0 py-8 border-1 mt-15">
            {/* Header */}
            <div className="mb-8">
              <h2
                className={`text-3xl md:text-4xl font-medium tracking-tight py-4 flex items-center  transition-colors duration-300 lg:px-5 ${borderColor}`}
              >
                Projects
              </h2>
              <p
                className={`mt-3 mb-3 lg:px-5 text-base font-light border-y py-3 transition-colors duration-300 ${borderColor} ${subText}`}
              >
                A curated collection of projects built with modern technologies
                and innovative design patterns.
              </p>
            </div>

            {/* Search & Filter Toolbar */}
            <div
              className={`w-full border-y transition-colors duration-300 ${borderColor} py-4 mb-8`}
            >
              <div className="flex flex-col md:flex-row items-center justify-between w-full lg:px-5 gap-4">
                <div className="w-full md:w-auto flex-1 max-w-md relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className={`w-4 h-4 ${subText}`} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-transparent border ${borderColor} focus:border-blue-500 focus:outline-none transition-all duration-300`}
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto flex-wrap justify-center md:justify-end">
                  <div className="flex gap-2 flex-wrap justify-center">
                    {CATEGORIES.map((category) => (
                      <motion.button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${selectedCategory === category
                            ? isDark
                              ? "bg-blue-600 text-white"
                              : "bg-blue-500 text-white"
                            : isDark
                              ? "border border-zinc-700 text-zinc-300 hover:border-zinc-600"
                              : "border border-zinc-300 text-zinc-600 hover:border-zinc-400"
                          }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div
              className={`w-full flex flex-col transition-colors duration-300 ${borderColor} min-h-[400px]`}
            >
              {filteredAndSortedProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                  <Search className="w-12 h-12 mb-4 text-zinc-500" />
                  <p className="text-lg font-medium">No projects found</p>
                  <p className="text-sm text-zinc-500">
                    Try adjusting your search or category filter
                  </p>
                </div>
              ) : (
                chunkedProjects.map((pair, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    {rowIndex > 0 && (
                      <div
                        className={`w-full h-8 border-b relative overflow-hidden transition-colors duration-300 ${separatorBg}`}
                      >
                        <TiltedLines isDark={isDark} />
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row w-full relative">
                      <div
                        className={`w-full lg:w-1/2 py-8 lg:py-10 px-4 lg:px-8 transition-colors duration-300 ${borderColor}`}
                      >
                        <div className="max-w-4xl mx-auto">
                          <ProjectCard
                            project={pair[0]}
                            cardTitleColor={cardTitleColor}
                            cardExcerptColor={cardExcerptColor}
                            isDark={isDark}
                            onViewDetails={setSelectedProject}
                            onHoverChange={handleHoverChange}
                          />
                        </div>
                      </div>

                      <div
                        className={`hidden lg:block w-8 border-x relative overflow-hidden flex-shrink-0 transition-colors duration-300 ${separatorBg}`}
                      >
                        <TiltedLines isDark={isDark} />
                      </div>
                      <div
                        className={`lg:hidden w-full h-8 border-y relative overflow-hidden transition-colors duration-300 ${separatorBg}`}
                      >
                        <TiltedLines isDark={isDark} />
                      </div>

                      {pair[1] ? (
                        <div
                          className={`w-full lg:w-1/2 py-8 lg:py-10 px-4 lg:px-8 transition-colors duration-300 ${borderColor}`}
                        >
                          <div className="max-w-4xl mx-auto">
                            <ProjectCard
                              project={pair[1]}
                              cardTitleColor={cardTitleColor}
                              cardExcerptColor={cardExcerptColor}
                              isDark={isDark}
                              onViewDetails={setSelectedProject}
                              onHoverChange={handleHoverChange}
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`hidden lg:block w-1/2 transition-colors duration-300 ${bgMain}`}
                        />
                      )}
                    </div>
                  </React.Fragment>
                ))
              )}

              <div
                className={`w-full h-8 border-t relative overflow-hidden transition-colors duration-300 ${separatorBg}`}
              >
                <TiltedLines isDark={isDark} />
              </div>
            </div>
          </main>

          <div className="border-l-1 border-r-1">
            <Footer />
          </div>
        </div>

        {/* Full modal */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal
              project={selectedProject}
              isDark={isDark}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Projects;
