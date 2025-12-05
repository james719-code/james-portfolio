"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion'; // Assuming you have framer-motion installed
import { MapPin, Mail, Phone, Calendar, Briefcase, Code2 } from 'lucide-react';

const About = () => {
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section className="relative w-full py-20 md:py-32 overflow-hidden" id="about">

            {/* --- Background Pattern --- */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background">
                <div className="absolute h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="container mx-auto px-4 md:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Left Side: Image with Architectural Design */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="relative mx-auto w-full max-w-[450px]"
                    >
                        {/* Decorative Offset Border */}
                        <div className="absolute top-4 left-4 w-full h-full border-2 border-primary/20 rounded-2xl z-0"></div>

                        {/* Decorative Dot Pattern Element */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:8px_8px] z-0 opacity-50"></div>

                        {/* Main Image */}
                        <div className="relative z-10 rounded-2xl overflow-hidden border border-border bg-muted shadow-2xl">
                            <Image
                                src="/img/picture.webp"
                                alt="James Ryan Portrait"
                                width={500}
                                height={600}
                                className="object-cover w-full h-auto hover:scale-105 transition-transform duration-500"
                                priority
                            />
                        </div>
                    </motion.div>

                    {/* Right Side: Content */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <motion.div variants={fadeIn}>
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase border border-primary/20">
                                    About Me
                                </span>
                            </motion.div>

                            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                                Transforming ideas into <br />
                                <span className="text-primary">digital reality.</span>
                            </motion.h2>

                            <motion.p variants={fadeIn} className="text-muted-foreground leading-relaxed text-lg">
                                I am a passionate developer with a knack for creating dynamic and user-friendly applications. My journey in tech has been driven by a desire to solve real-world problems and build beautiful, efficient digital experiences.
                            </motion.p>
                        </div>

                        {/* Info Grid - "System Specs" Style */}
                        <motion.div variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { icon: <Briefcase size={18} />, label: "Experience", value: "2+ Years" },
                                { icon: <Code2 size={18} />, label: "Specialty", value: "Android & Web" },
                                { icon: <Mail size={18} />, label: "Email", value: "gallegojamesryan719@gmail.com", isEmail: true },
                                { icon: <Phone size={18} />, label: "Phone", value: "+63 951 984 9848" },
                                { icon: <MapPin size={18} />, label: "Address", value: "Poloan, Caramoan, CamSur", full: true },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-4 p-4 rounded-xl border border-border bg-background/50 backdrop-blur-sm hover:bg-accent/50 transition-colors ${item.full ? 'sm:col-span-2' : ''}`}
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        {item.icon}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{item.label}</p>
                                        <p className={`font-semibold text-foreground mt-0.5 ${item.isEmail ? 'text-sm truncate' : ''}`} title={item.value}>
                                            {item.value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        <motion.div variants={fadeIn} className="pt-2">
                            <Link
                                href="#portf"
                                className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background shadow transition-transform hover:scale-105 active:scale-95"
                            >
                                View My Work
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;