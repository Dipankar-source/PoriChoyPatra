import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { LoaderFive } from "@/components/ui/loader";
import PageViewTracker from "@/components/PageViewTracker";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Blog = lazy(() => import("./pages/Blog"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./componants/Contact"));
const EachBlogById = lazy(() => import("./pages/EachBlogById"));

const GlobalLoader = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FFFFFF] dark:bg-[#09090B] transition-colors duration-300">
    <LoaderFive text="Loading..." />
  </div>
);

const App = () => {
  // Scroll to top component
  function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  }
  return (
    <div className="bg-[#FFFFFF] dark:bg-[#09090B] transition-colors duration-300">
      <ScrollToTop />
      <ThemeProvider>
        <PageViewTracker />
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
