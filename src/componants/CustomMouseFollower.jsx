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

const CustomMouseFollower = ({ className = "hidden lg:block" }) => {
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);

  const beeX = useSpring(pointerX, { stiffness: 220, damping: 20, mass: 0.8 });
  const beeY = useSpring(pointerY, { stiffness: 220, damping: 20, mass: 0.8 });

  const [isHovered, setIsHovered] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      pointerX.set(e.clientX + 18);
      pointerY.set(e.clientY + 18);
    };

    const handleMouseOver = (e) => {
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
  }, [pointerX, pointerY]);

  return (
    <motion.div
      className={`fixed left-0 top-0 pointer-events-none z-[9999] ${className}`}
      style={{
        x: beeX,
        y: beeY,
      }}
      animate={{
        scale: isHovered ? 1.08 : 1,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      {videoFailed ? (
        <div className="h-6 w-6 bg-transparent" />
      ) : (
        <video
          src={followerVideo}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoFailed(true)}
          className="block h-12 w-12 select-none bg-transparent object-contain opacity-100"
          style={{ display: "block" }}
        />
      )}
    </motion.div>
  );
};

export default CustomMouseFollower;
