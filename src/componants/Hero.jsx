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
import { FcLike } from "react-icons/fc";

import { FlipWords } from "@/components/ui/flip-words";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { BiLogoGmail } from "react-icons/bi";
import { FaPhone } from "react-icons/fa6";
import { CgGenderMale } from "react-icons/cg";
import { IoLocationSharp } from "react-icons/io5";
import { ScrollFountain } from "@/components/ui/scroll-fountain-text";
import { ShimmeringText } from "@/components/shimmering-text";
import { MagneticWrapper } from "./CustomMouseFollower";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { useNavigate } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import loveSoundPath from "../assets/sounds/love.mp3";
import changeSoundPath from "../assets/sounds/change.mp3";
import GoldViewer from "./GoldViewer";
import SamsungViewer from "./SamsungViewer";
import { ScanQrCode } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const LikeButton = () => {
  // Initialize state from localStorage
  const [isLiked, setIsLiked] = useState(() => {
    return localStorage.getItem("portfolioIsLiked") === "true";
  });
  const [likes, setLikes] = useState(null);
  const [showArrow, setShowArrow] = useState(true);

  // Hide arrow after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowArrow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Load the database-backed total on mount.
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        if (!supabase) return;
        const { data, error } = await supabase.rpc("get_public_like_count");
        if (error) throw error;
        setLikes(Number(data));
      } catch (error) {
        if (import.meta.env.DEV) console.error("Could not load like count:", error);
      }
    };
    fetchLikes();
  }, []);

  const playLoveSound = () => {
    try {
      const audio = new Audio(loveSoundPath);
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Audio playback failed", e));
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const handleLike = async () => {
    if (likes === null) return;

    const newIsLiked = !isLiked;
    const delta = newIsLiked ? 1 : -1;
    setIsLiked(newIsLiked);
    setLikes((previous) => previous + delta);

    if (newIsLiked) {
      playLoveSound();
    }

    try {
      const { supabase } = await import("@/lib/supabase");
      if (!supabase) throw new Error("Supabase is not configured");
      const { data, error } = await supabase.rpc("change_public_like_count", {
        p_delta: delta,
      });
      if (error) throw error;
      setLikes(Number(data));
      localStorage.setItem("portfolioIsLiked", newIsLiked.toString());
    } catch (error) {
      setIsLiked(!newIsLiked);
      setLikes((previous) => previous - delta);
      if (import.meta.env.DEV) console.error("Could not update like count:", error);
    }
  };

  return (
    <div className="absolute -bottom-32 sm:-bottom-40 right-4 sm:right-8 flex flex-col items-end z-50">
      {/* Arrow */}
      <AnimatePresence>
        {showArrow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute bottom-7 right-4 pointer-events-none"
          >
            <svg width="60" height="80" viewBox="0 0 100 100" className="text-gray-400 dark:text-gray-500">
              <motion.path
                d="M 10 10 Q 80 10 50 80"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              <motion.path
                d="M 35 65 L 50 80 L 70 65"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 1 }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Text and Button */}
      <div className="relative flex items-center justify-end">
        <button
          onClick={handleLike}
          disabled={likes === null}
          className="flex justify-center items-center gap-2 cursor-pointer border-neutral-200 dark:border-neutral-800 hover:scale-105 transition-all duration-300"
        >
          <motion.div
            key={isLiked ? "liked" : "unliked"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {isLiked ? <FcLike size={24} /> : <AiOutlineHeart size={24} className="text-gray-400" />}
          </motion.div>
          <span className={`text-sm font-semibold min-w-[3.2rem] text-left transition-colors ${isLiked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {likes === null ? "..." : likes.toLocaleString()}
          </span>
        </button>
      </div>
    </div>
  );
};

const Hero = () => {
  const { profileIndex, cycleProfile } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasVisited = sessionStorage.getItem("hasVisitedHome") === "true";
  const naviagte = useNavigate();

  const handleProfileChange = () => {
    cycleProfile();
    try {
      const audio = new Audio(changeSoundPath);
      audio.volume = 0.5;
      audio.play().catch((error) => console.error("Audio playback failed", error));
    } catch (error) {
      console.error("Audio playback failed", error);
    }
  };

  useEffect(() => {
    // Delay rendering heavy backgrounds to prioritize LCP
    const timer = setTimeout(() => setIsLoaded(true), 1500);

    if (!hasVisited) {
      sessionStorage.setItem("hasVisitedHome", "true");
    }

    return () => clearTimeout(timer);
  }, [hasVisited]);

  const words = `Building fast, scalable web applications with MERN.

Passionate about performance, clean architecture, and intuitive user experiences.`;

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
        className="absolute top-full hidden lg:block right-0 mt-3 w-72 rounded-lg border border-gray-200 dark:border-gray-700 bg-[#FFFFFF] dark:bg-[#09090B] shadow-xl z-50"

      >
        {/* Triangle/Pointer pointing to the button */}
        <div className="absolute -top-2 right-4 w-4 h-4 transform rotate-45 bg-[#FFFFFF] dark:bg-[#09090B] border-t border-l border-gray-200 dark:border-gray-700 z-10"></div>

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
      <div className="flex gap-4 relative items-center justify-center top-1">
        <GoldViewer />
        <SamsungViewer />
      </div>
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-center top-5">
        <LikeButton />
        <div className="relative z-10 flex w-full flex-col items-center justify-between space-y-6 px-8 py-16 text-center md:flex-row">
          <div className="flex-1">
            <h2 className="text-center text-4xl font-normal tracking-tight text-neutral-900 sm:text-5xl md:text-left dark:text-neutral-200">
              <ScrollFountain particleCount={15}>
                <motion.span
                  className="md:inline-block hidden -translate-y-7 text-xl ml-0.5 origin-[70%_70%]"
                  animate={{ rotate: [0, 15, -10, 15, -10, 15, 0, 0, 0, 0, 0, 0, 0, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >👋</motion.span>Hi, I'm{" "}
              </ScrollFountain>
              <span className="font-semibold dark:text-white text-3xl lg:text-5xl ml-2">
                <ScrollFountain particleCount={25}>
                  Dipankar Barik
                </ScrollFountain>
              </span>
            </h2>
            <div className="mt-4 md:pl-2 max-w-lg text-center text-base text-neutral-600 md:text-left dark:text-neutral-300">
              <TextGenerateEffect words={words} skipAnimation filter={false} />
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
                  className="dark:bg-[#09090B] cursor-pointer bg-[#FFFFFF] text-black dark:text-white flex items-center space-x-2 relative z-10"
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
          <div className="absolute hidden lg:block bottom-0 lg:top-51 top-52 bg-blue-300 h-32 w-32 lg:h-34 lg:w-34 rounded-2xl border-none left-8">
            <div className="relative lg:h-34 lg:w-34 h-32 w-32 rounded-2xl dark:bg-[#542A52] bg-[#FFB39A] flex justify-center items-center">
              <button
                type="button"
                onClick={handleProfileChange}
                aria-label="Change profile photo and theme sound"
                title="Change profile photo and theme sound"
                className="group absolute right-1 top-1 z-20 rounded-full bg-white/90 p-1.5 text-gray-800 shadow hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800"
              >
                <ScanQrCode size={16} />
                <span className="pointer-events-none absolute left-full bottom-full z-30 mb-2 ml-2 whitespace-nowrap rounded-sm bg-black px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-white dark:text-black">
                  Change the content
                </span>
              </button>
              <div className="relative h-28 w-28 overflow-hidden rounded-2xl lg:h-31 lg:w-31">
                <AnimatePresence initial={false} mode="sync">
                  <motion.div
                    key={profileIndex}
                    className="absolute inset-0 overflow-hidden"
                    initial={{ opacity: 0.55, scaleX: 0.93 }}
                    animate={{ opacity: [0.55, 1, 0.65, 1], scaleX: [0.93, 1.04, 0.98, 1] }}
                    exit={{ opacity: 0, scaleX: 1.06 }}
                    transition={{ duration: 0.42, ease: "linear" }}
                  >
                    <img
                      className="h-full w-full object-cover"
                      src={profileIndex === 0 ? "/profile1.webp" : "/profile.webp"}
                      alt="Dipankar Barik - Logo"
                    />
                    <motion.img
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover mix-blend-screen"
                      src={profileIndex === 0 ? "/profile1.webp" : "/profile.webp"}
                      style={{ filter: "sepia(1) saturate(8) hue-rotate(300deg)" }}
                      animate={{
                        x: [-9, 7, -6, 4, 0],
                        opacity: [0.95, 0.15, 0.8, 0.4, 0],
                        clipPath: ["inset(8% 0 76% 0)", "inset(34% 0 42% 0)", "inset(68% 0 12% 0)", "inset(0)"],
                      }}
                      transition={{ duration: 0.42, ease: "linear" }}
                    />
                    <motion.img
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover mix-blend-screen"
                      src={profileIndex === 0 ? "/profile1.webp" : "/profile.webp"}
                      style={{ filter: "sepia(1) saturate(8) hue-rotate(150deg)" }}
                      animate={{
                        x: [9, -7, 6, -4, 0],
                        opacity: [0.9, 0.1, 0.75, 0.35, 0],
                        clipPath: ["inset(70% 0 10% 0)", "inset(38% 0 36% 0)", "inset(6% 0 78% 0)", "inset(0)"],
                      }}
                      transition={{ duration: 0.42, ease: "linear" }}
                    />
                    <motion.div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        backgroundImage: "repeating-linear-gradient(to bottom, transparent 0 3px, rgba(0,0,0,.72) 4px 5px)",
                      }}
                      animate={{ opacity: [0.95, 0.35, 0.85, 0] }}
                      transition={{ duration: 0.42, ease: "linear" }}
                    />
                    <motion.div
                      aria-hidden="true"
                      className="absolute inset-x-0 h-4 bg-white/90 mix-blend-screen"
                      animate={{ y: [0, 24, 8, 67, 0], opacity: [0, 1, 0.15, 0.9, 0] }}
                      transition={{ duration: 0.42, ease: "linear" }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
          <motion.div
            initial={hasVisited ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: hasVisited ? 0 : 1.2, duration: hasVisited ? 0 : 0.8 }}
            className="absolute lg:bottom-0 lg:top-63 top-[100%] -mt-4 lg:mt-0 lg:h-8 w-full lg:w-xl lg:right-5 rounded-md left-0 lg:left-50 flex flex-col items-center lg:block px-4 lg:px-0"
          >
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
              <a
                className="group relative z-50"
                target="_blank"
                href="https://github.com/Dipankar-source/"
                aria-label="GitHub Profile"
              >
                <FaGithub className="w-7 h-7 cursor-pointer z-50" />
                <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-black px-2 py-1 text-[13px] font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-white dark:text-black">
                  GitHub
                </span>
              </a>

              <a
                className="group relative z-50"
                target="_blank"
                href="https://www.instagram.com/techandbhakti/?next=%2F"
                aria-label="Instagram Profile"
              >
                <FaInstagram className="w-7 h-7 cursor-pointer z-50" />
                <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-black px-2 py-1 text-[13px] font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-white dark:text-black">
                  Instagram
                </span>
              </a>
              <a
                className="group relative z-50"
                target="_blank"
                href="https://linkedin.com/in/dipankarbarik/"
                aria-label="LinkedIn Profile"
              >
                <CiLinkedin className="w-7 h-7 cursor-pointer z-50" />
                <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-black px-2 py-1 text-[13px] font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-white dark:text-black">
                  LinkedIn
                </span>
              </a>
              <a
                className="group relative z-50"
                target="_blank"
                href="https://x.com/_dipankarsource"
                aria-label="X Profile"
              >
                <FaXTwitter className="w-7 h-7 cursor-pointer z-50" />
                <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-black px-2 py-1 text-[13px] font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-white dark:text-black">
                  X
                </span>
              </a>
            </div>
            <div className="pl-6 pt-2 md:pt-0 md:pl-0 text-sm mx-auto font-normal -z-50 text-neutral-600 dark:text-neutral-400 min-w-[200px]">
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
