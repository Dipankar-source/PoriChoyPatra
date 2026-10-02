import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import assets from "@/assets/assets";
import PremiumSort from "@/uicomponents/dropdown/premium-sort";
import { getPublishedBlogPosts, toPublicBlogPost } from "@/lib/blog-store";
import PageFrame, {
  AdGridSection,
  BackBar,
  HLine,
  Hatch,
  PostRow,
} from "@/components/PageFrame";

const BLOG_POSTS = [

];

const toTime = (d) => {
  const t = new Date(`${d} ${new Date().getFullYear()}`).getTime();
  return Number.isNaN(t) ? 0 : t;
};
const toMinutes = (s) => parseInt(String(s).replace("m", ""), 10) || 0;

const Blog = () => {
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [publishedPosts, setPublishedPosts] = useState([]);

  useEffect(() => {
    setPublishedPosts(getPublishedBlogPosts().map(toPublicBlogPost));
  }, []);

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = [...BLOG_POSTS, ...publishedPosts].filter(
      (p) =>
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q),
    );
    result.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return toTime(b.date) - toTime(a.date);
        case "oldest":
          return toTime(a.date) - toTime(b.date);
        case "a-z":
          return a.title.localeCompare(b.title);
        case "z-a":
          return b.title.localeCompare(a.title);
        case "time-short":
          return toMinutes(a.readTime) - toMinutes(b.readTime);
        case "time-long":
          return toMinutes(b.readTime) - toMinutes(a.readTime);
        default:
          return 0;
      }
    });
    return result;
  }, [publishedPosts, query, sortOption]);

  return (
    <PageFrame>
      <BackBar to="/" label="Home" />

      <header className="relative px-4 pb-5 pt-6 sm:px-6">
        <h1 className="aktura-font tracking-wider text-[44px] leading-none  sm:text-[56px]">
          Blog
        </h1>
        <p className="mt-2 dancing-font text-2xl text-neutral-500 dark:text-neutral-400">
          A collection of design tools and components that hits different.
        </p>
        <HLine className="bottom-0" />
      </header>

      <AdGridSection />

      <div className="relative flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
        <div className="relative w-full sm:flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by title…"
            aria-label="Filter articles"
            className="w-full rounded-xl border border-neutral-300/80 bg-transparent py-3 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-neutral-500 focus:border-emerald-500 dark:border-neutral-800"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </span>
          <PremiumSort sortOption={sortOption} setSortOption={setSortOption} />
        </div>
        <HLine className="bottom-0" />
      </div>

      <section aria-label="Articles" className="min-h-[300px]">
        {posts.length === 0 ? (
          <div className="relative px-4 py-16 text-center sm:px-6">
            <p className="text-lg font-medium">No articles found</p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Try a different search.
            </p>
            <HLine className="bottom-0" />
          </div>
        ) : (
          posts.map((post) => (
            <PostRow
              key={post.id}
              to={`/blog/${post.id}`}
              title={post.title}
              meta={post.date}
            />
          ))
        )}
      </section>

      <Hatch />
    </PageFrame>
  );
};

export default Blog;
