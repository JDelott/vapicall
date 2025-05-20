export default function HeroSection() {
  return (
    <section className="w-full bg-[#0A0B14] pt-16 pb-20 sm:pt-20 sm:pb-24 md:pt-28 md:pb-32 lg:pt-32 lg:pb-40 relative overflow-hidden">
      {/* Space background with stars and gradients - darker version */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070810] via-[#0C0D1D] to-[#121325]"></div>
      
      {/* Stars background with reduced opacity */}
      <div className="absolute inset-0 opacity-50" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.15) 1px, transparent 1px), 
                            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
                            radial-gradient(circle at 15% 85%, rgba(255, 255, 255, 0.12) 0.5px, transparent 0.5px),
                            radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.12) 0.5px, transparent 0.5px)`,
          backgroundSize: '100px 100px, 120px 120px, 80px 80px, 50px 50px, 60px 60px'
        }}
      ></div>
      
      {/* Subtle nebula effects */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-[#00F5A0]/3 via-transparent to-transparent opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-[#B83280]/3 via-transparent to-transparent opacity-20 blur-3xl"></div>
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-[#4B2D83]/3 via-transparent to-transparent opacity-10 blur-3xl"></div>
      
      {/* Darker grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMyRTJENDciIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-20 items-center">
          <div className="max-w-xl mx-auto lg:mx-0">
            <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 bg-[#1C1D2B]/80 backdrop-blur-sm border border-[#2E2D47] rounded-md text-[#00F5A0] text-xs font-mono tracking-wider mb-4 sm:mb-6 md:mb-8 shadow-[0_0_10px_rgba(0,0,0,0.3)]">
              <span className="mr-1.5">⚡</span> Powered by Vapi AI
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-4 sm:mb-6 md:mb-8" style={{textShadow: '0 0 20px rgba(0, 0, 0, 0.5)'}}>
              <span className="block relative z-10">AI Power</span> 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00F5A0] to-[#00F5A0] relative">
                Through Your Phone
                <span className="absolute -inset-1 bg-gradient-to-r from-[#00F5A0]/5 to-[#B83280]/5 blur-xl opacity-30 -z-10"></span>
              </span>
            </h1>
            
            {/* New structured content with subtle electric styling */}
            <div className="space-y-3 sm:space-y-6 md:space-y-8 mb-6 sm:mb-8 md:mb-10 relative">
              {/* Electric pulse effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#00F5A0]/5 to-[#B83280]/5 rounded-lg blur-xl opacity-20 animate-pulse"></div>
              
              {/* Tagline */}
              <div className="bg-[#14152A]/70 backdrop-blur-sm rounded-lg p-3 sm:p-4 border-l-4 border-[#00F5A0] relative overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#00F5A0]/10 to-transparent rounded-bl-full"></div>
                <p className="text-sm sm:text-base md:text-lg text-white font-medium relative z-10">
                  Experience AI technology with a simple phone call
                </p>
              </div>
              
              {/* Feature points with subtle electric styling */}
              <div className="space-y-2 sm:space-y-4">
                {[
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
                    title: "One call away",
                    desc: "Connect to AI with a simple phone call"
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
                    title: "Natural conversation",
                    desc: "Ask anything, get instant answers"
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
                    title: "Real-time information",
                    desc: "Get the latest info from the web"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start p-2 sm:p-3 bg-[#14152A]/70 backdrop-blur-sm rounded-lg border border-[#2E2D47]/70 relative overflow-hidden group transition-all duration-300 hover:bg-[#1C1D2B]/80 shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#00F5A0]/30 opacity-20 group-hover:opacity-70 transition-all duration-500"></div>
                    
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-[#0C0D1D] border border-[#2E2D47] text-[#00F5A0] mr-2 sm:mr-3 shadow-lg group-hover:border-[#00F5A0]/50 transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-white text-xs sm:text-sm md:text-base font-medium">{item.title}</h3>
                      <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* CTA with styling that matches the cards but with pink accent */}
              <div className="pt-2 sm:pt-4">
                <a 
                  href="tel:+14125208354" 
                  className="flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3 bg-[#14152A]/70 backdrop-blur-sm rounded-lg border border-[#2E2D47]/70 text-white font-medium transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_18px_rgba(184,50,128,0.2)] relative overflow-hidden group text-sm sm:text-base"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#B83280]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#00F5A0]/40 to-[#B83280]/40 opacity-20 group-hover:opacity-70 transition-all duration-500"></div>
                  
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
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#2E2D47] to-transparent"></div>
      
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
