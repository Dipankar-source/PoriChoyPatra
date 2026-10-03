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

};

const clean = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v != null && v !== ""),
  );
const nextUp = (skip) =>
  Object.values(BLOGS)
    .filter((p) => String(p.id) !== String(skip))
    .slice(0, 2);

const fetchBlogData = async (blogId) => {
  const custom = await getBlogPost(blogId);
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
    error: false,
  });

  useEffect(() => {
    let active = true;
    setState({ loading: true, blog: null, related: [], error: false });
    window.scrollTo(0, 0);

    fetchBlogData(id || 1)
      .then((result) => {
        if (active) setState({ loading: false, ...result, error: false });
      })
      .catch(() => {
        if (active) {
          setState({ loading: false, blog: null, related: [], error: true });
        }
      });

    return () => {
      active = false;
    };
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
          <h1 className="display-font text-4xl">
            {state.error ? "Article unavailable" : "Post not found"}
          </h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            {state.error
              ? "The article could not be loaded. Please try again later."
              : "This article doesn't exist or was unpublished."}
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
