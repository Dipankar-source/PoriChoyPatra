import { supabase } from "@/lib/supabase";

const LEGACY_STORAGE_KEY = "dipfolio_blog_posts_v1";
const MEDIA_BUCKET = "blog-media";

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

export const getBlogPosts = async () => {
  const { data, error } = await requireSupabase()
    .from("blog_posts")
    .select("post_data")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return rowsToPosts(data);
};

export const getPublishedBlogPosts = async () => {
  const { data, error } = await requireSupabase()
    .from("blog_posts")
    .select("post_data")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return rowsToPosts(data);
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
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  return rows.length;
};

export const markdownToHtml = (markdown = "") => {
  const escapeHtml = (value) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return markdown
    .split(/\n{2,}/)
    .map((block) => {
      const text = escapeHtml(block.trim())
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/^# (.+)$/gm, "<h1>$1</h1>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/`(.+?)`/g, "<code>$1</code>")
        .replace(/\n/g, "<br />");

      if (/^<h[1-3]>/.test(text)) return text;
      if (text.startsWith("- ")) {
        return `<ul>${text
          .split("<br />")
          .map((item) => `<li>${item.replace(/^- /, "")}</li>`)
          .join("")}</ul>`;
      }
      return `<p>${text}</p>`;
    })
    .join("");
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
