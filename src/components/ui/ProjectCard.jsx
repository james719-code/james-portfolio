"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Download,
    ExternalLink,
    Github,
    History,
    Users,
    ChevronDown,
    ChevronUp,
    Layers,
    Sparkles,
    Rocket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProjectCard = ({
                         title,
                         description,
                         bgImage,
                         logoImage,
                         versions = [],
                         liveUrl,
                         githubUrl,
                         downloadUrl,
                         attribution,
                         collaborators,
                         // isBlur = true, // You can remove this prop now as it's unused
                     }) => {
    const [showHistory, setShowHistory] = useState(false);

    // 1. Logic to determine if we have history or just one version
    const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null;
    const pastVersions = versions.length > 1 ? versions.slice(0, -1).reverse() : [];
    const isSingleVersion = versions.length === 1;

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/50">

            {/* --- Image Section --- */}
            <div className="relative h-48 w-full overflow-hidden bg-muted">
                {bgImage ? (
                    <>
                        <Image
                            src={bgImage}
                            // UPDATED LINE BELOW: Removed the blur condition
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt={`${title} Preview`}
                            width={500}
                            height={220}
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                        <Layers className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                )}

                {/* Floating Logo */}
                {logoImage && (
                    // Note: This div still has 'backdrop-blur-md' for the frosted glass effect under the logo.
                    // If you want to remove that too, delete 'backdrop-blur-md' from the className below.
                    <div className="absolute bottom-4 left-4 h-16 w-16 overflow-hidden rounded-xl border-2 border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
                        <Image
                            src={logoImage}
                            className="h-full w-full object-contain p-2"
                            alt={`${title} Logo`}
                            width={64}
                            height={64}
                        />
                    </div>
                )}
            </div>

            {/* --- Body Section --- */}
            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h4 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                            {title}
                        </h4>
                        {attribution && (
                            <p className="text-[10px] text-muted-foreground italic">
                                {attribution}
                            </p>
                        )}
                    </div>
                    {latestVersion && (
                        <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wide">
                            v{latestVersion.version}
                        </span>
                    )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {description}
                </p>

                {/* Tech Stack (Always visible) */}
                {latestVersion && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-1.5">
                            {latestVersion.tools.map((tool) => (
                                <span
                                    key={tool}
                                    className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-1 text-[10px] font-medium text-secondary-foreground ring-1 ring-inset ring-white/10"
                                >
                                    {tool}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Collaborators */}
                {collaborators && collaborators.length > 0 && (
                    <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <div className="flex flex-wrap gap-2">
                            {collaborators.map((c, idx) => (
                                <Link
                                    key={idx}
                                    href={c.url}
                                    target="_blank"
                                    className="hover:text-primary underline decoration-dotted underline-offset-2 transition-colors"
                                >
                                    {c.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-auto"></div>

                {/* --- History OR "Coming Soon" Section --- */}
                <div className="border-t border-border pt-3 mt-2">
                    {isSingleVersion ? (
                        // CASE 1: Only 1 Version - Show "Updates Coming Soon"
                        <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-2 text-xs text-muted-foreground">
                            <Sparkles size={14} className="text-yellow-500" />
                            <span className="font-medium">Future updates planned</span>
                            <Rocket size={14} className="text-primary/70" />
                        </div>
                    ) : (
                        // CASE 2: Multiple Versions - Show History Accordion
                        <>
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <span className="flex items-center gap-1.5">
                                    <History className="h-3 w-3" /> Previous Versions
                                </span>
                                {showHistory ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>

                            <AnimatePresence>
                                {showHistory && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="space-y-3 py-3 pl-1">
                                            {pastVersions.map((v, i) => (
                                                <div key={i} className="relative pl-4 border-l border-border">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold">v{v.version}</span>
                                                        <span className="text-[10px] text-muted-foreground">{v.date}</span>
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                                                        {v.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    )}
                </div>
            </div>

            {/* --- Footer Actions --- */}
            <div className="flex items-center gap-2 border-t border-border bg-muted/40 p-4">
                {liveUrl && (
                    <Link
                        href={liveUrl}
                        target="_blank"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                    >
                        <ExternalLink size={14} /> Demo
                    </Link>
                )}

                {githubUrl && (
                    <Link
                        href={githubUrl}
                        target="_blank"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-all"
                    >
                        <Github size={14} /> Code
                    </Link>
                )}

                {downloadUrl && (
                    <Link
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-all"
                    >
                        <Download size={14} /> APK
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;