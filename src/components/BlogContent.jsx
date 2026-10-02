import { useEffect, useState } from "react";
import * as store from "@/lib/blog-store";

/* ------------------------------------------------------------------ */
/* Media resolving: "media:25171e" -> real image URL / data URL        */
/* Tries the usual helper names exported by blog-store, then falls     */
/* back to scanning localStorage. Edit RESOLVERS if yours is named     */
/* differently.                                                        */
/* ------------------------------------------------------------------ */
const RESOLVERS = [
  "getBlogMedia",
  "getMedia",
  "getMediaById",
  "getMediaItem",
  "getMediaUrl",
  "getMediaSrc",
  "resolveMedia",
  "resolveMediaUrl",
  "getBlogMediaById",
  "getBlogAsset",
  "getAsset",
];

const pick = (v) => {
  if (!v) return null;
  if (typeof v === "string") return v;
  return (
    v.src ||
    v.url ||
    v.dataUrl ||
    v.dataURL ||
    v.data ||
    v.base64 ||
    v.blobUrl ||
    null
  );
};

export const resolveMediaSrc = async (src, media = {}) => {
  if (!src) return "";
  if (!String(src).startsWith("media:")) return src;
  const id = String(src).slice(6);

  const mediaEntry = media?.[id];
  const directFromMedia = pick(mediaEntry);
  if (directFromMedia) return directFromMedia;

  for (const name of RESOLVERS) {
    if (typeof store[name] === "function") {
      try {
        const out = pick(await store[name](id));
        if (out) return out;
      } catch {
        /* try next */
      }
    }
  }

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      if (key.includes(id) && raw.startsWith("data:")) return raw;
      if (!/media|asset|image|blog/i.test(key) || !raw.includes(id)) continue;
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed)
        ? parsed
        : parsed?.media || parsed?.assets || parsed;
      const hit = Array.isArray(list)
        ? list.find((m) => m?.id === id)
        : list?.[id];
      const out = pick(hit);
      if (out) return out;
    }
  } catch {
    /* ignore */
  }
  return "";
};

/** null = loading, "" = not found, string = ready */
export const useMediaSrc = (src, media = {}) => {
  const direct = src && !String(src).startsWith("media:");
  const [out, setOut] = useState(direct ? src : null);

  useEffect(() => {
    let live = true;
    if (!src) {
      setOut("");
      return;
    }
    if (direct) {
      setOut(src);
      return;
    }
    setOut(null);
    resolveMediaSrc(src, media)
      .then((r) => live && setOut(r || ""))
      .catch(() => live && setOut(""));
    return () => {
      live = false;
    };
  }, [src, direct, media]);

  return out;
};

/* ------------------------------------------------------------------ */
/* [figure src="media:x" size="large" align="center" caption="..."]   */
/* ------------------------------------------------------------------ */
const MEDIA_BLOCK_RE = /\[(figure|gallery)\s+([^\]]*)\]/g;

const parseAttrs = (str) => {
  const attrs = {};
  const clean = str.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  for (const m of clean.matchAll(/(\w+)=(?:"([^"]*)"|'([^']*)')/g))
    attrs[m[1]] = m[2] ?? m[3] ?? "";
  return attrs;
};

const SIZE = {
  small: "sm:w-[40%]",
  medium: "sm:w-[65%]",
  large: "sm:w-full",
  full: "sm:w-full",
};
const ALIGN = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

const Figure = ({ attrs, media = {} }) => {
  const src = useMediaSrc(attrs.src, media);
  const size = SIZE[attrs.size] || SIZE.large;
  const align = ALIGN[attrs.align] || ALIGN.center;

  return (
    <figure className={`my-8 flex flex-col ${align}`}>
      <div className={`w-full ${size}`}>
        {src === null && (
          <div className="aspect-video w-full animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-900" />
        )}
        {src === "" && (
          <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-neutral-300 px-4 text-center font-mono text-xs text-neutral-500 dark:border-neutral-700">
            Image not found: {attrs.src}
          </div>
        )}
        {src && (
          <img
            src={src}
            alt={attrs.alt || attrs.caption || ""}
            loading="lazy"
            className="h-auto w-full rounded-lg bg-neutral-100 dark:bg-neutral-900"
          />
        )}
      </div>
      {attrs.caption && (
        <figcaption
          className={`mt-3 font-mono text-xs text-neutral-500 dark:text-neutral-400 ${SIZE[attrs.size] || "sm:w-full"} w-full`}
        >
          {attrs.caption}
        </figcaption>
      )}
    </figure>
  );
};

const GalleryImage = ({ src, media }) => {
  const resolved = useMediaSrc(src, media);

  if (resolved === null) {
    return <div className="aspect-[4/3] animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-900" />;
  }
  if (!resolved) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-dashed border-neutral-300 px-3 text-center font-mono text-xs text-neutral-500 dark:border-neutral-700">
        Image unavailable
      </div>
    );
  }

  return (
    <img
      src={resolved}
      alt=""
      loading="lazy"
      className="aspect-[4/3] w-full rounded-lg bg-neutral-100 object-cover dark:bg-neutral-900"
    />
  );
};

const Gallery = ({ attrs, media = {} }) => {
  const sources = (attrs.srcs || "")
    .split(",")
    .map((src) => src.trim())
    .filter(Boolean);
  if (!sources.length) return null;

  const columns =
    sources.length === 1
      ? "grid-cols-1"
      : sources.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <figure className="my-8">
      <div className={`grid gap-3 ${columns}`}>
        {sources.map((src, index) => (
          <GalleryImage key={`${src}-${index}`} src={src} media={media} />
        ))}
      </div>
      {attrs.caption && (
        <figcaption className="mt-3 font-mono text-xs text-neutral-500 dark:text-neutral-400">
          {attrs.caption}
        </figcaption>
      )}
    </figure>
  );
};

/* ------------------------------------------------------------------ */
/* Text: HTML is passed through, plain text/markdown is rendered       */
/* ------------------------------------------------------------------ */
const looksLikeHtml = (s) =>
  /<\/?(p|h[1-6]|ul|ol|li|div|br|strong|em|a|blockquote|pre|code|img|span)\b/i.test(
    s,
  );

const inline = (text) =>
  text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
    .map((part, i) => {
      if (/^\*\*[^*]+\*\*$/.test(part))
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (/^\*[^*]+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
      if (/^`[^`]+`$/.test(part))
        return <code key={i}>{part.slice(1, -1)}</code>;
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link && /^(https?:|mailto:|\/)/.test(link[2])) {
        return (
          <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer">
            {link[1]}
          </a>
        );
      }
      return part;
    });

const Markdownish = ({ text }) => {
  const lines = text.split("\n");
  const out = [];
  let para = [];
  let list = null;
  let code = null;

  const flushPara = () => {
    if (para.length) {
      out.push(<p key={out.length}>{inline(para.join(" "))}</p>);
      para = [];
    }
  };
  const flushList = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    out.push(
      <Tag key={out.length}>
        {list.items.map((t, i) => (
          <li key={i}>{inline(t)}</li>
        ))}
      </Tag>,
    );
    list = null;
  };

  for (const line of lines) {
    if (code) {
      if (line.trim().startsWith("```")) {
        out.push(
          <pre key={out.length}>
            <code>{code.join("\n")}</code>
          </pre>,
        );
        code = null;
      } else code.push(line);
      continue;
    }
    if (line.trim().startsWith("```")) {
      flushPara();
      flushList();
      code = [];
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);
    const q = line.match(/^>\s?(.*)$/);

    if (h) {
      flushPara();
      flushList();
      const Tag = `h${Math.min(h[1].length + 1, 4)}`;
      out.push(<Tag key={out.length}>{inline(h[2])}</Tag>);
    } else if (ul || ol) {
      flushPara();
      const ordered = Boolean(ol);
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push((ul || ol)[1]);
    } else if (q) {
      flushPara();
      flushList();
      out.push(<blockquote key={out.length}>{inline(q[1])}</blockquote>);
    } else if (!line.trim()) {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara();
  flushList();
  if (code)
    out.push(
      <pre key={out.length}>
        <code>{code.join("\n")}</code>
      </pre>,
    );
  return <>{out}</>;
};

const PROSE =
  "prose prose-neutral max-w-[72ch] dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-img:rounded-lg";

const BlogContent = ({ content = "", media = {} }) => {
  const parts = [];
  let last = 0;
  for (const m of content.matchAll(MEDIA_BLOCK_RE)) {
    parts.push({ type: "text", value: content.slice(last, m.index) });
    parts.push({ type: m[1], attrs: parseAttrs(m[2]) });
    last = m.index + m[0].length;
  }
  parts.push({ type: "text", value: content.slice(last) });

  return (
    <div>
      {parts.map((part, i) => {
        if (part.type === "figure")
          return <Figure key={i} attrs={part.attrs} media={media} />;
        if (part.type === "gallery")
          return <Gallery key={i} attrs={part.attrs} media={media} />;
        if (!part.value.trim()) return null;
        return looksLikeHtml(part.value) ? (
          <div
            key={i}
            className={PROSE}
            dangerouslySetInnerHTML={{ __html: part.value }}
          />
        ) : (
          <div key={i} className={PROSE}>
            <Markdownish text={part.value} />
          </div>
        );
      })}
    </div>
  );
};

export default BlogContent;
