"use client";

import { useMemo, useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    OrbitControls, Text, Image as DreiImage, Environment,
    Loader, useCursor, Html, SoftShadows, OrthographicCamera, Float
} from '@react-three/drei';
import { useTheme } from "next-themes";
import { commissionedProjects, schoolProjects, personalProjects, collaborationProjects } from '@/data/portfolioData';
import { FaGithub, FaExternalLinkAlt, FaTimes, FaAndroid, FaGlobe, FaDesktop, FaLayerGroup } from 'react-icons/fa';
import * as THREE from 'three';

// --- COLORS PALETTE ---
const DAY_OPTS = {
    sky: "#87CEEB", ground: "#cbd5e1", building: "#f8fafc",
    glass: "#93c5fd", glassEmissive: "#000000", text: "#0f172a", road: "#475569", sidewalk: "#94a3b8"
};
const NIGHT_OPTS = {
    sky: "#0f172a", ground: "#0f172a", building: "#1e293b",
    glass: "#1e293b", glassEmissive: "#fbbf24", text: "#ffffff", road: "#020617", sidewalk: "#334155"
};

const getProjectType = (project) => {
    const tools = project.versions?.[0]?.tools?.join(" ").toLowerCase() || "";
    const title = project.title.toLowerCase();
    if (tools.includes("android") || title.includes("app")) return "android";
    if (tools.includes("react") || tools.includes("next") || tools.includes("web")) return "web";
    return "system";
};

const TYPE_COLORS = { android: "#3ddc84", web: "#3b82f6", system: "#a855f7", default: "#f43f5e" };

// --- 1. PEDESTRIAN ---
function Pedestrian({ startPos, axis = 'x', speed = 0.05, color = 'red' }) {
    const ref = useRef();
    const [offset] = useState(Math.random() * 20);

    useFrame((state) => {
        if (!ref.current) return;
        const time = state.clock.elapsedTime * speed;
        const pos = ((time + offset) % 20) * 2 - 20;
        ref.current.position.y = 0.2 + Math.abs(Math.sin(time * 20)) * 0.05;

        if (axis === 'x') {
            ref.current.position.x = pos;
            ref.current.rotation.y = Math.sin(time) > 0 ? Math.PI / 2 : -Math.PI / 2;
        } else {
            ref.current.position.z = pos;
            ref.current.rotation.y = Math.sin(time) > 0 ? 0 : Math.PI;
        }
    });

    return (
        <group ref={ref} position={startPos}>
            <mesh castShadow position={[0, 0.25, 0]}>
                <boxGeometry args={[0.2, 0.3, 0.1]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.45, 0]}>
                <boxGeometry args={[0.15, 0.15, 0.15]} />
                <meshStandardMaterial color="#ffdbac" />
            </mesh>
        </group>
    );
}

// --- 2. TRAFFIC INFRASTRUCTURE ---
function Road({ position, rotation, length, isNight }) {
    const colors = isNight ? NIGHT_OPTS : DAY_OPTS;
    return (
        <group position={position} rotation={rotation}>
            <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]}>
                <planeGeometry args={[2, length]} />
                <meshStandardMaterial color={colors.road} roughness={0.9} />
            </mesh>
            <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[-1.3, 0.02, 0]}>
                <planeGeometry args={[0.6, length]} />
                <meshStandardMaterial color={colors.sidewalk} />
            </mesh>
            <mesh receiveShadow rotation={[-Math.PI/2, 0, 0]} position={[1.3, 0.02, 0]}>
                <planeGeometry args={[0.6, length]} />
                <meshStandardMaterial color={colors.sidewalk} />
            </mesh>
            {Array.from({ length: Math.floor(length / 4) }).map((_, i) => (
                <mesh key={i} position={[0, 0.01, (i * 4) - length/2 + 2]} rotation={[-Math.PI/2, 0, 0]}>
                    <planeGeometry args={[0.15, 1.5]} />
                    <meshBasicMaterial color={isNight ? "#555" : "#fff"} />
                </mesh>
            ))}
        </group>
    );
}

function TrafficLight({ position, rotation, state }) {
    return (
        <group position={position} rotation={rotation} scale={0.8}>
            <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 3]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[0, 2.5, 0]}>
                <boxGeometry args={[0.4, 1, 0.3]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[0, 2.75, 0.16]}>
                <circleGeometry args={[0.12]} />
                <meshBasicMaterial color={state === 'stop' ? "#ff0000" : "#330000"} />
            </mesh>
            <mesh position={[0, 2.25, 0.16]}>
                <circleGeometry args={[0.12]} />
                <meshBasicMaterial color={state === 'go' ? "#00ff00" : "#003300"} />
            </mesh>
        </group>
    );
}

function Car({ axis = 'x', startPos, speed = 0.1, color = 'red', isNight, trafficState }) {
    const ref = useRef();
    const [offset] = useState(() => Math.random() * 40);
    const [currentSpeed, setCurrentSpeed] = useState(speed);

    useFrame((state, delta) => {
        if (!ref.current) return;
        let shouldStop = false;
        const pos = axis === 'x' ? ref.current.position.x : ref.current.position.z;

        if (trafficState === 'stop') {
            const distToIntersection = Math.abs(pos % 12);
            if (distToIntersection < 3 && distToIntersection > 1) shouldStop = true;
        }

        setCurrentSpeed(THREE.MathUtils.lerp(currentSpeed, shouldStop ? 0 : speed, 0.05));

        const move = currentSpeed * delta * 10;
        if (axis === 'x') {
            ref.current.position.x += move;
            if (ref.current.position.x > 40) ref.current.position.x = -40;
        } else {
            ref.current.position.z += move;
            if (ref.current.position.z > 40) ref.current.position.z = -40;
        }
    });

    return (
        <group ref={ref} position={startPos}>
            <mesh castShadow position={[0, 0.2, 0]}>
                <boxGeometry args={axis === 'x' ? [1.2, 0.4, 0.6] : [0.6, 0.4, 1.2]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {isNight && <pointLight position={[0, 0.2, 0]} distance={3} intensity={2} color="white" />}
        </group>
    );
}

// --- 3. VARIED BUILDING STYLES ---

// Style 0: Standard Box
const BoxBuilding = ({ height, colors, isNight, isMatch, opacity }) => (
    <>
        <mesh position={[0, height/2, 0]} castShadow receiveShadow>
            <boxGeometry args={[3, height, 3]} />
            <meshStandardMaterial color={colors.building} roughness={0.5} transparent opacity={opacity} />
        </mesh>
        {Array.from({ length: Math.floor(height) - 1 }).map((_, i) => (
            <group key={i} position={[0, i + 1, 0]}>
                <mesh position={[0, 0, 1.51]}><planeGeometry args={[2.5, 0.6]} /><meshStandardMaterial color={colors.glass} emissive={colors.glassEmissive} emissiveIntensity={isNight && isMatch && Math.random() > 0.3 ? 2 : 0} transparent opacity={opacity} /></mesh>
                <mesh position={[1.51, 0, 0]} rotation={[0, Math.PI/2, 0]}><planeGeometry args={[2.5, 0.6]} /><meshStandardMaterial color={colors.glass} emissive={colors.glassEmissive} emissiveIntensity={isNight && isMatch && Math.random() > 0.3 ? 2 : 0} transparent opacity={opacity} /></mesh>
            </group>
        ))}
    </>
);

// Style 1: Cylinder (Round)
const CylinderBuilding = ({ height, colors, isNight, isMatch, opacity }) => (
    <>
        <mesh position={[0, height/2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.5, 1.5, height, 32]} />
            <meshStandardMaterial color={colors.building} roughness={0.5} transparent opacity={opacity} />
        </mesh>
        {Array.from({ length: Math.floor(height) - 1 }).map((_, i) => (
            <mesh key={i} position={[0, i + 1, 0]}>
                <cylinderGeometry args={[1.52, 1.52, 0.5, 32]} />
                <meshStandardMaterial color={colors.glass} emissive={colors.glassEmissive} emissiveIntensity={isNight && isMatch && Math.random() > 0.3 ? 2 : 0} transparent opacity={opacity} />
            </mesh>
        ))}
    </>
);

// Style 2: Tiered (Stepped)
const TieredBuilding = ({ height, colors, isNight, isMatch, opacity }) => (
    <>
        <mesh position={[0, height*0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[3, height*0.6, 3]} />
            <meshStandardMaterial color={colors.building} transparent opacity={opacity} />
        </mesh>
        <mesh position={[0, height*0.7, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.2, height*0.4, 2.2]} />
            <meshStandardMaterial color={colors.building} transparent opacity={opacity} />
        </mesh>
        {/* Windows logic simplified for tiers */}
        <mesh position={[0, height*0.3, 1.51]}>
            <planeGeometry args={[2.5, 2]} />
            <meshStandardMaterial color={colors.glass} emissive={colors.glassEmissive} emissiveIntensity={isNight && isMatch ? 1 : 0} transparent opacity={opacity} />
        </mesh>
    </>
);


function MultiStyleBuilding({ position, height, isProject, project, isSelected, onClick, isNight, activeFilter, styleVariant }) {
    const [hovered, setHover] = useState(false);
    useCursor(hovered && isProject);
    const colors = isNight ? NIGHT_OPTS : DAY_OPTS;
    const projectType = isProject ? getProjectType(project) : null;
    const isMatch = activeFilter === 'all' || activeFilter === projectType;
    const opacity = isProject && !isMatch ? 0.3 : 1;

    return (
        <group position={position}>
            <group
                onClick={(e) => {
                    if (isProject) { e.stopPropagation(); onClick(project); }
                }}
                onPointerOver={() => isProject && setHover(true)}
                onPointerOut={() => isProject && setHover(false)}
            >
                {/* Render specific style */}
                {styleVariant === 0 && <BoxBuilding height={height} colors={colors} isNight={isNight} isMatch={isMatch} opacity={opacity} />}
                {styleVariant === 1 && <CylinderBuilding height={height} colors={colors} isNight={isNight} isMatch={isMatch} opacity={opacity} />}
                {styleVariant === 2 && <TieredBuilding height={height} colors={colors} isNight={isNight} isMatch={isMatch} opacity={opacity} />}

                {/* Roof Billboard */}
                {isProject && isMatch && (
                    <group position={[0, height + 0.2, 0]}>
                        <mesh position={[0, 1.2, 0]}><boxGeometry args={[3.5, 2, 0.1]} /><meshStandardMaterial color="#fff" /></mesh>
                        {project.bgImage && <DreiImage url={project.bgImage} position={[0, 1.2, 0.06]} scale={[3.3, 1.8]} toneMapped={true} />}
                    </group>
                )}
            </group>

            {/* UI Card */}
            {isSelected && project && (
                <Html position={[0, height / 2, 0]} center zIndexRange={[100, 0]} sprite>
                    <div className={`
                        w-[250px] p-3 rounded-lg shadow-2xl border transition-colors scale-100 mt-[-150px] ml-[150px]
                        ${isNight ? "bg-slate-900/95 border-slate-600 text-white" : "bg-white/95 border-slate-200 text-slate-800"}
                    `}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-md leading-tight">{project.title}</h3>
                            <button onClick={(e) => { e.stopPropagation(); onClick(null); }} className="opacity-50 hover:opacity-100"><FaTimes/></button>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block uppercase text-white" style={{ backgroundColor: TYPE_COLORS[projectType] || TYPE_COLORS.default }}>
                            {projectType}
                        </span>
                        <p className="text-[11px] opacity-80 mb-3 line-clamp-3 leading-relaxed">{project.description}</p>
                        <div className="flex gap-2">
                            {project.liveUrl && <a href={project.liveUrl} target="_blank" className="flex-1 bg-blue-600 text-white text-[10px] py-1.5 rounded text-center font-bold hover:bg-blue-700">DEMO</a>}
                            {project.githubUrl && <a href={project.githubUrl} target="_blank" className={`flex-1 border text-[10px] py-1.5 rounded text-center font-bold ${isNight ? "border-slate-500 hover:bg-slate-700" : "border-slate-300 hover:bg-slate-50"}`}>CODE</a>}
                        </div>
                        <div className={`absolute bottom-[-10px] left-[-20px] w-10 h-[2px] rotate-45 ${isNight ? "bg-slate-600" : "bg-slate-300"}`}></div>
                    </div>
                </Html>
            )}
        </group>
    );
}

// --- 4. MAIN SCENE ---
export default function UrbanMap() {
    const { resolvedTheme } = useTheme();
    const [isNight, setIsNight] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [trafficState, setTrafficState] = useState('go');

    useEffect(() => { setIsNight(resolvedTheme === 'dark'); }, [resolvedTheme]);

    useEffect(() => {
        const interval = setInterval(() => setTrafficState(p => p === 'go' ? 'stop' : 'go'), 5000);
        return () => clearInterval(interval);
    }, []);

    const { elements, traffic, pedestrians, roads, lights } = useMemo(() => {
        const allProjects = [...(commissionedProjects || []), ...(schoolProjects || []), ...(personalProjects || []), ...(collaborationProjects || [])];
        const SIZE = 3; const GAP = 12;

        let els = []; let rds = []; let lts = []; let cars = []; let peds = [];

        // 1. GENERATE GRID COORDINATES
        let gridSlots = [];
        for(let x = -SIZE; x <= SIZE; x++) {
            for(let z = -SIZE; z <= SIZE; z++) {
                if(x === 0 && z === 0) continue;
                gridSlots.push([x * GAP, 0, z * GAP]);
            }
        }

        // 2. RANDOMIZE POSITIONS (Fisher-Yates Shuffle)
        for (let i = gridSlots.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gridSlots[i], gridSlots[j]] = [gridSlots[j], gridSlots[i]];
        }

        // 3. ASSIGN BUILDINGS
        let pIndex = 0;
        gridSlots.forEach((pos, i) => {
            const style = Math.floor(Math.random() * 3); // 0, 1, or 2

            if (pIndex < allProjects.length) {
                // Assign project
                els.push({
                    type: 'project',
                    project: allProjects[pIndex],
                    pos: pos,
                    height: 4 + Math.random()*3,
                    style: style
                });
                pIndex++;
            } else {
                // Filler building
                els.push({
                    type: 'filler',
                    pos: pos,
                    height: 3 + Math.random()*5,
                    style: style
                });
            }
        });

        // 4. INFRASTRUCTURE
        const gridLimit = (SIZE * GAP) + GAP/2;
        for(let i = -SIZE; i <= SIZE + 1; i++) {
            const offset = (i * GAP) - GAP/2;
            rds.push({ pos: [offset, 0.01, 0], rot: [0, 0, 0], length: gridLimit * 2 });
            rds.push({ pos: [0, 0.01, offset], rot: [0, Math.PI/2, 0], length: gridLimit * 2 });
            if(i !== SIZE + 1) {
                for(let j = -SIZE; j <= SIZE + 1; j++) {
                    lts.push({ pos: [offset - 1.5, 0, (j*GAP) - GAP/2 - 1.5] });
                }
            }
        }

        // 5. AGENTS
        for(let i=0; i<15; i++) {
            cars.push({ axis: 'x', startPos: [0, 0.25, (Math.floor(Math.random()*7)-3)*GAP - GAP/2], speed: 1 + Math.random(), color: '#ef4444' });
            cars.push({ axis: 'z', startPos: [(Math.floor(Math.random()*7)-3)*GAP - GAP/2, 0.25, 0], speed: 1 + Math.random(), color: '#eab308' });
        }
        for(let i=0; i<30; i++) {
            const isX = Math.random() > 0.5;
            const laneOffset = (Math.floor(Math.random()*7)-3)*GAP - GAP/2;
            const side = Math.random() > 0.5 ? 1.3 : -1.3;
            peds.push({
                axis: isX ? 'x' : 'z',
                startPos: isX ? [0, 0, laneOffset + side] : [laneOffset + side, 0, 0],
                color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'][Math.floor(Math.random()*4)]
            });
        }

        return { elements: els, traffic: cars, pedestrians: peds, roads: rds, lights: lts };
    }, []);

    const handleSelect = (p) => setSelectedProject(selectedProject?.title === p?.title ? null : p);

    return (
        <div className="h-[700px] w-full relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl transition-colors duration-500">
            <Canvas shadows className="transition-colors duration-500" style={{ background: isNight ? NIGHT_OPTS.sky : DAY_OPTS.sky }}>
                <Suspense fallback={null}>
                    <OrthographicCamera makeDefault position={[50, 50, 50]} zoom={15} near={-50} far={500} />
                    <ambientLight intensity={isNight ? 0.2 : 0.6} color={isNight ? "#1e293b" : "#fff"} />
                    <directionalLight position={[20, 50, 10]} intensity={isNight ? 0.2 : 1.5} castShadow shadow-mapSize={[2048, 2048]}>
                        <orthographicCamera attach="shadow-camera" args={[-100, 100, 100, -100]} />
                    </directionalLight>

                    {/* Infinite Floor & Fog */}
                    <fog attach="fog" args={[isNight ? NIGHT_OPTS.sky : DAY_OPTS.sky, 50, 200]} />
                    <color attach="background" args={[isNight ? NIGHT_OPTS.sky : DAY_OPTS.sky]} />

                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                        <planeGeometry args={[1000, 1000]} />
                        <meshStandardMaterial color={isNight ? NIGHT_OPTS.ground : DAY_OPTS.ground} />
                    </mesh>

                    {roads.map((r, i) => <Road key={i} position={r.pos} rotation={r.rot} length={r.length} isNight={isNight} />)}
                    {lights.map((l, i) => <TrafficLight key={i} position={l.pos} state={trafficState} />)}

                    {elements.map((item, i) => (
                        <MultiStyleBuilding
                            key={i} position={item.pos} height={item.height} isProject={item.type === 'project'}
                            project={item.project} isNight={isNight} activeFilter={activeFilter}
                            styleVariant={item.style}
                            isSelected={selectedProject && item.project && selectedProject.title === item.project.title}
                            onClick={handleSelect}
                        />
                    ))}

                    {traffic.map((car, i) => (
                        <Car key={i} {...car} isNight={isNight} trafficState={trafficState} />
                    ))}
                    {pedestrians.map((ped, i) => <Pedestrian key={i} {...ped} />)}

                    <SoftShadows size={40} samples={10} focus={1} />
                </Suspense>
                <OrbitControls enableRotate={true} enableZoom={true} zoomSpeed={0.5} minZoom={10} maxZoom={40} maxPolarAngle={Math.PI/2.2} />
            </Canvas>

            <Loader />

            {/* --- TOP RIGHT FLOATING FILTER --- */}
            <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-2">
                {[
                    { id: 'all', icon: FaLayerGroup, label: 'All', color: 'text-gray-500' },
                    { id: 'android', icon: FaAndroid, label: 'Android', color: 'text-green-500' },
                    { id: 'web', icon: FaGlobe, label: 'Web', color: 'text-blue-500' },
                    { id: 'system', icon: FaDesktop, label: 'System', color: 'text-purple-500' },
                ].map((btn) => (
                    <button
                        key={btn.id}
                        onClick={() => setActiveFilter(btn.id)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg backdrop-blur-md border
                            ${activeFilter === btn.id
                            ? `bg-white dark:bg-slate-800 scale-105 border-${btn.color.split('-')[1]}-500 ${btn.color}`
                            : "bg-white/80 dark:bg-slate-900/80 border-transparent opacity-70 hover:opacity-100 hover:scale-105 text-gray-600 dark:text-gray-300"}
                        `}
                    >
                        <btn.icon className="text-lg" />
                        <span className="hidden sm:inline">{btn.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}