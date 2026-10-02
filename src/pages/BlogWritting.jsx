import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link2,
  List,
  ListOrdered,
  Minus,
  Eye,
  FilePlus2,
  ImagePlus,
  Trash2,
  Upload,
  X,
  Columns,
  Maximize2,
  Minimize2,
  Copy,
  Download,
  Search,
  Star,
  CopyPlus,
  Check,
  Images,
  PenTool,
  LayoutTemplate,
  LayoutGrid,
  Lightbulb,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/componants/Navbar";
import { AdGridSection } from "@/components/PageFrame";
import {
  deleteBlogPost,
  getBlogPosts,
  migrateLegacyBlogPosts,
  saveBlogPost,
  toggleBlogPostStatus,
} from "@/lib/blog-store";
import {
  richMarkdownToHtml,
  parseAttrs,
  serialize,
  resolveSrc,
} from "@/lib/blog-media";
import { SketchModal, CardModal } from "@/componants/BlogMediaTools";

const CATEGORIES = ["Design", "Frontend", "Research", "Career", "Thoughts"];
const MAX_TAGS = 5;

const TEMPLATES = {
  Blank: "# Start writing\n\nYour article begins here...",
  Tutorial:
    "# How to build X\n\nOne line on what the reader will have by the end.\n\n## What you need\n\n- Tool one\n- Tool two\n\n## Step 1: Set up\n\nExplain the first step.\n\n```js\nconsole.log('hello');\n```\n\n## Step 2: Build it\n\n## Wrapping up\n\nWhat to try next.",
  "Case study":
    "# Project name\n\n> One sentence on the outcome.\n\n## The problem\n\n## My role\n\n## Process\n\n## Result\n\n## What I learned",
  "Quick thought":
    "# A small idea\n\nOne strong opening line.\n\nThe idea, in three short paragraphs.\n\n> The sentence people will remember.",
};

const emptyPost = {
  title: "",
  excerpt: "",
  category: "Design",
  readTime: "1m",
  image: "",
  imageAlt: "",
  content: TEMPLATES.Blank,
  status: "draft",
  tags: [],
  slug: "",
  websiteUrl: "",
  seoDescription: "",
  featured: false,
  media: {},
};

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
const countWords = (s) => (s.trim() ? s.trim().split(/\s+/).length : 0);

const inputCls =
  "w-full rounded-md border border-neutral-200 bg-white/80 px-3 py-2 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:border-neutral-800 dark:bg-[#191919] dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-emerald-400";
const accentBtn =
  "inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60 dark:bg-emerald-400 dark:text-neutral-950 dark:hover:bg-emerald-300";
const ghostBtn =
  "inline-flex items-center gap-2 rounded-md border border-neutral-300/80 bg-white/50 px-2.5 py-2 text-[11px] text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-white/[0.03] dark:text-neutral-300 dark:hover:bg-white/[0.07]";

const Seg = ({ label, value, options, onChange }) => (
  <div>
    <p className="mb-1 font-medium">{label}</p>
    <div role="group" aria-label={label} className="flex">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className={`px-2.5 py-1.5 capitalize ${value === o ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" : "border border-neutral-200 text-neutral-500 dark:border-neutral-800"}`}
        >
          {o}
        </button>
      ))}
    </div>
  </div>
);

const BlogWritting = ({ onSignOut }) => {
  const navigate = useNavigate();
  const imageInputRef = useRef(null);
  const uploadRef = useRef(null);
  const uploadMode = useRef("insert");
  const textareaRef = useRef(null);
  const saveRef = useRef(() => {});

  const [posts, setPosts] = useState([]);
  const [draft, setDraft] = useState(emptyPost);
  const [activeId, setActiveId] = useState(null);
  const [view, setView] = useState("split"); // editor | split | preview
  const [panel, setPanel] = useState("post"); // post | outline | library
  const [focus, setFocus] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [message, setMessage] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [copied, setCopied] = useState(false);
  const [caret, setCaret] = useState(0);
  const [formatMenu, setFormatMenu] = useState(false);
  const [modal, setModal] = useState(null); // "sketch" | "card" | null
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrlError, setImageUrlError] = useState("");

  useEffect(() => {
    let active = true;
    const loadPosts = async () => {
      try {
        const migratedCount = await migrateLegacyBlogPosts();
        const savedPosts = await getBlogPosts();
        if (!active) return;
        setPosts(savedPosts);
        if (migratedCount) {
          setMessage(`Imported ${migratedCount} existing post${migratedCount === 1 ? "" : "s"} to the database.`);
        }
      } catch (error) {
        if (active) setMessage(error.message || "Could not load posts from the database.");
      }
    };

    loadPosts();
    return () => {
      active = false;
    };
  }, []);

  // ---------- derived ----------
  const words = useMemo(() => countWords(draft.content), [draft.content]);
  const readMinutes = Math.max(1, Math.ceil(words / 200));
  const headings = useMemo(
    () =>
      draft.content
        .split("\n")
        .map((line, index) => ({ line, index }))
        .filter(({ line }) => /^#{1,3}\s/.test(line))
        .map(({ line, index }) => ({
          level: line.match(/^#+/)[0].length,
          text: line.replace(/^#+\s*/, ""),
          index,
        })),
    [draft.content],
  );
  const publishedCount = useMemo(
    () => posts.filter((p) => p.status === "published").length,
    [posts],
  );
  const visiblePosts = useMemo(
    () =>
      posts.filter(
        (p) =>
          (filter === "all" || p.status === filter) &&
          (p.title || "Untitled").toLowerCase().includes(query.toLowerCase()),
      ),
    [posts, filter, query],
  );
  const checklist = [
    ["Title", draft.title.trim().length >= 10],
    ["Excerpt", draft.excerpt.trim().length > 0],
    ["Cover image", !!draft.image],
    ["At least 300 words", words >= 300],
    ["Tags", draft.tags.length > 0],
    ["Search description", draft.seoDescription.trim().length >= 50],
  ];

  // ---------- draft helpers ----------
  const updateDraft = (field, value) => {
    setDraft((current) => {
      const next = { ...current, [field]: value };
      if (field === "title" && !slugEdited) next.slug = slugify(value);
      return next;
    });
    setDirty(true);
    setMessage("");
  };

  const addTag = (raw) => {
    const tag = raw.trim().replace(/^#/, "").toLowerCase();
    if (!tag || draft.tags.includes(tag) || draft.tags.length >= MAX_TAGS)
      return;
    updateDraft("tags", [...draft.tags, tag]);
  };

  const readFile = (file, cb) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => cb(String(reader.result));
    reader.readAsDataURL(file);
  };

  // ---------- editor commands ----------
  const edit = (transform) => {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const { text, from, to } = transform(el.value, s, e);
    updateDraft("content", text);
    setCaret(from);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(from, to);
    });
  };

  const wrap = (before, after = before, placeholder = "text") =>
    edit((c, s, e) => {
      const sel = c.slice(s, e) || placeholder;
      return {
        text: c.slice(0, s) + before + sel + after + c.slice(e),
        from: s + before.length,
        to: s + before.length + sel.length,
      };
    });

  const prefixLines = (prefix, numbered = false) =>
    edit((c, s, e) => {
      const start = c.lastIndexOf("\n", s - 1) + 1;
      const endIdx = c.indexOf("\n", e);
      const end = endIdx === -1 ? c.length : endIdx;
      const block = c
        .slice(start, end)
        .split("\n")
        .map((l, i) => (numbered ? `${i + 1}. ` : prefix) + l)
        .join("\n");
      return {
        text: c.slice(0, start) + block + c.slice(end),
        from: start,
        to: start + block.length,
      };
    });

  const insertBlock = (block) =>
    edit((c, s, e) => ({
      text: c.slice(0, s) + block + c.slice(e),
      from: s + block.length,
      to: s + block.length,
    }));

  const insertLink = () =>
    edit((c, s, e) => {
      const sel = c.slice(s, e) || "link text";
      const md = `[${sel}](https://)`;
      return {
        text: c.slice(0, s) + md + c.slice(e),
        from: s + sel.length + 3,
        to: s + md.length - 1,
      };
    });

  const tools = [
    { label: "Bold (Ctrl+B)", icon: Bold, run: () => wrap("**") },
    { label: "Italic (Ctrl+I)", icon: Italic, run: () => wrap("*") },
    { label: "Heading 2", icon: Heading2, run: () => prefixLines("## ") },
    { label: "Heading 3", icon: Heading3, run: () => prefixLines("### ") },
    { label: "Quote", icon: Quote, run: () => prefixLines("> ") },
    { label: "Inline code", icon: Code, run: () => wrap("`", "`", "code") },
    {
      label: "Code block",
      icon: Code,
      run: () => wrap("\n```js\n", "\n```\n", "// code"),
      text: "{ }",
    },
    { label: "Link (Ctrl+K)", icon: Link2, run: insertLink },
    { label: "Bullet list", icon: List, run: () => prefixLines("- ") },
    {
      label: "Numbered list",
      icon: ListOrdered,
      run: () => prefixLines("", true),
    },
    { label: "Divider", icon: Minus, run: () => insertBlock("\n\n---\n\n") },
  ];

  const onKeyDown = (event) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    const k = event.key.toLowerCase();
    if (k === "b") {
      event.preventDefault();
      wrap("**");
    }
    if (k === "i") {
      event.preventDefault();
      wrap("*");
    }
    if (k === "k") {
      event.preventDefault();
      insertLink();
    }
  };

  const jumpTo = (lineIndex) => {
    const el = textareaRef.current;
    if (!el) return;
    const offset =
      draft.content.split("\n").slice(0, lineIndex).join("\n").length +
      (lineIndex ? 1 : 0);
    if (view === "preview") setView("split");
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(offset, offset);
      el.scrollTop = Math.max(0, (lineIndex - 3) * 28);
    });
  };

  const applyTemplate = (name) => {
    const hasWork = draft.content.trim() && draft.content !== TEMPLATES.Blank;
    if (
      hasWork &&
      !window.confirm("Replace your current content with this template?")
    )
      return;
    updateDraft("content", TEMPLATES[name]);
  };

  // ---------- visuals ----------
  const newId = () => Math.random().toString(36).slice(2, 8);
  const withEditor = (fn) => {
    if (textareaRef.current) fn();
    else {
      setView("split");
      setTimeout(fn, 80);
    }
  };
  const pickFiles = (mode) => {
    uploadMode.current = mode;
    uploadRef.current?.click();
  };

  // Shrinks big photos to max 1600px so posts stay light. SVG and GIF are kept as-is.
  const toDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        if (/svg|gif/.test(file.type)) return resolve(String(reader.result));
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const k = Math.min(1, 1600 / Math.max(img.width, img.height));
          const c = document.createElement("canvas");
          c.width = Math.round(img.width * k);
          c.height = Math.round(img.height * k);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          resolve(
            c.toDataURL(
              file.type === "image/png" ? "image/png" : "image/jpeg",
              0.82,
            ),
          );
        };
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });

  const addMedia = (items) => {
    const entries = items.map((m) => [newId(), m]);
    setDraft((c) => ({
      ...c,
      media: { ...c.media, ...Object.fromEntries(entries) },
    }));
    setDirty(true);
    return entries.map(([id]) => id);
  };

  const insertFigure = (id) =>
    withEditor(() =>
      edit((c, s, e) => {
        const line = serialize("figure", {
          src: `media:${id}`,
          size: "large",
          align: "center",
        });
        return {
          text: c.slice(0, s) + `\n\n${line}\n\n` + c.slice(e),
          from: s + 2,
          to: s + 2,
        };
      }),
    );

  const insertGallery = (ids) =>
    withEditor(() =>
      edit((c, s, e) => {
        const line = serialize("gallery", {
          srcs: ids
            .slice(0, 3)
            .map((i) => `media:${i}`)
            .join(","),
        });
        return {
          text: c.slice(0, s) + `\n\n${line}\n\n` + c.slice(e),
          from: s + 2,
          to: s + 2,
        };
      }),
    );

  const ingest = async (files, mode = "insert") => {
    const images = [...files].filter((f) => f.type.startsWith("image/"));
    if (!images.length) {
      setMessage("Please choose image files.");
      return;
    }
    try {
      const srcs = await Promise.all(images.map(toDataUrl));
      const ids = addMedia(
        srcs.map((src, i) => ({ src, name: images[i].name, kind: "upload" })),
      );
      if (mode === "library") return;
      if (mode === "gallery" || ids.length > 1) insertGallery(ids);
      else insertFigure(ids[0]);
    } catch {
      setMessage("That image could not be read. Try a JPG, PNG, WebP or SVG.");
    }
  };

  const addImageUrl = () => {
    setImageUrl("");
    setImageUrlError("");
    setModal("image-url");
  };

  const insertImageUrl = (event) => {
    event.preventDefault();
    const url = imageUrl.trim();
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      setImageUrlError("Enter a valid image URL.");
      return;
    }

    if (!/^(https?:|data:|blob:)$/.test(parsedUrl.protocol)) {
      setImageUrlError("Use an http, https, or image data URL.");
      return;
    }

    const [id] = addMedia([
      {
        src: url,
        name: parsedUrl.pathname.split("/").pop()?.slice(0, 60) || "linked-image",
        kind: "link",
      },
    ]);
    insertFigure(id);
    setModal(null);
    setImageUrl("");
    setImageUrlError("");
    setMessage("Image link added to your article.");
  };
  const saveGenerated = (src, name, kind) => {
    const [id] = addMedia([{ src, name, kind }]);
    setModal(null);
    insertFigure(id);
  };
  const removeMedia = (id) => {
    if (
      draft.content.includes(`media:${id}`) &&
      !window.confirm("This image is used in your article. Delete it anyway?")
    )
      return;
    setDraft((c) => {
      const { [id]: _removed, ...rest } = c.media;
      return { ...c, media: rest };
    });
    setDirty(true);
  };
  const setCover = (id) => updateDraft("image", draft.media[id].src);

  const onPaste = (e) => {
    const files = [...(e.clipboardData?.files || [])].filter((f) =>
      f.type.startsWith("image/"),
    );
    if (files.length) {
      e.preventDefault();
      ingest(files);
    }
  };
  const onDrop = (e) => {
    const files = [...(e.dataTransfer?.files || [])];
    if (files.some((f) => f.type.startsWith("image/"))) {
      e.preventDefault();
      ingest(files);
    }
  };
  const trackCaret = (e) => setCaret(e.target.selectionStart);

  // Controls for the figure line the cursor is on.
  const figure = useMemo(() => {
    const c = draft.content;
    const start = c.lastIndexOf("\n", caret - 1) + 1;
    const nl = c.indexOf("\n", caret);
    const end = nl === -1 ? c.length : nl;
    const line = c.slice(start, end);
    return /^\[figure [^\]]*\]\s*$/.test(line)
      ? { start, end, attrs: parseAttrs(line) }
      : null;
  }, [draft.content, caret]);

  const updateFigure = (patch) => {
    if (!figure) return;
    const line = serialize("figure", { ...figure.attrs, ...patch });
    updateDraft(
      "content",
      draft.content.slice(0, figure.start) +
        line +
        draft.content.slice(figure.end),
    );
    setCaret(figure.start);
  };
  const removeFigure = () => {
    if (!figure) return;
    updateDraft(
      "content",
      draft.content.slice(0, figure.start) +
        draft.content.slice(figure.end + 1),
    );
    setCaret(0);
  };

  const mediaList = Object.entries(draft.media || {});
  const mediaBytes = useMemo(
    () => mediaList.reduce((n, [, m]) => n + m.src.length, 0),
    [draft.media],
  );
  const exportMd = () =>
    draft.content.replace(/media:(\w+)/g, (m, id) => draft.media[id]?.src || m);

  const visualActions = [
    {
      label: "Upload image",
      hint: "Resized automatically",
      icon: ImagePlus,
      run: () => pickFiles("insert"),
    },
    {
      label: "Image gallery",
      hint: "Pick 2-3 images side by side",
      icon: LayoutGrid,
      run: () => pickFiles("gallery"),
    },
    ...(mediaList.length > 0
      ? [
          {
            label: "From your media",
            hint: "Reuse an image you already added",
            icon: Images,
            run: () => {
              setFocus(false);
              setPanel("media");
            },
          },
        ]
      : []),
    {
      label: "Image from link",
      hint: "Paste a web address",
      icon: Link2,
      run: addImageUrl,
    },
    {
      label: "Draw a sketch",
      hint: "Draw or annotate right here",
      icon: PenTool,
      run: () => setModal("sketch"),
    },
    {
      label: "Text card",
      hint: "Headline or quote illustration",
      icon: LayoutTemplate,
      run: () => setModal("card"),
    },
    {
      label: "Callout box",
      hint: "Tip, note or warning",
      icon: Lightbulb,
      run: () =>
        insertBlock('\n\n[callout type="tip" text="Your tip here"]\n\n'),
    },
  ];

  // ---------- persistence ----------
  const save = async (status = draft.status || "draft", silent = false) => {
    if (!draft.title.trim()) {
      if (!silent) setMessage("Add a title before saving this post.");
      return;
    }
    try {
      const post = await saveBlogPost({
        ...draft,
        id: activeId,
        status,
        slug: draft.slug || slugify(draft.title),
        readTime: `${readMinutes}m`,
        publishedAt:
          status === "published"
            ? draft.publishedAt || new Date().toISOString()
            : draft.publishedAt,
      });
      setActiveId(post.id);
      setDraft((d) => ({
        ...d,
        ...post,
        tags: post.tags || d.tags,
        media: post.media || d.media,
      }));
      setPosts(await getBlogPosts());
      setSavedAt(new Date());
      setDirty(false);
      if (!silent) {
        setMessage(
          status === "published"
            ? "Published to your portfolio blog."
            : "Draft saved.",
        );
      }
    } catch (error) {
      setMessage(error.message || "Could not save this post to the database.");
    }
  };
  saveRef.current = () => save();

  // Autosave drafts only, so published posts never change without an explicit Publish.
  useEffect(() => {
    if (!dirty || draft.status === "published" || !draft.title.trim()) return;
    const t = setTimeout(() => save("draft", true), 2000);
    return () => clearTimeout(t);
  }, [draft, dirty]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const warn = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const confirmDiscard = () =>
    !dirty || window.confirm("You have unsaved changes. Leave them behind?");
  const newPost = () => {
    if (!confirmDiscard()) return;
    setActiveId(null);
    setDraft(emptyPost);
    setSlugEdited(false);
    setDirty(false);
    setSavedAt(null);
    setMessage("");
  };
  const editPost = (post) => {
    if (!confirmDiscard()) return;
    setActiveId(post.id);
    setDraft({
      ...emptyPost,
      ...post,
      tags: post.tags || [],
      media: post.media || {},
    });
    setSlugEdited(!!post.slug);
    setDirty(false);
    setMessage("");
    setPanel("post");
  };
  const removePost = async (id) => {
    if (!window.confirm("Delete this article permanently?")) return;
    try {
      await deleteBlogPost(id);
      setPosts(await getBlogPosts());
      if (String(activeId) === String(id)) {
        setActiveId(null);
        setDraft(emptyPost);
        setDirty(false);
      }
      setMessage("Article deleted.");
    } catch (error) {
      setMessage(error.message || "Could not delete this post.");
    }
  };
  const changeStatus = async (id) => {
    try {
      const updatedPost = await toggleBlogPostStatus(id);
      setPosts(await getBlogPosts());
      if (String(activeId) === String(id)) {
        setDraft((d) => ({
          ...d,
          status: updatedPost.status,
          publishedAt: updatedPost.publishedAt,
        }));
      }
      setMessage(updatedPost.status === "published" ? "Article published." : "Article moved to drafts.");
    } catch (error) {
      setMessage(error.message || "Could not update this post.");
    }
  };
  const duplicatePost = async (post) => {
    try {
      const copy = await saveBlogPost({
        ...post,
        id: null,
        title: `${post.title || "Untitled"} (copy)`,
        slug: `${post.slug || "post"}-copy`,
        status: "draft",
        publishedAt: undefined,
      });
      setPosts(await getBlogPosts());
      editPost(copy);
    } catch (error) {
      setMessage(error.message || "Could not duplicate this post.");
    }
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(exportMd());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setMessage("Could not copy. Select the text and copy manually.");
    }
  };
  const downloadMarkdown = () => {
    const front = `---\ntitle: "${draft.title}"\nslug: ${draft.slug}\ncategory: ${draft.category}\ntags: [${draft.tags.join(", ")}]\n---\n\n`;
    const url = URL.createObjectURL(
      new Blob([front + exportMd()], { type: "text/markdown" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `${draft.slug || "post"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const showEditor = view !== "preview";
  const showPreview = view !== "editor";
  const previewPane = (
    <article className="prose prose-neutral max-w-none p-5 dark:prose-invert sm:p-8">
      {draft.image && (
        <img
          src={draft.image}
          alt={draft.imageAlt || ""}
          className="mb-6 max-h-72 w-full object-cover"
        />
      )}
      <p className="!mb-1 text-xs text-neutral-500">
        {draft.category} · {readMinutes} min read
      </p>
      <h1 className="!mt-0">{draft.title || "Untitled post"}</h1>
      {draft.excerpt && (
        <p className="lead text-neutral-500">{draft.excerpt}</p>
      )}
      <div
        dangerouslySetInnerHTML={{
          __html: richMarkdownToHtml(draft.content, draft.media),
        }}
      />
    </article>
  );

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F7F7F4] text-neutral-950 dark:bg-[#0F0F0F] dark:text-neutral-50">
      {!focus && (
        <div className="fixed inset-x-0 top-0 z-50 mx-auto w-full max-w-[1040px]">
          <Navbar />
        </div>
      )}
      <main
        className={`mx-auto w-full px-3 pb-12 sm:px-5 lg:px-8 ${focus ? "max-w-7xl pt-4" : "max-w-[1440px] pt-[72px] sm:pt-20"}`}
      >
        {!focus && (
          <header className="mb-4 flex flex-col gap-3 border-b border-neutral-200/80 pb-4 dark:border-neutral-800 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-500 sm:text-[10px] sm:tracking-[0.18em]">
                Private workspace / {publishedCount} published /{" "}
                {posts.length - publishedCount} drafts
              </p>
              <h1 className="aktura-font mt-1.5 text-2xl tracking-wider sm:mt-2 sm:text-3xl">
                Blog writing
              </h1>
              <p className="mt-1.5 max-w-xl text-xs leading-5 text-neutral-500 dark:text-neutral-400 sm:mt-2 sm:text-sm sm:leading-6">
                Write, preview, publish, and maintain the articles that appear
                on your public blog.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:shrink-0 sm:gap-2">
              <button
                type="button"
                onClick={() => navigate("/blog")}
                className={ghostBtn}
              >
                View blog
              </button>
              <button type="button" onClick={newPost} className={accentBtn}>
                <FilePlus2 className="size-4" aria-hidden="true" />
                New post
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className={`${ghostBtn} inline-flex items-center gap-1.5`}
              >
                <LogOut className="size-3.5" aria-hidden="true" />
                Sign out
              </button>
            </div>
          </header>
        )}
        {!focus && <AdGridSection />}

        <div
          className={`grid min-w-0 gap-4 sm:gap-5 ${focus ? "" : "lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]"}`}
        >
          {/* ---------- Writing surface ---------- */}
          <section className="min-w-0 rounded-md border border-neutral-200/80 bg-white/75 shadow-sm dark:border-neutral-800 dark:bg-[#151515]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
              <div className="flex gap-1">
                {[
                  ["editor", "Write", null],
                  ["split", "Split", Columns],
                  ["preview", "Preview", Eye],
                ].map(([id, label, Icon]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setView(id)}
                    aria-pressed={view === id}
                    className={`${id === "split" ? "hidden lg:inline-flex" : "inline-flex"} items-center gap-1.5 px-3 py-1.5 text-xs ${view === id ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" : "text-neutral-500"}`}
                  >
                    {Icon && <Icon className="size-3.5" aria-hidden="true" />}
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-[10px] text-neutral-500"
                  role="status"
                >
                  {dirty
                    ? "Unsaved changes"
                    : savedAt
                      ? `Saved ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                      : "Not saved yet"}
                </span>
                <button
                  type="button"
                  onClick={() => setFocus((f) => !f)}
                  aria-label={focus ? "Exit focus mode" : "Focus mode"}
                  title={focus ? "Exit focus mode" : "Focus mode"}
                  className="text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
                >
                  {focus ? (
                    <Minimize2 className="size-4" aria-hidden="true" />
                  ) : (
                    <Maximize2 className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {view !== "preview" && (
              <div className="space-y-4 border-b border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
                <input
                  value={draft.title}
                  onChange={(e) => updateDraft("title", e.target.value)}
                  placeholder="Article title"
                  className="w-full border-0 bg-transparent px-0 py-2 text-2xl font-semibold outline-none placeholder:text-neutral-300 dark:placeholder:text-neutral-700 sm:text-3xl"
                />
                <input
                  value={draft.excerpt}
                  onChange={(e) => updateDraft("excerpt", e.target.value)}
                  placeholder="Short excerpt shown on blog cards"
                  maxLength={180}
                  className={inputCls}
                />
              </div>
            )}

            {showEditor && (
              <div
                className="flex flex-wrap items-center gap-1 border-b border-neutral-200 px-2 py-2 dark:border-neutral-800 sm:px-3"
                role="toolbar"
                aria-label="Editor tools"
              >
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFormatMenu((open) => !open)}
                    aria-label="Writing tools"
                    title="Writing tools"
                    aria-expanded={formatMenu}
                    aria-haspopup="menu"
                    className="inline-flex size-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-white/[0.07]"
                  >
                    <PenTool className="size-4" aria-hidden="true" />
                  </button>
                  {formatMenu && (
                    <>
                      <button
                        type="button"
                        aria-label="Close formatting menu"
                        className="fixed inset-0 z-10 cursor-default"
                        onClick={() => setFormatMenu(false)}
                      />
                      <div
                        role="menu"
                        aria-label="Writing tools"
                        className="absolute left-0 top-full z-20 mt-1 grid max-h-[min(70vh,32rem)] w-[min(24rem,calc(100vw-2rem))] grid-cols-2 gap-1 overflow-y-auto rounded-md border border-neutral-200 bg-white p-2 shadow-xl dark:border-neutral-800 dark:bg-[#171717]"
                      >
                        <p className="col-span-2 px-2 pb-1 pt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-400">
                          Format
                        </p>
                        {tools.map(({ label, icon: Icon, run, text }) => (
                          <button
                            key={label}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setFormatMenu(false);
                              run();
                            }}
                            title={label}
                            className="flex min-h-10 items-center gap-2 rounded-md px-2 text-left text-xs text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-white/[0.07]"
                          >
                            {text ? (
                              <span className="inline-flex size-4 shrink-0 items-center justify-center font-mono text-[10px]">
                                {text}
                              </span>
                            ) : (
                              <Icon className="size-4 shrink-0" aria-hidden="true" />
                            )}
                            <span className="truncate">
                              {label.replace(/\s+\([^)]*\)$/, "")}
                            </span>
                          </button>
                        ))}
                        <p className="col-span-2 border-t border-neutral-200 px-2 pb-1 pt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-400 dark:border-neutral-800">
                          Insert
                        </p>
                        {visualActions.map(
                          ({ label, hint, icon: Icon, run }) => (
                            <button
                              key={label}
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setFormatMenu(false);
                                run();
                              }}
                              className="flex min-h-14 items-start gap-2 rounded-md px-2 py-2 text-left text-xs text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-white/[0.07]"
                            >
                              <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                              <span className="min-w-0">
                                <span className="block truncate">{label}</span>
                                <span className="mt-0.5 block line-clamp-2 text-[10px] leading-4 text-neutral-500 dark:text-neutral-400">
                                  {hint}
                                </span>
                              </span>
                            </button>
                          ),
                        )}
                      </div>
                    </>
                  )}
                </div>
                <select
                  aria-label="Insert template"
                  value=""
                  onChange={(e) =>
                    e.target.value && applyTemplate(e.target.value)
                  }
                  className="max-w-28 rounded-md border border-neutral-200 bg-white/70 px-2 py-2 text-[11px] outline-none dark:border-neutral-800 dark:bg-[#191919]"
                >
                  <option value="">Templates</option>
                  {Object.keys(TEMPLATES).map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
                <div className="ml-auto flex gap-1">
                  <button
                    type="button"
                    onClick={copyMarkdown}
                    title="Copy markdown"
                    aria-label="Copy markdown"
                    className="inline-flex size-9 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/[0.07]"
                  >
                    {copied ? (
                      <Check className="size-4" aria-hidden="true" />
                    ) : (
                      <Copy className="size-4" aria-hidden="true" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={downloadMarkdown}
                    title="Download .md"
                    aria-label="Download markdown file"
                    className="inline-flex size-9 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/[0.07]"
                  >
                    <Download className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            <div
              className={
                showEditor && showPreview
                  ? "grid lg:grid-cols-2 lg:divide-x lg:divide-neutral-200 dark:lg:divide-neutral-800"
                  : ""
              }
            >
              {showEditor && (
                <div className="min-w-0">
                  {figure && (
                    <div className="flex flex-wrap items-end gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs dark:border-neutral-800 dark:bg-white/5">
                      {resolveSrc(figure.attrs.src, draft.media) && (
                        <img
                          src={resolveSrc(figure.attrs.src, draft.media)}
                          alt=""
                          className="size-12 object-cover"
                        />
                      )}
                      <Seg
                        label="Size"
                        value={figure.attrs.size || "large"}
                        options={["small", "medium", "large"]}
                        onChange={(v) => updateFigure({ size: v })}
                      />
                      <Seg
                        label="Align"
                        value={figure.attrs.align || "center"}
                        options={["left", "center", "right"]}
                        onChange={(v) => updateFigure({ align: v })}
                      />
                      <label className="min-w-[140px] flex-1 font-medium">
                        Caption
                        <input
                          value={figure.attrs.caption || ""}
                          onChange={(e) =>
                            updateFigure({ caption: e.target.value })
                          }
                          placeholder="Optional"
                          className={`${inputCls} mt-1 font-normal`}
                        />
                      </label>
                      <label className="min-w-[140px] flex-1 font-medium">
                        Alt text
                        <input
                          value={figure.attrs.alt || ""}
                          onChange={(e) =>
                            updateFigure({ alt: e.target.value })
                          }
                          placeholder="Describe the image"
                          className={`${inputCls} mt-1 font-normal`}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={removeFigure}
                        className="inline-flex items-center gap-1 px-2 py-2 text-red-500"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        Remove
                      </button>
                    </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    value={draft.content}
                    onChange={(e) => updateDraft("content", e.target.value)}
                    onKeyDown={onKeyDown}
                    onSelect={trackCaret}
                    onClick={trackCaret}
                    onKeyUp={trackCaret}
                    onPaste={onPaste}
                    onDrop={onDrop}
                    onDragOver={(e) => e.preventDefault()}
                    spellCheck="true"
                    aria-label="Article content"
                    className={`w-full resize-y border-0 bg-transparent p-4 font-mono text-sm leading-7 outline-none sm:p-6 ${focus ? "min-h-[75vh]" : "min-h-[480px]"}`}
                  />
                </div>
              )}
              {showPreview && (
                <div
                  className={
                    showEditor
                      ? "hidden max-h-[640px] overflow-y-auto lg:block"
                      : ""
                  }
                >
                  {previewPane}
                </div>
              )}
              {view === "split" && (
                <div className="lg:hidden">{previewPane}</div>
              )}
            </div>

            <div className="flex flex-col items-start justify-between gap-3 border-t border-neutral-200 px-3 py-3 dark:border-neutral-800 sm:flex-row sm:items-center sm:px-5">
              <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] text-neutral-500 sm:gap-4 sm:text-[11px]">
                <span>{words} words</span>
                <span>{draft.content.length} characters</span>
                <span>{readMinutes} min read</span>
                <span>{headings.length} headings</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => save("draft")}
                  className={ghostBtn}
                >
                  {draft.status === "published"
                    ? "Move to drafts"
                    : "Save draft"}
                </button>
                <button
                  type="button"
                  onClick={() => save("published")}
                  className={accentBtn}
                >
                  <Upload className="size-3.5" aria-hidden="true" />
                  {draft.status === "published" ? "Update post" : "Publish"}
                </button>
              </div>
            </div>
            {message && (
              <p
                role="status"
                className="border-t border-neutral-200 px-3 py-3 text-xs text-emerald-700 dark:border-neutral-800 dark:text-emerald-300 sm:px-5 sm:text-sm"
              >
                {message}
              </p>
            )}
          </section>

          {/* ---------- Side panel ---------- */}
          {!focus && (
            <aside className="h-fit min-w-0 rounded-md border border-neutral-200/80 bg-white/75 shadow-sm dark:border-neutral-800 dark:bg-[#151515]">
              <div
                className="flex border-b border-neutral-200 dark:border-neutral-800"
                role="tablist"
              >
                {[
                  ["post", "Post"],
                  [
                    "media",
                    `Media${mediaList.length ? ` (${mediaList.length})` : ""}`,
                  ],
                  ["outline", "Outline"],
                  ["library", "Library"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={panel === id}
                    onClick={() => setPanel(id)}
                    className={`min-w-0 flex-1 px-1.5 py-3 text-[10px] transition-colors sm:px-3 sm:text-xs ${panel === id ? "border-b-2 border-emerald-600 font-semibold text-neutral-950 dark:border-emerald-400 dark:text-white" : "text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {panel === "post" && (
                <div className="space-y-5 p-4">
                  <label className="block text-xs font-medium">
                    Category
                    <select
                      value={draft.category}
                      onChange={(e) => updateDraft("category", e.target.value)}
                      className={`${inputCls} mt-1.5`}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>

                  <div>
                    <p className="text-xs font-medium">Cover image</p>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        readFile(e.dataTransfer.files?.[0], (src) =>
                          updateDraft("image", src),
                        );
                      }}
                      className="mt-1.5"
                    >
                      {draft.image ? (
                        <div className="relative overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800">
                          <img
                            src={draft.image}
                            alt={draft.imageAlt || "Cover preview"}
                            className="h-32 w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => updateDraft("image", "")}
                            aria-label="Remove cover image"
                            title="Remove cover image"
                            className="absolute right-2 top-2 inline-flex size-7 items-center justify-center bg-black/60 text-white"
                          >
                            <X className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="flex w-full flex-col items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-6 text-xs text-neutral-500 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-white/3 dark:hover:bg-white/6"
                        >
                          <ImagePlus className="size-5" aria-hidden="true" />
                          Drop an image or click to upload
                        </button>
                      )}
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          readFile(e.target.files?.[0], (src) =>
                            updateDraft("image", src),
                          )
                        }
                        className="hidden"
                      />
                    </div>
                    {draft.image && (
                      <input
                        value={draft.imageAlt}
                        onChange={(e) =>
                          updateDraft("imageAlt", e.target.value)
                        }
                        placeholder="Describe the image for screen readers"
                        className={`${inputCls} mt-2`}
                      />
                    )}
                    <input
                      type="url"
                      value={draft.image.startsWith("data:") ? "" : draft.image}
                      onChange={(e) => updateDraft("image", e.target.value.trim())}
                      placeholder="Or paste a cover image URL (https://...)"
                      className={`${inputCls} mt-2`}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium">
                      Tags{" "}
                      <span className="font-normal text-neutral-500">
                        ({draft.tags.length}/{MAX_TAGS})
                      </span>
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {draft.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 bg-neutral-100 px-2 py-1 text-xs dark:bg-white/10"
                        >
                          #{t}
                          <button
                            type="button"
                            aria-label={`Remove tag ${t}`}
                            onClick={() =>
                              updateDraft(
                                "tags",
                                draft.tags.filter((x) => x !== t),
                              )
                            }
                          >
                            <X className="size-3" aria-hidden="true" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      value={tagInput}
                      disabled={draft.tags.length >= MAX_TAGS}
                      placeholder="Type a tag, press Enter"
                      className={`${inputCls} mt-2`}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addTag(tagInput);
                          setTagInput("");
                        }
                      }}
                    />
                  </div>

                  <label className="block text-xs font-medium">
                    URL slug
                    <input
                      value={draft.slug}
                      onChange={(e) => {
                        setSlugEdited(true);
                        updateDraft("slug", slugify(e.target.value));
                      }}
                      placeholder="auto-from-title"
                      className={`${inputCls} mt-1.5 font-mono`}
                    />
                    <span className="mt-1 block truncate font-mono text-[10px] font-normal text-neutral-500">
                      /blog/{draft.slug || "your-post"}
                    </span>
                  </label>

                  <label className="block text-xs font-medium">
                    Website / source URL
                    <input
                      value={draft.websiteUrl || ""}
                      onChange={(e) =>
                        updateDraft("websiteUrl", e.target.value.trim())
                      }
                      placeholder="https://example.com or GitHub repo"
                      className={`${inputCls} mt-1.5`}
                    />
                  </label>

                  <label className="block text-xs font-medium">
                    Search description
                    <textarea
                      value={draft.seoDescription}
                      onChange={(e) =>
                        updateDraft("seoDescription", e.target.value)
                      }
                      rows={3}
                      maxLength={160}
                      className={`${inputCls} mt-1.5 resize-none`}
                      placeholder="Shown in Google results"
                    />
                    <span
                      className={`mt-1 block text-right font-mono text-[10px] font-normal ${draft.seoDescription.length > 150 ? "text-amber-500" : "text-neutral-500"}`}
                    >
                      {draft.seoDescription.length}/160
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => updateDraft("featured", !draft.featured)}
                    aria-pressed={draft.featured}
                    className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-xs transition-colors ${draft.featured ? "border-emerald-500 bg-emerald-500/5" : "border-neutral-200 dark:border-neutral-800"}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Star
                        className={`size-4 ${draft.featured ? "fill-current" : ""}`}
                        aria-hidden="true"
                      />
                      Feature on top of blog
                    </span>
                    <span className="text-neutral-500">
                      {draft.featured ? "On" : "Off"}
                    </span>
                  </button>

                  <div>
                    <p className="text-xs font-medium">Before you publish</p>
                    <ul className="mt-2 space-y-1.5">
                      {checklist.map(([label, ok]) => (
                        <li
                          key={label}
                          className={`flex items-center gap-2 text-xs ${ok ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-500"}`}
                        >
                          {ok ? (
                            <Check className="size-3.5" aria-hidden="true" />
                          ) : (
                            <span className="size-3.5 rounded-full border border-neutral-300 dark:border-neutral-700" />
                          )}
                          {label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {panel === "media" && (
                <div className="space-y-4 p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => pickFiles("library")}
                      className={`${ghostBtn} inline-flex items-center justify-center gap-1.5`}
                    >
                      <Upload className="size-3.5" aria-hidden="true" />
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className={`${ghostBtn} inline-flex items-center justify-center gap-1.5`}
                    >
                      <Link2 className="size-3.5" aria-hidden="true" />
                      From link
                    </button>
                    <button
                      type="button"
                      onClick={() => setModal("sketch")}
                      className={`${ghostBtn} inline-flex items-center justify-center gap-1.5`}
                    >
                      <PenTool className="size-3.5" aria-hidden="true" />
                      Sketch
                    </button>
                    <button
                      type="button"
                      onClick={() => setModal("card")}
                      className={`${ghostBtn} inline-flex items-center justify-center gap-1.5`}
                    >
                      <LayoutTemplate className="size-3.5" aria-hidden="true" />
                      Text card
                    </button>
                  </div>
                  {mediaList.length ? (
                    <ul className="grid grid-cols-2 gap-2">
                      {mediaList.map(([id, m]) => (
                        <li
                          key={id}
                          className="border border-neutral-200 dark:border-neutral-800"
                        >
                          <img
                            src={m.src}
                            alt={m.name || "Media"}
                            className="h-24 w-full object-cover"
                          />
                          <p className="truncate px-2 py-1.5 text-[10px] text-neutral-500">
                            {draft.content.includes(`media:${id}`)
                              ? "In article"
                              : m.name || m.kind}
                          </p>
                          <div className="flex border-t border-neutral-200 text-[11px] dark:border-neutral-800">
                            <button
                              type="button"
                              onClick={() => insertFigure(id)}
                              className="flex-1 py-1.5 hover:bg-neutral-100 dark:hover:bg-white/10"
                            >
                              Insert
                            </button>
                            <button
                              type="button"
                              onClick={() => setCover(id)}
                              className="flex-1 py-1.5 hover:bg-neutral-100 dark:hover:bg-white/10"
                            >
                              Cover
                            </button>
                            <button
                              type="button"
                              onClick={() => removeMedia(id)}
                              aria-label="Delete image"
                              className="px-2 text-red-500"
                            >
                              <Trash2 className="size-3" aria-hidden="true" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm leading-6 text-neutral-500">
                      Images you upload, draw or create appear here so you can
                      reuse them. You can also paste or drop an image straight
                      into the editor.
                    </p>
                  )}
                  {mediaBytes > 2.5e6 && (
                    <p className="text-xs leading-5 text-amber-700 dark:text-amber-400">
                      Your images use {(mediaBytes / 1e6).toFixed(1)} MB. Large
                      images upload to Supabase when saved and may take longer.
                    </p>
                  )}
                </div>
              )}

              {panel === "outline" && (
                <div className="p-4">
                  {headings.length ? (
                    <ul className="space-y-1">
                      {headings.map((h) => (
                        <li
                          key={h.index}
                          style={{ paddingLeft: (h.level - 1) * 12 }}
                        >
                          <button
                            type="button"
                            onClick={() => jumpTo(h.index)}
                            className="w-full truncate py-1 text-left text-sm text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                          >
                            {h.text || "Untitled heading"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-neutral-500">
                      Add headings with # or the toolbar and they will show
                      here. Click one to jump to it.
                    </p>
                  )}
                </div>
              )}

              {panel === "library" && (
                <div>
                  <div className="space-y-2 border-b border-neutral-200 p-4 dark:border-neutral-800">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-2.5 size-4 text-neutral-400"
                        aria-hidden="true"
                      />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search articles"
                        aria-label="Search articles"
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                    <div className="flex gap-1">
                      {["all", "published", "draft"].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFilter(f)}
                          aria-pressed={filter === f}
                          className={`px-2.5 py-1 text-xs capitalize ${filter === f ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" : "text-neutral-500"}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="max-h-[520px] divide-y divide-neutral-200 overflow-y-auto dark:divide-neutral-800">
                    {visiblePosts.length ? (
                      visiblePosts.map((post) => (
                        <div
                          key={post.id}
                          className={`space-y-3 p-4 ${String(post.id) === String(activeId) ? "bg-neutral-100/70 dark:bg-white/5" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => editPost(post)}
                              className="min-w-0 text-left"
                            >
                              <span className="block truncate text-sm font-medium hover:underline">
                                {post.featured && "★ "}
                                {post.title || "Untitled post"}
                              </span>
                              <span className="mt-1 block text-[10px] uppercase tracking-widest text-neutral-500">
                                {post.category} / {post.status}
                              </span>
                            </button>
                            <span
                              className={`mt-1 size-2 shrink-0 rounded-full ${post.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`}
                            />
                          </div>
                          <div className="flex gap-3 text-xs text-neutral-500">
                            <button
                              type="button"
                              onClick={() => changeStatus(post.id)}
                              className="hover:text-neutral-950 dark:hover:text-white"
                            >
                              {post.status === "published"
                                ? "Unpublish"
                                : "Publish"}
                            </button>
                            <button
                              type="button"
                              onClick={() => duplicatePost(post)}
                              className="inline-flex items-center gap-1 hover:text-neutral-950 dark:hover:text-white"
                            >
                              <CopyPlus className="size-3" aria-hidden="true" />
                              Duplicate
                            </button>
                            <button
                              type="button"
                              onClick={() => removePost(post.id)}
                              className="inline-flex items-center gap-1 text-red-500"
                            >
                              <Trash2 className="size-3" aria-hidden="true" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="p-4 text-sm text-neutral-500">
                        {posts.length
                          ? "No articles match your search."
                          : "Your drafts will appear here."}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </aside>
          )}
        </div>
      </main>

      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          ingest(e.target.files, uploadMode.current);
          e.target.value = "";
        }}
      />
      {modal === "image-url" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="image-url-title"
          className="fixed inset-0 z-90 flex items-center justify-center bg-neutral-950/45 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModal(null);
              setImageUrlError("");
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setModal(null);
              setImageUrlError("");
            }
          }}
        >
          <form
            onSubmit={insertImageUrl}
            className="w-full max-w-lg rounded-md border border-neutral-200 bg-[#F7F7F4] p-5 text-neutral-950 shadow-2xl dark:border-neutral-800 dark:bg-[#151515] dark:text-neutral-50 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="image-url-title" className="text-base font-semibold">
                  Add image from link
                </h2>
                <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                  Paste an image address to insert it at your cursor.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setModal(null);
                  setImageUrlError("");
                }}
                aria-label="Close image link dialog"
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-neutral-950 dark:hover:bg-white/8 dark:hover:text-white"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 flex min-w-0 items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 p-1.5 pl-4 shadow-inner transition-colors focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15 dark:border-neutral-700 dark:bg-[#242424] dark:focus-within:border-emerald-400">
              <Link2
                className="size-4 shrink-0 text-neutral-500 dark:text-neutral-400"
                aria-hidden="true"
              />
              <label htmlFor="blog-image-url" className="sr-only">
                Image URL
              </label>
              <input
                id="blog-image-url"
                type="text"
                inputMode="url"
                autoComplete="url"
                autoCapitalize="none"
                spellCheck={false}
                autoFocus
                value={imageUrl}
                onChange={(event) => {
                  setImageUrl(event.target.value);
                  setImageUrlError("");
                }}
                placeholder="https://example.com/image.jpg"
                aria-describedby={imageUrlError ? "blog-image-url-error" : undefined}
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-500 dark:text-white dark:placeholder:text-neutral-500"
              />
              <button
                type="submit"
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-emerald-600 px-4 text-xs font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-emerald-400 dark:text-neutral-950 dark:hover:bg-emerald-300"
              >
                <ImagePlus className="size-3.5" aria-hidden="true" />
                Add
              </button>
            </div>

            {imageUrlError && (
              <p
                id="blog-image-url-error"
                role="alert"
                className="mt-2 px-4 text-xs text-red-600 dark:text-red-400"
              >
                {imageUrlError}
              </p>
            )}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setModal(null);
                  setImageUrlError("");
                }}
                className="rounded-md px-3 py-2 text-xs text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-neutral-950 dark:hover:bg-white/8 dark:hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {modal === "sketch" && (
        <SketchModal
          onClose={() => setModal(null)}
          onSave={(src) => saveGenerated(src, "Sketch", "sketch")}
        />
      )}
      {modal === "card" && (
        <CardModal
          onClose={() => setModal(null)}
          onSave={(src) => saveGenerated(src, "Text card", "card")}
        />
      )}
    </div>
  );
};

export default BlogWritting;
