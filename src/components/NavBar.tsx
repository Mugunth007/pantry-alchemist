"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChefHat, LayoutDashboard, MessageSquare } from "lucide-react";

export function NavBar() {
  const pathname = usePathname();

  // Don't show navbar on the home page or sign-in page
  if (pathname === "/" || pathname === "/signin") return null;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
              <ChefHat className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-semibold text-white">Pantry Alchemist</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                pathname === "/dashboard"
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/chat"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                pathname === "/chat"
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chat Agent
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
