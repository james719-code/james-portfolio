"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
    FaGithub, FaExternalLinkAlt, FaAward, FaArrowRight, FaExpand, FaCompress, FaScroll
} from "react-icons/fa";
import { GiMagicPortal, GiSpellBook } from "react-icons/gi";
import ProjectGalaxy from '../ui/ProjectCity';

import {
    commissionedProjects,
    schoolProjects,
    personalProjects,
    collaborationProjects,
    certificates
} from '@/data/portfolioData';

// --- ANIMATION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const wizardCardVariants = {
    hidden: { opacity: 0, x: -50 },
    show: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 60, damping: 15 }
    }
};

export default function CreativeMode() {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        window.scrollTo(0, 0);
        if (typeof window !== 'undefined' && window.history.scrollRestoration) {
            window.history.scrollRestoration = 'manual';
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const allProjects = [
        ...commissionedProjects || [],
        ...schoolProjects || [],
        ...personalProjects || [],
        ...collaborationProjects || []
    ];

    const safeCerts = certificates || [];

    return (
        <main className="min-h-screen w-full bg-gradient-to-b from-[#87CEEB] via-slate-100 to-amber-50 dark:from-[#0f172a] dark:via-[#020617] dark:to-slate-950 transition-colors duration-1000 flex flex-col relative font-sans overflow-x-hidden">

            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] text-amber-500 gap-4"
                    >
                        {/* ASCII Wave */}
                        <motion.div
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="mb-4"
                        >
                            <AsciiWave />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl font-serif font-bold tracking-widest text-amber-100"
                        >
                            SUMMONING WORLD...
                        </motion.h2>

                        {/* Progress Bar */}
                        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-amber-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2.2, ease: "easeInOut" }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* --- 3D VILLAGE --- */}
            <section className={`relative w-full transition-all duration-500 ${isFullScreen ? "h-[100dvh] z-[60]" : "pt-20 pb-10 px-4 md:px-8"}`}>

                {/* Title Overlay */}
                {!isFullScreen && (
                    <div className="absolute top-24 left-0 w-full text-center z-10 pointer-events-none">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isLoading ? 0 : 0.2 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="text-4xl md:text-6xl font-black text-white tracking-widest uppercase mix-blend-overlay select-none"
                        >
                            Interactive World
                        </motion.h2>
                    </div>
                )}

                {/* 3D Canvas */}
                <motion.div
                    layout
                    className={`
                        relative overflow-hidden transition-all duration-500 border-4 border-white/20 bg-black/10 backdrop-blur-sm
                        ${isFullScreen
                        ? "fixed top-0 left-0 w-full h-[100dvh] rounded-none border-0 z-[60]"
                        : "w-full max-w-7xl mx-auto shadow-2xl rounded-2xl h-[60vh] md:h-[700px]"
                    }
                    `}
                >
                    <button
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className="absolute bottom-6 right-6 z-50 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-all border border-white/20 hover:scale-110 active:scale-95 shadow-xl"
                        title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
                    >
                        {isFullScreen ? <FaCompress size={24} /> : <FaExpand size={24} />}
                    </button>

                    <ProjectGalaxy />
                </motion.div>

                {/* Scroll Hint */}
                {!isFullScreen && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="w-full text-center mt-6 flex flex-col items-center gap-2 text-white/80 animate-bounce"
                    >
                        <span className="text-sm font-medium tracking-widest uppercase text-shadow">Open The Grimoire</span>
                        <FaArrowRight className="rotate-90" />
                    </motion.div>
                )}
            </section>

            {/* --- BOTTOM SECTION: WIZARD DIRECTORY --- */}
            {!isFullScreen && (
                <section className="relative w-full px-4 md:px-8 pb-32">
                    <div className="max-w-3xl mx-auto">

                        {/* PROJECTS HEADER */}
                        <div className="flex items-center gap-4 mb-12 mt-12 justify-center">
                            <GiMagicPortal className="text-4xl text-amber-500 animate-spin-slow" />
                            <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 dark:text-amber-100 tracking-wider text-center border-b-4 border-double border-amber-500/50 pb-2">
                                Project Grimoire
                            </h3>
                            <GiMagicPortal className="text-4xl text-amber-500 animate-spin-slow" />
                        </div>

                        {/* WIZARD LIST (Projects) */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-100px" }}
                            className="flex flex-col gap-8 mb-24 relative"
                        >
                            <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-gradient-to-b from-amber-500 via-purple-500 to-transparent opacity-30 rounded-full" />
                            {allProjects.map((project, index) => (
                                <WizardCard key={index} item={project} type="project" index={index} />
                            ))}
                        </motion.div>

                        {/* CERTIFICATES HEADER */}
                        {safeCerts.length > 0 && (
                            <>
                                <div className="flex items-center gap-4 mb-12 justify-center">
                                    <GiSpellBook className="text-4xl text-blue-500 dark:text-blue-300" />
                                    <h3 className="text-3xl font-serif font-bold text-slate-700 dark:text-blue-100 tracking-wider text-center border-b-4 border-double border-blue-500/50 pb-2">
                                        Ancient Scrolls
                                    </h3>
                                    <GiSpellBook className="text-4xl text-blue-500 dark:text-blue-300" />
                                </div>
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                    className="flex flex-col gap-6"
                                >
                                    {safeCerts.map((cert, index) => (
                                        <WizardCard key={index} item={cert} type="cert" index={index} />
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </div>
                </section>
            )}
        </main>
    );
}

// --- HELPER: ASCII WAVE COMPONENT ---
function AsciiWave() {
    const [frame, setFrame] = useState(0);

    // Simple 3-frame shifting wave cycle
    const frames = [
        "~^~~^~~^~~^~",
        "^~~^~~^~~^~~",
        "~~^~~^~~^~~^"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame((prev) => (prev + 1) % frames.length);
        }, 200); // Adjust speed
        return () => clearInterval(interval);
    }, [frames.length]);

    return (
        <pre className="font-mono text-lg md:text-xl leading-none text-amber-400 font-bold whitespace-pre text-center">
            {frames[frame]}
        </pre>
    );
}

// --- HELPER: WIZARD STYLE CARD ---
function WizardCard({ item, type, index }) {
    if (!item) return null;

    const isProject = type === "project";

    return (
        <motion.div
            variants={wizardCardVariants}
            className="flex gap-6 items-start relative group"
        >
            <div className={`
                relative z-10 flex-shrink-0 w-14 h-14 rounded-full border-4 shadow-lg flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12
                ${isProject
                ? "bg-amber-100 border-amber-500 text-amber-700 dark:bg-slate-900 dark:border-amber-500/60 dark:text-amber-400"
                : "bg-blue-100 border-blue-500 text-blue-700 dark:bg-slate-900 dark:border-blue-500/60 dark:text-blue-400"
            }
            `}>
                {isProject ? <FaScroll /> : <FaAward />}
                <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isProject ? "bg-amber-500" : "bg-blue-500"}`} />
            </div>

            <div className={`
                flex-1 relative p-6 rounded-lg border-2 shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl
                ${isProject
                ? "bg-[#fffdf5] border-amber-200 hover:border-amber-400 dark:bg-slate-800/80 dark:border-amber-500/30 dark:hover:border-amber-500/60"
                : "bg-[#f0f9ff] border-blue-200 hover:border-blue-400 dark:bg-slate-800/80 dark:border-blue-500/30 dark:hover:border-blue-500/60"
            }
            `}>
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-current opacity-50" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-current opacity-50" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-current opacity-50" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-current opacity-50" />

                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`
                                text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border
                                ${isProject
                                ? "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300"
                                : "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-300"
                            }
                            `}>
                                {isProject ? (item.versions?.[0]?.tools?.[0] || "Artifact") : "Credential"}
                            </span>
                        </div>

                        <h4 className={`text-xl md:text-2xl font-serif font-bold mb-2 ${isProject ? "text-amber-900 dark:text-amber-50" : "text-slate-800 dark:text-blue-50"}`}>
                            {item.title}
                        </h4>

                        {isProject && (
                            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-4">
                                {item.description}
                            </p>
                        )}
                        {!isProject && item.issuer && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 italic">
                                Bestowed by the High Council of {item.issuer}
                            </p>
                        )}
                    </div>

                    {isProject && (
                        <div className="flex md:flex-col gap-3 shrink-0">
                            {item.liveUrl && (
                                <a href={item.liveUrl} target="_blank" className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase text-white bg-amber-600 hover:bg-amber-700 rounded shadow transition-colors">
                                    <FaExternalLinkAlt /> Visit
                                </a>
                            )}
                            {item.githubUrl && (
                                <a href={item.githubUrl} target="_blank" className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase text-slate-700 bg-slate-200 hover:bg-slate-300 rounded shadow transition-colors">
                                    <FaGithub /> Code
                                </a>
                            )}
                        </div>
                    )}

                    {!isProject && item.link && (
                        <a href={item.link} target="_blank" className="self-start md:self-center px-5 py-2 text-xs font-bold uppercase text-white bg-blue-600 hover:bg-blue-700 rounded shadow transition-colors flex items-center gap-2">
                            <FaExternalLinkAlt /> Inspect
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}