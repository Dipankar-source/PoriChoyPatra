import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Github, Twitter, Linkedin, Download } from "lucide-react";

const signaturePath = `
  M18 86 C16 62 23 27 34 14 C47 1 61 13 57 28 C54 42 37 53 27 61
  C16 73 25 85 39 80 C50 76 59 65 66 55 C71 49 77 42 81 42
  C85 42 74 84 72 99 C76 78 85 53 98 46 C109 40 115 51 108 61
  C101 71 89 70 81 63 C85 55 97 47 105 51 C111 57 101 68 93 68
  C86 68 88 58 97 54 C106 50 117 55 123 59 C128 55 132 46 136 43
  C140 41 130 62 131 66 C133 68 139 49 148 46 C158 43 151 62 154 66
  C157 70 166 62 172 56 C177 50 182 29 185 17 C190 0 192 15 188 35
  C185 53 178 68 178 72 C180 73 190 56 198 51 C206 46 207 51 201 58
  C198 62 188 67 187 70 C188 73 201 69 210 61 C214 53 225 49 231 54
  C238 61 226 70 218 69 C211 68 215 59 224 56 C234 52 245 56 251 61
  C256 56 260 47 264 45 C268 43 262 65 264 68 C266 69 272 57 281 55
  C287 53 291 58 296 62 C303 61 311 38 314 18 C317 4 323 9 319 27
  C316 42 306 63 306 73 C305 84 321 84 330 77 C339 70 336 62 325 59
  C333 57 343 52 343 44 C344 35 334 32 321 35 C344 55 355 49 361 54
  C367 60 356 68 349 68 C342 67 346 59 354 55 C364 51 374 56 380 61
  C386 56 390 47 394 45 C398 43 392 63 393 67 C394 68 400 57 408 55
  C414 53 418 58 422 62 C427 57 431 49 434 45 C437 43 430 63 430 68
  C430 71 435 70 440 65 C446 50 452 29 455 18 C460 2 461 16 457 35
  C454 50 447 67 446 71 C448 73 457 58 465 53 C473 48 475 53 469 60
  C466 64 457 68 456 71 C457 74 470 70 480 62 C492 57 510 54 518 58
  C525 63 520 70 513 70 C506 69 509 60 519 56 C530 52 540 57 550 61
`;

const FooterSystem = () => {
  const [time, setTime] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("dipankarbarik2002@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <footer className="dipfolio-font w-full border-t border-neutral-100 bg-[#F7F7F4] pt-6 pb-20 transition-colors duration-300 dark:border-white/5 dark:bg-[#0F0F0F]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
        <div className="hidden items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm md:flex">
          <div className="group flex cursor-help items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="transition-colors group-hover:text-black dark:group-hover:text-white">
              Available for work
            </span>
          </div>
          <div className="h-3 w-px bg-gray-300 dark:bg-gray-700" />
          <span className="cursor-default tabular-nums tracking-tight transition-colors hover:text-black dark:hover:text-white">
            {time || "00:00"}
          </span>
        </div>

        <div className="flex flex-col items-center text-neutral-500 dark:text-neutral-400">
          <motion.svg
            viewBox="0 0 560 110"
            role="img"
            aria-label="Dipankar Barik signature"
            className="h-10 w-[220px] overflow-visible"
          >
            <motion.path
              d={signaturePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{
                pathLength: [0, 1, 1, 0, 0],
                opacity: [0, 1, 1, 0, 0],
              }}
              viewport={{ once: false, amount: 0.55 }}
              transition={{
                duration: 8,
                times: [0, 0.48, 0.62, 0.94, 1],
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.25,
              }}
            />
          </motion.svg>
          <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
            © {new Date().getFullYear()} Dipankar Barik
          </span>
        </div>

        <div className="flex items-center gap-5 text-gray-500 dark:text-gray-400">
          <button
            onClick={handleCopy}
            className="group relative flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-black dark:hover:text-white sm:text-sm"
            aria-label="Copy Email"
          >
            <Copy className="size-3.5 transition-transform group-hover:scale-110" />
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  className="text-emerald-500 dark:text-emerald-400"
                >
                  Copied!
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                >
                  Email
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <div className="hidden h-3 w-px bg-gray-300 dark:bg-gray-700 sm:block" />

          <div className="flex items-center gap-4">
            <SocialLink href="https://github.com/Dipankar-source" icon={Github} label="GitHub" />
            <SocialLink href="https://linkedin.com/in/dipankarbarik" icon={Linkedin} label="LinkedIn" />
            <SocialLink href="https://x.com/_dipankarsource" icon={Twitter} label="Twitter" />
            <SocialLink href="/Resume_Portfolio.pdf" icon={Download} label="CV" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center text-gray-500 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
    aria-label={label}
  >
    <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
    <span className="w-0 overflow-hidden text-xs font-medium opacity-0 transition-all duration-300 ease-out group-hover:ml-1.5 group-hover:w-auto group-hover:opacity-100 group-hover:whitespace-nowrap">
      {label}
    </span>
  </a>
);

export default FooterSystem;