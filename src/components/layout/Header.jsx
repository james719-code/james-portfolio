"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { ModeToggle } from "./ModeToggle";
import { useStateContext } from "@/providers/StateProvider";

// Added "Metrics" to navigation
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

    // --- 1. Handle Scroll & Active Section Logic ---
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            // ScrollSpy Logic
            const sections = navLinks.map(link => link.href.substring(1));
            let current = "";

            for (const section of sections) {
                const element = document.getElementById(section);
                // Offset calculation to trigger active state slightly before reaching the section
                if (element && window.scrollY >= (element.offsetTop - 150)) {
                    current = `#${section}`;
                }
            }
            setActiveSection(current || "#home");
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // --- 2. Lock Body Scroll on Mobile Menu Open ---
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMenuOpen]);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            // FIX: Added 'bg-background' to mobile state ensures visibility even at bottom of page
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled || isMenuOpen
                    ? "border-b border-border/40 bg-background/95 backdrop-blur-xl shadow-sm py-3"
                    : "border-transparent bg-transparent py-5"
            }`}
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
                    <ul className="flex items-center gap-6 text-sm font-medium">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.href}
                                {...link}
                                isActive={activeSection === link.href}
                            />
                        ))}
                    </ul>

                    <div className="flex items-center gap-4 pl-6 border-l border-border">
                        <ThemeToggle />
                        <ModeToggle isCreative={isCreative} setIsCreative={setIsCreative} />
                        <Link
                            href="#contact"
                            className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-medium transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
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
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            // FIX: Changed absolute inset-0 to fixed inset-0 to cover entire viewport regardless of scroll
                            // FIX: Added bg-background (solid color) to ensure no bleed-through from footer
                            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background md:hidden"
                            style={{ height: "100dvh" }} // Uses dynamic viewport height for mobile browsers
                        >
                            <ul className="flex flex-col items-center gap-8 text-xl font-medium">
                                {navLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            onClick={closeMenu}
                                            className={`relative transition-colors ${
                                                activeSection === link.href ? "text-primary font-bold" : "text-foreground/80"
                                            }`}
                                        >
                                            {link.label}
                                            {activeSection === link.href && (
                                                <motion.span
                                                    layoutId="mobileUnderline"
                                                    className="absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full"
                                                />
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-col items-center gap-6 mt-12 w-full px-12">
                                <div className="flex items-center gap-6">
                                    <ThemeToggle />
                                    <ModeToggle isCreative={isCreative} setIsCreative={setIsCreative} />
                                </div>
                                <Link
                                    href="#contact"
                                    onClick={closeMenu}
                                    className="w-full max-w-[200px] text-center bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium shadow-xl"
                                >
                                    Contact Me
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
};

// --- Helper Component for Desktop Links ---
const NavLink = ({ href, label, isActive }) => {
    return (
        <li>
            <Link
                href={href}
                className={`relative px-1 py-2 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
            >
                {label}
                {isActive && (
                    <motion.span
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                )}
            </Link>
        </li>
    );
};

export default Header;