"use client";
import React, { useEffect, useId, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

/* ------------------------------ Tokens ------------------------------------ */

// One colour per trace, in trace order (4 inputs, then 4 outputs).
const PALETTE = [
  "#a855f7",
  "#22d3ee",
  "#facc15",
  "#22c55e",
  "#22d3ee",
  "#22c55e",
  "#f97316",
  "#facc15",
];

const SIZES = { sm: "w-72", md: "w-[32rem]", lg: "w-[46rem]" };

/* ------------------------------ Geometry ---------------------------------- */
/* Everything is drawn in one 760x360 coordinate space and scales with the SVG. */

const VIEW = { w: 760, h: 360 };
const CHIP = { x: 280, y: 132, w: 200, h: 96, r: 26 };
const PIN_Y = [141, 167, 193, 219];
const PIN = { w: 9, h: 11 };

// side "in": signal flows node -> chip. side "out": chip -> node.
// midX is where the trace makes its vertical jog; omit it for a straight run.
// d = seconds per pulse, gap = pause between pulses, delay = start offset.
const TRACES = [
  {
    side: "in",
    node: [110, 60],
    pin: 0,
    midX: 215,
    d: 2.0,
    gap: 0.6,
    delay: 0.0,
  },
  {
    side: "in",
    node: [80, 120],
    pin: 1,
    midX: 195,
    d: 2.4,
    gap: 0.4,
    delay: 0.5,
  },
  {
    side: "in",
    node: [50, 180],
    pin: 2,
    midX: 175,
    d: 1.8,
    gap: 0.8,
    delay: 1.1,
  },
  {
    side: "in",
    node: [110, 300],
    pin: 3,
    midX: 215,
    d: 2.2,
    gap: 0.5,
    delay: 0.3,
  },
  {
    side: "out",
    node: [655, 70],
    pin: 0,
    midX: 545,
    d: 2.1,
    gap: 0.7,
    delay: 0.9,
  },
  {
    side: "out",
    node: [690, 130],
    pin: 1,
    midX: 565,
    d: 2.5,
    gap: 0.4,
    delay: 0.2,
  },
  { side: "out", node: [715, 193], pin: 2, d: 1.7, gap: 0.9, delay: 1.4 },
  {
    side: "out",
    node: [650, 300],
    pin: 3,
    midX: 545,
    d: 2.3,
    gap: 0.5,
    delay: 0.7,
  },
];

const buildPath = ({ side, node, pin, midX }) => {
  const py = PIN_Y[pin];
  const px = side === "in" ? CHIP.x : CHIP.x + CHIP.w;
  const [from, to] = side === "in" ? [node, [px, py]] : [[px, py], node];
  if (from[1] === to[1]) return `M${from[0]} ${from[1]} H${to[0]}`;
  return `M${from[0]} ${from[1]} H${midX} V${to[1]} H${to[0]}`;
};

/* ------------------------------ Helpers ----------------------------------- */

const cn = (...p) => p.filter(Boolean).join(" ");

const useCycle = (items, ms = 2400) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => setIndex((n) => (n + 1) % items.length), ms);
    return () => clearInterval(id);
  }, [items.length, ms]);
  return { index, text: items[index % items.length] };
};

/* ------------------------------ Trace ------------------------------------- */
/* A dim wire, plus a short light pulse that runs along it (glow + bright core).
   Motion's pathLength/pathOffset drive the dash, so no manual path maths. */

const PULSE = 0.16;

const Trace = ({ d, color, node, timing, speed, reduced }) => {
  const pulseProps = reduced
    ? { initial: { pathLength: PULSE, pathOffset: 0.45 } }
    : {
        initial: { pathLength: PULSE, pathOffset: -PULSE },
        animate: { pathLength: PULSE, pathOffset: [-PULSE, 1] },
        transition: {
          duration: timing.d / speed,
          delay: timing.delay / speed,
          repeat: Infinity,
          repeatDelay: timing.gap / speed,
          ease: "easeInOut",
        },
      };

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke="#38383c"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.18"
        {...pulseProps}
      />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...pulseProps}
      />
      <circle cx={node[0]} cy={node[1]} r="5" fill="#050505" stroke="#2a2a2e" />
    </g>
  );
};

/* ------------------------------ Chip -------------------------------------- */

const Chip = ({ gradId, palette, text, index, reduced }) => (
  <g>
    {[CHIP.x - PIN.w + 1, CHIP.x + CHIP.w - 1].flatMap((x) =>
      PIN_Y.map((y) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y - PIN.h / 2}
          width={PIN.w}
          height={PIN.h}
          rx="2.5"
          fill="#8b8b90"
        />
      )),
    )}

    <rect
      x={CHIP.x}
      y={CHIP.y}
      width={CHIP.w}
      height={CHIP.h}
      rx={CHIP.r}
      fill={`url(#${gradId})`}
    />
    <rect
      x={CHIP.x + 3}
      y={CHIP.y + 3}
      width={CHIP.w - 6}
      height={CHIP.h - 6}
      rx={CHIP.r - 3}
      fill="none"
      stroke="#fff"
      strokeOpacity="0.05"
    />
    {/* Rim slowly drifts through the trace colours. */}
    <motion.rect
      x={CHIP.x}
      y={CHIP.y}
      width={CHIP.w}
      height={CHIP.h}
      rx={CHIP.r}
      fill="none"
      strokeWidth="2"
      initial={{ stroke: palette[0], strokeOpacity: 0.35 }}
      animate={
        reduced
          ? undefined
          : {
              stroke: [...palette, palette[0]],
              strokeOpacity: [0.25, 0.55, 0.25],
            }
      }
      transition={{
        stroke: { duration: 14, repeat: Infinity, ease: "linear" },
        strokeOpacity: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
      }}
    />

    <AnimatePresence mode="wait" initial={false}>
      <motion.text
        key={index}
        x={CHIP.x + CHIP.w / 2}
        y={CHIP.y + CHIP.h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#d4d4d8"
        fontSize="15"
        fontWeight="500"
        style={{
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
        initial={{ opacity: 0, y: CHIP.y + CHIP.h / 2 + 6 }}
        animate={{ opacity: 1, y: CHIP.y + CHIP.h / 2 }}
        exit={{ opacity: 0, y: CHIP.y + CHIP.h / 2 - 6 }}
        transition={{ duration: 0.3 }}
      >
        {text}
      </motion.text>
    </AnimatePresence>
  </g>
);


export const Loader = ({
  messages = "Loading",
  palette = PALETTE,
  speed = 1,
  size = "md",
  className,
}) => {
  const reduced = !!useReducedMotion();
  const gradId = useId().replace(/:/g, "");
  const list = Array.isArray(messages) ? messages : [messages];
  const { index, text } = useCycle(list);
  const paths = useMemo(() => TRACES.map(buildPath), []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("max-w-full", SIZES[size] ?? SIZES.md, className)}
    >
      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="block h-auto w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c2c2f" />
            <stop offset="100%" stopColor="#161618" />
          </linearGradient>
        </defs>

        {TRACES.map((t, i) => (
          <Trace
            key={i}
            d={paths[i]}
            node={t.node}
            color={palette[i % palette.length]}
            timing={t}
            speed={speed}
            reduced={reduced}
          />
        ))}

        <Chip
          gradId={gradId}
          palette={palette}
          text={text}
          index={index}
          reduced={reduced}
        />
      </svg>
      <span className="sr-only">{list[0]}</span>
    </div>
  );
};

/** Full-screen (or parent-covering with `fixed={false}`) dark backdrop. */
export const LoaderOverlay = ({ fixed = true, ...props }) => (
  <div
    className={cn(
      fixed ? "fixed" : "absolute",
      "inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]",
    )}
  >
    <Loader size="lg" {...props} />
  </div>
);

export default Loader;
