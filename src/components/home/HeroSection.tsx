import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="w-full bg-[#0A0B14] pt-16 pb-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B14] to-[#14152A]"></div>
      
      <div className="relative z-10 container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-[#1C1D2B] border border-[#2E2D47] rounded-md text-[#00F5A0] text-xs font-mono tracking-wider mb-6">
              QUANTUM VOICE AI
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Experience the Future of <span className="text-[#00F5A0]">AI Voice</span> Technology
            </h1>
            
            <p className="text-gray-300 text-lg mb-8 max-w-xl">
              Our cutting-edge AI phone service combines neural networks with quantum computing algorithms to deliver the most natural voice interactions available.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                href="#features" 
                className="px-6 py-3 bg-gradient-to-r from-[#B83280] to-[#4B2D83] text-white rounded-lg font-medium hover:from-[#C93D90] hover:to-[#5B3D93] transition-all duration-300 text-center sm:text-left"
              >
                Explore Features
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Orbital rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-full w-full rounded-full border border-[#2E2D47] opacity-50"></div>
              </div>
              <div className="absolute inset-[10%] flex items-center justify-center">
                <div className="h-full w-full rounded-full border border-[#2E2D47] opacity-60"></div>
              </div>
              <div className="absolute inset-[20%] flex items-center justify-center">
                <div className="h-full w-full rounded-full border border-[#2E2D47] opacity-70"></div>
              </div>
              
              {/* Planets/orbital points */}
              <div className="absolute top-[5%] left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-[#00F5A0] shadow-[0_0_10px_#00F5A0]"></div>
              <div className="absolute top-1/2 right-[5%] -translate-y-1/2 h-4 w-4 rounded-full bg-[#B83280] shadow-[0_0_15px_#B83280]"></div>
              <div className="absolute bottom-[15%] left-[25%] h-2 w-2 rounded-full bg-[#00F5A0] shadow-[0_0_8px_#00F5A0]"></div>
              
              {/* Central orb with voice visualization */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#1C1D2B] border border-[#2E2D47] opacity-70"></div>
                <div className="absolute inset-[10%] flex items-center justify-center">
                  {/* Voice wave visualization */}
                  <div className="flex items-end space-x-1 h-16">
                    {[65, 40, 80, 50, 75, 60, 85, 45, 70, 55, 65, 40, 80, 50].map((height, i) => (
                      <div 
                        key={i} 
                        className={`w-1 rounded-sm bg-[#00F5A0] pulse-delay-${i % 5}`}
                        style={{ 
                          height: `${height}%`,
                          opacity: 0.4 + (i % 5) * 0.1
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-[#00F5A0] opacity-10 animate-pulse"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-30" style={{ 
                backgroundImage: 'radial-gradient(#2E2D47 1px, transparent 1px)', 
                backgroundSize: '20px 20px'
              }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#2E2D47] to-transparent"></div>
    </section>
  );
}
