import { Phone, Search, MessageSquare, Globe } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Phone className="h-5 w-5" strokeWidth={1.5} />,
      title: "Voice AI Calling",
      description: "Access AI through a standard phone call - no apps or special devices required."
    },
    {
      icon: <Search className="h-5 w-5" strokeWidth={1.5} />,
      title: "Real-Time Web Search",
      description: "Get up-to-date information with our AI that can search the web during your conversation."
    },
    {
      icon: <MessageSquare className="h-5 w-5" strokeWidth={1.5} />,
      title: "Natural Conversations",
      description: "Engage in fluid, human-like conversations with advanced voice recognition and response."
    },
    {
      icon: <Globe className="h-5 w-5" strokeWidth={1.5} />,
      title: "Accessible Anywhere",
      description: "Use from any phone, anytime - making AI accessible to everyone regardless of tech savviness."
    }
  ];

  return (
    <section className="w-full bg-[#0A0B14] py-16 relative">
      {/* Space background with stars and gradients - matches hero section */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070810] via-[#0C0D1D] to-[#121325]"></div>
      
      {/* Stars background with reduced opacity */}
      <div className="absolute inset-0 opacity-50" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.15) 1px, transparent 1px), 
                          radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.12) 1px, transparent 1px)`,
          backgroundSize: '100px 100px, 120px 120px, 80px 80px'
        }}
      ></div>
      
      {/* Darker grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMyRTJENDciIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-[#1C1D2B]/80 backdrop-blur-sm border border-[#2E2D47] rounded-md text-[#00F5A0] text-xs font-mono tracking-wider mb-4 shadow-[0_0_10px_rgba(0,0,0,0.3)]">
            <span className="mr-1.5">⚡</span> FEATURES
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
            AI Phone <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5A0] to-[#00F5A0]">Experience</span>
          </h2>
          
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            Access the power of AI through a simple phone call with our intuitive voice interface
          </p>
        </div>
        
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-[#14152A]/70 backdrop-blur-sm border border-[#2E2D47] rounded-lg p-5 hover:border-[#00F5A0] transition-all duration-300 relative overflow-hidden group shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
            >
              {/* Hover effect highlight */}
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#00F5A0] to-[#00F5A0]/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              
              <div className="mb-4 p-2.5 rounded-lg bg-[#1C1D2B] text-[#00F5A0] inline-block group-hover:bg-[#00F5A0]/10 transition-colors duration-300 border border-[#2E2D47]/50">
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
        
        {/* Use case showcase section */}
        <div className="mt-16 bg-[#14152A]/70 backdrop-blur-sm border border-[#2E2D47] rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left side - Content */}
            <div className="p-6 md:p-8 relative">
              <div className="inline-flex items-center px-3 py-1 bg-[#1C1D2B]/80 backdrop-blur-sm border border-[#2E2D47] rounded-md text-[#B83280] text-xs font-mono tracking-wider mb-4 shadow-[0_0_10px_rgba(0,0,0,0.3)]">
                REAL-TIME INFORMATION
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">
                Search the Web by Voice
              </h3>
              
              <p className="text-gray-300 mb-6 text-sm">
                Our AI can search the internet during your call, giving you up-to-date information about news, weather, facts, and more.
              </p>
              
              <div className="space-y-4 mb-6">
                {[
                  "Get the latest news and updates instantly",
                  "Ask for real-time information during conversations",
                  "No need for a separate Google search"
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="mt-1 flex-shrink-0 h-3 w-3 rounded-sm bg-[#B83280] mr-3"></div>
                    <p className="text-gray-400 text-sm">{item}</p>
                  </div>
                ))}
              </div>
              
              {/* Example usage */}
              <div className="bg-[#0A0B14]/80 rounded-lg p-4 border border-[#2E2D47] mt-4">
                <h4 className="text-sm font-medium text-white mb-2">Example Queries:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-gray-400">&ldquo;What are the breaking developments in AI regulation today?&rdquo;</li>
                  <li className="text-gray-400">&ldquo;Find me the best-rated Italian restaurants within walking distance&rdquo;</li>
                  <li className="text-gray-400">&ldquo;When is the next SpaceX launch and what&apos;s its mission?&rdquo;</li>
                  <li className="text-gray-400">&ldquo;How have cryptocurrency markets responded to the latest Fed announcement?&rdquo;</li>
                  <li className="text-gray-400">&ldquo;What&apos;s causing the unusual weather pattern in the Pacific Northwest?&rdquo;</li>
                </ul>
              </div>
            </div>
            <div className="bg-[#0A0B14]/90 p-6 flex items-center justify-center relative overflow-hidden">
              {/* Background dots */}
              <div className="absolute inset-0 opacity-20" 
                   style={{
                     backgroundImage: 'radial-gradient(#2E2D47 1px, transparent 1px)',
                     backgroundSize: '20px 20px'
                   }}>
              </div>
              
              {/* Phone call visualization */}
              <div className="relative w-full max-w-xs">
                {/* Phone device frame */}
                <div className="bg-[#181A33] rounded-xl overflow-hidden border border-[#2E2D47] shadow-lg">
                  {/* Phone status bar */}
                  <div className="bg-[#1C1D2B] px-3 py-2 flex items-center justify-between border-b border-[#2E2D47]">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-[#00F5A0] animate-pulse mr-2"></div>
                      <span className="text-white text-xs">Call in progress</span>
                    </div>
                    <div className="text-[#00F5A0] text-xs">02:45</div>
                  </div>
                  
                  {/* Call visualization */}
                  <div className="p-4 space-y-4">
                    {/* Voice activity indicator */}
                    <div className="flex justify-center mb-6">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#1C1D2B] text-[#B83280] border border-[#2E2D47]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      </div>
                    </div>
                    
                    {/* Voice waveform visualization */}
                    <div className="bg-[#14152A] p-3 rounded-lg border border-[#2E2D47]/50">
                      <div className="text-xs text-gray-400 mb-2">You asked:</div>
                      <div className="text-white text-sm mb-2">&ldquo;What&apos;s in today&apos;s tech news?&rdquo;</div>
                      <div className="flex items-center justify-center h-8">
                        {[40, 20, 60, 30, 70, 50, 25, 65, 45, 20, 50, 30, 60].map((height, i) => (
                          <div 
                            key={i} 
                            className="w-1 mx-0.5 bg-[#B83280] rounded-full"
                            style={{ 
                              height: `${height}%`,
                              opacity: 0.6 + (i % 3) * 0.15,
                              animation: 'none'
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Search indicator */}
                    <div className="bg-[#14152A] p-3 rounded-lg border border-[#2E2D47]/50">
                      <div className="flex items-center text-[#00F5A0] mb-2">
                        <Search className="h-3 w-3 mr-1.5" strokeWidth={2} />
                        <span className="text-xs">Searching the web...</span>
                      </div>
                      <div className="h-1 bg-[#1C1D2B] rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-[#00F5A0] rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    {/* AI response with voice waveform */}
                    <div className="bg-[#14152A] p-3 rounded-lg border border-[#2E2D47]/50">
                      <div className="text-xs text-gray-400 mb-2">AI is speaking:</div>
                      <div className="flex items-center justify-center h-12">
                        {[30, 50, 70, 60, 80, 40, 65, 30, 50, 40, 60, 70, 50, 30, 40].map((height, i) => (
                          <div 
                            key={i} 
                            className="w-1 mx-0.5 bg-[#00F5A0] rounded-full animate-pulse"
                            style={{ 
                              height: `${height}%`,
                              opacity: 0.6 + (i % 3) * 0.15,
                              animationDelay: `${i * 0.1}s`
                            }}
                          ></div>
                        ))}
                      </div>
                      <div className="text-white text-xs mt-2 italic">
                        &ldquo;Apple announced new AI features for iOS today...&rdquo;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
