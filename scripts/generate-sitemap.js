import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(projectRoot, "dist");
const siteUrl = (process.env.VITE_SITE_URL || "https://onrender.com").replace(/\/$/, "");
const routes = ["/", "/projects", "/experience", "/blog", "/contact"];
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const xmlEscape = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

if (supabaseUrl && supabaseKey) {
  try {
    const endpoint = new URL("/rest/v1/blog_posts", supabaseUrl);
    endpoint.searchParams.set("select", "post_data");
    endpoint.searchParams.set("status", "eq.published");

    const response = await fetch(endpoint, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase returned HTTP ${response.status}`);
    }

    const posts = await response.json();
    for (const row of posts) {
      const post = row?.post_data;
      const identifier = post?.slug || post?.id;
      if (identifier !== undefined && identifier !== null && String(identifier).length > 0) {
        routes.push(`/blog/${encodeURIComponent(String(identifier))}`);
      }
    }
  } catch (error) {
    console.warn(`Sitemap: could not fetch published blog posts: ${error.message}`);
  }
}

const locations = [...new Set(routes)].map(
  (route) => `  <url><loc>${xmlEscape(`${siteUrl}${route}`)}</loc></url>`,
);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...locations,
  "</urlset>",
  "",
].join("\n");

await mkdir(outputDirectory, { recursive: true });
await writeFile(path.join(outputDirectory, "sitemap.xml"), sitemap, "utf8");
const robots = await readFile(path.join(projectRoot, "public", "robots.txt"), "utf8");
await writeFile(
  path.join(outputDirectory, "robots.txt"),
  robots.replaceAll("__SITE_URL__", siteUrl),
  "utf8",
);
console.log(`Sitemap generated with ${locations.length} URLs at dist/sitemap.xml`);