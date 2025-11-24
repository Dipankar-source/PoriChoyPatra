// componants/CustomMouseFollower.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Export this wrapper to use it in Navbar.js, Hero.js, etc.
 * Usage: <MagneticWrapper><button>Click Me</button></MagneticWrapper>
 */
export const MagneticWrapper = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`inline-block ${className} magnetic-target`} // Added class for cursor detection
    >
      {children}
    </motion.div>
  );
};

const CustomMouseFollower = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 12); // Center offset
      cursorY.set(e.clientY - 12);
    };

    const handleMouseOver = (e) => {
      // Trigger hover if element is a button, link, or wrapped in MagneticWrapper
      if (
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "A" ||
        e.target.closest(".magnetic-target") ||
        e.target.closest(".cursor-pointer")
      ) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = () => setIsHovered(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 border hidden lg:block border-yellow-400  dark:border-white rounded-full pointer-events-none z-[9999] mix-blend-difference bg-black"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
      }}
      animate={{
        scale: isHovered ? 3 : 1,
        backgroundColor: isHovered ? "#ffffff" : "transparent",
      }}
    />
  );
};

export default CustomMouseFollower;
