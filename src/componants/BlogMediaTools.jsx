// Save as: src/componants/BlogMediaTools.jsx
import { useEffect, useRef, useState } from "react";
import { Eraser, Undo2, Trash2, X } from "lucide-react";

const accentBtn =
  "inline-flex items-center gap-2 bg-[#542A52] px-3 py-2 text-xs text-white dark:bg-[#FFB39A] dark:text-neutral-950";
const ghostBtn =
  "inline-flex items-center gap-1.5 border border-neutral-300 px-3 py-2 text-xs hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-white/5";

const Shell = ({ title, onClose, footer, children }) => {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="max-h-full w-full max-w-3xl overflow-y-auto border border-neutral-300 bg-[#F7F7F4] text-neutral-950 dark:border-neutral-800 dark:bg-[#0F0F0F] dark:text-neutral-50">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <h2 className="text-sm font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="p-4">{children}</div>
        <div className="flex justify-end gap-2 border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
          {footer}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Sketchpad ---------------- */
const W = 960,
  H = 600;
const INKS = [
  "#171717",
  "#542A52",
  "#FFB39A",
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#ffffff",
];
const PAPERS = [
  ["White", "#ffffff"],
  ["Paper", "#f7f7f4"],
  ["Night", "#171717"],
  ["Clear", null],
];

export const SketchModal = ({ onSave, onClose }) => {
  const ref = useRef(null);
  const drawing = useRef(false);
  const last = useRef([0, 0]);
  const history = useRef([]);
  const [ink, setInk] = useState(INKS[0]);
  const [size, setSize] = useState(4);
  const [erase, setErase] = useState(false);
  const [paper, setPaper] = useState("#ffffff");

  const ctx = () => ref.current.getContext("2d");
  const point = (e) => {
    const r = ref.current.getBoundingClientRect();
    return [
      ((e.clientX - r.left) * W) / r.width,
      ((e.clientY - r.top) * H) / r.height,
    ];
  };
  const snapshot = () => {
    history.current.push(ctx().getImageData(0, 0, W, H));
    if (history.current.length > 30) history.current.shift();
  };

  const stroke = (e) => {
    if (!drawing.current) return;
    const c = ctx();
    const [x, y] = point(e);
    c.globalCompositeOperation = erase ? "destination-out" : "source-over";
    c.strokeStyle = ink;
    c.lineWidth = erase ? size * 3 : size;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(...last.current);
    c.lineTo(x, y);
    c.stroke();
    last.current = [x, y];
  };
  const down = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    snapshot();
    drawing.current = true;
    last.current = point(e);
    stroke(e);
  };
  const up = () => {
    drawing.current = false;
  };
  const undo = () => {
    const s = history.current.pop();
    if (s) ctx().putImageData(s, 0, 0);
  };
  const clear = () => {
    snapshot();
    ctx().clearRect(0, 0, W, H);
  };
  const save = () => {
    const out = document.createElement("canvas");
    out.width = W;
    out.height = H;
    const c = out.getContext("2d");
    if (paper) {
      c.fillStyle = paper;
      c.fillRect(0, 0, W, H);
    }
    c.drawImage(ref.current, 0, 0);
    onSave(out.toDataURL("image/png"));
  };

  return (
    <Shell
      title="Draw a sketch"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={ghostBtn}>
            Cancel
          </button>
          <button type="button" onClick={save} className={accentBtn}>
            Add to article
          </button>
        </>
      }
    >
      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex gap-1.5" role="group" aria-label="Ink colour">
          {INKS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Ink ${c}`}
              aria-pressed={!erase && ink === c}
              onClick={() => {
                setInk(c);
                setErase(false);
              }}
              style={{ background: c }}
              className={`size-6 border ${!erase && ink === c ? "ring-2 ring-[#542A52] ring-offset-1 dark:ring-[#FFB39A]" : "border-neutral-300"}`}
            />
          ))}
        </div>
        <label className="flex items-center gap-2">
          Brush
          <input
            type="range"
            min="1"
            max="24"
            value={size}
            onChange={(e) => setSize(+e.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={() => setErase((v) => !v)}
          aria-pressed={erase}
          className={`${ghostBtn} ${erase ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" : ""}`}
        >
          <Eraser className="size-3.5" aria-hidden="true" />
          Eraser
        </button>
        <button type="button" onClick={undo} className={ghostBtn}>
          <Undo2 className="size-3.5" aria-hidden="true" />
          Undo
        </button>
        <button type="button" onClick={clear} className={ghostBtn}>
          <Trash2 className="size-3.5" aria-hidden="true" />
          Clear
        </button>
        <div className="ml-auto flex items-center gap-1.5">
          Paper
          {PAPERS.map(([name, v]) => (
            <button
              key={name}
              type="button"
              onClick={() => setPaper(v)}
              aria-pressed={paper === v}
              className={`px-2 py-1 ${paper === v ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" : "text-neutral-500"}`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <canvas
        ref={ref}
        width={W}
        height={H}
        onPointerDown={down}
        onPointerMove={stroke}
        onPointerUp={up}
        onPointerCancel={up}
        aria-label="Drawing canvas"
        style={{ background: paper || "#e5e5e5", touchAction: "none" }}
        className="h-auto w-full cursor-crosshair border border-neutral-300 dark:border-neutral-700"
      />
    </Shell>
  );
};

/* ---------------- Text card illustration ---------------- */
const THEMES = {
  Plum: ["#542A52", "#8b4a86", "#FFE3D9"],
  Peach: ["#FFB39A", "#ff8a65", "#2a1220"],
  Ink: ["#171717", "#3f3f46", "#f7f7f4"],
  Ocean: ["#0f4c75", "#3282b8", "#ffffff"],
};
const xml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const wrapText = (t, n) => {
  const lines = [];
  let cur = "";
  t.split(/\s+/)
    .filter(Boolean)
    .forEach((w) => {
      if ((cur + " " + w).trim().length > n) {
        lines.push(cur);
        cur = w;
      } else cur = (cur + " " + w).trim();
    });
  if (cur) lines.push(cur);
  return lines;
};

const buildCard = ({ text, by, theme, kind }) => {
  const [a, b, fg] = THEMES[theme];
  const quote = kind === "Quote";
  const lines = wrapText(text || "Your headline here", quote ? 30 : 24).slice(
    0,
    5,
  );
  const fs = lines.length > 3 ? 56 : 72,
    lh = fs * 1.2;
  const y0 = (630 - lines.length * lh) / 2 + fs * 0.85 - (by ? 20 : 0);
  const px = quote ? 600 : 90,
    anchor = quote ? "middle" : "start";
  const body = lines
    .map(
      (l, i) =>
        `<text x="${px}" y="${y0 + i * lh}" text-anchor="${anchor}" font-family="Georgia,serif" font-size="${fs}" font-weight="700" fill="${fg}">${xml(l)}</text>`,
    )
    .join("");
  const byline = by
    ? `<text x="${px}" y="${y0 + lines.length * lh + 24}" text-anchor="${anchor}" font-family="system-ui,sans-serif" font-size="28" fill="${fg}" opacity=".7">${xml(by)}</text>`
    : "";
  const mark = quote
    ? `<text x="600" y="130" text-anchor="middle" font-family="Georgia,serif" font-size="170" fill="${fg}" opacity=".25">\u201C</text>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><circle cx="1100" cy="60" r="220" fill="${fg}" opacity=".08"/><circle cx="80" cy="640" r="160" fill="${fg}" opacity=".08"/>${mark}${body}${byline}</svg>`;
};

export const CardModal = ({ onSave, onClose }) => {
  const [text, setText] = useState("");
  const [by, setBy] = useState("");
  const [theme, setTheme] = useState("Plum");
  const [kind, setKind] = useState("Headline");
  const svg = buildCard({ text, by, theme, kind });
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const pill = (active) =>
    `px-3 py-1.5 text-xs ${active ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" : "text-neutral-500"}`;

  return (
    <Shell
      title="Create a text card"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={ghostBtn}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!text.trim()}
            onClick={() => onSave(url)}
            className={`${accentBtn} disabled:opacity-40`}
          >
            Add to article
          </button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-3 text-xs">
          <div className="flex">
            {["Headline", "Quote"].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                aria-pressed={kind === k}
                className={pill(kind === k)}
              >
                {k}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            maxLength={140}
            aria-label="Card text"
            placeholder={
              kind === "Quote"
                ? "A line worth remembering"
                : "The big idea of this section"
            }
            className="w-full border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-[#542A52] dark:border-neutral-800 dark:focus:border-[#FFB39A]"
          />
          <input
            value={by}
            onChange={(e) => setBy(e.target.value)}
            placeholder="Byline (optional)"
            aria-label="Byline"
            className="w-full border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-800"
          />
          <div className="flex flex-wrap">
            {Object.keys(THEMES).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                aria-pressed={theme === t}
                className={pill(theme === t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <img
          src={url}
          alt="Card preview"
          className="w-full border border-neutral-200 dark:border-neutral-800"
        />
      </div>
    </Shell>
  );
};
