const PageGridLines = ({ section = false, sectionOffset = 0 }) =>
  section ? (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 z-20 w-screen -translate-x-1/2 border-t border-dashed border-neutral-300/80 dark:border-neutral-800"
      style={{ top: sectionOffset }}
    />
  ) : (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-1/2 z-60 w-full max-w-[840px] -translate-x-1/2 border-x border-dashed border-neutral-300/70 dark:border-neutral-800/80"
    />
  );

export const GridSectionHeader = ({ children, className = "" }) => (
  <header className={`relative flow-root w-full ${className}`}>
    <PageGridLines section />
    <PageGridLines section sectionOffset="100%" />
    <div className="relative z-30">{children}</div>
  </header>
);

export default PageGridLines;