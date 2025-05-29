"use client";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";
import { useEffect } from "react";
import Footer from "@/components/layout/Footer";
export default function Home() {
  // Add twinkling star animation
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.1; }
        50% { opacity: 0.5; }
      }
      
      @keyframes slowFloat {
        0%, 100% { transform: translateY(0) translateX(0); }
        50% { transform: translateY(-10px) translateX(5px); }
      }

      .star {
        position: absolute;
        background-color: white;
        border-radius: 50%;
      }
      
      .nebula {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        opacity: 0.08;
        animation: slowFloat 20s infinite ease-in-out;
      }
    `;
    document.head.appendChild(style);
    
    // Create twinkling stars
    const starField = document.getElementById('starField');
    if (starField) {
      const starCount = 150;
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random size (mostly tiny, few larger)
        const size = Math.random() < 0.9 
          ? Math.random() * 1.5 + 0.5 
          : Math.random() * 3 + 2;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random opacity - reduced for darker look
        star.style.opacity = (Math.random() * 0.4 + 0.1).toString();
        
        // Random twinkle animation
        if (Math.random() < 0.7) { // 70% of stars twinkle
          star.style.animation = `twinkle ${Math.random() * 5 + 2}s infinite ${Math.random() * 5}s ease-in-out`;
        }
        
        starField.appendChild(star);
      }
      
      // Create distant nebulae - darker colors
      const colors = [
        'rgba(0, 245, 160, 0.25)', // Teal
        'rgba(184, 50, 128, 0.25)', // Pink
        'rgba(75, 45, 131, 0.25)',  // Purple
        'rgba(20, 120, 255, 0.25)',  // Blue
      ];
      
      // Create 5 nebula clouds
      for (let i = 0; i < 5; i++) {
        const nebula = document.createElement('div');
        nebula.className = 'nebula';
        
        // Random size
        const size = Math.random() * 30 + 10;
        nebula.style.width = `${size}vw`;
        nebula.style.height = `${size}vw`;
        
        // Random position
        nebula.style.left = `${Math.random() * 100}%`;
        nebula.style.top = `${Math.random() * 100}%`;
        
        // Random color
        nebula.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random animation delay
        nebula.style.animationDelay = `${Math.random() * 10}s`;
        
        starField.appendChild(nebula);
      }
    }
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="flex flex-col w-full relative">
      {/* Darker deep space background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#040208] via-[#0a0a19] to-[#100f26] z-0"></div>
      
      {/* Star field container */}
      <div id="starField" className="fixed inset-0 z-0 overflow-hidden"></div>
      
      {/* Star field with varying sizes - static backup if JS doesn't run */}
      <div className="fixed inset-0 opacity-60 z-0" 
        style={{ 
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.15) 1px, transparent 1px), 
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 15% 85%, rgba(255, 255, 255, 0.1) 0.5px, transparent 0.5px),
            radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.1) 0.5px, transparent 0.5px)
          `,
          backgroundSize: '150px 150px, 200px 200px, 100px 100px, 80px 80px, 120px 120px'
        }}
      ></div>
      
      {/* Subtle distant galaxies and nebulae - static & darker */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-[#00F5A0]/5 via-transparent to-transparent opacity-15 blur-3xl z-0"></div>
      <div className="fixed bottom-0 left-10 w-1/3 h-1/3 bg-gradient-to-t from-[#B83280]/5 via-transparent to-transparent opacity-15 blur-3xl z-0"></div>
      <div className="fixed top-1/3 left-1/3 w-1/4 h-1/4 bg-gradient-to-tr from-[#4B2D83]/7 via-transparent to-transparent opacity-10 blur-3xl z-0"></div>
      <div className="fixed bottom-1/3 right-1/3 w-1/4 h-1/4 bg-gradient-to-tl from-[#1450c8]/7 via-transparent to-transparent opacity-10 blur-3xl z-0"></div>
      
      {/* Subtle grid for tech feeling - lowered opacity */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMyRTJENDciIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-10 z-0"></div>
      
      {/* Additional dark overlay to deepen everything */}
      <div className="fixed inset-0 bg-black opacity-30 z-0"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <HeroSection />
        <CTASection />
        <HowItWorksSection />
        <FeaturesSection />
        <Footer />
      </div>
    </div>
  );
}
// fix deployment
