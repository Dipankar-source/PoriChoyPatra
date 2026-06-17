import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { ThemeProvider } from "./context/ThemeContext";
import Blog from "./pages/Blog";
import Projects from "./pages/Projects";
import { useEffect } from "react";
import Contact from "./componants/Contact";
import EachBlogById from "./pages/EachBlogById";

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
    <div>
      <ScrollToTop />
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/blog" element={<Blog/>} />
          <Route path="/projects" element={<Projects/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/blog/:id" element={<EachBlogById />}/>
        </Routes>
      </ThemeProvider>
    </div>
  );
};

export default App;
