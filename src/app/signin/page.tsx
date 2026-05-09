import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { ChefHat } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 w-full h-full bg-black z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-neutral-950/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 mb-6">
          <ChefHat className="w-6 h-6 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-neutral-400 text-center mb-8 text-sm">
          Sign in to access your pantry, recipes, and intelligent agent.
        </p>

        <GoogleSignInButton />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
    </div>
  );
}
