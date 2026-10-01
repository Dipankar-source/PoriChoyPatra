import React, { useState } from "react";
import { ChevronRight, CloudDownload, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import icons from "../assets/icons";
import { useTheme } from "../context/ThemeContext";
import { ScrollFountain } from "@/components/ui/scroll-fountain-text";
import { AnimatedParagraph } from "@/components/ui/animated-paragraph";
import { GridSectionHeader } from "@/components/PageGridLines";
import PageGridLines from "@/components/PageGridLines";

const getIconForSkill = (skillName) => {
  const normalizedMap = {
    python: icons.PythonIcon,
    kaggle: icons.KaggleIcon,
    numpy: icons.NumPyIcon,
    pandas: icons.PandasIcon,
    matplotlib: icons.MatplotlibIcon,
    "scikit-learn": icons.ScikitLearnIcon,
    javascript: icons.JavaScriptIcon,
    react: icons.ReactIcon,
    tailwindcss: icons.TailwindIcon,
    "framer-motion": icons.FramerMotionIcon,
    "lucide-react": icons.LucideReactIcon,
    html: icons.HTMLIcon,
    css: icons.CSSIcon,
    "lucide-icons": icons.LucideReactIcon,
    "react-icons": icons.ReactIconsIcon,
    "tabular icons": icons.TablerIconsIcon,
  };

  const Icon = normalizedMap[skillName.toLowerCase()];
  if (Icon) return Icon;

  return ({ isDark }) => <Code2 size={26} color={isDark ? "#fff" : "#000"} />;
};

const StackItem = ({ name }) => {
  const { isDark } = useTheme();
  const IconComponent = getIconForSkill(name);

  return (
    <div className="group flex items-center h-8 px-2 border border-transparent hover:border-neutral-500 hover:border-dotted cursor-pointer overflow-hidden rounded-sm hover:bg-neutral-200 dark:hover:bg-[#26262680] transition-colors duration-300 ease-out">
      <div className="flex items-center justify-center transition-all duration-300">
        <IconComponent isDark={isDark} />
      </div>
      <div className="flex items-center overflow-hidden transition-all duration-300 max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 group-hover:ml-2">
        {/* Skill label: fluid between 11px (mobile) and 13px (desktop) */}
        <span
          className="font-medium text-neutral-800 dark:text-neutral-200 whitespace-nowrap"
          style={{ fontSize: "clamp(11px, 1.8vw, 13px)", lineHeight: "1.4" }}
        >
          {name}
        </span>
      </div>
    </div>
  );
};

const ExperienceItem = ({
  company,
  position,
  isOpen,
  isAnyOpen,
  onToggle,
  isHoveredOuter,
  isAnyHoveredOuter,
  onHoverStart,
  onHoverEnd,
}) => {
  const shouldDim =
    (isAnyOpen && !isOpen) ||
    (!isAnyOpen && isAnyHoveredOuter && !isHoveredOuter);

  return (
    <motion.div
      className="group flex flex-col py-2 w-full rounded-md transition-colors gap-2 cursor-pointer relative"
      onClick={onToggle}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      animate={{
        opacity: shouldDim ? 0.38 : 1,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: company + title */}
        <div className="sm:w-2/3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              {/* Company name: fluid 16px → 20px */}
              <span
                className="font-semibold text-gray-700 dark:text-white/95 leading-snug tracking-tight"
                style={{ fontSize: "clamp(16px, 3vw, 18px)" }}
              >
                {company.companyName}
              </span>
              <button
                className={`flex-shrink-0 transition-all duration-300 ${isOpen ? "rotate-90 opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                aria-label={isOpen ? "Collapse" : "Expand"}
              >
                <ChevronRight
                  size={20}
                  className="text-gray-600 dark:text-gray-300"
                />
              </button>
              <a
                href={position.certificateLink || "#"}
                target={position.certificateLink ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className={`group/cert flex items-center flex-shrink-0 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                title="Certificate"
              >
                <CloudDownload
                  size={20}
                  className="text-gray-600 dark:text-gray-300 group-hover/cert:text-slate-800 dark:group-hover/cert:text-slate-100 transition-colors"
                />
                <div className="flex items-center overflow-hidden transition-all duration-300 max-w-0 opacity-0 group-hover/cert:max-w-[100px] group-hover/cert:opacity-100 group-hover/cert:ml-1.5">
                  <span className="text-[13px] font-medium text-slate-800 dark:text-slate-100 whitespace-nowrap">
                    Certificate
                  </span>
                </div>
              </a>
            </div>

            {/* Job title: fluid 13px → 15px */}
            <p
              className="font-medium text-gray-500 dark:text-gray-400 leading-snug"
              style={{ fontSize: "clamp(9px, 1vw, 15px)" }}
            >
              {position.title}
            </p>
          </div>
        </div>

        {/* Right: period + location */}
        <div className="sm:w-1/3 sm:text-right flex flex-col gap-0.5">
          {/* Employment period: fluid 12px → 14px */}
          <p
            className="font-medium text-gray-700 dark:text-white/95 leading-snug"
            style={{ fontSize: "clamp(12px, 2vw, 14px)" }}
          >
            {position.employmentPeriod}
          </p>
          {/* Location: fluid 11px → 13px, muted */}
          <p
            className="text-gray-500 dark:text-gray-400 leading-snug"
            style={{ fontSize: "clamp(11px, 1.8vw, 13px)" }}
          >
            {position.Location}
          </p>
        </div>
      </div>

      {/* Expandable body */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-2"
            : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="list-disc list-inside space-y-1 mb-3 ml-1">
            {/* Description: fluid 12px → 14px */}
            <li
              className="text-gray-600 dark:text-gray-300 leading-relaxed"
              style={{ fontSize: "clamp(12px, 2vw, 14px)" }}
            >
              {position.description}
            </li>
          </ul>
          {position.skills && position.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {position.skills.map((skill, index) => (
                <StackItem key={index} name={skill} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Experience = () => {
  const [openId, setOpenId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  const WORK_EXPERIENCE = [
    {
      id: "3",
      companyName: "Samsung Innovation Campus",
      isCurrentEmployer: false,
      positions: [
        {
          id: "3-1",
          title: "Machine Learning & Artificial Intelligence Trainee",
          employmentPeriod: "Sept 2025 - Nov 2025",
          employmentType: "Part-Time",
          Location: "BWU, Kolkata (Onsite)",
          description:
            "Working on face recognition project with traditional algorithms",
          skills: [
            "Python",
            "Kaggle",
            "NumPy",
            "Pandas",
            "Matplotlib",
            "scikit-learn",
          ],
          certificateLink: "", // Add your Google Drive link here
        },
      ],
    },
    {
      id: "1",
      companyName: "Gamonix Esports & Gamming",
      isCurrentEmployer: false,
      positions: [
        {
          id: "1-1",
          title: "Web Frontend Developer",
          employmentPeriod: "Jul 2025 - Oct 2025",
          employmentType: "Part-Time",
          Location: "BWU, Kolkata (Remote)",
          description: "Building an analytic portal for the company",
          skills: [
            "JavaScript",
            "React",
            "tailwindcss",
            "framer-motion",
            "lucide-react",
            "react-icons",
          ],
          certificateLink:
            "https://drive.google.com/file/d/1mlBM5N0pkXPcXqS11A1Kzcp8U2z8-a0k/view?usp=drive_link", // Add your Google Drive link here
        },
      ],
    },
    {
      id: "2",
      companyName: "EuphoriaGenX",
      isCurrentEmployer: false,
      positions: [
        {
          id: "2-1",
          title: "Web Frontend Developer",
          employmentPeriod: "Jul 2025 - Oct 2025",
          employmentType: "Part-Time",
          Location: "Kolkata, Salt Lake (Remote)",
          description: "Building an analytic portal for the company",
          skills: [
            "JavaScript",
            "React",
            "tailwindcss",
            "framer-motion",
            "lucide-react",
            "react-icons",
          ],
          certificateLink:
            "https://drive.google.com/file/d/1Sf9HZd-41Z2Uu-T8lU6fEgVbTXT2dud7/view?usp=drive_link",
        },
      ],
    },
  ];

  return (
    <div className="w-full bg-[#F7F7F4] dark:bg-[#0F0F0F] text-black dark:text-white transition-colors duration-300">
      {/* Section heading: fluid 18px → 24px */}
      <GridSectionHeader className="flex justify-between items-center">
        <PageGridLines section sectionOffset={27} />
        <div className="flex items-center justify-between">
          <div className="ml-4 mt-9 mb-3">
            <p className="aktura-font tracking-wider text-[28px] leading-tight text-neutral-950 dark:text-neutral-50">
              Experience
            </p>
          </div>
          {/* <p
            className=" hover:underline text-gray-900 dark:text-stone-400 leading-tight tracking-tighter cursor-pointer"
            onClick={() => navigate("/experience")}
          >
            View All
          </p> */}
        </div>
      </GridSectionHeader>

      <div className="bg-[#F7F7F4] dark:bg-[#0F0F0F] text-gray-900 dark:text-gray-100 mt-5 font-sans">
        <div className="px-4 flex flex-col gap-2">
          {WORK_EXPERIENCE.map((company) =>
            company.positions.map((position) => (
              <ExperienceItem
                key={position.id}
                company={company}
                position={position}
                isOpen={openId === position.id}
                isAnyOpen={openId !== null}
                onToggle={() =>
                  setOpenId(openId === position.id ? null : position.id)
                }
                isHoveredOuter={hoveredId === position.id}
                isAnyHoveredOuter={hoveredId !== null}
                onHoverStart={() => setHoveredId(position.id)}
                onHoverEnd={() => setHoveredId(null)}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
};

export default Experience;
