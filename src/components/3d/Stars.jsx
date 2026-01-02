"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { SCENE_CONFIG } from '@/data/cityConfig';

export function TwinklingStars() {
    const ref = useRef();
    const count = SCENE_CONFIG.particles.starsCount;
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
    }, [count]);

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

export function ConstellationLines() {
    const linesRef = useRef();
    const starCount = SCENE_CONFIG.particles.constellationStars;

    const [linePositions, lineColors] = useMemo(() => {
        const radius = 290;
        const maxDistance = 70;

        const stars = [];
        for (let i = 0; i < starCount; i++) {
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            stars.push({
                x: radius * Math.sin(phi) * Math.cos(theta),
                y: radius * Math.sin(phi) * Math.sin(theta),
                z: radius * Math.cos(phi)
            });
        }

        const positions = [];
        const colors = [];

        for (let i = 0; i < starCount; i++) {
            for (let j = i + 1; j < starCount; j++) {
                const dx = stars[i].x - stars[j].x;
                const dy = stars[i].y - stars[j].y;
                const dz = stars[i].z - stars[j].z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < maxDistance) {
                    positions.push(stars[i].x, stars[i].y, stars[i].z);
                    positions.push(stars[j].x, stars[j].y, stars[j].z);
                    colors.push(0.506, 0.831, 0.98);
                    colors.push(0.506, 0.831, 0.98);
                }
            }
        }
        return [new Float32Array(positions), new Float32Array(colors)];
    }, [starCount]);

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
