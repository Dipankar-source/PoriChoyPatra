"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Clock,
  Search,
} from "lucide-react";
import assets from "@/assets/assets";
import CustomMouseFollower from "@/componants/CustomMouseFollower";
import FooterSystem from "@/componants/Footer";
import Navbar from "@/componants/Navbar";
import { useTheme } from "@/context/ThemeContext";
import PremiumSort from "@/uicomponents/dropdown/premium-sort";

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
    title: "IOS Bento",
    excerpt: "Experience of IOS in your boredom.",
    date: "Dec 10",
    readTime: "8m",
    category: "Design",
    image: assets.IOSBento,
  },
  {
    id: 3,
    title: "Chronos 3D Card",
    excerpt: "A 3D card that hits different as a ui component.",
    date: "Dec 08",
    readTime: "6m",
    category: "UX",
    image: assets.ChronosCard,
  },
  {
    id: 4,
    title: "IOS Premium Accordion",
    excerpt: "A premium vibe for the persons for those IOS means a lot and great Experience.",
    date: "Dec 05",
    readTime: "12m",
    category: "Frontend",
    image: assets.IOSAccordion,
  },
];

const Blog = () => {
  const { isDark } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest"); 

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredAndSortedPosts = useMemo(() => {
    let result = [...BLOG_POSTS];

    // 1. Search Filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerQuery) ||
          post.category.toLowerCase().includes(lowerQuery) ||
          post.excerpt.toLowerCase().includes(lowerQuery)
      );
    }

    // 2. Sorting Logic
    result.sort((a, b) => {
      // Helper to parse "Dec 07" to Date object (assuming current year)
      const parseDate = (dateStr) =>
        new Date(`${dateStr} ${new Date().getFullYear()}`);
      // Helper to parse "5m" to 5
      const parseTime = (timeStr) => parseInt(timeStr.replace("m", ""), 10);

      switch (sortOption) {
        case "newest":
          return parseDate(b.date) - parseDate(a.date);
        case "oldest":
          return parseDate(a.date) - parseDate(b.date);
        case "a-z":
          return a.title.localeCompare(b.title);
        case "z-a":
          return b.title.localeCompare(a.title);
        case "time-short":
          return parseTime(a.readTime) - parseTime(b.readTime);
        case "time-long":
          return parseTime(b.readTime) - parseTime(a.readTime);
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, sortOption]);

  const chunkArray = (myArray, chunk_size) => {
    const results = [];
    const arrCopy = [...myArray];
    while (arrCopy.length) {
      results.push(arrCopy.splice(0, chunk_size));
    }
    return results;
  };

  const chunkedPosts = chunkArray([...filteredAndSortedPosts], 2);

  // Styling constants
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

  if (!isClient) return null;

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

          {/* --- SEARCH & SORT TOOLBAR --- */}
          <div
            className={`w-full border-y transition-colors duration-300 ${borderColor} py-4 mb-8`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between w-full lg:px-5 gap-2">
              {/* Left: Search Input */}
              <div className="w-full md:w-auto flex-1 max-w-md relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className={`w-4 h-4 ${subText}`} />
                </div>
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-transparent border ${borderColor} focus:border-emerald-500 focus:outline-none transition-all duration-300`}
                />
              </div>

              {/* Right: Sort Dropdown & Global Search Trigger */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Sort Dropdown */}
                <div className="relative">
                  <PremiumSort
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                  />
                </div>

                
              </div>
            </div>
          </div>

          {/* --- POSTS GRID --- */}
          <div
            className={`w-full flex flex-col border-t border-b transition-colors duration-300 ${borderColor} min-h-[400px]`}
          >
            {filteredAndSortedPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <Search className="w-12 h-12 mb-4 text-zinc-500" />
                <p className="text-lg font-medium">No articles found</p>
                <p className="text-sm text-zinc-500">
                  Try adjusting your search or sort criteria
                </p>
              </div>
            ) : (
              chunkedPosts.map((pair, rowIndex) => (
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
              ))
            )}

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

// ... BlogCard and TiltedLines remain exactly the same as your original code ...
const BlogCard = ({
  post,
  isDark,
  cardTitleColor,
  cardExcerptColor,
  onClick,
}) => {
  const categoryColor = isDark ? "text-emerald-400" : "text-emerald-600";
  const borderTopColor = isDark ? "border-gray-700/30" : "border-zinc-300";

  return (
    <article
      onClick={onClick}
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
