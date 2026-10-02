// Save as: src/lib/blog-media.js
// Use richMarkdownToHtml(post.content, post.media) in BOTH the editor preview and your public blog page.
import { markdownToHtml } from "./blog-store";

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clean = (s = "") => String(s).replace(/"/g, "'").replace(/[\[\]\n]/g, " ");

export const parseAttrs = (s = "") => {
    const out = {};
    s.replace(/(\w+)="([^"]*)"/g, (_, k, v) => { out[k] = v; return ""; });
    return out;
};

export const serialize = (tag, attrs) =>
    `[${tag} ${Object.entries(attrs).filter(([, v]) => v !== "" && v != null).map(([k, v]) => `${k}="${clean(v)}"`).join(" ")}]`;

// "media:abc123" or "abc123" -> stored image; anything else is treated as a normal URL.
export const resolveSrc = (src = "", media = {}) => {
    const id = src.replace(/^media:/, "");
    return media[id]?.src || (src.startsWith("media:") ? "" : src);
};

const WIDTH = { small: "40%", medium: "65%", large: "100%" };
const MARGIN = { left: "2rem auto 2rem 0", center: "2rem auto", right: "2rem 0 2rem auto" };
const caption = (text, align = "center") =>
    text ? `<figcaption style="margin-top:.6rem;text-align:${align};font-size:.85em;opacity:.65">${esc(text)}</figcaption>` : "";

const figure = (a, media) => {
    const src = resolveSrc(a.src, media);
    if (!src) return "";
    return `<figure style="margin:${MARGIN[a.align] || MARGIN.center};width:${WIDTH[a.size] || "100%"};max-width:100%"><img src="${esc(src)}" alt="${esc(a.alt || a.caption || "")}" loading="lazy" style="display:block;width:100%;height:auto;margin:0"/>${caption(a.caption, a.align || "center")}</figure>`;
};

const gallery = (a, media) => {
    const srcs = (a.srcs || "").split(",").map((s) => resolveSrc(s.trim(), media)).filter(Boolean);
    if (!srcs.length) return "";
    const imgs = srcs.map((s) => `<img src="${esc(s)}" alt="" loading="lazy" style="width:100%;aspect-ratio:4/3;object-fit:cover;margin:0"/>`).join("");
    return `<figure style="margin:2rem 0"><div style="display:grid;gap:.75rem;grid-template-columns:repeat(${Math.min(srcs.length, 3)},minmax(0,1fr))">${imgs}</div>${caption(a.caption)}</figure>`;
};

const TONES = { tip: ["#10b981", "Tip"], note: ["#6366f1", "Note"], warning: ["#f59e0b", "Heads up"] };
const callout = (a) => {
    const [color, label] = TONES[a.type] || TONES.note;
    return `<aside style="margin:1.75rem 0;padding:1rem 1.25rem;border-left:4px solid ${color};background:${color}1f"><strong style="display:block;margin-bottom:.25rem">${label}</strong>${esc(a.text)}</aside>`;
};

const BLOCKS = { figure, gallery, callout };

export function richMarkdownToHtml(md = "", media = {}) {
    const stash = [];
    // Skip fenced code so shortcodes inside code samples stay as text.
    const text = md.split(/(```[\s\S]*?```)/g).map((part, i) => i % 2 ? part :
        part.replace(/^\[(figure|gallery|callout) ([^\]]*)\][ \t]*$/gm, (_, tag, attrs) => {
            stash.push(BLOCKS[tag](parseAttrs(attrs), media));
            return `\n\nMEDIABLOCK${stash.length - 1}END\n\n`;
        })).join("");
    return markdownToHtml(text).replace(/(?:<p>\s*)?MEDIABLOCK(\d+)END(?:\s*<\/p>)?/g, (_, n) => stash[n] ?? "");
}