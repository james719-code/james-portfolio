"use client";

import { useMemo, useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, SoftShadows, OrthographicCamera, Cloud } from '@react-three/drei';
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
import { SCENE_CONFIG } from '@/data/cityConfig';

import Island from '@/components/3d/Island';
import ForcefieldDome from '@/components/3d/Dome';
import { TwinklingStars, ConstellationLines } from '@/components/3d/Stars';
import Fireflies from '@/components/3d/Fireflies';
import Campfire from '@/components/3d/Campfire';
import Cottage from '@/components/3d/Cottage';
import StoneMonolith from '@/components/3d/Monolith';
import WebGLErrorBoundary from '@/components/3d/WebGLErrorBoundary';
import { ProjectModal, CertificateModal } from '@/components/3d/Modals';

function LoadingFallback() {
    return (
        <div className="h-full w-full flex items-center justify-center bg-slate-900">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400 text-sm">Loading 3D Scene...</p>
            </div>
        </div>
    );
}

export default function VillageMap() {
    const { theme, setTheme } = useTheme();
    const [isNight, setIsNight] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedCert, setSelectedCert] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const currentTheme = theme === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : theme;
        setIsNight(currentTheme === 'dark');

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);

        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(motionQuery.matches);
        const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
        motionQuery.addEventListener('change', handleMotionChange);

        return () => {
            window.removeEventListener('resize', handleResize);
            motionQuery.removeEventListener('change', handleMotionChange);
        };
    }, [theme]);

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

    const { buildings, monoliths } = useMemo(() => {
        const safeCommissioned = Array.isArray(commissionedProjects) ? commissionedProjects : [];
        const safeSchool = Array.isArray(schoolProjects) ? schoolProjects : [];
        const safePersonal = Array.isArray(personalProjects) ? personalProjects : [];
        const safeCollab = Array.isArray(collaborationProjects) ? collaborationProjects : [];
        const safeCerts = Array.isArray(certificates) ? certificates : [];

        const allProjects = [...safeCommissioned, ...safeSchool, ...safePersonal, ...safeCollab].filter(p => p && p.title);

        const _buildings = [];
        const _monoliths = [];

        if (allProjects.length > 0) {
            allProjects.forEach((proj, i) => {
                const angle = (i / allProjects.length) * Math.PI * 2;
                _buildings.push({
                    project: proj,
                    pos: [
                        Math.cos(angle) * SCENE_CONFIG.projectRadius,
                        0,
                        Math.sin(angle) * SCENE_CONFIG.projectRadius
                    ],
                });
            });
        }

        if (safeCerts.length > 0) {
            safeCerts.forEach((cert, i) => {
                const angle = (i / safeCerts.length) * Math.PI * 2 + 0.5;
                _monoliths.push({
                    cert: cert,
                    pos: [
                        Math.cos(angle) * SCENE_CONFIG.certRadius,
                        0,
                        Math.sin(angle) * SCENE_CONFIG.certRadius
                    ],
                });
            });
        }

        return { buildings: _buildings, monoliths: _monoliths };
    }, []);

    const closeAllModals = useCallback(() => {
        setSelectedProject(null);
        setSelectedCert(null);
    }, []);

    const fireflyCount = isMobile
        ? SCENE_CONFIG.particles.fireflyCountMobile
        : SCENE_CONFIG.particles.fireflyCountDesktop;

    if (!isClient) {
        return <LoadingFallback />;
    }

    return (
        <div className="h-full w-full relative overflow-hidden bg-black transition-all duration-300">
            <WebGLErrorBoundary>
                <Canvas
                    shadows
                    dpr={[1, isMobile ? 1.5 : 2]}
                    onCreated={({ gl }) => gl.setClearColor(new THREE.Color('#000000'))}
                    className="transition-colors duration-1000"
                    aria-label="3D Portfolio Village - Interactive scene showing projects and certificates"
                >
                    <Suspense fallback={null}>
                        <OrthographicCamera
                            makeDefault
                            position={SCENE_CONFIG.camera.position}
                            zoom={isMobile ? SCENE_CONFIG.camera.zoomMobile : SCENE_CONFIG.camera.zoomDesktop}
                            near={0.1}
                            far={1000}
                        />

                        <hemisphereLight
                            intensity={isNight ? 0.2 : 0.8}
                            color={isNight ? "#4c1d95" : "#bae6fd"}
                            groundColor="#000000"
                        />

                        <directionalLight
                            position={isNight ? [-20, 10, -20] : [20, 50, 20]}
                            intensity={isNight ? 0.5 : 1.5}
                            castShadow
                            shadow-mapSize={[SCENE_CONFIG.shadows.mapSize, SCENE_CONFIG.shadows.mapSize]}
                            color={isNight ? "#c7d2fe" : "#fff7ed"}
                        >
                            <orthographicCamera attach="shadow-camera" args={[-50, 50, 50, -50]} />
                        </directionalLight>

                        {isNight && (
                            <>
                                <TwinklingStars />
                                <ConstellationLines />
                            </>
                        )}

                        <Island isNight={isNight} />
                        <ForcefieldDome isNight={isNight} />

                        {!prefersReducedMotion && (
                            <Fireflies count={fireflyCount} isNight={isNight} />
                        )}

                        {!isNight && (
                            <group>
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

                        <SoftShadows size={25} samples={8} focus={0.5} />
                    </Suspense>

                    <OrbitControls
                        enableZoom={true}
                        minZoom={10}
                        maxZoom={50}
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 2.2}
                        autoRotate={!prefersReducedMotion && !selectedProject && !selectedCert}
                        autoRotateSpeed={0.5}
                        enableDamping
                    />
                </Canvas>
            </WebGLErrorBoundary>

            <div className="absolute top-4 right-4 z-20">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setTheme(isNight ? 'light' : 'dark');
                    }}
                    className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-md border bg-white/10 hover:bg-white/30 text-white text-lg md:text-2xl transition-all shadow-xl"
                    aria-label={isNight ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {isNight ? <FaMoon className="text-blue-300" /> : <FaSun className="text-amber-400" />}
                </button>
            </div>

            <ProjectModal
                project={selectedProject}
                isNight={isNight}
                onClose={closeAllModals}
            />

            <CertificateModal
                cert={selectedCert}
                isNight={isNight}
                onClose={closeAllModals}
            />
        </div>
    );
}
