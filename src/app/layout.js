import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/providers/Providers";
import { StateProvider } from "@/providers/StateProvider";
import ScrollObserver from "@/lib/ScrollObserver";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://jamesgallego.dev";

export const metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "James Ryan Gallego — Android & Web Developer | Camarines Sur, Philippines",
        template: "%s | James Gallego"
    },
    description: "Freelance Android and Web Developer from Camarines Sur, Philippines. BSCS student with 3+ years experience building mobile apps, websites, and systems using Java, Kotlin, React, Next.js, and Firebase.",
    keywords: [
        "James Ryan Gallego",
        "Android Developer Philippines",
        "Mobile App Developer Camarines Sur",
        "Freelance Android Developer",
        "Web Developer Philippines",
        "Full-Stack Developer",
        "Kotlin Developer",
        "Java Developer",
        "React Developer",
        "Next.js Developer",
        "Firebase Developer",
        "BSCS Student Developer"
    ],
    authors: [{ name: "James Ryan Gallego", url: siteUrl }],
    creator: "James Ryan Gallego",
    publisher: "James Ryan Gallego",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "en_PH",
        url: siteUrl,
        siteName: "James Gallego Portfolio",
        title: "James Ryan Gallego — Android & Web Developer",
        description: "Freelance Android and Web Developer from Camarines Sur, Philippines. Building mobile apps, websites, and systems with Java, Kotlin, React, and Firebase.",
        images: [
            {
                url: "/img/og-image.png",
                width: 1200,
                height: 630,
                alt: "James Ryan Gallego - Android & Web Developer Portfolio",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "James Ryan Gallego — Android & Web Developer",
        description: "Freelance Android and Web Developer from Camarines Sur, Philippines. BSCS student with 3+ years experience.",
        images: ["/img/og-image.png"],
        creator: "@jamesgallego",
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    alternates: {
        canonical: siteUrl,
    },
    verification: {
        google: "your-google-verification-code",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "James Ryan Gallego",
    url: siteUrl,
    image: `${siteUrl}/img/og-image.png`,
    jobTitle: "Android & Web Developer",
    description: "Freelance Android and Web Developer from Camarines Sur, Philippines",
    address: {
        "@type": "PostalAddress",
        addressLocality: "Caramoan",
        addressRegion: "Camarines Sur",
        addressCountry: "PH"
    },
    sameAs: [
        "https://github.com/james719-code",
        "https://ph.linkedin.com/in/james-ryan-gallego-27a337329"
    ],
    knowsAbout: ["Android Development", "Web Development", "Java", "Kotlin", "React", "Next.js", "Firebase"]
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </head>
        <body className={inter.className}>
        <Providers>
            <StateProvider>
                <ScrollObserver />
                <Header />
                <main>{children}</main>
                <Footer />
            </StateProvider>
        </Providers>
        </body>
        </html>
    );
}