import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/providers/Providers";
import { StateProvider } from "@/providers/StateProvider";
import ScrollObserver from "@/lib/ScrollObserver"; // <-- 1. Import this

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "James Gallego — Full‑Stack & Mobile Developer",
    description: "Explore the portfolio of James Gallego...",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
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