import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
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
                  PhilProcure AI
                </h1>
              </div>
              <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                Streamline your government bidding process with AI-powered project discovery and document generation.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Discover PhilGEPS Projects</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    AI automatically finds and matches projects to your company's capabilities and expertise
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-semibold text-primary">2</span>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Generate Documents</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    AI creates technical and financial proposals automatically based on project requirements
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-semibold text-primary">3</span>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Submit & Track</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Monitor application status and manage submissions with intelligent tracking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form - Full width on mobile, half on desktop */}
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
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
