"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

/* Two eyes, centred on an off-white (light) or off-black (dark) screen that
   follows the system theme. The pupils glance left and right, the eyes blink,
   and a line of text fades up beneath them, changing as the load progresses.

  <LoaderOverlay duration={1800} onComplete={() => setReady(true)} />        */

const MESSAGES = [
  "Loading your page",
  "Here you go",
  "Almost done...",
  "All set",
];

// Where the pupils look for each message, in px. Cycles if there are more messages.
const GAZE = [-15, 15, -9, 0];

const cn = (...p) => p.filter(Boolean).join(" ");

const Eye = ({ cx, gaze, blinkDelay, reduced }) => (
  <motion.g
    style={{ transformBox: "fill-box", transformOrigin: "center" }}
    animate={reduced ? undefined : { scaleY: [1, 1, 0.06, 1] }}
    transition={{
      duration: 0.28,
      times: [0, 0.4, 0.7, 1],
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: blinkDelay,
    }}
  >
    <circle
      cx={cx}
      cy="60"
      r="42"
      className="fill-white stroke-[#cfcdc6] dark:fill-[#ecebe6] dark:stroke-transparent"
      strokeWidth="1.5"
    />
    <motion.g
      initial={{ x: 0 }}
      animate={{ x: gaze }}
      transition={
        reduced
          ? { duration: 0 }
          : { type: "spring", stiffness: 120, damping: 16, mass: 0.8 }
      }
    >
      <circle cx={cx} cy="60" r="17" className="fill-[#141414]" />
      <circle
        cx={cx + 5}
        cy="54"
        r="4.5"
        className="fill-white"
        opacity="0.9"
      />
    </motion.g>
  </motion.g>
);

export const Loader = ({
  messages = MESSAGES,
  duration = 1800,
  onComplete,
  className,
}) => {
  const reduced = !!useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const step = duration / messages.length;
    let i = 0;
    let timer;
    const tick = () => {
      if (i < messages.length - 1) {
        i += 1;
        setIndex(i);
        timer = setTimeout(tick, step);
      } else {
        onComplete && (timer = setTimeout(onComplete, step * 0.6));
      }
    };
    timer = setTimeout(tick, step);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, messages.length]);

  const gaze = GAZE[index % GAZE.length];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center", className)}
    >
      <motion.svg
        viewBox="0 0 320 120"
        className="block h-auto w-64 max-w-full sm:w-72"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Eye cx={95} gaze={gaze} blinkDelay={2.6} reduced={reduced} />
        <Eye cx={225} gaze={gaze} blinkDelay={2.6} reduced={reduced} />
      </motion.svg>

      <div className="relative mt-8 h-6 w-full text-center">
        <AnimatePresence mode="wait" initial>
          <motion.p
            key={index}
            className="absolute inset-0 text-sm font-medium tracking-tight text-[#2a2a28] dark:text-[#e4e3de]"
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

/** Covers the screen (or its parent with `fixed={false}`), then fades out and
 *  calls `onComplete` once the exit has finished. */
export const LoaderOverlay = ({ fixed = true, onComplete, ...props }) => {
  const [show, setShow] = useState(true);
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          key="loader"
          className={cn(
            fixed ? "fixed" : "absolute",
            "inset-0 z-50 flex items-center justify-center bg-[#f5f4f0] px-6 dark:bg-[#0f0f0f]",
          )}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Loader {...props} onComplete={() => setShow(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
