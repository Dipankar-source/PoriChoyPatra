import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import assets from "@/assets/assets";

/**
 * Advanced Project Showcase Component
 * Displays projects with sophisticated hover effects and interactions
 * Designed to complement the main Projects page
 */

const FEATURED_PROJECT = {
  id: 1,
  title: "Career Nexus",
  category: "Full Stack",
  description:
    "Designed and developed a scalable MERN-based platform connecting job seekers, recruiters, and mentors.",
  longDescription: "A comprehensive AI-powered professional networking platform that bridges the gap between education and career opportunities. Features real-time job matching, mentor connections, and a collaborative community space.",
  image: assets.careerNexusFullDetail,
  tech: ["Node.js", "React.js", "TailwindCSS", "MongoDB", "JWT", "AI/ML"],
  github: "https://github.com/Dipankar-source/CareerNexus",
  demo: "https://career-nexus-demo.vercel.app",
  featured: true,
  highlights: [
    "Real-time job matching algorithm",
    "AI-powered mentor recommendations",
    "Integrated messaging system",
    "Advanced analytics dashboard",
  ],
};

const ProjectHighlightCard = ({ isDark }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-3xl border transition-all duration-500 ${
        isDark
          ? "border-gray-800 bg-gradient-to-br from-zinc-900 to-black"
          : "border-gray-200 bg-gradient-to-br from-white to-gray-50"
      }`}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={FEATURED_PROJECT.image}
          alt={FEATURED_PROJECT.title}
          className={`h-full w-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            isDark
              ? "bg-gradient-to-br from-black/90 via-black/70 to-black/90"
              : "bg-gradient-to-br from-white/95 via-white/80 to-white/95"
          }`}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between min-h-96">
        {/* Top Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                isDark
                  ? "bg-blue-500/30 text-blue-200"
                  : "bg-blue-200 text-blue-700"
              }`}
            >
              🌟 Featured Project
            </motion.span>
            <motion.span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                isDark
                  ? "bg-emerald-500/30 text-emerald-200"
                  : "bg-emerald-200 text-emerald-700"
              }`}
            >
              {FEATURED_PROJECT.category}
            </motion.span>
          </div>
          <h2
            className={`text-3xl md:text-4xl font-bold mb-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {FEATURED_PROJECT.title}
          </h2>
          <p
            className={`text-base md:text-lg leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {FEATURED_PROJECT.longDescription}
          </p>
        </motion.div>

        {/* Middle Section - Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="my-6"
        >
          <h3
            className={`text-sm font-semibold mb-3 uppercase tracking-widest ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {FEATURED_PROJECT.highlights.map((highlight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + idx * 0.05 }}
                className="flex items-center gap-2"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isDark ? "bg-blue-400" : "bg-blue-500"
                  }`}
                ></span>
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {highlight}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {FEATURED_PROJECT.tech.map((tech, idx) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className={`text-xs font-medium px-2.5 py-1 rounded-lg backdrop-blur-sm ${
                  isDark
                    ? "bg-white/10 text-gray-200 border border-white/20"
                    : "bg-black/10 text-gray-700 border border-black/10"
                }`}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4"
        >
          <motion.a
            href={FEATURED_PROJECT.github}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isDark
                ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                : "bg-black/10 text-gray-900 hover:bg-black/20 border border-black/10"
            }`}
          >
            <Github className="w-4 h-4" />
            Code
          </motion.a>

          <motion.a
            href={FEATURED_PROJECT.demo}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isDark
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            Live Demo
          </motion.a>
        </motion.div>

        {/* Hover Indicator */}
        <motion.div
          className="absolute top-4 right-4"
          animate={{ rotate: isHovered ? 45 : 0, scale: isHovered ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`p-2 rounded-lg backdrop-blur-sm ${
              isDark
                ? "bg-white/10 text-white"
                : "bg-black/10 text-gray-900"
            }`}
          >
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectHighlightCard;
