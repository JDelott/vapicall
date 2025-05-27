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

// Enhanced facial expression types with more nuanced emotions
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
  // New enhanced expressions
  Joy = 'joy',
  Skeptical = 'skeptical',
  Curious = 'curious',
  Determined = 'determined',
  Relaxed = 'relaxed',
  Excited = 'excited',
  Contemplative = 'contemplative',
  Amused = 'amused',
  Focused = 'focused',
  Empathetic = 'empathetic',
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
  
  // Remove the unused state variables and keep it simple
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
  
  const [foreheadState, setForeheadState] = useState({
    wrinkle: 0,
    targetWrinkle: 0,
    raise: 0,
    targetRaise: 0,
  });
  
  const [jawState, setJawState] = useState({
    clench: 0,
    targetClench: 0,
    shift: 0,
    targetShift: 0,
  });
  
  const [templeState, setTempleState] = useState({
    tension: 0,
    targetTension: 0,
  });
  
  // Enhanced word gap tracking with anticipatory movement and better reactivity
  const [wordGapState, setWordGapState] = useState({
    lastPhoneme: '',
    silenceFrames: 0,
    isInPause: false,
    pauseIntensity: 0,
    anticipatoryMovement: 0,
    phonemeHistory: [] as string[],
    nextPhonemePrep: 0,
  });
  
  const { scene, nodes } = useGLTF('/3dModelGuy.glb');
  
  // Get appropriate model scale and position based on screen size
  const getModelSettings = () => {
    if (upperBodyOnly) {
      return { 
        scale: 2.5,
        position: [0, -4.1, 0] as [number, number, number]
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
      setNextExpressionTime(1 + Math.random() * 3);
      
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
  
  // Much faster and more reactive word gap tracking
  const updateWordGapTracking = (phoneme: string) => {
    const currentViseme = getVisemeFromPhoneme(phoneme);
    const isCurrentlySilent = currentViseme === Viseme.Silent || !phoneme || phoneme === '' || phoneme === 'SP' || phoneme === 'SIL';
    
    setWordGapState(prev => {
      const newState = { ...prev };
      
      // Track phoneme history for better anticipation
      if (phoneme !== prev.lastPhoneme) {
        newState.phonemeHistory = [...prev.phonemeHistory.slice(-3), phoneme]; // Keep last 4 phonemes
        newState.lastPhoneme = phoneme;
        
        // Calculate anticipatory movement based on upcoming phoneme - more aggressive
        if (!isCurrentlySilent) {
          const upcomingViseme = getVisemeFromPhoneme(phoneme);
          newState.anticipatoryMovement = getAnticipationForViseme(upcomingViseme) * 1.2; // Increased anticipation
        }
      }
      
      // EXTREMELY sensitive silence tracking for instant response
      if (isCurrentlySilent) {
        newState.silenceFrames++;
      } else {
        newState.silenceFrames = 0; // Reset immediately when sound detected
      }
      
      // INSTANT pause detection - like real speech
      const isShortPause = newState.silenceFrames >= 1 && newState.silenceFrames <= 2;  // Even faster detection
      const isMediumPause = newState.silenceFrames >= 3 && newState.silenceFrames <= 6;
      const isLongPause = newState.silenceFrames >= 7;
      
      newState.isInPause = isShortPause || isMediumPause || isLongPause;
      
      // More responsive pause intensities
      let targetIntensity = 0;
      if (isShortPause) {
        targetIntensity = 0.1; // Very quick syllable breaks
      } else if (isMediumPause) {
        targetIntensity = 0.3; // Quick word breaks
      } else if (isLongPause) {
        targetIntensity = 0.6; // Sentence breaks
      }
      
      // INSTANT pause intensity transitions for active speech
      if (newState.isInPause) {
        newState.pauseIntensity = THREE.MathUtils.lerp(newState.pauseIntensity, targetIntensity, 0.5);
      } else {
        newState.pauseIntensity = THREE.MathUtils.lerp(newState.pauseIntensity, 0, 0.7); // Faster recovery
      }
      
      // Faster decay of anticipatory movement
      newState.anticipatoryMovement = THREE.MathUtils.lerp(newState.anticipatoryMovement, 0, 0.3);
      
      return newState;
    });
  };

  // Enhanced anticipation values for faster response
  const getAnticipationForViseme = (viseme: Viseme): number => {
    switch (viseme) {
      case Viseme.Ah:
      case Viseme.Ae:
        return 1.0; // Big mouth opening coming - prepare jaw quickly
      case Viseme.Oh:
      case Viseme.Oo:
        return 0.8; // Rounded mouth coming - prepare lips quickly
      case Viseme.Mb:
        return 1.2; // Lip closure coming - prepare very quickly
      case Viseme.Fv:
        return 0.9; // Lip-teeth contact coming
      case Viseme.Ee:
        return 0.7; // Wide mouth coming
      default:
        return 0.5; // General preparation
    }
  };

  // Much faster and more reactive mouth configurations
  const getJawConfigForViseme = (viseme: Viseme, pauseIntensity: number = 0, anticipation: number = 0) => {
    const baseConfig = (() => {
      switch (viseme) {
        case Viseme.Silent:
          return { jawOpen: 0, mouthWide: 0, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
        case Viseme.Ah:
          return { jawOpen: 0.35, mouthWide: 0.25, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
        case Viseme.Ae:
          return { jawOpen: 0.3, mouthWide: 0.35, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
        case Viseme.Ay:
          return { jawOpen: 0.22, mouthWide: 0.3, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
        case Viseme.Eh:
          return { jawOpen: 0.22, mouthWide: 0.3, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
        case Viseme.Ee:
          return { jawOpen: 0.12, mouthWide: 0.35, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
        case Viseme.Oh:
          return { jawOpen: 0.22, mouthWide: 0.15, lipsPursed: 0.4, lowerLip: 0, upperLip: 0 };
        case Viseme.Oo:
          return { jawOpen: 0.15, mouthWide: 0, lipsPursed: 0.6, lowerLip: 0, upperLip: 0 };
        case Viseme.Er:
          return { jawOpen: 0.18, mouthWide: 0.25, lipsPursed: 0.2, lowerLip: 0, upperLip: 0 };
        
        // POLISHED CONSONANTS - More distinct and natural
        case Viseme.Mb: // M, B, P - Complete lip closure
          return { jawOpen: 0, mouthWide: 0, lipsPursed: 0, lowerLip: 1.0, upperLip: 1.0 };
        
        case Viseme.Fv: // F, V - Lower lip to upper teeth
          return { jawOpen: 0.06, mouthWide: 0.12, lipsPursed: 0, lowerLip: 0.95, upperLip: 0.1 }; // Slight upper lip involvement
        
        case Viseme.Th: // TH, DH - Tongue tip visible between teeth
          return { jawOpen: 0.08, mouthWide: 0.18, lipsPursed: 0, lowerLip: 0.15, upperLip: 0.1 }; // Slight lip parting for tongue
        
        case Viseme.Td: // T, D, N, L - Tongue to alveolar ridge
          return { jawOpen: 0.12, mouthWide: 0.15, lipsPursed: 0, lowerLip: 0.05, upperLip: 0.05 }; // Minimal lip involvement
        
        case Viseme.Sh: // SH, ZH, CH, JH - Lip rounding with slight protrusion
          return { jawOpen: 0.16, mouthWide: 0.18, lipsPursed: 0.4, lowerLip: 0.1, upperLip: 0.1 }; // More defined lip shape
        
        case Viseme.Ss: // S, Z - Slight smile position for sibilants
          return { jawOpen: 0.08, mouthWide: 0.32, lipsPursed: 0, lowerLip: 0, upperLip: 0 }; // Clean sibilant position
        
        case Viseme.Kg: // K, G, NG - Back of tongue, neutral lips
          return { jawOpen: 0.16, mouthWide: 0.12, lipsPursed: 0, lowerLip: 0, upperLip: 0 }; // Slightly more open
        
        case Viseme.Wy: // W, Y - Strong lip rounding for W
          return { jawOpen: 0.1, mouthWide: 0, lipsPursed: 0.65, lowerLip: 0.2, upperLip: 0.2 }; // More pronounced rounding
        
        case Viseme.Hh: // HH - Slight opening, relaxed
          return { jawOpen: 0.1, mouthWide: 0.15, lipsPursed: 0, lowerLip: 0, upperLip: 0 }; // Cleaner H sound
        
        default:
          return { jawOpen: 0, mouthWide: 0, lipsPursed: 0, lowerLip: 0, upperLip: 0 };
      }
    })();
    
    // Much more aggressive anticipatory movement for faster response
    if (anticipation > 0) {
      const anticipationFactor = anticipation * 0.5; // Increased from 0.3
      baseConfig.jawOpen += anticipationFactor * 0.15; // Increased from 0.1
      baseConfig.mouthWide += anticipationFactor * 0.1; // Increased from 0.05
      
      // Prepare for specific upcoming movements more aggressively
      if (viseme === Viseme.Mb || viseme === Viseme.Fv) {
        baseConfig.lowerLip += anticipationFactor * 0.3; // Increased from 0.2
      }
      if (viseme === Viseme.Oh || viseme === Viseme.Oo || viseme === Viseme.Wy) {
        baseConfig.lipsPursed += anticipationFactor * 0.25; // Increased from 0.15
      }
    }
    
    // Faster pause modifications - less interference with speech
    if (pauseIntensity > 0) {
      const time = Date.now() * 0.001;
      const breathingCycle = Math.sin(time * 2.2) * 0.5 + 0.5; // Faster breathing
      const microMovement = Math.sin(time * 6) * 0.015; // Faster micro-movements
      
      // Smaller rest position changes to not interfere with speech
      let restPosition = 0.01 + breathingCycle * 0.008 + microMovement;
      
      // Much less aggressive pause modifications
      if (pauseIntensity < 0.2) {
        restPosition *= 1.1; // Minimal change for quick syllable breaks
      } else if (pauseIntensity < 0.5) {
        restPosition *= 0.95; // Small change for word breaks
      } else {
        restPosition *= 0.7; // Moderate change for sentence breaks
      }
      
      // Much less aggressive blending - don't slow down speech
      const jawBlend = pauseIntensity * 0.6; // Reduced from 0.9
      const wideBlend = pauseIntensity * 0.4; // Reduced from 0.7
      const pursedBlend = pauseIntensity * 0.7; // Reduced from 0.95
      const lipBlend = pauseIntensity * 0.8; // Reduced from 0.98
      
      baseConfig.jawOpen = THREE.MathUtils.lerp(baseConfig.jawOpen, restPosition, jawBlend);
      baseConfig.mouthWide = THREE.MathUtils.lerp(baseConfig.mouthWide, restPosition * 0.3, wideBlend);
      baseConfig.lipsPursed = THREE.MathUtils.lerp(baseConfig.lipsPursed, 0, pursedBlend);
      baseConfig.lowerLip = THREE.MathUtils.lerp(baseConfig.lowerLip, 0, lipBlend);
      baseConfig.upperLip = THREE.MathUtils.lerp(baseConfig.upperLip, 0, lipBlend);
    }
    
    return baseConfig;
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
      const emphasisWave = Math.sin(time * 1.2) * 0.3;
      const nodWave = Math.sin(time * 0.9) * 0.2;
      const tiltWave = Math.sin(time * 0.7) * 0.15;
      
      setHeadMovement(prev => ({
        ...prev,
        targetNod: nodWave * 0.02,
        targetTilt: tiltWave * 0.015,
        targetTurn: emphasisWave * 0.01,
      }));
    } else {
      // Very subtle idle head movements
      const idleWave = Math.sin(time * 0.3) * 0.1;
      setHeadMovement(prev => ({
        ...prev,
        targetNod: idleWave * 0.005,
        targetTilt: Math.sin(time * 0.4) * 0.008,
        targetTurn: Math.sin(time * 0.2) * 0.005,
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

  // Enhanced expression configuration with more detailed facial muscle control
  const getExpressionConfig = (expression: ExpressionType, intensity: number) => {
    const baseIntensity = intensity * 0.8;
    
    switch (expression) {
      case ExpressionType.Warm_Smile:
        return {
          smile: baseIntensity * 0.7,
          cheekRaise: baseIntensity * 0.5,
          eyebrowRaise: baseIntensity * 0.3,
          noseFlare: 0,
          eyeSquint: baseIntensity * 0.2,
          lipCornerPull: baseIntensity * 0.3,
          headTilt: baseIntensity * 0.05,
          foreheadWrinkle: 0,
          foreheadRaise: baseIntensity * 0.1,
          jawClench: 0,
          templeTension: 0,
        };
      
      case ExpressionType.Joy:
        return {
          smile: baseIntensity * 0.9,
          cheekRaise: baseIntensity * 0.8,
          eyebrowRaise: baseIntensity * 0.4,
          noseFlare: baseIntensity * 0.1,
          eyeSquint: baseIntensity * 0.4,
          lipCornerPull: baseIntensity * 0.5,
          headTilt: baseIntensity * 0.08,
          foreheadWrinkle: 0,
          foreheadRaise: baseIntensity * 0.2,
          jawClench: 0,
          templeTension: 0,
        };
      
      case ExpressionType.Concentration:
        return {
          smile: 0.05,
          cheekRaise: 0.1,
          eyebrowRaise: baseIntensity * 0.2,
          noseFlare: baseIntensity * 0.4,
          eyeSquint: baseIntensity * 0.8,
          lipCornerPull: -baseIntensity * 0.1,
          headTilt: -baseIntensity * 0.02,
          foreheadWrinkle: baseIntensity * 0.6,
          foreheadRaise: 0,
          jawClench: baseIntensity * 0.3,
          templeTension: baseIntensity * 0.4,
        };
      
      default: // Neutral and others
        return {
          smile: 0.1,
          cheekRaise: 0.05,
          eyebrowRaise: 0.1,
          noseFlare: 0,
          eyeSquint: 0,
          lipCornerPull: 0.05,
          headTilt: 0,
          foreheadWrinkle: 0,
          foreheadRaise: 0,
          jawClench: 0,
          templeTension: 0,
        };
    }
  };

  // Enhanced blinking system with more variation
  const updateBlinking = (time: number) => {
    if (time > nextBlinkTime && !isBlinking) {
      setIsBlinking(true);
      setBlinkDuration(0.08 + Math.random() * 0.12);
      setBlinkIntensity(0.8 + Math.random() * 0.4);
      
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
        const speakingExpressions = [
          ExpressionType.Warm_Smile,
          ExpressionType.Emphasis,
          ExpressionType.Engaged,
          ExpressionType.Concentration,
          ExpressionType.Confident,
          ExpressionType.Joy,
          ExpressionType.Excited,
          ExpressionType.Curious,
          ExpressionType.Determined,
          ExpressionType.Empathetic,
        ];
        
        const randomExpression = speakingExpressions[Math.floor(Math.random() * speakingExpressions.length)];
        setCurrentExpression(randomExpression);
        setTargetExpressionIntensity(0.6 + Math.random() * 0.6);
        setNextExpressionTime(time + 1.2 + Math.random() * 2.5);
      } else {
        const idleExpressions = [
          ExpressionType.Neutral,
          ExpressionType.Warm_Smile,
          ExpressionType.Thoughtful,
          ExpressionType.Listening,
          ExpressionType.Relaxed,
          ExpressionType.Contemplative,
          ExpressionType.Curious,
        ];
        const randomExpression = idleExpressions[Math.floor(Math.random() * idleExpressions.length)];
        setCurrentExpression(randomExpression);
        setTargetExpressionIntensity(0.3 + Math.random() * 0.5);
        setNextExpressionTime(time + 2.5 + Math.random() * 5);
      }
    }
    
    const transitionSpeed = 0.03 + (targetExpressionIntensity * 0.02);
    setExpressionIntensity(prev => 
      THREE.MathUtils.lerp(prev, targetExpressionIntensity, transitionSpeed)
    );
  };

  // Enhanced micro-expression updates
  const updateMicroExpressions = (time: number) => {
    const eyebrowVariation = Math.sin(time * 1.1) * 0.25;
    const eyebrowAsymmetry = Math.sin(time * 0.8) * 0.15;
    
    if (isSpeaking) {
      const speechEyebrowIntensity = Math.sin(time * 2.1) * 0.2;
      const speechAsymmetry = Math.sin(time * 1.7) * 0.12;
      
      setEyebrowState(prev => ({
        ...prev,
        targetLeft: eyebrowVariation * 1.2 + eyebrowAsymmetry + speechEyebrowIntensity,
        targetRight: eyebrowVariation * 1.0 - eyebrowAsymmetry + speechAsymmetry,
      }));
    } else {
      setEyebrowState(prev => ({
        ...prev,
        targetLeft: eyebrowVariation * 0.8 + eyebrowAsymmetry * 1.2,
        targetRight: eyebrowVariation * 0.7 - eyebrowAsymmetry * 1.2,
      }));
    }
    
    // Enhanced cheek movements during speech
    if (isSpeaking) {
      const cheekVariation = Math.sin(time * 1.5) * 0.5;
      setCheekState(prev => ({
        ...prev,
        targetLeft: cheekVariation * 0.8 + 0.1,
        targetRight: cheekVariation * 0.7 + 0.1,
      }));
    } else {
      setCheekState(prev => ({
        ...prev,
        targetLeft: Math.sin(time * 0.5) * 0.15 + 0.05,
        targetRight: Math.sin(time * 0.6) * 0.12 + 0.05,
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
    
    // Eye tracking simulation
    const eyeLookX = Math.sin(time * 0.8) * 0.4;
    const eyeLookY = Math.sin(time * 0.6) * 0.25;
    setEyeState(prev => ({
      ...prev,
      targetLookDirection: { x: eyeLookX, y: eyeLookY },
      targetSquint: isSpeaking ? Math.sin(time * 1.8) * 0.3 + 0.1 : 0.05,
    }));
    
    // Lip corner movements
    if (isSpeaking) {
      const lipMovement = Math.sin(time * 1.6) * 0.4;
      setLipState(prev => ({
        ...prev,
        targetCornerPull: lipMovement * 0.6 + 0.15,
        targetPucker: Math.sin(time * 2.1) * 0.2,
      }));
    } else {
      setLipState(prev => ({
        ...prev,
        targetCornerPull: 0.1,
        targetPucker: 0,
      }));
    }

    // Enhanced forehead movements
    if (isSpeaking) {
      const foreheadVariation = Math.sin(time * 1.3) * 0.3;
      setForeheadState(prev => ({
        ...prev,
        targetWrinkle: foreheadVariation * 0.4,
        targetRaise: Math.sin(time * 0.9) * 0.2,
      }));
    } else {
      setForeheadState(prev => ({
        ...prev,
        targetWrinkle: Math.sin(time * 0.4) * 0.1,
        targetRaise: Math.sin(time * 0.3) * 0.05,
      }));
    }
    
    // Enhanced jaw movements
    if (isSpeaking) {
      const jawVariation = Math.sin(time * 2.1) * 0.2;
      setJawState(prev => ({
        ...prev,
        targetClench: jawVariation * 0.3,
        targetShift: Math.sin(time * 1.8) * 0.1,
      }));
    } else {
      setJawState(prev => ({
        ...prev,
        targetClench: 0,
        targetShift: 0,
      }));
    }
    
    // Temple tension
    if (isSpeaking) {
      const templeVariation = Math.sin(time * 1.6) * 0.2;
      setTempleState(prev => ({
        ...prev,
        targetTension: templeVariation * 0.3,
      }));
    } else {
      setTempleState(prev => ({
        ...prev,
        targetTension: 0,
      }));
    }
    
    // Smooth transitions for all micro-expressions
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

    setForeheadState(prev => ({
      wrinkle: THREE.MathUtils.lerp(prev.wrinkle, prev.targetWrinkle, 0.12),
      raise: THREE.MathUtils.lerp(prev.raise, prev.targetRaise, 0.1),
      targetWrinkle: prev.targetWrinkle,
      targetRaise: prev.targetRaise,
    }));
    
    setJawState(prev => ({
      clench: THREE.MathUtils.lerp(prev.clench, prev.targetClench, 0.15),
      shift: THREE.MathUtils.lerp(prev.shift, prev.targetShift, 0.1),
      targetClench: prev.targetClench,
      targetShift: prev.targetShift,
    }));
    
    setTempleState(prev => ({
      tension: THREE.MathUtils.lerp(prev.tension, prev.targetTension, 0.1),
      targetTension: prev.targetTension,
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
  
  // Much faster and more reactive main animation loop
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
      
      // Much more subtle body movements
      group.current.rotation.y = Math.sin(time * 0.3) * 0.002 + headMovement.turn;
      group.current.rotation.x = headMovement.nod * 0.02;
      group.current.rotation.z = headMovement.tilt * 0.015;
      
      // Apply head movements to head bone if available
      if (headBone.current) {
        headBone.current.rotation.x += headMovement.nod * 0.1;
        headBone.current.rotation.z += headMovement.tilt * 0.1;
        headBone.current.rotation.y += headMovement.turn * 0.01;
      }
      
      if (isSpeaking) {
        // Update word gap tracking for much faster reactive pauses
        updateWordGapTracking(currentPhoneme || '');
        
        // Use enhanced lip sync with much faster word spacing and anticipation
        if (currentPhoneme) {
          const currentViseme = getVisemeFromPhoneme(currentPhoneme);
          const { jawOpen, mouthWide, lipsPursed, lowerLip, upperLip } = getJawConfigForViseme(
            currentViseme, 
            wordGapState.pauseIntensity,
            wordGapState.anticipatoryMovement
          );
          
          // Apply to jaw bone with INSTANT response for longer words
          if (jawBone.current) {
            const targetRotation = jawOpen * 0.12; // Even more pronounced
            
            // INSTANT smoothing factors - no delay for active speech
            let smoothingFactor;
            if (wordGapState.pauseIntensity > 0.5) {
              smoothingFactor = 0.5; // Fast for sentence breaks
            } else if (wordGapState.pauseIntensity > 0.2) {
              smoothingFactor = 0.85; // Very fast for word breaks
            } else if (wordGapState.pauseIntensity > 0.05) {
              smoothingFactor = 0.98; // Nearly instant for syllable breaks
            } else {
              smoothingFactor = 1.0; // COMPLETELY INSTANT for active speech
            }
            
            // Instant anticipatory response
            if (wordGapState.anticipatoryMovement > 0.3) {
              smoothingFactor = 1.0; // Always instant when anticipating
            }
            
            // For active speech, just set directly instead of lerping
            if (smoothingFactor >= 1.0) {
              setCurrentJawRotation(targetRotation);
              jawBone.current.rotation.x = targetRotation;
            } else {
              const newRotation = THREE.MathUtils.lerp(
                currentJawRotation, 
                targetRotation, 
                smoothingFactor
              );
              setCurrentJawRotation(newRotation);
              jawBone.current.rotation.x = newRotation;
            }
          }
          
          // Apply enhanced morph targets with INSTANT response
          scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.morphTargetInfluences && child.morphTargetDictionary) {
              const setMorphTarget = (names: string[], value: number) => {
                for (const name of names) {
                  if (name in child.morphTargetDictionary!) {
                    const index = child.morphTargetDictionary![name];
                    if (index !== undefined && child.morphTargetInfluences) {
                      // INSTANT smoothing speeds - no delay for active speech
                      let smoothingSpeed;
                      if (wordGapState.pauseIntensity > 0.5) {
                        smoothingSpeed = 0.6; // Fast for sentence breaks
                      } else if (wordGapState.pauseIntensity > 0.2) {
                        smoothingSpeed = 0.9; // Very fast for word breaks
                      } else if (wordGapState.pauseIntensity > 0.05) {
                        smoothingSpeed = 0.99; // Nearly instant for syllable breaks
                      } else {
                        smoothingSpeed = 1.0; // COMPLETELY INSTANT for active speech
                      }
                      
                      // Instant anticipatory response
                      if (wordGapState.anticipatoryMovement > 0.3) {
                        smoothingSpeed = 1.0; // Always instant when anticipating
                      }
                      
                      // For active speech, set directly instead of lerping
                      if (smoothingSpeed >= 1.0) {
                        child.morphTargetInfluences[index] = value;
                      } else {
                        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                          child.morphTargetInfluences[index], 
                          value, 
                          smoothingSpeed
                        );
                      }
                      break;
                    }
                  }
                }
              };
              
              // Get current expression configuration
              const expressionConfig = getExpressionConfig(currentExpression, expressionIntensity);
              
              // Apply enhanced mouth shapes with much faster word gap blending
              setMorphTarget(['mouthOpen', 'mouth_open', 'jawOpen', 'open'], jawOpen);
              setMorphTarget(['mouthWide', 'mouth_wide'], mouthWide);
              setMorphTarget(['lipsPursed', 'lips_pursed', 'mouthO', 'mouth_o', 'o'], lipsPursed);
              setMorphTarget(['lowerLipDown', 'lower_lip_down', 'lipLowerDown'], lowerLip);
              setMorphTarget(['upperLipUp', 'upper_lip_up', 'lipUpperUp'], upperLip);
              
              // ENHANCED consonant-specific shapes with better definition
              if (currentViseme === Viseme.Mb) {
                setMorphTarget(['lipsTogether', 'lips_together', 'mouthClosed'], 1.0);
                setMorphTarget(['mouthOpen', 'mouth_open', 'jawOpen', 'open'], 0); // Force complete closure
                setMorphTarget(['lipPress', 'lip_press'], 0.8); // Add lip pressure if available
              } else {
                setMorphTarget(['lipsTogether', 'lips_together', 'mouthClosed'], 0);
                setMorphTarget(['lipPress', 'lip_press'], 0);
              }
              
              if (currentViseme === Viseme.Fv) {
                setMorphTarget(['teethLowerLip', 'teeth_lower_lip', 'lipBite'], 1.0);
                setMorphTarget(['upperLipRaise', 'upper_lip_raise'], 0.3); // Slight upper lip raise
              } else {
                setMorphTarget(['teethLowerLip', 'teeth_lower_lip', 'lipBite'], 0);
                setMorphTarget(['upperLipRaise', 'upper_lip_raise'], 0);
              }
              
              if (currentViseme === Viseme.Th) {
                setMorphTarget(['tongueOut', 'tongue_out'], 0.8); // More pronounced tongue
                setMorphTarget(['teethShow', 'teeth_show'], 0.6); // Show teeth if available
              } else {
                setMorphTarget(['tongueOut', 'tongue_out'], 0);
                setMorphTarget(['teethShow', 'teeth_show'], 0);
              }
              
              // Enhanced sibilant definition
              if (currentViseme === Viseme.Ss) {
                setMorphTarget(['teethTogether', 'teeth_together'], 0.7); // Teeth closer for S sounds
                setMorphTarget(['lipCornerBack', 'lip_corner_back'], 0.4); // Slight smile for sibilants
              } else {
                setMorphTarget(['teethTogether', 'teeth_together'], 0);
                setMorphTarget(['lipCornerBack', 'lip_corner_back'], 0);
              }
              
              // Enhanced SH/CH sounds
              if (currentViseme === Viseme.Sh) {
                setMorphTarget(['lipProtrude', 'lip_protrude'], 0.6); // Lip protrusion for SH
                setMorphTarget(['cheekSuck', 'cheek_suck'], 0.3); // Slight cheek involvement
              } else {
                setMorphTarget(['lipProtrude', 'lip_protrude'], 0);
                setMorphTarget(['cheekSuck', 'cheek_suck'], 0);
              }
              
              // Enhanced W sound
              if (currentViseme === Viseme.Wy) {
                setMorphTarget(['lipRound', 'lip_round'], 0.8); // Strong rounding for W
                setMorphTarget(['lipForward', 'lip_forward'], 0.7); // Forward lip movement
              } else {
                setMorphTarget(['lipRound', 'lip_round'], 0);
                setMorphTarget(['lipForward', 'lip_forward'], 0);
              }

              // Apply enhanced facial expressions
              setMorphTarget(['mouthSmile', 'mouth_smile', 'smile'], 
                expressionConfig.smile + lipState.cornerPull);
              setMorphTarget(['cheekRaise', 'cheek_raise', 'cheekPuff'], 
                expressionConfig.cheekRaise + cheekState.left);

              // Enhanced eyebrow control
              setMorphTarget(['browInnerUp'], 
                Math.max(0, Math.min(0.8, (expressionConfig.eyebrowRaise + eyebrowState.left) * 0.4)));
              setMorphTarget(['browInnerUpLeft'], 
                Math.max(0, Math.min(0.9, (expressionConfig.eyebrowRaise + eyebrowState.left) * 0.45)));
              setMorphTarget(['browInnerUpRight'], 
                Math.max(0, Math.min(0.9, (expressionConfig.eyebrowRaise + eyebrowState.right) * 0.4)));

              // Expression-specific asymmetry
              if (currentExpression === ExpressionType.Skeptical) {
                setMorphTarget(['browOuterUpLeft'], 
                  Math.max(0, Math.min(0.8, (expressionConfig.eyebrowRaise + eyebrowState.left) * 0.6)));
                setMorphTarget(['browOuterUpRight'], 
                  Math.max(0, Math.min(0.3, (expressionConfig.eyebrowRaise + eyebrowState.right) * 0.2)));
              } else {
                setMorphTarget(['browOuterUpLeft'], 
                  Math.max(0, Math.min(0.7, (expressionConfig.eyebrowRaise + eyebrowState.left) * 0.35)));
                setMorphTarget(['browOuterUpRight'], 
                  Math.max(0, Math.min(0.7, (expressionConfig.eyebrowRaise + eyebrowState.right) * 0.35)));
              }

              setMorphTarget(['browDownLeft'], 
                Math.max(0, Math.min(0.4, -expressionConfig.eyebrowRaise * 0.25)));
              setMorphTarget(['browDownRight'], 
                Math.max(0, Math.min(0.4, -expressionConfig.eyebrowRaise * 0.25)));

              // Apply enhanced facial features
              setMorphTarget(['foreheadWrinkle', 'forehead_wrinkle', 'browWrinkle'], 
                expressionConfig.foreheadWrinkle + foreheadState.wrinkle);
              setMorphTarget(['foreheadRaise', 'forehead_raise', 'browRaise'], 
                expressionConfig.foreheadRaise + foreheadState.raise);
              setMorphTarget(['jawClench', 'jaw_clench', 'mouthTense'], 
                expressionConfig.jawClench + jawState.clench);
              setMorphTarget(['jawShift', 'jaw_shift', 'jawSide'], 
                jawState.shift);
              setMorphTarget(['templeTension', 'temple_tension', 'templePress'], 
                expressionConfig.templeTension + templeState.tension);

              setMorphTarget(['cheekRaiseLeft', 'cheek_raise_left'], 
                expressionConfig.cheekRaise + cheekState.left);
              setMorphTarget(['cheekRaiseRight', 'cheek_raise_right'], 
                expressionConfig.cheekRaise + cheekState.right);

              setMorphTarget(['lipCornerPullLeft', 'lip_corner_pull_left'], 
                (expressionConfig.lipCornerPull + lipState.cornerPull) * 1.1);
              setMorphTarget(['lipCornerPullRight', 'lip_corner_pull_right'], 
                (expressionConfig.lipCornerPull + lipState.cornerPull) * 0.9);

              setMorphTarget(['noseFlare', 'nose_flare', 'nostrilFlare'], 
                expressionConfig.noseFlare + noseState.flare);
              setMorphTarget(['eyeSquint', 'eye_squint', 'squint'], 
                expressionConfig.eyeSquint + eyeState.squint);
              
              setMorphTarget(['lipCornerPull', 'lip_corner_pull', 'mouthCornerPull'], 
                expressionConfig.lipCornerPull + lipState.cornerPull);
              setMorphTarget(['lipPucker', 'lip_pucker', 'mouthPucker'], lipState.pucker);
              
              // Enhanced blinking
              if (isBlinking) {
                setMorphTarget(['eyesClosed', 'eyes_closed', 'blink', 'eyeBlink'], blinkIntensity);
              } else {
                setMorphTarget(['eyesClosed', 'eyes_closed', 'blink', 'eyeBlink'], 0);
              }
              
              // Eye look direction
              setMorphTarget(['eyeLookLeft', 'eye_look_left'], Math.max(0, -eyeState.lookDirection.x));
              setMorphTarget(['eyeLookRight', 'eye_look_right'], Math.max(0, eyeState.lookDirection.x));
              setMorphTarget(['eyeLookUp', 'eye_look_up'], Math.max(0, eyeState.lookDirection.y));
              setMorphTarget(['eyeLookDown', 'eye_look_down'], Math.max(0, -eyeState.lookDirection.y));
            }
          });
        } else {
          // Enhanced fallback animation with much more reactive word spacing
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
              setTransitionSpeed(0.2); // Slower transition to closed for more natural pauses
            } else {
              setCurrentMouthShape(MouthShape.WideOpen);
              setTransitionSpeed(0.5);
            }
            
            setTargetJawRotation(getJawRotationForShape(currentMouthShape));
            
            // Better timing for more natural word spacing
            const nextChangeDelay = currentMouthShape === MouthShape.Closed 
              ? 0.12 + Math.random() * 0.18  // Longer pauses when closed
              : 0.06 + Math.random() * 0.08; // Shorter transitions between sounds
            
            setNextShapeChangeTime(lipSyncTime + nextChangeDelay);
            
            if (lipSyncTime > 1000) {
              lipSyncClock.start();
              setNextShapeChangeTime(nextChangeDelay);
            }
          }
          
          // Smooth transitions with much more reactive word spacing consideration
          const newRotation = THREE.MathUtils.lerp(
            currentJawRotation, 
            targetJawRotation, 
            transitionSpeed
          );
          setCurrentJawRotation(newRotation);
          
          if (jawBone.current) {
            jawBone.current.rotation.x = newRotation;
          }
          
          // Apply fallback morph targets with much more reactive expressions
          scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.morphTargetInfluences && child.morphTargetDictionary) {
              const applyMorphIfExists = (name: string, value: number) => {
                if (name in child.morphTargetDictionary!) {
                  const index = child.morphTargetDictionary![name];
                  if (index !== undefined && child.morphTargetInfluences) {
                    // INSTANT smoothing speeds for fallback animation too
                    let smoothingSpeed;
                    if (wordGapState.pauseIntensity > 0.6) {
                      smoothingSpeed = 0.3; // Moderate for sentence breaks
                    } else if (wordGapState.pauseIntensity > 0.3) {
                      smoothingSpeed = 0.7; // Fast for word breaks
                    } else if (wordGapState.pauseIntensity > 0.1) {
                      smoothingSpeed = 0.95; // Very fast for syllable breaks
                    } else {
                      smoothingSpeed = 1.0; // COMPLETELY INSTANT for active speech
                    }
                    
                    // Instant boost for anticipated movements
                    if (wordGapState.anticipatoryMovement > 0.5) {
                      smoothingSpeed = 1.0; // Always instant when anticipating
                    }
                    
                    // For active speech, set directly instead of lerping
                    if (smoothingSpeed >= 1.0) {
                      child.morphTargetInfluences[index] = value;
                    } else {
                      child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                        child.morphTargetInfluences[index], 
                        value, 
                        smoothingSpeed
                      );
                    }
                  }
                }
              };
              
              const expressionConfig = getExpressionConfig(currentExpression, expressionIntensity);
              
              // Apply mouth shape values with much more reactive word spacing
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
                case MouthShape.Closed:
                  // Natural rest position with slight breathing
                  openValue = 0.01 + Math.sin(time * 2) * 0.005;
                  wideValue = 0.01;
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

              // Enhanced eyebrow control
              applyMorphIfExists('browInnerUp', Math.max(0, Math.min(0.8, (expressionConfig.eyebrowRaise + eyebrowState.left) * 0.4)));
              applyMorphIfExists('browOuterUpLeft', Math.max(0, Math.min(0.7, (expressionConfig.eyebrowRaise + eyebrowState.left) * 0.35)));
              applyMorphIfExists('browOuterUpRight', Math.max(0, Math.min(0.7, (expressionConfig.eyebrowRaise + eyebrowState.right) * 0.35)));
              applyMorphIfExists('browDownLeft', Math.max(0, Math.min(0.4, -expressionConfig.eyebrowRaise * 0.25)));
              applyMorphIfExists('browDownRight', Math.max(0, Math.min(0.4, -expressionConfig.eyebrowRaise * 0.25)));

              applyMorphIfExists('noseFlare', expressionConfig.noseFlare + noseState.flare);
              applyMorphIfExists('nose_flare', expressionConfig.noseFlare + noseState.flare);
              applyMorphIfExists('eyeSquint', expressionConfig.eyeSquint + eyeState.squint);
              applyMorphIfExists('eye_squint', expressionConfig.eyeSquint + eyeState.squint);
              
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
        // Reset word gap state when not speaking
        setWordGapState({
          lastPhoneme: '',
          silenceFrames: 0,
          isInPause: false,
          pauseIntensity: 0,
          anticipatoryMovement: 0,
          phonemeHistory: [],
          nextPhonemePrep: 0,
        });
        
        // Enhanced idle state with natural breathing
        if (jawBone.current) {
          // Natural breathing pattern when idle
          const breathingPattern = Math.sin(time * 1.5) * 0.008;
          jawBone.current.rotation.x = THREE.MathUtils.lerp(jawBone.current.rotation.x, breathingPattern, 0.05);
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
            
            const expressionConfig = getExpressionConfig(currentExpression, expressionIntensity);
            
            // Natural breathing mouth position
            const breathingMouth = Math.sin(time * 1.5) * 0.01 + 0.005;
            
            // Reset mouth shapes with subtle breathing
            resetMorphTarget('mouthOpen', breathingMouth);
            resetMorphTarget('mouth_open', breathingMouth);
            resetMorphTarget('jawOpen', breathingMouth);
            resetMorphTarget('mouthWide', breathingMouth * 0.5);
            resetMorphTarget('mouth_wide', breathingMouth * 0.5);
            resetMorphTarget('lipsPursed', 0);
            resetMorphTarget('lips_pursed', 0);
            resetMorphTarget('mouthO', 0);
            resetMorphTarget('mouth_o', 0);
            
            // Maintain enhanced expressions even when idle
            resetMorphTarget('mouthSmile', expressionConfig.smile + lipState.cornerPull);
            resetMorphTarget('mouth_smile', expressionConfig.smile + lipState.cornerPull);
            resetMorphTarget('cheekRaise', expressionConfig.cheekRaise + cheekState.left);
            resetMorphTarget('cheek_raise', expressionConfig.cheekRaise + cheekState.right);

            // Enhanced facial features for idle state
            resetMorphTarget('foreheadWrinkle', expressionConfig.foreheadWrinkle + foreheadState.wrinkle);
            resetMorphTarget('forehead_wrinkle', expressionConfig.foreheadWrinkle + foreheadState.wrinkle);
            resetMorphTarget('browWrinkle', expressionConfig.foreheadWrinkle + foreheadState.wrinkle);
            resetMorphTarget('foreheadRaise', expressionConfig.foreheadRaise + foreheadState.raise);
            resetMorphTarget('forehead_raise', expressionConfig.foreheadRaise + foreheadState.raise);
            resetMorphTarget('browRaise', expressionConfig.foreheadRaise + foreheadState.raise);

            resetMorphTarget('browInnerUp', Math.max(0, Math.min(0.8, (expressionConfig.eyebrowRaise + eyebrowState.left) * 0.4)));
            resetMorphTarget('browOuterUpLeft', Math.max(0, Math.min(0.7, (expressionConfig.eyebrowRaise + eyebrowState.left) * 0.35)));
            resetMorphTarget('browOuterUpRight', Math.max(0, Math.min(0.7, (expressionConfig.eyebrowRaise + eyebrowState.right) * 0.35)));
            resetMorphTarget('browDownLeft', Math.max(0, Math.min(0.4, -expressionConfig.eyebrowRaise * 0.25)));
            resetMorphTarget('browDownRight', Math.max(0, Math.min(0.4, -expressionConfig.eyebrowRaise * 0.25)));

            resetMorphTarget('noseFlare', expressionConfig.noseFlare + noseState.flare);
            resetMorphTarget('nose_flare', expressionConfig.noseFlare + noseState.flare);
            resetMorphTarget('eyeSquint', expressionConfig.eyeSquint + eyeState.squint);
            resetMorphTarget('eye_squint', expressionConfig.eyeSquint + eyeState.squint);
            
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
        rotation={[0, 0.1, 0]}
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
        position: [0, 0.0, 1.4] as [number, number, number],
        fov: 45
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
