import PortfolioSection from "./PortfolioSection";
import CertificateSection from "./CertificateSection";
import {
    commissionedProjects,
    schoolProjects,
    personalProjects,
    collaborationProjects,
    certificates // <--- Import the new array here
} from "@/data/portfolioData";

const Portfolio = () => {

    return (
        <div id="portf" className="container mx-auto p-4 space-y-8">
            <PortfolioSection title="Commissioned Projects" projects={commissionedProjects} />
            <PortfolioSection title="School Projects" projects={schoolProjects} isAlternate />
            <PortfolioSection title="Personal Projects" projects={personalProjects} />
            <PortfolioSection title="Collaboration Projects" projects={collaborationProjects} isAlternate />
        </div>
    );
};

export default Portfolio;