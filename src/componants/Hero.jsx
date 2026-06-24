import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { IoMdPaperPlane } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";

import { FlipWords } from "@/components/ui/flip-words";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { BiLogoGmail } from "react-icons/bi";
import { FaPhone } from "react-icons/fa6";
import { CgGenderMale } from "react-icons/cg";
import { IoLocationSharp } from "react-icons/io5";
import { ShimmeringText } from "@/components/shimmering-text";
import { MagneticWrapper } from "./CustomMouseFollower";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasVisited = sessionStorage.getItem("hasVisitedHome") === "true";
  const naviagte = useNavigate();

  useEffect(() => {
    // Delay rendering heavy backgrounds to prioritize LCP
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    
    if (!hasVisited) {
      sessionStorage.setItem("hasVisitedHome", "true");
    }
    
    return () => clearTimeout(timer);
  }, [hasVisited]);

  const words = `Crafting digital experiences with MERN stack
Design-focused developer with an eye for detail
Building scalable solutions with clean code
Passionate about modern web technologies
Turning complex problems into elegant solutions`;

  const wordsOfShowcase = [
    "better",
    "cute",
    "beautiful",
    "modern",
    "elegant",
    "sleek",
    "polished",
    "sophisticated",
    "intuitive",
    "responsive",
    "captivating",
    "immersive",
    "streamlined",
    "innovative",
    "dynamic",
    "refined",
  ];

  const ContactDetails = () => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute top-full hidden lg:block right-0 mt-3 w-72 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black shadow-xl z-50"

      >
        {/* Triangle/Pointer pointing to the button */}
        <div className="absolute -top-2 right-4 w-4 h-4 transform rotate-45 bg-white dark:bg-black border-t border-l border-gray-200 dark:border-gray-700 z-10"></div>

        <CardSpotlight >
          <div className="relative z-20 space-y-3 ">
            <motion.h3
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-md font-semibold text-gray-900 dark:text-white border-b pb-2 text-left"
            >
              Contact Info
            </motion.h3>

            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center space-x-2"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ">
                  <BiLogoGmail className="h-4 w-4 text-red-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-900 dark:text-white text-sm truncate text-left">
                    dipankarbarik2002@gmail.com
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaPhone className="h-4 w-4 text-green-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-900 dark:text-white text-sm text-left">
                    +91 9733132___
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="flex items-center space-x-2"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ">
                  <CgGenderMale className="h-4 w-4 text-blue-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-900 dark:text-white text-sm text-left">
                    Male
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-2"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ">
                  <IoLocationSharp className="h-4 w-4 text-purple-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-900 dark:text-white text-sm truncate text-left">
                    Barasat, West Bengal, India
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="pt-2 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Available for new projects
              </p>
            </motion.div>
          </div>
        </CardSpotlight>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div>
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-center top-5">
        {/* {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            <DottedGlowBackground
              className="pointer-events-none mask-radial-to-90% mask-radial-at-center opacity-20 dark:opacity-100"
              opacity={1}
              gap={10}
              radius={1.6}
              colorLightVar="--color-neutral-500"
              glowColorLightVar="--color-neutral-600"
              colorDarkVar="--color-neutral-500"
              glowColorDarkVar="--color-sky-800"
              backgroundOpacity={0}
              speedMin={0.3}
              speedMax={1.6}
              speedScale={1}
            />
          </motion.div>
        )} */}
        <div className="relative z-10 flex w-full flex-col items-center justify-between space-y-6 px-8 py-16 text-center md:flex-row">
          <div className="flex-1">
            <h2 className="text-center text-4xl font-normal tracking-tight text-neutral-900 sm:text-5xl md:text-left dark:text-neutral-400">
              Hi, I'm{" "}
              <span className="font-bold dark:text-white">
                <ShimmeringText
                  className="text-3xl lg:text-5xl font-semibold"
                  text="Dipankar Barik"
                />
              </span>
            </h2>
            <div className="mt-4 max-w-lg text-center text-base text-neutral-600 md:text-left dark:text-neutral-300">
              <TextGenerateEffect words={words} skipAnimation={hasVisited} />
            </div>
          </div>
          <motion.div
            initial={hasVisited ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: hasVisited ? 0 : 1, duration: hasVisited ? 0 : 0.8 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <div
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <MagneticWrapper>
                <HoverBorderGradient
                  containerClassName="rounded-sm"
                  as="button"
                  onClick={() => naviagte("/contact")}
                  className="dark:bg-black cursor-pointer bg-white text-black dark:text-white flex items-center space-x-2 relative z-10"
                >
                  <span>Hire Me</span>
                  <IoMdPaperPlane />
                </HoverBorderGradient>
              </MagneticWrapper>
              {isHovered && <ContactDetails />}
            </div>
          </motion.div>
        </div>
        <div>
          <div className="absolute hidden lg:block bottom-0 lg:top-51 top-52 bg-blue-300 h-32 w-32 lg:h-35 lg:w-35 rounded-full left-8">
            <img
              className="lg:h-35 lg:w-35 h-32 w-32 rounded-full object-cover relative"
              src="./Logo.webp"
              alt="Dipankar Barik - Logo"
            />
            <div className="absolute top-25 font-semibold text-sm bottom-0 left-29 min-w-[100px]">
              {" "}
              {/* Add min-width */}
              <LayoutTextFlip
                words={[
                  "He",
                  "Creative",
                  "Designer",
                  "Developer",
                  "Artist",
                  "Him",
                  "Thinker",
                  "Builder",
                ]}
              />
            </div>
          </div>
          <motion.div
            initial={hasVisited ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: hasVisited ? 0 : 1.2, duration: hasVisited ? 0 : 0.8 }}
            className="absolute lg:bottom-0 lg:top-63 top-[100%] mt-8 lg:mt-0 lg:h-8 w-full lg:w-xl lg:right-5 rounded-md left-0 lg:left-50 flex flex-col items-center lg:block px-4 lg:px-0"
          >
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
              <a
                className="z-50"
                target="_blank"
                href="https://github.com/Dipankar-source/"
                aria-label="GitHub Profile"
              >
                <FaGithub className="w-7 h-7 cursor-pointer z-50" />
              </a>

              <a
                className="z-50"
                target="_blank"
                href="https://www.instagram.com/techandbhakti/?next=%2F"
                aria-label="Instagram Profile"
              >
                <FaInstagram className="w-7 h-7 cursor-pointer z-50" />
              </a>
              <a
                className="z-50"
                target="_blank"
                href="https://linkedin.com/in/dipankarbarik/"
                aria-label="LinkedIn Profile"
              >
                <CiLinkedin className="w-7 h-7 cursor-pointer z-50" />
              </a>
              <a
                className="z-50"
                target="_blank"
                href="https://x.com/_dipankarsource"
                aria-label="Twitter Profile"
              >
                <FaXTwitter className="w-7 h-7 cursor-pointer z-50" />
              </a>
            </div>
            <div className="text-sm mx-auto font-normal -z-50 text-neutral-600 dark:text-neutral-400 min-w-[200px]">
              {" "}
              {/* Add min-width */}
              Build
              <FlipWords words={wordsOfShowcase} />
              websites <br className="lg:hidden" /> with Me
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
