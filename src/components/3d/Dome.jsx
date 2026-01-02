"use client";

import { MeshTransmissionMaterial } from '@react-three/drei';

export default function ForcefieldDome({ isNight }) {
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
