"use client";

import { useMemo, useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    OrbitControls, Text, Html, SoftShadows, OrthographicCamera,
    Float, Billboard, Cloud, useCursor, Sparkles, Line, Sphere, MeshTransmissionMaterial
} from '@react-three/drei';
import { useTheme } from "next-themes";
import * as THREE from 'three';
import {
    FaTimes, FaMoon, FaSun, FaAward, FaBuilding, FaExternalLinkAlt, FaGithub, FaCalendarAlt
} from 'react-icons/fa';

import {
    commissionedProjects,
    schoolProjects,
    personalProjects,
    collaborationProjects,
    certificates
} from '@/data/portfolioData';

// --- PALETTE ---
const VILLAGE_COLORS = {
    day: {
        grass: "#86efac",
        path: "#d6d3d1",
        wood: "#92400e",
        leaves: "#15803d",
        text: "#0f172a",
        dome: "#bae6fd" // Light Blue tint
    },
    night: {
        grass: "#1e293b",
        path: "#334155",
        wood: "#475569",
        leaves: "#0f172a",
        text: "#e2e8f0",
        dome: "#4c1d95" // Deep Purple tint
    }
};

const TYPE_COLORS = {
    android: "#34d399",
    web: "#60a5fa",
    system: "#a78bfa",
    cert: "#fbbf24"
};

const getProjectType = (project) => {
    if (!project) return "web";
    const tools = project.versions?.[0]?.tools?.join(" ").toLowerCase() || "";
    if (tools.includes("android") || tools.includes("kotlin")) return "android";
    if (tools.includes("react") || tools.includes("web") || tools.includes("next")) return "web";
    return "system";
};

// --- 3D COMPONENTS ---

// 1. FLOATING ISLAND GEOMETRY
function FloatingIsland({ isNight }) {
    const colors = isNight ? VILLAGE_COLORS.night : VILLAGE_COLORS.day;

    return (
        <group position={[0, -2, 0]}>
            <mesh position={[0, 0, 0]} receiveShadow>
                <cylinderGeometry args={[21.5, 19, 1, 64]} />
                <meshStandardMaterial color={colors.grass} roughness={1} />
            </mesh>

            <mesh position={[0, 0.51, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <ringGeometry args={[8, 12, 64]} />
                <meshStandardMaterial color={colors.path} roughness={1} />
            </mesh>

            <mesh position={[0, -4, 0]}>
                <cylinderGeometry args={[19, 5, 8, 32]} />
                <meshStandardMaterial color={isNight ? "#2d2a26" : "#5d4037"} roughness={1} />
            </mesh>

            <mesh position={[0, -9, 0]}>
                <coneGeometry args={[5, 4, 32]} />
                <meshStandardMaterial color={isNight ? "#1c1917" : "#43302b"} roughness={1} />
            </mesh>
        </group>
    );
}

//THE DOME
function ForcefieldDome({ isNight }) {
    return (
        <mesh position={[0, -1, 0]}>
            <sphereGeometry args={[22, 64, 64]} />
            <MeshTransmissionMaterial
                backside
                backsideThickness={0.1}
                thickness={0.5}
                roughness={0}
                transmission={0.9}
                ior={1.2}
                chromaticAberration={0.02}
                anisotropy={0.1}
                color={isNight ? "#6d28d9" : "#a5f3fc"}
                emissive={isNight ? "#4c1d95" : "#bae6fd"}
                emissiveIntensity={0.1}
            />
        </mesh>
    );
}

function TwinklingStars({ isNight }) {
    const ref = useRef();
    const count = 4000;
    const radius = 300;

    const [positions, randoms] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const rnds = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = radius * Math.cos(phi);
            rnds[i] = Math.random();
        }
        return [pos, rnds];
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.rotation.y = t * 0.01;
        const sizes = ref.current.geometry.attributes.size.array;
        for (let i = 0; i < count; i++) {
            sizes[i] = 2 + Math.sin(t * (1 + randoms[i] * 2) + randoms[i] * 10) * 1.5;
        }
        ref.current.geometry.attributes.size.needsUpdate = true;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-size" count={count} array={new Float32Array(count).fill(2)} itemSize={1} />
            </bufferGeometry>
            <pointsMaterial size={3} sizeAttenuation={false} color="white" transparent opacity={0.9} fog={false} />
        </points>
    );
}

function ConstellationLines() {
    const linesRef = useRef();
    const [linePositions, lineColors] = useMemo(() => {
        const starCount = 80;
        const radius = 290;
        const maxDistance = 60;

        const stars = [];
        for (let i = 0; i < starCount; i++) {
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            stars.push(new THREE.Vector3(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            ));
        }

        const positions = [];
        const colors = [];
        const baseColor = new THREE.Color("#81d4fa");

        for (let i = 0; i < starCount; i++) {
            for (let j = i + 1; j < starCount; j++) {
                if (stars[i].distanceTo(stars[j]) < maxDistance) {
                    positions.push(stars[i].x, stars[i].y, stars[i].z);
                    positions.push(stars[j].x, stars[j].y, stars[j].z);
                    colors.push(baseColor.r, baseColor.g, baseColor.b);
                    colors.push(baseColor.r, baseColor.g, baseColor.b);
                }
            }
        }
        return [new Float32Array(positions), new Float32Array(colors)];
    }, []);

    useFrame((state) => {
        if (linesRef.current) {
            linesRef.current.rotation.y = state.clock.elapsedTime * 0.01;
            const opacity = 0.1 + (Math.sin(state.clock.elapsedTime * 0.5) * 0.5 + 0.5) * 0.2;
            linesRef.current.material.opacity = opacity;
        }
    });

    if (linePositions.length === 0) return null;

    return (
        <lineSegments ref={linesRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={lineColors.length / 3} array={lineColors} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial vertexColors transparent opacity={0.2} fog={false} depthWrite={false} />
        </lineSegments>
    );
}

function Fireflies({ count = 15, isNight }) {
    const ref = useRef();
    const particles = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            speed: 0.5 + Math.random(),
            x: (Math.random() - 0.5) * 20,
            z: (Math.random() - 0.5) * 20,
            yOffset: Math.random() * 3,
            phase: Math.random() * Math.PI
        }));
    }, [count]);

    useFrame((state) => {
        if (!isNight || !ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.children.forEach((child, i) => {
            const p = particles[i];
            child.position.x = p.x + Math.sin(t * p.speed + p.phase) * 2;
            child.position.z = p.z + Math.cos(t * p.speed * 0.8 + p.phase) * 2;
            child.position.y = 1.5 + Math.sin(t * 1.5 + p.phase) + p.yOffset;
            child.scale.setScalar(0.1 + Math.sin(t * 5 + p.phase) * 0.05);
        });
    });

    if (!isNight) return null;
    return (
        <group ref={ref}>
            {particles.map((_, i) => (
                <mesh key={i}><sphereGeometry args={[1, 8, 8]} /><meshBasicMaterial color={i % 2 === 0 ? "#fde047" : "#bef264"} /></mesh>
            ))}
        </group>
    );
}

// IMPROVED COTTAGE
function Cottage({ position, project, onClick, isSelected, isNight }) {
    const type = getProjectType(project);
    const color = TYPE_COLORS[type] || TYPE_COLORS.web;
    const [hovered, setHover] = useState(false);
    const ref = useRef();
    const lightRef = useRef();

    useCursor(hovered);

    useFrame((state) => {
        if (ref.current) {
            const targetScale = hovered || isSelected ? 1.2 : 1;
            ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
            if (isSelected) ref.current.rotation.y += 0.01;
            else ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, 0, 0.1);
        }
        // Subtle flicker for house light
        if(isNight && lightRef.current) {
            // Increased base intensity from 2 to 6 for brighter light
            lightRef.current.intensity = 6 + Math.sin(state.clock.elapsedTime * 10 + position[0]) * 0.5;
        }
    });

    return (
        <group
            position={position}
            onClick={(e) => {
                e.stopPropagation();
                onClick(project);
            }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <group ref={ref}>
                <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1.4, 1.5, 1.4]} />
                    <meshStandardMaterial color={isNight ? "#94a3b8" : "#ffffff"} roughness={0.5} />
                </mesh>
                <mesh position={[0, 1.9, 0]} rotation={[0, Math.PI/4, 0]} castShadow>
                    <coneGeometry args={[1.3, 1.2, 4]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                <mesh position={[0, 0.5, 0.71]}>
                    <planeGeometry args={[0.5, 0.9]} />
                    <meshStandardMaterial color={isNight ? "#475569" : "#78350f"} />
                </mesh>

                {isNight && (
                    <>
                        {/* WARMER WINDOW LIGHT - Increased Intensity */}
                        <mesh position={[0, 1, 0.71]}><planeGeometry args={[0.4, 0.4]} /><meshBasicMaterial color="#ff9f43" /></mesh>
                        <pointLight ref={lightRef} position={[0.6, 0.8, 1]} intensity={6} distance={8} color="#ff9f43" decay={2} />
                    </>
                )}

                {(hovered || isSelected) && (
                    <Float speed={5} rotationIntensity={0} floatIntensity={0.2} position={[0, 3.5, 0]}>
                        <Billboard>
                            <Text fontSize={0.4} color={isNight ? "#ffffff" : "#0f172a"} outlineWidth={0.04} outlineColor="#000000" anchorY="bottom">
                                {project.title}
                            </Text>
                        </Billboard>
                    </Float>
                )}
            </group>
        </group>
    );
}

function StoneMonolith({ position, cert, onClick, isSelected, isNight }) {
    const [hovered, setHover] = useState(false);
    const ref = useRef();
    const crystalRef = useRef();

    useCursor(hovered);

    useFrame((state) => {
        if (ref.current) {
            const targetScale = hovered || isSelected ? 1.15 : 1;
            ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

            if (hovered || isSelected) {
                ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
            } else {
                ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, 0, 0.1);
            }
        }

        if (crystalRef.current) {
            crystalRef.current.position.y = 1.6 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
            crystalRef.current.rotation.y += 0.02;
            crystalRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
        }
    });

    if (!cert) return null;

    return (
        <group
            position={position}
            onClick={(e) => {
                e.stopPropagation();
                onClick(cert);
            }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <group ref={ref}>
                <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.7, 1.4, 0.3]} />
                    <meshStandardMaterial
                        color={isNight ? "#475569" : "#94a3b8"}
                        emissive={isNight ? "#0f172a" : "#000000"}
                        roughness={0.4}
                        metalness={0.2}
                    />
                </mesh>

                <group ref={crystalRef}>
                    <mesh>
                        <octahedronGeometry args={[0.15]} />
                        <meshBasicMaterial color={isNight ? "#67e8f9" : "#0ea5e9"} wireframe={true} />
                    </mesh>
                    <mesh>
                        <octahedronGeometry args={[0.1]} />
                        <meshBasicMaterial color={isNight ? "#cdfafa" : "#bae6fd"} />
                    </mesh>
                    {isNight && <pointLight distance={3} intensity={1.5} color="#06b6d4" decay={2} />}
                </group>

                <mesh position={[0, 0.9, 0.16]}>
                    <planeGeometry args={[0.5, 0.5]} />
                    <meshBasicMaterial color={TYPE_COLORS.cert} />
                </mesh>

                <Billboard position={[0, 2.2, 0]} visible={hovered || isSelected}>
                    <Text
                        fontSize={0.25}
                        color={isNight ? "#67e8f9" : "#fbbf24"}
                        outlineWidth={0.03}
                        outlineColor="#000000"
                        textAlign="center"
                    >
                        {cert.title}
                    </Text>
                </Billboard>
            </group>
        </group>
    );
}

function Campfire({ isNight }) {
    const lightRef = useRef();
    const flameGroup = useRef();

    const FlameLayer = ({ position, color, scale, speed, offset }) => {
        const meshRef = useRef();
        useFrame((state) => {
            if(!meshRef.current) return;
            const t = state.clock.elapsedTime;
            const scaleWobble = 1 + Math.sin(t * speed * 2 + offset) * 0.2;
            meshRef.current.scale.set(scale[0] * scaleWobble, scale[1] * scaleWobble, scale[0] * scaleWobble);
            meshRef.current.rotation.y += speed * 0.1;
            meshRef.current.position.y = position[1] + Math.sin(t * speed + offset) * 0.05;
        });

        return (
            <mesh ref={meshRef} position={position} rotation={[0, offset, 0]}>
                <dodecahedronGeometry args={[1, 0]} />
                <meshBasicMaterial color={color} transparent opacity={0.9} />
            </mesh>
        );
    };

    useFrame((state) => {
        if (lightRef.current && isNight) {
            lightRef.current.intensity = 8 + Math.random() * 2 + Math.sin(state.clock.elapsedTime * 10) * 0.5;
        }
    });

    return (
        <group position={[0, 0, 0]}>
            <group position={[0, 0.2, 0]} scale={[1.3, 1.3, 1.3]}>
                <mesh rotation={[0, 0, Math.PI / 2.2]} position={[0.3, 0, 0]} castShadow><cylinderGeometry args={[0.15, 0.15, 1.5, 6]} /><meshStandardMaterial color={isNight ? "#3f2c22" : "#5c4033"} roughness={0.9} /></mesh>
                <mesh rotation={[0, Math.PI / 1.5, Math.PI / 2.1]} position={[-0.2, 0, 0.3]} castShadow><cylinderGeometry args={[0.15, 0.15, 1.6, 6]} /><meshStandardMaterial color={isNight ? "#3f2c22" : "#5c4033"} roughness={0.9} /></mesh>
                <mesh rotation={[0, -Math.PI / 1.5, Math.PI / 2.3]} position={[-0.2, 0, -0.3]} castShadow><cylinderGeometry args={[0.15, 0.15, 1.5, 6]} /><meshStandardMaterial color={isNight ? "#3f2c22" : "#5c4033"} roughness={0.9} /></mesh>
            </group>

            {isNight && (
                <group ref={flameGroup} position={[0, 0.2, 0]}>
                    <FlameLayer position={[0, 0.3, 0]} color="#fff7ed" scale={[0.3, 0.3]} speed={3} offset={0} />
                    <FlameLayer position={[0, 0.6, 0]} color="#fde047" scale={[0.5, 0.8]} speed={2.5} offset={2} />
                    <FlameLayer position={[0, 0.7, 0]} color="#fb923c" scale={[0.6, 1.0]} speed={2} offset={4} />
                    {/* Changed top flame color from dark red to orange */}
                    <FlameLayer position={[0, 0.9, 0]} color="#ea580c" scale={[0.4, 1.2]} speed={1.5} offset={5} />
                    <Sparkles count={40} scale={4} size={3} speed={1.5} opacity={0.8} color="#fbbf24" position={[0, 1.5, 0]} />
                    {/* Increased fire light intensity and made it brighter orange */}
                    <pointLight ref={lightRef} position={[0, 1.5, 0]} intensity={8} distance={22} color="#ff7700" decay={1.5} castShadow />
                </group>
            )}

            <Html position={[0, 4, 0]} center zIndexRange={[0, 0]}>
                <div className={`
                    px-4 py-1.5 rounded-full backdrop-blur-md border shadow-lg text-sm font-bold tracking-widest select-none transition-all duration-500
                    ${isNight
                    ? "bg-orange-950/80 text-orange-200 border-orange-500/50 shadow-orange-500/20"
                    : "bg-white/80 text-slate-800 border-slate-200"}
                `}>
                    MY PORTFOLIO
                </div>
            </Html>
        </group>
    );
}

// --- MAIN SCENE ---
export default function VillageMap() {
    const { theme, setTheme } = useTheme();
    const [isNight, setIsNight] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedCert, setSelectedCert] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const currentTheme = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;
        setIsNight(currentTheme === 'dark');

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [theme]);

    const { buildings, monoliths } = useMemo(() => {
        const safeCommissioned = Array.isArray(commissionedProjects) ? commissionedProjects : [];
        const safeSchool = Array.isArray(schoolProjects) ? schoolProjects : [];
        const safePersonal = Array.isArray(personalProjects) ? personalProjects : [];
        const safeCollab = Array.isArray(collaborationProjects) ? collaborationProjects : [];
        const safeCerts = Array.isArray(certificates) ? certificates : [];

        const allProjects = [...safeCommissioned, ...safeSchool, ...safePersonal, ...safeCollab].filter(p => p && p.title);

        const _buildings = [];
        const _monoliths = [];
        const projRadius = 9;

        if (allProjects.length > 0) {
            allProjects.forEach((proj, i) => {
                const angle = (i / allProjects.length) * Math.PI * 2;
                _buildings.push({
                    project: proj,
                    pos: [Math.cos(angle) * projRadius, 0, Math.sin(angle) * projRadius],
                });
            });
        }

        const certRadius = 14;
        if (safeCerts.length > 0) {
            safeCerts.forEach((cert, i) => {
                const angle = (i / safeCerts.length) * Math.PI * 2 + 0.5;
                _monoliths.push({
                    cert: cert,
                    pos: [Math.cos(angle) * certRadius, 0, Math.sin(angle) * certRadius],
                });
            });
        }

        return { buildings: _buildings, monoliths: _monoliths };
    }, []);

    const colors = isNight ? VILLAGE_COLORS.night : VILLAGE_COLORS.day;
    const closeAllModals = () => { setSelectedProject(null); setSelectedCert(null); };

    if (!isClient) return <div className="h-full w-full rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />;

    return (
        <div className="h-full w-full relative overflow-hidden bg-black transition-all duration-300">
            <Canvas
                shadows
                dpr={[1, 2]}
                // Set background to black for that deep space feel
                onCreated={({ gl }) => gl.setClearColor(new THREE.Color('#000000'))}
                className="transition-colors duration-1000"
            >
                <Suspense fallback={null}>
                    <OrthographicCamera
                        makeDefault
                        position={[30, 30, 30]}
                        zoom={isMobile ? 12 : 25}
                        near={0.1}
                        far={1000}
                    />

                    <hemisphereLight intensity={isNight ? 0.2 : 0.8} color={isNight ? "#4c1d95" : "#bae6fd"} groundColor="#000000" />

                    <directionalLight
                        position={isNight ? [-20, 10, -20] : [20, 50, 20]}
                        intensity={isNight ? 0.5 : 1.5}
                        castShadow
                        shadow-mapSize={[2048, 2048]}
                        color={isNight ? "#c7d2fe" : "#fff7ed"}
                    >
                        <orthographicCamera attach="shadow-camera" args={[-50, 50, 50, -50]} />
                    </directionalLight>

                    <TwinklingStars isNight={true} /> {/* Always show stars in space */}
                    <ConstellationLines isNight={true} />

                    <FloatingIsland isNight={isNight} />
                    <ForcefieldDome isNight={isNight} />

                    <Fireflies count={isMobile ? 15 : 30} isNight={isNight} />

                    {!isNight && (
                        <group>
                            {/* Clouds inside the dome (approx radius 15-20) */}
                            <Cloud opacity={0.5} speed={0.1} width={15} depth={2} segments={10} position={[10, 10, -10]} color="white" />
                            <Cloud opacity={0.4} speed={0.06} width={10} depth={2} segments={8} position={[-10, 12, 5]} color="white" />
                        </group>
                    )}

                    <Campfire isNight={isNight} />

                    {buildings.map((b, i) => (
                        <Cottage
                            key={`b-${i}`}
                            position={b.pos}
                            project={b.project}
                            isNight={isNight}
                            onClick={setSelectedProject}
                            isSelected={selectedProject?.title === b.project?.title}
                        />
                    ))}

                    {monoliths.map((m, i) => (
                        <StoneMonolith
                            key={`m-${i}`}
                            position={m.pos}
                            cert={m.cert}
                            isNight={isNight}
                            onClick={setSelectedCert}
                            isSelected={selectedCert?.title === m.cert?.title}
                        />
                    ))}

                    <SoftShadows size={40} samples={12} focus={0.5} />
                </Suspense>

                <OrbitControls
                    enableZoom={true}
                    minZoom={10}
                    maxZoom={50}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2.2}
                    autoRotate={!selectedProject && !selectedCert}
                    autoRotateSpeed={0.5}
                    enableDamping
                />
            </Canvas>

            {/* --- UI OVERLAY --- */}
            <div className="absolute top-4 right-4 z-20">
                <button
                    onClick={(e) => { e.stopPropagation(); setTheme(isNight ? 'light' : 'dark'); }}
                    className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-md border bg-white/10 hover:bg-white/30 text-white text-lg md:text-2xl transition-all shadow-xl"
                >
                    {isNight ? <FaMoon className="text-blue-300" /> : <FaSun className="text-amber-400" />}
                </button>
            </div>

            {/* ================= PROJECT MODAL ================= */}
            {selectedProject && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300"
                    onClick={closeAllModals}
                >
                    <div
                        className={`
                            relative w-full max-w-lg rounded-2xl shadow-2xl p-6 border backdrop-blur-xl animate-in fade-in zoom-in duration-300 
                            ${isNight ? "bg-slate-900/95 border-slate-700 text-white" : "bg-white/95 border-slate-200 text-slate-800"}
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={closeAllModals} className="absolute top-4 right-4 p-2 hover:bg-gray-500/20 rounded-full transition-colors"><FaTimes /></button>

                        <div className="mb-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${isNight ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                {getProjectType(selectedProject)}
                            </span>
                            <h2 className="text-2xl font-bold mt-2 leading-tight">{selectedProject.title}</h2>
                        </div>

                        {selectedProject.bgImage && (
                            <div className="h-40 w-full rounded-xl bg-slate-200 mb-4 overflow-hidden shadow-inner">
                                <img src={selectedProject.bgImage} alt="Preview" className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" />
                            </div>
                        )}

                        <p className="text-sm opacity-90 mb-6 leading-relaxed">
                            {selectedProject.description}
                        </p>

                        <div className="flex gap-3">
                            {selectedProject.liveUrl && <a href={selectedProject.liveUrl} target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:scale-[1.02]"><FaExternalLinkAlt /> Live Demo</a>}
                            {selectedProject.githubUrl && <a href={selectedProject.githubUrl} target="_blank" className={`flex-1 flex items-center justify-center gap-2 border py-3 rounded-xl text-sm font-bold transition-all shadow-sm hover:scale-[1.02] ${isNight ? 'border-slate-600 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'}`}><FaGithub /> Code</a>}
                        </div>
                    </div>
                </div>
            )}

            {/* ================= CERTIFICATE MODAL ================= */}
            {selectedCert && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300"
                    onClick={closeAllModals}
                >
                    <div
                        className={`
                            relative w-full max-w-md rounded-2xl shadow-2xl p-6 border backdrop-blur-xl animate-in fade-in zoom-in duration-300 
                            ${isNight ? "bg-slate-900/95 border-amber-500/30 text-white" : "bg-white/95 border-amber-200 text-slate-800"}
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={closeAllModals} className="absolute top-4 right-4 p-2 hover:bg-gray-500/20 rounded-full transition-colors"><FaTimes /></button>

                        <div className="flex items-start gap-4 mb-6">
                            <div className={`p-4 rounded-full shadow-inner ${isNight ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                                <FaAward size={32} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold leading-tight">{selectedCert.title}</h2>
                                <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${isNight ? 'text-amber-400' : 'text-amber-600'}`}>Verified Certificate</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6 text-sm opacity-90 bg-gray-500/5 p-4 rounded-xl">
                            {selectedCert.issuer && (
                                <div className="flex items-center gap-3">
                                    <FaBuilding className="opacity-50 text-lg" />
                                    <span>Issued by: <strong>{selectedCert.issuer}</strong></span>
                                </div>
                            )}
                            {selectedCert.date && (
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt className="opacity-50 text-lg" />
                                    <span>Date: {selectedCert.date}</span>
                                </div>
                            )}
                        </div>

                        {selectedCert.link && (
                            <a href={selectedCert.link} target="_blank" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02]">
                                <FaExternalLinkAlt /> View Credential
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}