import DOMPurify from "dompurify";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { supabase } from "@/lib/supabase";

const LEGACY_STORAGE_KEY = "dipfolio_blog_posts_v1";
const PUBLISHED_POSTS_CACHE_KEY = "dipfolio_published_blog_list_v1";
const PUBLISHED_POSTS_CACHE_TTL = 5 * 60 * 1000;
const MEDIA_BUCKET = "blog-media";
let publishedPostsRequest = null;
let publishedPostsRequestRevision = -1;
let publishedPostsCacheRevision = 0;

[
  ["bash", bash],
  ["css", css],
  ["javascript", javascript],
  ["json", json],
  ["python", python],
  ["typescript", typescript],
  ["xml", xml],
].forEach(([name, language]) => hljs.registerLanguage(name, language));

const blogMarkdown = new Marked(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, language) {
      if (language && hljs.getLanguage(language)) {
        return hljs.highlight(code, { language }).value;
      }
      return hljs.highlightAuto(code).value;
    },
  }),
);

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add the project URL and publishable key.");
  }
  return supabase;
};

const readLegacyPosts = () => {
  try {
    const value = JSON.parse(window.localStorage.getItem(LEGACY_STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const safePathPart = (value) =>
  String(value).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 100) || "image";

const uploadInlineImage = async (src, path) => {
  if (typeof src !== "string" || !src.startsWith("data:")) return src || "";

  const client = requireSupabase();
  const response = await fetch(src);
  if (!response.ok) throw new Error("Could not read an uploaded blog image.");
  const blob = await response.blob();
  const extension = (blob.type.split("/")[1] || "bin")
    .replace("svg+xml", "svg")
    .replace(/[^a-zA-Z0-9]/g, "");
  const storagePath = `${path}.${extension || "bin"}`;
  const { error } = await client.storage.from(MEDIA_BUCKET).upload(storagePath, blob, {
    cacheControl: "31536000",
    contentType: blob.type || "application/octet-stream",
    upsert: true,
  });

  if (error) throw error;
  return client.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath).data.publicUrl;
};

const toDatabaseRow = async (post) => {
  const now = new Date().toISOString();
  const id = String(post.id || crypto.randomUUID());
  const safeId = safePathPart(id);
  const image = await uploadInlineImage(post.image, `${safeId}/cover`);
  const media = Object.fromEntries(
    await Promise.all(
      Object.entries(post.media || {}).map(async ([mediaId, item]) => {
        const src = typeof item === "string" ? item : item?.src;
        const uploadedSrc = await uploadInlineImage(src, `${safeId}/${safePathPart(mediaId)}`);
        return [
          mediaId,
          typeof item === "string" ? uploadedSrc : { ...item, src: uploadedSrc },
        ];
      }),
    ),
  );
  const postData = {
    ...post,
    id,
    image,
    media,
    updatedAt: now,
    publishedAt:
      post.status === "published" ? post.publishedAt || now : post.publishedAt || null,
  };

  return {
    id,
    status: postData.status === "published" ? "published" : "draft",
    published_at: postData.status === "published" ? postData.publishedAt : null,
    updated_at: now,
    post_data: postData,
  };
};

const rowsToPosts = (rows = []) => rows.map((row) => row.post_data);

const readPublishedPostsCache = () => {
  try {
    const cached = JSON.parse(
      window.localStorage.getItem(PUBLISHED_POSTS_CACHE_KEY) || "null",
    );
    if (!Array.isArray(cached?.posts) || !Number.isFinite(cached.cachedAt)) {
      return null;
    }
    return cached;
  } catch {
    return null;
  }
};

const toPublishedListPost = (post) => ({
  id: post.id,
  title: post.title,
  excerpt: post.excerpt,
  category: post.category,
  publishedAt: post.publishedAt,
  updatedAt: post.updatedAt,
  readTime: post.readTime,
});

const writePublishedPostsCache = (posts) => {
  try {
    window.localStorage.setItem(
      PUBLISHED_POSTS_CACHE_KEY,
      JSON.stringify({ cachedAt: Date.now(), posts }),
    );
  } catch {
    // The list can still load normally when storage is unavailable or full.
  }
};

const invalidatePublishedPostsCache = () => {
  publishedPostsCacheRevision += 1;
  publishedPostsRequest = null;
  publishedPostsRequestRevision = -1;
  try {
    window.localStorage.removeItem(PUBLISHED_POSTS_CACHE_KEY);
  } catch {
    // The next read will refresh from Supabase if storage is unavailable.
  }
};

export const getCachedPublishedBlogPosts = () =>
  readPublishedPostsCache()?.posts || null;

export const getBlogPosts = async () => {
  const { data, error } = await requireSupabase()
    .from("blog_posts")
    .select("post_data")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return rowsToPosts(data);
};

export const getPublishedBlogPosts = async () => {
  const cached = readPublishedPostsCache();
  if (cached && Date.now() - cached.cachedAt < PUBLISHED_POSTS_CACHE_TTL) {
    return cached.posts;
  }

  if (
    publishedPostsRequest &&
    publishedPostsRequestRevision === publishedPostsCacheRevision
  ) {
    return publishedPostsRequest;
  }

  const requestRevision = publishedPostsCacheRevision;
  const request = (async () => {
    try {
      const { data, error } = await requireSupabase()
        .from("blog_posts")
        .select("post_data")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;

      const posts = rowsToPosts(data).map(toPublishedListPost);
      if (requestRevision === publishedPostsCacheRevision) {
        writePublishedPostsCache(posts);
      }
      return posts;
    } catch (error) {
      if (requestRevision === publishedPostsCacheRevision && cached) {
        return cached.posts;
      }
      throw error;
    }
  })();

  publishedPostsRequest = request;
  publishedPostsRequestRevision = requestRevision;
  try {
    return await request;
  } finally {
    if (publishedPostsRequest === request) {
      publishedPostsRequest = null;
      publishedPostsRequestRevision = -1;
    }
  }
};

export const getBlogPost = async (id) => {
  const { data, error } = await requireSupabase()
    .from("blog_posts")
    .select("post_data")
    .eq("id", String(id))
    .maybeSingle();
  if (error) throw error;
  return data?.post_data || null;
};

export const saveBlogPost = async (post) => {
  const row = await toDatabaseRow(post);
  const { data, error } = await requireSupabase()
    .from("blog_posts")
    .upsert(row, { onConflict: "id" })
    .select("post_data")
    .single();
  if (error) throw error;
  invalidatePublishedPostsCache();
  return data.post_data;
};

export const deleteBlogPost = async (id) => {
  const { data, error } = await requireSupabase()
    .from("blog_posts")
    .delete()
    .eq("id", String(id))
    .select("id");
  if (error) throw error;
  if (!data?.length) throw new Error("The post was not found or could not be deleted.");
  invalidatePublishedPostsCache();
};

export const toggleBlogPostStatus = async (id) => {
  const post = await getBlogPost(id);
  if (!post) throw new Error("The post could not be found.");
  const status = post.status === "published" ? "draft" : "published";
  return saveBlogPost({
    ...post,
    status,
    publishedAt: status === "published" ? new Date().toISOString() : null,
  });
};

export const migrateLegacyBlogPosts = async () => {
  const legacyPosts = readLegacyPosts();
  if (!legacyPosts.length) return 0;

  const client = requireSupabase();
  const { data: existingPosts, error: checkError } = await client
    .from("blog_posts")
    .select("id")
    .limit(1);
  if (checkError) throw checkError;
  if (existingPosts?.length) return 0;

  const rows = await Promise.all(legacyPosts.map(toDatabaseRow));
  const { error } = await client.from("blog_posts").upsert(rows, { onConflict: "id" });
  if (error) throw error;
  invalidatePublishedPostsCache();
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  return rows.length;
};

export const markdownToHtml = (markdown = "") => {
  const html = blogMarkdown.parse(markdown, { async: false, gfm: true });
  return DOMPurify.sanitize(html);
};

export const toPublicBlogPost = (post) => ({
  ...post,
  date: new Date(post.publishedAt || post.updatedAt || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  }),
  readTime: post.readTime || "5m",
  image: post.image || "",
  content: post.content || "",
  showComponent: false,
  related: [],
});
