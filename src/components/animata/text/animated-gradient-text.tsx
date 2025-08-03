import { cn } from '@/lib/utils';

export default function AnimatedGradientText({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-size animate-bg-position bg-gradient-to-r from-blue-600 from-30% via-blue-800 via-50% to-blue-600 to-80% bg-[length:200%_auto] bg-clip-text text-transparent',
        className,
      )}
    >
      {children}
    </div>
  );
}
