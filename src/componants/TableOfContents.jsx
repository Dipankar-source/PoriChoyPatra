import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const SECTIONS = [
  { id: 'hero', title: 'The Beginning' },
  { id: 'about', title: 'Why hire Me?' },
  { id: 'experience', title: 'What have I done?' },
  { id: 'github', title: 'How do I learn?' },
  { id: 'projects', title: 'What have I built?' },
  { id: 'paperwork', title: 'What have I explored?'},
  { id: 'thoughts', title: 'What do I believe?' },
  { id: 'contact', title: 'The Ending' },
];

const TableOfContents = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const { isDark } = useTheme();

  // Determine active section on scroll
  useEffect(() => {
    const observerCallback = (entries) => {
      let maxVisible = 0;
      let mostVisibleSection = activeSection;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const visibleRatio = entry.intersectionRatio;
          if (visibleRatio > maxVisible) {
            maxVisible = visibleRatio;
            mostVisibleSection = entry.target.id;
          }
        }
      });

      if (maxVisible > 0 && mostVisibleSection !== activeSection) {
        setActiveSection(mostVisibleSection);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-10% 0px -40% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeSection]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80; // Offset for navbar
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const currentSectionTitle = SECTIONS.find((s) => s.id === activeSection)?.title || 'Hero';
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <>
      {/* Bottom Blur Background */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none z-[90] backdrop-blur-sm"
        style={{
          maskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 100%)'
        }}
      />

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center">
        <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`mb-3 w-[300px] overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl ${
              isDark
                ? 'bg-[#121212]/90 border-white/10 text-white shadow-black/50'
                : 'bg-white/90 border-black/10 text-black shadow-black/10'
            }`}
          >
            <div className="px-4 py-3 border-b border-inherit">
              <span className="text-xs font-semibold tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">
                Table of Contents
              </span>
            </div>
            <div className="flex flex-col py-2 max-h-[400px] overflow-y-auto custom-scrollbar">
              {SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className={`flex items-center gap-3 px-5 py-2.5 text-left text-sm transition-all duration-200 ${
                      isActive
                        ? isDark
                          ? 'bg-white/10 font-medium'
                          : 'bg-black/5 font-medium'
                        : isDark
                        ? 'hover:bg-white/5 text-neutral-400 hover:text-neutral-200'
                        : 'hover:bg-black/5 text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <div className="relative w-2 h-2 flex items-center justify-center">
                      {isActive && (
                        <motion.div
                          layoutId="active-dot"
                          className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white' : 'bg-black'}`}
                        />
                      )}
                    </div>
                    {section.title}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center justify-between w-[300px] px-5 py-3 rounded-full border backdrop-blur-xl shadow-lg transition-colors ${
          isDark
            ? 'bg-[#181818]/90 border-white/10 hover:border-white/20 text-white'
            : 'bg-white/90 border-black/10 hover:border-black/20 text-black'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white' : 'bg-black'}`} />
          <span className="text-sm font-medium">{currentSectionTitle}</span>
        </div>

        <div className="relative w-6 h-6 flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="transform -rotate-90 absolute top-0 left-0"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              strokeWidth="2.5"
              stroke="currentColor"
              fill="none"
              className="opacity-20"
            />
            <motion.circle
              cx="12"
              cy="12"
              r="10"
              strokeWidth="2.5"
              stroke="currentColor"
              fill="none"
              strokeDasharray="62.83" // 2 * pi * r (approx)
              strokeDashoffset="62.83"
              style={{ pathLength }}
              className={isDark ? 'text-white' : 'text-black'}
            />
          </svg>
        </div>
      </motion.button>
    </div>
    </>
  );
};

export default TableOfContents;
