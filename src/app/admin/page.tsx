
'use client';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/admin/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 bg-black/50 border-2 border-primary/30 rounded-lg">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">Verificando sessão...</p>
            </div>
        </div>
    );
  }

  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle>Bem-vindo ao Painel de Administração!</CardTitle>
                <CardDescription>Use o menu à esquerda para gerenciar sua loja.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Olá, {user.email}! Você está no controle.</p>
            </CardContent>
        </Card>
    </div>
  );
}
