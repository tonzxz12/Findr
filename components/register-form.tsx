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

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setCurrentUser, setCurrentCompany } = useTenant();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.register({
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
      });
      
      if (response.success && response.data) {
        setCurrentUser(response.data.user);
        setCurrentCompany(response.data.company);
        router.push('/dashboard/client');
      } else {
        setError(response.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-sm mx-auto", className)} {...props}>
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
              <h1 className="text-xl font-bold tracking-tight">Create your account</h1>
              <p className="text-sm text-muted-foreground text-balance">
                Start discovering perfect PhilGEPS projects today
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName" className="text-sm font-medium">
                Company Name
              </Label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Your Construction Company Inc."
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@yourcompany.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </div>
      </form>
      
      <div className="text-center text-xs text-muted-foreground text-balance">
        By creating an account, you agree to our{" "}
        <a href="/terms" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>.
      </div>
      
      {isLoading && (
        <LoadingScreen 
          message="Creating your account..." 
          size={100} 
        />
      )}
    </div>
  );
}
