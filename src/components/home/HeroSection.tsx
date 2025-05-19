import CallToAction from "@/components/call/CallToAction";

export default function HeroSection() {
  return (
    <section className="w-full bg-[#0A0B14] min-h-[90vh] flex items-center relative overflow-hidden">
      {/* Starry background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(75, 45, 131, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(184, 50, 128, 0.1) 0%, transparent 40%)',
               backgroundSize: '100% 100%',
             }}>
        </div>
        {/* Stars */}
        <div className="absolute inset-0" 
             style={{
               backgroundImage: 'radial-gradient(1px 1px at 50px 120px, #fff 100%, transparent), radial-gradient(1px 1px at 120px 250px, #fff 100%, transparent), radial-gradient(1.5px 1.5px at 200px 80px, #fff 100%, transparent), radial-gradient(1px 1px at 300px 220px, #fff 100%, transparent), radial-gradient(1px 1px at 400px 150px, #fff 100%, transparent), radial-gradient(1.5px 1.5px at 500px 280px, #fff 100%, transparent), radial-gradient(1px 1px at 50px 350px, #fff 100%, transparent), radial-gradient(1px 1px at 600px 120px, #fff 100%, transparent), radial-gradient(1.5px 1.5px at 700px 190px, #fff 100%, transparent)',
               backgroundSize: '700px 400px',
             }}>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center px-3 py-1 bg-[#1C1D2B] border border-[#2E2D47] rounded-md text-[#00F5A0] text-xs font-mono tracking-wider mb-5">
              QUANTUM VOICE TECHNOLOGY
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-[1.1]">
              AI <span className="text-[#B83280]">Voice</span><br/>Interface
            </h1>
            
            <p className="text-lg text-gray-300 mb-8">
              The next evolution in communication. Voice commands, reminders, and answers—all powered by advanced AI.
            </p>
            
            {/* Feature bullets */}
            <div className="mb-10 space-y-4">
              {[
                "Neural-network voice processing",
                "Quantum-enhanced response system",
                "Adaptive learning algorithms"
              ].map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="mt-1.5 flex-shrink-0 h-3 w-3 rounded-sm bg-[#00F5A0] mr-4"></div>
                  <p className="text-gray-300">{feature}</p>
                </div>
              ))}
            </div>
            
            <div className="mb-4">
              <CallToAction />
            </div>
            
            <p className="text-sm text-gray-500">No registration required to try</p>
          </div>
          
          {/* Right visualization */}
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
              <div className="absolute inset-[35%] rounded-full bg-[#1C1D2B] border border-[#2E2D47] shadow-lg flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full flex items-end justify-center gap-1 px-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-1.5 bg-[#00F5A0]"
                        style={{ 
                          height: `${20 + Math.floor(Math.random() * 60)}%`,
                          opacity: 0.7,
                          animation: 'pulse 1.5s infinite',
                          animationDelay: `${i * 0.2}s`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="relative h-14 w-14 rounded-full bg-[#B83280] bg-opacity-20 z-10 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-[#B83280] animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
