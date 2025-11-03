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
              Sua loja de moda consciente e com estilo.
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
            <h4 className="font-headline text-lg font-semibold">Loja</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=Dresses" className="text-muted-foreground hover:text-primary transition-colors">Vestidos</Link></li>
              <li><Link href="/products?category=Tops" className="text-muted-foreground hover:text-primary transition-colors">Blusas</Link></li>
              <li><Link href="/products?category=Trousers" className="text-muted-foreground hover:text-primary transition-colors">Calças & Jeans</Link></li>
              <li><Link href="/products?category=Jackets" className="text-muted-foreground hover:text-primary transition-colors">Jaquetas</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline text-lg font-semibold">Sobre</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">Nossa História</Link></li>
              <li><Link href="/how-to-buy" className="text-muted-foreground hover:text-primary transition-colors">Como Comprar</Link></li>
              <li><Link href="/why-us" className="text-muted-foreground hover:text-primary transition-colors">Por que nós?</Link></li>
              <li><Link href="/style-advisor" className="text-muted-foreground hover:text-primary transition-colors">Consultor de Estilo IA</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline text-lg font-semibold">Newsletter</h4>
            <p className="text-sm text-muted-foreground">
              Inscreva-se para ofertas exclusivas e notícias de estilo.
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Email" className="bg-transparent"/>
              <Button type="submit">Inscrever</Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Organico. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
