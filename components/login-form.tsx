'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTenant } from "@/lib/context/tenant-context";
import { authApi } from "@/lib/api/client";
import { LoadingScreen } from "@/components/loading-screen";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setCurrentUser, setCurrentCompany } = useTenant();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Bypass authentication for development
    try {
      // Simulate a successful login with mock data
      const mockUser = {
        id: '1',
        email: email,
        passwordHash: 'mock_hash',
        fullName: 'Mock User',
        phone: null,
        role: 'admin' as const,
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockCompany = {
        id: '1',
        companyName: company,
        keywords: [],
        ownerUserId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCurrentUser(mockUser);
      setCurrentCompany(mockCompany);
      router.push('/dashboard/client');
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <a
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Building2 className="size-6" />
              </div>
            </a>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your PhilProcure AI account
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium">
                Company
              </Label>
              <Input
                id="company"
                type="text"
                placeholder="Your company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>

          <div className="text-center space-y-4">
            <a href="/forgot-password" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary">
              Forgot your password?
            </a>
            <div className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a href="/register" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                Sign up
              </a>
            </div>
          </div>
        </div>
      </form>
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground text-balance leading-relaxed">
          By signing in, you agree to our{" "}
          <a href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </div>
      
      {isLoading && (
        <LoadingScreen 
          message="Signing you in..." 
          size={100} 
        />
      )}
    </div>
  );
}
