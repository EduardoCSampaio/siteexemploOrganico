"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Logo } from "@/components/icons";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CartWidget } from "../cart/CartWidget";

const navLinks = [
  { href: "/products", label: "Roupas" },
  { href: "/about", label: "Sobre" },
  { href: "/how-to-buy", label: "Comprar" },
  { href: "/why-us", label: "Porque nós?" },
  { href: "/style-advisor", label: "IA" },
];

export function Header() {
  const pathname = usePathname();
  
  if (pathname === '/') return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-black/50 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-white transition-colors">
          <Home className="h-5 w-5" />
          <span className="text-xs">Menu</span>
        </Link>
        
        <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:flex">
              <Logo className="text-xl"/>
            </div>
        </div>

        <nav className="ml-auto hidden md:flex items-center space-x-4 text-xs">
          {navLinks.map(link => (
             <Link
             key={link.href}
             href={link.href}
             className={cn(
               "transition-colors hover:text-primary",
               pathname?.startsWith(link.href) ? "text-primary" : "text-neutral-400"
             )}
           >
             {link.label}
           </Link>
          ))}
        </nav>
        <div className="ml-4">
            <CartWidget />
        </div>
      </div>
    </header>
  );
}
