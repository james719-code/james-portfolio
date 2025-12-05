"use client";
import CertificateCard from "../ui/CertificateCard";
import { motion } from "framer-motion";
import { Lock, Award } from "lucide-react";

const CertificateSection = ({ certificates = [] }) => {
    // Check if we have data, otherwise show placeholder
    const hasCertificates = certificates && certificates.length > 0;

    return (
        <section className="py-12 container mx-auto px-4" id="certificates">
            <div className="mb-8 flex items-center gap-3">
                <Award className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Certifications & Awards
                </h2>
            </div>

            {hasCertificates ? (
                // --- REAL DATA GRID ---
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {certificates.map((cert, index) => (
                        <CertificateCard key={index} {...cert} />
                    ))}
                </div>
            ) : (
                // --- PLACEHOLDER / COMING SOON STATE ---
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center dark:border-gray-700 dark:bg-gray-900/50"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.05]"
                         style={{ backgroundImage: 'radial-gradient(#888 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                        <div className="rounded-full bg-gray-200 p-4 dark:bg-gray-800">
                            <Lock className="h-8 w-8 text-gray-400" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Certificates Loading...
                            </h3>
                            <p className="max-w-md mx-auto text-gray-500 dark:text-gray-400">
                                I am currently compiling my list of professional certifications and achievements. Please check back soon!
                            </p>
                        </div>

                        <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                            Coming Soon
                        </span>
                    </div>
                </motion.div>
            )}
        </section>
    );
};

export default CertificateSection;