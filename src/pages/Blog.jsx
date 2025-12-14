"use client";
import assets from "@/assets/assets";
import CustomMouseFollower from "@/componants/CustomMouseFollower";
import FooterSystem from "@/componants/Footer";
import Navbar from "@/componants/Navbar";
import { useTheme } from "@/context/ThemeContext";
import { PremiumSearch } from "@/uicomponents/searchs/premium-search";
import { ArrowUpRight, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BLOG_POSTS = [
  {
    id: 1,
    title: "A Premium Navbar Design",
    excerpt: "Navbar design to serve a great user experience.",
    date: "Dec 07",
    readTime: "5m",
    category: "Design",
    image: assets.NavbarComponent,
  },
  {
    id: 2,
    title: "React Performance",
    excerpt: "Deep dive into server components & memoization.",
    date: "Dec 10",
    readTime: "8m",
    category: "Eng",
    image:
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Dark Mode UX",
    excerpt: "Why users prefer dark interfaces.",
    date: "Dec 08",
    readTime: "6m",
    category: "UX",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Scalable APIs",
    excerpt: "Designing endpoints for millions of requests.",
    date: "Dec 05",
    readTime: "12m",
    category: "Backend",
    image:
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=2574&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "AI in Web Development",
    excerpt: "How AI tools are changing frontend development.",
    date: "Dec 03",
    readTime: "7m",
    category: "AI",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2574&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Modern CSS Techniques",
    excerpt: "Exploring grid, flexbox, and container queries.",
    date: "Dec 01",
    readTime: "10m",
    category: "Frontend",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop",
  },
];

const Blog = () => {
  const { isDark } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    setIsClient(true);
    setPosts([...BLOG_POSTS]);
  }, []);

  const borderColor = isDark ? "border-white/10" : "border-black/10";
  const textColor = isDark ? "text-white" : "text-zinc-900";
  const subText = isDark ? "text-zinc-400" : "text-zinc-500";
  const bgMain = isDark ? "bg-[#050505]" : "bg-white";
  const separatorBg = isDark ? "bg-[#0a0a0a]" : "bg-zinc-50/50";
  const cardTitleColor = isDark ? "text-zinc-100" : "text-zinc-900";
  const cardExcerptColor = isDark ? "text-zinc-400" : "text-zinc-600";

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

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
            <div
              className={`h-6 w-96 ${
                isDark ? "bg-zinc-900" : "bg-zinc-100"
              } rounded`}
            ></div>
            <div
              className={`h-12 w-64 ${
                isDark ? "bg-zinc-900" : "bg-zinc-100"
              } rounded`}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  const chunkArray = (myArray, chunk_size) => {
    const results = [];
    const arrCopy = [...myArray];
    while (arrCopy.length) {
      results.push(arrCopy.splice(0, chunk_size));
    }
    return results;
  };

  const chunkedPosts = chunkArray(posts, 2);

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
          <div className="mb-8">
            <h2
              className={`text-3xl md:text-4xl font-medium tracking-tight py-4 flex items-center border-t border-b transition-colors duration-300 lg:px-5 ${borderColor}`}
            >
              Blog
            </h2>
            <p
              className={`mt-3 mb-3 lg:px-5 text-base font-light border-y py-3 transition-colors duration-300 ${borderColor} ${subText}`}
            >
              A collection of design tools and components that hits different.
            </p>
          </div>

          <div
            className={`w-full border-y transition-colors duration-300 ${borderColor} py-4 mb-8`}
          >
            <div className="flex items-center justify-start w-full lg:px-5">
              <PremiumSearch />
            </div>
          </div>

          <div
            className={`w-full flex flex-col border-t border-b transition-colors duration-300 ${borderColor}`}
          >
            {chunkedPosts.map((pair, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {rowIndex > 0 && (
                  <div
                    className={`w-full h-8 border-b relative overflow-hidden transition-colors duration-300 ${separatorBg}`}
                  >
                    <TiltedLines isDark={isDark} />
                  </div>
                )}

                <div className="flex flex-col lg:flex-row w-full relative">
                  <div
                    className={`w-full lg:w-1/2 py-8 lg:py-10 px-4 lg:px-8 transition-colors duration-300 ${borderColor}`}
                  >
                    <div className="max-w-2xl mx-auto">
                      <BlogCard
                        post={pair[0]}
                        cardTitleColor={cardTitleColor}
                        cardExcerptColor={cardExcerptColor}
                        isDark={isDark}
                        onClick={() => handleBlogClick(pair[0].id)}
                      />
                    </div>
                  </div>

                  <div
                    className={`hidden lg:block w-8 border-x relative overflow-hidden flex-shrink-0 transition-colors duration-300 ${separatorBg}`}
                  >
                    <TiltedLines isDark={isDark} />
                  </div>

                  <div
                    className={`lg:hidden w-full h-8 border-y relative overflow-hidden transition-colors duration-300 ${separatorBg}`}
                  >
                    <TiltedLines isDark={isDark} />
                  </div>

                  {pair[1] ? (
                    <div
                      className={`w-full lg:w-1/2 py-8 lg:py-10 px-4 lg:px-8 transition-colors duration-300 ${borderColor}`}
                    >
                      <div className="max-w-2xl mx-auto">
                        <BlogCard
                          post={pair[1]}
                          cardTitleColor={cardTitleColor}
                          cardExcerptColor={cardExcerptColor}
                          isDark={isDark}
                          onClick={() => handleBlogClick(pair[1].id)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`hidden lg:block w-1/2 transition-colors duration-300 ${bgMain}`}
                    />
                  )}
                </div>
              </React.Fragment>
            ))}

            <div
              className={`w-full h-8 border-t relative overflow-hidden transition-colors duration-300 ${separatorBg}`}
            >
              <TiltedLines isDark={isDark} />
            </div>
          </div>
        </main>
        <div className="border-l-1 border-r-1">
          <FooterSystem />
        </div>
      </div>
    </div>
  );
};

const BlogCard = ({
  post,
  isDark,
  cardTitleColor,
  cardExcerptColor,
  onClick,
}) => {
  const categoryColor = isDark ? "text-emerald-400" : "text-emerald-600";
  const borderTopColor = isDark ? "border-gray-700/30" : "border-zinc-300";

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
  };

  return (
    <article
      onClick={handleClick}
      className="group cursor-pointer flex flex-col h-full border-1 p-7 rounded-md hover:border-emerald-500/30 transition-all duration-300"
    >
      <div className="w-full aspect-[1.618/1] overflow-hidden border border-white/10 mb-6 relative bg-zinc-900 rounded-xl group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-all duration-300">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest mb-3 text-zinc-500">
            <span
              className={`transition-colors duration-300 ${categoryColor} font-semibold`}
            >
              {post.category}
            </span>
            <span className="text-zinc-500">{post.date}</span>
          </div>

          <h3
            className={`text-xl md:text-2xl font-bold leading-tight mb-3 group-hover:text-emerald-500 transition-all duration-300 ${cardTitleColor}`}
          >
            {post.title}
          </h3>

          <p
            className={`text-sm md:text-base leading-relaxed line-clamp-3 transition-colors duration-300 ${cardExcerptColor}`}
          >
            {post.excerpt}
          </p>
        </div>

        <div
          className={`flex items-center gap-2 mt-6 pt-4 border-t border-dashed transition-colors duration-300 ${borderTopColor} text-xs text-zinc-500 font-mono`}
        >
          <Clock className="w-4 h-4" />
          <span>{post.readTime} READ</span>
          <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </div>
      </div>
    </article>
  );
};

const TiltedLines = ({ isDark }) => {
  const strokeColor = isDark ? "#ffffff" : "#000000";

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={`lines-${isDark ? "dark" : "light"}`}
            x="0"
            y="0"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M-1,1 l2,-2 M0,6 l6,-6 M5,7 l2,-2"
              stroke={strokeColor}
              strokeWidth="0.5"
              strokeOpacity="0.1"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#lines-${isDark ? "dark" : "light"})`}
        />
      </svg>
    </div>
  );
};

export default Blog;
