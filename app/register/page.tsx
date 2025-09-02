import { RegisterForm } from "@/components/register-form";
import Image from "next/image";

export default function RegisterPage() {
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
                  Join QFindr
                </h1>
              </div>
              <p className="text-muted-foreground">
                Transform your bidding process with intelligent automation and AI-powered insights.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">🚀 Get Started Instantly</h3>
                <p className="text-sm text-muted-foreground">
                  Set up your company profile and start generating professional bidding documents in minutes.
                </p>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">🤖 AI-Powered Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Our advanced AI analyzes PhilGEPS requirements and creates tailored proposals automatically.
                </p>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">📊 Multi-Tenant Security</h3>
                <p className="text-sm text-muted-foreground">
                  Your company data is completely isolated and secure with enterprise-grade protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="mx-auto w-full max-w-md space-y-6 p-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
