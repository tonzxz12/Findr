import Image from 'next/image';

interface LoaderProps {
  className?: string;
}

export function Loader({ className = "" }: LoaderProps) {
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/quanby-animation.gif"
          alt="Loading..."
          width={100}
          height={100}
          className="rounded-lg"
          priority
        />
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
}