import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import Hero from "../componants/Hero";
import IsometricBg from "../componants/IsometricBg";


const About = lazy(() => import("../componants/About"));
const Experience = lazy(() => import("../componants/Experience"));
import Navbar from "../componants/Navbar";
import { useTheme } from "../context/ThemeContext";
const Projects = lazy(() => import("@/componants/Projects"));
const Paperwork = lazy(() => import("@/componants/Paperwork"));
import TableOfContents from "@/componants/TableOfContents";
const Elevation = lazy(() => import("@/componants/FooterElevation"));
const Footer = lazy(() => import("@/componants/Footer"));
const VisitorAnalytics = lazy(() => import("@/components/VisitorAnalytics"));
const GitHubStats = lazy(() => import("@/componants/GitHubStats"));
const NameHover = lazy(() => import("@/componants/NameHover"));

const DeferredSection = ({ id, children, minHeight = 360 }) => {
  const sectionRef = useRef(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isNearViewport) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [isNearViewport]);

  return (
    <section id={id} ref={sectionRef} className="w-full">
      {isNearViewport ? (
        <Suspense fallback={<div aria-hidden="true" style={{ minHeight }} />}>
          {children}
        </Suspense>
      ) : (
        <div aria-hidden="true" style={{ minHeight }} />
      )}
    </section>
  );
};

const Home = () => {
  const { isDark } = useTheme();

  return (
    <>
      <div
        className={`transition-colors duration-300 overflow-hidden max-w-3xl mx-auto ${
          isDark ? "bg-[#09090B]" : "bg-[#FFFFFF]"
        }`}
      >
        {/* Spotlights and Backgrounds load immediately
        <Spotlight
          className="-top-20 left-0 md:-top-10 md:left-40"
          fill="white"
        /> */}
        {/* <CustomMouseFollower className="hidden lg:block" /> */}
        {/* <BackgroundRippleEffect /> */}

        {/* Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50 max-w-3xl mx-auto">
          <Navbar />
        </div>

        <div className="relative pt-16">
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-0">
            <section id="hero" className="relative w-full">
              <IsometricBg />
              <Hero />
            </section>

            <DeferredSection id="about" minHeight={440}>
              <About isDark={isDark} />
            </DeferredSection>
            <DeferredSection id="experience" minHeight={520}>
              <Experience />
            </DeferredSection>
            <DeferredSection id="github" minHeight={420}>
              <GitHubStats />
            </DeferredSection>
            <DeferredSection id="projects" minHeight={600}>
              <Projects />
            </DeferredSection>
            <DeferredSection id="namehover" minHeight={360}>
              <NameHover isDark={isDark} />
            </DeferredSection>
            <DeferredSection id="paperwork" minHeight={480}>
              <Paperwork />
            </DeferredSection>

            <DeferredSection id="visitors" minHeight={440}>
              <VisitorAnalytics />
            </DeferredSection>
            
            <DeferredSection id="contact" minHeight={320}>
              <Elevation isDark={isDark} />
            </DeferredSection>

            <DeferredSection id="contact" minHeight={260}>
              <Footer />
            </DeferredSection>
          </div>
        </div>
        <TableOfContents />
      </div>
    </>
  );
};

export default Home;
