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
        id: 1,
        email: email,
        passwordHash: 'mock_hash', // Required by schema but not used in bypass
        role: 'admin',
        isActive: 'true',
        companyId: 1,
        lastLoginAt: null,
        createdAt: new Date(),
      };

      const mockCompany = {
        id: 1,
        name: company,
        dbName: `tenant_${company.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        projectUrl: 'https://mock-project.com',
        anonKey: 'mock_anon_key',
        createdAt: new Date(),
      };

      setCurrentUser(mockUser);
      setCurrentCompany(mockCompany);
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Building2 className="size-6" />
              </div>
              <span className="sr-only">QFindr</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to QFindr</h1>
            <div className="text-center text-sm text-muted-foreground">
              AI-powered bidding document generation
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/register" className="underline underline-offset-4 hover:text-primary">
                Sign up
              </a>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                type="text"
                placeholder="Your company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>

          <div className="text-center">
            <a href="/forgot-password" className="text-sm underline underline-offset-4 hover:text-primary">
              Forgot your password?
            </a>
          </div>
        </div>
      </form>
      
      <div className="text-muted-foreground text-center text-xs text-balance">
        By signing in, you agree to our{" "}
        <a href="/terms" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>.
      </div>
    </div>
  );
}
