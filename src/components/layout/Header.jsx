"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { ModeToggle } from "./ModeToggle";
import { useStateContext } from "@/providers/StateProvider";

const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#metrics", label: "Metrics" },
    { href: "#services", label: "Services" },
    { href: "#portf", label: "Portfolio" },
];

const Header = () => {
    const { isCreative, setIsCreative } = useStateContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            // ScrollSpy Logic
            const sections = navLinks.map(link => link.href.substring(1));
            let current = "";

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && window.scrollY >= (element.offsetTop - 150)) {
                    current = `#${section}`;
                }
            }
            setActiveSection(current || "#home");
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMenuOpen]);

    const closeMenu = () => setIsMenuOpen(false);

    // --- Helper for Dynamic Styles ---
    const getHeaderStyles = () => {
        // Mobile Menu Open - keep header semi-transparent so logo/close button are visible
        if (isMenuOpen) return "bg-transparent";

        // Scrolled State
        if (isScrolled) {
            if (isCreative) {
                return "bg-white/70 dark:bg-black/60 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/20 dark:border-white/5 shadow-sm py-3";
            }
            return "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm py-3";
        }

        // Top of Page (Transparent)
        return "bg-transparent border-transparent py-5";
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${getHeaderStyles()}`}
        >
            <div className="container mx-auto flex justify-between items-center px-4 md:px-8">

                {/* Logo */}
                <Link
                    href="/public"
                    className="flex items-center gap-1 text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity z-50 relative"
                    onClick={closeMenu}
                >
                    <span>
                        Dev<span className="text-primary">James</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <ul className="flex items-center gap-2 text-sm font-medium">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.href}
                                {...link}
                                isActive={activeSection === link.href}
                                isCreative={isCreative}
                            />
                        ))}
                    </ul>

                    <div className="flex items-center gap-4 pl-6 border-l border-border/40">
                        <ThemeToggle />
                        <ModeToggle isCreative={isCreative} setIsCreative={setIsCreative} />
                        <Link
                            href="#contact"
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 border ${
                                isCreative
                                    ? "bg-primary text-primary-foreground border-primary/20 shadow-md shadow-primary/20 hover:shadow-primary/40"
                                    : "bg-primary text-primary-foreground border-transparent shadow-sm hover:opacity-90"
                            }`}
                        >
                            Contact Me
                        </Link>
                    </div>
                </nav>

                {/* Mobile Toggle Button */}
                <button
                    className="md:hidden p-2 text-2xl text-foreground focus:outline-none z-50 relative"
                    aria-label="Toggle Menu"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Mobile Nav Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, filter: "blur(20px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, filter: "blur(20px)" }}
                            // CHANGED: Added 'overflow-y-auto' and removed 'flex/items-center' from this parent
                            // This allows the inner container to handle the layout and scrolling
                            className={`fixed inset-0 z-40 h-[100dvh] overflow-y-auto ${
                                isCreative
                                    ? "bg-white/60 dark:bg-black/60 backdrop-blur-3xl backdrop-saturate-200"
                                    : "bg-background/70 backdrop-blur-3xl"
                            }`}
                        >
                            <div className="min-h-full w-full flex flex-col items-center justify-center py-24 px-6 gap-8">

                                <ul className="flex flex-col items-center gap-6 text-xl font-medium w-full max-w-xs">
                                    {navLinks.map((link) => (
                                        <li key={link.href} className="w-full text-center">
                                            <Link
                                                href={link.href}
                                                onClick={closeMenu}
                                                className={`block w-full py-2 relative transition-colors ${
                                                    activeSection === link.href ? "text-primary font-bold" : "text-foreground/80"
                                                }`}
                                            >
                                                {link.label}
                                                {activeSection === link.href && (
                                                    <motion.span
                                                        layoutId="mobileUnderline"
                                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"
                                                    />
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                <div className="w-full max-w-sm">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className={`flex items-start gap-3 p-4 rounded-xl border text-sm ${
                                            isCreative
                                                ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400"
                                                : "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                                        }`}
                                    >
                                        <FaExclamationTriangle className="text-lg shrink-0 mt-0.5" />
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold uppercase text-xs opacity-90">Performance Note</span>
                                            <p className="opacity-90 leading-tight text-xs">
                                                3D visuals may cause lag on mobile devices. Switch modes if issues occur.
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="flex flex-col items-center gap-6 w-full max-w-sm mt-auto">
                                    <div className="flex items-center gap-8 p-2 rounded-full bg-background/20 border border-white/10">
                                        <ThemeToggle />
                                        <ModeToggle isCreative={isCreative} setIsCreative={setIsCreative} />
                                    </div>
                                    <Link
                                        href="#contact"
                                        onClick={closeMenu}
                                        className={`w-full text-center px-6 py-3.5 rounded-xl font-bold shadow-xl transition-all active:scale-95 ${
                                            isCreative
                                                ? "bg-primary text-primary-foreground shadow-primary/20"
                                                : "bg-primary text-primary-foreground"
                                        }`}
                                    >
                                        Contact Me
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
};

// --- Helper Component for Desktop Links ---
const NavLink = ({ href, label, isActive, isCreative }) => {
    return (
        <li>
            <Link
                href={href}
                className={`relative px-4 py-2 transition-all rounded-full text-sm ${
                    isActive
                        ? "text-primary font-semibold bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
            >
                {label}
            </Link>
        </li>
    );
};

export default Header;