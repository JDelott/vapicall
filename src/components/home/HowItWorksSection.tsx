export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-block px-3 sm:px-4 py-1 bg-[#14152A] border-2 border-[#2E2D47] rounded-md text-[#00F5A0] text-xs font-mono tracking-widest mb-4 sm:mb-5 shadow-[0_0_10px_rgba(0,245,160,0.1)]">
            HOW IT WORKS
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4 px-2 sm:px-4">
            <span className="text-[#00F5A0] drop-shadow-[0_0_10px_rgba(0,245,160,0.3)]">Quick Help</span>
            <span className="text-white mx-2 sm:mx-3 md:mx-4 lg:mx-6">or</span>
            <span className="text-[#B83280] drop-shadow-[0_0_10px_rgba(184,50,128,0.3)]">Deep Conversations</span>
          </h2>
          
          <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4">
            Two powerful ways to access AI assistance - choose what fits your needs
          </p>
        </div>

        {/* Detailed Comparison */}
        <div className="relative">
          {/* Background */}
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <div className="absolute inset-0 opacity-5"
                 style={{
                   backgroundImage: 'radial-gradient(circle at 25% 25%, #B83280 2px, transparent 2px), radial-gradient(circle at 75% 75%, #00F5A0 1px, transparent 1px)',
                   backgroundSize: '50px 50px',
                   animation: 'move-background 20s linear infinite'
                 }}>
            </div>
          </div>
          
          <div className="bg-[#0A0B14]/60 backdrop-blur-sm border border-[#2E2D47] rounded-xl p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 xl:gap-24">
              
              {/* Phone Process */}
              <div className="relative">
                {/* Header */}
                <div className="mb-8 sm:mb-10 md:mb-12">
                  <div className="inline-flex items-center px-2 sm:px-3 py-1 bg-[#00F5A0]/10 border border-[#00F5A0]/30 rounded-md text-[#00F5A0] text-xs font-mono tracking-wider mb-2">
                    PHONE HOTLINE
                  </div>
                  <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Instant General Assistance</h4>
                </div>
                
                <p className="text-gray-300 text-sm sm:text-base mb-8 sm:mb-10 md:mb-12 leading-relaxed">
                  Perfect for quick questions, general problem solving, and immediate assistance without setup
                </p>
                
                {/* Vertical Timeline */}
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-4 sm:left-5 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#00F5A0] via-[#00F5A0]/50 to-transparent"></div>
                  
                  {/* Steps */}
                  <div className="space-y-8 sm:space-y-10 md:space-y-12">
                    <div className="relative flex items-start">
                      <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#00F5A0] flex items-center justify-center text-[#0A0B14] font-bold text-sm sm:text-base md:text-lg shadow-[0_0_20px_rgba(0,245,160,0.3)]">
                        1
                      </div>
                      <div className="ml-4 sm:ml-6 md:ml-8 flex-1">
                        <h5 className="text-white font-semibold text-base sm:text-lg mb-2 sm:mb-3">Dial the Number</h5>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                          Call our AI hotline from any phone. No apps, accounts, or setup required.
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start">
                      <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#00F5A0] flex items-center justify-center text-[#0A0B14] font-bold text-sm sm:text-base md:text-lg shadow-[0_0_20px_rgba(0,245,160,0.3)]">
                        2
                      </div>
                      <div className="ml-4 sm:ml-6 md:ml-8 flex-1">
                        <h5 className="text-white font-semibold text-base sm:text-lg mb-2 sm:mb-3">Start Talking</h5>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                          Ask questions naturally. Get instant answers, web searches, and problem-solving help.
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start">
                      <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#00F5A0] flex items-center justify-center text-[#0A0B14] font-bold text-sm sm:text-base md:text-lg shadow-[0_0_20px_rgba(0,245,160,0.3)]">
                        3
                      </div>
                      <div className="ml-4 sm:ml-6 md:ml-8 flex-1">
                        <h5 className="text-white font-semibold text-base sm:text-lg mb-2 sm:mb-3">Get Results</h5>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                          Receive immediate responses with follow-up questions and clarifications as needed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Dashboard Process */}
              <div className="relative">
                {/* Header */}
                <div className="mb-8 sm:mb-10 md:mb-12">
                  <div className="inline-flex items-center px-2 sm:px-3 py-1 bg-[#B83280]/10 border border-[#B83280]/30 rounded-md text-[#B83280] text-xs font-mono tracking-wider mb-2">
                    SMART DASHBOARD
                  </div>
                  <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Contextual AI Conversations</h4>
                </div>
                
                <p className="text-gray-300 text-sm sm:text-base mb-8 sm:mb-10 md:mb-12 leading-relaxed">
                  Perfect for document analysis, image understanding, and specialized guidance with context
                </p>
                
                {/* Vertical Timeline */}
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-4 sm:left-5 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#B83280] via-[#B83280]/50 to-transparent"></div>
                  
                  {/* Steps */}
                  <div className="space-y-8 sm:space-y-10 md:space-y-12">
                    <div className="relative flex items-start">
                      <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#B83280] flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-[0_0_20px_rgba(184,50,128,0.3)]">
                        1
                      </div>
                      <div className="ml-4 sm:ml-6 md:ml-8 flex-1">
                        <h5 className="text-white font-semibold text-base sm:text-lg mb-2 sm:mb-3">Choose Assistant</h5>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                          Select from specialized AI assistants: health, financial, translation, or general purpose.
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start">
                      <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#B83280] flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-[0_0_20px_rgba(184,50,128,0.3)]">
                        2
                      </div>
                      <div className="ml-4 sm:ml-6 md:ml-8 flex-1">
                        <h5 className="text-white font-semibold text-base sm:text-lg mb-2 sm:mb-3">Upload Content</h5>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                          Add text files, images, or documents that you want the AI to analyze and understand.
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start">
                      <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#B83280] flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-[0_0_20px_rgba(184,50,128,0.3)]">
                        3
                      </div>
                      <div className="ml-4 sm:ml-6 md:ml-8 flex-1">
                        <h5 className="text-white font-semibold text-base sm:text-lg mb-2 sm:mb-3">Call & Discuss</h5>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                          Have in-depth conversations about your content with expert-level AI assistance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom highlight line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#00F5A0] via-transparent to-[#B83280] opacity-50"></div>
          </div>
        </div>

        {/* Keyframes */}
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
