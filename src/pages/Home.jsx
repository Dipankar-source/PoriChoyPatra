// components/Home.js
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import React, { lazy, Suspense } from "react"; // 1. Added Suspense import

// Lazy imports (These take time to load)
const Hero = lazy(() => import("../componants/Hero"));
const About = lazy(() => import("../componants/About"));
const Experience = lazy(() => import("../componants/Experience"));
const TestiMonials = lazy(() => import("../componants/TestiMonials"));
const Thoughts = lazy(() => import("../componants/Thoughts"));

// Eager imports (Load immediately)
import Navbar from "../componants/Navbar";
import { useTheme } from "../context/ThemeContext";
import { Spotlight } from "@/components/ui/spotlight";
import CustomMouseFollower from "@/componants/CustomMouseFollower";
import GitHubStats from "@/componants/GitHubStats";
import NameHover from "@/componants/NameHover";
import { LoaderFive } from "@/components/ui/loader";
import { FocusBlades } from "@/uicomponents/projects/focus-blades";
import Elevation from "@/componants/FooterElevation";
import Footer from "@/componants/Footer";

const Home = () => {
  const { isDark } = useTheme();
  const LoadingScreen = () => (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-colors duration-300 ${isDark ? "bg-black" : "bg-white"
        }`}
    >
      <LoaderFive text="Loading..." />
    </div>
  );

  return (
    <>
      <div
        className={`min-h-screen transition-colors duration-300 overflow-x-hidden  lg:ml-92 lg:mr-92 ${isDark ? "bg-black" : "bg-white"
          }`}
      >
        {/* Spotlights and Backgrounds load immediately */}
        <Spotlight
          className="-top-20 left-0 md:-top-10 md:left-40"
          fill="white"
        />
        <CustomMouseFollower className="hidden lg:block" />
        <BackgroundRippleEffect />

        {/* Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50 lg:ml-92 lg:mr-92">
          <Navbar />
        </div>

        {/* 3. Wrap Content in Suspense */}
        {/* The fallback is what shows while the lazy components below are downloading */}
        <Suspense fallback={<LoadingScreen />}>
          <div className="relative pt-16">
            <div className="relative z-10 w-full sm:px-6 lg:px-0">
              <section id="hero" className="w-full">
                <Hero />
              </section>

              <section id="about" className="w-full">
                <About isDark={isDark} />
              </section>

              <section id="github" className="w-full">
                <GitHubStats />
              </section>

              <section id="experience" className="w-full">
                <Experience />
              </section>

              <section id="testimonials" className="w-full">
                <TestiMonials />
              </section>

              <section id="projects" className="w-full">
                <FocusBlades />
              </section>

              <section id="namehover" className="w-full">
                <NameHover isDark={isDark} />
              </section>

              <section id="thoughts" className="w-full">
                <Thoughts />
              </section>

              <section id="contact" className="w-full">
                <Elevation isDark={isDark} />
              </section>

              <section id="contact" className="w-full">
                <Footer />
              </section>
            </div>
          </div>
        </Suspense>
      </div>
    </>
  );
};

export default Home;
