"use client";
import DevMode from "@/components/features/DevMode";
import CreativeMode from "@/components/features/CreativeMode";
import { useStateContext } from "@/providers/StateProvider";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Portfolio from "@/components/sections/Portfolio";
import Contact from "@/components/sections/Contact";
import CertificateSection from "@/components/sections/CertificateSection";
import { certificates } from "@/data/portfolioData";

export default function Home() {
    const { isCreative } = useStateContext();

    return (
        <>
            {isCreative ? (
                <CreativeMode />
            ) : (
                <>
                    <Hero />
                    <About />
                    <section id="metrics">
                        <DevMode />
                    </section>
                    <Services />
                    <Portfolio />
                    <CertificateSection certificates={certificates} />
                    <Contact />
                </>
            )}
        </>
    );
}