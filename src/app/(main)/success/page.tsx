'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { AnimatedHeader } from '@/components/AnimatedHeader';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Limpa o carrinho assim que a página de sucesso é carregada
    clearCart();
  }, [clearCart]);

  return (
    <div className="container py-12 text-center">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
        <AnimatedHeader text="Pagamento Aprovado!" />
        <p className="mt-3 text-muted-foreground text-sm">
          Obrigado pela sua compra! Seu pedido foi processado com sucesso.
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          Você receberá um e-mail de confirmação em breve com os detalhes.
        </p>
        <Button asChild className="mt-8 font-game text-sm">
          <Link href="/products">Continuar Comprando</Link>
        </Button>
      </div>
    </div>
  );
}
