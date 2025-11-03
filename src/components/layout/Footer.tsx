import Link from "next/link";
import { Twitter, Facebook, Instagram } from "lucide-react";
import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo className="text-2xl" />
            <p className="text-sm text-muted-foreground">
              Your personal AI-powered fashion destination.
            </p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline text-lg font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=Dresses" className="text-muted-foreground hover:text-primary transition-colors">Dresses</Link></li>
              <li><Link href="/products?category=Tops" className="text-muted-foreground hover:text-primary transition-colors">Tops</Link></li>
              <li><Link href="/products?category=Trousers" className="text-muted-foreground hover:text-primary transition-colors">Trousers & Jeans</Link></li>
              <li><Link href="/products?category=Jackets" className="text-muted-foreground hover:text-primary transition-colors">Jackets</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline text-lg font-semibold">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/style-guides" className="text-muted-foreground hover:text-primary transition-colors">Style Guides</Link></li>
              <li><Link href="/style-advisor" className="text-muted-foreground hover:text-primary transition-colors">AI Stylist</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline text-lg font-semibold">Newsletter</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe for exclusive offers and style news.
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Email" className="bg-transparent"/>
              <Button type="submit">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TrendSight Boutique. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
