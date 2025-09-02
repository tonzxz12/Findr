import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Image/Branding */}
      <div className="hidden bg-muted lg:block lg:w-1/2">
        <div className="flex h-full flex-col justify-center p-12">
          <div className="mx-auto max-w-md space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3 mb-4">
                <Image 
                  src="/quanby.png" 
                  alt="QFindr Logo" 
                  width={40} 
                  height={40} 
                  className="h-10 w-10"
                />
                <h1 className="text-3xl font-bold tracking-tight">
                  QFindr Platform
                </h1>
              </div>
              <p className="text-muted-foreground">
                Streamline your government bidding process with AI-powered document generation.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Scrape PhilGEPS Projects</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically extract project details and requirements
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-semibold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Generate Documents</p>
                  <p className="text-sm text-muted-foreground">
                    AI creates technical and financial proposals automatically
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-semibold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Submit & Track</p>
                  <p className="text-sm text-muted-foreground">
                    Monitor application status and manage submissions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="mx-auto w-full max-w-md space-y-6 p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
