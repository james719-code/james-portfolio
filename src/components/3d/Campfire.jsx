"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Html } from '@react-three/drei';

function FlameLayer({ position, color, scale, speed, offset }) {
    const meshRef = useRef();

    useFrame((state) => {
        if (!meshRef.current) return;
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
}

export default function Campfire({ isNight }) {
    const lightRef = useRef();

    useFrame((state) => {
        if (lightRef.current && isNight) {
            lightRef.current.intensity = 8 + Math.random() * 2 + Math.sin(state.clock.elapsedTime * 10) * 0.5;
        }
    });

    return (
        <group position={[0, 0, 0]}>
            <group position={[0, 0.2, 0]} scale={[1.3, 1.3, 1.3]}>
                <mesh rotation={[0, 0, Math.PI / 2.2]} position={[0.3, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.15, 0.15, 1.5, 6]} />
                    <meshStandardMaterial color={isNight ? "#3f2c22" : "#5c4033"} roughness={0.9} />
                </mesh>
                <mesh rotation={[0, Math.PI / 1.5, Math.PI / 2.1]} position={[-0.2, 0, 0.3]} castShadow>
                    <cylinderGeometry args={[0.15, 0.15, 1.6, 6]} />
                    <meshStandardMaterial color={isNight ? "#3f2c22" : "#5c4033"} roughness={0.9} />
                </mesh>
                <mesh rotation={[0, -Math.PI / 1.5, Math.PI / 2.3]} position={[-0.2, 0, -0.3]} castShadow>
                    <cylinderGeometry args={[0.15, 0.15, 1.5, 6]} />
                    <meshStandardMaterial color={isNight ? "#3f2c22" : "#5c4033"} roughness={0.9} />
                </mesh>
            </group>

            {isNight && (
                <group position={[0, 0.2, 0]}>
                    <FlameLayer position={[0, 0.3, 0]} color="#fff7ed" scale={[0.3, 0.3]} speed={3} offset={0} />
                    <FlameLayer position={[0, 0.6, 0]} color="#fde047" scale={[0.5, 0.8]} speed={2.5} offset={2} />
                    <FlameLayer position={[0, 0.7, 0]} color="#fb923c" scale={[0.6, 1.0]} speed={2} offset={4} />
                    <FlameLayer position={[0, 0.9, 0]} color="#ea580c" scale={[0.4, 1.2]} speed={1.5} offset={5} />
                    <Sparkles count={30} scale={4} size={3} speed={1.5} opacity={0.8} color="#fbbf24" position={[0, 1.5, 0]} />
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
