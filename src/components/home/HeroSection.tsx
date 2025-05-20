export default function HeroSection() {
  return (
    <section className="w-full bg-[#0A0B14] pt-24 pb-32 md:pt-32 md:pb-40 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B14] to-[#14152A]"></div>
      
      <div className="relative z-10 container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 md:gap-20 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-[#1C1D2B] border border-[#2E2D47] rounded-md text-[#00F5A0] text-xs font-mono tracking-wider mb-8">
              Powered by Vapi AI
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-8">
              AI Power <span className="text-[#00F5A0]">Through Your Phone</span>
            </h1>
            
            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl">
              Interact with our AI through natural voice conversations. Call directly from your browser or phone - no registration needed.
            </p>
            
            <div className="flex mb-8">
              <a 
                href="tel:+14125208354" 
                className="px-8 py-5 bg-gradient-to-r from-[#B83280] to-[#4B2D83] text-white rounded-lg font-medium hover:from-[#C93D90] hover:to-[#5B3D93] transition-all duration-300 text-center w-full sm:w-auto text-lg"
              >
                Call AI Assistant Now
              </a>
            </div>
            
            <div className="mt-10">
              <div className="flex flex-col sm:flex-row items-center">
                {[
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
                    title: "Call",
                    desc: "Connect instantly"
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
                    title: "Ask",
                    desc: "Anything you need"
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
                    title: "Get Info",
                    desc: "Real-time answers"
                  }
                ].map((item, i, arr) => (
                  <div key={i} className="flex items-center py-2 sm:py-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1C1D2B] border border-[#2E2D47] text-[#00F5A0]">
                      {item.icon}
                    </div>
                    
                    <div className="ml-3">
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-gray-400 text-xs">{item.desc}</div>
                    </div>
                    
                    {i < arr.length - 1 && (
                      <div className="hidden sm:block mx-3 md:mx-6 text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="relative aspect-square max-w-xl mx-auto">
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
              
              {/* Orbital points */}
              <div className="absolute top-[5%] left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-[#00F5A0] shadow-[0_0_20px_#00F5A0]"></div>
              <div className="absolute top-1/2 right-[5%] -translate-y-1/2 h-6 w-6 rounded-full bg-[#B83280] shadow-[0_0_25px_#B83280]"></div>
              <div className="absolute bottom-[15%] left-[20%] h-4 w-4 rounded-full bg-[#00F5A0] shadow-[0_0_15px_#00F5A0]"></div>
              
              {/* Central voice visualization */}
              <div className="absolute inset-[38%] rounded-full bg-[#1C1D2B] border border-[#2E2D47] flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 rounded-full border-2 border-[#00F5A0] opacity-20 animate-ping"></div>
                
                {/* Voice wave visualization */}
                <div className="flex items-center space-x-1.5">
                  {[40, 60, 80, 100, 80, 60, 40].map((height, i) => (
                    <div 
                      key={i} 
                      className="w-1.5 bg-[#00F5A0] rounded-full"
                      style={{ 
                        height: `${height * 0.45}px`,
                        animation: `sound-wave ${0.8 + (i % 4) * 0.2}s infinite alternate ${i * 0.1}s ease-in-out`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Floating particles */}
              <div className="absolute h-3 w-3 rounded-full bg-[#00F5A0] opacity-70 top-[40%] left-[30%] animate-[float_4s_ease-in-out_infinite]"></div>
              <div className="absolute h-2 w-2 rounded-full bg-[#B83280] opacity-70 top-[60%] right-[35%] animate-[float_3s_ease-in-out_infinite_0.5s]"></div>
              <div className="absolute h-1.5 w-1.5 rounded-full bg-[#00F5A0] opacity-70 bottom-[35%] right-[25%] animate-[float_3.5s_ease-in-out_infinite_1s]"></div>
              
              {/* Decorative grid */}
              <div className="absolute inset-0 opacity-20" style={{ 
                backgroundImage: 'radial-gradient(#2E2D47 1px, transparent 1px)', 
                backgroundSize: '25px 25px'
              }}></div>
              
              {/* Add animations */}
              <style jsx>{`
                @keyframes sound-wave {
                  0% { transform: scaleY(0.3); }
                  100% { transform: scaleY(1); }
                }
                
                @keyframes float {
                  0% { transform: translateY(0px) translateX(0px); }
                  50% { transform: translateY(-15px) translateX(7px); }
                  100% { transform: translateY(0px) translateX(0px); }
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#2E2D47] to-transparent"></div>
    </section>
  );
}
