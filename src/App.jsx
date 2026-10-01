import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { LoaderOverlay } from "@/components/ui/loader";

const PageViewTracker = lazy(() => import("@/components/PageViewTracker"));
const GoogleAdSlot = lazy(() =>
  import("@/components/google-ads").then((module) => ({
    default: module.GoogleAdSlot,
  })),
);

const googleAdSlot = import.meta.env.VITE_GOOGLE_ADS_SLOT || "8636273498";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Blog = lazy(() => import("./pages/Blog"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./componants/Contact"));
const EachBlogById = lazy(() => import("./pages/EachBlogById"));

const GlobalLoader = () => <LoaderOverlay messages="Loading..." />;

const App = () => {
  const { pathname } = useLocation();
  // Scroll to top component
  function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  }
  return (
    <div className="min-h-screen bg-[#F7F7F4] transition-colors duration-300 dark:bg-[#0F0F0F]">
      <ScrollToTop />
      <ThemeProvider>
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        <Suspense fallback={null}>
          <GoogleAdSlot
            slot={googleAdSlot}
            className={pathname === "/" ? "hidden md:block" : undefined}
          />
        </Suspense>
        <Suspense fallback={<GlobalLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog/:id" element={<EachBlogById />} />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </div>
  );
};

export default App;
