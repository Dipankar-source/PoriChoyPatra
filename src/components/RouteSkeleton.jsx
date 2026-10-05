import Loader from "./ui/loader";

const block = "animate-pulse rounded-sm bg-neutral-200/80 dark:bg-neutral-800/80";

const Bar = ({ className = "" }) => (
  <div aria-hidden="true" className={`${block} ${className}`} />
);

const Rule = () => <div aria-hidden="true" className="border-t border-dashed border-neutral-300/80 dark:border-neutral-800" />;

const HeaderSkeleton = () => (
  <div className="relative flex h-[54px] items-center justify-between px-4 sm:px-5">
    <Bar className="size-8" />
    <div className="hidden items-center gap-5 md:flex">
      <Bar className="h-3 w-12" />
      <Bar className="h-3 w-16" />
      <Bar className="h-3 w-20" />
      <Bar className="h-8 w-8 rounded-full" />
    </div>
    <div className="flex gap-2 md:hidden">
      <Bar className="size-8" />
      <Bar className="size-8" />
    </div>
  </div>
);

const PageHeading = ({ titleWidth = "w-40", subtitleWidth = "w-64" }) => (
  <>
    <div className="px-4 pb-4 pt-5 sm:px-6">
      <Bar className="h-3 w-16" />
    </div>
    <Rule />
    <header className="px-4 py-6 sm:px-6">
      <Bar className={`h-11 max-w-full sm:h-14 ${titleWidth}`} />
      <Bar className={`mt-3 h-5 max-w-full ${subtitleWidth}`} />
    </header>
    <Rule />
  </>
);

const HomeSkeleton = () => (
  <div className="px-5 pb-12 pt-10 sm:px-8 sm:pt-16">
    <div className="grid min-h-[70vh] items-center gap-10 md:grid-cols-[1fr_0.8fr]">
      <div className="space-y-5">
        <Bar className="h-3 w-32" />
        <Bar className="h-14 w-4/5 sm:h-20" />
        <Bar className="h-14 w-3/5 sm:h-20" />
        <Bar className="h-4 w-full max-w-lg" />
        <Bar className="h-4 w-4/5 max-w-md" />
        <div className="flex gap-3 pt-3">
          <Bar className="h-10 w-32" />
          <Bar className="h-10 w-10 rounded-full" />
        </div>
      </div>
      <div className="mx-auto aspect-square w-full max-w-[340px] rounded-full border border-dashed border-neutral-300 p-5 dark:border-neutral-800">
        <Bar className="size-full rounded-full" />
      </div>
    </div>
    <Rule />
    <div className="grid gap-4 py-8 sm:grid-cols-3">
      <Bar className="h-28" />
      <Bar className="h-28" />
      <Bar className="h-28" />
    </div>
  </div>
);

const ProjectsSkeleton = () => (
  <>
    <PageHeading titleWidth="w-52" subtitleWidth="w-80" />
    <div className="grid gap-5 px-4 py-6 sm:grid-cols-2 sm:px-6">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="space-y-4 border border-dashed border-neutral-300/80 p-3 dark:border-neutral-800">
          <Bar className="aspect-[16/10] w-full" />
          <Bar className="h-5 w-3/5" />
          <Bar className="h-3 w-full" />
          <Bar className="h-3 w-4/5" />
          <div className="flex gap-2 pt-1">
            <Bar className="h-6 w-16" />
            <Bar className="h-6 w-20" />
            <Bar className="h-6 w-14" />
          </div>
        </div>
      ))}
    </div>
  </>
);

const ExperienceSkeleton = () => (
  <>
    <PageHeading titleWidth="w-56" subtitleWidth="w-72" />
    <section className="space-y-7 px-5 py-8 sm:px-8">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="grid gap-3 border-b border-dashed border-neutral-300/80 pb-6 dark:border-neutral-800 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="space-y-3">
            <Bar className="h-5 w-56 max-w-full" />
            <Bar className="h-4 w-72 max-w-full" />
          </div>
          <div className="space-y-2 sm:text-right">
            <Bar className="h-4 w-32" />
            <Bar className="h-3 w-28" />
          </div>
        </div>
      ))}
    </section>
  </>
);

const BlogSkeleton = () => (
  <>
    <PageHeading titleWidth="w-36" subtitleWidth="w-80" />
    <div className="flex flex-col gap-3 px-4 py-5 sm:flex-row sm:px-6">
      <Bar className="h-11 flex-1" />
      <Bar className="h-11 w-28" />
    </div>
    <div className="px-4 sm:px-6">
      {[0, 1, 2, 3, 4].map((item) => (
        <div key={item} className="flex items-center justify-between gap-4 border-b border-dashed border-neutral-300/80 py-5 dark:border-neutral-800">
          <Bar className="h-5 w-3/5" />
          <Bar className="h-3 w-20 shrink-0" />
        </div>
      ))}
    </div>
  </>
);

const ArticleSkeleton = () => (
  <>
    <PageHeading titleWidth="w-16" subtitleWidth="w-32" />
    <article className="space-y-6 px-5 py-8 sm:px-10">
      <Bar className="aspect-[16/8] w-full" />
      <Bar className="h-9 w-4/5 max-w-2xl" />
      <Bar className="h-4 w-40" />
      <div className="space-y-3 pt-4">
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-5/6" />
      </div>
      <Bar className="h-36 w-full" />
      <div className="space-y-3">
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-11/12" />
        <Bar className="h-4 w-4/5" />
      </div>
    </article>
  </>
);

const WritingSkeleton = () => (
  <>
    <PageHeading titleWidth="w-56" subtitleWidth="w-72" />
    <div className="grid gap-5 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_260px] sm:px-6">
      <section className="space-y-4">
        <Bar className="h-12 w-full" />
        <Bar className="h-10 w-2/3" />
        <Bar className="h-72 w-full" />
        <div className="flex gap-3">
          <Bar className="h-10 w-28" />
          <Bar className="h-10 w-28" />
        </div>
      </section>
      <aside className="space-y-3 border border-dashed border-neutral-300/80 p-4 dark:border-neutral-800">
        <Bar className="h-5 w-2/3" />
        <Bar className="h-10 w-full" />
        <Bar className="h-10 w-full" />
        <Bar className="h-24 w-full" />
      </aside>
    </div>
  </>
);

const ContactSkeleton = () => (
  <>
    <PageHeading titleWidth="w-44" subtitleWidth="w-72" />
    <div className="grid gap-10 px-5 py-8 md:grid-cols-[1.2fr_0.8fr] sm:px-8">
      <div className="space-y-5">
        <Bar className="h-12 w-full" />
        <Bar className="h-12 w-full" />
        <Bar className="h-36 w-full" />
        <Bar className="h-11 w-36" />
      </div>
      <div className="space-y-4">
        {[0, 1, 2].map((item) => (
          <Bar key={item} className="h-16 w-full" />
        ))}
        <Bar className="mt-5 aspect-video w-full" />
      </div>
    </div>
  </>
);

const NotFoundSkeleton = () => (
  <div className="flex min-h-[65vh] flex-col items-center justify-center gap-5 px-6 text-center">
    <Bar className="h-20 w-56 max-w-full" />
    <Bar className="h-4 w-72 max-w-full" />
    <Bar className="h-10 w-32" />
  </div>
);

const getPageSkeleton = (pathname) => {
  if (pathname === "/") return <HomeSkeleton />;
  if (pathname === "/projects") return <ProjectsSkeleton />;
  if (pathname === "/experience") return <ExperienceSkeleton />;
  if (pathname === "/blog") return <BlogSkeleton />;
  if (pathname === "/blog-writing") return <WritingSkeleton />;
  if (pathname === "/contact") return <ContactSkeleton />;
  if (pathname.startsWith("/blog/")) return <ArticleSkeleton />;
  return <NotFoundSkeleton />;
};

const RouteSkeleton = ({ pathname }) => {
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <div
        role="status"
        aria-label="Loading portfolio"
        aria-busy="true"
        className="grid min-h-screen place-items-center bg-[#F7F7F4] text-neutral-700 dark:bg-[#0F0F0F] dark:text-neutral-300"
      >
        <Loader/>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label="Loading page"
      aria-busy="true"
      className="min-h-screen overflow-x-clip bg-[#F7F7F4] text-neutral-950 dark:bg-[#0F0F0F] dark:text-neutral-50"
    >
      <div className="fixed left-1/2 top-0 z-50 w-full max-w-[840px] -translate-x-1/2 border-x border-dashed border-neutral-300/80 dark:border-neutral-800">
        <HeaderSkeleton />
      </div>
      <div className="relative mx-auto min-h-screen w-full max-w-[840px] border-x border-dashed border-neutral-300/80 dark:border-neutral-800">
        <main className={isHome ? "pt-[54px]" : "pt-[54px]"}>
          {getPageSkeleton(pathname)}
        </main>
      </div>
    </div>
  );
};

export default RouteSkeleton;
