"use client";

import { motion } from "framer-motion";
import { FaCode, FaCube } from "react-icons/fa";

export function ModeToggle({ isCreative, setIsCreative }) {
    return (
        <div
            className={`relative flex items-center p-1 rounded-full cursor-pointer transition-colors duration-300 w-24 h-10 border ${
                isCreative
                    ? "bg-indigo-950/20 border-indigo-500/30"
                    : "bg-slate-200/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700"
            }`}
            onClick={() => setIsCreative(!isCreative)}
            title={isCreative ? "Switch to Standard View" : "Switch to 3D View"}
        >
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`absolute h-8 w-10 rounded-full shadow-sm z-10 flex items-center justify-center ${
                    isCreative
                        ? "left-[calc(100%-2.75rem)] bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                        : "left-1 bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-200 shadow-sm"
                }`}
            >
                <motion.div
                    key={isCreative ? "creative" : "dev"}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {isCreative ? <FaCube size={14} /> : <FaCode size={14} />}
                </motion.div>
            </motion.div>

            <div className="flex justify-between w-full px-2.5 text-[10px] font-extrabold uppercase tracking-widest select-none">
                <span className={`transition-opacity duration-300 ${isCreative ? "opacity-40" : "opacity-0"}`}>
                    Dev
                </span>
                <span className={`transition-opacity duration-300 ${!isCreative ? "opacity-40" : "opacity-0"}`}>
                    3D
                </span>
            </div>
        </div>
    );
}