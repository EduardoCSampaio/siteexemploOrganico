'use client';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { AnimatedHeader } from '@/components/AnimatedHeader';

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login?from=/account');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
        <div className="flex items-center justify-center h-full container py-12">
            <div className="text-center p-8 bg-black/50 border-2 border-primary/30 rounded-lg">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">Carregando dados da conta...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="container py-12">
        <div className="text-center mb-12">
            <AnimatedHeader text="Minha Conta" />
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Bem-vindo(a), {user.displayName || user.email}!</CardTitle>
                <CardDescription>Aqui você pode ver seus pedidos e gerenciar sua conta.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Histórico de pedidos aparecerá aqui em breve.</p>
            </CardContent>
        </Card>
    </div>
  );
}
