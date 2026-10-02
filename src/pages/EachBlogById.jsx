import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Check,
  Code,
  ExternalLink,
  Palette,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";
import assets from "@/assets/assets";
import IOSBentoGrid from "@/uicomponents/bentos/ios-bento-grid";
import PremiumNavbar from "@/uicomponents/navbars/premium-navbar";
import ChronosCardDemo from "@/uicomponents/cards/chronosCardDemo";
import IOSSettingsAccordion from "@/uicomponents/accordion/ios-accordion";
import { getBlogPost, toPublicBlogPost } from "@/lib/blog-store";
import PageFrame, {
  AdGridSection,
  BackBar,
  DASH,
  HLine,
  Hatch,
  PostRow,
} from "@/components/PageFrame";
import BlogContent, { useMediaSrc } from "@/components/BlogContent";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */
const BASE = {
  author: "Dipankar Barik",
  authorRole: "Frontend Developer",
};

const BLOGS = {
  1: {
    id: 1,
    title: "A Premium Navbar Design",
    excerpt: "A clean and premium navbar built to improve first impressions.",
    date: "December 07, 2025",
    readTime: "5m",
    category: "Design",
    image: assets.NavbarComponent,
    content: `
      <h2 class="text-2xl font-bold mb-4 mt-6">Why a Good Navbar Matters</h2>
      <p class="mb-4">A navbar is often the first thing users notice on a website. It helps people understand where they are and how to move around. A clean and well-designed navbar makes the site feel more trustworthy and easy to use.</p>
      <h3 class="text-xl font-semibold mb-3 mt-6">Design Focus</h3>
      <p class="mb-4">This navbar is designed with a premium look using glass-style effects and smooth interactions. The goal is to keep it modern, simple, and visually pleasing without distracting the user.</p>
      <p class="mb-4">It works well on all screen sizes and supports both light and dark modes, making it a solid choice for modern websites and portfolios.</p>`,
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
    authorRole: "Frontend Engineer",
    image: assets.IOSBento,
    content: `
      <h2 class="text-2xl font-bold mb-4 mt-6">Inspired by iOS Design</h2>
      <p class="mb-4">The iOS Bento Grid is inspired by how Apple presents content in a clean, organized, and visually pleasing way. It helps break information into small sections that are easy to scan and understand.</p>
      <h3 class="text-xl font-semibold mb-3 mt-6">Why Use a Bento Grid</h3>
      <p class="mb-4">Instead of long sections of text, a bento grid allows you to showcase features, projects, or highlights in separate blocks. This makes the layout feel lighter and more engaging.</p>
      <p class="mb-4">This component is responsive and works smoothly across devices, making it a good choice for landing pages, portfolios, and feature sections.</p>`,
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
    excerpt: "A smooth 3D card that adds depth, motion, and life to your UI.",
    date: "December 08, 2025",
    readTime: "7m",
    category: "Frontend",
    image: assets.ChronosCard,
    content: `
      <h2 class="text-2xl font-bold mb-4 mt-6">A Card That Feels Alive</h2>
      <p class="mb-4">Chronos is not a static card. It reacts to cursor movement and creates a subtle 3D depth that makes the interface feel more interactive and premium. The motion is smooth and controlled, not distracting.</p>
      <h3 class="text-xl font-semibold mb-3 mt-6">Built for Modern Interfaces</h3>
      <p class="mb-4">This card is designed to work as a flexible container. You can place any content inside it — text, icons, stats, or buttons — and the card will handle the animation and depth automatically.</p>
      <p class="mb-4">It fits perfectly in landing pages, feature sections, and product highlights where you want to add a bit of motion without overdoing it.</p>`,
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
    excerpt: "A smooth and premium accordion inspired by iOS settings design.",
    date: "December 05, 2025",
    readTime: "7m",
    category: "Frontend",
    image: assets.IOSAccordion,
    content: `
      <h2 class="text-2xl font-bold mb-4 mt-6">Inspired by iOS Settings</h2>
      <p class="mb-4">This accordion takes inspiration from the iOS settings screen, where information is neatly organized and easy to scan. It helps present content in a clean and structured way without overwhelming the user.</p>
      <h3 class="text-xl font-semibold mb-3 mt-6">Smooth and Focused Interaction</h3>
      <p class="mb-4">Each section opens and closes smoothly, making the interaction feel natural and responsive. The animation is subtle, keeping the focus on the content instead of flashy effects.</p>
      <p class="mb-4">This component works well for FAQs, settings pages, feature lists, and any place where content needs to stay organized and readable.</p>`,
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
};

const clean = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v != null && v !== ""),
  );
const nextUp = (skip) =>
  Object.values(BLOGS)
    .filter((p) => String(p.id) !== String(skip))
    .slice(0, 2);

const fetchBlogData = (blogId) => {
  const custom = getBlogPost(blogId);
  if (custom?.status === "published") {
    return {
      blog: {
        ...BASE,
        ...clean({ ...toPublicBlogPost(custom), content: custom.content }),
      },
      related: nextUp(blogId),
    };
  }
  const found = BLOGS[blogId];
  if (!found) return { blog: null, related: [] };
  return { blog: { ...BASE, ...found }, related: nextUp(blogId) };
};

/* ------------------------------------------------------------------ */
/* Live preview (built-in component posts only)                        */
/* ------------------------------------------------------------------ */
const ICONS = { Check, Zap, Shield, Code, Palette, Smartphone };
const PREVIEWS = {
  PremiumNavbar,
  IOSBentoGrid,
  ChronosCardDemo,
  IOSSettingsAccordion,
};

const LivePreview = ({ blog }) => {
  const Preview = PREVIEWS[blog.componentType];
  return (
    <section className={`border border-dashed ${DASH}`}>
      <div
        className={`flex items-center justify-between gap-3 border-b px-4 py-3 ${DASH}`}
      >
        <span className="text-sm font-medium">Live preview</span>
        <span className="truncate font-mono text-xs text-neutral-500 dark:text-neutral-400">
          {blog.componentType}.jsx
        </span>
      </div>

      <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden p-4 sm:p-6">
        <div
          aria-hidden="true"
          className="absolute inset-0 text-neutral-900/10 dark:text-white/10"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative z-10 w-full min-w-0">
          {Preview ? (
            <Preview {...blog.componentProps} />
          ) : (
            <p className="text-center text-sm text-red-500">
              Component "{blog.componentType}" not found.
            </p>
          )}
        </div>
      </div>

      <div className={`border-t p-4 sm:p-5 ${DASH}`}>
        <h3 className="text-sm font-semibold">About this component</h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {blog.componentDescription}
        </p>
        {blog.keyFeatures?.length > 0 && (
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {blog.keyFeatures.map((feature, i) => {
              const Icon = ICONS[blog.featureIcons?.[i]] || Check;
              return (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-neutral-200/70 text-emerald-600 dark:bg-neutral-900 dark:text-emerald-400">
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  {feature}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Page: title, excerpt, meta line, cover, content                     */
/* ------------------------------------------------------------------ */
const Sep = () => <span aria-hidden="true">·</span>;

const EachBlogById = () => {
  const { id } = useParams();
  const [state, setState] = useState({
    loading: true,
    blog: null,
    related: [],
  });

  useEffect(() => {
    setState({ loading: false, ...fetchBlogData(id || 1) });
    window.scrollTo(0, 0);
  }, [id]);

  const { loading, blog, related } = state;
  const cover = useMediaSrc(blog?.image);

  if (loading) {
    return (
      <PageFrame>
        <BackBar to="/blog" label="Blog" />
        <div className="animate-pulse space-y-4 px-4 py-10 sm:px-6">
          <div className="h-10 w-3/4 rounded bg-neutral-200 dark:bg-neutral-900" />
          <div className="h-5 w-1/2 rounded bg-neutral-200 dark:bg-neutral-900" />
          <div className="mt-8 aspect-2/1 rounded-xl bg-neutral-200 dark:bg-neutral-900" />
        </div>
      </PageFrame>
    );
  }

  if (!blog) {
    return (
      <PageFrame>
        <BackBar to="/blog" label="Blog" />
        <div className="px-4 py-20 text-center sm:px-6">
          <h1 className="display-font text-4xl">Post not found</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            This article doesn't exist or was unpublished.
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-block text-sm text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Back to all articles
          </Link>
        </div>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <BackBar to="/blog" label="Blog" />

      {/* Title block */}
      <header className="relative px-4 pb-6 pt-8 sm:px-6">
        <h1 className="display-font text-[32px] leading-[1.08] tracking-tight sm:text-[48px]">
          {blog.title}
        </h1>
        {blog.excerpt && (
          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-lg">
            {blog.excerpt}
          </p>
        )}
        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-neutral-500 dark:text-neutral-400">
          <span>{blog.author}</span>
          <Sep />
          <span>{blog.date}</span>
          <Sep />
          <span>{blog.readTime} read</span>
          {blog.category && (
            <>
              <Sep />
              <span className="text-emerald-600 dark:text-emerald-400">
                {blog.category}
              </span>
            </>
          )}
        </p>
        <HLine className="bottom-0" />
      </header>

      <AdGridSection />

      {/* Cover */}
      {cover && (
        <div className="relative px-4 py-5 sm:px-6">
          <div className="aspect-2/1 overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-900">
            <img
              src={cover}
              alt={blog.title}
              className="h-full w-full object-cover object-top"
            />
          </div>
          <HLine className="bottom-0" />
        </div>
      )}

      {/* Live preview */}
      {blog.componentType && (
        <div className="relative px-4 py-6 sm:px-6">
          <LivePreview blog={blog} />
          <HLine className="bottom-0" />
        </div>
      )}

      {/* Body */}
      <article className="relative px-4 py-8 sm:px-6">
        <BlogContent content={blog.content} media={blog.media || {}} />
        <HLine className="bottom-0" />
      </article>

      {/* Resource link */}
      {blog.websiteUrl && (
        <div className="relative px-4 py-6 sm:px-6">
          <div
            className={`flex flex-col items-start justify-between gap-4 border border-dashed p-5 sm:flex-row sm:items-center ${DASH}`}
          >
            <div>
              <h3 className="font-semibold">Want the details?</h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Read the docs or browse the source code.
              </p>
            </div>
            <a
              href={blog.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-neutral-950 px-4 py-2.5 text-sm text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-neutral-950"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              Visit resource
            </a>
          </div>
          <HLine className="bottom-0" />
        </div>
      )}

      {/* Read next */}
      {related.length > 0 && (
        <section aria-label="Read next">
          <HLine className="bottom-48" />

          <div className="relative px-4 pb-4 pt-8 sm:px-6">
            <h2 className="text-xl font-semibold tracking-tight">Read next</h2>
            <HLine className="bottom-0" />
          </div>
          {related.map((post) => (
            <PostRow
              key={post.id}
              to={`/blog/${post.id}`}
              title={post.title}
              meta={post.date}
            />
          ))}
          <Hatch />
        </section>
      )}
    </PageFrame>
  );
};

export default EachBlogById;
