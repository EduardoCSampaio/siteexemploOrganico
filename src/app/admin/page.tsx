
'use client';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return <div>Carregando...</div>;
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
