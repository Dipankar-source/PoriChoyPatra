// components/Home.js
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import React, { lazy } from "react";

const Hero = lazy(() => import("../componants/Hero"));
const About = lazy(() => import("../componants/About"));
const Experience = lazy(() => import("../componants/Experience"));
const TestiMonials = lazy(() => import("../componants/TestiMonials"));
const Projects = lazy(() => import("../componants/Projects"));
const Thoughts = lazy(() => import("../componants/Thoughts"));
import Navbar from "../componants/Navbar";
import { useTheme } from "../context/ThemeContext";
import { Spotlight } from "@/components/ui/spotlight";
import CustomMouseFollower from "@/componants/CustomMouseFollower";
import GitHubStats from "@/componants/GitHubStats";

const Home = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 overflow-x-hidden lg:ml-92 lg:mr-92 ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      <Spotlight
        className="-top-20 left-0 md:-top-10 md:left-40"
        fill="white"
      />

      {/* Mobile detection for CustomMouseFollower */}
      <CustomMouseFollower className="hidden lg:block" />

      <BackgroundRippleEffect />

      {/* Navbar with higher z-index to ensure it stays on top */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:ml-92 lg:mr-92">
        <Navbar />
      </div>

      {/* Main content with top padding to account for fixed navbar */}
      <div className="relative pt-16">
        {" "}
        {/* Added pt-16 for navbar height */}
        <div className="relative z-10 w-full sm:px-6 lg:px-0">
          <section id="hero" className="w-full">
            <Hero />
          </section>

          <section id="about" className="w-full">
            <About isDark={isDark} />
          </section>

          <section id="about" className="w-full">
            <GitHubStats />
          </section>

          <section id="experience" className="w-full">
            <Experience />
          </section>

          <section id="blog" className="w-full">
            <TestiMonials />
          </section>

          <section id="projects" className="w-full">
            <Projects />
          </section>

          <section id="certificate" className="w-full">
            <Thoughts />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
