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
            Access AI through simple voice calls - anywhere, anytime. Optionally upload context for enhanced conversations.
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
        
        {/* Optional Enhancement Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-[#1C1D2B]/80 backdrop-blur-sm border border-[#2E2D47] rounded-md text-[#B83280] text-xs font-mono tracking-wider mb-4 shadow-[0_0_10px_rgba(0,0,0,0.3)]">
            OPTIONAL ENHANCEMENT
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">
            Upload Context for <span className="text-[#B83280]">Enhanced Discussions</span>
          </h3>
          
          <p className="text-gray-300 max-w-2xl mx-auto text-sm">
            Want to discuss a specific document? Upload it through our web interface before your call for AI-powered analysis and conversation.
          </p>
        </div>

        {/* Interactive Flow Visualization */}
        <div className="relative mb-20">
          {/* Animated background container */}
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <div className="absolute inset-0 opacity-5"
                 style={{
                   backgroundImage: 'radial-gradient(circle at 25% 25%, #B83280 2px, transparent 2px), radial-gradient(circle at 75% 75%, #00F5A0 1px, transparent 1px)',
                   backgroundSize: '50px 50px',
                   animation: 'move-background 20s linear infinite'
                 }}>
            </div>
            
            {/* Floating particles in background */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#B83280] opacity-30 animate-[float_4s_ease-in-out_infinite]"></div>
            <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 rounded-full bg-[#00F5A0] opacity-40 animate-[float_3s_ease-in-out_infinite_1s]"></div>
            <div className="absolute bottom-1/3 left-2/3 w-1 h-1 rounded-full bg-[#B83280] opacity-50 animate-[float_3.5s_ease-in-out_infinite_2s]"></div>
          </div>
          
          <div className="bg-[#0A0B14]/60 backdrop-blur-sm border border-[#2E2D47] rounded-xl p-8 relative overflow-hidden">
            {/* Flow Steps */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-8">
              
              {/* Step 1: Upload */}
              <div className="flex-1 relative">
                <div className="relative group">
                  {/* Static orb with subtle hover effect */}
                  <div className="w-20 h-20 mx-auto mb-4 relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#B83280]/10 to-[#4B2D83]/5 group-hover:from-[#B83280]/20 group-hover:to-[#4B2D83]/10 transition-all duration-300"></div>
                    <div className="absolute inset-2 rounded-full bg-[#14152A] border-2 border-[#B83280] flex items-center justify-center group-hover:border-[#B83280]/80 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#B83280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                  </div>
                  
                  <h4 className="text-white font-semibold text-center mb-2">Upload</h4>
                  <p className="text-gray-400 text-sm text-center max-w-xs mx-auto">
                    Drop your documents, images, or screenshots into our web interface
                  </p>
                </div>
              </div>

              {/* Animated Arrow */}
              <div className="hidden lg:block relative">
                <svg className="w-16 h-8 text-[#2E2D47]" fill="none" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 16h52m0 0l-8-8m8 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="58" cy="16" r="2" fill="#00F5A0" className="animate-ping"/>
                </svg>
              </div>

              {/* Step 2: Process */}
              <div className="flex-1 relative">
                <div className="relative group">
                  {/* Processing with subtle rotation */}
                  <div className="w-20 h-20 mx-auto mb-4 relative">
                    <div className="absolute inset-0 rounded-full border border-[#00F5A0]/20 group-hover:animate-spin group-hover:border-[#00F5A0]/40 transition-all duration-300"></div>
                    <div className="absolute inset-3 rounded-full bg-[#14152A] border-2 border-[#00F5A0] flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#00F5A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  
                  <h4 className="text-white font-semibold text-center mb-2">AI Analysis</h4>
                  <p className="text-gray-400 text-sm text-center max-w-xs mx-auto">
                    AI processes and understands your content, preparing insights for discussion
                  </p>
                </div>
              </div>

              {/* Animated Arrow */}
              <div className="hidden lg:block relative">
                <svg className="w-16 h-8 text-[#2E2D47]" fill="none" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 16h52m0 0l-8-8m8 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="58" cy="16" r="2" fill="#B83280" className="animate-ping"/>
                </svg>
              </div>

              {/* Step 3: Enhanced Call */}
              <div className="flex-1 relative">
                <div className="relative group">
                  {/* Call with subtle pulse on hover */}
                  <div className="w-20 h-20 mx-auto mb-4 relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#B83280]/10 to-[#00F5A0]/10 group-hover:animate-pulse transition-all duration-300"></div>
                    <div className="absolute inset-3 rounded-full bg-[#14152A] border-2 border-[#B83280] flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-[#B83280]" strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  <h4 className="text-white font-semibold text-center mb-2">Enhanced Call</h4>
                  <p className="text-gray-400 text-sm text-center max-w-xs mx-auto">
                    Discuss your documents naturally through voice with AI-powered insights
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom highlight line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B83280] to-transparent opacity-50"></div>
          </div>
        </div>

        {/* Updated keyframes - removed slide animation */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-10px) translateX(5px); }
          }
          
          @keyframes move-background {
            from { background-position: 0 0; }
            to { background-position: 100px 100px; }
          }
        `}</style>
      </div>
    </section>
  );
}
