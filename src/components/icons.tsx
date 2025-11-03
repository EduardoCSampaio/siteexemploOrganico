import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("font-headline text-xl font-bold tracking-wider", className)}>
      Organico
      <span className="text-primary">.</span>
    </div>
  );
}
