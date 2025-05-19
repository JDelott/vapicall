"use client";

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarProps {
  isSpeaking: boolean;
  currentPhoneme?: string;
}

// Define viseme mapping
enum Viseme {
  Silent = 'silent',
  Ah = 'ah',       // AA, AE, AH, AY
  Eh = 'eh',       // EH, EY
  Ee = 'ee',       // IY, IH
  Oh = 'oh',       // OW, AO
  Oo = 'oo',       // UW, UH
  Er = 'er',       // ER, R
  Mb = 'mb',       // M, B, P
  Fv = 'fv',       // F, V
  Th = 'th',       // TH, D, N, L, T
  Sh = 'sh',       // SH, ZH
  Ss = 'ss',       // S, Z
  Ch = 'ch',       // CH, JH
  Kg = 'kg',       // K, G
}

// Define mouth shapes for random animation fallback
enum MouthShape {
  Closed = 0,
  SlightlyOpen = 1,
  Open = 2,
  WideOpen = 3,
  OShape = 4,
  EShape = 5,
}

function AvatarModel({ isSpeaking, currentPhoneme = '' }: AvatarProps) {
  const group = useRef<THREE.Group>(null);
  const [modelError, setModelError] = useState<Error | null>(null);
  
  // For jaw and mouth animation
  const jawBone = useRef<THREE.Bone | null>(null);
  const clock = useMemo(() => new THREE.Clock(), []);
  const lipSyncClock = useMemo(() => new THREE.Clock(), []);
  
  // State for mouth animation
  const [currentMouthShape, setCurrentMouthShape] = useState(MouthShape.Closed);
  const [nextShapeChangeTime, setNextShapeChangeTime] = useState(0);
  const [transitionSpeed, setTransitionSpeed] = useState(0.3);
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

  // Convert phoneme to viseme
  const getVisemeFromPhoneme = (phoneme: string): Viseme => {
    const phonemeUpper = phoneme.toUpperCase();
    
    if (!phonemeUpper || phonemeUpper === 'SP') return Viseme.Silent;
    
    // Map phonemes to visemes
    if (['AA', 'AE', 'AH', 'AY'].includes(phonemeUpper)) return Viseme.Ah;
    if (['EH', 'EY'].includes(phonemeUpper)) return Viseme.Eh;
    if (['IY', 'IH'].includes(phonemeUpper)) return Viseme.Ee;
    if (['OW', 'AO'].includes(phonemeUpper)) return Viseme.Oh;
    if (['UW', 'UH', 'OY'].includes(phonemeUpper)) return Viseme.Oo;
    if (['ER', 'R'].includes(phonemeUpper)) return Viseme.Er;
    if (['M', 'B', 'P'].includes(phonemeUpper)) return Viseme.Mb;
    if (['F', 'V'].includes(phonemeUpper)) return Viseme.Fv;
    if (['TH', 'D', 'N', 'L', 'T', 'HH'].includes(phonemeUpper)) return Viseme.Th;
    if (['SH', 'ZH'].includes(phonemeUpper)) return Viseme.Sh;
    if (['S', 'Z'].includes(phonemeUpper)) return Viseme.Ss;
    if (['CH', 'JH'].includes(phonemeUpper)) return Viseme.Ch;
    if (['K', 'G', 'NG', 'W', 'Y'].includes(phonemeUpper)) return Viseme.Kg;
    
    return Viseme.Silent;
  };
  
  // Map viseme to jaw and lip positions
  const getJawConfigForViseme = (viseme: Viseme) => {
    switch (viseme) {
      case Viseme.Silent:
        return { jawOpen: 0, mouthWide: 0, lipsPursed: 0 };
      case Viseme.Ah:
        return { jawOpen: 0.7, mouthWide: 0.3, lipsPursed: 0 };
      case Viseme.Eh:
        return { jawOpen: 0.4, mouthWide: 0.6, lipsPursed: 0 };
      case Viseme.Ee:
        return { jawOpen: 0.2, mouthWide: 0.8, lipsPursed: 0 };
      case Viseme.Oh:
        return { jawOpen: 0.5, mouthWide: 0, lipsPursed: 0.5 };
      case Viseme.Oo:
        return { jawOpen: 0.2, mouthWide: 0, lipsPursed: 0.9 };
      case Viseme.Er:
        return { jawOpen: 0.3, mouthWide: 0.3, lipsPursed: 0.2 };
      case Viseme.Mb:
        return { jawOpen: 0, mouthWide: 0.3, lipsPursed: 0.3 };
      case Viseme.Fv:
        return { jawOpen: 0.2, mouthWide: 0.3, lipsPursed: 0.2 };
      case Viseme.Th:
        return { jawOpen: 0.3, mouthWide: 0.2, lipsPursed: 0 };
      case Viseme.Sh:
        return { jawOpen: 0.2, mouthWide: 0.4, lipsPursed: 0.3 };
      case Viseme.Ss:
        return { jawOpen: 0.2, mouthWide: 0.6, lipsPursed: 0 };
      case Viseme.Ch:
        return { jawOpen: 0.2, mouthWide: 0.4, lipsPursed: 0.2 };
      case Viseme.Kg:
        return { jawOpen: 0.3, mouthWide: 0.2, lipsPursed: 0 };
      default:
        return { jawOpen: 0, mouthWide: 0, lipsPursed: 0 };
    }
  };
  
  // Get jaw rotation based on mouth shape (for random fallback)
  const getJawRotationForShape = (shape: MouthShape): number => {
    switch (shape) {
      case MouthShape.Closed:
        return 0;
      case MouthShape.SlightlyOpen:
        return 0.08;
      case MouthShape.Open:
        return 0.15;
      case MouthShape.WideOpen:
        return 0.22;
      case MouthShape.OShape:
        return 0.12;
      case MouthShape.EShape:
        return 0.10;
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
        
        // Use phoneme data if available
        if (currentPhoneme) {
          const viseme = getVisemeFromPhoneme(currentPhoneme);
          const { jawOpen, mouthWide, lipsPursed } = getJawConfigForViseme(viseme);
          
          // Apply to jaw bone
          if (jawBone.current) {
            // Smoothly transition to target jaw rotation
            const targetRotation = jawOpen * 0.15;
            const newRotation = THREE.MathUtils.lerp(
              currentJawRotation, 
              targetRotation, 
              0.15
            );
            setCurrentJawRotation(newRotation);
            jawBone.current.rotation.x = newRotation;
            
            // Add slight sideways jaw movement for realism
            jawBone.current.rotation.y = Math.sin(time * 8) * 0.02;
          }
          
          // Apply to morph targets if available
          scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              // Check if morphTargetInfluences and morphTargetDictionary exist
              if (child.morphTargetInfluences && child.morphTargetDictionary) {
                // Apply each morph target depending on availability
                const setMorphTarget = (names: string[], value: number) => {
                  for (const name of names) {
                    if (child.morphTargetDictionary && name in child.morphTargetDictionary) {
                      const index = child.morphTargetDictionary[name];
                      if (index !== undefined && child.morphTargetInfluences) {
                        child.morphTargetInfluences[index] = value;
                        break; // Use first found
                      }
                    }
                  }
                };
                
                // Set mouth open amount
                setMorphTarget(
                  ['mouthOpen', 'mouth_open', 'jawOpen', 'open'], 
                  jawOpen
                );
                
                // Set mouth width
                setMorphTarget(
                  ['mouthWide', 'mouth_wide', 'smile', 'mouthSmile', 'mouth_smile'], 
                  mouthWide
                );
                
                // Set lips pursed
                setMorphTarget(
                  ['lipsPursed', 'lips_pursed', 'mouthO', 'mouth_o', 'o', 'kissy'], 
                  lipsPursed
                );
              }
            }
          });
        } else {
          // Fallback to random mouth shapes if no phoneme data
          // Check if it's time to change mouth shape - more frequent changes!
          if (lipSyncTime > nextShapeChangeTime) {
            // Choose a random new mouth shape when speaking
            const randomValue = Math.random();
            
            if (randomValue > 0.7) {
              // Occasionally wider open for emphasis
              setCurrentMouthShape(MouthShape.WideOpen);
              setTransitionSpeed(0.4); // Much faster transition
            } else if (randomValue > 0.5) {
              // Often slightly open
              setCurrentMouthShape(MouthShape.SlightlyOpen);
              setTransitionSpeed(0.35);
            } else if (randomValue > 0.3) {
              // Sometimes regular open
              setCurrentMouthShape(MouthShape.Open);
              setTransitionSpeed(0.4);
            } else if (randomValue > 0.2) {
              // O shape for rounded sounds
              setCurrentMouthShape(MouthShape.OShape);
              setTransitionSpeed(0.3);
            } else if (randomValue > 0.1) {
              // E shape for ee sounds
              setCurrentMouthShape(MouthShape.EShape);
              setTransitionSpeed(0.35);
            } else {
              // Occasionally closed (pauses in speech)
              setCurrentMouthShape(MouthShape.Closed);
              setTransitionSpeed(0.3);
            }
            
            // Set target rotation based on the new shape
            setTargetJawRotation(getJawRotationForShape(currentMouthShape));
            
            // Set time for next shape change - much shorter delays for faster changes
            // Use shorter delays (50-150ms) for more rapid changes
            const nextChangeDelay = 0.05 + Math.random() * 0.1;
            setNextShapeChangeTime(lipSyncTime + nextChangeDelay);
            
            // Reset clock if it gets too large to prevent floating point issues
            if (lipSyncTime > 1000) {
              lipSyncClock.start();
              setNextShapeChangeTime(nextChangeDelay);
            }
          }
          
          // Smoother and faster transitions to target jaw rotation
          const newRotation = THREE.MathUtils.lerp(
            currentJawRotation, 
            targetJawRotation, 
            transitionSpeed  // Already increased
          );
          setCurrentJawRotation(newRotation);
          
          // Apply mouth animation
          if (jawBone.current) {
            // Apply the updated rotation to the jaw bone
            jawBone.current.rotation.x = newRotation;
            
            // Add more dynamic jaw movement for more realism
            jawBone.current.rotation.y = Math.sin(time * 15) * 0.03; // Faster and more pronounced
          }
          
          // Animate morph targets if available
          scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.morphTargetInfluences) {
              // Look for various mouth-related morph targets
              const applyMorphIfExists = (name: string, value: number) => {
                if (child.morphTargetDictionary && name in child.morphTargetDictionary) {
                  const index = child.morphTargetDictionary[name];
                  if (index !== undefined && child.morphTargetInfluences) {
                    child.morphTargetInfluences[index] = value;
                  }
                }
              };
              
              // Apply appropriate morph target values based on current mouth shape
              // Increase these values for more visible mouth movements
              let openValue = 0;
              if (currentMouthShape === MouthShape.WideOpen) openValue = 0.5;      // Reduced from 1.0
              else if (currentMouthShape === MouthShape.Open) openValue = 0.35;    // Reduced from 0.7
              else if (currentMouthShape === MouthShape.SlightlyOpen) openValue = 0.2; // Reduced from 0.4
              else if (currentMouthShape === MouthShape.OShape) openValue = 0.25;  // Reduced from 0.5
              else if (currentMouthShape === MouthShape.EShape) openValue = 0.2;   // Reduced from 0.4
              
              applyMorphIfExists('mouthOpen', openValue);
              applyMorphIfExists('mouth_open', openValue);
              applyMorphIfExists('jawOpen', openValue);
              
              // Add occasional slight smile for realism
              applyMorphIfExists('mouthSmile', Math.sin(time * 0.5) * 0.2 + 0.1);
              applyMorphIfExists('mouth_smile', Math.sin(time * 0.5) * 0.2 + 0.1);
              
              // O and E shapes
              if (currentMouthShape === MouthShape.OShape) {
                applyMorphIfExists('mouthO', 0.8);
                applyMorphIfExists('mouth_o', 0.8);
              } else {
                applyMorphIfExists('mouthO', 0);
                applyMorphIfExists('mouth_o', 0);
              }
              
              if (currentMouthShape === MouthShape.EShape) {
                applyMorphIfExists('mouthE', 0.8);
                applyMorphIfExists('mouth_e', 0.8);
              } else {
                applyMorphIfExists('mouthE', 0);
                applyMorphIfExists('mouth_e', 0);
              }
            }
          });
        }
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

export default function Avatar3D({ isSpeaking, currentPhoneme }: AvatarProps) {
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
        <AvatarModel isSpeaking={isSpeaking} currentPhoneme={currentPhoneme} />
        
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
