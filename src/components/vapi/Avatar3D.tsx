"use client";

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarProps {
  isSpeaking: boolean;
}

function AvatarModel({ isSpeaking }: AvatarProps) {
  const group = useRef<THREE.Group>(null);
  const [modelError, setModelError] = useState<Error | null>(null);
  
  // Always call hooks at the top level
  const { scene } = useGLTF('/3dModelGuy.glb');
  
  useEffect(() => {
    try {
      // Apply basic material adjustments
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    } catch (error) {
      console.error("Error setting up avatar model:", error);
      setModelError(error instanceof Error ? error : new Error("Unknown error"));
    }
  }, [scene]);

  // Add a simple head bobbing animation when speaking
  useFrame((state) => {
    if (group.current && isSpeaking) {
      // Subtle head movement when speaking
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.01;
    }
  });

  if (modelError) {
    return null;
  }

  return (
    <group ref={group}>
      <primitive 
        object={scene} 
        scale={1.3}
        position={[0, -1.85, 0]} 
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

export default function Avatar3D({ isSpeaking }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Error boundary for the Canvas component
  useEffect(() => {
    console.log("Avatar3D component mounted");
    
    return () => {
      console.log("Avatar3D component unmounted");
    };
  }, []);

  if (hasError) {
    return (
      <div className="relative w-full h-[400px] bg-[#1C1D2B] rounded-lg overflow-hidden flex items-center justify-center text-white">
        <p>Could not load 3D avatar</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] bg-[#1C1D2B] rounded-lg overflow-hidden">
      <Canvas 
        shadows
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        onCreated={() => console.log("Canvas created successfully")}
        onError={(e) => {
          console.error("Canvas error:", e);
          setHasError(true);
        }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.7} />
        <directionalLight 
          position={[0, 5, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={1024} 
        />
        <directionalLight 
          position={[0, 5, -5]} 
          intensity={0.5} 
        />
        
        {/* Avatar model */}
        <AvatarModel isSpeaking={isSpeaking} />
        
        {/* Controls for camera movement (optional) */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI/4}
          maxPolarAngle={Math.PI/2.2}
        />
      </Canvas>
      
      {/* Status indicator */}
      {isSpeaking && (
        <div className="absolute bottom-4 left-4 bg-[#00F5A0] text-[#14152A] text-xs py-1 px-3 rounded-full animate-pulse">
          Speaking
        </div>
      )}
    </div>
  );
}

// Preload the model
useGLTF.preload('/3dModelGuy.glb');
