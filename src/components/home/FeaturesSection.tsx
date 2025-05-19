import { Command,  Satellite, BookOpen, RotateCw } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Command className="h-5 w-5" strokeWidth={1.5} />,
      title: "Voice Command System",
      description: "Issue natural language commands through our advanced neural-network voice recognition system."
    },
    {
      icon: <BookOpen className="h-5 w-5" strokeWidth={1.5} />,
      title: "Intelligent Knowledge Base",
      description: "Access our vast quantum database of information through simple voice queries."
    },
    {
      icon: <RotateCw className="h-5 w-5" strokeWidth={1.5} />,
      title: "Adaptive Reminders",
      description: "Set context-aware reminders that adapt to your schedule and patterns."
    },
    {
      icon: <Satellite className="h-5 w-5" strokeWidth={1.5} />,
      title: "Global Connectivity",
      description: "Connect to our satellite network from anywhere on the planet with continuous uptime."
    }
  ];

  return (
    <section className="w-full bg-[#0A0B14] py-16 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B14] to-[#14152A]"></div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-[#1C1D2B] border border-[#2E2D47] rounded-md text-[#00F5A0] text-xs font-mono tracking-wider mb-4">
            KEY CAPABILITIES
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3">
            Powerful Features, Simple Interface
          </h2>
          
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our AI phone hotline offers sophisticated capabilities through an intuitive voice interface
          </p>
        </div>
        
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-[#14152A] border border-[#2E2D47] rounded-lg p-5 hover:border-[#00F5A0] transition-all duration-300 relative overflow-hidden group"
            >
              {/* Hover effect highlight */}
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[#00F5A0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              
              <div className="mb-4 p-2.5 rounded-md bg-[#1C1D2B] text-[#00F5A0] inline-block group-hover:bg-[#00F5A0] group-hover:text-[#14152A] transition-colors duration-300">
                {feature.icon}
              </div>
              
              <h3 className="mb-2 text-base font-semibold text-white">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Tech showcase section */}
        <div className="mt-16 bg-[#14152A] border border-[#2E2D47] rounded-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left side - Content */}
            <div className="p-6 md:p-8 relative">
              <div className="inline-flex items-center px-3 py-1 bg-[#1C1D2B] border border-[#2E2D47] rounded-md text-[#B83280] text-xs font-mono tracking-wider mb-4">
                QUANTUM TECHNOLOGY
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">
                Advanced Voice Processing
              </h3>
              
              <p className="text-gray-300 mb-6 text-sm">
                Our voice recognition system uses quantum computing principles to understand context, intent, and nuance in human speech.
              </p>
              
              <div className="space-y-4 mb-6">
                {[
                  "Up to 95% reduction in response time",
                  "Context-aware conversation memory",
                  "Enhanced security protocols"
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="mt-1 flex-shrink-0 h-3 w-3 rounded-sm bg-[#B83280] mr-3"></div>
                    <p className="text-gray-400 text-sm">{item}</p>
                  </div>
                ))}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#2E2D47]">
                {[
                  { value: "99.2%", label: "ACCURACY" },
                  { value: "120ms", label: "RESPONSE" },
                  { value: "24/7", label: "UPTIME" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-lg font-mono text-[#00F5A0]">{stat.value}</div>
                    <div className="text-xs text-gray-500 font-mono">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right side - Visualization */}
            <div className="bg-[#0A0B14] p-6 flex items-center justify-center relative overflow-hidden">
              {/* Background dots */}
              <div className="absolute inset-0 opacity-20" 
                   style={{
                     backgroundImage: 'radial-gradient(#2E2D47 1px, transparent 1px)',
                     backgroundSize: '20px 20px'
                   }}>
              </div>
              
              {/* Central visualization */}
              <div className="relative w-64 h-64">
                {/* Orbit rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-full rounded-full border border-[#2E2D47] opacity-40"></div>
                </div>
                <div className="absolute inset-[15%] flex items-center justify-center">
                  <div className="h-full w-full rounded-full border border-[#2E2D47] opacity-60"></div>
                </div>
                <div className="absolute inset-[30%] flex items-center justify-center">
                  <div className="h-full w-full rounded-full border border-[#2E2D47] opacity-80"></div>
                </div>
                
                {/* Voice wave */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-24 flex items-end justify-center gap-1.5">
                    {[...Array(9)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-1.5 bg-[#B83280]"
                        style={{ 
                          height: `${10 + Math.floor(Math.sin(i/1.5) * 50 + 50)}%`,
                          opacity: 0.6 + (i % 3) * 0.1,
                          animation: 'pulse 1.5s infinite',
                          animationDelay: `${i * 0.1}s`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
                
                {/* Central element */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#1C1D2B] border border-[#2E2D47] flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#B83280] shadow-[0_0_15px_rgba(184,50,128,0.3)]"></div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-[20%] right-[25%] h-2 w-2 rounded-full bg-[#00F5A0] shadow-[0_0_8px_rgba(0,245,160,0.5)]"></div>
                <div className="absolute bottom-[15%] left-[20%] h-3 w-3 rounded-full bg-[#B83280] shadow-[0_0_10px_rgba(184,50,128,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Terminal-like data display */}
        <div className="mt-10 bg-[#0A0B14] border border-[#2E2D47] rounded-lg p-5 font-mono text-xs">
          <div className="flex items-center mb-3">
            <div className="h-2 w-2 rounded-full bg-[#B83280] mr-2"></div>
            <div className="h-2 w-2 rounded-full bg-[#00F5A0] mr-2"></div>
            <div className="h-2 w-2 rounded-full bg-gray-500 mr-2"></div>
            <span className="text-gray-400 text-xs">system.status</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-500">voice_recognition:</div>
              <div className="text-[#00F5A0]">online</div>
              
              <div className="text-gray-500 mt-2">response_time:</div>
              <div className="text-[#00F5A0]">120ms</div>
              
              <div className="text-gray-500 mt-2">database_sync:</div>
              <div className="text-[#00F5A0]">complete</div>
            </div>
            <div>
              <div className="text-gray-500">quantum_cores:</div>
              <div className="text-[#00F5A0]">16/16</div>
              
              <div className="text-gray-500 mt-2">neural_nodes:</div>
              <div className="text-[#00F5A0]">1.4M active</div>
              
              <div className="text-gray-500 mt-2">security_level:</div>
              <div className="text-[#00F5A0]">maximum</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
