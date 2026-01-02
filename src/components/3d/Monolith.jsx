"use client";

import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { TYPE_COLORS } from '@/data/cityConfig';

export default function StoneMonolith({ position, cert, onClick, isSelected, isNight }) {
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
            role="button"
            aria-label={`View certificate: ${cert.title}`}
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
