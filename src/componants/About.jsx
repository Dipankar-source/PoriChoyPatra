import { GlowingEffect } from "@/components/ui/glowing-effect";
import React from "react";
import { Box } from "lucide-react";
import { motion } from "framer-motion";
import { FaAws } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiGit,
  SiDocker,
  SiFirebase,
  SiGraphql,
  SiRedis,
} from "react-icons/si";
import { BackgroundLines } from "@/components/ui/background-lines";

// GridItem component definition - Modified for rectangular layout
const GridItem = ({ area, icon, title, description, children }) => {
  return (
    <li className={`min-h-[20rem] list-none mt-7 ${area}`}>
      <div className="relative h-full rounded-md border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-4">
            {/* Header with icon and title */}
            <div className="flex items-start gap-4">
              <div className="w-fit rounded-lg border border-gray-600 p-2 flex-shrink-0">
                {icon}
              </div>
              <div className="flex-1">
                <h3 className="font-sans text-xl font-semibold text-black md:text-2xl dark:text-white">
                  {title}
                </h3>
              </div>
            </div>

            {/* Content area - Perfect for writing */}
            <div className="flex-1 space-y-4">
              {/* Description */}
              <p className="font-sans text-sm text-black md:text-base dark:text-neutral-400 leading-relaxed">
                {description}
              </p>

              {/* Additional content area */}
              <div className="font-sans text-sm text-black md:text-base dark:text-neutral-300 leading-relaxed">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

// TechStackIcon component with hover effects and animations
const TechStackIcon = ({ icon: Icon, name, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{
        scale: 1.1,
        y: -5,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: delay * 0.1,
        ease: "easeOut",
      }}
      className="relative group"
    >
      <div className="relative p-4 flex items-center justify-center rounded-full lg:h-17 lg:w-17 h-10 w-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none transition-all duration-300 group-hover:shadow-lg group-hover:dark:shadow-gray-800/50">
        {/* Hover tooltip */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap">
            {name}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-700"></div>
          </div>
        </div>

        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <Icon className="w-8 h-8 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const About = () => {
  // Tech stacks data
  const techStacks = [
    { icon: SiReact, name: "React.js" },
    { icon: SiNextdotjs, name: "Next.js" },
    { icon: SiNodedotjs, name: "Node.js" },
    { icon: SiExpress, name: "Express.js" },
    { icon: SiMongodb, name: "MongoDB" },
    { icon: FaGithub, name: "PostgreSQL" },
    { icon: SiTailwindcss, name: "Tailwind CSS" },
    { icon: SiTypescript, name: "TypeScript" },
    { icon: SiJavascript, name: "JavaScript" },
    { icon: SiPython, name: "Python" },
    { icon: SiGit, name: "Git" },
    { icon: SiDocker, name: "Docker" },
    { icon: FaAws, name: "AWS" },
    { icon: SiFirebase, name: "Firebase" },
    { icon: SiGraphql, name: "GraphQL" },
    { icon: SiRedis, name: "Redis" },
  ];

  return (
    <div className="w-full min-h-screen py-12 border-b-1 border-l-1 border-r-1 mt-28">
      <hr className="text-blue-100 mb-4" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="grid grid-cols-1 gap-8">
          <GridItem
            area=""
            icon={<Box className="h-6 w-6 text-black dark:text-neutral-400" />}
            title="About Me"
            description="Full Stack Developer passionate about creating digital experiences that make a difference."
          >
            <div className="space-y-4">
              <p>
                I'm a MERN stack developer with a keen eye for design and a
                passion for building scalable, efficient web applications. With
                expertise in modern technologies and frameworks, I bring ideas
                to life through clean code and intuitive user experiences.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-semibold text-black dark:text-white mb-2">
                    Skills
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• React.js & Next.js</li>
                    <li>• Node.js & Express</li>
                    <li>• MongoDB & PostgreSQL</li>
                    <li>• Tailwind CSS & Styled Components</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-black dark:text-white mb-2">
                    Experience
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• 3+ Years in Web Development</li>
                    <li>• 50+ Projects Completed</li>
                    <li>• Client-focused Solutions</li>
                    <li>• Agile Methodology</li>
                  </ul>
                </div>
              </div>

              <p className="pt-4">
                When I'm not coding, you can find me exploring new technologies,
                contributing to open-source projects, or sharing knowledge with
                the developer community.
              </p>
            </div>
          </GridItem>
        </div>
      </div>
      <br />
      <br />
      <hr className="text-blue-100 mt-3" />
      <br />

      {/* Tech Stacks Section */}
      <div className="relative w-full">
        <p className="text-2xl font-medium text-gray-900 dark:text-white mb-1 mt-3 px-4 mb-4">
          Tech Stacks
        </p>

        {/* Background Lines Container */}
        <div className="relative h-[10rem] w-full">
          <BackgroundLines className="absolute inset-0" />

          {/* Tech Stacks Content - Positioned on top of background lines */}
          <div className="absolute inset-0 flex items-center justify-center py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Tech Icons Grid */}
                <motion.div
                  className="grid grid-cols-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-6 mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, staggerChildren: 0.1 }}
                >
                  {techStacks.map((tech, index) => (
                    <TechStackIcon
                      key={tech.name}
                      icon={tech.icon}
                      name={tech.name}
                      delay={index}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
