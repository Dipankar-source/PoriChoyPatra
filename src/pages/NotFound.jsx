const NotFound = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white px-6 text-neutral-950 dark:bg-neutral-950 dark:text-white">
      <style>{`
        @keyframes nf-search {
          0%   { transform: translate(78px, 72px); }
          25%  { transform: translate(128px, 62px); }
          50%  { transform: translate(116px, 112px); }
          75%  { transform: translate(72px, 104px); }
          100% { transform: translate(78px, 72px); }
        }
        @keyframes nf-march {
          to { stroke-dashoffset: -28; }
        }
        @keyframes nf-miss {
          0%, 40%, 100% { opacity: 0; transform: scale(0.6); }
          50%, 60%      { opacity: 1; transform: scale(1); }
        }
        .nf-glass { animation: nf-search 7s ease-in-out infinite; }
        .nf-page  { animation: nf-march 3s linear infinite; }
        .nf-miss  {
          transform-box: fill-box;
          transform-origin: center;
          animation: nf-miss 7s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .nf-glass, .nf-page, .nf-miss { animation: none; }
          .nf-glass { transform: translate(100px, 90px); }
          .nf-miss  { opacity: 1; }
        }
      `}</style>

      <svg
        viewBox="0 0 200 180"
        className="w-56 text-neutral-400 sm:w-72 dark:text-neutral-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {/* empty page */}
        <rect
          className="nf-page"
          x="40"
          y="24"
          width="120"
          height="132"
          rx="10"
          strokeDasharray="8 6"
        />

        {/* magnifying glass */}
        <g className="nf-glass text-neutral-950 dark:text-white">
          <circle
            cx="0"
            cy="0"
            r="22"
            className="fill-white dark:fill-neutral-950"
            fillOpacity="0.85"
          />
          <line x1="16" y1="16" x2="38" y2="38" strokeWidth="5" />
          {/* "nothing here" mark inside the lens */}
          <g className="nf-miss text-emerald-600 dark:text-emerald-400">
            <line x1="-7" y1="-7" x2="7" y2="7" />
            <line x1="7" y1="-7" x2="-7" y2="7" />
          </g>
        </g>
      </svg>

      <h1 className="text-lg font-medium tracking-tight">Not found</h1>
    </main>
  );
};

export default NotFound;
