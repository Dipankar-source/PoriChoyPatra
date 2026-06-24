"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
    IconCertificate,
    IconTrophy,
    IconUsers,
    IconBrandGithub,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------
   Each achievement gets its own tiny "proof" widget instead of a
   generic icon — the motion itself is what tells the story.
   `active` = hovered OR keyboard-focused.
------------------------------------------------------------------*/

function SelectionMark({ active }) {
    return (
        <div className="mt-3 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-neutral-300 dark:text-neutral-700"
                />
                <motion.path
                    d="M7.5 12.5l2.8 2.8L16.5 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber-500 dark:text-amber-400"
                    initial={false}
                    animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                />
            </svg>
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {active ? "Selected" : "Round 1"}
            </span>
        </div>
    );
}

function RankReveal({ active, reduceMotion }) {
    const [value, setValue] = useState(10);

    useEffect(() => {
        if (!active || reduceMotion) {
            setValue(10);
            return;
        }
        const sequence = [3, 6, 8, 10];
        let i = 0;
        setValue(sequence[0]);
        const id = setInterval(() => {
            i += 1;
            if (i >= sequence.length) {
                clearInterval(id);
                return;
            }
            setValue(sequence[i]);
        }, 90);
        return () => clearInterval(id);
    }, [active, reduceMotion]);

    return (
        <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-50">
                Top {value}
            </span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500">finish</span>
        </div>
    );
}

function TeamFan({ active }) {
    const members = ["A", "B", "C", "D"];
    return (
        <div className="mt-3 flex items-center">
            <div className="flex">
                {members.map((m, i) => (
                    <motion.div
                        key={m}
                        initial={false}
                        animate={{ x: active ? i * 9 : i * 5 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.03 }}
                        style={{ zIndex: members.length - i, marginLeft: i === 0 ? 0 : -10 }}
                        className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-neutral-100 text-[10px] font-medium text-neutral-500 dark:border-neutral-950 dark:bg-neutral-800 dark:text-neutral-400"
                    >
                        {m}
                    </motion.div>
                ))}
            </div>
            <span className="ml-2.5 text-[11px] text-neutral-400 dark:text-neutral-500">led</span>
        </div>
    );
}

function ActivityPulse({ active, reduceMotion }) {
    const bars = [3, 6, 4, 8, 5, 7];
    return (
        <div className="mt-3 flex items-end gap-1">
            {bars.map((h, i) => (
                <motion.div
                    key={i}
                    initial={false}
                    animate={{ height: active ? h * 3 : h }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="w-1 rounded-[1px] bg-neutral-300 dark:bg-neutral-700"
                />
            ))}
            <span className="ml-2 flex items-center gap-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                <span className="relative flex h-1.5 w-1.5">
                    {!reduceMotion && (
                        <motion.span
                            className="absolute inset-0 rounded-full bg-amber-500 dark:bg-amber-400"
                            animate={{ scale: [1, 1.7, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                        />
                    )}
                    <span className="relative h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                </span>
                active
            </span>
        </div>
    );
}

/* ---------------------- DATA ---------------------- */
/* Story copy is placeholder — swap in your real specifics
   (scheme name, hackathon names, team size) where useful. */

const achievements = [
    {
        id: "msme",
        icon: IconCertificate,
        kicker: "MSME Scheme",
        title: "Selected in Round 1",
        story:
            "Cleared the first evaluation round of the MSME initiative, picked for its execution and growth potential.",
        Extra: SelectionMark,
        span: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
    },
    {
        id: "rank",
        icon: IconTrophy,
        kicker: "Hackathon",
        title: "Ranked in the top 10",
        story: "Placed top 10 on judged criteria spanning execution, design, and pitch.",
        Extra: RankReveal,
        span: "sm:col-span-2 lg:col-span-2 lg:row-span-1",
    },
    {
        id: "lead",
        icon: IconUsers,
        kicker: "Leadership",
        title: "Led hackathon teams",
        story: "Directed strategy, build, and pitch across several hackathon teams.",
        Extra: TeamFan,
        span: "lg:col-span-1 lg:row-span-1",
    },
    {
        id: "oss",
        icon: IconBrandGithub,
        kicker: "Open Source",
        title: "Active contributor",
        story: "Ships pull requests and triages issues in open-source projects, regularly.",
        Extra: ActivityPulse,
        span: "lg:col-span-1 lg:row-span-1",
    },
];

/* ---------------------- CARD ---------------------- */

function AchievementCard({ data, index }) {
    const [active, setActive] = useState(false);
    const reduceMotion = useReducedMotion();
    const Icon = data.icon;
    const Extra = data.Extra;

    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            onHoverStart={() => setActive(true)}
            onHoverEnd={() => setActive(false)}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            tabIndex={0}
            className={cn(
                "group relative flex min-h-[190px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6",
                "transition-[transform,box-shadow] duration-300 will-change-transform",
                "hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:ring-offset-2",
                "dark:border-neutral-800 dark:bg-neutral-950 dark:hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.55)]",
                data.span
            )}
        >
            <div className="flex items-start justify-between">
                <motion.div
                    animate={{ scale: active ? 1.06 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300",
                        active
                            ? "border-amber-500/50 text-amber-600 dark:border-amber-400/50 dark:text-amber-400"
                            : "border-neutral-200 text-neutral-400 dark:border-neutral-800 dark:text-neutral-500"
                    )}
                >
                    <Icon className="h-4 w-4" />
                </motion.div>
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500">
                    {data.kicker}
                </span>
            </div>

            <h3 className="mt-3 text-base font-semibold leading-snug text-neutral-900 dark:text-neutral-50 sm:text-lg">
                {data.title}
            </h3>

            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-[13px]">
                {data.story}
            </p>

            <div className="mt-auto">
                <Extra active={active} reduceMotion={reduceMotion} />
            </div>

            <motion.span
                aria-hidden
                className="absolute inset-x-5 bottom-0 h-px origin-left bg-amber-500 dark:bg-amber-400 sm:inset-x-6"
                initial={false}
                animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
            />
        </motion.div>
    );
}

/* ---------------------- SECTION ---------------------- */

const AchieveMents = () => {
    return (
        <section className=" border">
            <div className="mb-6 flex items-baseline justify-between mx-4">
                <h2 className="text-xl lg:text-2xl mt-7 font-medium tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-[28px]">
                    Achievements...
                </h2>
            </div>

            <div className="grid grid-cols-1 pb-12 gap-4 sm:grid-cols-2 lg:grid-cols-4 mx-4 lg:[grid-auto-rows:190px]">
                {achievements.map((item, i) => (
                    <AchievementCard key={item.id} data={item} index={i} />
                ))}
            </div>
        </section>
    );
};

export default AchieveMents;