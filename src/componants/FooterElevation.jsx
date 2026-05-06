import assets from "@/assets/assets";
import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Elevation = ({ isDark }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`
        relative w-full h-96 mb-10 overflow-hidden rounded-lg group cursor-pointer
        transition-all duration-500 ease-in-out
        ${
          isDark
            ? "shadow-[0_10px_40px_-10px_rgba(0,0,0,1)] border border-gray-800"
            : "shadow-2xl border-4 border-white"
        }
      `}
    >
      {/* 1. Background Image: Grayscale to Color Transition */}
      <img
        src={assets.Nature}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover 
        transition-all duration-700 ease-in-out
        grayscale group-hover:grayscale-0 group-hover:scale-110"
        alt="Nature aesthetic"
      />

      {/* 2. Gradient Overlay */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-t transition-opacity duration-700
          ${
            isDark
              ? "from-gray-900/95 via-gray-900/60 to-transparent group-hover:from-gray-900/80"
              : "from-black/70 via-black/20 to-transparent group-hover:from-black/60"
          }
        `}
      />

      {/* 3. Text Content - Motivational Contact Focus */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 text-center">
        {/* Badge: Direct Call to Action */}
        <span
          className={`
            px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-md transition-colors duration-300
            ${
              isDark
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-white"
                : "bg-white/20 text-white border border-white/40 group-hover:bg-white group-hover:text-emerald-800"
            }
          `}
        >
          Open for Collaboration
        </span>

        {/* Headline: Connecting "Growth" with "Business/Code" */}
        <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg mb-2 transition-transform duration-500 group-hover:scale-105">
          Let's bring your vision to{" "}
          <span className="text-emerald-400 italic">life.</span>
        </h2>

        {/* Subtext: The Pitch */}
        <p className="max-w-xl text-gray-200 text-lg md:text-md font-medium opacity-90 mt-2 transform transition-transform duration-500 group-hover:-translate-y-1">
          Have an idea ready to bloom? Reach out today and let's plant the seeds
          for your digital success.
        </p>

        {/* Decorative Line: Visual Cue */}
        <div
          className={`w-16 h-1 mt-6 rounded-full transition-all duration-500 group-hover:w-48 ${
            isDark ? "bg-emerald-500" : "bg-white"
          }`}
        />

        {/* Optional: "Click to Connect" hint that appears on hover */}
        <button
          onClick={() => navigate("/contact")}
          className="flex justify-center  opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 items-center gap-1 px-4 py-2 border-gray-600 mt-4 text-center rounded-sm bg-gray-800 shadow-lg hover:bg-green-600"
        >
          <span className=" text-md font-semibold tracking-wide text-white opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            Click to Connect
          </span>
        </button>
      </div>
    </div>
  );
};

export default Elevation;
