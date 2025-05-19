"use client";

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarProps {
  isSpeaking: boolean;
}

// Define mouth shapes (visemes) for more realistic lip-syncing
enum MouthShape {
  Closed = 0,
  SlightlyOpen = 1,
  Open = 2,
  WideOpen = 3,
  OShape = 4,
  EShape = 5,
}

function AvatarModel({ isSpeaking }: AvatarProps) {
  const group = useRef<THREE.Group>(null);
  const [modelError, setModelError] = useState<Error | null>(null);
  
  // For jaw and mouth animation
  const jawBone = useRef<THREE.Bone | null>(null);
  const clock = useMemo(() => new THREE.Clock(), []);
  const lipSyncClock = useMemo(() => new THREE.Clock(), []);
  
  // State for current mouth shape
  const [currentMouthShape, setCurrentMouthShape] = useState(MouthShape.Closed);
  const [nextShapeChangeTime, setNextShapeChangeTime] = useState(0);
  const [transitionSpeed, setTransitionSpeed] = useState(0.1);
  const [currentJawRotation, setCurrentJawRotation] = useState(0);
  const [targetJawRotation, setTargetJawRotation] = useState(0);
  
  // Always call hooks at the top level
  const { scene, nodes } = useGLTF('/3dModelGuy.glb');
  
  useEffect(() => {
    try {
      // Apply basic material adjustments
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
        
        // Find the jaw bone if it exists in the model
        if (child instanceof THREE.Bone) {
          const lowerName = child.name.toLowerCase();
          if (lowerName.includes('jaw') || lowerName.includes('mouth') || lowerName.includes('chin')) {
            console.log("Found jaw bone:", child.name);
            jawBone.current = child;
          }
        }
      });
      
      // If we couldn't find a jaw bone by name, try to find it by position
      if (!jawBone.current) {
        scene.traverse((child) => {
          if (child instanceof THREE.Bone && child.position.y < 0 && 
              child.parent && child.parent.name.toLowerCase().includes('head')) {
            console.log("Found potential jaw bone by position:", child.name);
            jawBone.current = child;
          }
        });
      }
      
      // Set initial values
      lipSyncClock.start();
      setNextShapeChangeTime(0.1 + Math.random() * 0.2);
      
    } catch (error) {
      console.error("Error setting up avatar model:", error);
      setModelError(error instanceof Error ? error : new Error("Unknown error"));
    }
  }, [scene, nodes, lipSyncClock]);

  // Get jaw rotation based on mouth shape
  const getJawRotationForShape = (shape: MouthShape): number => {
    switch (shape) {
      case MouthShape.Closed:
        return 0;
      case MouthShape.SlightlyOpen:
        return 0.1;
      case MouthShape.Open:
        return 0.2;
      case MouthShape.WideOpen:
        return 0.3;
      case MouthShape.OShape:
        return 0.15;
      case MouthShape.EShape:
        return 0.12;
      default:
        return 0;
    }
  };

  // Update mouth shape based on speaking state
  useEffect(() => {
    if (!isSpeaking) {
      setTargetJawRotation(0);
      setCurrentMouthShape(MouthShape.Closed);
    }
  }, [isSpeaking]);

  // Add lip-syncing and head movement
  useFrame(() => {
    if (group.current) {
      // Get the current time
      const time = clock.getElapsedTime();
      const lipSyncTime = lipSyncClock.getElapsedTime();
      
      // Always apply subtle idle animation
      group.current.rotation.y = Math.sin(time * 0.5) * 0.02;
      
      if (isSpeaking) {
        // Enhanced head movement when speaking
        group.current.rotation.z = Math.sin(time * 3) * 0.01;
        
        // Check if it's time to change mouth shape
        if (lipSyncTime > nextShapeChangeTime) {
          // Choose a random new mouth shape when speaking
          if (Math.random() > 0.7) {
            // Occasionally wider open for emphasis
            setCurrentMouthShape(MouthShape.WideOpen);
            setTransitionSpeed(0.15);
          } else if (Math.random() > 0.5) {
            // Often slightly open
            setCurrentMouthShape(MouthShape.SlightlyOpen);
            setTransitionSpeed(0.1);
          } else if (Math.random() > 0.3) {
            // Sometimes regular open
            setCurrentMouthShape(MouthShape.Open);
            setTransitionSpeed(0.12);
          } else if (Math.random() > 0.2) {
            // O shape for rounded sounds
            setCurrentMouthShape(MouthShape.OShape);
            setTransitionSpeed(0.08);
          } else if (Math.random() > 0.1) {
            // E shape for ee sounds
            setCurrentMouthShape(MouthShape.EShape);
            setTransitionSpeed(0.09);
          } else {
            // Occasionally closed (pauses in speech)
            setCurrentMouthShape(MouthShape.Closed);
            setTransitionSpeed(0.07);
          }
          
          // Set target rotation based on the new shape
          setTargetJawRotation(getJawRotationForShape(currentMouthShape));
          
          // Set time for next shape change (vary timing for realism)
          const nextChangeDelay = 0.1 + Math.random() * 0.2;
          setNextShapeChangeTime(lipSyncTime + nextChangeDelay);
          
          // Reset clock if it gets too large to prevent floating point issues
          if (lipSyncTime > 1000) {
            lipSyncClock.start();
            setNextShapeChangeTime(nextChangeDelay);
          }
        }
        
        // Smoothly transition to target jaw rotation
        const newRotation = THREE.MathUtils.lerp(
          currentJawRotation, 
          targetJawRotation, 
          transitionSpeed
        );
        setCurrentJawRotation(newRotation);
        
        // Apply mouth animation
        if (jawBone.current) {
          // Apply the updated rotation to the jaw bone
          jawBone.current.rotation.x = newRotation;
          
          // Add slight sideways jaw movement for more realism
          jawBone.current.rotation.y = Math.sin(time * 10) * 0.02;
        }
        
        // Animate morph targets if available
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.morphTargetInfluences && child.morphTargetDictionary) {
            // Look for various mouth-related morph targets
            const mouthOpenIndex = child.morphTargetDictionary['mouthOpen'] || 
                                child.morphTargetDictionary['mouth_open'] || 
                                child.morphTargetDictionary['jawOpen'];
                                
            const mouthSmileIndex = child.morphTargetDictionary['mouthSmile'] || 
                                child.morphTargetDictionary['mouth_smile'];
                                
            const mouthOIndex = child.morphTargetDictionary['mouthO'] || 
                              child.morphTargetDictionary['mouth_o'];
                              
            const mouthEIndex = child.morphTargetDictionary['mouthE'] || 
                              child.morphTargetDictionary['mouth_e'];
            
            // Apply appropriate morph target values based on current mouth shape
            if (mouthOpenIndex !== undefined) {
              let openValue = 0;
              if (currentMouthShape === MouthShape.WideOpen) openValue = 0.8;
              else if (currentMouthShape === MouthShape.Open) openValue = 0.5;
              else if (currentMouthShape === MouthShape.SlightlyOpen) openValue = 0.3;
              else if (currentMouthShape === MouthShape.OShape) openValue = 0.4;
              else if (currentMouthShape === MouthShape.EShape) openValue = 0.3;
              
              child.morphTargetInfluences[mouthOpenIndex] = openValue;
            }
            
            if (mouthSmileIndex !== undefined) {
              // Add occasional slight smile for realism
              child.morphTargetInfluences[mouthSmileIndex] = Math.sin(time * 0.5) * 0.2 + 0.1;
            }
            
            if (mouthOIndex !== undefined && currentMouthShape === MouthShape.OShape) {
              child.morphTargetInfluences[mouthOIndex] = 0.8;
            } else if (mouthOIndex !== undefined) {
              child.morphTargetInfluences[mouthOIndex] = 0;
            }
            
            if (mouthEIndex !== undefined && currentMouthShape === MouthShape.EShape) {
              child.morphTargetInfluences[mouthEIndex] = 0.8;
            } else if (mouthEIndex !== undefined) {
              child.morphTargetInfluences[mouthEIndex] = 0;
            }
          }
        });
      } else {
        // Reset all animations when not speaking
        if (jawBone.current) {
          jawBone.current.rotation.x = 0;
          jawBone.current.rotation.y = 0;
        }
        
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.morphTargetInfluences) {
            // Reset all morph targets to zero
            for (let i = 0; i < child.morphTargetInfluences.length; i++) {
              child.morphTargetInfluences[i] = 0;
            }
          }
        });
      }
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
