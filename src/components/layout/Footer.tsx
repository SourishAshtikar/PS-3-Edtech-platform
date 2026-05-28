import Link from "next/link";
import { Globe, Mail, Phone, MapPin, GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300 pt-16 pb-8 border-t-[6px] border-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">Gamified Learning Platform</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              A comprehensive gamified environment dedicated to mastering User Interface Design and Human-Computer Interaction principles.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary transition-colors text-white">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary transition-colors text-white">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary transition-colors text-white">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary transition-colors text-white">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/student/modules" className="hover:text-primary transition-colors">Learning Modules</Link></li>
              <li><Link href="/student/simulations" className="hover:text-primary transition-colors">Interactive Simulations</Link></li>
              <li><Link href="/student/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
              <li><Link href="/faculty/dashboard" className="hover:text-primary transition-colors">Faculty Portal</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Accessibility Statement</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Department of Information Technology,<br/>Engineering College Campus.</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>+91 22 6728 3000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>info.engg@somaiya.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} HCI EdTech Platform. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed for Educational Purposes</p>
        </div>
      </div>
    </footer>
  );
}
