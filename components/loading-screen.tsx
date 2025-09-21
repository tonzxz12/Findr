import Image from 'next/image';

interface LoadingScreenProps {
  message?: string;
  size?: number;
  showMessage?: boolean;
}

export function LoadingScreen({ 
  message = "Loading...", 
  size = 100, 
  showMessage = true 
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/quanby-animation.gif"
          alt="Loading animation"
          width={size}
          height={size}
          className="rounded-lg"
          priority
          unoptimized
        />
        {showMessage && (
          <p className="text-sm text-muted-foreground animate-pulse font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// Inline loader for smaller contexts
export function InlineLoader({ 
  size = 50, 
  className = "" 
}: { 
  size?: number; 
  className?: string; 
}) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/quanby-animation.gif"
        alt="Loading..."
        width={size}
        height={size}
        className="rounded"
        priority
        unoptimized
      />
    </div>
  );
}