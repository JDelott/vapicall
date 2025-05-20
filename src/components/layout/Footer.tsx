import Link from "next/link";
import { Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A0B14] text-white border-t border-[#2E2D47] py-6">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-4">
          <a 
            href="tel:+14125208354" 
            className="inline-flex items-center justify-center px-6 py-2.5 bg-[#14152A] text-white font-medium rounded-lg relative overflow-hidden group transition-all duration-300 border border-[#2E2D47] shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_5px_15px_rgba(0,245,160,0.3)]"
          >
            {/* Animated gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#14152A] via-[#1C1D2B] to-[#14152A] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Bottom glow effect */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00F5A0]/50 to-[#B83280]/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            
            {/* Phone icon with subtle pulse */}
            <div className="mr-3 flex items-center justify-center h-8 w-8 rounded-full bg-[#1C1D2B] border border-[#2E2D47] relative group-hover:border-[#00F5A0]/50 transition-colors">
              <Phone className="h-4 w-4 text-[#00F5A0] relative z-10" />
              <div className="absolute inset-0 bg-[#00F5A0]/10 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
            </div>
            
            {/* Text with subtle animation */}
            <div className="relative z-10 flex flex-col items-start">
              <span className="text-xs text-gray-400 group-hover:text-[#00F5A0] transition-colors">Talk to AI Now</span>
              <span className="text-sm font-semibold tracking-wide">+1 412-520-8354</span>
            </div>
          </a>
        </div>
        
        <div className="flex justify-center space-x-4 mb-3 text-sm text-gray-400">
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
        
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} VAPI Call
        </p>
      </div>
    </footer>
  );
}
