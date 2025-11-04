'use client';
import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Shield, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

export default function PromoteAdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handlePromote = async () => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Usuário não autenticado',
        description: 'Você precisa estar logado para realizar esta ação.',
      });
      return;
    }

    setIsLoading(true);

    const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
    const adminData = {
      username: user.email,
      email: user.email,
      id: user.uid,
    };

    setDoc(adminRoleRef, adminData)
      .then(() => {
        toast({
          title: 'Sucesso!',
          description:
            'Você foi promovido a administrador. Redirecionando...',
        });
        // Redireciona para a página de dashboard do admin após o sucesso.
        router.push('/admin');
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: adminRoleRef.path,
          operation: 'create',
          requestResourceData: adminData,
        });
        errorEmitter.emit('permission-error', permissionError);

        toast({
          variant: 'destructive',
          title: 'Erro de Permissão',
          description:
            'Não foi possível conceder o acesso. Verifique as regras de segurança ou se outro admin já existe.',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-game relative">
      <div className="absolute inset-0 scanlines z-0" />
      <div className="w-full max-w-md z-10">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Conceder Acesso de Administrador</CardTitle>
            <CardDescription>
              Clique no botão abaixo para se tornar o primeiro administrador do
              sistema. Esta ação só pode ser executada uma vez.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-center text-muted-foreground">
              Logado como: {user?.email || 'Carregando...'}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handlePromote}
              disabled={isLoading || !user}
              className="w-full font-game text-sm"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Shield className="mr-2 h-4 w-4" />
              )}
              Conceder Acesso
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
