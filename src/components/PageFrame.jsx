import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/componants/Navbar";
import Footer from "@/componants/Footer";
import { GoogleAdSlot } from "@/components/google-ads";

/* Shared grid language for Projects / Blog / Each blog.
   Strict 840px column, dashed rails, edge-to-edge dashed rules. */
export const DASH =
  "border-dashed border-neutral-300/80 dark:border-neutral-800";

/** Edge-to-edge dashed line anchored to the center of the column. */
export const HLine = ({ className = "" }) => (
  <span
    aria-hidden="true"
    className={`pointer-events-none absolute left-1/2 w-screen -translate-x-1/2 border-t ${DASH} ${className}`}
  />
);

export const DoubleRule = () => (
  <div aria-hidden="true" className="relative h-6">
    <HLine className="top-0" />
    <HLine className="bottom-0" />
  </div>
);

/** Diagonal hatch strip, used to close a list. */
export const Hatch = () => (
  <div
    aria-hidden="true"
    className="relative h-6 text-neutral-900/15 dark:text-white/10"
    style={{
      backgroundImage:
        "repeating-linear-gradient(-45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 6px)",
    }}
  >
    <HLine className="top-0" />
    <HLine className="bottom-0" />
  </div>
);

/** Back link + double rule, same as the top of the Projects page. */
export const BackBar = ({ to = "/", label = "Home" }) => (
  <>
    <div className="relative px-4 pb-4 pt-5 sm:px-6">
      <Link
        to={to}
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-neutral-500 transition-colors hover:text-neutral-950 dark:hover:text-white"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {label}
      </Link>
    </div>
    <DoubleRule />
  </>
);

/** Minimal index row: title left, meta right. Truncates on small screens. */
export const PostRow = ({ to, title, meta }) => (
  <div className="relative">
    <Link
      to={to}
      className="group flex items-baseline justify-between gap-4 px-4 py-4 transition-colors duration-300 hover:bg-neutral-200/30 dark:hover:bg-white/[0.03] rounded-lg sm:px-6"
    >
      <span className="min-w-0 truncate text-base text-neutral-800 transition-colors duration-300 group-hover:text-[#542A52] dark:text-neutral-200 dark:group-hover:text-[#FFB39A] sm:text-lg">
        {title}
      </span>
      <span className="shrink-0 font-mono text-xs text-neutral-500 dark:text-neutral-400">
        {meta}
      </span>
    </Link>
    <HLine className="bottom-0" />
  </div>
);

export const AdGridSection = ({ slot = import.meta.env.VITE_GOOGLE_ADS_SLOT || "8636273498" }) => (
  <div className="relative px-4 py-5 sm:px-6 md:hidden">
    <div className="overflow-hidden rounded-md border border-dashed border-neutral-300/80 bg-neutral-100/60 dark:border-neutral-800 dark:bg-white/[0.02]">
      <GoogleAdSlot
        slot={slot}
        placement="inline"
      />
    </div>
  </div>
);

const PageFrame = ({ children }) => (
  // overflow-x-clip (not hidden) so position: sticky keeps working inside
  <div className="min-h-screen overflow-x-clip bg-[#F7F7F4] text-neutral-950 transition-colors duration-300 dark:bg-[#0F0F0F] dark:text-neutral-50">
    <div className={`fixed left-1/2 top-0 z-50 w-full max-w-[840px] -translate-x-1/2 border-x ${DASH}`}>
      <Navbar />
    </div>

    <div
      className={`relative mx-auto flex min-h-screen w-full max-w-[840px] flex-col border-x ${DASH}`}
    >
      <main className="relative flex-1 pt-[54px]">{children}</main>
      <Footer />
    </div>
  </div>
);

export default PageFrame;
