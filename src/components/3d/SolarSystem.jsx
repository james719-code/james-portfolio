"use client";

import { useMemo, useState, useEffect, Suspense, useCallback, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    OrbitControls,
    PerspectiveCamera,
    Sparkles,
    Text,
    Billboard,
    useCursor,
    Stars,
    Trail
} from '@react-three/drei';
import { useTheme } from "next-themes";
import * as THREE from 'three';
import { FaMoon, FaSun } from 'react-icons/fa';

import {
    commissionedProjects,
    schoolProjects,
    personalProjects,
    collaborationProjects,
    certificates
} from '@/data/portfolioData';
import { getProjectType } from '@/data/cityConfig';

import WebGLErrorBoundary from '@/components/3d/WebGLErrorBoundary';
import { ProjectModal, CertificateModal } from '@/components/3d/Modals';

// Planet colors based on project type
const PLANET_THEMES = {
    android: {
        color: "#4ade80",
        emissive: "#22c55e",
        ring: true,
        ringColor: "#86efac"
    },
    web: {
        color: "#60a5fa",
        emissive: "#3b82f6",
        ring: false,
        atmosphere: "#93c5fd"
    },
    system: {
        color: "#f97316",
        emissive: "#ea580c",
        ring: false,
        atmosphere: "#fdba74"
    },
    default: {
        color: "#a78bfa",
        emissive: "#8b5cf6",
        ring: false,
        atmosphere: "#c4b5fd"
    }
};

// Beautiful planet colors for variety
const PLANET_COLORS = [
    { surface: "#60a5fa", atmosphere: "#93c5fd", emissive: "#3b82f6" },  // Blue - Earth-like
    { surface: "#f97316", atmosphere: "#fdba74", emissive: "#ea580c" },  // Orange - Mars-like
    { surface: "#a78bfa", atmosphere: "#c4b5fd", emissive: "#8b5cf6" },  // Purple - Gas giant
    { surface: "#4ade80", atmosphere: "#86efac", emissive: "#22c55e" },  // Green - Habitable
    { surface: "#f472b6", atmosphere: "#f9a8d4", emissive: "#ec4899" },  // Pink - Exotic
    { surface: "#fbbf24", atmosphere: "#fde047", emissive: "#f59e0b" },  // Gold - Desert
    { surface: "#2dd4bf", atmosphere: "#5eead4", emissive: "#14b8a6" },  // Teal - Ocean
    { surface: "#fb7185", atmosphere: "#fda4af", emissive: "#f43f5e" },  // Rose - Volcanic
    { surface: "#38bdf8", atmosphere: "#7dd3fc", emissive: "#0ea5e9" },  // Sky - Ice
    { surface: "#c084fc", atmosphere: "#d8b4fe", emissive: "#a855f7" },  // Violet - Mystical
    { surface: "#34d399", atmosphere: "#6ee7b7", emissive: "#10b981" },  // Emerald - Forest
    { surface: "#fb923c", atmosphere: "#fdba74", emissive: "#f97316" },  // Amber - Molten
];

// Central Sun component
function Sun() {
    const sunRef = useRef();
    const glowRef = useRef();
    const coronaRef = useRef();

    useFrame((state) => {
        if (sunRef.current) {
            sunRef.current.rotation.y = state.clock.elapsedTime * 0.1;
        }
        if (glowRef.current) {
            glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
        }
        if (coronaRef.current) {
            coronaRef.current.rotation.z = state.clock.elapsedTime * 0.05;
            coronaRef.current.rotation.x = state.clock.elapsedTime * 0.03;
        }
    });

    return (
        <group>
            <mesh ref={coronaRef}>
                <sphereGeometry args={[2.2, 32, 32]} />
                <meshBasicMaterial color="#fef3c7" transparent opacity={0.1} side={THREE.BackSide} />
            </mesh>

            <mesh ref={glowRef}>
                <sphereGeometry args={[1.8, 32, 32]} />
                <meshBasicMaterial color="#fcd34d" transparent opacity={0.2} />
            </mesh>

            <mesh ref={sunRef}>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={2} roughness={0.3} />
            </mesh>

            <mesh>
                <sphereGeometry args={[1.2, 32, 32]} />
                <meshBasicMaterial color="#fef3c7" />
            </mesh>

            <pointLight intensity={100} distance={60} color="#fcd34d" decay={2} />

            <Sparkles count={30} scale={5} size={4} speed={0.3} color="#fde047" />

            <Billboard position={[0, 2.5, 0]}>
                <Text fontSize={0.4} color="#fef3c7" anchorY="middle">
                    PORTFOLIO
                </Text>
            </Billboard>
        </group>
    );
}

// Orbital ring/path visualization
function OrbitRing({ radius }) {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
            <meshBasicMaterial
                color="#475569"
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

// Planet component (represents a project)
function Planet({
    project,
    orbitRadius,
    orbitSpeed,
    size,
    colorIndex,
    onClick,
    isSelected,
    initialAngle,
    moons = [],
    onMoonClick,
    selectedCert
}) {
    const [hovered, setHover] = useState(false);
    const groupRef = useRef();
    const planetRef = useRef();
    const atmosphereRef = useRef();

    const colors = PLANET_COLORS[colorIndex % PLANET_COLORS.length];
    const hasRing = colorIndex % 4 === 0; // Every 4th planet has rings

    useCursor(hovered);

    useFrame((state) => {
        if (groupRef.current) {
            // Orbit around the sun
            const angle = state.clock.elapsedTime * orbitSpeed + initialAngle;
            groupRef.current.position.x = Math.cos(angle) * orbitRadius;
            groupRef.current.position.z = Math.sin(angle) * orbitRadius;
            // Slight vertical movement
            groupRef.current.position.y = Math.sin(angle * 2) * 0.3;
        }

        if (planetRef.current) {
            // Planet rotation
            planetRef.current.rotation.y += 0.01;
            // Scale on hover
            const targetScale = hovered || isSelected ? 1.3 : 1;
            planetRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }

        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y -= 0.005;
        }
    });

    return (
        <group ref={groupRef}>
            <group
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(project);
                }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                {/* Atmosphere glow */}
                <mesh ref={atmosphereRef}>
                    <sphereGeometry args={[size + 0.15, 32, 32]} />
                    <meshBasicMaterial
                        color={colors.atmosphere}
                        transparent
                        opacity={hovered || isSelected ? 0.4 : 0.15}
                        side={THREE.BackSide}
                    />
                </mesh>

                {/* Main planet */}
                <mesh ref={planetRef} castShadow>
                    <sphereGeometry args={[size, 32, 32]} />
                    <meshStandardMaterial
                        color={colors.surface}
                        emissive={colors.emissive}
                        emissiveIntensity={hovered || isSelected ? 0.5 : 0.2}
                        roughness={0.6}
                        metalness={0.2}
                    />
                </mesh>

                {/* Ring system for some planets */}
                {hasRing && (
                    <mesh rotation={[Math.PI / 3, 0, 0]}>
                        <ringGeometry args={[size + 0.3, size + 0.6, 64]} />
                        <meshBasicMaterial
                            color={colors.atmosphere}
                            transparent
                            opacity={0.5}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                )}

                {/* Point light for visibility */}
                <pointLight
                    intensity={hovered || isSelected ? 3 : 1}
                    distance={3}
                    color={colors.surface}
                    decay={2}
                />

                {/* Label on hover */}
                {(hovered || isSelected) && (
                    <Billboard position={[0, size + 1, 0]}>
                        <group>
                            {/* Background */}
                            <mesh position={[0, 0, -0.01]}>
                                <planeGeometry args={[3, 0.6]} />
                                <meshBasicMaterial
                                    color="#0f172a"
                                    transparent
                                    opacity={0.9}
                                />
                            </mesh>
                            {/* Border */}
                            <mesh position={[0, 0, -0.02]}>
                                <planeGeometry args={[3.1, 0.7]} />
                                <meshBasicMaterial color={colors.surface} />
                            </mesh>
                            {/* Text */}
                            <Text
                                fontSize={0.25}
                                color="#ffffff"
                                anchorY="middle"
                                maxWidth={2.8}
                                textAlign="center"
                            >
                                {project.title}
                            </Text>
                        </group>
                    </Billboard>
                )}

                {/* Moons orbiting this planet */}
                {moons.map((moon, i) => (
                    <PlanetMoon
                        key={i}
                        cert={moon.cert}
                        orbitRadius={size + 0.8 + i * 0.3}
                        orbitSpeed={1.5 + i * 0.3}
                        index={i}
                        onClick={onMoonClick}
                        isSelected={selectedCert?.title === moon.cert?.title}
                    />
                ))}
            </group>
        </group>
    );
}

// Moon component that orbits a planet (represents a certificate)
function PlanetMoon({ cert, orbitRadius, orbitSpeed, index, onClick, isSelected }) {
    const [hovered, setHover] = useState(false);
    const moonRef = useRef();

    useCursor(hovered);

    useFrame((state) => {
        if (moonRef.current) {
            // Orbit around parent position (0,0,0 in local space)
            const angle = state.clock.elapsedTime * orbitSpeed + index * Math.PI * 0.7;
            moonRef.current.position.x = Math.cos(angle) * orbitRadius;
            moonRef.current.position.z = Math.sin(angle) * orbitRadius;
            moonRef.current.position.y = Math.sin(angle * 2) * 0.15;

            const targetScale = hovered || isSelected ? 1.5 : 1;
            moonRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }
    });

    if (!cert) return null;

    return (
        <group
            ref={moonRef}
            onClick={(e) => {
                e.stopPropagation();
                onClick(cert);
            }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            {/* Moon sphere */}
            <mesh>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial
                    color="#fbbf24"
                    emissive="#f59e0b"
                    emissiveIntensity={0.6}
                    roughness={0.4}
                />
            </mesh>

            {/* Glow */}
            <mesh>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial
                    color="#fde047"
                    transparent
                    opacity={0.3}
                />
            </mesh>

            {/* Label */}
            {(hovered || isSelected) && (
                <Billboard position={[0, 0.5, 0]}>
                    <Text
                        fontSize={0.12}
                        color="#fbbf24"
                        outlineWidth={0.02}
                        outlineColor="#000000"
                        maxWidth={1.5}
                        textAlign="center"
                    >
                        {cert.title}
                    </Text>
                </Billboard>
            )}
        </group>
    );
}

// Asteroid belt (decorative)
function AsteroidBelt({ innerRadius, outerRadius }) {
    const asteroids = useMemo(() => {
        const count = 100;
        return Array.from({ length: count }).map((_, i) => {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
            const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
            return {
                position: [
                    Math.cos(angle) * radius,
                    (Math.random() - 0.5) * 0.5,
                    Math.sin(angle) * radius
                ],
                size: 0.03 + Math.random() * 0.05,
                speed: 0.1 + Math.random() * 0.1
            };
        });
    }, [innerRadius, outerRadius]);

    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
        }
    });

    return (
        <group ref={groupRef}>
            {asteroids.map((asteroid, i) => (
                <mesh key={i} position={asteroid.position}>
                    <sphereGeometry args={[asteroid.size, 4, 4]} />
                    <meshStandardMaterial color="#6b7280" roughness={0.9} />
                </mesh>
            ))}
        </group>
    );
}

function LoadingScreen() {
    return (
        <div className="h-full w-full flex items-center justify-center bg-black">
            <div className="flex flex-col items-center justify-center">
                <div className="relative w-48 h-48 mb-8">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 shadow-[0_0_60px_rgba(251,191,36,0.6)] animate-pulse" />

                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
                    </div>

                    <div className="absolute inset-6 animate-spin" style={{ animationDuration: '3s' }}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                    </div>

                    <div className="absolute inset-12 animate-spin" style={{ animationDuration: '2s' }}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-orange-400 shadow-lg shadow-orange-400/50" />
                    </div>

                    <div className="absolute inset-0 rounded-full border border-white/20" />
                    <div className="absolute inset-6 rounded-full border border-white/15" />
                    <div className="absolute inset-12 rounded-full border border-white/10" />
                </div>

                <h2 className="text-white/90 text-xl font-light tracking-[0.4em] uppercase mb-2">Portfolio</h2>
                <p className="text-yellow-400/70 text-sm tracking-wider">Launching Solar System</p>
            </div>
        </div>
    );
}

export default function SolarSystem() {
    const { theme, setTheme } = useTheme();
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedCert, setSelectedCert] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedProject(null);
                setSelectedCert(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Arrange projects as planets in orbital rings
    const { planets, orbitRadii } = useMemo(() => {
        const safeCommissioned = Array.isArray(commissionedProjects) ? commissionedProjects : [];
        const safeSchool = Array.isArray(schoolProjects) ? schoolProjects : [];
        const safePersonal = Array.isArray(personalProjects) ? personalProjects : [];
        const safeCollab = Array.isArray(collaborationProjects) ? collaborationProjects : [];
        const safeCerts = Array.isArray(certificates) ? certificates : [];

        const allProjects = [...safeCommissioned, ...safeSchool, ...safePersonal, ...safeCollab].filter(p => p && p.title);

        const _planets = allProjects.map((proj, i) => {
            const orbitRadius = 5 + i * 2.5; // Each planet further out
            const orbitSpeed = 0.15 - i * 0.01; // Further planets orbit slower
            const size = 0.4 + Math.random() * 0.3; // Varied sizes
            const initialAngle = (i / allProjects.length) * Math.PI * 2;

            return {
                project: proj,
                orbitRadius,
                orbitSpeed: Math.max(orbitSpeed, 0.02),
                size,
                colorIndex: i,
                initialAngle
            };
        });

        const _radii = _planets.map(p => p.orbitRadius);

        // Assign certificates as moons to specific planets
        // Distribute moons among the first few planets
        safeCerts.forEach((cert, i) => {
            const planetIndex = i % Math.min(_planets.length, 4); // Distribute among first 4 planets
            if (_planets[planetIndex]) {
                if (!_planets[planetIndex].moons) {
                    _planets[planetIndex].moons = [];
                }
                _planets[planetIndex].moons.push({ cert, index: i });
            }
        });

        return { planets: _planets, orbitRadii: _radii };
    }, []);

    const closeAllModals = useCallback(() => {
        setSelectedProject(null);
        setSelectedCert(null);
    }, []);

    if (!isClient) {
        return <LoadingScreen />;
    }

    return (
        <div className="h-full w-full relative overflow-hidden bg-black">
            <WebGLErrorBoundary>
                <Canvas
                    dpr={[1, isMobile ? 1.5 : 2]}
                    gl={{ antialias: true, powerPreference: "high-performance" }}
                    camera={{ position: [0, 15, 25], fov: 50 }}
                >
                    <Suspense fallback={null}>
                        {/* Deep space background */}
                        <color attach="background" args={['#030712']} />

                        {/* Star field */}
                        <Stars
                            radius={100}
                            depth={50}
                            count={isMobile ? 2000 : 5000}
                            factor={4}
                            saturation={0.5}
                            fade
                            speed={0.5}
                        />

                        {/* Ambient space light */}
                        <ambientLight intensity={0.1} color="#4c1d95" />

                        {/* Central Sun */}
                        <Sun />

                        {/* Orbit rings */}
                        {orbitRadii.map((radius, i) => (
                            <OrbitRing key={i} radius={radius} />
                        ))}

                        {/* Asteroid belt between inner and outer planets */}
                        {planets.length > 4 && (
                            <AsteroidBelt
                                innerRadius={planets[2]?.orbitRadius + 1 || 10}
                                outerRadius={planets[3]?.orbitRadius - 1 || 12}
                            />
                        )}

                        {/* Planets (projects) with their moons */}
                        {planets.map((planet, i) => (
                            <Planet
                                key={i}
                                project={planet.project}
                                orbitRadius={planet.orbitRadius}
                                orbitSpeed={planet.orbitSpeed}
                                size={planet.size}
                                colorIndex={planet.colorIndex}
                                initialAngle={planet.initialAngle}
                                onClick={setSelectedProject}
                                isSelected={selectedProject?.title === planet.project?.title}
                                moons={planet.moons || []}
                                onMoonClick={setSelectedCert}
                                selectedCert={selectedCert}
                            />
                        ))}

                        {/* Distant nebula glow */}
                        <Sparkles
                            count={isMobile ? 30 : 80}
                            scale={50}
                            size={3}
                            speed={0.1}
                            color="#8b5cf6"
                            opacity={0.3}
                        />
                    </Suspense>

                    <OrbitControls
                        enableZoom={true}
                        minDistance={8}
                        maxDistance={60}
                        minPolarAngle={0.3}
                        maxPolarAngle={Math.PI / 2}
                        autoRotate
                        autoRotateSpeed={0.1}
                        enableDamping
                        dampingFactor={0.05}
                        target={[0, 0, 0]}
                    />
                </Canvas>
            </WebGLErrorBoundary>

            {/* Title */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
                <div className="px-8 py-3 rounded-full bg-black/50 backdrop-blur-xl border border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
                    <h1 className="text-lg md:text-xl font-light tracking-[0.3em] uppercase text-yellow-100">
                        ☀️ Solar System
                    </h1>
                </div>
            </div>

            {/* Legend */}
            <div className="absolute top-6 right-6 z-20">
                <div className="px-4 py-3 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 text-xs text-white/70">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-blue-400" />
                        <span>Planets = Projects</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <span>Moons = Certificates</span>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                <div className="px-6 py-2 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 text-sm text-white/60">
                    Click planets to explore • Drag to orbit • Scroll to zoom
                </div>
            </div>

            {/* Stats */}
            <div className="absolute bottom-6 right-6 z-20">
                <div className="px-4 py-2 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 text-xs text-white/60">
                    <span className="text-yellow-400 font-bold">{planets.length}</span> Planets •
                    <span className="text-yellow-400 font-bold ml-1">{planets.reduce((sum, p) => sum + (p.moons?.length || 0), 0)}</span> Moons
                </div>
            </div>

            {/* Modals */}
            <ProjectModal
                project={selectedProject}
                isNight={true}
                onClose={closeAllModals}
            />

            <CertificateModal
                cert={selectedCert}
                isNight={true}
                onClose={closeAllModals}
            />
        </div>
    );
}
