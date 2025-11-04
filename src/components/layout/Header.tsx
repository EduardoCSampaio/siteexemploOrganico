"use client";

import Link from "next/link";
import { Home, User as UserIcon, LogOut, FileText } from "lucide-react";
import { Logo } from "@/components/icons";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CartWidget } from "../cart/CartWidget";
import { useAuth, useUser } from "@/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";

const navLinks = [
  { href: "/products", label: "Roupas" },
  { href: "/about", label: "Sobre" },
  { href: "/how-to-buy", label: "Comprar" },
  { href: "/why-us", label: "Porque nós?" },
  { href: "/style-advisor", label: "IA" },
];

function UserNav() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    auth.signOut().then(() => {
      router.push('/');
    });
  };

  if (isUserLoading) {
    return <div className="h-9 w-24 bg-muted/50 animate-pulse rounded-md" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/login">Login</Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="text-xs">
          <Link href="/register">Registrar</Link>
        </Button>
      </div>
    );
  }

  return (
     <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 text-xs">
          <UserIcon className="h-4 w-4" />
          <span>Minha Conta</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 font-game" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-primary">Olá!</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">
            <FileText className="mr-2 h-4 w-4" />
            <span>Meus Pedidos</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function Header() {
  const pathname = usePathname();
  
  if (pathname === '/') return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-black/50 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-white transition-colors">
          <Home className="h-5 w-5" />
          <span className="text-xs hidden sm:inline">Menu</span>
        </Link>
        
        <div className="hidden md:flex mx-auto">
            <Logo />
        </div>

        <nav className="ml-auto hidden lg:flex items-center space-x-4 text-xs">
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
        <div className="ml-4 flex items-center gap-2">
            <UserNav />
            <CartWidget />
        </div>
      </div>
    </header>
  );
}