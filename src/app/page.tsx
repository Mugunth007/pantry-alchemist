import Link from "next/link";
import { ArrowRight, ChefHat, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black overflow-hidden relative flex flex-col items-center justify-center">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/30 via-purple-600/10 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-neutral-300 mb-8">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Powered by Gemini & MongoDB Vector Search</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-500 mb-6">
          The Intelligent Agent for <br className="hidden md:block" />
          Your Pantry.
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
          Stop wasting food and wondering what to cook. Pantry Alchemist tracks your ingredients, understands your preferences, and generates recipes dynamically.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/signin"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium text-white transition-all duration-200 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-purple-600/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
    </div>
  );
}
