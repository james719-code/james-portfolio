"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaGithub, FaLinkedin, FaDownload, FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";

const Hero = () => {
    // --- Animation Variants ---
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const socialLinks = [
        {
            icon: <FaGithub />,
            link: "https://github.com/james719-code",
            label: "GitHub",
            isDisabled: false
        },
        {
            icon: <FaLinkedin />,
            link: "https://ph.linkedin.com/in/james-ryan-gallego-27a337329",
            label: "LinkedIn",
            isDisabled: false
        },
        {
            icon: <FaFacebook />,
            link: "#",
            label: "Facebook",
            isDisabled: true
        },
        {
            icon: <FaInstagram />,
            link: "#",
            label: "Instagram",
            isDisabled: true
        },
    ];

    return (
        <section className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden py-20" id="home">

            {/* --- Background Design --- */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <div className="container relative mx-auto flex flex-col items-center justify-center p-4 text-center z-10">

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.15 } }
                    }}
                    className="flex flex-col items-center gap-6 md:gap-8 max-w-5xl"
                >
                    <motion.div variants={fadeInUp}>
                        <span className="inline-block rounded-full bg-secondary/80 backdrop-blur-sm px-5 py-2 text-sm font-medium text-secondary-foreground border border-secondary">
                            Hi, There!
                        </span>
                    </motion.div>

                    {/* --- MAIN NAME TITLE --- */}
                    <div className="relative z-20 w-full">
                        <h1 className="font-extrabold tracking-tight leading-none flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 uppercase">
                            <motion.span
                                variants={fadeInUp}
                                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground"
                            >
                                I&#39;M
                            </motion.span>

                            <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary flex flex-wrap justify-center gap-x-3 md:gap-x-4">
                                <ParticleText text="James" />
                                <ParticleText text="Ryan" />
                            </span>
                        </h1>
                    </div>

                    <motion.p variants={fadeInUp} className="max-w-2xl text-base md:text-xl text-muted-foreground leading-relaxed px-2">
                        A BSCS student and freelance <span className="text-foreground font-semibold tracking-wide">Android Developer</span> passionate about crafting impactful digital experiences. I build high-quality, customized websites and mobile apps tailored to your needs.
                    </motion.p>

                    {/* Social Icons */}
                    <motion.div variants={fadeInUp} className="flex gap-4 justify-center w-full z-50">
                        {socialLinks.map((social, idx) => (
                            <SocialButton key={idx} {...social} />
                        ))}
                    </motion.div>

                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4 justify-center w-full sm:w-auto z-10">
                        <Link
                            href="#contact"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary/40 hover:bg-primary/90"
                        >
                            <FaPaperPlane /> Hire Me
                        </Link>

                        <a
                            href="/file/resume.pdf"
                            download="James_Ryan_Gallego_Resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-input bg-background/50 backdrop-blur-md px-8 py-4 text-sm font-semibold transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:-translate-y-1"
                        >
                            <FaDownload /> Download CV
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

const SocialButton = ({ icon, link, label, isDisabled }) => {
    return (
        <a
            href={isDisabled ? undefined : link}
            target={isDisabled ? undefined : "_blank"}
            rel={isDisabled ? undefined : "noopener noreferrer"}
            aria-label={label}
            aria-disabled={isDisabled}
            onClick={(e) => isDisabled && e.preventDefault()}
            className={`
                flex h-11 w-11 items-center justify-center rounded-full border border-input backdrop-blur-md transition-all duration-300 z-10
                ${isDisabled
                ? "bg-background/20 text-muted-foreground/30 cursor-not-allowed border-dashed hover:border-input"
                : "bg-background/50 text-muted-foreground hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 cursor-pointer"
            }
            `}
        >
            {icon}
        </a>
    );
};

// --- HELPER COMPONENTS FOR PARTICLE EFFECT ---

const ParticleText = ({ text }) => {
    return (
        <span className="inline-flex flex-nowrap">
            {text.split("").map((char, index) => (
                <ParticleLetter key={index} letter={char} index={index} />
            ))}
        </span>
    );
};

const ParticleLetter = ({ letter, index }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 6 }).map(() => ({
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            delay: Math.random() * 0.3,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="relative inline-block">
            {/* The Solid Letter */}
            <motion.span
                initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{
                    duration: 0.4,
                    delay: 0.5 + (index * 0.1),
                    ease: "easeOut"
                }}
                className="relative z-10 block"
            >
                {letter}
            </motion.span>

            {/* The Bits/Particles */}
            {particles.map((p, i) => (
                <motion.span
                    key={i}
                    className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-sm bg-primary/80"
                    initial={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
                    animate={{
                        x: 0,
                        y: 0,
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0]
                    }}
                    transition={{
                        duration: 0.6,
                        delay: (index * 0.1) + p.delay,
                        ease: "circOut"
                    }}
                />
            ))}
        </div>
    );
};

export default Hero;