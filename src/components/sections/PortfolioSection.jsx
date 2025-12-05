import ProjectCard from "../ui/ProjectCard";

const PortfolioSection = ({ title, projects, isAlternate = false }) => {
    // Logic to highlight the second word instead of the first, or just style the span manually
    const [firstWord, ...restOfTitle] = title.split(" ");

    return (
        <section className={`py-20 px-4 ${isAlternate ? "bg-muted/30" : "bg-background"}`}>
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        {firstWord} <span className="text-primary">{restOfTitle.join(" ")}</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <ProjectCard key={project.title} {...project} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PortfolioSection;