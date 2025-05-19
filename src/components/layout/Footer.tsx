import Link from "next/link";
import { Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center text-white">
              <Phone className="mr-2 h-6 w-6" />
              <span className="text-xl font-bold">VAPI Call</span>
            </Link>
            <p className="mt-4 text-gray-400">
              Making AI-powered phone calls accessible for everyone.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/features" className="hover:text-white">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} VAPI Call. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
