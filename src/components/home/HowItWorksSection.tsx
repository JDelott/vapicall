import { Phone, Search, MessageSquare } from "lucide-react";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-20 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1 bg-[#14152A] border-2 border-[#2E2D47] rounded-md text-[#00F5A0] text-xs font-mono tracking-widest mb-5 shadow-[0_0_10px_rgba(0,245,160,0.1)]">
            HOW IT WORKS
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-4">
            Powerful <span className="text-[#00F5A0]">Voice Intelligence</span>
          </h2>
          
          <p className="text-gray-300 max-w-2xl mx-auto">
            Access AI through simple voice calls - anywhere, anytime
          </p>
        </div>
        
        {/* 3 Steps in cosmic style */}
        <div className="grid md:grid-cols-3 gap-10 mb-20 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2E2D47] to-transparent z-0"></div>
          
          {/* Step 1 */}
          <div className="relative bg-[#14152A]/80 backdrop-blur-sm border border-[#2E2D47] rounded-lg p-6 group hover:border-[#00F5A0] transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,245,160,0.15)] overflow-hidden">
            {/* Cosmic accent */}
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br from-[#B83280]/10 to-[#B83280]/5 blur-xl"></div>
            
            {/* Icon with orbit */}
            <div className="relative h-16 w-16 mb-6 mx-auto">
              <div className="absolute inset-0 rounded-full border border-[#2E2D47] animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute inset-[25%] rounded-full border border-[#2E2D47] animate-[spin_5s_linear_infinite_reverse]"></div>
              <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#B83280] shadow-[0_0_5px_#B83280]"></div>
              
              <div className="absolute inset-[30%] rounded-full bg-[#14152A] border border-[#2E2D47] flex items-center justify-center shadow-lg">
                <Phone className="h-5 w-5 text-[#00F5A0]" strokeWidth={1.5} />
              </div>
            </div>
            
            <div className="text-[#B83280] font-mono text-lg mb-2 text-center">01</div>
            <h3 className="text-white text-lg font-semibold mb-3 text-center">Make a Call</h3>
            <p className="text-gray-300 text-sm text-center">
              Call our AI through your phone or browser. No apps, logins, or complex setup needed.
            </p>
            
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F5A0] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>
          
          {/* Step 2 */}
          <div className="relative bg-[#14152A]/80 backdrop-blur-sm border border-[#2E2D47] rounded-lg p-6 group hover:border-[#00F5A0] transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,245,160,0.15)] overflow-hidden mt-8 md:mt-0">
            {/* Cosmic accent */}
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br from-[#00F5A0]/10 to-[#00F5A0]/5 blur-xl"></div>
            
            {/* Icon with orbit */}
            <div className="relative h-16 w-16 mb-6 mx-auto">
              <div className="absolute inset-0 rounded-full border border-[#2E2D47] animate-[spin_8s_linear_infinite_reverse]"></div>
              <div className="absolute inset-[25%] rounded-full border border-[#2E2D47] animate-[spin_4s_linear_infinite]"></div>
              <div className="absolute bottom-0 left-[10%] h-2 w-2 rounded-full bg-[#00F5A0] shadow-[0_0_5px_#00F5A0]"></div>
              
              <div className="absolute inset-[30%] rounded-full bg-[#14152A] border border-[#2E2D47] flex items-center justify-center shadow-lg">
                <Search className="h-5 w-5 text-[#00F5A0]" strokeWidth={1.5} />
              </div>
            </div>
            
            <div className="text-[#00F5A0] font-mono text-lg mb-2 text-center">02</div>
            <h3 className="text-white text-lg font-semibold mb-3 text-center">Access Real-Time Data</h3>
            <p className="text-gray-300 text-sm text-center">
              Get current information from across the web through voice, with real-time searches and updates.
            </p>
            
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F5A0] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>
          
          {/* Step 3 */}
          <div className="relative bg-[#14152A]/80 backdrop-blur-sm border border-[#2E2D47] rounded-lg p-6 group hover:border-[#00F5A0] transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,245,160,0.15)] overflow-hidden mt-8 md:mt-0">
            {/* Cosmic accent */}
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br from-[#B83280]/10 to-[#4B2D83]/10 blur-xl"></div>
            
            {/* Icon with orbit */}
            <div className="relative h-16 w-16 mb-6 mx-auto">
              <div className="absolute inset-0 rounded-full border border-[#2E2D47] animate-[spin_12s_linear_infinite]"></div>
              <div className="absolute inset-[25%] rounded-full border border-[#2E2D47] animate-[spin_6s_linear_infinite_reverse]"></div>
              <div className="absolute top-[10%] left-[50%] h-2 w-2 rounded-full bg-[#B83280] shadow-[0_0_5px_#B83280]"></div>
              
              <div className="absolute inset-[30%] rounded-full bg-[#14152A] border border-[#2E2D47] flex items-center justify-center shadow-lg">
                <MessageSquare className="h-5 w-5 text-[#00F5A0]" strokeWidth={1.5} />
              </div>
            </div>
            
            <div className="text-[#B83280] font-mono text-lg mb-2 text-center">03</div>
            <h3 className="text-white text-lg font-semibold mb-3 text-center">Have Conversations</h3>
            <p className="text-gray-300 text-sm text-center">
              Chat naturally with follow-up questions and deep discussions that remember context from your entire call.
            </p>
            
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F5A0] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>
        </div>
        
        {/* Central cosmic visualization */}
        <div className="relative flex justify-center mb-20">
          <div className="relative w-full max-w-2xl h-80 bg-[#0A0B14]/60 backdrop-blur-sm border border-[#2E2D47] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            {/* Animated starfield background */}
            <div className="absolute inset-0 opacity-30"
                 style={{
                   backgroundImage: 'radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.3) 100%, transparent), radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.2) 100%, transparent), radial-gradient(1.5px 1.5px at 90px 40px, rgba(255,255,255,0.3) 100%, transparent), radial-gradient(1.5px 1.5px at 60px 100px, rgba(255,255,255,0.3) 100%, transparent)',
                   backgroundSize: '100px 100px',
                   animation: 'move-background 30s linear infinite'
                 }}>
            </div>
            
            {/* Central orbital system */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Orbit rings */}
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 rounded-full border border-[#2E2D47] opacity-20 animate-[spin_60s_linear_infinite]"></div>
                <div className="absolute inset-[20%] rounded-full border border-[#2E2D47] opacity-30 animate-[spin_45s_linear_infinite_reverse]"></div>
                <div className="absolute inset-[40%] rounded-full border border-[#2E2D47] opacity-40 animate-[spin_30s_linear_infinite]"></div>
                
                {/* Center node - Voice Hub */}
                <div className="absolute inset-[42%] rounded-full bg-gradient-to-br from-[#4B2D83] to-[#B83280] shadow-[0_0_20px_rgba(184,50,128,0.5)] flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </div>
                
                {/* Orbiting nodes */}
                <div className="absolute top-[5%] left-[50%] transform -translate-x-1/2 w-8 h-8 animate-[orbit_10s_linear_infinite]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-[#00F5A0] shadow-[0_0_10px_rgba(0,245,160,0.7)]"></div>
                  </div>
                </div>
                
                <div className="absolute top-[50%] right-[5%] transform -translate-y-1/2 w-8 h-8 animate-[orbit_15s_linear_infinite_2s]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-5 w-5 rounded-full bg-[#B83280] shadow-[0_0_10px_rgba(184,50,128,0.7)]"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-[10%] left-[20%] w-8 h-8 animate-[orbit_8s_linear_infinite_1s]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-[#00F5A0] shadow-[0_0_10px_rgba(0,245,160,0.7)]"></div>
                  </div>
                </div>
                
                {/* Data transmission beams */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <line x1="50%" y1="50%" x2="50%" y2="5%" stroke="url(#gradient1)" strokeWidth="1" strokeDasharray="2,3" className="animate-pulse">
                      <animate attributeName="y2" values="5%;10%;5%" dur="3s" repeatCount="indefinite" />
                    </line>
                    <line x1="50%" y1="50%" x2="95%" y2="50%" stroke="url(#gradient2)" strokeWidth="1" strokeDasharray="2,3" className="animate-pulse">
                      <animate attributeName="x2" values="95%;90%;95%" dur="4s" repeatCount="indefinite" />
                    </line>
                    <line x1="50%" y1="50%" x2="20%" y2="90%" stroke="url(#gradient1)" strokeWidth="1" strokeDasharray="2,3" className="animate-pulse">
                      <animate attributeName="x2" values="20%;25%;20%" dur="5s" repeatCount="indefinite" />
                      <animate attributeName="y2" values="90%;85%;90%" dur="5s" repeatCount="indefinite" />
                    </line>
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00F5A0" stopOpacity="0" />
                        <stop offset="50%" stopColor="#00F5A0" stopOpacity="1" />
                        <stop offset="100%" stopColor="#00F5A0" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#B83280" stopOpacity="0" />
                        <stop offset="50%" stopColor="#B83280" stopOpacity="1" />
                        <stop offset="100%" stopColor="#B83280" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Voice wave visualization on the bottom */}
            <div className="absolute bottom-8 inset-x-0 h-16 flex items-end justify-center space-x-1">
              {[40, 60, 90, 75, 50, 65, 80, 95, 70, 55, 75, 85, 65, 50, 70].map((height, i) => (
                <div 
                  key={i} 
                  className="w-1.5 bg-[#00F5A0] rounded-sm"
                  style={{ 
                    height: `${height}%`,
                    opacity: 0.3 + (i % 5) * 0.1,
                    animation: `sound-wave ${1 + (i % 5) * 0.1}s infinite alternate ${i * 0.05}s ease-in-out`
                  }}
                ></div>
              ))}
            </div>
            
            {/* Top and bottom borders */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00F5A0] to-transparent"></div>
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00F5A0] to-transparent"></div>
          </div>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ),
              title: "Real-Time Updates",
              desc: "Get the latest information through voice calls"
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
              title: "Smart Conversations",
              desc: "Natural back-and-forth AI discussions"
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              ),
              title: "No Setup Required",
              desc: "Call without downloads or registration"
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              ),
              title: "Hands-Free Access",
              desc: "Use while driving or multitasking"
            }
          ].map((feature, i) => (
            <div key={i} className="p-4 bg-[#14152A]/60 backdrop-blur-sm border border-[#2E2D47] rounded-lg hover:border-[#00F5A0] transition-colors duration-300 hover:shadow-[0_0_15px_rgba(0,245,160,0.1)]">
              <div className="h-8 w-8 rounded-md bg-[#0A0B14] border border-[#2E2D47] flex items-center justify-center text-[#00F5A0] mb-3">
                {feature.icon}
              </div>
              <h4 className="text-white font-medium mb-2">{feature.title}</h4>
              <p className="text-gray-400 text-xs">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes sound-wave {
          0% { transform: scaleY(0.2); }
          100% { transform: scaleY(1); }
        }
        
        @keyframes move-background {
          from { background-position: 0 0; }
          to { background-position: 100px 100px; }
        }
        
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(90px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
        }
      `}</style>
    </section>
  );
}
