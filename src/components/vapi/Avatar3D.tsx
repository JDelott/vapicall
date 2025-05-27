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
  const [currentJawRotation, setCurrentJawRotation] = useState({ x: 0, y: 0, z: 0 });
  const [targetJawRotation, setTargetJawRotation] = useState({ x: 0, y: 0, z: 0 });
  
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
  
  // Enhanced word gap tracking with TEXT PREDICTION and phoneme mapping
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
  
  // Enhanced word gap tracking with TEXT PREDICTION and phoneme mapping
  const updateWordGapTracking = (phoneme: string) => {
    const currentViseme = getVisemeFromPhoneme(phoneme);
    const isCurrentlySilent = currentViseme === Viseme.Silent || !phoneme || phoneme === '' || phoneme === 'SP' || phoneme === 'SIL';
    
    setWordGapState(prev => {
      const newState = { ...prev };
      
      // Track phoneme history for ADVANCED anticipation - MUCH LONGER HISTORY
      if (phoneme !== prev.lastPhoneme) {
        newState.phonemeHistory = [...prev.phonemeHistory.slice(-8), phoneme]; // Increased from 5 to 8 for better prediction
        newState.lastPhoneme = phoneme;
        
        // ADVANCED anticipatory movement with phoneme sequence analysis
        if (!isCurrentlySilent) {
          const upcomingViseme = getVisemeFromPhoneme(phoneme);
          let baseAnticipation = getAnticipationForViseme(upcomingViseme) * 1.8; // Increased from 1.5
          
          // ANALYZE phoneme patterns for better prediction
          const recentPhonemes = newState.phonemeHistory.slice(-4);
          const speechLength = recentPhonemes.filter(p => p && p !== 'SP' && p !== 'SIL').length;
          
          // BOOST anticipation based on speech patterns
          if (speechLength > 3) {
            baseAnticipation *= 1.5; // Major boost for continuous speech
          } else if (speechLength > 2) {
            baseAnticipation *= 1.3; // Moderate boost for medium speech
          } else if (speechLength > 1) {
            baseAnticipation *= 1.1; // Small boost for short speech
          }
          
          // DETECT speech rhythm and boost accordingly
          const hasVowelConsonantPattern = detectVowelConsonantPattern(recentPhonemes);
          if (hasVowelConsonantPattern) {
            baseAnticipation *= 1.2; // Boost for natural speech rhythm
          }
          
          // PREDICT upcoming mouth movements based on phoneme sequences
          const upcomingMovementIntensity = predictUpcomingMovement(recentPhonemes);
          baseAnticipation *= upcomingMovementIntensity;
          
          newState.anticipatoryMovement = baseAnticipation;
        }
      }
      
      // ULTRA-sensitive silence tracking with PATTERN RECOGNITION
      if (isCurrentlySilent) {
        newState.silenceFrames++;
      } else {
        newState.silenceFrames = 0; // Reset immediately when sound detected
      }
      
      // INTELLIGENT pause detection based on speech patterns
      const recentActivity = newState.phonemeHistory.slice(-6).filter(p => p && p !== 'SP' && p !== 'SIL').length;
      const isShortPause = newState.silenceFrames >= 1 && newState.silenceFrames <= 1;
      const isMediumPause = newState.silenceFrames >= 2 && newState.silenceFrames <= 3; // Reduced for faster response
      const isLongPause = newState.silenceFrames >= 4; // Reduced from 5
      
      newState.isInPause = isShortPause || isMediumPause || isLongPause;
      
      // ADAPTIVE pause intensities based on speech context
      let targetIntensity = 0;
      if (isShortPause && recentActivity > 3) {
        targetIntensity = 0.02; // Minimal interference during active speech
      } else if (isShortPause) {
        targetIntensity = 0.05; // Slightly more for less active speech
      } else if (isMediumPause && recentActivity > 2) {
        targetIntensity = 0.1; // Reduced interference during medium speech
      } else if (isMediumPause) {
        targetIntensity = 0.15; // Normal for medium pauses
      } else if (isLongPause) {
        targetIntensity = 0.3; // Reduced from 0.4 - less interference overall
      }
      
      // INSTANT pause intensity transitions with CONTEXT AWARENESS
      const transitionSpeed = recentActivity > 3 ? 0.9 : 0.7; // Faster during active speech
      if (newState.isInPause) {
        newState.pauseIntensity = THREE.MathUtils.lerp(newState.pauseIntensity, targetIntensity, transitionSpeed);
      } else {
        newState.pauseIntensity = THREE.MathUtils.lerp(newState.pauseIntensity, 0, 0.95); // Very fast recovery
      }
      
      // CONTEXT-AWARE decay of anticipatory movement
      const decaySpeed = recentActivity > 3 ? 0.5 : 0.4; // Slower decay during active speech
      newState.anticipatoryMovement = THREE.MathUtils.lerp(newState.anticipatoryMovement, 0, decaySpeed);
      
      return newState;
    });
  };

  // NEW: Detect vowel-consonant patterns for natural speech rhythm
  const detectVowelConsonantPattern = (phonemes: string[]): boolean => {
    if (phonemes.length < 3) return false;
    
    const vowelPhonemes = ['AA', 'AH', 'AE', 'AY', 'AW', 'OY', 'EH', 'EY', 'IY', 'IH', 'OW', 'AO', 'UW', 'UH', 'ER'];
    const consonantPhonemes = ['M', 'B', 'P', 'F', 'V', 'TH', 'DH', 'T', 'D', 'N', 'L', 'SH', 'ZH', 'CH', 'JH', 'S', 'Z', 'K', 'G', 'NG', 'W', 'Y', 'HH', 'R'];
    
    let pattern = '';
    for (const phoneme of phonemes.slice(-3)) {
      if (vowelPhonemes.includes(phoneme)) {
        pattern += 'V';
      } else if (consonantPhonemes.includes(phoneme)) {
        pattern += 'C';
      }
    }
    
    // Detect common speech patterns
    return pattern.includes('CV') || pattern.includes('VC') || pattern === 'CVC' || pattern === 'VCV';
  };

  // NEW: Predict upcoming movement intensity based on phoneme sequences
  const predictUpcomingMovement = (recentPhonemes: string[]): number => {
    let intensity = 1.0;
    
    // ANALYZE recent phoneme transitions for movement prediction
    const transitions = [];
    for (let i = 1; i < recentPhonemes.length; i++) {
      if (recentPhonemes[i-1] && recentPhonemes[i]) {
        transitions.push(`${recentPhonemes[i-1]}->${recentPhonemes[i]}`);
      }
    }
    
    // BOOST for high-movement transitions
    const highMovementTransitions = [
      'M->AA', 'P->AA', 'B->AA', // Lip closure to open vowel
      'AA->M', 'AA->P', 'AA->B', // Open vowel to lip closure
      'UW->AE', 'OW->AE', // Rounded to wide
      'AE->UW', 'AE->OW', // Wide to rounded
      'S->SH', 'Z->ZH', // Sibilant transitions
    ];
    
    for (const transition of transitions) {
      if (highMovementTransitions.some(hmt => transition.includes(hmt.split('->')[0]) && transition.includes(hmt.split('->')[1]))) {
        intensity *= 1.3; // Boost for high-movement transitions
      }
    }
    
    // BOOST for alternating vowel-consonant patterns
    const lastThree = recentPhonemes.slice(-3);
    const vowels = ['AA', 'AH', 'AE', 'AY', 'EH', 'IY', 'OW', 'UW'];
    const consonants = ['M', 'B', 'P', 'F', 'V', 'T', 'D', 'S', 'Z', 'SH', 'CH'];
    
    let alternating = 0;
    for (let i = 1; i < lastThree.length; i++) {
      const prev = lastThree[i-1];
      const curr = lastThree[i];
      if ((vowels.includes(prev) && consonants.includes(curr)) || 
          (consonants.includes(prev) && vowels.includes(curr))) {
        alternating++;
      }
    }
    
    if (alternating >= 2) {
      intensity *= 1.4; // Strong boost for alternating patterns
    } else if (alternating >= 1) {
      intensity *= 1.2; // Moderate boost
    }
    
    // BOOST for rapid speech detection
    const rapidSpeechIndicators = recentPhonemes.filter(p => p && p !== 'SP' && p !== 'SIL').length;
    if (rapidSpeechIndicators >= 4) {
      intensity *= 1.5; // Major boost for rapid speech
    } else if (rapidSpeechIndicators >= 3) {
      intensity *= 1.3; // Moderate boost
    }
    
    return Math.min(intensity, 2.5); // Cap at 2.5x for safety
  };

  // ENHANCED anticipation values with CONTEXT AWARENESS
  const getAnticipationForViseme = (viseme: Viseme): number => {
    switch (viseme) {
      case Viseme.Ah:
      case Viseme.Ae:
        return 1.5; // Increased from 1.3 - ultra-fast preparation for big openings
      case Viseme.Oh:
      case Viseme.Oo:
        return 1.3; // Increased from 1.1 - faster lip rounding preparation
      case Viseme.Mb:
        return 1.8; // Increased from 1.5 - ultra-fast lip closure preparation
      case Viseme.Fv:
        return 1.4; // Increased from 1.2 - faster lip-teeth preparation
      case Viseme.Ee:
        return 1.2; // Increased from 1.0 - faster wide mouth preparation
      case Viseme.Sh:
        return 1.3; // NEW: Fast preparation for lip protrusion
      case Viseme.Ss:
        return 1.1; // NEW: Fast preparation for sibilants
      case Viseme.Th:
        return 1.2; // NEW: Fast preparation for tongue protrusion
      default:
        return 1.0; // Increased from 0.8 - faster general preparation
    }
  };

  // ULTRA-ENHANCED jaw configuration with PREDICTIVE MOVEMENT
  const getJawConfigForViseme = (viseme: Viseme, pauseIntensity: number = 0, anticipation: number = 0) => {
    const baseConfig = (() => {
      switch (viseme) {
        case Viseme.Silent:
          return { 
            jawOpen: 0, 
            mouthWide: 0, 
            lipsPursed: 0, 
            lowerLip: 0, 
            upperLip: 0,
            jawForward: 0,
            jawSide: 0
          };
        
        // ENHANCED VOWELS - More pronounced jaw movements
        case Viseme.Ah:
          return { 
            jawOpen: 0.45,      // Increased from 0.35 - more dramatic opening
            mouthWide: 0.3,     // Increased from 0.25
            lipsPursed: 0, 
            lowerLip: 0, 
            upperLip: 0,
            jawForward: 0.1,    // NEW: Slight forward jaw movement for better articulation
            jawSide: 0
          };
        
        case Viseme.Ae:
          return { 
            jawOpen: 0.4,       // Increased from 0.3
            mouthWide: 0.45,    // Increased from 0.35 - wider for "cat" sound
            lipsPursed: 0, 
            lowerLip: 0, 
            upperLip: 0,
            jawForward: 0.05,   // Slight forward movement
            jawSide: 0
          };
        
        case Viseme.Ay:
          return { 
            jawOpen: 0.3,       // Increased from 0.22
            mouthWide: 0.4,     // Increased from 0.3
            lipsPursed: 0, 
            lowerLip: 0, 
            upperLip: 0,
            jawForward: 0.08,   // Forward movement for diphthong
            jawSide: 0
          };
        
        case Viseme.Eh:
          return { 
            jawOpen: 0.28,      // Increased from 0.22
            mouthWide: 0.35,    // Increased from 0.3
            lipsPursed: 0, 
            lowerLip: 0, 
            upperLip: 0,
            jawForward: 0.05,
            jawSide: 0
          };
        
        case Viseme.Ee:
        return {
            jawOpen: 0.15,      // Increased from 0.12
            mouthWide: 0.5,     // Increased from 0.35 - much wider for "ee"
            lipsPursed: 0, 
            lowerLip: 0, 
            upperLip: 0,
            jawForward: 0,
            jawSide: 0
          };
        
        case Viseme.Oh:
        return {
            jawOpen: 0.3,       // Increased from 0.22
            mouthWide: 0.1,     // Reduced from 0.15 - rounder
            lipsPursed: 0.6,    // Increased from 0.4
            lowerLip: 0, 
            upperLip: 0,
            jawForward: 0.15,   // More forward for rounded vowels
            jawSide: 0
          };
        
        case Viseme.Oo:
        return {
            jawOpen: 0.2,       // Increased from 0.15
            mouthWide: 0, 
            lipsPursed: 0.8,    // Increased from 0.6 - more pursing
            lowerLip: 0.1,      // Slight lip involvement
            upperLip: 0.1,
            jawForward: 0.2,    // Strong forward movement for "oo"
            jawSide: 0
          };
        
        case Viseme.Er:
        return {
            jawOpen: 0.25,      // Increased from 0.18
            mouthWide: 0.3,     // Increased from 0.25
            lipsPursed: 0.3,    // Increased from 0.2
            lowerLip: 0, 
            upperLip: 0,
            jawForward: 0.1,
            jawSide: 0
          };
        
        // ENHANCED CONSONANTS - More realistic jaw positioning
        case Viseme.Mb: // M, B, P - Complete lip closure with jaw positioning
          return { 
            jawOpen: 0,
            mouthWide: 0, 
            lipsPursed: 0, 
            lowerLip: 1.0, 
            upperLip: 1.0,
            jawForward: 0.05,   // Slight forward for better lip contact
            jawSide: 0
          };
        
        case Viseme.Fv: // F, V - Lower lip to upper teeth
          return { 
            jawOpen: 0.08,      // Increased from 0.06
            mouthWide: 0.15,    // Increased from 0.12
            lipsPursed: 0, 
            lowerLip: 1.0,      // Increased from 0.95
            upperLip: 0.15,     // Increased from 0.1
            jawForward: 0,
            jawSide: 0
          };
        
        case Viseme.Th: // TH, DH - Tongue tip visible between teeth
          return { 
            jawOpen: 0.12,      // Increased from 0.08
            mouthWide: 0.25,    // Increased from 0.18
            lipsPursed: 0, 
            lowerLip: 0.2,      // Increased from 0.15
            upperLip: 0.15,     // Increased from 0.1
            jawForward: 0.05,   // Forward for tongue protrusion
            jawSide: 0
          };
        
        case Viseme.Td: // T, D, N, L - Tongue to alveolar ridge
          return { 
            jawOpen: 0.18,      // Increased from 0.12
            mouthWide: 0.2,     // Increased from 0.15
            lipsPursed: 0, 
            lowerLip: 0.08,     // Increased from 0.05
            upperLip: 0.08,     // Increased from 0.05
            jawForward: 0.03,
            jawSide: 0
          };
        
        case Viseme.Sh: // SH, ZH, CH, JH - Lip rounding with protrusion
          return { 
            jawOpen: 0.2,       // Increased from 0.16
            mouthWide: 0.15,    // Reduced from 0.18 for rounding
            lipsPursed: 0.6,    // Increased from 0.4
            lowerLip: 0.15,     // Increased from 0.1
            upperLip: 0.15,     // Increased from 0.1
            jawForward: 0.12,   // Forward for lip protrusion
            jawSide: 0
          };
        
        case Viseme.Ss: // S, Z - Slight smile position for sibilants
          return { 
            jawOpen: 0.1,       // Increased from 0.08
            mouthWide: 0.4,     // Increased from 0.32
            lipsPursed: 0, 
            lowerLip: 0, 
            upperLip: 0,
            jawForward: 0,
            jawSide: 0
          };
        
        case Viseme.Kg: // K, G, NG - Back of tongue, neutral lips
          return { 
            jawOpen: 0.2,       // Increased from 0.16
            mouthWide: 0.18,    // Increased from 0.12
            lipsPursed: 0, 
            lowerLip: 0, 
            upperLip: 0,
            jawForward: 0,
            jawSide: 0.02       // Slight side movement for velar sounds
          };
        
        case Viseme.Wy: // W, Y - Strong lip rounding for W
      return { 
            jawOpen: 0.15,      // Increased from 0.1
            mouthWide: 0, 
            lipsPursed: 0.8,    // Increased from 0.65
            lowerLip: 0.3,      // Increased from 0.2
            upperLip: 0.3,      // Increased from 0.2
            jawForward: 0.18,   // Strong forward for W
            jawSide: 0
          };
        
        case Viseme.Hh: // HH - Slight opening, relaxed
      return { 
            jawOpen: 0.15,      // Increased from 0.1
            mouthWide: 0.2,     // Increased from 0.15
            lipsPursed: 0, 
            lowerLip: 0, 
            upperLip: 0,
            jawForward: 0,
            jawSide: 0
          };
        
        default:
      return { 
            jawOpen: 0, 
            mouthWide: 0, 
            lipsPursed: 0, 
            lowerLip: 0, 
            upperLip: 0,
            jawForward: 0,
            jawSide: 0
          };
      }
    })();
    
    // ULTRA-AGGRESSIVE anticipatory movement with PREDICTIVE ENHANCEMENT
    if (anticipation > 0) {
      const anticipationFactor = anticipation * 1.2; // Increased from 0.9 - maximum aggression
      baseConfig.jawOpen += anticipationFactor * 0.3; // Increased from 0.25
      baseConfig.mouthWide += anticipationFactor * 0.25; // Increased from 0.2
      baseConfig.jawForward += anticipationFactor * 0.2; // Increased from 0.15
      
      // ULTRA-aggressive preparation for specific movements
      if (viseme === Viseme.Mb || viseme === Viseme.Fv) {
        baseConfig.lowerLip += anticipationFactor * 0.6; // Increased from 0.5
        baseConfig.upperLip += anticipationFactor * 0.3; // NEW: Upper lip preparation
      }
      if (viseme === Viseme.Oh || viseme === Viseme.Oo || viseme === Viseme.Wy) {
        baseConfig.lipsPursed += anticipationFactor * 0.5; // Increased from 0.4
        baseConfig.jawForward += anticipationFactor * 0.25; // Increased from 0.2
      }
      if (viseme === Viseme.Ah || viseme === Viseme.Ae) {
        baseConfig.jawOpen += anticipationFactor * 0.2; // Extra jaw opening preparation
        baseConfig.mouthWide += anticipationFactor * 0.15; // Extra width preparation
      }
      if (viseme === Viseme.Ee) {
        baseConfig.mouthWide += anticipationFactor * 0.3; // Extra wide preparation for "ee"
      }
    }
    
    // MINIMAL pause modifications with CONTEXT AWARENESS
    if (pauseIntensity > 0) {
      const time = Date.now() * 0.001;
      const breathingCycle = Math.sin(time * 2.5) * 0.5 + 0.5; // Faster breathing
      const microMovement = Math.sin(time * 8) * 0.01; // Faster micro-movements
      
      // MINIMAL rest position changes - prioritize speech speed
      let restPosition = 0.01 + breathingCycle * 0.005 + microMovement; // Reduced base rest
      
      // CONTEXT-AWARE pause modifications
      if (pauseIntensity < 0.1) {
        restPosition *= 1.02; // Minimal change for micro-pauses
      } else if (pauseIntensity < 0.3) {
        restPosition *= 0.99; // Tiny change for short pauses
      } else {
        restPosition *= 0.9; // Moderate change only for longer pauses
      }
      
      // ULTRA-minimal blending - maximum speech priority
      const jawBlend = pauseIntensity * 0.2; // Reduced from 0.4
      const wideBlend = pauseIntensity * 0.15; // Reduced from 0.3
      const pursedBlend = pauseIntensity * 0.3; // Reduced from 0.5
      const lipBlend = pauseIntensity * 0.4; // Reduced from 0.6
      const forwardBlend = pauseIntensity * 0.2; // Reduced from 0.4
      
      baseConfig.jawOpen = THREE.MathUtils.lerp(baseConfig.jawOpen, restPosition, jawBlend);
      baseConfig.mouthWide = THREE.MathUtils.lerp(baseConfig.mouthWide, restPosition * 0.2, wideBlend);
      baseConfig.lipsPursed = THREE.MathUtils.lerp(baseConfig.lipsPursed, 0, pursedBlend);
      baseConfig.lowerLip = THREE.MathUtils.lerp(baseConfig.lowerLip, 0, lipBlend);
      baseConfig.upperLip = THREE.MathUtils.lerp(baseConfig.upperLip, 0, lipBlend);
      baseConfig.jawForward = THREE.MathUtils.lerp(baseConfig.jawForward, 0, forwardBlend);
    }
    
    return baseConfig;
  };

  // Enhanced jaw rotation calculation with forward/side movement
  const getJawRotationForShape = (shape: MouthShape): { x: number, y: number, z: number } => {
    switch (shape) {
      case MouthShape.Closed: 
        return { x: 0, y: 0, z: 0 };
      case MouthShape.SlightlyOpen: 
        return { x: 0.04, y: 0, z: 0 }; // Increased from 0.03
      case MouthShape.Open: 
        return { x: 0.08, y: 0, z: 0 }; // Increased from 0.06
      case MouthShape.WideOpen: 
        return { x: 0.15, y: 0, z: 0 }; // Increased from 0.1
      case MouthShape.OShape: 
        return { x: 0.07, y: 0.02, z: 0 }; // Added forward movement
      case MouthShape.EShape: 
        return { x: 0.06, y: 0, z: 0 }; // Increased from 0.04
      default: 
        return { x: 0, y: 0, z: 0 };
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

  // Enhanced expression configuration with more natural "cracked smile" default
  const getExpressionConfig = (expression: ExpressionType, intensity: number) => {
    const baseIntensity = intensity * 0.6; // Reduced from 0.8 for more subtle expressions
    
    switch (expression) {
      case ExpressionType.Warm_Smile:
        return {
          smile: baseIntensity * 0.45, // Increased from 0.35 for more pronounced smile
          cheekRaise: baseIntensity * 0.3, // Increased from 0.25
          eyebrowRaise: baseIntensity * 0.18, // Increased from 0.15
          noseFlare: 0,
          eyeSquint: baseIntensity * 0.2, // Increased from 0.15 - more crow's feet
          lipCornerPull: baseIntensity * 0.25, // Increased from 0.2
          headTilt: baseIntensity * 0.025, // Increased from 0.02
          foreheadWrinkle: 0,
          foreheadRaise: baseIntensity * 0.08, // Increased from 0.05
          jawClench: 0,
          templeTension: 0,
          // Enhanced smile parameters for more natural "cracked smile"
          lipCornerLift: baseIntensity * 0.4, // Increased from 0.3
          upperLipRaise: baseIntensity * 0.3, // Increased from 0.25 - show more teeth
          lowerLipDepress: baseIntensity * 0.2, // Increased from 0.15
          mouthCornerDimple: baseIntensity * 0.25, // Increased from 0.2
          cheekAppleRaise: baseIntensity * 0.35, // Increased from 0.3
          teethShow: baseIntensity * 0.7, // Increased from 0.6 - more teeth showing
          jawOpenReduction: baseIntensity * 0.25, // Reduced from 0.3 for more natural look
          asymmetricSmile: baseIntensity * 0.15, // Slight asymmetry
        };
      
      case ExpressionType.Joy:
        return {
          smile: baseIntensity * 0.6, // Increased from 0.5
          cheekRaise: baseIntensity * 0.45, // Increased from 0.4
          eyebrowRaise: baseIntensity * 0.25, // Increased from 0.2
          noseFlare: baseIntensity * 0.08, // Increased from 0.05
          eyeSquint: baseIntensity * 0.3, // Increased from 0.25
          lipCornerPull: baseIntensity * 0.35, // Increased from 0.3
          headTilt: baseIntensity * 0.05, // Increased from 0.04
          foreheadWrinkle: 0,
          foreheadRaise: baseIntensity * 0.12, // Increased from 0.1
          jawClench: 0,
          templeTension: 0,
          // Enhanced joy with pronounced "cracked smile"
          lipCornerLift: baseIntensity * 0.5,
          upperLipRaise: baseIntensity * 0.4, // More upper lip raise
          lowerLipDepress: baseIntensity * 0.3, // More lower lip depression
          mouthCornerDimple: baseIntensity * 0.4,
          cheekAppleRaise: baseIntensity * 0.55,
          teethShow: baseIntensity * 0.85, // Even more teeth showing
          jawOpenReduction: baseIntensity * 0.35,
          asymmetricSmile: baseIntensity * 0.2, // More asymmetry for joy
        };
      
      case ExpressionType.Concentration:
        return {
          smile: 0.02, // Very minimal - reduced from 0.05
          cheekRaise: 0.05, // Reduced from 0.1
          eyebrowRaise: baseIntensity * 0.1, // Reduced from 0.2
          noseFlare: baseIntensity * 0.2, // Reduced from 0.4
          eyeSquint: baseIntensity * 0.4, // Reduced from 0.8
          lipCornerPull: -baseIntensity * 0.05, // Reduced from -0.1
          headTilt: -baseIntensity * 0.01, // Reduced from -0.02
          foreheadWrinkle: baseIntensity * 0.3, // Reduced from 0.6
          foreheadRaise: 0,
          jawClench: baseIntensity * 0.15, // Reduced from 0.3
          templeTension: baseIntensity * 0.2, // Reduced from 0.4
          // Concentration parameters
          lipCornerLift: 0,
          upperLipRaise: 0,
          lowerLipDepress: baseIntensity * 0.1,
          mouthCornerDimple: 0,
          cheekAppleRaise: 0,
          teethShow: 0, // No teeth showing during concentration
          jawOpenReduction: 0,
          asymmetricSmile: 0, // No asymmetry during concentration
        };
      
      // Add missing expression types with asymmetricSmile property
      case ExpressionType.Emphasis:
        return {
          smile: baseIntensity * 0.2,
          cheekRaise: baseIntensity * 0.15,
          eyebrowRaise: baseIntensity * 0.3,
          noseFlare: baseIntensity * 0.1,
          eyeSquint: baseIntensity * 0.1,
          lipCornerPull: baseIntensity * 0.15,
          headTilt: baseIntensity * 0.02,
          foreheadWrinkle: 0,
          foreheadRaise: baseIntensity * 0.2,
          jawClench: baseIntensity * 0.1,
          templeTension: baseIntensity * 0.1,
          lipCornerLift: baseIntensity * 0.2,
          upperLipRaise: baseIntensity * 0.15,
          lowerLipDepress: baseIntensity * 0.1,
          mouthCornerDimple: baseIntensity * 0.1,
          cheekAppleRaise: baseIntensity * 0.15,
          teethShow: baseIntensity * 0.4,
          jawOpenReduction: baseIntensity * 0.1,
          asymmetricSmile: baseIntensity * 0.05, // Slight asymmetry for emphasis
        };
      
      case ExpressionType.Engaged:
        return {
          smile: baseIntensity * 0.3,
          cheekRaise: baseIntensity * 0.2,
          eyebrowRaise: baseIntensity * 0.2,
          noseFlare: 0,
          eyeSquint: baseIntensity * 0.15,
          lipCornerPull: baseIntensity * 0.2,
          headTilt: baseIntensity * 0.015,
          foreheadWrinkle: 0,
          foreheadRaise: baseIntensity * 0.1,
          jawClench: 0,
          templeTension: 0,
          lipCornerLift: baseIntensity * 0.25,
          upperLipRaise: baseIntensity * 0.2,
          lowerLipDepress: baseIntensity * 0.15,
          mouthCornerDimple: baseIntensity * 0.15,
          cheekAppleRaise: baseIntensity * 0.2,
          teethShow: baseIntensity * 0.5,
          jawOpenReduction: baseIntensity * 0.15,
          asymmetricSmile: baseIntensity * 0.1, // Natural asymmetry for engagement
        };
      
      case ExpressionType.Confident:
        return {
          smile: baseIntensity * 0.35,
          cheekRaise: baseIntensity * 0.25,
          eyebrowRaise: baseIntensity * 0.15,
          noseFlare: 0,
          eyeSquint: baseIntensity * 0.1,
          lipCornerPull: baseIntensity * 0.2,
          headTilt: baseIntensity * 0.01,
          foreheadWrinkle: 0,
          foreheadRaise: baseIntensity * 0.05,
          jawClench: baseIntensity * 0.05,
          templeTension: 0,
          lipCornerLift: baseIntensity * 0.3,
          upperLipRaise: baseIntensity * 0.25,
          lowerLipDepress: baseIntensity * 0.18,
          mouthCornerDimple: baseIntensity * 0.2,
          cheekAppleRaise: baseIntensity * 0.25,
          teethShow: baseIntensity * 0.6,
          jawOpenReduction: baseIntensity * 0.2,
          asymmetricSmile: baseIntensity * 0.12, // Confident asymmetric smile
        };
      
      default: // Neutral and others - ENHANCED DEFAULT SPEAKING EXPRESSION
        return {
          smile: 0.15, // Increased from 0.05 - natural "cracked smile" default
          cheekRaise: 0.08, // Increased from 0.02 - slight cheek involvement
          eyebrowRaise: 0.1, // Increased from 0.05 - slightly raised brows
          noseFlare: 0,
          eyeSquint: 0.05, // Slight squint for natural expression
          lipCornerPull: 0.12, // Increased from 0.02 - natural corner pull
          headTilt: 0,
          foreheadWrinkle: 0,
          foreheadRaise: 0.03, // Slight forehead raise
          jawClench: 0,
          templeTension: 0,
          // NEW: Default "cracked smile" parameters
          lipCornerLift: 0.2, // Natural corner lift
          upperLipRaise: 0.1, // Slight upper lip raise to show teeth
          lowerLipDepress: 0.08, // Slight lower lip depression
          mouthCornerDimple: 0.1, // Natural dimpling
          cheekAppleRaise: 0.12, // Slight apple of cheek lift
          teethShow: 0.3, // Show some teeth even in neutral - key for "cracked smile"
          jawOpenReduction: 0.1, // Slight jaw reduction
          asymmetricSmile: 0.08, // Subtle asymmetry for natural look
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

  // Enhanced expression system with more "cracked smile" during speech
  const updateExpressions = (time: number) => {
    if (time > nextExpressionTime) {
      if (isSpeaking) {
        const speakingExpressions = [
          ExpressionType.Warm_Smile,    // Weight: Higher chance
          ExpressionType.Warm_Smile,    // Weight: Higher chance  
          ExpressionType.Joy,           // Weight: Higher chance
          ExpressionType.Emphasis,
          ExpressionType.Engaged,
          ExpressionType.Confident,
          ExpressionType.Excited,
          ExpressionType.Curious,
          ExpressionType.Empathetic,
          ExpressionType.Amused,        // NEW: More amused expressions
          ExpressionType.Warm_Smile,    // Weight: Even higher chance
        ];
        
        const randomExpression = speakingExpressions[Math.floor(Math.random() * speakingExpressions.length)];
        setCurrentExpression(randomExpression);
        setTargetExpressionIntensity(0.7 + Math.random() * 0.5); // Increased from 0.6 + 0.6
        setNextExpressionTime(time + 1.0 + Math.random() * 2.0); // Faster expression changes
      } else {
        const idleExpressions = [
          ExpressionType.Warm_Smile,    // Weight: Higher chance even when idle
          ExpressionType.Neutral,
          ExpressionType.Thoughtful,
          ExpressionType.Listening,
          ExpressionType.Relaxed,
          ExpressionType.Contemplative,
          ExpressionType.Curious,
          ExpressionType.Warm_Smile,    // Weight: Higher chance
        ];
        const randomExpression = idleExpressions[Math.floor(Math.random() * idleExpressions.length)];
        setCurrentExpression(randomExpression);
        setTargetExpressionIntensity(0.4 + Math.random() * 0.4); // Increased from 0.3 + 0.5
        setNextExpressionTime(time + 2.0 + Math.random() * 4.0); // Reduced from 2.5 + 5
      }
    }
    
    const transitionSpeed = 0.04 + (targetExpressionIntensity * 0.025); // Slightly faster transitions
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
      setTargetJawRotation({ x: 0, y: 0, z: 0 }); // Updated to object
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
            const { jawOpen, jawForward, jawSide } = getJawConfigForViseme(
              currentViseme, 
              wordGapState.pauseIntensity,
              wordGapState.anticipatoryMovement
            );
            
            // ULTRA-enhanced jaw rotation with maximum responsiveness
            const targetRotationX = jawOpen * 0.25; // Increased from 0.22 - maximum pronunciation
            const targetRotationY = jawForward * 0.15; // Increased from 0.12
            const targetRotationZ = jawSide * 0.1; // Increased from 0.07
            
            const targetRotation = { x: targetRotationX, y: targetRotationY, z: targetRotationZ };
            
            // MAXIMUM-SPEED smoothing factors with CONTEXT AWARENESS
            let smoothingFactor;
            const speechActivity = wordGapState.phonemeHistory.filter(p => p && p !== 'SP' && p !== 'SIL').length;
            
            if (speechActivity > 4) {
              smoothingFactor = 1.0; // INSTANT for very active speech
            } else if (speechActivity > 2) {
              smoothingFactor = 1.0; // INSTANT for active speech
            } else if (wordGapState.pauseIntensity > 0.3) {
              smoothingFactor = 0.9; // Very fast even during longer pauses
            } else if (wordGapState.pauseIntensity > 0.1) {
              smoothingFactor = 0.98; // Nearly instant for short pauses
            } else {
              smoothingFactor = 1.0; // COMPLETELY INSTANT for active speech
            }
            
            // ALWAYS instant for ANY anticipatory movement
            if (wordGapState.anticipatoryMovement > 0.05) { // Reduced threshold from 0.1
              smoothingFactor = 1.0; // Always instant when anticipating
            }
            
            // Apply with MAXIMUM responsiveness
            if (smoothingFactor >= 1.0) {
              setCurrentJawRotation(targetRotation);
              jawBone.current.rotation.x = targetRotation.x;
              jawBone.current.rotation.y = targetRotation.y;
              jawBone.current.rotation.z = targetRotation.z;
            } else {
              const newRotation = {
                x: THREE.MathUtils.lerp(currentJawRotation.x, targetRotation.x, smoothingFactor),
                y: THREE.MathUtils.lerp(currentJawRotation.y, targetRotation.y, smoothingFactor),
                z: THREE.MathUtils.lerp(currentJawRotation.z, targetRotation.z, smoothingFactor)
              };
              setCurrentJawRotation(newRotation);
              jawBone.current.rotation.x = newRotation.x;
              jawBone.current.rotation.y = newRotation.y;
              jawBone.current.rotation.z = newRotation.z;
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
                      // ULTRA-FAST smoothing speeds - INSTANT response for continuous speech
                      let smoothingSpeed;
                      if (wordGapState.pauseIntensity > 0.5) {
                        smoothingSpeed = 0.8; // Increased from 0.6 - faster even during sentence breaks
                      } else if (wordGapState.pauseIntensity > 0.2) {
                        smoothingSpeed = 0.95; // Increased from 0.9 - very fast for word breaks
                      } else if (wordGapState.pauseIntensity > 0.05) {
                        smoothingSpeed = 1.0; // INSTANT for syllable breaks
                      } else {
                        smoothingSpeed = 1.0; // COMPLETELY INSTANT for active speech
                      }
                      
                      // ALWAYS instant for any anticipatory movement
                      if (wordGapState.anticipatoryMovement > 0.1) { // Reduced threshold from 0.3
                        smoothingSpeed = 1.0; // Always instant when anticipating
                      }
                      
                      // FORCE instant response for longer words/sentences
                      const isLongSpeech = wordGapState.phonemeHistory.length > 2; // Detect longer speech
                      if (isLongSpeech) {
                        smoothingSpeed = 1.0; // Force instant for longer speech
                      }
                      
                      // Apply with INSTANT response for active speech
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
              
              // Get current expression configuration - ONLY DECLARE ONCE
              const expressionConfig = getExpressionConfig(currentExpression, expressionIntensity);
              
              // REFINED SMILE SYSTEM - Natural and realistic with BETTER TEETH SHOWING
              // Main smile shape - much more controlled
              setMorphTarget(['mouthSmile', 'mouth_smile', 'smile'], 
                Math.max(0, Math.min(0.5, expressionConfig.smile))); // Increased cap from 0.4
              
              // ENHANCED teeth showing during smiles
              setMorphTarget(['teethShow', 'teeth_show', 'showTeeth'], 
                Math.max(0, Math.min(0.9, expressionConfig.teethShow)));
              setMorphTarget(['upperTeethShow', 'upper_teeth_show'], 
                Math.max(0, Math.min(1.0, expressionConfig.teethShow * 1.2))); // Increased multiplier
              setMorphTarget(['lowerTeethShow', 'lower_teeth_show'], 
                Math.max(0, Math.min(0.7, expressionConfig.teethShow * 0.8))); // Increased from 0.6
              
              // ENHANCED upper lip raise to show teeth better
              setMorphTarget(['upperLipRaise', 'upper_lip_raise', 'lipUpperUp'], 
                Math.max(0, Math.min(0.4, expressionConfig.upperLipRaise))); // Increased from 0.35
              
              // ENHANCED lower lip depression to show teeth better
              setMorphTarget(['lowerLipDepress', 'lower_lip_depress', 'lipLowerDown'], 
                Math.max(0, Math.min(0.25, expressionConfig.lowerLipDepress))); // Increased from 0.15
              
              // Natural lip corner movement - the key to realistic smiles
              const asymmetricValue = expressionConfig.asymmetricSmile || 0; // Safe fallback
              const leftSmileIntensity = expressionConfig.lipCornerLift * (1 + asymmetricValue);
              const rightSmileIntensity = expressionConfig.lipCornerLift * (1 - asymmetricValue * 0.5);
              
              setMorphTarget(['lipCornerPullLeft', 'lip_corner_pull_left', 'mouthCornerLeft'], 
                Math.max(0, Math.min(0.4, leftSmileIntensity * 1.1))); // Increased from 0.35
              setMorphTarget(['lipCornerPullRight', 'lip_corner_pull_right', 'mouthCornerRight'], 
                Math.max(0, Math.min(0.4, rightSmileIntensity * 0.95))); // Increased from 0.35
              
              // Cheek involvement - natural apple of cheek lift
              setMorphTarget(['cheekRaise', 'cheek_raise', 'cheekPuff'], 
                Math.max(0, Math.min(0.3, expressionConfig.cheekAppleRaise))); // Much more controlled
              setMorphTarget(['cheekRaiseLeft', 'cheek_raise_left'], 
                Math.max(0, Math.min(0.3, expressionConfig.cheekAppleRaise * 1.05))); // Slight asymmetry
              setMorphTarget(['cheekRaiseRight', 'cheek_raise_right'], 
                Math.max(0, Math.min(0.3, expressionConfig.cheekAppleRaise * 0.98)));
              
              // Natural dimpling - adds realism
              setMorphTarget(['mouthDimpleLeft', 'mouth_dimple_left', 'dimpleLeft'], 
                Math.max(0, Math.min(0.3, expressionConfig.mouthCornerDimple * 1.2))); // Increased
              setMorphTarget(['mouthDimpleRight', 'mouth_dimple_right', 'dimpleRight'], 
                Math.max(0, Math.min(0.3, expressionConfig.mouthCornerDimple * 0.9))); // Asymmetric dimples
              
              // REDUCE jaw opening during smiles for more natural look
              const currentMouthWide = mouthWide || 0;
              const smileAdjustedWide = currentMouthWide * (1 - expressionConfig.smile * 0.3); // Reduce width during smiles
              const smileAdjustedJawOpen = jawOpen * (1 - expressionConfig.jawOpenReduction); // NEW: Reduce jaw opening during smiles
              
              setMorphTarget(['mouthWide', 'mouth_wide'], 
                Math.max(0, Math.min(0.4, smileAdjustedWide)));
              setMorphTarget(['mouthOpen', 'mouth_open', 'jawOpen', 'open'], 
                Math.max(0, Math.min(0.5, smileAdjustedJawOpen))); // Apply jaw reduction during smiles
              
              // Natural eye involvement - Duchenne smile effect
              setMorphTarget(['eyeSquint', 'eye_squint', 'squint'], 
                Math.max(0, Math.min(0.25, expressionConfig.eyeSquint + eyeState.squint)));
              setMorphTarget(['eyeSquintLeft', 'eye_squint_left'], 
                Math.max(0, Math.min(0.25, (expressionConfig.eyeSquint + eyeState.squint) * 1.05)));
              setMorphTarget(['eyeSquintRight', 'eye_squint_right'], 
                Math.max(0, Math.min(0.25, (expressionConfig.eyeSquint + eyeState.squint) * 0.98)));
              
              // Subtle nasolabial fold - adds realism to smiles
              setMorphTarget(['nasolabialFold', 'nasolabial_fold', 'smileLines'], 
                Math.max(0, Math.min(0.2, expressionConfig.smile * 0.6)));

              // Apply enhanced mouth shapes with smile adjustments
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
          const newRotation = {
            x: THREE.MathUtils.lerp(currentJawRotation.x, targetJawRotation.x, transitionSpeed),
            y: THREE.MathUtils.lerp(currentJawRotation.y, targetJawRotation.y, transitionSpeed),
            z: THREE.MathUtils.lerp(currentJawRotation.z, targetJawRotation.z, transitionSpeed)
          };
          setCurrentJawRotation(newRotation);
          
          if (jawBone.current) {
            jawBone.current.rotation.x = newRotation.x;
            jawBone.current.rotation.y = newRotation.y;
            jawBone.current.rotation.z = newRotation.z;
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
              
              // Get expression config - ONLY DECLARE ONCE
              const expressionConfig = getExpressionConfig(currentExpression, expressionIntensity);
              
              // REFINED SMILE SYSTEM for fallback animation with BETTER TEETH SHOWING
              applyMorphIfExists('mouthSmile', Math.max(0, Math.min(0.4, expressionConfig.smile)));
              applyMorphIfExists('mouth_smile', Math.max(0, Math.min(0.4, expressionConfig.smile)));
              
              // Enhanced teeth showing
              applyMorphIfExists('teethShow', Math.max(0, Math.min(0.8, expressionConfig.teethShow)));
              applyMorphIfExists('teeth_show', Math.max(0, Math.min(0.8, expressionConfig.teethShow)));
              applyMorphIfExists('upperTeethShow', Math.max(0, Math.min(0.9, expressionConfig.teethShow * 1.1)));
              applyMorphIfExists('upper_teeth_show', Math.max(0, Math.min(0.9, expressionConfig.teethShow * 1.1)));
              applyMorphIfExists('lowerTeethShow', Math.max(0, Math.min(0.6, expressionConfig.teethShow * 0.7)));
              applyMorphIfExists('lower_teeth_show', Math.max(0, Math.min(0.6, expressionConfig.teethShow * 0.7)));
              
              // Enhanced lip movement for teeth showing
              applyMorphIfExists('upperLipRaise', Math.max(0, Math.min(0.35, expressionConfig.upperLipRaise)));
              applyMorphIfExists('upper_lip_raise', Math.max(0, Math.min(0.35, expressionConfig.upperLipRaise)));
              applyMorphIfExists('lowerLipDepress', Math.max(0, Math.min(0.25, expressionConfig.lowerLipDepress)));
              applyMorphIfExists('lower_lip_depress', Math.max(0, Math.min(0.25, expressionConfig.lowerLipDepress)));
              
              // Natural lip corner movement
              applyMorphIfExists('lipCornerPullLeft', Math.max(0, Math.min(0.35, expressionConfig.lipCornerLift * 1.1)));
              applyMorphIfExists('lip_corner_pull_left', Math.max(0, Math.min(0.35, expressionConfig.lipCornerLift * 1.1)));
              applyMorphIfExists('lipCornerPullRight', Math.max(0, Math.min(0.35, expressionConfig.lipCornerLift * 0.95)));
              applyMorphIfExists('lip_corner_pull_right', Math.max(0, Math.min(0.35, expressionConfig.lipCornerLift * 0.95)));
              
              // Controlled cheek involvement
              applyMorphIfExists('cheekRaise', Math.max(0, Math.min(0.3, expressionConfig.cheekAppleRaise)));
              applyMorphIfExists('cheek_raise', Math.max(0, Math.min(0.3, expressionConfig.cheekAppleRaise)));
              applyMorphIfExists('cheekRaiseLeft', Math.max(0, Math.min(0.3, expressionConfig.cheekAppleRaise * 1.05)));
              applyMorphIfExists('cheek_raise_left', Math.max(0, Math.min(0.3, expressionConfig.cheekAppleRaise * 1.05)));
              applyMorphIfExists('cheekRaiseRight', Math.max(0, Math.min(0.3, expressionConfig.cheekAppleRaise * 0.98)));
              applyMorphIfExists('cheek_raise_right', Math.max(0, Math.min(0.3, expressionConfig.cheekAppleRaise * 0.98)));
              
              // Natural dimpling
              applyMorphIfExists('mouthDimpleLeft', Math.max(0, Math.min(0.25, expressionConfig.mouthCornerDimple * 1.1)));
              applyMorphIfExists('mouth_dimple_left', Math.max(0, Math.min(0.25, expressionConfig.mouthCornerDimple * 1.1)));
              applyMorphIfExists('mouthDimpleRight', Math.max(0, Math.min(0.25, expressionConfig.mouthCornerDimple * 0.95)));
              applyMorphIfExists('mouth_dimple_right', Math.max(0, Math.min(0.25, expressionConfig.mouthCornerDimple * 0.95)));
              
              // Natural eye squinting
              applyMorphIfExists('eyeSquint', Math.max(0, Math.min(0.25, expressionConfig.eyeSquint + eyeState.squint)));
              applyMorphIfExists('eye_squint', Math.max(0, Math.min(0.25, expressionConfig.eyeSquint + eyeState.squint)));

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
