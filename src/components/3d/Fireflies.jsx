"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Fireflies({ count = 15, isNight }) {
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
                <mesh key={i}>
                    <sphereGeometry args={[1, 8, 8]} />
                    <meshBasicMaterial color={i % 2 === 0 ? "#fde047" : "#bef264"} />
                </mesh>
            ))}
        </group>
    );
}
