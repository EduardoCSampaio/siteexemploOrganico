import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn("font-headline text-xl font-bold tracking-wider", className)}
      suppressHydrationWarning
    >
      Organico
      <span className="text-primary">.</span>
    </div>
  );
}
