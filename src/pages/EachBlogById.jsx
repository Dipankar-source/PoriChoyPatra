import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Clock,
  Calendar,
  ExternalLink,
  ArrowLeft,
  Check,
  Zap,
  Shield,
  Code,
  Palette,
  Smartphone,
} from "lucide-react";

// Context & Assets
import { useTheme } from "@/context/ThemeContext";
import assets from "@/assets/assets";

// Components
import CustomMouseFollower from "@/componants/CustomMouseFollower";
import FooterSystem from "@/componants/Footer";
import Navbar from "@/componants/Navbar";

// UI Components (Dynamic Imports)
import IOSBentoGrid from "@/uicomponents/bentos/ios-bento-grid";
import PremiumNavbar from "@/uicomponents/navbars/premium-navbar";
import ChronosCardDemo from "@/uicomponents/cards/chronosCardDemo";
import IOSSettingsAccordion from "@/uicomponents/accordion/ios-accordion";

/* -------------------------------------------------------------------------- */
/* DATA & UTILS                                */
/* -------------------------------------------------------------------------- */

// Simulate fetching blog data
const fetchBlogData = async (blogId) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allBlogsData = {
    blogs: {
      1: {
        id: 1,
        title: "A Premium Navbar Design",
        excerpt:
          "A clean and premium navbar built to improve first impressions.",
        date: "December 07, 2025",
        readTime: "5m",
        category: "Design",
        author: "Dipankar Barik",
        authorRole: "Frontend Developer",
        websiteUrl: "https://www.npmjs.com/package/ishani-ui/",
        image: assets.NavbarComponent,
        content: `
        <h2 class="text-2xl font-bold mb-4 mt-6">Why a Good Navbar Matters</h2>
        <p class="mb-4">
          A navbar is often the first thing users notice on a website. It helps people
          understand where they are and how to move around. A clean and well-designed
          navbar makes the site feel more trustworthy and easy to use.
        </p>

        <h3 class="text-xl font-semibold mb-3 mt-6">Design Focus</h3>
        <p class="mb-4">
          This navbar is designed with a premium look using glass-style effects and
          smooth interactions. The goal is to keep it modern, simple, and visually
          pleasing without distracting the user.
        </p>

        <p class="mb-4">
          It works well on all screen sizes and supports both light and dark modes,
          making it a solid choice for modern websites and portfolios.
        </p>
      `,
        showComponent: true,
        componentDescription:
          "A premium navbar with a glass-style look and smooth interactions.",
        componentType: "PremiumNavbar",
        componentProps: {
          variant: "premium",
          showLogo: true,
          menuItems: ["Home", "Features", "Pricing", "About", "Contact"],
        },
        keyFeatures: [
          "Modern glass-style design",
          "Smooth hover effects",
          "Mobile-friendly layout",
          "Light and dark mode support",
        ],
        featureIcons: ["Palette", "Zap", "Smartphone", "Code"],
      },
      2: {
        id: 2,
        title: "iOS Bento Grid",
        excerpt:
          "An iOS-inspired bento grid to present content in a clean and modern way.",
        date: "December 10, 2025",
        readTime: "8m",
        category: "Design",
        author: "Dipankar Barik",
        authorRole: "Frontend Engineer",
        websiteUrl: "https://www.npmjs.com/package/ishani-ui/",
        image: assets.IOSBento,
        content: `
    <h2 class="text-2xl font-bold mb-4 mt-6">Inspired by iOS Design</h2>
    <p class="mb-4">
      The iOS Bento Grid is inspired by how Apple presents content in a clean,
      organized, and visually pleasing way. It helps break information into
      small sections that are easy to scan and understand.
    </p>

    <h3 class="text-xl font-semibold mb-3 mt-6">Why Use a Bento Grid</h3>
    <p class="mb-4">
      Instead of long sections of text, a bento grid allows you to showcase
      features, projects, or highlights in separate blocks. This makes the
      layout feel lighter and more engaging.
    </p>

    <p class="mb-4">
      This component is responsive and works smoothly across devices, making it
      a good choice for landing pages, portfolios, and feature sections.
    </p>
  `,
        showComponent: true,
        componentDescription:
          "An iOS-style bento grid layout designed for clean and modern layouts.",
        componentType: "IOSBentoGrid",
        componentProps: {},
        keyFeatures: [
          "iOS-inspired layout",
          "Clean and modern look",
          "Smooth hover interactions",
          "Responsive across devices",
        ],
        featureIcons: ["Palette", "Smartphone", "Zap", "Code"],
      },
      3: {
        id: 3,
        title: "Chronos 3D Card Experience",
        excerpt:
          "A smooth 3D card that adds depth, motion, and life to your UI.",
        date: "December 08, 2025",
        readTime: "7m",
        category: "Frontend",
        author: "Dipankar Barik",
        authorRole: "Frontend Developer",
        websiteUrl: "https://www.npmjs.com/package/ishani-ui/",
        image: assets.ChronosCard,
        content: `
    <h2 class="text-2xl font-bold mb-4 mt-6">A Card That Feels Alive</h2>
    <p class="mb-4">
      Chronos is not a static card. It reacts to cursor movement and creates a
      subtle 3D depth that makes the interface feel more interactive and premium.
      The motion is smooth and controlled, not distracting.
    </p>

    <h3 class="text-xl font-semibold mb-3 mt-6">Built for Modern Interfaces</h3>
    <p class="mb-4">
      This card is designed to work as a flexible container. You can place any
      content inside it — text, icons, stats, or buttons — and the card will handle
      the animation and depth automatically.
    </p>

    <p class="mb-4">
      It fits perfectly in landing pages, feature sections, and product highlights
      where you want to add a bit of motion without overdoing it.
    </p>
  `,
        showComponent: true,
        componentDescription:
          "An interactive 3D card with smooth motion and depth-based hover effects.",
        componentType: "ChronosCardDemo",
        componentProps: {},
        keyFeatures: [
          "Smooth 3D tilt interaction",
          "Cursor-based motion response",
          "Works with any content",
          "Light and dark mode support",
        ],
        featureIcons: ["Zap", "Palette", "Smartphone", "Code"],
      },
      4: {
        id: 4,
        title: "iOS-Style Premium Accordion",
        excerpt:
          "A smooth and premium accordion inspired by iOS settings design.",
        date: "December 05, 2025",
        readTime: "7m",
        category: "Frontend",
        author: "Dipankar Barik",
        authorRole: "Frontend Developer",
        websiteUrl: "https://www.npmjs.com/package/ishani-ui/",
        image: assets.IOSAccordion,
        content: `
    <h2 class="text-2xl font-bold mb-4 mt-6">Inspired by iOS Settings</h2>
    <p class="mb-4">
      This accordion takes inspiration from the iOS settings screen, where
      information is neatly organized and easy to scan. It helps present
      content in a clean and structured way without overwhelming the user.
    </p>

    <h3 class="text-xl font-semibold mb-3 mt-6">Smooth and Focused Interaction</h3>
    <p class="mb-4">
      Each section opens and closes smoothly, making the interaction feel
      natural and responsive. The animation is subtle, keeping the focus on
      the content instead of flashy effects.
    </p>

    <p class="mb-4">
      This component works well for FAQs, settings pages, feature lists, and
      any place where content needs to stay organized and readable.
    </p>
  `,
        showComponent: true,
        componentDescription:
          "An iOS-inspired accordion with smooth transitions and a premium feel.",
        componentType: "IOSSettingsAccordion",
        componentProps: {},
        keyFeatures: [
          "iOS-style layout and spacing",
          "Smooth open and close animations",
          "Clean and readable structure",
          "Light and dark mode support",
        ],
        featureIcons: ["Palette", "Smartphone", "Zap", "Code"],
      },
    },
  };

  const blog = allBlogsData.blogs[blogId];

  if (!blog) {
    return {
      blog: allBlogsData.blogs[1],
      related: [],
    };
  }

  const related = Object.values(allBlogsData.blogs)
    .filter((post) => post.id !== blogId)
    .slice(0, 2);

  return {
    blog,
    related,
  };
};

/* -------------------------------------------------------------------------- */
/* SUB-COMPONENTS                                  */
/* -------------------------------------------------------------------------- */

// Tilted Lines Separator Component
const TiltedDivider = () => {
  const { isDark } = useTheme();
  // CSS pattern for diagonal lines
  const lineColor = isDark
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(0, 0, 0, 0.08)";

  return (
    <div className="w-full h-8 my-10 relative overflow-hidden flex items-center justify-center">
      {/* Mask fade out at edges */}
      <div
        className={`absolute inset-0 z-10 bg-gradient-to-r ${isDark
          ? "from-[#050505] via-transparent to-[#050505]"
          : "from-white via-transparent to-white"
          }`}
      />

      {/* The Tilted Pattern */}
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 4px,
                    ${lineColor} 4px,
                    ${lineColor} 5px
                )`,
        }}
      />
    </div>
  );
};

// Icon Mapper
const iconComponents = {
  Check: Check,
  Zap: Zap,
  Shield: Shield,
  Code: Code,
  Palette: Palette,
  Smartphone: Smartphone,
};

const getIconComponent = (iconName) => {
  const IconComponent = iconComponents[iconName] || Check;
  return <IconComponent className="w-4 h-4" />;
};

// Component Mapper
const getComponentByType = (componentType, props = {}) => {
  const components = {
    PremiumNavbar: <PremiumNavbar {...props} />,
    IOSBentoGrid: <IOSBentoGrid {...props} />,
    ChronosCardDemo: <ChronosCardDemo {...props} />,
    IOSSettingsAccordion: <IOSSettingsAccordion {...props} />,
  };

  return (
    components[componentType] || (
      <div className="p-4 border border-dashed border-red-500 rounded text-red-500 text-center text-sm">
        Component "{componentType}" not found.
      </div>
    )
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                 */
/* -------------------------------------------------------------------------- */

const EachBlogById = () => {
  const { isDark } = useTheme();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const navigate = useNavigate();

  // --- Styles ---
  const borderColor = isDark ? "border-white/10" : "border-black/10";
  const textColor = isDark ? "text-white" : "text-zinc-900";
  const subText = isDark ? "text-zinc-400" : "text-zinc-500";
  const bgMain = isDark ? "bg-[#050505]" : "bg-white";
  const contentTextColor = isDark ? "text-zinc-300" : "text-zinc-700";
  const cardTitleColor = isDark ? "text-zinc-100" : "text-zinc-900";
  const cardExcerptColor = isDark ? "text-zinc-400" : "text-zinc-600";

  const backButtonColor = isDark
    ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
    : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-600/10";

  // --- Effects ---
  useEffect(() => {
    const loadBlog = async () => {
      setLoading(true);
      try {
        const blogId = params.id ? parseInt(params.id) : 1;
        const data = await fetchBlogData(blogId);

        if (data.blog) {
          setBlog(data.blog);
          setRelatedPosts(data.related || []);
        }
      } catch (error) {
        console.error("Error loading blog:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBlog();
    window.scrollTo(0, 0);
  }, [params.id]);

  // --- Helper Renders ---
  const renderKeyFeatures = (features = [], icons = []) => {
    if (!features || features.length === 0) return null;
    return (
      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-emerald-500">
          <Zap className="w-4 h-4" />
          Key Features
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <span
                className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center mt-0.5 ${isDark
                  ? "bg-zinc-800 text-zinc-300"
                  : "bg-zinc-100 text-zinc-600"
                  }`}
              >
                {getIconComponent(icons[index] || "Check")}
              </span>
              <span className={`text-sm leading-relaxed ${contentTextColor}`}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDynamicComponent = () => {
    if (!blog.showComponent) return null;
    return (
      <div className="mb-12">
        <div
          className={`flex flex-col gap-0 rounded-2xl border ${borderColor} ${isDark ? "bg-zinc-900/20" : "bg-zinc-50"
            } overflow-hidden`}
        >
          {/* Top: Component Preview */}
          <div className="w-full flex flex-col">
            <div
              className={`px-6 py-4 border-b ${borderColor} flex items-center justify-between bg-zinc-500/5`}
            >
              <span className={`text-sm font-semibold ${textColor}`}>
                Live Preview
              </span>
              <span
                className={`text-xs font-mono px-2 py-1 rounded ${isDark
                  ? "bg-zinc-800 text-zinc-400"
                  : "bg-zinc-200 text-zinc-600"
                  }`}
              >
                {blog.componentType}.jsx
              </span>
            </div>

            <div className="relative min-h-[350px] flex items-center justify-center p-8 overflow-hidden">
              {/* Background Pattern */}
              <div
                className={`absolute inset-0 ${isDark
                  ? "bg-[radial-gradient(#ffffff05_1px,transparent_1px)]"
                  : "bg-[radial-gradient(#00000005_1px,transparent_1px)]"
                  } [background-size:16px_16px]`}
              ></div>

              <div className="relative z-10 w-full w-full">
                {getComponentByType(blog.componentType, blog.componentProps)}
              </div>
            </div>
          </div>

          {/* Bottom: Info Side (Full Width) */}
          <div
            className={`w-full p-6 border-t ${borderColor} ${isDark ? "bg-zinc-900/40" : "bg-white"
              }`}
          >
            <h3 className={`font-semibold mb-2 ${textColor}`}>
              About Component
            </h3>
            <p className={`text-sm mb-6 ${subText}`}>
              {blog.componentDescription}
            </p>
            {renderKeyFeatures(blog.keyFeatures, blog.featureIcons)}
          </div>
        </div>
      </div>
    );
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className={`min-h-screen ${bgMain} lg:mx-92`}>
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 lg:px-0 py-20 animate-pulse">
          <div
            className={`h-8 w-32 mb-6 rounded ${isDark ? "bg-zinc-800" : "bg-zinc-200"
              }`}
          ></div>
          <div
            className={`h-16 w-3/4 mb-4 rounded ${isDark ? "bg-zinc-800" : "bg-zinc-200"
              }`}
          ></div>
          <div
            className={`h-6 w-1/2 mb-12 rounded ${isDark ? "bg-zinc-800" : "bg-zinc-200"
              }`}
          ></div>
          <div
            className={`h-96 w-full rounded-xl ${isDark ? "bg-zinc-900" : "bg-zinc-100"
              }`}
          ></div>
        </div>
      </div>
    );
  }

  // --- Not Found State ---
  if (!blog) {
    return (
      <div
        className={`min-h-screen ${bgMain} flex flex-col items-center justify-center`}
      >
        <Navbar />
        <h1 className={`text-2xl font-bold mb-4 ${textColor}`}>
          Post Not Found
        </h1>
        <button
          onClick={() => navigate("/blog")}
          className="text-emerald-500 hover:underline"
        >
          Return to Blog
        </button>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ease-in-out overflow-x-hidden  ${bgMain} ${textColor} font-sans`}
    >
      {/* <CustomMouseFollower className="hidden lg:block" /> */}

      <div
        className={`lg:mx-92 ${bgMain} min-h-screen flex flex-col border-1 ${borderColor}`}
      >
        {/* Fixed Navbar Wrapper */}
        <div className="fixed top-0 left-0 right-0 z-50 lg:ml-92 lg:mr-92">
          <Navbar />
        </div>

        <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-0 py-8 mt-20">
          {/* Back Button */}
          <div className="max-w-3xl mx-auto mb-10">
            <button
              onClick={() => navigate("/blog")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${borderColor} ${backButtonColor} transition-all duration-300 text-sm font-medium`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>
          </div>

          {/* Article Header */}
          <article className="max-w-3xl mx-auto">
            <header className="mb-10 text-center md:text-left">
              <div
                className={`flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono uppercase tracking-widest mb-6 ${subText}`}
              >
                <span
                  className={`px-3 py-1 rounded-full ${isDark
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                >
                  {blog.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {blog.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {blog.readTime} Read
                </span>
              </div>

              <h1
                className={`text-4xl md:text-5xl font-bold leading-tight mb-6 ${cardTitleColor}`}
              >
                {blog.title}
              </h1>

              <p className={`text-xl leading-relaxed mb-8 ${cardExcerptColor}`}>
                {blog.excerpt}
              </p>

              {/* Author Info */}
              <div
                className={`flex items-center justify-center md:justify-start gap-4 pt-6 border-t ${borderColor}`}
              >
                <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden">
                  <img
                    src="/Logo.webp"
                    alt="Author"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <h3 className={`font-semibold text-sm ${textColor}`}>
                    {blog.author}
                  </h3>
                  <p className={`text-xs ${subText}`}>{blog.authorRole}</p>
                </div>
              </div>
            </header>

            {/* Separator 1 */}
            <TiltedDivider />

            {/* Content Body */}
            <div className="prose-container relative">
              {renderDynamicComponent()}

              <div
                className={`prose prose-lg max-w-none ${contentTextColor} ${isDark ? "prose-invert" : ""
                  } prose-headings:font-bold prose-a:text-emerald-500 hover:prose-a:text-emerald-400`}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* Call to Action */}
            <div
              className={`mt-16 p-8 rounded-2xl border ${borderColor} ${isDark
                ? "bg-gradient-to-br from-zinc-900 to-zinc-950"
                : "bg-gradient-to-br from-zinc-50 to-white"
                }`}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${textColor}`}>
                    Interested in the details?
                  </h3>
                  <p className={`text-sm ${subText}`}>
                    Check out the documentation or source code.
                  </p>
                </div>
                {blog.websiteUrl && (
                  <button
                    onClick={() => window.open(blog.websiteUrl, "_blank")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Visit Resource <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </article>

          {/* Separator 2 */}
          <div className="max-w-4xl mx-auto">
            <TiltedDivider />
          </div>

          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <section className="max-w-4xl mx-auto mt-8 px-4">
              <h2 className={`text-2xl font-bold mb-8 ${textColor}`}>
                Read Next
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <div
                    key={relatedPost.id}
                    onClick={() => navigate(`/blog/${relatedPost.id}`)}
                    className={`group cursor-pointer p-6 rounded-2xl border ${borderColor} ${isDark
                      ? "bg-zinc-900/40 hover:bg-zinc-900"
                      : "bg-white hover:bg-zinc-50"
                      } transition-all duration-300 hover:scale-[1.02]`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest mb-4">
                      <span className="text-emerald-500">
                        {relatedPost.category}
                      </span>
                      <span className={subText}>{relatedPost.readTime}</span>
                    </div>
                    <h3
                      className={`text-lg font-bold mb-2 group-hover:text-emerald-500 transition-colors ${cardTitleColor}`}
                    >
                      {relatedPost.title}
                    </h3>
                    <p className={`text-sm line-clamp-2 ${cardExcerptColor}`}>
                      {relatedPost.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      Read Article <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-zinc-200 dark:border-zinc-800">
          <FooterSystem />
        </div>
      </div>
    </div>
  );
};

export default EachBlogById;
