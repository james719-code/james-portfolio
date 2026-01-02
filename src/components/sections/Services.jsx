import ServiceCard from '../ui/ServiceCard';
import { FaAndroid, FaCog, FaGlobe } from 'react-icons/fa';

const servicesData = [
    {
        icon: <FaAndroid />,
        title: 'Android Development',
        description: 'I specialize in building powerful and user-friendly Android applications tailored to your needs. From concept to deployment, my solutions are designed to deliver seamless performance.',
        link: '#portfolio'
    },
    {
        icon: <FaCog />,
        title: 'System Development',
        description: 'I provide end-to-end system development services, including planning, design, implementation, and maintenance of robust software systems.',
        link: '#portfolio'
    },
    {
        icon: <FaGlobe />,
        title: 'Website Development',
        description: 'I have solid experience building responsive and visually appealing websites. I create functional web solutions using modern design practices like Next.js.',
        link: '#contact'
    },
];

const Services = () => {
    return (
        <section className="container mx-auto px-4 py-20" id="services">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                    My <span className="text-primary">Services</span>
                </h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                    Transforming ideas into digital reality with a wide range of technical skills.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicesData.map((service) => (
                    <ServiceCard
                        key={service.title}
                        icon={service.icon}
                        title={service.title}
                        description={service.description}
                        link={service.link}
                    />
                ))}
            </div>
        </section>
    );
};

export default Services;