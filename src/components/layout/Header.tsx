"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-dark-800 border-b border-dark-600 backdrop-blur-sm z-50 sticky top-0">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-neon-blue">
            <Phone className="mr-2 h-6 w-6" />
            <span className="text-xl font-bold">VAPI<span className="text-white">Call</span></span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden space-x-8 md:flex">
          <Link href="/features" className="text-gray-300 hover:text-neon-blue transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-gray-300 hover:text-neon-blue transition-colors">
            Pricing
          </Link>
          <Link href="/support" className="text-gray-300 hover:text-neon-blue transition-colors">
            Support
          </Link>
        </nav>

        <div className="hidden md:block">
          <Button className="bg-dark-700 border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-dark-900 transition-colors">
            Start a Call
          </Button>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-800 border-b border-dark-600">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link 
              href="/features" 
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-dark-700 hover:text-neon-blue"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-dark-700 hover:text-neon-blue"
            >
              Pricing
            </Link>
            <Link 
              href="/support" 
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-dark-700 hover:text-neon-blue"
            >
              Support
            </Link>
            <div className="px-3 py-2">
              <Button fullWidth className="bg-dark-700 border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-dark-900 transition-colors">
                Start a Call
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
