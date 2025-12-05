import Link from "next/link";
import { FaArrowUp } from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-border bg-background py-6 mt-20">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">

                {/* Copyright Text */}
                <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground">
                        &copy; {currentYear} <span className="font-semibold text-foreground">James Ryan Gallego</span>. All Rights Reserved.
                    </p>
                </div>

                {/* Scroll to Top Button */}
                <Link
                    href="#home"
                    aria-label="Scroll to top"
                    className="group flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 shadow-sm"
                >
                    <FaArrowUp className="text-sm transition-transform duration-300 group-hover:scale-110" />
                </Link>
            </div>
        </footer>
    );
};

export default Footer;