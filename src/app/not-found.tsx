import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4 text-center">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight text-foreground/90">404</h1>
          <h2 className="text-2xl font-semibold text-foreground/80">Page Not Found</h2>
          <p className="text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/">
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}