import React, { useState } from "react";
import { Activity, Layers, Sun, Moon } from "lucide-react";
import { ChronosCard } from "./chronos-portal-card";
import { cn } from "../../lib/utils/cn";

export default function ChronosCardDemo() {
  const [isDark, setIsDark] = useState(true);

  const textColorPrimary = isDark ? "text-zinc-100" : "text-zinc-900";
  const textColorSecondary = isDark ? "text-zinc-400" : "text-zinc-500";
  const badgeColors = isDark
    ? "bg-white text-zinc-900"
    : "bg-zinc-900 text-zinc-100";
  const metricBg = isDark
    ? "bg-white/5 border-white/10"
    : "bg-black/5 border-black/5";
  const borderColor = isDark ? "border-white/10" : "border-black/5";
  const bgColor = isDark ? "" : "";

  return (
    <div
      className={cn(
        "w-full min-h-screen flex flex-col items-center justify-center gap-10 transition-colors duration-500",
        bgColor
      )}
    >
      <ChronosCard
        isDark={isDark}
        className="w-[340px] h-[480px] p-8 flex flex-col justify-between"
      >
        <div className="flex justify-between items-start">
          <div
            className={cn("p-3 rounded-xl border backdrop-blur-md", metricBg)}
          >
            <Layers className={cn("w-6 h-6", textColorPrimary)} />
          </div>
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest",
              badgeColors
            )}
          >
            <Activity className="w-3 h-3" />
            <span>Live</span>
          </div>
        </div>

        <div className="space-y-4 mt-20">
          <h2
            className={cn(
              "text-4xl font-bold tracking-tighter",
              textColorPrimary
            )}
          >
            ishani-ui
          </h2>
          <p className={cn("font-medium leading-relaxed", textColorSecondary)}>
            An UI components library builds on the basis of React.js.
          </p>
        </div>

        <div
          className={cn("grid grid-cols-2 gap-3 pt-6 border-t", borderColor)}
        >
          <Metric
            label="Downloads"
            value="25K"
            subColor={textColorSecondary}
            mainColor={textColorPrimary}
            bg={metricBg}
          />
          <Metric
            label="Stability"
            value="99.99%"
            subColor={textColorSecondary}
            mainColor={textColorPrimary}
            bg={metricBg}
          />
        </div>
      </ChronosCard>
    </div>
  );
}

function Metric({ label, value, subColor, mainColor, bg }) {
  return (
    <div className={cn("flex flex-col p-4 rounded-xl border", bg)}>
      <span
        className={cn(
          "text-[10px] uppercase tracking-wider font-bold mb-1",
          subColor
        )}
      >
        {label}
      </span>
      <span className={cn("text-xl font-bold", mainColor)}>{value}</span>
    </div>
  );
}
