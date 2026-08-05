import { SparklesCore } from "@/components/ui/sparkles";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, useLocation, href } from "react-router-dom";
import { FaGithub, FaBars, FaTimes, FaLinkedin, FaTwitter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ShimmeringText } from "@/components/shimmering-text";
import { MagneticWrapper } from "./CustomMouseFollower";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Target, Download, FileText } from "lucide-react";
import { PremiumSearch } from "@/uicomponents/searchs/premium-search";
import assets from "@/assets/assets";
import clickSoundPath from "../assets/sounds/click.mp3";

const MoonIcon = ({ size = 15, className = "" }) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{
        rotate: [0, -15, 15, -10, 10, 0],
        scale: 1.1,
        transition: { duration: 0.8, ease: "easeInOut" },
      }}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </motion.svg>
  );
};

const SunIcon = ({ size = 15, className = "" }) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{
        rotate: [0, 20, -20, 15, -15, 0],
        scale: 1.1,
        transition: { duration: 0.8, ease: "easeInOut" },
      }}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </motion.svg>
  );
};

const Navbar = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  const handleThemeToggle = React.useCallback(() => {
    try {
      const audio = new Audio(clickSoundPath);
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Audio playback failed", e));
    } catch (e) {
      console.error("Audio playback failed", e);
    }
    toggleTheme();
  }, [toggleTheme]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.shiftKey || e.metaKey) && e.key.toLowerCase() === "t") {
        e.preventDefault();
        handleThemeToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleThemeToggle]);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);


  const BLOG_POSTS = [
    {
      id: 1,
      title: "A Premium Navbar Design",
      excerpt: "Navbar design to serve a great user experience.",
      date: "Dec 07",
      readTime: "5m",
      category: "Design",
      image: assets.NavbarComponent,
    },
    {
      id: 2,
      title: "IOS Bento",
      excerpt: "Experience of IOS in your boredom.",
      date: "Dec 10",
      readTime: "8m",
      category: "Design",
      image: assets.IOSBento,
    },
    {
      id: 3,
      title: "Chronos 3D Card",
      excerpt: "A 3D card that hits different as a ui component.",
      date: "Dec 08",
      readTime: "6m",
      category: "UX",
      image: assets.ChronosCard,
    },
    {
      id: 4,
      title: "IOS Premium Accordion",
      excerpt:
        "A premium vibe for the persons for those IOS means a lot and great Experience.",
      date: "Dec 05",
      readTime: "12m",
      category: "Frontend",
      image: assets.IOSAccordion,
    },
  ];

  const openImageModal = () => {
    setIsImageModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    document.body.style.overflow = "unset";
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollThreshold = window.innerHeight * 0.21;
          setIsScrolled(window.scrollY > scrollThreshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Portfolio", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Blog", path: "/blog" },
  ];

  const handleNavigation = (path) => {
    if (path.startsWith("#")) {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
    }
    setActiveLink(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const fadeUpVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const navItemVariants = {
    hover: {
      y: -2,
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const githubButtonVariants = {
    hover: {
      scale: 1.05,
      y: -1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const themeToggleVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.9,
    },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const mobileMenuItemVariants = {
    closed: {
      opacity: 0,
      x: -20,
    },
    open: {
      opacity: 1,
      x: 0,
    },
  };

  const isActiveLink = (path) => {
    if (path === "/") {
      return activeLink === "/";
    }
    if (path === "/blog") {
      return activeLink === "/blog";
    }
    if (path === "#projects") {
      return location.hash === "#projects";
    }
    return activeLink.startsWith(path);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.6,
      }}
      className={`w-full h-15 rounded-md mt-0 lg:mt-0 lg:rounded-none flex justify-between items-center px-4 sm:px-6 lg:px-8 transition-colors duration-300 z-[9990] sticky top-0 ${isDark ? "bg-transparent backdrop-blur-sm" : "bg-transparent backdrop-blur-sm"
        } relative`}
    >
      <div className="flex items-center justify-center relative z-20">
        <div className="relative">
          <AnimatePresence mode="wait">
            {!isScrolled && (
              <motion.img
                key="logo-image"
                className="w-8 h-8 object-cover rounded-full lg:hidden cursor-pointer"
                src="/Logo.webp"
                alt="DipFolio Logo"
                onClick={openImageModal}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.9 }}
              />
            )}
          </AnimatePresence>
        </div>

        {createPortal(
          <AnimatePresence>
            {isImageModalOpen && (
              <motion.div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute inset-0 bg-black/80 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeImageModal}
                />

                <motion.div
                  className="relative z-10 max-w-2xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    y: 20,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <motion.button
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-200 border border-white/20 dark:border-gray-700/50"
                    onClick={closeImageModal}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
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

                  <div className="relative">
                    <motion.img
                      className="w-full h-auto max-h-[70vh] object-contain"
                      src="/Logo.webp"
                      alt="DipFolio Logo"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                    />

                    <motion.div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-2">
                          DipFolio Logo
                        </h3>
                        <p className="text-gray-200 text-sm max-w-md mx-auto">
                          Professional portfolio showcasing creative work and
                          development projects. Designed with modern aesthetics
                          and smooth user experience.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>

      <div className="hidden md:flex items-center space-x-4 lg:space-x-4 relative z-50">
        {navItems.map((item) => (
          <motion.button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            variants={navItemVariants}
            whileHover="hover"
            className={`relative transition-all cursor-pointer duration-300 text-sm lg:text-base px-3 py-2 rounded-lg ${isActiveLink(item.path)
              ? isDark
                ? "text-white"
                : "text-black"
              : isDark
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-black"
              }`}
          >
            {item.name}
            {isActiveLink(item.path) && (
              <motion.div
                className={`absolute bottom-1 left-1/2 w-1 h-1 rounded-full ${isDark ? "bg-indigo-400" : "bg-indigo-600"
                  }`}
                layoutId="activeIndicator"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </motion.button>
        ))}

        {/* Optional: The Premium Command Palette Trigger (passing data to it) */}
        <div className="hidden md:block">
          <PremiumSearch blogPosts={BLOG_POSTS} />
        </div>

        <motion.button
          variants={githubButtonVariants}
          whileHover="hover"
          whileTap="tap"
          className={`lg:py-1 lg:px-3 py-1 px-2 rounded-sm cursor-pointer ${isDark ? "bg-[#e1e1dd] text-black" : "text-white bg-gray-800"
            }`}
        >
          <MagneticWrapper>
            <div
              onClick={() => window.open("https://github.com/Dipankar-source/", "_blank")}
              className="flex items-center gap-2"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <FaGithub className="h-4 w-4" />
              </motion.div>
              <p className="text-sm font-semibold">1.5k</p>
            </div>
          </MagneticWrapper>
        </motion.button>

        <MagneticWrapper>
          <div className="relative group">
            <motion.button
              variants={themeToggleVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleThemeToggle}
              className={
                "p-2 rounded-lg cursor-pointer transition-colors duration-300"
              }
              aria-label="Toggle theme"
            >
              <motion.div
                key={isDark ? "sun" : "moon"}
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 180, scale: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  duration: 0.5,
                }}
              >
                {isDark ? (
                  <SunIcon className="h-4.5 w-4.5" />
                ) : (
                  <MoonIcon className="h-4.5 w-4.5" />
                )}
              </motion.div>
            </motion.button>

            {/* Tooltip */}
            <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50 ${isDark ? "bg-white/10 text-white border border-white/20 backdrop-blur-md" : "bg-black/80 text-white backdrop-blur-md"}`}>
              Shift + T
            </div>
          </div>
        </MagneticWrapper>
      </div>

      <div className="flex md:hidden items-center space-x-1 relative z-50">
        <PremiumSearch blogPosts={BLOG_POSTS} />
        <div className="relative group">
          <motion.button
            variants={themeToggleVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleThemeToggle}
            className={`p-2 rounded-lg cursor-pointer transition-colors duration-300 ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            aria-label="Toggle theme"
          >
            <motion.div
              key={isDark ? "sun" : "moon"}
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 180, scale: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.5,
              }}
            >
              {isDark ? (
                <SunIcon className="h-4 w-4" />
              ) : (
                <MoonIcon className="h-4 w-4" />
              )}
            </motion.div>
          </motion.button>

          {/* Tooltip */}
          <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50 ${isDark ? "bg-white/10 text-white border border-white/20 backdrop-blur-md" : "bg-black/80 text-white backdrop-blur-md"}`}>
            Shift + T
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMobileMenu}
          className={`p-2 rounded-lg cursor-pointer ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            } transition-colors duration-300`}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaTimes
                  className={`h-4 w-4 ${isDark ? "text-white" : "text-black"}`}
                />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaBars
                  className={`h-4 w-4 ${isDark ? "text-white" : "text-black"}`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleMobileMenu}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9990] md:hidden pointer-events-auto"
              />

              {/* Full-Screen Modern Mobile Menu */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`fixed inset-x-2 bottom-2 top-20 rounded-3xl shadow-2xl z-[9991] md:hidden overflow-hidden flex flex-col pointer-events-auto ${isDark
                    ? "bg-[#09090b]/90 border border-white/10 backdrop-blur-2xl"
                    : "bg-white/90 border border-black/10 backdrop-blur-2xl"
                  }`}
              >
                <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between">
                  {/* Top Navigation Links */}
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-400 mb-4 px-2">Navigation</h3>
                    {[...navItems, { name: "Contact", path: "/contact" }].map((item, index) => (
                      <motion.button
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 + 0.1 }}
                        onClick={() => handleNavigation(item.path)}
                        className={`text-left text-3xl font-bold py-3 px-4 rounded-xl transition-colors ${isActiveLink(item.path)
                            ? isDark
                              ? "bg-white/10 text-white"
                              : "bg-black/5 text-black"
                            : isDark
                              ? "text-gray-400 hover:bg-white/5 hover:text-white"
                              : "text-gray-500 hover:bg-black/5 hover:text-black"
                          }`}
                      >
                        {item.name}
                      </motion.button>
                    ))}
                  </div>

                  {/* Bottom Actions */}
                  <div className="mt-8 flex flex-col space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex justify-around items-center px-4"
                    >
                      <a href="https://github.com/Dipankar-source/" target="_blank" rel="noopener noreferrer" className={`p-4 rounded-full transition-transform active:scale-95 ${isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"}`}>
                        <FaGithub className="h-6 w-6" />
                      </a>
                      <a href="https://linkedin.com/in/dipankarbarik" target="_blank" rel="noopener noreferrer" className={`p-4 rounded-full transition-transform active:scale-95 ${isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"}`}>
                        <FaLinkedin className="h-6 w-6" />
                      </a>
                      <a href="https://twitter.com/_dipankarsource" target="_blank" rel="noopener noreferrer" className={`p-4 rounded-full transition-transform active:scale-95 ${isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"}`}>
                        <FaTwitter className="h-6 w-6" />
                      </a>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      onClick={() => window.open("/Resume_Portfolio.pdf")}
                      className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 ${isDark ? "bg-white text-black" : "bg-black text-white"
                        }`}
                    >
                      <Download className="h-5 w-5" /> Download Resume
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      <div className="absolute inset-1 z-10">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm ${isDark ? "opacity-100" : "opacity-30"
            }`}
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className={`absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4 ${isDark ? "opacity-100" : "opacity-40"
            }`}
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className={`absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm ${isDark ? "opacity-100" : "opacity-30"
            }`}
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className={`absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4 ${isDark ? "opacity-100" : "opacity-40"
            }`}
        />
      </div>
    </motion.nav>
  );
};

export default Navbar;
