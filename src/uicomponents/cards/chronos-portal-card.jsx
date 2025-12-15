import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
const cn = (...classes) => classes.filter(Boolean).join(" ");

const THEMES = {
  light: {
    card: "bg-[#FFFFFF]",
    border: "border-black/5",
    solidShape: "bg-zinc-200",
    shadow: "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]",
    highlight: "bg-black/5",
    cardBg: "bg-gradient-to-br from-white to-zinc-50",
  },
  dark: {
    card: "bg-[#18181b]",
    border: "border-white/10",
    solidShape: "bg-zinc-800",
    shadow: "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]",
    highlight: "bg-white/5",
    cardBg: "bg-gradient-to-br from-zinc-900 to-zinc-950",
  },
};

export function ChronosCard({ children, isDark = true, className = "" }) {
  const theme = isDark ? THEMES.dark : THEMES.light;
  const ref = useRef(null);
  const [isHovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const tiltSpring = { damping: 30, stiffness: 400 };
  const tiltX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [10, -10]),
    tiltSpring
  );
  const tiltY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-10, 10]),
    tiltSpring
  );

  const contentSpring = { damping: 30, stiffness: 200 };
  const contentX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-20, 20]),
    contentSpring
  );
  const contentY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [-20, 20]),
    contentSpring
  );

  const fluidSpring = { damping: 40, stiffness: 80, mass: 4 };
  const shapeX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-80, 80]),
    fluidSpring
  );
  const shapeY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [-80, 80]),
    fluidSpring
  );

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    mouseX.set(mouseXPos / width - 0.5);
    mouseY.set(mouseYPos / height - 0.5);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: tiltX,
        rotateY: tiltY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative rounded-[24px] border overflow-hidden cursor-pointer group transition-all duration-500",
        theme.cardBg,
        theme.border,
        theme.shadow,
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[24px]">
        <motion.div
          style={{ x: shapeX, y: shapeY }}
          className={cn(
            "absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full transition-all duration-700 opacity-100 blur-[100px]",
            isDark
              ? "bg-gradient-to-br from-emerald-500/20 to-purple-500/20"
              : "bg-gradient-to-br from-emerald-400/20 to-blue-400/20"
          )}
        />
        <motion.div
          style={{ x: shapeX, y: shapeY }}
          className={cn(
            "absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] rounded-full transition-colors duration-500",
            theme.solidShape
          )}
        />
      </div>

      <motion.div
        style={{ x: contentX, y: contentY, translateZ: 50 }}
        className="relative z-20 h-full w-full"
      >
        {children}
      </motion.div>

      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: isHovered ? "100%" : "-100%" }}
        className={cn(
          "absolute inset-0 z-30 pointer-events-none transition-colors duration-500",
          theme.highlight
        )}
        style={{ translateZ: 60 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 100,
        }}
      />
    </motion.div>
  );
}
