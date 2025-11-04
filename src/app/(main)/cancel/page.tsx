'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedHeader } from '@/components/AnimatedHeader';

export default function CancelPage() {
  return (
    <div className="container py-12 text-center">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <XCircle className="h-24 w-24 text-destructive mb-6" />
        <AnimatedHeader text="Pagamento Cancelado" />
        <p className="mt-3 text-muted-foreground text-sm">
          Seu pagamento não foi concluído. Você pode tentar novamente.
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          Seus itens ainda estão no carrinho esperando por você.
        </p>
        <div className="flex gap-4 mt-8">
            <Button asChild className="font-game text-sm">
                <Link href="/products">Voltar para a Loja</Link>
            </Button>
             {/* O carrinho pode ser aberto pelo ícone no cabeçalho */}
            <Button variant="outline" className="font-game text-sm" onClick={() => {
                // A lógica para abrir o carrinho está no CartWidget/Header
                // Aqui apenas sugerimos a ação.
                document.querySelector<HTMLButtonElement>('button[aria-label="Abrir carrinho de compras"]')?.click();
            }}>
                Ver Carrinho
            </Button>
        </div>
      </div>
    </div>
  );
}
