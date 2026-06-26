import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const BubbleParticle = ({ scrollY, triggerScroll, isDark }) => {
  const shouldReduceMotion = useReducedMotion();

  const { vx, vy, gravity, size, startX, startY } = useMemo(() => {
    const vx = (Math.random() - 0.5) * 12;
    const vy = (Math.random() - 0.3) * 8;
    const gravity = 0.01 + Math.random() * 0.02;
    const size = 2 + Math.random() * 4; 
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    return { vx, vy, gravity, size, startX, startY };
  }, []);

  const color = useMemo(() => {
    const colors = isDark 
      ? [
          "rgba(255, 255, 255, 0.9)",
          "rgba(255, 255, 255, 0.6)",
          "rgba(255, 255, 255, 0.3)",
        ]
      : [
          "rgba(0, 0, 0, 0.9)",
          "rgba(0, 0, 0, 0.6)",
          "rgba(0, 0, 0, 0.3)",
        ];
    return colors[Math.floor(Math.random() * colors.length)];
  }, [isDark]);

  const x = useTransform(scrollY, (s) => {
    if (s < triggerScroll) return 0;
    const deltaS = Math.min(s - triggerScroll, 200);
    return vx * deltaS;
  });

  const y = useTransform(scrollY, (s) => {
    if (s < triggerScroll) return 0;
    const deltaS = Math.min(s - triggerScroll, 200);
    return deltaS + vy * deltaS + 0.5 * gravity * deltaS * deltaS;
  });

  const opacity = useTransform(scrollY, (s) => {
    if (s < triggerScroll) return 0;
    const deltaS = s - triggerScroll;
    return Math.max(0, 1 - deltaS / 150);
  });

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      style={{
        x,
        y,
        opacity,
        width: size,
        height: size,
        backgroundColor: color,
        position: "absolute",
        top: `${startY}%`,
        left: `${startX}%`,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.1)",
        pointerEvents: "none",
        willChange: "transform, opacity",
      }}
    />
  );
};

export const ScrollFountain = ({ children, className, navbarHeight, particleCount = 20 }) => {
  const { scrollY } = useScroll();
  const { isDark } = useTheme();
  const ref = useRef(null);
  const [triggerScroll, setTriggerScroll] = useState(999999);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const updateTrigger = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;

      const navHeight =
        navbarHeight ||
        document.querySelector("nav")?.getBoundingClientRect().height ||
        60;

      setTriggerScroll(absoluteTop - navHeight);
    };

    const timer = setTimeout(updateTrigger, 100);
    window.addEventListener("resize", updateTrigger);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateTrigger);
    };
  }, [navbarHeight]);

  const contentOpacity = useTransform(scrollY, (s) => {
    if (s < triggerScroll) return 1;
    return Math.max(0, 1 - (s - triggerScroll) / 10);
  });

  const particles = useMemo(() => Array.from({ length: particleCount }), [particleCount]);

  if (shouldReduceMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
      }}
      className={className}
    >
      <motion.span
        ref={ref}
        style={{
          opacity: contentOpacity,
          display: "inline-block",
          willChange: "opacity",
        }}
      >
        {children}
      </motion.span>
      {particles.map((_, i) => (
        <BubbleParticle key={i} scrollY={scrollY} triggerScroll={triggerScroll} isDark={isDark} />
      ))}
    </span>
  );
};

const ScrollFountainWord = ({ word, scrollY, navbarHeight, isDark }) => {
  const ref = useRef(null);
  const [triggerScroll, setTriggerScroll] = useState(999999);
  const isSpace = word.trim() === "";

  useEffect(() => {
    const updateTrigger = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;

      const navHeight =
        navbarHeight ||
        document.querySelector("nav")?.getBoundingClientRect().height ||
        60;

      setTriggerScroll(absoluteTop - navHeight);
    };

    const timer = setTimeout(updateTrigger, 100);
    window.addEventListener("resize", updateTrigger);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateTrigger);
    };
  }, [navbarHeight]);

  const textOpacity = useTransform(scrollY, (s) => {
    if (s < triggerScroll) return 1;
    return Math.max(0, 1 - (s - triggerScroll) / 15);
  });

  const particles = useMemo(() => {
    if (isSpace) return [];
    const count = 5 + Math.floor(Math.random() * 5); // 5 to 10
    return Array.from({ length: count });
  }, [isSpace]);

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        whiteSpace: "pre",
      }}
    >
      <motion.span
        ref={ref}
        style={{
          opacity: textOpacity,
          display: "inline-block",
          willChange: "opacity",
        }}
      >
        {word}
      </motion.span>
      {particles.map((_, i) => (
        <BubbleParticle key={i} scrollY={scrollY} triggerScroll={triggerScroll} isDark={isDark} />
      ))}
    </span>
  );
};

export const ScrollFountainText = ({ text, className, navbarHeight }) => {
  const { scrollY } = useScroll();
  const { isDark } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(/(\s+)/);

  return (
    <span className={className} style={{ display: "inline-block" }}>
      {words.map((word, index) => (
        <ScrollFountainWord
          key={index}
          word={word}
          scrollY={scrollY}
          navbarHeight={navbarHeight}
          isDark={isDark}
        />
      ))}
    </span>
  );
};
