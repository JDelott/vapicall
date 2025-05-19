import { Star, Zap, Sparkles } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <Star className="h-5 w-5" strokeWidth={1.5} />,
      step: "01",
      title: "Initiate Contact",
      description: "Call our AI hotline from any phone or device. No registration or downloads required."
    },
    {
      icon: <Zap className="h-5 w-5" strokeWidth={1.5} />,
      step: "02",
      title: "Voice Interaction",
      description: "Speak naturally and our quantum AI will understand your request, question, or command."
    },
    {
      icon: <Sparkles className="h-5 w-5" strokeWidth={1.5} />,
      step: "03",
      title: "Receive Results",
      description: "Get immediate information, set reminders, or complete actions through the voice interface."
    }
  ];

  return (
    <section className="w-full bg-[#14152A] py-16 relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Diagonal grid lines */}
        <div className="absolute inset-0" 
             style={{
               backgroundImage: 'linear-gradient(135deg, rgba(46, 45, 71, 0.2) 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }}>
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-[#4B2D83] opacity-10 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-40 h-40 rounded-full bg-[#B83280] opacity-10 blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-[#1C1D2B] border border-[#2E2D47] rounded-md text-[#00F5A0] text-xs font-mono tracking-wider mb-4">
            PROCESS OVERVIEW
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3">
            How It Works
          </h2>
          
          <p className="text-gray-300 max-w-2xl mx-auto">
            Three simple steps to interact with our quantum voice technology
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Timeline connector */}
          <div className="hidden md:block absolute left-1/2 top-24 w-[calc(100%-160px)] h-0.5 bg-gradient-to-r from-transparent via-[#2E2D47] to-transparent transform -translate-x-1/2"></div>
          
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative bg-[#1C1D2B] border border-[#2E2D47] rounded-lg p-6 flex flex-col items-center text-center group hover:border-[#00F5A0] transition-colors duration-300"
            >
              {/* Circle connector */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#14152A] border-4 border-[#1C1D2B] flex items-center justify-center z-10">
                <div className="w-6 h-6 rounded-full bg-[#2E2D47] group-hover:bg-[#00F5A0] transition-colors duration-300 flex items-center justify-center text-white">
                  {step.icon}
                </div>
              </div>
              
              <div className="text-[#B83280] font-mono text-xl mb-3 mt-4">{step.step}</div>
              
              <h3 className="text-white text-lg font-semibold mb-3">{step.title}</h3>
              
              <p className="text-gray-400 text-sm">{step.description}</p>
              
              {/* Bottom highlight */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00F5A0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          ))}
        </div>
        
        {/* Process visualization */}
        <div className="mt-16 grid md:grid-cols-5 gap-0 bg-[#0A0B14] border border-[#2E2D47] rounded-lg overflow-hidden">
          {/* Left side - Voice input */}
          <div className="md:col-span-2 p-6 border-b md:border-b-0 md:border-r border-[#2E2D47] relative">
            <div className="absolute inset-0 opacity-5" 
                 style={{
                   backgroundImage: 'radial-gradient(#2E2D47 1px, transparent 1px)',
                   backgroundSize: '20px 20px'
                 }}>
            </div>
            
            <div className="relative text-center mb-8 flex flex-col items-center">
              <div className="inline-flex items-center px-3 py-1 bg-[#1C1D2B] border border-[#2E2D47] rounded-md text-[#B83280] text-xs font-mono tracking-wider mb-4">
                INPUT
              </div>
              
              <h4 className="text-white text-lg font-medium mb-2">Voice Command</h4>
              <p className="text-gray-400 text-sm mb-4">User speaks a natural language request</p>
              
              {/* Voice input visualization */}
              <div className="h-10 flex items-end justify-center space-x-1 mt-4">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1 bg-[#B83280]" 
                    style={{ 
                      height: `${20 + Math.floor(Math.sin(i/1.5) * 60)}%`,
                      opacity: 0.4 + (i % 3) * 0.2,
                      animation: 'pulse 1.5s infinite',
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
              
              <div className="mt-6 py-2 px-4 rounded-full bg-[#1C1D2B] border border-[#2E2D47] text-sm text-gray-300">
                &quot;Set a reminder for my meeting tomorrow at 3pm&quot;
              </div>
            </div>
          </div>
          
          {/* Middle - Processing */}
          <div className="md:col-span-1 p-6 bg-[#1C1D2B] border-b md:border-b-0 md:border-r border-[#2E2D47] flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-[#14152A] border border-[#2E2D47] mx-auto flex items-center justify-center mb-4">
                <div className="h-6 w-6 text-[#00F5A0] animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 16.5V21m0-12V3m0 13.5l-4-4m4 4l4-4"/>
                  </svg>
                </div>
              </div>
              
              <div className="text-xs font-mono text-[#00F5A0] mb-1">PROCESSING</div>
              <div className="text-gray-400 text-xs">Neural analysis</div>
            </div>
          </div>
          
          {/* Right side - Output */}
          <div className="md:col-span-2 p-6 relative">
            <div className="absolute inset-0 opacity-5" 
                 style={{
                   backgroundImage: 'radial-gradient(#2E2D47 1px, transparent 1px)',
                   backgroundSize: '20px 20px'
                 }}>
            </div>
            
            <div className="relative text-center mb-4 flex flex-col items-center">
              <div className="inline-flex items-center px-3 py-1 bg-[#1C1D2B] border border-[#2E2D47] rounded-md text-[#00F5A0] text-xs font-mono tracking-wider mb-4">
                OUTPUT
              </div>
              
              <h4 className="text-white text-lg font-medium mb-2">AI Response</h4>
              <p className="text-gray-400 text-sm mb-4">System confirms and executes the request</p>
            </div>
            
            {/* Response visualization */}
            <div className="bg-[#1C1D2B] border border-[#2E2D47] rounded-lg p-4 max-w-sm mx-auto">
              <div className="flex items-center mb-3">
                <div className="h-8 w-8 rounded-full bg-[#14152A] border border-[#2E2D47] flex items-center justify-center mr-3">
                  <div className="h-4 w-4 text-[#00F5A0]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 16a4 4 0 0 0 0-8"/>
                      <path d="M19 6A7.7 7.7 0 0 0 12 3a7.9 7.9 0 0 0-7.93 8c0 3.22 2.2 6.17 5.56 7.66"/>
                      <path d="M19 14.3V21"/>
                      <path d="M19 14.3a3.72 3.72 0 0 0-3.75 3.75A3.71 3.71 0 0 0 19 21a3.71 3.71 0 0 0 3.75-3.75A3.71 3.71 0 0 0 19 14.3"/>
                    </svg>
                  </div>
                </div>
                <div className="text-sm font-medium text-white">VAPI Assistant</div>
              </div>
              
              <div className="text-gray-300 text-sm pl-11">
                Reminder set for tomorrow at 3:00 PM: &quot;Meeting&quot;
              </div>
              
              <div className="mt-3 pl-11 flex items-center">
                <div className="h-4 w-4 rounded-full bg-[#00F5A0] text-[#1C1D2B] flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <div className="text-[#00F5A0] text-xs">COMPLETE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
