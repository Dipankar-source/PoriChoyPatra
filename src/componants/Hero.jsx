import { FlipWords } from "@/components/ui/flip-words";
import assets from "../assets/assets";
import { useTheme } from "../context/ThemeContext";
import { Heart, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import icons from "@/assets/icons";
import { supabase } from "@/lib/supabase";
import loveSoundPath from "../assets/sounds/love.mp3";

const Hero = () => {
  const { profileIndex, cycleProfile } = useTheme();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [likeCount, setLikeCount] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updatePreference);
      return () => mediaQuery.removeEventListener("change", updatePreference);
    }

    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  useEffect(() => {
    let active = true;

    try {
      setIsLiked(window.localStorage.getItem("portfolio-liked") === "true");
    } catch {
      // The like button still works for this session when storage is unavailable.
    }

    if (supabase) {
      supabase
        .rpc("get_public_like_count")
        .then(({ data, error }) => {
          const count = Number(data);
          if (active && !error && Number.isFinite(count)) setLikeCount(count);
        })
        .catch(() => {});
    }

    return () => {
      active = false;
    };
  }, []);

  const handleLike = async () => {
    if (isLiking) return;

    const audio = new Audio(loveSoundPath);
    audio.volume = 0.45;
    void audio.play().catch(() => {});

    const nextLiked = !isLiked;
    setIsLiking(true);

    if (!supabase) {
      setIsLiked(nextLiked);
      setIsLiking(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc("change_public_like_count", {
        p_delta: nextLiked ? 1 : -1,
      });
      if (error) throw error;

      const count = Number(data);
      if (Number.isFinite(count)) setLikeCount(count);
      setIsLiked(nextLiked);
      try {
        window.localStorage.setItem("portfolio-liked", String(nextLiked));
      } catch {
        // Keep the successful database update even when storage is unavailable.
      }
    } catch {
      // Leave the displayed state unchanged if the database update fails.
    } finally {
      setIsLiking(false);
    }
  };

  const shouldAutoplayMedia = !prefersReducedMotion;

  const words = [
    "Full Stack Developer",
    "AI Enthusiast",
    "UI/UX Designer",
    "Creative Developer",
    "AI Developer",
    "Visual Designer",
    "Problem Solver",
    "He/Him",
    "Focused",
    "Curious",
  ];
  const socials = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/techandbhakti",
      Icon: icons.InstagramSocialIcon,
      expandedClassName: "hover:w-24 focus-visible:w-24",
    },
    // {
    //   label: "LinkedIn",
    //   href: "https://linkedin.com/in/dipankarbarik/",
    //   Icon: icons.LinkedInSocialIcon,
    //   expandedClassName: "hover:w-20 focus-visible:w-20",
    // },
    {
      label: "X",
      href: "https://x.com/_dipankarsource",
      Icon: icons.XIcon,
      expandedClassName: "hover:w-12 focus-visible:w-12",
    },
    {
      label: "GitHub",
      href: "https://github.com/Dipankar-source/",
      Icon: icons.GitHubSocialIcon,
      expandedClassName: "hover:w-20 focus-visible:w-20",
    },
  ];

  return (
    <section className="relative w-full pt-1" aria-labelledby="profile-name">
      <div className="relative left-1/2 w-screen -translate-x-1/2 pb-1">
        <div className="mx-auto h-56 max-w-[840px]">
          <video
            src={assets.BgVideo}
            autoPlay={shouldAutoplayMedia}
            loop={shouldAutoplayMedia}
            muted
            playsInline
            preload="metadata"
            poster={assets.Nature}
            aria-label="Waterfall surrounded by a forest"
            className="mx-2 h-56 w-[calc(100%-1rem)] object-cover object-center"
          />
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 border-b border-dashed border-neutral-300/80 dark:border-neutral-800"
        />
      </div>

      <div className="relative flex min-h-[130px] items-center gap-6 px-4 py-5 sm:gap-7 sm:px-[26px]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 w-screen -translate-x-1/2 border-t border-dashed border-neutral-300/70 dark:border-neutral-800"
        />
        <div className="relative size-[87px] sm:size-[104px] shrink-0 overflow-hidden rounded-[14px] border-[5px] border-neutral-300 bg-[#FFB39A] dark:bg-[#542A52]">
          {profileIndex === 2 ? (
            <video
              src={assets.Profile}
              autoPlay={shouldAutoplayMedia}
              loop={shouldAutoplayMedia}
              muted
              playsInline
              preload="metadata"
              poster={profileIndex === 1 ? "/profile1.webp" : "/profile.webp"}
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={profileIndex === 1 ? "/profile.webp" : "/profile1.webp"}
              alt=""
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          )}
          <button
            type="button"
            onClick={cycleProfile}
            aria-label="Change profile media"
            title="Change profile media"
            className="absolute top-0 right-0 inline-flex size-7 items-center justify-center rounded-full text-black bg-transparent"
          >
            <User className="size-4" aria-hidden="true" fill="black" />
          </button>
        </div>

        <div className="w-full">
          <div className="w-full flex items-center justify-between">
            <h1
              id="profile-name"
              className="aktura-font flex text-[31px] leading-[1.05] text-neutral-950 dark:text-neutral-50 sm:text-[34px] mt-1"
            >
              Dipankar <span className="hidden md:inline-block">Barik</span>
            </h1>
            <button
              type="button"
              onClick={handleLike}
              disabled={isLiking}
              aria-pressed={isLiked}
              aria-label={`${isLiked ? "Unlike" : "Like"} this portfolio${likeCount === null ? "" : `. ${likeCount} likes`}`}
              title={isLiked ? "Unlike this portfolio" : "Like this portfolio"}
              className=" inline-flex min-h-9 shrink-0 items-center  gap-1.5 rounded-md px-2 text-neutral-500 transition-colors  hover:text-rose-600 disabled:cursor-wait disabled:opacity-60 dark:text-neutral-400  dark:hover:text-rose-400"
            >
              <Heart
                className={`size-[13px] sm:size-[18px] transition-[color,transform] duration-200 ${
                  isLiked ? "scale-110 fill-rose-500 text-rose-500" : ""
                }`}
                aria-hidden="true"
              />
              <span className="min-w-[2ch] text-xs font-medium tabular-nums">
                {likeCount === null ? "..." : likeCount.toLocaleString()}
              </span>
            </button>
          </div>
          <p className="dancing-font mt-1 text-[9px] font-semibold tracking-[0.05em] text-neutral-700 sm:text-[20px] dark:text-stone-500">
            I'm{" "}
            <FlipWords
              className={cn("text-neutral-700 dark:text-stone-400 -ml-2")}
              words={words}
            />
          </p>
          <nav
            aria-label="Social links"
            className="mt-1.5 flex flex-wrap items-center gap-2"
          >
            {socials.map(({ label, href, Icon, expandedClassName }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`group/social relative z-0 inline-flex h-5 w-5 md:h-7 md:w-7 shrink-0 items-center overflow-hidden text-neutral-500 transition-[width,color] duration-300 ease-out hover:z-10 hover:text-neutral-950 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 dark:text-neutral-400 dark:hover:text-white ${expandedClassName}`}
              >
                <Icon
                  className="absolute left-1/2 top-1/2 size-[18px] shrink-0 -translate-x-1/2 -translate-y-1/2 transition-[left,transform] duration-300 ease-out group-hover/social:left-2 group-hover/social:translate-x-0 group-focus-visible/social:left-2 group-focus-visible/social:translate-x-0"
                  aria-hidden="true"
                />
                <span className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 translate-x-1 whitespace-nowrap text-xs font-medium opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover/social:translate-x-0 group-hover/social:opacity-100 group-focus-visible/social:translate-x-0 group-focus-visible/social:opacity-100">
                  {label}
                </span>
              </a>
            ))}
          </nav>
        </div>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 w-screen -translate-x-1/2 border-b border-dashed border-neutral-300/70 dark:border-neutral-800"
        />
      </div>
    </section>
  );
};

export default Hero;
