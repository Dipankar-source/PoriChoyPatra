import React from "react";
import { motion } from "framer-motion";
import {
  Sun,
  CloudSun,
  Play,
  Redo2,
  Undo2,
  Calendar as CalendarIcon,
  MapPin,
  Bell,
  Plus,
  Image as ImageIcon,
  Battery,
  Wifi,
} from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(" ");
const IOSCard = ({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
  noPadding = false,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden z-10 cursor-pointer",
        "bg-white/70 dark:bg-zinc-900/70",
        "backdrop-blur-2xl",
        "border border-white/40 dark:border-white/10",
        "shadow-xl shadow-black/5 dark:shadow-black/20",
        "rounded-[32px]",
        colSpan === 2 ? "sm:col-span-2" : "sm:col-span-1",
        rowSpan === 2 ? "sm:row-span-2" : "sm:row-span-1",
        !noPadding && "p-5",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

const WeatherWidget = () => (
  <div className="flex flex-col justify-between h-full text-zinc-900 dark:text-white">
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <span className="text-sm font-medium">Cupertino</span>
        <span className="text-5xl font-light tracking-tight">72°</span>
      </div>
      <Sun className="w-8 h-8 text-yellow-500 fill-current" />
    </div>
    <div className="flex items-center gap-2 text-sm font-medium">
      <CloudSun className="w-4 h-4" />
      <span>Mostly Sunny</span>
      <span className="ml-auto opacity-60">H:78° L:62°</span>
    </div>
  </div>
);

const MusicWidget = () => (
  <div className="relative h-full flex bg-zinc-100 dark:bg-zinc-800">
    <div className="w-2/5 h-full relative">
      <img
        src="https://images.unsplash.com/photo-1500099817043-86d46000d58f?auto=format&fit=crop&w=400&q=80"
        alt="Album Art"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
    <div className="w-3/5 p-5 flex flex-col justify-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
      <h3 className="font-semibold text-lg truncate text-zinc-900 dark:text-white">
        Lost in Yesterday
      </h3>
      <p className="text-sm text-pink-500 font-medium truncate mb-4">
        Tame Impala
      </p>
      <div className="flex items-center justify-between text-zinc-900 dark:text-white">
        <Undo2 className="w-6 h-6 opacity-40" />
        <Play className="w-8 h-8 fill-current" />
        <Redo2 className="w-6 h-6 opacity-40" />
      </div>
    </div>
  </div>
);

const FitnessWidget = () => {
  const Ring = ({ color, size, stroke, progress }) => {
    const radius = size / 2 - stroke / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    return (
      <svg width={size} height={size} className="absolute -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          className="opacity-20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-white">
            Activity
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Today</p>
        </div>
        <div className="relative w-16 h-16 flex items-center justify-center">
          <Ring color="#fa2a55" size={64} stroke={8} progress={75} />{" "}
          {/* Move */}
          <Ring color="#aaff00" size={48} stroke={8} progress={50} />{" "}
          {/* Exercise */}
          <Ring color="#00e0ff" size={32} stroke={8} progress={90} />{" "}
          {/* Stand */}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-semibold text-[#fa2a55]">450</p>
          <p className="text-[10px] font-medium uppercase text-zinc-500">
            KCAL
          </p>
        </div>
        <div>
          <p className="text-lg font-semibold text-[#aaff00]">25</p>
          <p className="text-[10px] font-medium uppercase text-zinc-500">MIN</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-[#00e0ff]">11</p>
          <p className="text-[10px] font-medium uppercase text-zinc-500">HRS</p>
        </div>
      </div>
    </div>
  );
};

const PhotoWidget = () => (
  <div className="relative h-full w-full">
    <img
      src="https://images.unsplash.com/photo-1516820208784-270b250306e3?auto=format&fit=crop&w=800&q=80"
      alt="Featured"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    <div className="absolute bottom-5 left-5 text-white">
      <p className="text-sm font-medium mb-1 opacity-90">Featured Photo</p>
      <h3 className="text-xl font-semibold">Yosemite National Park</h3>
    </div>
    <div className="absolute top-5 left-5 p-2 bg-white/30 backdrop-blur-md rounded-full">
      <ImageIcon className="w-5 h-5 text-white" />
    </div>
  </div>
);

const CalendarWidget = () => {
  const date = new Date();
  const day = date.toLocaleDateString("en-US", { weekday: "long" });
  const dayNum = date.getDate();

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-red-500 font-semibold text-sm uppercase">{day}</h3>
      <span className="text-6xl font-light text-zinc-900 dark:text-white tracking-tighter leading-none my-2">
        {dayNum}
      </span>
      <div className="mt-auto space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-8 bg-blue-500 rounded-full" />
          <div>
            <p className="text-xs font-medium text-zinc-900 dark:text-white line-clamp-1">
              Design Sync
            </p>
            <p className="text-[10px] text-zinc-500">10:00 AM - 11:00 AM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShortcutsWidget = () => {
  const Shortcut = ({ icon: Icon, color, label }) => (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-12 h-12 ${color} rounded-full flex items-center justify-center text-white shadow-sm`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-[10px] font-medium text-zinc-700 dark:text-zinc-300 text-center line-clamp-1">
        {label}
      </span>
    </div>
  );

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="grid grid-cols-2 gap-2">
        <Shortcut icon={Plus} color="bg-blue-500" label="New Note" />
        <Shortcut icon={MapPin} color="bg-green-500" label="Go Home" />
        <Shortcut icon={Bell} color="bg-orange-500" label="Remind Me" />
        <Shortcut icon={ImageIcon} color="bg-purple-500" label="Scan Doc" />
      </div>
    </div>
  );
};

const SystemWidget = () => (
  <div className="h-full flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="font-semibold text-zinc-900 dark:text-white">
          iPhone
        </span>
        <span className="text-xs text-zinc-500">This Device</span>
      </div>
      <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-900 dark:text-white">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="flex items-center gap-2 bg-green-500/10 dark:bg-green-500/20 p-2 rounded-2xl">
        <Battery className="w-5 h-5 text-green-500" />
        <span className="text-sm font-medium text-green-600 dark:text-green-400">
          88%
        </span>
      </div>
      <div className="flex items-center gap-2 bg-blue-500/10 dark:bg-blue-500/20 p-2 rounded-2xl">
        <Wifi className="w-5 h-5 text-blue-500" />
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Wi-Fi
        </span>
      </div>
    </div>
  </div>
);

export default function IOSBentoGrid() {
  return (
    <div className="min-h-screen  p-6 md:p-0 transition-colors duration-500 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-1">
            Today View
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            Wednesday, October 25
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[170px] gap-5">
          <IOSCard>
            <WeatherWidget />
          </IOSCard>
          <IOSCard>
            <CalendarWidget />
          </IOSCard>
          <IOSCard colSpan={2} noPadding>
            <MusicWidget />
          </IOSCard>
          <IOSCard colSpan={2} rowSpan={2} noPadding>
            <PhotoWidget />
          </IOSCard>
          <IOSCard>
            <FitnessWidget />
          </IOSCard>
          <IOSCard>
            <SystemWidget />
          </IOSCard>
          <IOSCard>
            <ShortcutsWidget />
          </IOSCard>
          <IOSCard className="flex items-center justify-center bg-zinc-200/50 dark:bg-zinc-800/50 border-dashed border-2 border-zinc-300 dark:border-zinc-700 backdrop-blur-sm shadow-none">
            <Plus className="w-10 h-10 text-zinc-400" />
          </IOSCard>
        </div>
      </div>
    </div>
  );
}
