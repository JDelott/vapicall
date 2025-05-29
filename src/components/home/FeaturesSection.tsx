import { Phone, Monitor, FileText, Users } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-block px-3 sm:px-4 py-1 bg-[#14152A] border-2 border-[#2E2D47] rounded-md text-[#00F5A0] text-xs font-mono tracking-widest mb-4 sm:mb-5 shadow-[0_0_10px_rgba(0,245,160,0.1)]">
            FEATURES
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">
            Powerful AI <span className="text-[#00F5A0]">Features</span>
          </h2>
          
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto px-4">
            From instant phone assistance to specialized dashboard conversations - everything you need for AI help
          </p>
        </div>

        {/* Main Features Container */}
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
            
            {/* Two Main Feature Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 xl:gap-24 mb-12 sm:mb-16">
              
              {/* Phone Features */}
              <div className="relative">
                <div className="mb-8 sm:mb-10 md:mb-12">
                  <div className="inline-flex items-center px-2 sm:px-3 py-1 bg-[#00F5A0]/10 border border-[#00F5A0]/30 rounded-md text-[#00F5A0] text-xs font-mono tracking-wider mb-2">
                    PHONE HOTLINE
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Instant General Assistance</h3>
                </div>
                
                <div className="space-y-6 sm:space-y-8">
                  {[
                    {
                      icon: <Phone className="h-5 w-5" strokeWidth={1.5} />,
                      title: "Call from Any Phone",
                      description: "No apps or accounts needed - just dial and start talking"
                    },
                    {
                      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>,
                      title: "Real-Time Web Search",
                      description: "Get up-to-date information during your conversation"
                    },
                    {
                      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 12h.01"></path><path d="M12 12h.01"></path><path d="M16 12h.01"></path><path d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>,
                      title: "Natural Conversations",
                      description: "Speak naturally and get immediate, helpful responses"
                    }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#00F5A0]/10 border border-[#00F5A0]/30 flex items-center justify-center text-[#00F5A0] mr-4">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-base mb-2">{feature.title}</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Dashboard Features */}
              <div className="relative">
                <div className="mb-8 sm:mb-10 md:mb-12">
                  <div className="inline-flex items-center px-2 sm:px-3 py-1 bg-[#B83280]/10 border border-[#B83280]/30 rounded-md text-[#B83280] text-xs font-mono tracking-wider mb-2">
                    SMART DASHBOARD
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Contextual AI Conversations</h3>
                </div>
                
                <div className="space-y-6 sm:space-y-8">
                  {[
                    {
                      icon: <FileText className="h-5 w-5" strokeWidth={1.5} />,
                      title: "Upload Documents & Images",
                      description: "Add text files, images, or documents for AI analysis"
                    },
                    {
                      icon: <Users className="h-5 w-5" strokeWidth={1.5} />,
                      title: "Specialized Assistants",
                      description: "Choose from health, financial, translation, or general purpose AI"
                    },
                    {
                      icon: <Monitor className="h-5 w-5" strokeWidth={1.5} />,
                      title: "Enhanced Conversations",
                      description: "Have in-depth discussions about your uploaded content"
                    }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#B83280]/10 border border-[#B83280]/30 flex items-center justify-center text-[#B83280] mr-4">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-base mb-2">{feature.title}</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Use Cases Section */}
            <div className="border-t border-[#2E2D47] pt-8 sm:pt-12">
              <div className="text-center mb-8 sm:mb-12">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  Perfect For These <span className="text-[#00F5A0]">Use Cases</span>
                </h3>
                <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
                  Real-world scenarios where VAYA Call makes a difference
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    category: "Quick Questions",
                    examples: ["Web searches", "General problem solving", "Quick translations", "Basic calculations"]
                  },
                  {
                    category: "Document Help", 
                    examples: ["Medical reports", "Legal forms", "Financial statements", "Travel documents"]
                  },
                  {
                    category: "Specialized Guidance",
                    examples: ["Health & wellness", "Financial planning", "Language translation", "Technical explanations"]
                  }
                ].map((useCase, i) => (
                  <div key={i} className="bg-[#14152A]/70 backdrop-blur-sm border border-[#2E2D47] rounded-lg p-4 sm:p-6">
                    <h4 className="text-white font-semibold text-base mb-3">{useCase.category}</h4>
                    <ul className="space-y-2">
                      {useCase.examples.map((example, j) => (
                        <li key={j} className="flex items-center text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] mr-2 flex-shrink-0"></div>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom highlight line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#00F5A0] via-transparent to-[#B83280] opacity-50"></div>
          </div>
        </div>

        {/* Keyframes */}
        <style jsx>{`
          @keyframes move-background {
            from { background-position: 0 0; }
            to { background-position: 100px 100px; }
          }
        `}</style>
      </div>
    </section>
  );
}
