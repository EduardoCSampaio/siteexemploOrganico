"use client";

import Link from "next/link";
import { Logo } from "@/components/icons";
import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname();
    if (pathname === '/') return null;

  return (
    <footer className="border-t border-primary/20 bg-black/50 text-xs">
      <div className="container py-8 text-center text-muted-foreground">
          © {new Date().getFullYear()} Organico. NES Edition.
      </div>
    </footer>
  );
}
