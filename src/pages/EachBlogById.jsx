"use client";
import assets from "@/assets/assets";
import CustomMouseFollower from "@/componants/CustomMouseFollower";
import FooterSystem from "@/componants/Footer";
import Navbar from "@/componants/Navbar";
import { useTheme } from "@/context/ThemeContext";
import PremiumNavbar from "@/uicomponents/navbars/premium-navbar";
import {
  ArrowUpRight,
  Clock,
  Calendar,
  User,
  ExternalLink,
  ArrowLeft,
  Check,
  Zap,
  Shield,
  Code,
  Palette,
  Smartphone,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Simulate fetching blog data from an external source
const fetchBlogData = async (blogId) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allBlogsData = {
    blogs: {
      1: {
        id: 1,
        title: "A Premium Navbar Design",
        excerpt: "Navbar design to serve a great user experience.",
        date: "December 07, 2025",
        readTime: "5m",
        category: "Design",
        author: "Dipankar Barik",
        authorRole: "Lead Designer",
        websiteUrl: "https://www.npmjs.com/package/ishani-ui/",
        image: assets.NavbarComponent,
        content: `
          <h2 class="text-2xl font-bold mb-4 mt-6">The Evolution of Digital Identity</h2>
          <p class="mb-4">Digital identity has undergone a remarkable transformation over the past decade. What began as simple username-password combinations has evolved into sophisticated, decentralized systems that prioritize user privacy and security.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">From Physical to Digital</h3>
          <p class="mb-4">The shift from physical identification cards to digital proofs represents more than just technological advancement – it's a fundamental change in how we establish trust and verify identity in the digital realm.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">Decentralized Identity Systems</h3>
          <p class="mb-4">Modern decentralized identity solutions allow users to maintain control over their personal data while still being able to prove specific claims about themselves without revealing unnecessary information.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">Future Implications</h3>
          <p class="mb-4">As we move toward Web 3.0, digital identity will become increasingly important for authentication, authorization, and establishing reputation across various platforms and services.</p>
        `,
        showComponent: true,
        componentDescription:
          "This is the premium navbar component that we've been discussing. It features a glass-morphism effect with smooth animations and a responsive mobile menu.",
        componentType: "PremiumNavbar",
        keyFeatures: [
          "Glass-morphism effect with backdrop blur",
          "Smooth hover animations and transitions",
          "Responsive mobile menu with hamburger icon",
          "Scroll-based behavior changes",
          "Gradient backgrounds and noise textures",
          "Accessible keyboard navigation",
          "Light and dark mode support",
        ],
        featureIcons: ["Palette", "Zap", "Smartphone", "Code", "Shield"],
        componentProps: {
          variant: "premium",
          showLogo: true,
          menuItems: ["Home", "Features", "Pricing", "About", "Contact"],
        },
      },
      2: {
        id: 2,
        title: "React Performance Optimization",
        excerpt: "Deep dive into server components & memoization.",
        date: "December 10, 2023",
        readTime: "8m",
        category: "Engineering",
        author: "Sarah Chen",
        authorRole: "Senior Frontend Engineer",
        websiteUrl: "https://example.com/react-performance",
        image:
          "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2670&auto=format&fit=crop",
        content: `
          <h2 class="text-2xl font-bold mb-4 mt-6">Mastering React Performance</h2>
          <p class="mb-4">Performance optimization in React applications is crucial for delivering smooth user experiences. This comprehensive guide covers advanced techniques and best practices.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">Server Components Revolution</h3>
          <p class="mb-4">React Server Components represent a paradigm shift in how we build applications, allowing us to reduce bundle sizes and improve initial load times significantly.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">Memoization Strategies</h3>
          <p class="mb-4">Proper use of React.memo, useMemo, and useCallback can dramatically reduce unnecessary re-renders and improve application responsiveness.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">Code Splitting Techniques</h3>
          <p class="mb-4">Implementing effective code splitting strategies ensures users only download the JavaScript they need for the current view, reducing initial load times.</p>
        `,
        showComponent: false,
        keyFeatures: [
          "React Server Components implementation",
          "Memoization with useMemo and useCallback",
          "Code splitting with React.lazy()",
          "Virtualization for large lists",
          "Bundle size optimization techniques",
        ],
        featureIcons: ["Zap", "Code", "Shield"],
      },
      3: {
        id: 3,
        title: "Building Accessible Web Applications",
        excerpt: "Essential guidelines for creating inclusive web experiences.",
        date: "February 22, 2024",
        readTime: "7m",
        category: "Accessibility",
        author: "Maria Rodriguez",
        authorRole: "Accessibility Specialist",
        websiteUrl: "https://example.com/accessibility",
        image:
          "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1000&auto=format&fit=crop",
        content: `
          <h2 class="text-2xl font-bold mb-4 mt-6">Creating Inclusive Web Experiences</h2>
          <p class="mb-4">Accessibility should be a core consideration in every web project, not an afterthought. This guide covers essential practices for building websites that everyone can use.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">Semantic HTML Structure</h3>
          <p class="mb-4">Using proper HTML elements is the foundation of accessibility, providing meaningful structure for screen readers and other assistive technologies.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">Keyboard Navigation</h3>
          <p class="mb-4">All interactive elements should be fully operable using only a keyboard, ensuring accessibility for users with motor impairments.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">ARIA Attributes</h3>
          <p class="mb-4">ARIA (Accessible Rich Internet Applications) attributes provide additional context and functionality when native HTML isn't sufficient.</p>
        `,
        showComponent: false,
        keyFeatures: [
          "Semantic HTML implementation",
          "Keyboard navigation support",
          "ARIA attributes for complex components",
          "Color contrast compliance (WCAG 2.1)",
          "Screen reader compatibility",
          "Focus management strategies",
        ],
        featureIcons: ["Shield", "Smartphone", "Check"],
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

// Icon mapping for dynamic icons
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

// Function to get component by type
const getComponentByType = (componentType, props = {}) => {
  const components = {
    PremiumNavbar: <PremiumNavbar {...props} />,
  };

  return components[componentType] || <div>Component not found</div>;
};

// Function to render key features dynamically
const renderKeyFeatures = (features = [], icons = []) => {
  if (!features || features.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5" />
        Key Features
      </h4>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mt-0.5">
              {getIconComponent(icons[index] || "Check")}
            </span>
            <span className="text-sm leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const EachBlogById = () => {
  const { isDark } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setIsClient(true);

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
  }, [params.id]);

  const borderColor = isDark ? "border-white/10" : "border-black/10";
  const textColor = isDark ? "text-white" : "text-zinc-900";
  const subText = isDark ? "text-zinc-400" : "text-zinc-500";
  const bgMain = isDark ? "bg-[#050505]" : "bg-white";
  const cardTitleColor = isDark ? "text-zinc-100" : "text-zinc-900";
  const cardExcerptColor = isDark ? "text-zinc-400" : "text-zinc-600";
  const contentTextColor = isDark ? "text-zinc-300" : "text-zinc-700";
  const backButtonColor = isDark
    ? "text-emerald-400 hover:text-emerald-300"
    : "text-emerald-600 hover:text-emerald-700";

  if (!isClient) {
    return (
      <div className={`min-h-screen ${bgMain} lg:mx-92`}>
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 lg:px-0 py-7">
          <div className="animate-pulse space-y-6">
            <div
              className={`h-10 w-48 ${
                isDark ? "bg-zinc-900" : "bg-zinc-100"
              } rounded`}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${bgMain} lg:mx-92`}>
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 lg:px-0 py-20">
          <div className="animate-pulse space-y-8">
            <div
              className={`h-12 w-64 ${
                isDark ? "bg-zinc-900" : "bg-zinc-100"
              } rounded`}
            ></div>
            <div className="space-y-4">
              <div
                className={`h-6 w-full ${
                  isDark ? "bg-zinc-900" : "bg-zinc-100"
                } rounded`}
              ></div>
              <div
                className={`h-6 w-5/6 ${
                  isDark ? "bg-zinc-900" : "bg-zinc-100"
                } rounded`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={`min-h-screen ${bgMain} lg:mx-92`}>
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 lg:px-0 py-20">
          <div className="text-center">
            <h1 className={`text-3xl font-bold mb-4 ${textColor}`}>
              Blog Post Not Found
            </h1>
            <p className={`mb-6 ${subText}`}>
              The blog post you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/blog")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${borderColor} ${backButtonColor} transition-colors duration-300`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleVisitWebsite = () => {
    if (blog.websiteUrl) {
      window.open(blog.websiteUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Render dynamic component if needed
  const renderDynamicComponent = () => {
    if (!blog.showComponent) return null;

    return (
      <>
        <div className="mb-8">
          <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>
            Component Demo
          </h3>
          <p className={`mb-6 ${contentTextColor}`}>
            {blog.componentDescription || "Interactive component demonstration"}
          </p>

          <div
            className={`relative rounded-xl p-6 border ${borderColor} ${
              isDark ? "bg-zinc-900/30" : "bg-zinc-50/50"
            } overflow-hidden mb-8`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 pointer-events-none" />
            <div className="relative z-10">
              <div className={`mb-4 text-sm font-mono ${subText}`}>
                <span className="px-2 py-1 rounded bg-zinc-800/50">
                  {blog.componentType || "Component"}.jsx
                </span>
              </div>
              <div className="relative min-h-[200px] flex items-center justify-center p-4">
                <div className="w-full max-w-4xl transform scale-90 lg:scale-100">
                  {getComponentByType(
                    blog.componentType || "PremiumNavbar",
                    blog.componentProps || {}
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Key Features Section */}
          <div
            className={`p-6 rounded-lg border ${borderColor} ${
              isDark ? "bg-zinc-900/20" : "bg-zinc-50"
            } mb-8`}
          >
            {blog.keyFeatures && blog.keyFeatures.length > 0 ? (
              renderKeyFeatures(blog.keyFeatures, blog.featureIcons)
            ) : (
              <div>
                <h4 className={`font-semibold mb-3 ${textColor}`}>
                  Key Features
                </h4>
                <ul className={`space-y-2 ${contentTextColor} text-sm`}>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Responsive design
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Modern UI/UX
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Cross-browser compatibility
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ease-in-out overflow-x-hidden ${bgMain} ${textColor} font-sans`}
    >
      <CustomMouseFollower className="hidden lg:block" />
      <div className={`lg:mx-92 ${bgMain}`}>
        <div className="fixed top-0 left-0 right-0 z-50 lg:ml-92 lg:mr-92">
          <Navbar />
        </div>

        <main className="w-full px-4 sm:px-6 md:px-8 lg:px-0 py-8 border-1 mt-15">
          <div className="mb-8 lg:px-5">
            <button
              onClick={() => navigate("/blog")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${borderColor} ${backButtonColor} transition-colors duration-300 hover:border-emerald-500/50`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>
          </div>

          <div className="mb-12">
            <div
              className={`flex items-center justify-between text-xs font-mono uppercase tracking-widest mb-4 lg:px-5 ${subText}`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full ${
                    isDark
                      ? "bg-emerald-900/30 text-emerald-400"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {blog.category}
                </span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>{blog.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>{blog.readTime} READ</span>
                </div>
              </div>
            </div>

            <h1
              className={`text-4xl md:text-5xl font-bold leading-tight mb-6 lg:px-5 ${cardTitleColor}`}
            >
              {blog.title}
            </h1>

            <p
              className={`text-xl md:text-2xl leading-relaxed mb-8 lg:px-5 ${cardExcerptColor}`}
            >
              {blog.excerpt}
            </p>

            <div
              className={`flex items-center gap-4 p-4 rounded-lg border ${borderColor} lg:px-5`}
            >
              <div
                className={`w-12 h-12 rounded-full ${
                  isDark ? "bg-zinc-800" : "bg-zinc-100"
                } flex items-center justify-center`}
              >
                <User
                  className={`w-6 h-6 ${
                    isDark ? "text-zinc-400" : "text-zinc-600"
                  }`}
                />
              </div>
              <div>
                <h3 className={`font-semibold ${textColor}`}>{blog.author}</h3>
                <p className={`text-sm ${subText}`}>{blog.authorRole}</p>
              </div>
            </div>
          </div>

          <div className={`w-full border-t border-b py-12 ${borderColor}`}>
            <div className="w-full mb-12">
              <div className="max-w-3xl mx-auto px-4 lg:px-0">
                {blog.showComponent && renderDynamicComponent()}

                <div
                  className={`prose prose-lg max-w-none ${contentTextColor} ${
                    isDark ? "prose-invert" : ""
                  }`}
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
            </div>
          </div>

          <div className={`w-full border-t py-8 ${borderColor}`}>
            <div className="max-w-3xl mx-auto px-4 lg:px-0">
              <div
                className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-xl border ${borderColor} ${
                  isDark ? "bg-zinc-900/50" : "bg-zinc-50/50"
                }`}
              >
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>
                    Want to learn more?
                  </h3>
                  <p className={subText}>
                    Visit the official website for additional resources and
                    updates.
                  </p>
                </div>
                <button
                  onClick={handleVisitWebsite}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${
                    isDark
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  } transition-colors duration-300 font-medium`}
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className={`text-2xl font-bold mb-8 lg:px-5 ${textColor}`}>
                More from Blog
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:px-5">
                {relatedPosts.map((relatedPost) => (
                  <div
                    key={relatedPost.id}
                    onClick={() => navigate(`/blog/${relatedPost.id}`)}
                    className={`group cursor-pointer p-6 rounded-xl border ${borderColor} ${
                      isDark ? "hover:bg-zinc-900/50" : "hover:bg-zinc-50/50"
                    } transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest mb-3 text-zinc-500">
                      <span
                        className={
                          isDark ? "text-emerald-400" : "text-emerald-600"
                        }
                      >
                        {relatedPost.category}
                      </span>
                      <span>
                        {relatedPost.date.split(" ")[0] +
                          " " +
                          relatedPost.date.split(" ")[1]}
                      </span>
                    </div>
                    <h3
                      className={`text-xl font-semibold mb-2 group-hover:text-emerald-500 transition-colors duration-300 ${cardTitleColor}`}
                    >
                      {relatedPost.title}
                    </h3>
                    <p className={`text-sm mb-4 ${cardExcerptColor}`}>
                      {relatedPost.excerpt}
                    </p>
                    <div
                      className={`flex items-center gap-2 text-xs text-zinc-500 font-mono`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{relatedPost.readTime} READ</span>
                      <ArrowUpRight className="w-3 h-3 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <div className="border-l-1 border-r-1">
          <FooterSystem />
        </div>
      </div>
    </div>
  );
};

export default EachBlogById;
