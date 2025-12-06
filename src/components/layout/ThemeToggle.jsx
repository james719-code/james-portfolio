"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10" />;
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{
                    scale: isDark ? 0 : 1,
                    rotate: isDark ? 120 : 0,
                    opacity: isDark ? 0 : 1
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="absolute text-orange-500 text-xl"
            >
                <FaSun />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    scale: isDark ? 1 : 0,
                    rotate: isDark ? 0 : -120, // Rotates in from opposite direction
                    opacity: isDark ? 1 : 0
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="absolute text-blue-400 text-lg"
            >
                <FaMoon />
            </motion.div>
        </button>
    );
}