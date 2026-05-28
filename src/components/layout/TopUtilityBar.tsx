import Link from "next/link";
import { Phone, Mail, HelpCircle } from "lucide-react";

export function TopUtilityBar() {
  return (
    <div className="w-full bg-zinc-100 border-b border-zinc-200 text-sm py-2 px-4">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-6 text-zinc-600">
          <span className="hidden md:flex items-center space-x-2">
            <Phone className="w-4 h-4 text-primary" />
            <span>+91 22 6728 3000</span>
          </span>
          <span className="hidden md:flex items-center space-x-2">
            <Mail className="w-4 h-4 text-primary" />
            <span>info.engg@somaiya.edu</span>
          </span>
        </div>
        <div className="flex items-center space-x-4 text-zinc-700 font-medium">
          <Link href="/student/dashboard" className="hover:text-primary transition-colors">
            Student Portal
          </Link>
          <span className="text-zinc-300">|</span>
          <Link href="/faculty/dashboard" className="hover:text-primary transition-colors">
            Faculty Portal
          </Link>
          <span className="text-zinc-300">|</span>
          <Link href="#" className="flex items-center space-x-1 hover:text-primary transition-colors">
            <HelpCircle className="w-4 h-4" />
            <span>Help Desk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
