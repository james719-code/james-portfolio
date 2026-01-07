"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
    FaGithub, FaExternalLinkAlt, FaAward, FaExpand, FaCompress, FaChevronDown, FaRocket
} from "react-icons/fa";
import ProjectGalaxy from '../ui/ProjectCity';

import {
    commissionedProjects,
    schoolProjects,
    personalProjects,
    collaborationProjects,
    certificates
} from '@/data/portfolioData';

function SpaceLoader() {
    const orbits = [
        { radius: 56, size: 12, color: '#60a5fa', duration: 3 },
        { radius: 40, size: 10, color: '#4ade80', duration: 2.5 },
        { radius: 24, size: 8, color: '#f472b6', duration: 2 },
    ];

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative w-32 h-32">
                {/* Sun at center */}
                <motion.div
                    className="absolute rounded-full bg-gradient-to-br from-yellow-300 to-orange-500"
                    style={{
                        width: 40,
                        height: 40,
                        top: '50%',
                        left: '50%',
                        marginLeft: -20,
                        marginTop: -20,
                        boxShadow: '0 0 30px rgba(251, 191, 36, 0.6)'
                    }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Orbit rings and planets */}
                {orbits.map((orbit, i) => (
                    <div key={i}>
                        {/* Orbit ring - centered circle */}
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"
                            style={{ width: orbit.radius * 2, height: orbit.radius * 2 }}
                        />

                        {/* Orbiting planet */}
                        <motion.div
                            className="absolute top-1/2 left-1/2"
                            style={{ width: orbit.radius * 2, height: orbit.radius * 2, marginLeft: -orbit.radius, marginTop: -orbit.radius }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: orbit.duration, repeat: Infinity, ease: "linear" }}
                        >
                            <div
                                className="absolute rounded-full"
                                style={{
                                    width: orbit.size,
                                    height: orbit.size,
                                    background: orbit.color,
                                    boxShadow: `0 0 10px ${orbit.color}80`,
                                    top: 0,
                                    left: '50%',
                                    marginLeft: -orbit.size / 2,
                                    marginTop: -orbit.size / 2,
                                }}
                            />
                        </motion.div>
                    </div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
            >
                <p className="text-lg font-light tracking-[0.4em] text-blue-200 uppercase flex items-center gap-3">
                    <FaRocket className="animate-bounce" /> LAUNCHING
                </p>
                <p className="text-white/40 text-sm mt-2">Initializing solar system</p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
}

// Project card with space theme
function ProjectCard({ project, index }) {
    const colors = [
        "from-blue-500/20 to-cyan-500/20 border-blue-500/30 hover:border-blue-400",
        "from-green-500/20 to-emerald-500/20 border-green-500/30 hover:border-green-400",
        "from-purple-500/20 to-violet-500/20 border-purple-500/30 hover:border-purple-400",
        "from-orange-500/20 to-amber-500/20 border-orange-500/30 hover:border-orange-400",
        "from-pink-500/20 to-rose-500/20 border-pink-500/30 hover:border-pink-400",
        "from-teal-500/20 to-cyan-500/20 border-teal-500/30 hover:border-teal-400",
    ];
    const colorClass = colors[index % colors.length];
    const planetEmoji = ['🌍', '🔴', '🟣', '🟢', '🌕', '⭐'][index % 6];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className={`
                relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 group cursor-pointer
                bg-gradient-to-br ${colorClass}
                hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1
            `}
        >
            {/* Planet icon */}
            <div className="text-3xl mb-4 group-hover:scale-125 transition-transform duration-300">
                {planetEmoji}
            </div>

            {/* Category */}
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/60 uppercase tracking-wider mb-3 inline-block">
                {project.versions?.[0]?.tools?.[0] || "Project"}
            </span>

            {/* Title */}
            <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors">
                {project.title}
            </h4>

            {/* Description */}
            <p className="text-sm text-white/60 leading-relaxed mb-4 line-clamp-2">
                {project.description}
            </p>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
                {project.liveUrl && (
                    <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600/80 hover:bg-blue-500 rounded-lg transition-colors"
                    >
                        <FaExternalLinkAlt size={10} /> Visit
                    </a>
                )}
                {project.githubUrl && (
                    <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/80 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <FaGithub size={10} /> Code
                    </a>
                )}
            </div>
        </motion.div>
    );
}

// Certificate card
function CertificateCard({ cert, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative p-5 rounded-xl backdrop-blur-xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 hover:border-yellow-400/50 transition-all group"
        >
            <div className="flex items-start gap-4">
                <div className="text-2xl group-hover:scale-110 transition-transform">🌙</div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-yellow-100 mb-1 truncate">{cert.title}</h4>
                    {cert.issuer && (
                        <p className="text-xs text-yellow-300/60">{cert.issuer}</p>
                    )}
                </div>
            </div>
            {cert.link && (
                <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 text-yellow-400/50 hover:text-yellow-300 transition-colors"
                >
                    <FaExternalLinkAlt size={12} />
                </a>
            )}
        </motion.div>
    );
}

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
        }, 2800);

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
        <main className="min-h-screen w-full bg-black flex flex-col relative font-sans overflow-x-hidden">

            {/* Space background effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[180px]" />
            </div>

            {/* Loading Screen */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
                    >
                        <SpaceLoader />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3D Solar System Section */}
            <section className={`relative w-full transition-all duration-500 ${isFullScreen ? "h-[100dvh] z-[60]" : "pt-16 pb-8 px-4 md:px-8"}`}>

                {/* Title */}
                {!isFullScreen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? -20 : 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-center mb-6"
                    >
                        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                            ☀️ Portfolio Solar System
                        </h1>
                        <p className="text-white/50 text-sm md:text-base">
                            Explore the universe of my work • Each planet is a project
                        </p>
                    </motion.div>
                )}

                {/* 3D Canvas */}
                <motion.div
                    layout
                    className={`
                        relative overflow-hidden transition-all duration-500
                        ${isFullScreen
                            ? "fixed top-0 left-0 w-full h-[100dvh] rounded-none z-[60]"
                            : "w-full max-w-6xl mx-auto rounded-3xl h-[55vh] md:h-[600px] border border-yellow-500/20 shadow-2xl shadow-yellow-500/10"
                        }
                    `}
                >
                    <ProjectGalaxy />

                    {/* Fullscreen toggle */}
                    <button
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className="absolute bottom-4 right-4 z-50 p-3 rounded-xl bg-black/50 text-white/80 hover:bg-black/70 backdrop-blur-xl transition-all border border-yellow-500/30 hover:scale-105 active:scale-95"
                        title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
                    >
                        {isFullScreen ? <FaCompress size={18} /> : <FaExpand size={18} />}
                    </button>
                </motion.div>

                {/* Scroll hint */}
                {!isFullScreen && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="text-center mt-8"
                    >
                        <p className="text-white/40 text-sm mb-2">Scroll to see all planets</p>
                        <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <FaChevronDown className="mx-auto text-yellow-500/50" />
                        </motion.div>
                    </motion.div>
                )}
            </section>

            {/* Projects Grid Section */}
            {!isFullScreen && (
                <section className="relative w-full px-4 md:px-8 pb-32 mt-16">
                    <div className="max-w-6xl mx-auto">

                        {/* Section header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                🪐 All Planets
                            </h2>
                            <p className="text-white/40">
                                {allProjects.length} celestial bodies in orbit
                            </p>
                        </motion.div>

                        {/* Projects grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
                            {allProjects.map((project, index) => (
                                <ProjectCard key={index} project={project} index={index} />
                            ))}
                        </div>

                        {/* Certificates section */}
                        {safeCerts.length > 0 && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-center mb-10"
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold text-yellow-100 mb-2">
                                        🌙 Moons & Achievements
                                    </h2>
                                    <p className="text-yellow-300/40">
                                        {safeCerts.length} celestial achievements
                                    </p>
                                </motion.div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {safeCerts.map((cert, index) => (
                                        <CertificateCard key={index} cert={cert} index={index} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            )}
        </main>
    );
}