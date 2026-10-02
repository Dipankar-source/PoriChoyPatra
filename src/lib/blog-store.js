const STORAGE_KEY = "dipfolio_blog_posts_v1";

const readPosts = () => {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const writePosts = (posts) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const getBlogPosts = () => readPosts();

export const getPublishedBlogPosts = () =>
  readPosts().filter((post) => post.status === "published");

export const getBlogPost = (id) =>
  readPosts().find((post) => String(post.id) === String(id)) || null;

export const saveBlogPost = (post) => {
  const posts = readPosts();
  const nextPost = {
    ...post,
    id: post.id || `local-${Date.now()}`,
    updatedAt: new Date().toISOString(),
  };
  const index = posts.findIndex((item) => String(item.id) === String(nextPost.id));

  if (index === -1) posts.unshift(nextPost);
  else posts[index] = nextPost;

  writePosts(posts);
  return nextPost;
};

export const deleteBlogPost = (id) => {
  writePosts(readPosts().filter((post) => String(post.id) !== String(id)));
};

export const toggleBlogPostStatus = (id) => {
  const posts = readPosts().map((post) =>
    String(post.id) === String(id)
      ? {
          ...post,
          status: post.status === "published" ? "draft" : "published",
          publishedAt:
            post.status === "published"
              ? post.publishedAt
              : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : post,
  );
  writePosts(posts);
  return posts.find((post) => String(post.id) === String(id)) || null;
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
