"use client";

import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <MobileHeroSection /> : <DesktopHeroSection />;
}

function MobileHeroSection() {
  return (
    <section className="w-full pt-20 pb-24 relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-6">
        {/* Tech Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center px-3 py-1.5 bg-[#14152A]/80 backdrop-blur-sm border border-[#2E2D47] rounded-md text-[#00F5A0] text-xs font-mono tracking-wider shadow-[0_0_12px_rgba(0,0,0,0.3)]">
            <span className="mr-1.5">⚡</span> Powered by Vapi AI
          </div>
        </div>
        
        {/* Main Content - angular design */}
        <div className="p-6 border-l-4 border-[#00F5A0] rounded-r-md mb-8 relative overflow-hidden">
          {/* Headline - back to VapiCall */}
          <h1 className="text-5xl font-bold leading-[1.15] mb-5">
            <span className="block mb-1 text-white relative z-10">
              VapiCall
            </span>
          </h1>
          
          {/* Simplified subheading */}
          <p className="text-white/90 text-md mb-6 leading-relaxed">
            Call for quick help or use our dashboard for deeper conversations.
          </p>
          
          {/* Simplified feature points */}
          <div className="space-y-3.5 mb-6">
            {[
              "Instant AI assistance via phone",
              "Upload content for specialized help",
              "No apps needed - just call or visit dashboard"
            ].map((feature, i) => (
              <div key={i} className="flex items-center">
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-[#14152A] border border-[#00F5A0]/50 rounded-sm mr-3">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#00F5A0]" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-gray-200 text-sm">{feature}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Button - matching original gradient */}
        <div className="flex justify-center">
          <a 
            href="tel:+14125208354" 
            className="flex items-center justify-center w-full max-w-xs px-5 py-4 bg-[#14152A]/70 backdrop-blur-sm rounded-md text-white font-bold text-lg transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.4)] relative overflow-hidden border border-[#2E2D47]/70"
          >
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#00F5A0] to-[#B83280] opacity-80"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#00F5A0]/5 to-[#B83280]/5 opacity-0 hover:opacity-30 transition-opacity"></div>
            
            <div className="flex items-center">
              <span className="text-[#B83280] mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </span>
              <span>Call AI Assistant Now</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

function DesktopHeroSection() {
  return (
    <section className="w-full pt-16 pb-20 sm:pt-20 sm:pb-24 md:pt-28 md:pb-0 lg:pt-32 lg:pb-0 relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-20 items-center">
          <div className="max-w-xl mx-auto lg:mx-0">
            <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 bg-[#1C1D2B]/80 backdrop-blur-sm border border-[#2E2D47] rounded-md text-[#00F5A0] text-xs font-mono tracking-wider mb-4 sm:mb-6 md:mb-8 shadow-[0_0_10px_rgba(0,0,0,0.3)]">
              <span className="mr-1.5">⚡</span> Powered by Vapi AI
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-4 sm:mb-6 md:mb-8" style={{textShadow: '0 0 20px rgba(0, 0, 0, 0.5)'}}>
              <span className="block relative z-10">Quick Help</span> 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00F5A0] to-[#00F5A0] relative">
                or Deep Conversations
                <span className="absolute -inset-1 bg-gradient-to-r from-[#00F5A0]/5 to-[#B83280]/5 blur-xl opacity-30 -z-10"></span>
              </span>
            </h1>
            
            {/* Simplified content without cards */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-6 sm:mb-8 md:mb-10">
              {/* Tagline */}
              <p className="text-sm sm:text-base md:text-lg text-white/90 font-medium">
                Two powerful ways to access AI assistance - choose what fits your needs
              </p>
              
              {/* Simple feature list */}
              <div className="space-y-3 sm:space-y-4">
                {[
                  {
                    title: "Phone Hotline",
                    desc: "Dial for instant general assistance - no apps or setup required"
                  },
                  {
                    title: "Smart Dashboard", 
                    desc: "Upload documents & images, choose specialized assistants for contextual conversations"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-[#14152A] border border-[#00F5A0]/50 rounded-sm mr-3 mt-0.5">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#00F5A0]" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white text-sm sm:text-base font-medium">{item.title}</h4>
                      <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* CTA with clean styling */}
              <div className="pt-2 sm:pt-4">
                <a 
                  href="tel:+14125208354" 
                  className="flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3 bg-[#14152A]/70 backdrop-blur-sm rounded-lg border border-[#2E2D47]/70 text-white font-medium transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_18px_rgba(184,50,128,0.2)] relative overflow-hidden group text-sm sm:text-base"
                >
                  <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#00F5A0] to-[#B83280] opacity-20 group-hover:opacity-70 transition-all duration-500"></div>
                  
                  <div className="flex items-center">
                    <span className="text-[#B83280] mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </span>
                    <span className="relative z-10">Call AI Assistant Now</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative mt-8 lg:mt-0">
            <div className="relative aspect-square max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
              {/* Orbital rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-full w-full rounded-full border border-[#2E2D47] opacity-50 animate-[spin_60s_linear_infinite]"></div>
              </div>
              <div className="absolute inset-[15%] flex items-center justify-center">
                <div className="h-full w-full rounded-full border border-[#2E2D47] opacity-60 animate-[spin_45s_linear_infinite_reverse]"></div>
              </div>
              <div className="absolute inset-[30%] flex items-center justify-center">
                <div className="h-full w-full rounded-full border border-[#2E2D47] opacity-70 animate-[spin_30s_linear_infinite]"></div>
              </div>
              
              {/* Orbital points with subtle electric styling */}
              <div className="absolute top-[5%] left-1/2 -translate-x-1/2 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-[#00F5A0] shadow-[0_0_15px_rgba(0,245,160,0.5)] opacity-80"></div>
              <div className="absolute top-1/2 right-[5%] -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#B83280] shadow-[0_0_15px_rgba(184,50,128,0.5)] opacity-80"></div>
              <div className="absolute bottom-[15%] left-[20%] h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-[#00F5A0] shadow-[0_0_10px_rgba(0,245,160,0.5)] opacity-80"></div>
              
              {/* Central voice visualization */}
              <div className="absolute inset-[38%] rounded-full bg-[#0C0D1D] border border-[#2E2D47] flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 rounded-full border-2 border-[#00F5A0] opacity-20 animate-ping"></div>
                
                {/* Voice wave visualization */}
                <div className="flex items-center space-x-1 sm:space-x-1.5">
                  {[40, 60, 80, 100, 80, 60, 40].map((height, i) => (
                    <div 
                      key={i} 
                      className="w-1 sm:w-1.5 bg-[#00F5A0] rounded-full"
                      style={{ 
                        height: `${height * 0.35}px`,
                        animation: `soundWave ${0.8 + (i % 4) * 0.2}s infinite alternate ${i * 0.1}s ease-in-out`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Floating particles */}
              <div className="absolute h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-[#00F5A0] opacity-40 top-[40%] left-[30%] animate-[float_4s_ease-in-out_infinite]"></div>
              <div className="absolute h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#B83280] opacity-40 top-[60%] right-[35%] animate-[float_3s_ease-in-out_infinite_0.5s]"></div>
              <div className="absolute h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[#00F5A0] opacity-40 bottom-[35%] right-[25%] animate-[float_3.5s_ease-in-out_infinite_1s]"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Single style block with combined animations */}
      <style jsx global>{`
        @keyframes soundWave {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(5px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
      `}</style>
    </section>
  );
}
