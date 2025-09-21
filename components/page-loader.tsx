import { useState } from "react";
import { LoadingScreen } from "@/components/loading-screen";

interface PageLoaderProps {
  isLoading: boolean;
  message?: string;
}

export function PageLoader({ isLoading, message = "Loading page..." }: PageLoaderProps) {
  if (!isLoading) return null;
  
  return (
    <LoadingScreen 
      message={message} 
      size={100} 
    />
  );
}

// Hook for managing page loading state
export function usePageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  
  const startLoading = (message?: string) => {
    setIsLoading(true);
  };
  
  const stopLoading = () => {
    setIsLoading(false);
  };
  
  return {
    isLoading,
    startLoading,
    stopLoading,
    PageLoader: ({ message }: { message?: string }) => (
      <PageLoader isLoading={isLoading} message={message} />
    )
  };
}