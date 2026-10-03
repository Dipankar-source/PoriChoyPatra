import PageGridLines from "@/components/PageGridLines";
import icons from "@/assets/icons";

const Social = () => {
  const socials = [
    {
      name: "Dipankar Barik",
      handle: "@_dipankarsource",
      href: "https://x.com/_dipankarsource",
      Icon: icons.XIcon,
      iconClassName: "dark:text-white text-black",
      iconBackground: "dark:bg-neutral-900 bg-white/60",
    },
    {
      name: "GitHub",
      handle: "@Dipankar-source",
      href: "https://github.com/Dipankar-source",
      Icon: icons.GitHubSocialIcon,
      iconClassName: "dark:text-white text-black",
      iconBackground: "dark:bg-neutral-900 bg-white/60",
    },
  ];

  return (
    <section
      className="relative w-full px-5 py-6 sm:px-4 sm:py-4"
      aria-label="Social links"
    >
      <PageGridLines section sectionOffset={27} />

      <div className="relative mx-auto mt-7 sm:mt-7 grid max-w-[810px] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {socials.map(({ name, handle, href, Icon, iconClassName, iconBackground }) => (
          <article
            key={href}
            className="flex min-h-[60px] min-w-0 items-center gap-3 border border-dashed border-neutral-300/70 px-3 py-3 dark:border-neutral-700 sm:gap-4 sm:px-4"
          >
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-xl ${iconBackground}`}
              aria-hidden="true"
            >
              <Icon className={`size-5 ${iconClassName}`} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white sm:text-base">
                {name}
              </p>
              <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                {handle}
              </p>
            </div>

            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Follow ${name}`}
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-xs border border-dashed border-neutral-300 px-3 text-xs font-semibold text-neutral-900 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-neutral-700 dark:text-white"
            >
              Follow
            </a>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Social;
