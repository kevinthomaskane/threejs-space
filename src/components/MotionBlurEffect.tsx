import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface MotionBlurEffectProps {
  intensity?: number;
  enabled?: boolean;
}

const MotionBlurEffect: React.FC<MotionBlurEffectProps> = ({
  intensity = 1.0,
  enabled = true,
}) => {
  const { camera } = useThree();
  const prevCameraPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const velocity = useRef<THREE.Vector3>(new THREE.Vector3());
  const velocityMagnitude = useRef<number>(0);
  const originalFov = useRef<number>(75);
  const isInitialized = useRef<boolean>(false);

  useFrame(() => {
    if (!enabled) return;

    // Initialize on first frame
    if (!isInitialized.current && camera instanceof THREE.PerspectiveCamera) {
      originalFov.current = camera.fov;
      isInitialized.current = true;
    }

    // Calculate camera velocity
    const currentPosition = camera.position.clone();
    velocity.current.subVectors(currentPosition, prevCameraPosition.current);
    velocityMagnitude.current = velocity.current.length();

    // Update previous position
    prevCameraPosition.current.copy(currentPosition);

    // Apply subtle motion blur effect
    if (camera instanceof THREE.PerspectiveCamera && isInitialized.current) {
      const blurAmount = Math.min(
        velocityMagnitude.current * intensity * 0.5,
        0.1
      );

      // Only apply blur when moving significantly
      if (velocityMagnitude.current > 0.005) {
        // Temporarily adjust FOV for motion blur effect
        camera.fov = originalFov.current + blurAmount * 2;
        camera.updateProjectionMatrix();

        // Reset FOV after a short delay
        setTimeout(() => {
          camera.fov = originalFov.current;
          camera.updateProjectionMatrix();
        }, 100);
      }
    }
  });

  return null;
};

export default MotionBlurEffect;
