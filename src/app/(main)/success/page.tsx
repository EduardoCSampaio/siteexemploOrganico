'use client';

import { useEffect, Suspense, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { AnimatedHeader } from '@/components/AnimatedHeader';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/firebase';
import { saveOrderAction } from './actions';
import { useToast } from '@/hooks/use-toast';


function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function saveOrder() {
      if (sessionId && user?.uid) {
        try {
          await saveOrderAction(sessionId, user.uid);
          clearCart(); // Limpa o carrinho apenas se o pedido for salvo com sucesso
        } catch (e: any) {
          console.error("Falha ao salvar o pedido:", e);
          setError("Não foi possível salvar seu pedido, mas seu pagamento foi processado. Entre em contato com o suporte.");
           toast({
            variant: "destructive",
            title: "Erro ao Salvar Pedido",
            description: "Não foi possível registrar seu pedido, mas o pagamento foi processado. Por favor, entre em contato com nosso suporte.",
          });
        } finally {
          setIsSaving(false);
        }
      } else {
        // Se não houver sessão ou usuário, apenas pare de carregar e limpe o carrinho.
        setIsSaving(false);
        clearCart();
      }
    }

    saveOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, user?.uid]); // Executa apenas quando a sessão e o usuário estão disponíveis

  if (isSaving) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <Loader2 className="h-24 w-24 animate-spin text-primary mb-6" />
            <AnimatedHeader text="Processando seu pedido..." />
            <p className="mt-3 text-muted-foreground text-sm">
                Estamos salvando os detalhes da sua compra. Por favor, aguarde.
            </p>
        </div>
      )
  }

  if (error) {
      return (
        <div className="container py-12 text-center">
            <div className="max-w-2xl mx-auto flex flex-col items-center">
                <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
                <AnimatedHeader text="Pagamento Aprovado!" />
                <p className="mt-3 text-destructive text-sm font-bold">
                    {error}
                </p>
                <Button asChild className="mt-8 font-game text-sm">
                    <Link href="/products">Continuar Comprando</Link>
                </Button>
            </div>
        </div>
      )
  }


  return (
    <div className="container py-12 text-center">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
        <AnimatedHeader text="Pagamento Aprovado!" />
        <p className="mt-3 text-muted-foreground text-sm">
          Obrigado pela sua compra! Seu pedido foi processado e salvo com sucesso.
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          Você pode ver os detalhes em sua conta.
        </p>
        <div className="flex gap-4 mt-8">
            <Button asChild className="font-game text-sm">
              <Link href="/products">Continuar Comprando</Link>
            </Button>
             <Button asChild variant="outline" className="font-game text-sm">
              <Link href="/account">Ver Meus Pedidos</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}


export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
