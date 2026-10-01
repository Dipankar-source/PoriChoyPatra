import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import Hero from "../componants/Hero";


const About = lazy(() => import("../componants/About"));
const Experience = lazy(() => import("../componants/Experience"));
import Navbar from "../componants/Navbar";
import { useTheme } from "../context/ThemeContext";
const Projects = lazy(() => import("@/componants/Projects"));
const Paperwork = lazy(() => import("@/componants/Paperwork"));
import TableOfContents from "@/componants/TableOfContents";
import PageGridLines from "@/components/PageGridLines";
const Elevation = lazy(() => import("@/componants/FooterElevation"));
const Footer = lazy(() => import("@/componants/Footer"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const VisitorAnalytics = lazy(() => import("@/componants/VisitorAnalytics"));
const GitHubStats = lazy(() => import("@/componants/GitHubStats"));
const NameHover = lazy(() => import("@/componants/NameHover"));

const SectionSkeleton = ({ minHeight }) => (
  <div
    aria-hidden="true"
    className="pointer-events-none relative w-full overflow-hidden px-5 py-6 sm:px-[26px]"
    style={{ minHeight }}
  >
    <div className="animate-pulse rounded-2xl border border-neutral-200/70 bg-white/70 dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="flex items-center gap-4 border-b border-neutral-200/80 px-4 py-4 dark:border-neutral-800">
        <div className="h-11 w-11 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-2/5 rounded-full bg-neutral-200/90 dark:bg-neutral-800" />
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div className="h-3 w-2/3 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-3 w-full rounded-full bg-neutral-200/90 dark:bg-neutral-800" />
        <div className="h-3 w-5/6 rounded-full bg-neutral-200/90 dark:bg-neutral-800" />
        <div className="grid gap-3 pt-2 sm:grid-cols-3">
          <div className="h-28 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-28 rounded-xl bg-neutral-200/90 dark:bg-neutral-800" />
          <div className="h-28 rounded-xl bg-neutral-200/90 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  </div>
);

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
    <section id={id} ref={sectionRef} className="relative w-full">
      <PageGridLines section />
      {isNearViewport ? (
        <Suspense fallback={<SectionSkeleton minHeight={minHeight} />}>
          {children}
        </Suspense>
      ) : (
        <SectionSkeleton minHeight={minHeight} />
      )}
    </section>
  );
};

const Home = () => {
  const { isDark } = useTheme();

  return (
    <>
      <div
        className={`relative mx-auto min-h-screen w-full max-w-[840px] transition-colors duration-300 ${
          isDark ? "dark:bg-[#0F0F0F]" : "bg-[#F7F7F4]"
        }`}
      >
        <PageGridLines />
        <div className="fixed top-0 left-0 right-0 z-50 mx-auto w-full max-w-[840px]">
          <Navbar />
        </div>

        <div className="relative pt-[54px]">
          <div className="relative z-10 w-full">
            <section id="hero" className="relative w-full">
              <Hero />
            </section>

            <DeferredSection id="about" minHeight={440}>
              <About />
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

            <DeferredSection id="testimonials" minHeight={420}>
              <TestimonialsSection />
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
