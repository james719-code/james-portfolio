import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const ServiceCard = ({ icon, title, description, link }) => {
    return (
        <div className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/50">

            {/* Top Section */}
            <div>
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    {icon}
                </div>
                <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground">
                    {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </div>

            {/* Bottom Link */}
            <div className="mt-6">
                <Link
                    href={link}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:text-primary/80"
                >
                    <span>Visit Now</span>
                    {/* Arrow animates slightly to the right on group hover */}
                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    );
};

export default ServiceCard;