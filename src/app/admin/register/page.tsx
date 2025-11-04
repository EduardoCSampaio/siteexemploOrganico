'use client';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

const registerSchema = z.object({
  email: z.string().email('Email inválido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AdminRegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      if (user && firestore) {
        const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
        const adminData = {
          username: user.email,
          email: user.email,
          id: user.uid,
        };

        // Non-blocking write. Error is handled globally.
        setDoc(adminRoleRef, adminData)
          .then(() => {
            toast({
              title: 'Administrador registrado com sucesso!',
              description: 'Você agora pode fazer login.',
            });
            router.push('/admin/login');
          })
          .catch(error => {
              // Even with the non-blocking approach, we create a detailed error
              // for debugging, which will be caught by the FirebaseErrorListener.
              const permissionError = new FirestorePermissionError({
                  path: adminRoleRef.path,
                  operation: 'create',
                  requestResourceData: adminData,
              });
              errorEmitter.emit('permission-error', permissionError);
              
              // Also show a user-facing toast as a fallback.
              toast({
                variant: 'destructive',
                title: 'Erro de Permissão',
                description: 'Não foi possível atribuir a função de administrador. Verifique as regras de segurança do Firestore.',
              });
          });
      }

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro no Registro',
        description:
          error.code === 'auth/email-already-in-use'
            ? 'Este e-mail já está em uso.'
            : 'Ocorreu um erro. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-game relative">
        <div className="absolute inset-0 scanlines z-0" />
      <div className="w-full max-w-md z-10">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Registrar Primeiro Admin</CardTitle>
            <CardDescription>
              Crie a conta principal para gerenciar a loja.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin@organico.com"
                          {...field}
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full font-game text-sm">
                  {isLoading ? 'Registrando...' : <><UserPlus className="mr-2 h-4 w-4" /> Registrar</>}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
