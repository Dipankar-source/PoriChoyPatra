import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { ScrollFountain } from '@/components/ui/scroll-fountain-text';
import { AnimatedParagraph } from '@/components/ui/animated-paragraph';

// ─── Data ────────────────────────────────────────────────────────────────────

const PAPERS = [
    {
        id: "1",
        title: "An MTCNN-Based Facial Recognition Framework for Applied Biometric Authentication",
        description:
            "This paper presents a robust facial recognition framework for secure and efficient biometric authentication using the Multi-task Cascaded Convolutional Neural Network (MTCNN). The proposed system integrates face detection, facial alignment, feature extraction, and identity verification into a unified pipeline. Facial embeddings are generated and matched using cosine similarity to achieve reliable authentication under varying lighting, pose, and occlusion conditions. The framework is evaluated against Dlib Frontal Face Detector, Haar Cascades, and OpenCV DNN Face Detector using accuracy, precision, recall, and F1-score metrics. Experimental results demonstrate that the MTCNN-based approach achieves superior performance, making it suitable for modern biometric security applications and real-world authentication systems.",
        authors: [
            { name: "Arup Mallick", initials: "AM", color: "text-blue-500", img: "" },
            { name: "Atanu Kumar Das", initials: "AD", color: "text-purple-500", img: "" },
            { name: "Shibam Karmakar", initials: "SK", color: "text-pink-500", img: "" },
            { name: "Dipankar Barik", initials: "DB", color: "text-green-500", img: "" },
            { name: "Arindam Sarkar", initials: "AS", color: "text-orange-500", img: "" },
            { name: "Shreyasi Nayak", initials: "SN", color: "text-cyan-500", img: "" },
            { name: "Piyali De", initials: "PD", color: "text-red-500", img: "" },
        ],
        publishDate: "26.06.2026",
        journalName: "AdComSys 2026 (Third International Conference on Advanced Computing and Systems, Springer)",
        DOI: "",
    },
    {
        id: "2",
        title: "Recent Trends in Data-Efficient Scene Text Recognition: A Survey on Zero-Shot and Few-Shot Learning",
        description:
            "This survey provides a comprehensive review of recent advancements in data-efficient Scene Text Recognition (STR) using Zero-Shot Learning (ZSL) and Few-Shot Learning (FSL). It explores how modern approaches overcome the limitations of traditional OCR systems that depend heavily on large annotated datasets. The paper discusses semantic embeddings, transfer learning, meta-learning techniques such as MAML and Prototypical Networks, transformer-based architectures, vision-language models, and generative models including GANs and VAEs. It also presents a comparative analysis of ZSL and FSL methodologies, benchmark datasets, evaluation metrics, key challenges, and future research directions for building scalable, adaptable, and efficient STR systems with limited training data.",
        authors: [
            { name: "Shibam Karmakar", initials: "SK", color: "text-blue-500", img: "" },
            { name: "Shreyasi Nayak", initials: "SN", color: "text-purple-500", img: "" },
            { name: "Payel Sengupta", initials: "PS", color: "text-pink-500", img: "" },
            { name: "Dipankar Barik", initials: "DB", color: "text-green-500", img: "" },
            { name: "Ritu Mukherjee", initials: "RM", color: "text-orange-500", img: "" },
            { name: "Prerana Dey", initials: "PD", color: "text-cyan-500", img: "" },
            { name: "Atanu Kumar Das", initials: "AD", color: "text-red-500", img: "" },
        ],
        publishDate: "05.06.2026",
        journalName: "ITM Web of Conferences (ICCRET-2026)",
        DOI: "https://doi.org/10.1051/itmconf/20268601017",
    }
];

// ─── Single paper row ───────────────────────────────────────────────────────

const PaperItem = ({ paper, isOpen, isAnyOpen, onToggle, isHoveredOuter, isAnyHoveredOuter, onHoverStart, onHoverEnd }) => {
    const [isHovered, setIsHovered] = useState(false);

    // When another item is open OR hovered: blur + dim this one
    const shouldDim = (isAnyOpen && !isOpen) || (!isAnyOpen && isAnyHoveredOuter && !isHoveredOuter);

    const handleMouseEnter = () => {
        setIsHovered(true);
        onHoverStart?.();
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        onHoverEnd?.();
    };

    return (
        <motion.div
            className="relative flex flex-col w-full rounded-md cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onToggle}
            animate={{
                filter: shouldDim ? "blur(1.5px)" : "blur(0px)",
                opacity: shouldDim ? 0.38 : 1,
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
        >
            {/* ── Row header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 group">

                {/* Left: title + journal info */}
                <div className="sm:w-3/4 flex flex-col gap-1.5 w-full">
                    <div className="flex items-center justify-between sm:justify-start gap-3 w-full">
                        <div className="flex items-start gap-3">
                            <span
                                className="font-semibold text-gray-700 dark:text-white/95 leading-snug tracking-tight"
                                style={{ fontSize: "clamp(15px, 2.6vw, 18px)" }}
                            >
                                {paper.title}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="font-medium text-gray-400 dark:text-gray-500 leading-snug" style={{ fontSize: "clamp(10px, 1.4vw, 12px)" }}>
                            {paper.journalName}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        <span className="font-medium text-gray-400 dark:text-gray-500 leading-snug" style={{ fontSize: "clamp(10px, 1.4vw, 12px)" }}>
                            {paper.publishDate}
                        </span>
                    </div>
                </div>

                {/* Right: Chevron & External link icon on hover/open */}
                <div className="hidden sm:flex sm:w-1/4 items-center justify-end min-h-[40px] relative gap-4">
                    {paper.DOI && (
                        <a
                            href={paper.DOI}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="DOI Link"
                            className={`flex items-center flex-shrink-0 transition-opacity duration-200 ${isOpen || isHovered ? "opacity-100" : "opacity-0"}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaExternalLinkAlt
                                size={14}
                                className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors"
                            />
                        </a>
                    )}

                    <motion.span
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex-shrink-0 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-100 sm:opacity-0 group-hover:opacity-100"}`}
                    >
                        <MdOutlineKeyboardArrowRight
                            size={22}
                            className="text-gray-500 dark:text-gray-400"
                        />
                    </motion.span>
                </div>

                {/* Mobile Chevron (visible when collapsed/expanded differently) */}
                <div className="sm:hidden absolute right-0 top-3">
                    <motion.span
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0"
                    >
                        <MdOutlineKeyboardArrowRight
                            size={22}
                            className="text-gray-500 dark:text-gray-400"
                        />
                    </motion.span>
                </div>
            </div>

            {/* ── Expanded body ── */}
            <motion.div
                layout
                initial={false}
                animate={
                    isOpen
                        ? { height: "auto", opacity: 1, marginTop: 8 }
                        : { height: 0, opacity: 0, marginTop: 0 }
                }
                transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ overflow: "hidden" }}
            >
                <div className="pb-5">
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                        transition={{ duration: 0.3, delay: 0.12 }}
                        className="flex flex-col gap-4"
                    >
                        <p
                            className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify"
                            style={{ fontSize: "clamp(12px, 1.9vw, 13.5px)" }}
                        >
                            {paper.description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Authors:</span>
                                <div className="flex items-center -space-x-2">
                                    {paper.authors.map((author, index) => (
                                        <div
                                            key={index}
                                            className="relative group/author"
                                        >
                                            {author.img ? (
                                                <img src={author.img} alt={author.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-black object-cover" />
                                            ) : (
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-black text-xs font-semibold bg-gray-100 dark:bg-gray-800 ${author.color || 'text-gray-700'}`}>
                                                    {author.initials}
                                                </div>
                                            )}
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/author:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                                                {author.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile DOI Link */}
                            <div className="flex sm:hidden flex-wrap gap-4">
                                {paper.DOI && (
                                    <a
                                        href={paper.DOI}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                                    >
                                        <FaExternalLinkAlt size={12} /> Read Paper
                                    </a>
                                )}
                            </div>
                        </div>

                    </motion.div>
                </div>
            </motion.div>

            {/* Hairline divider */}
            <div className={`w-full h-px bg-neutral-100 dark:bg-neutral-800 hidden ${isOpen ? "block" : "hidden"}`} />
        </motion.div>
    );
};

// ─── Section ──────────────────────────────────────────────────────────────────

const Paperwork = () => {
    const [openId, setOpenId] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);

    return (
        <div className="w-full bg-[#FFFFFF] dark:bg-[#09090B] text-black dark:text-white transition-colors duration-300 pb-10">
            <hr className="border-blue-100 dark:border-white/10 md:-mt-4 mt-4" />

            <div className='flex justify-between items-center'>
                <div className='ml-4 mt-8 pr-4 '>
                    <p
                        className="font-medium text-gray-900 dark:text-white mb-2 leading-tight tracking-tight"
                        style={{ fontSize: "clamp(18px, 4vw, 24px)" }}
                    >
                        <ScrollFountain particleCount={40}>
                            Research
                        </ScrollFountain>
                    </p>
                    <AnimatedParagraph className='tracking-wider dark:text-white/30 text-sm italic'>What have I explored?</AnimatedParagraph>
                </div>
                <p className="ml-4 hidden md:block mt-8 text-gray-900 dark:text-white mb-4 pr-4 leading-tight tracking-tight">ORCID ID: <a className='text-sm cursor-pointer hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors' href="https://orcid.org/0009-0004-6235-8523">0009-0004-6235-8523</a></p>
            </div>

            <div className="bg-[#FFFFFF] dark:bg-[#09090B] text-gray-900 dark:text-gray-100 mt-2 font-sans">
                <div className="px-4 flex flex-col gap-2">
                    {PAPERS.map((paper) => (
                        <PaperItem
                            key={paper.id}
                            paper={paper}
                            isOpen={openId === paper.id}
                            isAnyOpen={openId !== null}
                            onToggle={() => setOpenId(openId === paper.id ? null : paper.id)}
                            isHoveredOuter={hoveredId === paper.id}
                            isAnyHoveredOuter={hoveredId !== null}
                            onHoverStart={() => setHoveredId(paper.id)}
                            onHoverEnd={() => setHoveredId(null)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Paperwork;