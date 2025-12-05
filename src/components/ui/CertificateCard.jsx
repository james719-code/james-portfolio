"use client";
import { ExternalLink, Award, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const CertificateCard = ({ title, issuer, date, image, link }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
            {/* Card Header / Image Area */}
            <div className="relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-600">
                        <Award className="h-16 w-16 opacity-50" />
                    </div>
                )}

                {/* Date Badge */}
                <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-600 shadow-sm backdrop-blur-sm dark:bg-black/80 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {date}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
                <div className="mb-auto space-y-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 dark:text-gray-100">
                        {title}
                    </h3>
                    <p className="text-sm text-primary font-medium">{issuer}</p>
                </div>

                {/* Footer / Link */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                    {link ? (
                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary dark:text-gray-400"
                        >
                            View Credential <ExternalLink size={14} />
                        </a>
                    ) : (
                        <span className="text-xs text-gray-400 italic">Credential ID available on request</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CertificateCard;