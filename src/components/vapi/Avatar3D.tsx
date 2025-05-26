"use client";

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarProps {
  isSpeaking: boolean;
  currentPhoneme?: string;
  upperBodyOnly?: boolean;
}

// Enhanced viseme mapping for more accurate lip sync
enum Viseme {
  Silent = 'silent',
  Ah = 'ah',       // AA, AH - open back vowels
  Ae = 'ae',       // AE - open front vowel (cat, bat)
  Ay = 'ay',       // AY, AW - diphthongs
  Eh = 'eh',       // EH, EY - mid front vowels
  Ee = 'ee',       // IY, IH - high front vowels
  Oh = 'oh',       // OW, AO - mid back vowels
  Oo = 'oo',       // UW, UH - high back vowels
  Er = 'er',       // ER, R - r-colored vowels
  Mb = 'mb',       // M, B, P - bilabial stops (lips together)
  Fv = 'fv',       // F, V - labiodental (teeth on lip)
  Th = 'th',       // TH, DH - dental (tongue between teeth)
  Td = 'td',       // T, D, N, L - alveolar (tongue to roof)
  Sh = 'sh',       // SH, ZH, CH, JH - postalveolar
  Ss = 'ss',       // S, Z - sibilants (tongue groove)
  Kg = 'kg',       // K, G, NG - velar (back of tongue)
  Wy = 'wy',       // W, Y - glides
  Hh = 'hh',       // HH - glottal
}

// Simple mouth shapes for fallback animation
enum MouthShape {
  Closed = 0,
  SlightlyOpen = 1,
  Open = 2,
  WideOpen = 3,
  OShape = 4,
  EShape = 5,
}

// Enhanced facial expression types for more visible animation
enum ExpressionType {
  Neutral = 'neutral',
  Warm_Smile = 'warm_smile',
  Concentration = 'concentration',
  Emphasis = 'emphasis',
  Thoughtful = 'thoughtful',
  Engaged = 'engaged',
  Surprise = 'surprise',
  Concern = 'concern',
  Confident = 'confident',
  Listening = 'listening',
}

function AvatarModel({ 
  isSpeaking, 
  currentPhoneme = '', 
  screenWidth = 1024,
  upperBodyOnly = false
}: AvatarProps & { screenWidth?: number, upperBodyOnly?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const [modelError, setModelError] = useState<Error | null>(null);
  
  // Enhanced bone references
  const jawBone = useRef<THREE.Bone | null>(null);
  const headBone = useRef<THREE.Bone | null>(null);
  const neckBone = useRef<THREE.Bone | null>(null);
  
  const clock = useMemo(() => new THREE.Clock(), []);
  const lipSyncClock = useMemo(() => new THREE.Clock(), []);
  const blinkClock = useMemo(() => new THREE.Clock(), []);
  const expressionClock = useMemo(() => new THREE.Clock(), []);
  const headMovementClock = useMemo(() => new THREE.Clock(), []);
  
  // State for mouth animation
  const [currentMouthShape, setCurrentMouthShape] = useState(MouthShape.Closed);
  const [nextShapeChangeTime, setNextShapeChangeTime] = useState(0);
  const [transitionSpeed, setTransitionSpeed] = useState(0.3);
  const [currentJawRotation, setCurrentJawRotation] = useState(0);
  const [targetJawRotation, setTargetJawRotation] = useState(0);
  
  // Enhanced blinking state
  const [nextBlinkTime, setNextBlinkTime] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [blinkDuration, setBlinkDuration] = useState(0.15);
  const [blinkIntensity, setBlinkIntensity] = useState(1.0);
  
  // Enhanced facial expression state
  const [currentExpression, setCurrentExpression] = useState(ExpressionType.Neutral);
  const [nextExpressionTime, setNextExpressionTime] = useState(0);
  const [expressionIntensity, setExpressionIntensity] = useState(0);
  const [targetExpressionIntensity, setTargetExpressionIntensity] = useState(0);
  
  // Enhanced micro-expression state
  const [eyebrowState, setEyebrowState] = useState({
    left: 0,
    right: 0,
    targetLeft: 0,
    targetRight: 0,
  });
  
  const [cheekState, setCheekState] = useState({
    left: 0,
    right: 0,
    targetLeft: 0,
    targetRight: 0,
  });
  
  const [noseState, setNoseState] = useState({
    flare: 0,
    targetFlare: 0,
  });
  
  // New realistic features
  const [headMovement, setHeadMovement] = useState({
    tilt: 0,
    turn: 0,
    nod: 0,
    targetTilt: 0,
    targetTurn: 0,
    targetNod: 0,
  });
  
  const [eyeState, setEyeState] = useState({
    lookDirection: { x: 0, y: 0 },
    targetLookDirection: { x: 0, y: 0 },
    squint: 0,
    targetSquint: 0,
  });
  
  const [lipState, setLipState] = useState({
    cornerPull: 0,
    targetCornerPull: 0,
    pucker: 0,
    targetPucker: 0,
  });
  
  const { scene, nodes } = useGLTF('/3dModelGuy.glb');
  
  // Get appropriate model scale and position based on screen size
  const getModelSettings = () => {
    if (upperBodyOnly) {
      return { 
        scale: 2.5,  // Keep manageable scale
        position: [0, -4.1, 0] as [number, number, number]  // Move model up from -4.2 to -4.1
      };
    } else if (screenWidth < 640) {
      return { 
        scale: 0.9, 
        position: [0, -1.0, 0] as [number, number, number] 
      };
    } else if (screenWidth < 1024) {
      return { 
        scale: 0.9, 
        position: [0, -0.8, 0] as [number, number, number] 
      };
    } else {
      return { 
        scale: 1.1,
        position: [0, -1.51, 0] as [number, number, number]
      };
    }
  };
  
  const { scale, position } = getModelSettings();
  
  useEffect(() => {
    try {
      // Apply basic material adjustments
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
        
        // Enhanced bone detection
        if (child instanceof THREE.Bone) {
          const lowerName = child.name.toLowerCase();
          if (lowerName.includes('jaw') || lowerName.includes('mouth') || lowerName.includes('chin')) {
            console.log("Found jaw bone:", child.name);
            jawBone.current = child;
          }
          if (lowerName.includes('head') && !lowerName.includes('jaw')) {
            console.log("Found head bone:", child.name);
            headBone.current = child;
          }
          if (lowerName.includes('neck')) {
            console.log("Found neck bone:", child.name);
            neckBone.current = child;
          }
        }
      });
      
      // If we couldn't find bones by name, try to find them by position
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
      blinkClock.start();
      expressionClock.start();
      headMovementClock.start();
      setNextShapeChangeTime(0.1 + Math.random() * 0.1);
      setNextBlinkTime(2 + Math.random() * 3);
      setNextExpressionTime(1 + Math.random() * 3); // More frequent expression changes
      
    } catch (error) {
      console.error("Error setting up avatar model:", error);
      setModelError(error instanceof Error ? error : new Error("Unknown error"));
    }
  }, [scene, nodes, lipSyncClock, blinkClock, expressionClock, headMovementClock]);

  // Enhanced phoneme to viseme conversion
  const getVisemeFromPhoneme = (phoneme: string): Viseme => {
    const phonemeUpper = phoneme.toUpperCase();
    
    if (!phonemeUpper || phonemeUpper === 'SP' || phonemeUpper === 'SIL') return Viseme.Silent;
    
    // Vowels
    if (['AA', 'AH'].includes(phonemeUpper)) return Viseme.Ah;
    if (['AE'].includes(phonemeUpper)) return Viseme.Ae;
    if (['AY', 'AW', 'OY'].includes(phonemeUpper)) return Viseme.Ay;
    if (['EH', 'EY'].includes(phonemeUpper)) return Viseme.Eh;
    if (['IY', 'IH'].includes(phonemeUpper)) return Viseme.Ee;
    if (['OW', 'AO'].includes(phonemeUpper)) return Viseme.Oh;
    if (['UW', 'UH'].includes(phonemeUpper)) return Viseme.Oo;
    if (['ER', 'R'].includes(phonemeUpper)) return Viseme.Er;
    
    // Consonants
    if (['M', 'B', 'P'].includes(phonemeUpper)) return Viseme.Mb;
    if (['F', 'V'].includes(phonemeUpper)) return Viseme.Fv;
    if (['TH', 'DH'].includes(phonemeUpper)) return Viseme.Th;
    if (['T', 'D', 'N', 'L'].includes(phonemeUpper)) return Viseme.Td;
    if (['SH', 'ZH', 'CH', 'JH'].includes(phonemeUpper)) return Viseme.Sh;
    if (['S', 'Z'].includes(phonemeUpper)) return Viseme.Ss;
    if (['K', 'G', 'NG'].includes(phonemeUpper)) return Viseme.Kg;
    if (['W'].includes(phonemeUpper)) return Viseme.Wy;
    if (['Y'].includes(phonemeUpper)) return Viseme.Ee;
    if (['HH'].includes(phonemeUpper)) return Viseme.Hh;
    
    return Viseme.Silent;
  };
  
  // Realistic mouth configurations
  const getJawConfigForViseme = (viseme: Viseme) => {
    switch (viseme) {
      case Viseme.Silent:
        return { jawOpen: 0, mouthWide: 0, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
      case Viseme.Ah:
        return { jawOpen: 0.2, mouthWide: 0.1, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
      case Viseme.Ae:
        return { jawOpen: 0.15, mouthWide: 0.2, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
      case Viseme.Ay:
        return { jawOpen: 0.1, mouthWide: 0.15, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
      case Viseme.Eh:
        return { jawOpen: 0.1, mouthWide: 0.15, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
      case Viseme.Ee:
        return { jawOpen: 0.05, mouthWide: 0.2, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
      case Viseme.Oh:
        return { jawOpen: 0.1, mouthWide: 0.1, lipsPursed: 0.2, lowerLip: 0, upperLip: 0 };
      case Viseme.Oo:
        return { jawOpen: 0.05, mouthWide: 0, lipsPursed: 0.4, lowerLip: 0, upperLip: 0 };
      case Viseme.Er:
        return { jawOpen: 0.08, mouthWide: 0.15, lipsPursed: 0.1, lowerLip: 0, upperLip: 0 };
      case Viseme.Mb:
        return { jawOpen: 0, mouthWide: 0, lipsPursed: 0, lowerLip: 0.8, upperLip: 0.8 };
      case Viseme.Fv:
        return { jawOpen: 0.025, mouthWide: 0.1, lipsPursed: 0, lowerLip: 0.6, upperLip: 0 };
      case Viseme.Th:
        return { jawOpen: 0.04, mouthWide: 0.15, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
      case Viseme.Td:
        return { jawOpen: 0.06, mouthWide: 0.1, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
      case Viseme.Sh:
        return { jawOpen: 0.08, mouthWide: 0.15, lipsPursed: 0.2, lowerLip: 0, upperLip: 0 };
      case Viseme.Ss:
        return { jawOpen: 0.04, mouthWide: 0.2, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
      case Viseme.Kg:
        return { jawOpen: 0.08, mouthWide: 0.1, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
      case Viseme.Wy:
        return { jawOpen: 0.05, mouthWide: 0, lipsPursed: 0.3, lowerLip: 0, upperLip: 0 };
      case Viseme.Hh:
        return { jawOpen: 0.04, mouthWide: 0.15, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
      default:
        return { jawOpen: 0, mouthWide: 0, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
    }
  };
  
  // Get jaw rotation based on mouth shape
  const getJawRotationForShape = (shape: MouthShape): number => {
    switch (shape) {
      case MouthShape.Closed: return 0;
      case MouthShape.SlightlyOpen: return 0.03;
      case MouthShape.Open: return 0.06;
      case MouthShape.WideOpen: return 0.1;
      case MouthShape.OShape: return 0.05;
      case MouthShape.EShape: return 0.04;
      default: return 0;
    }
  };

  // Reduced head movement system - much more subtle
  const updateHeadMovement = (time: number) => {
    if (isSpeaking) {
      // Much more subtle head movements during speech
      const emphasisWave = Math.sin(time * 1.2) * 0.3; // Reduced from 0.8
      const nodWave = Math.sin(time * 0.9) * 0.2; // Reduced from 0.6
      const tiltWave = Math.sin(time * 0.7) * 0.15; // Reduced from 0.5
      
      setHeadMovement(prev => ({
        ...prev,
        targetNod: nodWave * 0.02, // Reduced from 0.08
        targetTilt: tiltWave * 0.015, // Reduced from 0.06
        targetTurn: emphasisWave * 0.01, // Reduced from 0.04
      }));
    } else {
      // Very subtle idle head movements
      const idleWave = Math.sin(time * 0.3) * 0.1; // Reduced from 0.3
      setHeadMovement(prev => ({
        ...prev,
        targetNod: idleWave * 0.005, // Reduced from 0.02
        targetTilt: Math.sin(time * 0.4) * 0.008, // Reduced from 0.03
        targetTurn: Math.sin(time * 0.2) * 0.005, // Reduced from 0.02
      }));
    }
    
    // Smooth head movement transitions
    setHeadMovement(prev => ({
      nod: THREE.MathUtils.lerp(prev.nod, prev.targetNod, 0.08),
      tilt: THREE.MathUtils.lerp(prev.tilt, prev.targetTilt, 0.06),
      turn: THREE.MathUtils.lerp(prev.turn, prev.targetTurn, 0.07),
      targetNod: prev.targetNod,
      targetTilt: prev.targetTilt,
      targetTurn: prev.targetTurn,
    }));
  };

  // Enhanced expression configuration with MUCH MORE VISIBLE eyebrow movements
  const getExpressionConfig = (expression: ExpressionType, intensity: number) => {
    const baseIntensity = intensity * 0.8;
    
    switch (expression) {
      case ExpressionType.Warm_Smile:
        return {
          smile: baseIntensity * 0.6,
          cheekRaise: baseIntensity * 0.4,
          eyebrowRaise: baseIntensity * 0.4, // Increased from 0.2
          noseFlare: 0,
          eyeSquint: baseIntensity * 0.1,
          lipCornerPull: baseIntensity * 0.2,
          headTilt: baseIntensity * 0.05,
        };
      case ExpressionType.Concentration:
        return {
          smile: 0.1,
          cheekRaise: 0.1,
          eyebrowRaise: baseIntensity * 0.8, // Increased from 0.5
          noseFlare: baseIntensity * 0.5,
          eyeSquint: baseIntensity * 0.7,
          lipCornerPull: -baseIntensity * 0.1,
          headTilt: -baseIntensity * 0.02,
        };
      case ExpressionType.Emphasis:
        return {
          smile: baseIntensity * 0.4,
          cheekRaise: baseIntensity * 0.4,
          eyebrowRaise: baseIntensity * 0.9, // Increased from 0.6
          noseFlare: baseIntensity * 0.3,
          eyeSquint: 0,
          lipCornerPull: baseIntensity * 0.2,
          headTilt: baseIntensity * 0.08,
        };
      case ExpressionType.Thoughtful:
        return {
          smile: baseIntensity * 0.2,
          cheekRaise: 0.1,
          eyebrowRaise: baseIntensity * 0.6, // Increased from 0.35
          noseFlare: 0,
          eyeSquint: baseIntensity * 0.5,
          lipCornerPull: baseIntensity * 0.1,
          headTilt: baseIntensity * 0.1,
        };
      case ExpressionType.Engaged:
        return {
          smile: baseIntensity * 0.5,
          cheekRaise: baseIntensity * 0.3,
          eyebrowRaise: baseIntensity * 0.7, // Increased from 0.4
          noseFlare: 0,
          eyeSquint: baseIntensity * 0.2,
          lipCornerPull: baseIntensity * 0.25,
          headTilt: baseIntensity * 0.05,
        };
      case ExpressionType.Surprise:
        return {
          smile: baseIntensity * 0.3,
          cheekRaise: baseIntensity * 0.3,
          eyebrowRaise: baseIntensity * 1.2, // Increased from 0.8
          noseFlare: baseIntensity * 0.4,
          eyeSquint: -baseIntensity * 0.2,
          lipCornerPull: baseIntensity * 0.2,
          headTilt: -baseIntensity * 0.05,
        };
      case ExpressionType.Concern:
        return {
          smile: baseIntensity * 0.1,
          cheekRaise: 0.05,
          eyebrowRaise: baseIntensity * 0.7, // Increased from 0.45
          noseFlare: baseIntensity * 0.3,
          eyeSquint: baseIntensity * 0.6,
          lipCornerPull: -baseIntensity * 0.2,
          headTilt: baseIntensity * 0.08,
        };
      case ExpressionType.Confident:
        return {
          smile: baseIntensity * 0.5,
          cheekRaise: baseIntensity * 0.2,
          eyebrowRaise: baseIntensity * 0.4, // Increased from 0.25
          noseFlare: 0,
          eyeSquint: baseIntensity * 0.2,
          lipCornerPull: baseIntensity * 0.2,
          headTilt: -baseIntensity * 0.02,
        };
      case ExpressionType.Listening:
        return {
          smile: baseIntensity * 0.3,
          cheekRaise: baseIntensity * 0.1,
          eyebrowRaise: baseIntensity * 0.5, // Increased from 0.3
          noseFlare: 0,
          eyeSquint: baseIntensity * 0.3,
          lipCornerPull: baseIntensity * 0.1,
          headTilt: baseIntensity * 0.12,
        };
      default: // Neutral
        return {
          smile: 0.15,
          cheekRaise: 0.05,
          eyebrowRaise: 0.15, // Increased from 0.08
          noseFlare: 0,
          eyeSquint: 0,
          lipCornerPull: 0.1,
          headTilt: 0,
        };
      }
    };

  // Enhanced blinking system with more variation
  const updateBlinking = (time: number) => {
    if (time > nextBlinkTime && !isBlinking) {
      setIsBlinking(true);
      setBlinkDuration(0.08 + Math.random() * 0.12);
      setBlinkIntensity(0.8 + Math.random() * 0.4); // Variable blink intensity
      
      const baseInterval = isSpeaking ? 1.5 : 3.5;
      setNextBlinkTime(time + baseInterval + Math.random() * 2);
      
      setTimeout(() => {
        setIsBlinking(false);
      }, blinkDuration * 1000);
    }
  };

  // Enhanced facial expression system
  const updateExpressions = (time: number) => {
    if (time > nextExpressionTime) {
      if (isSpeaking) {
        // More varied expressions during speech
        const speakingExpressions = [
          ExpressionType.Warm_Smile,
          ExpressionType.Emphasis,
          ExpressionType.Engaged,
          ExpressionType.Concentration,
          ExpressionType.Confident,
          ExpressionType.Surprise,
        ];
        const randomExpression = speakingExpressions[Math.floor(Math.random() * speakingExpressions.length)];
        setCurrentExpression(randomExpression);
        setTargetExpressionIntensity(0.7 + Math.random() * 0.5); // Increased intensity
        setNextExpressionTime(time + 1.5 + Math.random() * 3); // More frequent changes
      } else {
        // More varied idle expressions
        const idleExpressions = [
          ExpressionType.Neutral,
          ExpressionType.Warm_Smile,
          ExpressionType.Thoughtful,
          ExpressionType.Listening,
          ExpressionType.Concern,
        ];
        const randomExpression = idleExpressions[Math.floor(Math.random() * idleExpressions.length)];
        setCurrentExpression(randomExpression);
        setTargetExpressionIntensity(0.4 + Math.random() * 0.4); // Increased idle intensity
        setNextExpressionTime(time + 3 + Math.random() * 6);
      }
    }
    
    // Faster transition to target expression intensity
    setExpressionIntensity(prev => 
      THREE.MathUtils.lerp(prev, targetExpressionIntensity, 0.04)
    );
  };

  // Enhanced micro-expression updates with MUCH MORE VISIBLE eyebrow animation
  const updateMicroExpressions = (time: number) => {
    // Much more visible eyebrow movements
    const eyebrowVariation = Math.sin(time * 1.1) * 0.25; // Increased from 0.15
    const eyebrowAsymmetry = Math.sin(time * 0.8) * 0.15; // Increased from 0.08
    
    if (isSpeaking) {
      // Much more visible eyebrow movements during speech
      const speechEyebrowIntensity = Math.sin(time * 2.1) * 0.2; // Increased from 0.12
      const speechAsymmetry = Math.sin(time * 1.7) * 0.12; // Increased from 0.06
      
      setEyebrowState(prev => ({
        ...prev,
        targetLeft: eyebrowVariation * 1.2 + eyebrowAsymmetry + speechEyebrowIntensity, // Much more visible
        targetRight: eyebrowVariation * 1.0 - eyebrowAsymmetry + speechAsymmetry, // Much more visible
      }));
    } else {
      // Much more visible idle eyebrow movements
      setEyebrowState(prev => ({
        ...prev,
        targetLeft: eyebrowVariation * 0.8 + eyebrowAsymmetry * 1.2, // Much more visible
        targetRight: eyebrowVariation * 0.7 - eyebrowAsymmetry * 1.2, // Much more visible
      }));
    }
    
    // Enhanced cheek movements during speech - more cheerful
    if (isSpeaking) {
      const cheekVariation = Math.sin(time * 1.5) * 0.5; // Increased from 0.4
      setCheekState(prev => ({
        ...prev,
        targetLeft: cheekVariation * 0.8 + 0.1, // Added base cheerfulness
        targetRight: cheekVariation * 0.7 + 0.1, // Added base cheerfulness
      }));
    } else {
      setCheekState(prev => ({
        ...prev,
        targetLeft: Math.sin(time * 0.5) * 0.15 + 0.05, // Increased base cheerfulness
        targetRight: Math.sin(time * 0.6) * 0.12 + 0.05, // Increased base cheerfulness
      }));
    }
    
    // Enhanced nose flare during speech
    if (isSpeaking) {
      const noseVariation = Math.sin(time * 2.3) * 0.3;
      setNoseState(prev => ({
        ...prev,
        targetFlare: noseVariation * 0.6,
      }));
    } else {
      setNoseState(prev => ({
        ...prev,
        targetFlare: 0,
      }));
    }
    
    // Eye tracking simulation with more liveliness
    const eyeLookX = Math.sin(time * 0.8) * 0.4; // Increased from 0.3
    const eyeLookY = Math.sin(time * 0.6) * 0.25; // Increased from 0.2
    setEyeState(prev => ({
      ...prev,
      targetLookDirection: { x: eyeLookX, y: eyeLookY },
      targetSquint: isSpeaking ? Math.sin(time * 1.8) * 0.3 + 0.1 : 0.05, // Added base squint for cheerfulness
    }));
    
    // Lip corner movements - more cheerful
    if (isSpeaking) {
      const lipMovement = Math.sin(time * 1.6) * 0.4;
      setLipState(prev => ({
        ...prev,
        targetCornerPull: lipMovement * 0.6 + 0.15, // Added base smile
        targetPucker: Math.sin(time * 2.1) * 0.2,
      }));
    } else {
      setLipState(prev => ({
        ...prev,
        targetCornerPull: 0.1, // Maintain subtle smile when idle
        targetPucker: 0,
      }));
    }
    
    // Smooth transitions for all micro-expressions (same as before)
    setEyebrowState(prev => ({
      left: THREE.MathUtils.lerp(prev.left, prev.targetLeft, 0.15),
      right: THREE.MathUtils.lerp(prev.right, prev.targetRight, 0.15),
      targetLeft: prev.targetLeft,
      targetRight: prev.targetRight,
    }));
    
    setCheekState(prev => ({
      left: THREE.MathUtils.lerp(prev.left, prev.targetLeft, 0.15),
      right: THREE.MathUtils.lerp(prev.right, prev.targetRight, 0.15),
      targetLeft: prev.targetLeft,
      targetRight: prev.targetRight,
    }));
    
    setNoseState(prev => ({
      flare: THREE.MathUtils.lerp(prev.flare, prev.targetFlare, 0.2),
      targetFlare: prev.targetFlare,
    }));
    
    setEyeState(prev => ({
      lookDirection: {
        x: THREE.MathUtils.lerp(prev.lookDirection.x, prev.targetLookDirection.x, 0.05),
        y: THREE.MathUtils.lerp(prev.lookDirection.y, prev.targetLookDirection.y, 0.05),
      },
      targetLookDirection: prev.targetLookDirection,
      squint: THREE.MathUtils.lerp(prev.squint, prev.targetSquint, 0.12),
      targetSquint: prev.targetSquint,
    }));
    
    setLipState(prev => ({
      cornerPull: THREE.MathUtils.lerp(prev.cornerPull, prev.targetCornerPull, 0.18),
      targetCornerPull: prev.targetCornerPull,
      pucker: THREE.MathUtils.lerp(prev.pucker, prev.targetPucker, 0.15),
      targetPucker: prev.targetPucker,
    }));
  };

  // Update mouth shape based on speaking state
  useEffect(() => {
    if (!isSpeaking) {
      setTargetJawRotation(0);
      setCurrentMouthShape(MouthShape.Closed);
      setCurrentExpression(ExpressionType.Neutral);
      setTargetExpressionIntensity(0.3);
    }
  }, [isSpeaking]);
  
  // Main animation loop with reduced pivoting
  useFrame(() => {
    if (group.current) {
      const time = clock.getElapsedTime();
      const lipSyncTime = lipSyncClock.getElapsedTime();
      const blinkTime = blinkClock.getElapsedTime();
      const expressionTime = expressionClock.getElapsedTime();
      const headTime = headMovementClock.getElapsedTime();
      
      // Update all animation systems
      updateBlinking(blinkTime);
      updateExpressions(expressionTime);
      updateMicroExpressions(time);
      updateHeadMovement(headTime);
      
      // Much more subtle body movements - reduced pivoting
      group.current.rotation.y = Math.sin(time * 0.3) * 0.002 + headMovement.turn; // Reduced from 0.005
      group.current.rotation.x = headMovement.nod * 0.02; // Reduced multiplier from 0.08
      group.current.rotation.z = headMovement.tilt * 0.015; // Reduced multiplier from 0.06
      
      // Apply even more subtle head movements to head bone if available
      if (headBone.current) {
        headBone.current.rotation.x += headMovement.nod * 0.1; // Reduced from 0.2
        headBone.current.rotation.z += headMovement.tilt * 0.1; // Reduced from 0.2
        headBone.current.rotation.y += headMovement.turn * 0.01; // Reduced from 0.04
      }
      
      if (isSpeaking) {
        // Use phoneme data if available for precise lip sync
        if (currentPhoneme) {
          const viseme = getVisemeFromPhoneme(currentPhoneme);
          const { jawOpen, mouthWide, lipsPursed, lowerLip, upperLip } = getJawConfigForViseme(viseme);
          
          // Apply to jaw bone with smooth transitions
          if (jawBone.current) {
            const targetRotation = jawOpen * 0.06;
            const newRotation = THREE.MathUtils.lerp(
              currentJawRotation, 
              targetRotation, 
              0.3
            );
            setCurrentJawRotation(newRotation);
            jawBone.current.rotation.x = newRotation;
          }
          
          // Apply to morph targets with enhanced precision
          scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.morphTargetInfluences && child.morphTargetDictionary) {
                const setMorphTarget = (names: string[], value: number) => {
                  for (const name of names) {
                  if (name in child.morphTargetDictionary!) {
                    const index = child.morphTargetDictionary![name];
                      if (index !== undefined && child.morphTargetInfluences) {
                      child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                        child.morphTargetInfluences[index], 
                        value, 
                        0.4
                      );
                      break;
                    }
                  }
                }
              };
              
              // Get current expression configuration
              const expressionConfig = getExpressionConfig(currentExpression, expressionIntensity);
              
              // Apply enhanced mouth shapes
              setMorphTarget(['mouthOpen', 'mouth_open', 'jawOpen', 'open'], jawOpen);
              setMorphTarget(['mouthWide', 'mouth_wide'], mouthWide);
              setMorphTarget(['lipsPursed', 'lips_pursed', 'mouthO', 'mouth_o', 'o'], lipsPursed);
              setMorphTarget(['lowerLipDown', 'lower_lip_down', 'lipLowerDown'], lowerLip);
              setMorphTarget(['upperLipUp', 'upper_lip_up', 'lipUpperUp'], upperLip);
              
              // Apply enhanced facial expressions
              setMorphTarget(['mouthSmile', 'mouth_smile', 'smile'], 
                expressionConfig.smile + lipState.cornerPull);
              setMorphTarget(['cheekRaise', 'cheek_raise', 'cheekPuff'], 
                expressionConfig.cheekRaise + cheekState.left);

              // Use the ACTUAL available eyebrow morph targets with MUCH MORE VISIBLE values
              setMorphTarget(['browInnerUp'], 
                Math.max(0, Math.min(0.8, (expressionConfig.eyebrowRaise + eyebrowState.left) * 0.4))); // Much more visible
              setMorphTarget(['browOuterUpLeft'], 
                Math.max(0, Math.min(0.7, (expressionConfig.eyebrowRaise + eyebrowState.left) * 0.35))); // Much more visible
              setMorphTarget(['browOuterUpRight'], 
                Math.max(0, Math.min(0.7, (expressionConfig.eyebrowRaise + eyebrowState.right) * 0.35))); // Much more visible
              setMorphTarget(['browDownLeft'], 
                Math.max(0, Math.min(0.4, -expressionConfig.eyebrowRaise * 0.25))); // Much more visible
              setMorphTarget(['browDownRight'], 
                Math.max(0, Math.min(0.4, -expressionConfig.eyebrowRaise * 0.25))); // Much more visible

              setMorphTarget(['noseFlare', 'nose_flare', 'nostrilFlare'], 
                expressionConfig.noseFlare + noseState.flare);
              setMorphTarget(['eyeSquint', 'eye_squint', 'squint'], 
                expressionConfig.eyeSquint + eyeState.squint);
              
              // Enhanced lip movements
              setMorphTarget(['lipCornerPull', 'lip_corner_pull', 'mouthCornerPull'], 
                expressionConfig.lipCornerPull + lipState.cornerPull);
              setMorphTarget(['lipPucker', 'lip_pucker', 'mouthPucker'], lipState.pucker);
              
              // Apply consonant-specific shapes
              if (viseme === Viseme.Mb) {
                setMorphTarget(['lipsTogether', 'lips_together', 'mouthClosed'], 1.0);
              } else {
                setMorphTarget(['lipsTogether', 'lips_together', 'mouthClosed'], 0);
              }
              
              if (viseme === Viseme.Fv) {
                setMorphTarget(['teethLowerLip', 'teeth_lower_lip', 'lipBite'], 0.8);
              } else {
                setMorphTarget(['teethLowerLip', 'teeth_lower_lip', 'lipBite'], 0);
              }
              
              // Enhanced blinking with variable intensity
              if (isBlinking) {
                setMorphTarget(['eyesClosed', 'eyes_closed', 'blink', 'eyeBlink'], blinkIntensity);
              } else {
                setMorphTarget(['eyesClosed', 'eyes_closed', 'blink', 'eyeBlink'], 0);
              }
              
              // Eye look direction (if supported)
              setMorphTarget(['eyeLookLeft', 'eye_look_left'], Math.max(0, -eyeState.lookDirection.x));
              setMorphTarget(['eyeLookRight', 'eye_look_right'], Math.max(0, eyeState.lookDirection.x));
              setMorphTarget(['eyeLookUp', 'eye_look_up'], Math.max(0, eyeState.lookDirection.y));
              setMorphTarget(['eyeLookDown', 'eye_look_down'], Math.max(0, -eyeState.lookDirection.y));
            }
          });
        } else {
          // Enhanced fallback animation with more visible expressions
          if (lipSyncTime > nextShapeChangeTime) {
            const randomValue = Math.random();
            
            if (randomValue > 0.8) {
              setCurrentMouthShape(MouthShape.Open);
              setTransitionSpeed(0.5);
            } else if (randomValue > 0.6) {
              setCurrentMouthShape(MouthShape.SlightlyOpen);
              setTransitionSpeed(0.4);
            } else if (randomValue > 0.4) {
              setCurrentMouthShape(MouthShape.EShape);
              setTransitionSpeed(0.4);
            } else if (randomValue > 0.25) {
              setCurrentMouthShape(MouthShape.OShape);
              setTransitionSpeed(0.35);
            } else if (randomValue > 0.1) {
              setCurrentMouthShape(MouthShape.Closed);
              setTransitionSpeed(0.3);
            } else {
              setCurrentMouthShape(MouthShape.WideOpen);
              setTransitionSpeed(0.5);
            }
            
            setTargetJawRotation(getJawRotationForShape(currentMouthShape));
            
            const nextChangeDelay = 0.04 + Math.random() * 0.06;
            setNextShapeChangeTime(lipSyncTime + nextChangeDelay);
            
            if (lipSyncTime > 1000) {
              lipSyncClock.start();
              setNextShapeChangeTime(nextChangeDelay);
            }
          }
          
          // Smooth transitions to target jaw rotation
          const newRotation = THREE.MathUtils.lerp(
            currentJawRotation, 
            targetJawRotation, 
            transitionSpeed
          );
          setCurrentJawRotation(newRotation);
          
          // Apply mouth animation with enhanced expressions
          if (jawBone.current) {
            jawBone.current.rotation.x = newRotation;
          }
          
          // Animate morph targets with enhanced facial expressions
          scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.morphTargetInfluences && child.morphTargetDictionary) {
              const applyMorphIfExists = (name: string, value: number) => {
                if (name in child.morphTargetDictionary!) {
                  const index = child.morphTargetDictionary![name];
                  if (index !== undefined && child.morphTargetInfluences) {
                    child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                      child.morphTargetInfluences[index], 
                      value, 
                      0.25
                    );
                  }
                }
              };
              
              // Get current expression configuration
              const expressionConfig = getExpressionConfig(currentExpression, expressionIntensity);
              
              // Apply mouth shape values
              let openValue = 0;
              let wideValue = 0;
              let pursedValue = 0;
              
              switch (currentMouthShape) {
                case MouthShape.WideOpen: 
                  openValue = 0.3; 
                  wideValue = 0.2;
                  break;
                case MouthShape.Open: 
                  openValue = 0.2; 
                  wideValue = 0.3;
                  break;
                case MouthShape.SlightlyOpen: 
                  openValue = 0.12; 
                  wideValue = 0.2;
                  break;
                case MouthShape.OShape: 
                  openValue = 0.15; 
                  pursedValue = 0.6;
                  break;
                case MouthShape.EShape: 
                  openValue = 0.1; 
                  wideValue = 0.5;
                  break;
              }
              
              applyMorphIfExists('mouthOpen', openValue);
              applyMorphIfExists('mouth_open', openValue);
              applyMorphIfExists('jawOpen', openValue);
              applyMorphIfExists('mouthWide', wideValue);
              applyMorphIfExists('mouth_wide', wideValue);
              applyMorphIfExists('mouthO', pursedValue);
              applyMorphIfExists('mouth_o', pursedValue);
              applyMorphIfExists('lipsPursed', pursedValue);
              
              // Apply enhanced facial expressions
              applyMorphIfExists('mouthSmile', expressionConfig.smile + lipState.cornerPull);
              applyMorphIfExists('mouth_smile', expressionConfig.smile + lipState.cornerPull);
              applyMorphIfExists('cheekRaise', expressionConfig.cheekRaise + cheekState.left);
              applyMorphIfExists('cheek_raise', expressionConfig.cheekRaise + cheekState.right);

              // Use the ACTUAL available eyebrow morph targets with MUCH MORE VISIBLE values
              applyMorphIfExists('browInnerUp', Math.max(0, Math.min(0.8, (expressionConfig.eyebrowRaise + eyebrowState.left) * 0.4))); // Much more visible
              applyMorphIfExists('browOuterUpLeft', Math.max(0, Math.min(0.7, (expressionConfig.eyebrowRaise + eyebrowState.left) * 0.35))); // Much more visible
              applyMorphIfExists('browOuterUpRight', Math.max(0, Math.min(0.7, (expressionConfig.eyebrowRaise + eyebrowState.right) * 0.35))); // Much more visible
              applyMorphIfExists('browDownLeft', Math.max(0, Math.min(0.4, -expressionConfig.eyebrowRaise * 0.25))); // Much more visible
              applyMorphIfExists('browDownRight', Math.max(0, Math.min(0.4, -expressionConfig.eyebrowRaise * 0.25))); // Much more visible

              applyMorphIfExists('noseFlare', expressionConfig.noseFlare + noseState.flare);
              applyMorphIfExists('nose_flare', expressionConfig.noseFlare + noseState.flare);
              applyMorphIfExists('eyeSquint', expressionConfig.eyeSquint + eyeState.squint);
              applyMorphIfExists('eye_squint', expressionConfig.eyeSquint + eyeState.squint);
              
              // Enhanced lip movements
              applyMorphIfExists('lipCornerPull', expressionConfig.lipCornerPull + lipState.cornerPull);
              applyMorphIfExists('lip_corner_pull', expressionConfig.lipCornerPull + lipState.cornerPull);
              applyMorphIfExists('lipPucker', lipState.pucker);
              applyMorphIfExists('lip_pucker', lipState.pucker);
              
              // Enhanced blinking
              if (isBlinking) {
                applyMorphIfExists('eyesClosed', blinkIntensity);
                applyMorphIfExists('eyes_closed', blinkIntensity);
                applyMorphIfExists('blink', blinkIntensity);
              } else {
                applyMorphIfExists('eyesClosed', 0);
                applyMorphIfExists('eyes_closed', 0);
                applyMorphIfExists('blink', 0);
              }
              
              // Eye look direction
              applyMorphIfExists('eyeLookLeft', Math.max(0, -eyeState.lookDirection.x));
              applyMorphIfExists('eye_look_left', Math.max(0, -eyeState.lookDirection.x));
              applyMorphIfExists('eyeLookRight', Math.max(0, eyeState.lookDirection.x));
              applyMorphIfExists('eye_look_right', Math.max(0, eyeState.lookDirection.x));
              applyMorphIfExists('eyeLookUp', Math.max(0, eyeState.lookDirection.y));
              applyMorphIfExists('eye_look_up', Math.max(0, eyeState.lookDirection.y));
              applyMorphIfExists('eyeLookDown', Math.max(0, -eyeState.lookDirection.y));
              applyMorphIfExists('eye_look_down', Math.max(0, -eyeState.lookDirection.y));
            }
          });
        }
      } else {
        // Reset animations when not speaking but maintain enhanced expressions
        if (jawBone.current) {
          jawBone.current.rotation.x = THREE.MathUtils.lerp(jawBone.current.rotation.x, 0, 0.1);
        }
        
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.morphTargetInfluences && child.morphTargetDictionary) {
            const resetMorphTarget = (name: string, targetValue: number = 0) => {
              if (name in child.morphTargetDictionary!) {
                const index = child.morphTargetDictionary![name];
                if (index !== undefined && child.morphTargetInfluences) {
                  child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                    child.morphTargetInfluences[index], 
                    targetValue, 
                    0.05
                  );
                }
              }
            };
            
            // Get current expression configuration for idle state
            const expressionConfig = getExpressionConfig(currentExpression, expressionIntensity);
            
            // Reset mouth shapes
            resetMorphTarget('mouthOpen', 0);
            resetMorphTarget('mouth_open', 0);
            resetMorphTarget('jawOpen', 0);
            resetMorphTarget('mouthWide', 0);
            resetMorphTarget('mouth_wide', 0);
            resetMorphTarget('lipsPursed', 0);
            resetMorphTarget('lips_pursed', 0);
            resetMorphTarget('mouthO', 0);
            resetMorphTarget('mouth_o', 0);
            
            // Maintain enhanced expressions even when idle
            resetMorphTarget('mouthSmile', expressionConfig.smile + lipState.cornerPull);
            resetMorphTarget('mouth_smile', expressionConfig.smile + lipState.cornerPull);
            resetMorphTarget('cheekRaise', expressionConfig.cheekRaise + cheekState.left);
            resetMorphTarget('cheek_raise', expressionConfig.cheekRaise + cheekState.right);

            // Use the ACTUAL available eyebrow morph targets with MUCH MORE VISIBLE values for idle
            resetMorphTarget('browInnerUp', Math.max(0, Math.min(0.8, (expressionConfig.eyebrowRaise + eyebrowState.left) * 0.4)));
            resetMorphTarget('browOuterUpLeft', Math.max(0, Math.min(0.7, (expressionConfig.eyebrowRaise + eyebrowState.left) * 0.35)));
            resetMorphTarget('browOuterUpRight', Math.max(0, Math.min(0.7, (expressionConfig.eyebrowRaise + eyebrowState.right) * 0.35)));
            resetMorphTarget('browDownLeft', Math.max(0, Math.min(0.4, -expressionConfig.eyebrowRaise * 0.25)));
            resetMorphTarget('browDownRight', Math.max(0, Math.min(0.4, -expressionConfig.eyebrowRaise * 0.25)));

            resetMorphTarget('noseFlare', expressionConfig.noseFlare + noseState.flare);
            resetMorphTarget('nose_flare', expressionConfig.noseFlare + noseState.flare);
            resetMorphTarget('eyeSquint', expressionConfig.eyeSquint + eyeState.squint);
            resetMorphTarget('eye_squint', expressionConfig.eyeSquint + eyeState.squint);
            
            // Enhanced lip movements
            resetMorphTarget('lipCornerPull', expressionConfig.lipCornerPull + lipState.cornerPull);
            resetMorphTarget('lip_corner_pull', expressionConfig.lipCornerPull + lipState.cornerPull);
            resetMorphTarget('lipPucker', lipState.pucker);
            resetMorphTarget('lip_pucker', lipState.pucker);
            
            // Enhanced blinking
            if (isBlinking) {
              resetMorphTarget('eyesClosed', blinkIntensity);
              resetMorphTarget('eyes_closed', blinkIntensity);
              resetMorphTarget('blink', blinkIntensity);
            } else {
              resetMorphTarget('eyesClosed', 0);
              resetMorphTarget('eyes_closed', 0);
              resetMorphTarget('blink', 0);
            }
            
            // Eye look direction
            resetMorphTarget('eyeLookLeft', Math.max(0, -eyeState.lookDirection.x));
            resetMorphTarget('eye_look_left', Math.max(0, -eyeState.lookDirection.x));
            resetMorphTarget('eyeLookRight', Math.max(0, eyeState.lookDirection.x));
            resetMorphTarget('eye_look_right', Math.max(0, eyeState.lookDirection.x));
            resetMorphTarget('eyeLookUp', Math.max(0, eyeState.lookDirection.y));
            resetMorphTarget('eye_look_up', Math.max(0, eyeState.lookDirection.y));
            resetMorphTarget('eyeLookDown', Math.max(0, -eyeState.lookDirection.y));
            resetMorphTarget('eye_look_down', Math.max(0, -eyeState.lookDirection.y));
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
        scale={scale}
        position={position}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

export default function Avatar3D({ isSpeaking, currentPhoneme, upperBodyOnly = false }: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  const getCameraSettings = () => {
    if (upperBodyOnly) {
      return { 
        position: [0, 0.0, 1.4] as [number, number, number],  // Bring camera back to neutral level
        fov: 45  // Good field of view for close-up
      };
    } else if (dimensions.width < 640) {
      return { 
        position: [0, 0, 3.0] as [number, number, number], 
        fov: 35
      };
    } else {
      return { 
        position: [0, 0.3, 2.625] as [number, number, number],
        fov: 28
      };
    }
  };
  
  const cameraSettings = getCameraSettings();

  if (hasError) {
    return (
      <div className="relative w-full h-full bg-[#1C1D2B] rounded-lg overflow-hidden flex items-center justify-center text-white">
        <p>Could not load 3D avatar</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#1C1D2B] rounded-lg overflow-hidden">
      <Canvas 
        shadows
        camera={{ 
          position: cameraSettings.position, 
          fov: cameraSettings.fov 
        }}
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
        
        <AvatarModel 
          isSpeaking={isSpeaking} 
          currentPhoneme={currentPhoneme}
          screenWidth={dimensions.width} 
          upperBodyOnly={upperBodyOnly}
        />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI/4}
          maxPolarAngle={Math.PI/2.2}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/3dModelGuy.glb');
