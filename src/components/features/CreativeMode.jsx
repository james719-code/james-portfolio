import ProjectGalaxy from '../ui/ProjectCity';

export default function CreativeMode() {
    return (
        // h-screen: Full viewport height
        // bg-black: Seamless background for the starfield
        // pt-20: Pushes content down so it's not hidden behind your fixed Header
        <section className="h-screen w-full bg-black pt-20 flex flex-col relative overflow-hidden">

            {/* Optional: Mode Title Overlay */}
            <div className="absolute top-24 left-0 w-full text-center z-10 pointer-events-none">
                <h2 className="text-3xl font-bold text-white tracking-widest uppercase opacity-20">
                    Interactive Mode
                </h2>
            </div>

            {/* The 3D Scene */}
            <div className="flex-1 w-full">
                <ProjectGalaxy />
            </div>
        </section>
    );
}