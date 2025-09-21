import { RegisterForm } from "@/components/register-form";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Image/Branding - Hidden on mobile, full screen on desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted">
        <div className="flex h-full w-full flex-col justify-center px-6 py-12 lg:px-12">
          <div className="mx-auto w-full max-w-lg space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-6">
                <Image 
                  src="/quanby.png" 
                  alt="PhilProcure AI Logo" 
                  width={40} 
                  height={40} 
                  className="h-10 w-10"
                />
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                  Join PhilProcure AI
                </h1>
              </div>
              <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                Transform your bidding process with intelligent automation and AI-powered project discovery.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="rounded-lg border bg-background/50 p-6">
                <h3 className="font-semibold mb-3 text-foreground">🚀 Get Started Instantly</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Set up your company profile and start discovering perfect PhilGEPS projects in minutes.
                </p>
              </div>
              
              <div className="rounded-lg border bg-background/50 p-6">
                <h3 className="font-semibold mb-3 text-foreground">🤖 AI-Powered Discovery</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our advanced AI analyzes PhilGEPS projects and matches them to your company&apos;s capabilities.
                </p>
              </div>
              
              <div className="rounded-lg border bg-background/50 p-6">
                <h3 className="font-semibold mb-3 text-foreground">📊 Enterprise Security</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your company data is completely isolated and secure with enterprise-grade protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register Form - Full width on mobile, half on desktop */}
      <div className="flex min-h-screen w-full flex-col justify-center lg:w-1/2">
        <div className="mx-auto w-full max-w-sm px-6 py-12 lg:px-8">
          {/* Mobile logo - only show on small screens */}
          <div className="mb-8 flex items-center justify-center space-x-3 lg:hidden">
            <Image 
              src="/quanby.png" 
              alt="PhilProcure AI Logo" 
              width={32} 
              height={32} 
              className="h-8 w-8"
            />
            <h1 className="text-xl font-bold tracking-tight">
              PhilProcure AI
            </h1>
          </div>
          
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
