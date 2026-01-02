"use client";

import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Billboard, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { TYPE_COLORS, getProjectType } from '@/data/cityConfig';

export default function Cottage({ position, project, onClick, isSelected, isNight }) {
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
        if (isNight && lightRef.current) {
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
            role="button"
            aria-label={`View project: ${project.title}`}
        >
            <group ref={ref}>
                <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1.4, 1.5, 1.4]} />
                    <meshStandardMaterial color={isNight ? "#94a3b8" : "#ffffff"} roughness={0.5} />
                </mesh>
                <mesh position={[0, 1.9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
                    <coneGeometry args={[1.3, 1.2, 4]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                <mesh position={[0, 0.5, 0.71]}>
                    <planeGeometry args={[0.5, 0.9]} />
                    <meshStandardMaterial color={isNight ? "#475569" : "#78350f"} />
                </mesh>

                {isNight && (
                    <>
                        <mesh position={[0, 1, 0.71]}>
                            <planeGeometry args={[0.4, 0.4]} />
                            <meshBasicMaterial color="#ff9f43" />
                        </mesh>
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
