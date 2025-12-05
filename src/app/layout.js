import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/providers/Providers";
import { StateProvider } from "@/providers/StateProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "James Gallego — Full‑Stack & Mobile Developer",
    description: "Explore the portfolio of James Gallego: full-stack web, Android apps, Node.js & AI projects.",
};

export default function RootLayout({ children }) {
    return (
        // FIX: Added suppressHydrationWarning
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <Providers>
            <StateProvider>
                <Header />
                <main>{children}</main>
                <Footer />
            </StateProvider>
        </Providers>
        </body>
        </html>
    );
}