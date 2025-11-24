// components/Navbar.js
import { SparklesCore } from "@/components/ui/sparkles";
import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FaGithub, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ShimmeringText } from "@/components/shimmering-text";
import { MagneticWrapper } from "./CustomMouseFollower";
import { CardSpotlight } from "@/components/ui/card-spotlight";

// Moon Icon Component
const MoonIcon = ({ size = 15, className = "" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState('false')
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

// Sun Icon Component
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
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update active link based on current route
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  // Scroll detection with throttle for performance
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Navigation items configuration
  const navItems = [
    { name: "Portfolio", path: "/" },
    { name: "Blog", path: "#blog" },
    { name: "Projects", path: "#projects" },
  ];

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    setActiveLink(path);
    setIsMobileMenuOpen(false)
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Smooth fade-up animation variants
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

  // Staggered children animation for logo and sparkles
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

  // Nav item animation
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

  // GitHub button variants
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

  // Theme toggle variants
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

  // Mobile menu variants
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

  // Mobile menu item variants
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

  // Check if link is active
  const isActiveLink = (path) => {
    if (path === "/") {
      return activeLink === "/";
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
      className={`w-full h-15 rounded-md mt-0 lg:mt-0 lg:rounded-none flex justify-between items-center px-4 sm:px-6 lg:px-8 border-b transition-colors duration-300 z-70 sticky top-0 ${
        isDark ? "bg-black border-gray-800" : "bg-white border-gray-200"
      } relative overflow-hidden`}
    >
      {/* Left Section - Logo with Smooth Fade-Up Reveal */}
      <div className="flex items-center justify-center relative z-20">
        <div className="relative">
          <AnimatePresence mode="wait">
            {isScrolled && (
              <motion.div
                key="logo-content"
                className="relative"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Logo Text with Smooth Fade-Up */}
                <motion.div variants={fadeUpVariants} className="relative">
                  <motion.div
                    onClick={() => {
                      handleNavigation("/");
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    className={`text-xl cursor-pointer dipfolio-font lg:text-2xl font-bold font-in relative z-20 ${
                      isDark ? "text-white" : "text-black"
                    }`}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MagneticWrapper >
                      <span className="font-bold dark:text-white">
                        <ShimmeringText className="" text="DipFolio" />
                      </span>
                    </MagneticWrapper>
                    
                  </motion.div>
                </motion.div>

                {/* SparklesCore with Delayed Fade-Up */}
                <motion.div
                  variants={fadeUpVariants}
                  className="w-40 h-14 relative -mt-12 -ml-10"
                >
                  <SparklesCore
                    background="transparent"
                    minSize={0.4}
                    maxSize={1.7}
                    particleDensity={1000}
                    className="w-full h-full"
                    particleColor={isDark ? "#FFFFFF" : "#000000"}
                  />
                  {/* Radial Gradient */}
                  <div
                    className={`absolute inset-0 w-full h-full ${
                      isDark ? "bg-black" : "bg-white"
                    } [mask-image:radial-gradient(120px_80px_at_top,transparent_20%,white)]`}
                  ></div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4 lg:space-x-6 relative z-50">
        {navItems.map((item) => (
          <motion.button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            variants={navItemVariants}
            whileHover="hover"
            className={`relative transition-all cursor-pointer duration-300 text-sm lg:text-base px-3 py-2 rounded-lg ${
              isActiveLink(item.path)
                ? isDark
                  ? "text-white "
                  : "text-black "
                : isDark
                ? "text-gray-300 hover:text-white "
                : "text-gray-600 hover:text-black "
            }`}
          >
            {item.name}
            {isActiveLink(item.path) && (
              <motion.div
                className={`absolute bottom-1 left-1/2 w-1 h-1 rounded-full ${
                  isDark ? "bg-indigo-400" : "bg-indigo-600"
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

        {/* GitHub Button */}
        <motion.button
          variants={githubButtonVariants}
          whileHover="hover"
          whileTap="tap"
          className={`lg:py-1 lg:px-3 py-1 px-2 rounded-sm cursor-pointer ${
            isDark ? "bg-[#e1e1dd] text-black" : "text-white bg-gray-800"
          }`}
        >
          <MagneticWrapper>
            <div className="flex items-center gap-2">
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

        {/* Theme Toggle Button */}
        <MagneticWrapper>
          <motion.button
            variants={themeToggleVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={toggleTheme}
            className={`p-2 rounded-lg cursor-pointer transition-colors duration-300`}
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
        </MagneticWrapper>
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden items-center space-x-2 relative z-50">
        {/* GitHub Button - Mobile */}
        <motion.button
          variants={githubButtonVariants}
          whileHover="hover"
          whileTap="tap"
          className={`py-1 px-2 rounded-sm cursor-pointer ${
            isDark ? "bg-[#e1e1dd] text-black" : "text-white bg-gray-800"
          }`}
        >
          <div className="flex items-center gap-1">
            <FaGithub className="h-3 w-3" />
            <p className="text-xs font-semibold">1.5k</p>
          </div>
        </motion.button>

        {/* Theme Toggle Button - Mobile */}
        <motion.button
          variants={themeToggleVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={toggleTheme}
          className={`p-2 rounded-lg cursor-pointer transition-colors duration-300`}
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

        {/* Mobile Menu Button */}
        {isMobileMenuOpen === 'true'}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMobileMenu}
          className={`p-2 rounded-lg cursor-pointer ${
            isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            />

            {/* Menu Content */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={`fixed top-16 right-4 w-48 rounded-lg shadow-lg z-50 md:hidden ${
                isDark
                  ? "bg-gray-900 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div className="">
                <CardSpotlight className='h-full w-full'>
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.path}
                    variants={mobileMenuItemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full text-left px-1 py-3 rounded-md transition-colors duration-200 flex items-center justify-between ${
                      isActiveLink(item.path)
                        ? isDark
                          ? " text-white"
                          : " text-black"
                        : isDark
                        ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-black"
                    }`}
                  >
                    <span className="font-medium">{item.name}</span>
                    {isActiveLink(item.path) && (
                      <motion.div
                        className={`w-2 h-2 rounded-full ${
                          isDark ? "bg-indigo-400" : "bg-indigo-600"
                        }`}
                        layoutId="mobileActiveIndicator"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.button>
                ))}
                </CardSpotlight>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Background Gradients */}
      <div className="absolute inset-1 z-10">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm ${
            isDark ? "opacity-100" : "opacity-30"
          }`}
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className={`absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4 ${
            isDark ? "opacity-100" : "opacity-40"
          }`}
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className={`absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm ${
            isDark ? "opacity-100" : "opacity-30"
          }`}
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className={`absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4 ${
            isDark ? "opacity-100" : "opacity-40"
          }`}
        />
      </div>
    </motion.nav>
  );
};

export default Navbar;
