"use client";

import { VILLAGE_COLORS } from '@/data/cityConfig';

export default function Island({ isNight }) {
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
