"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import CallInterface from "./CallInterface";
import Button from "@/components/ui/Button";

export default function CallToAction() {
  const [isCallActive, setIsCallActive] = useState(false);

  return (
    <div className="mx-auto w-full">
      {!isCallActive ? (
        <div className="flex flex-col items-center space-y-4">
          <Button 
            size="lg" 
            onClick={() => setIsCallActive(true)}
            className="group relative px-8 py-4 text-lg font-medium bg-white text-blue-600 hover:text-blue-700 rounded-xl shadow-xl transition-all duration-300 overflow-hidden hover:shadow-blue-200/50"
          >
            <div className="absolute inset-0 w-3 bg-gradient-to-r from-blue-400 to-blue-500 group-hover:w-full transition-all duration-300 opacity-10"></div>
            <Phone className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
            Start a Call Now
          </Button>
          <p className="text-sm text-blue-200">No registration required to try</p>
        </div>
      ) : (
        <CallInterface onEnd={() => setIsCallActive(false)} />
      )}
    </div>
  );
}
