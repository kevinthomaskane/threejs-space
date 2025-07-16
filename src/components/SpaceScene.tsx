import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { ColorSettings } from '../App';
import * as THREE from 'three';

interface SpaceSceneProps {
  colorSettings: ColorSettings;
  shapeType?: string;
}

const SpaceScene: React.FC<SpaceSceneProps> = ({
  colorSettings,
  shapeType = 'sphere',
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Create individual sphere particles that form different shapes
  const particles = useMemo(() => {
    const particleCount = 4000; // More particles since they're smaller
    const particlePositions: [number, number, number][] = [];
    const particleColors: string[] = [];
    const particleSizes: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      let x = 0,
        y = 0,
        z = 0;

      switch (shapeType) {
        case 'sphere':
          // Sphere distribution with more spacing
          const radius = 7;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          x = radius * Math.sin(phi) * Math.cos(theta);
          y = radius * Math.sin(phi) * Math.sin(theta);
          z = radius * Math.cos(phi);
          break;

        case 'cube':
          // Cube distribution with more spacing
          x = (Math.random() - 0.5) * 14;
          y = (Math.random() - 0.5) * 14;
          z = (Math.random() - 0.5) * 14;
          break;

        case 'torus':
          // Torus distribution
          const torusRadius = 7;
          const tubeRadius = 3;
          const torusTheta = Math.random() * Math.PI * 2;
          const torusPhi = Math.random() * Math.PI * 2;
          x =
            (torusRadius + tubeRadius * Math.cos(torusPhi)) *
            Math.cos(torusTheta);
          y =
            (torusRadius + tubeRadius * Math.cos(torusPhi)) *
            Math.sin(torusTheta);
          z = tubeRadius * Math.sin(torusPhi);
          break;

        case 'cylinder':
          // Cylinder distribution
          const cylinderRadius = 6;
          const cylinderTheta = Math.random() * Math.PI * 2;
          const cylinderHeight = (Math.random() - 0.5) * 12;
          x = cylinderRadius * Math.cos(cylinderTheta);
          y = cylinderHeight;
          z = cylinderRadius * Math.sin(cylinderTheta);
          break;

        case 'pyramid':
          // Pyramid distribution
          const pyramidSize = 7;
          const pyramidHeight = 12;
          const pyramidBase = Math.random() * pyramidSize;
          const pyramidTheta = Math.random() * Math.PI * 2;
          x = pyramidBase * Math.cos(pyramidTheta);
          y = (Math.random() - 0.5) * pyramidHeight;
          z = pyramidBase * Math.sin(pyramidTheta);
          // Taper towards top
          const taper = 1 - (y + pyramidHeight / 2) / pyramidHeight;
          x *= taper;
          z *= taper;
          break;

        case 'galaxy':
          // Spiral galaxy distribution
          const galaxyRadius = Math.random() * 18 + 5;
          const galaxyAngle = Math.random() * Math.PI * 4;
          const spiralOffset = galaxyRadius * 0.3;
          const galaxyHeight = (Math.random() - 0.5) * 5;
          x = Math.cos(galaxyAngle + spiralOffset) * galaxyRadius;
          y = galaxyHeight;
          z = Math.sin(galaxyAngle + spiralOffset) * galaxyRadius;
          break;

        default:
          // Default to sphere
          const defaultRadius = 7;
          const defaultTheta = Math.random() * Math.PI * 2;
          const defaultPhi = Math.acos(2 * Math.random() - 1);
          x = defaultRadius * Math.sin(defaultPhi) * Math.cos(defaultTheta);
          y = defaultRadius * Math.sin(defaultPhi) * Math.sin(defaultTheta);
          z = defaultRadius * Math.cos(defaultPhi);
      }

      particlePositions.push([x, y, z]);

      // Color based on distance from center with more variation
      const distanceFromCenter = Math.sqrt(x * x + y * y + z * z);
      const colorIntensity = Math.max(0.6, 1 - distanceFromCenter / 30);

      const primaryColor = new THREE.Color(colorSettings.primary);
      const secondaryColor = new THREE.Color(colorSettings.secondary);
      const mixedColor = primaryColor
        .clone()
        .lerp(secondaryColor, Math.random());
      mixedColor.multiplyScalar(colorIntensity);

      particleColors.push(`#${mixedColor.getHexString()}`);

      // Much smaller size for tiny star appearance
      particleSizes.push(Math.random() * 0.007 + 0.001);
    }

    return {
      positions: particlePositions,
      colors: particleColors,
      sizes: particleSizes,
    };
  }, [colorSettings.primary, colorSettings.secondary, shapeType]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Individual glowing star particles */}
      {particles.positions.map((position, i) => (
        <mesh key={i} position={position}>
          <sphereGeometry args={[particles.sizes[i], 4, 4]} />
          <meshStandardMaterial
            color={particles.colors[i]}
            emissive={particles.colors[i]}
            emissiveIntensity={3.0}
            transparent
            opacity={1.0}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Inner glow effect - medium sized */}
      {particles.positions.map((position, i) => (
        <mesh key={`glow-inner-${i}`} position={position}>
          <sphereGeometry args={[particles.sizes[i] * 8, 8, 8]} />
          <meshStandardMaterial
            color={particles.colors[i]}
            emissive={particles.colors[i]}
            emissiveIntensity={1.2}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Outer glow effect - large and soft */}
      {particles.positions.map((position, i) => (
        <mesh key={`glow-outer-${i}`} position={position}>
          <sphereGeometry args={[particles.sizes[i] * 20, 12, 12]} />
          <meshStandardMaterial
            color={particles.colors[i]}
            emissive={particles.colors[i]}
            emissiveIntensity={0.6}
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Far outer glow effect - very large and soft */}
      {particles.positions.map((position, i) => (
        <mesh key={`glow-far-${i}`} position={position}>
          <sphereGeometry args={[particles.sizes[i] * 35, 16, 16]} />
          <meshStandardMaterial
            color={particles.colors[i]}
            emissive={particles.colors[i]}
            emissiveIntensity={0.3}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Ambient glow particles - very few and small */}
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh
          key={`ambient-${i}`}
          position={[
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 60,
          ]}
        >
          <sphereGeometry args={[0.01, 4, 4]} />
          <meshStandardMaterial
            color={colorSettings.accent}
            emissive={colorSettings.accent}
            emissiveIntensity={1.2}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
};

export default SpaceScene;
