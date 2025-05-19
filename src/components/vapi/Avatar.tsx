"use client";

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarProps {
  isSpeaking: boolean;
}

function AvatarModel({ isSpeaking }: AvatarProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/avatar.glb'); // You'll need to provide your own avatar model
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (isSpeaking) {
      actions['Talking']?.play();
    } else {
      actions['Talking']?.stop();
      actions['Idle']?.play();
    }
  }, [isSpeaking, actions]);

  useFrame((state) => {
    if (group.current) {
      // Add subtle breathing animation
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={1.5} position={[0, -1, 0]} />
    </group>
  );
}

export default function Avatar({ isSpeaking }: AvatarProps) {
  return (
    <div className="w-full h-[400px] bg-[#1C1D2B] rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <AvatarModel isSpeaking={isSpeaking} />
      </Canvas>
    </div>
  );
}
