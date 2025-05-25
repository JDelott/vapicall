"use client";

import { useEffect, useState, useRef } from 'react';

interface SoundwaveVisualizationProps {
  isSpeaking: boolean;
  volumeLevel?: number;
  isCallActive: boolean;
}

export default function SoundwaveVisualization({ 
  isSpeaking, 
  volumeLevel = 0, 
  isCallActive 
}: SoundwaveVisualizationProps) {
  const [bars, setBars] = useState<number[]>(Array(19).fill(0));
  const [mouthOpenness, setMouthOpenness] = useState<number>(0);
  const animationRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number>(0);
  const speechCycleRef = useRef<number>(0);
  const isOpeningRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isCallActive) {
      setBars(Array(19).fill(0));
      setMouthOpenness(0);
      isOpeningRef.current = false;
      return;
    }

    const animate = (timestamp: number) => {
      if (timestamp - lastUpdateRef.current < 60) { // ~16fps for more dramatic movements
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastUpdateRef.current = timestamp;

      if (isSpeaking) {
        const baseVolume = volumeLevel > 0 ? volumeLevel : 0.4 + Math.random() * 0.6;
        const time = timestamp * 0.001;
        
        // Create speech cycles - mouth opens and closes rhythmically
        const speechCycleDuration = 300 + Math.random() * 400; // 300-700ms cycles
        const cycleProgress = (timestamp - speechCycleRef.current) / speechCycleDuration;
        
        if (cycleProgress >= 1) {
          speechCycleRef.current = timestamp;
          isOpeningRef.current = !isOpeningRef.current;
        }
        
        // Calculate mouth openness with smooth transitions
        let targetOpenness = 0;
        if (isOpeningRef.current) {
          // Opening phase - smooth acceleration
          targetOpenness = Math.sin(cycleProgress * Math.PI * 0.5) * baseVolume;
        } else {
          // Closing phase - smooth deceleration
          targetOpenness = Math.cos(cycleProgress * Math.PI * 0.5) * baseVolume;
        }
        
        // Add some randomness for natural variation
        targetOpenness += (Math.random() - 0.5) * 0.2 * baseVolume;
        targetOpenness = Math.max(0, Math.min(1, targetOpenness));
        
        setMouthOpenness(targetOpenness);
        
        setBars(prevBars => {
          return prevBars.map((_, index) => {
            const centerIndex = 9; // Center of 19 bars
            const distanceFromCenter = Math.abs(index - centerIndex);
            
            // Create mouth opening pattern based on current openness
            let intensity = 0;
            
            if (targetOpenness > 0.1) {
              // Mouth is opening - create expanding pattern
              const maxDistance = targetOpenness * 8; // How far the mouth opens
              
              if (distanceFromCenter <= maxDistance) {
                // Inside the mouth opening
                const normalizedDistance = distanceFromCenter / Math.max(maxDistance, 1);
                
                // Create curved mouth shape - higher in center, lower at edges
                const mouthCurve = Math.cos(normalizedDistance * Math.PI * 0.5);
                intensity = targetOpenness * mouthCurve;
                
                // Add speech variation
                const speechVariation = Math.sin(time * 6 + index * 0.5) * 0.2;
                intensity += speechVariation * targetOpenness;
                
                // Add volume-based intensity
                intensity *= (0.7 + baseVolume * 0.3);
                
              } else {
                // Outside mouth opening - very minimal activity
                intensity = Math.random() * 0.05 * targetOpenness;
              }
            } else {
              // Mouth is mostly closed
              if (distanceFromCenter <= 2) {
                intensity = targetOpenness * 0.3 + Math.random() * 0.1;
              }
            }
            
            return Math.max(0, Math.min(1, intensity));
          });
        });
        
      } else {
        // Not speaking - mouth closed with subtle breathing
        const time = timestamp * 0.0005;
        const breathingPattern = Math.sin(time) * 0.02 + 0.01;
        setMouthOpenness(breathingPattern);
        
        setBars(prevBars => {
          return prevBars.map((_, index) => {
            const centerIndex = 9;
            const distanceFromCenter = Math.abs(index - centerIndex);
            
            if (distanceFromCenter <= 1) {
              return breathingPattern;
            }
            return 0;
          });
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpeaking, volumeLevel, isCallActive]);

  return (
    <div className="relative w-full h-full bg-[#1C1D2B] rounded-lg overflow-hidden flex items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-[#00F5A0]/5 via-transparent to-transparent"></div>
      
      {/* Dynamic mouth outline that expands/contracts */}
      {isSpeaking && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="border border-[#00F5A0]/20 rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${120 + mouthOpenness * 100}px`,
              height: `${40 + mouthOpenness * 40}px`,
              opacity: 0.3 + mouthOpenness * 0.4
            }}
          />
        </div>
      )}
      
      {/* Soundwave bars with opening/closing animation */}
      <div className="flex items-end justify-center z-10" style={{ gap: '2px' }}>
        {bars.map((height, index) => {
          const centerIndex = 9;
          const distanceFromCenter = Math.abs(index - centerIndex);
          const isCenter = distanceFromCenter <= 2;
          const isMidRange = distanceFromCenter > 2 && distanceFromCenter <= 5;
          
          // Calculate bar width based on mouth openness and position
          let barWidth = 3;
          if (isCenter) {
            barWidth = 4 + mouthOpenness * 2; // Center bars get wider when mouth opens
          } else if (isMidRange) {
            barWidth = 3 + mouthOpenness * 1;
          }
          
          // Calculate base height with mouth curve
          const baseHeight = 6;
          const maxHeight = 80;
          const mouthCurveHeight = baseHeight + (maxHeight - baseHeight) * Math.cos(distanceFromCenter * 0.3);
          
          // Calculate final height with opening effect
          const finalHeight = Math.max(baseHeight, height * mouthCurveHeight);
          
          // Calculate horizontal spread based on mouth openness
          const spreadOffset = mouthOpenness * distanceFromCenter * 1.5;
          
          return (
            <div
              key={index}
              className={`transition-all duration-150 ease-out rounded-full ${
                isCenter 
                  ? 'bg-gradient-to-t from-[#00F5A0] via-[#00F5A0]/90 to-[#00F5A0]/70' 
                  : isMidRange
                  ? 'bg-gradient-to-t from-[#00F5A0]/80 via-[#00F5A0]/60 to-[#00F5A0]/40'
                  : 'bg-gradient-to-t from-[#00F5A0]/60 via-[#00F5A0]/40 to-[#00F5A0]/20'
              }`}
              style={{
                width: `${barWidth}px`,
                height: `${finalHeight}px`,
                opacity: 0.5 + (height * 0.5),
                boxShadow: isSpeaking && height > 0.2
                  ? `0 0 ${height * (isCenter ? 15 : 10)}px rgba(0, 245, 160, ${height * 0.6})` 
                  : 'none',
                transform: `
                  translateY(${(1 - height) * 15}px) 
                  translateX(${index < centerIndex ? -spreadOffset : index > centerIndex ? spreadOffset : 0}px)
                  scaleY(${0.8 + height * 0.2})
                `,
              }}
            />
          );
        })}
      </div>
      
      {/* Volume level indicator - REMOVED */}
    </div>
  );
}
