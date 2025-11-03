'use client';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FirestorePermissionError, errorEmitter } from '@/firebase';

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z.preprocess(
    (val) => (val === '' ? NaN : Number(val)),
    z.number({ invalid_type_error: 'Preço deve ser um número' }).min(0, 'Preço deve ser positivo')
  ),
  category: z.string().min(1, 'Categoria é obrigatória'),
  imageUrl: z.string().url('URL da imagem inválida'),
  imageHint: z.string().optional(),
  sizes: z.string().transform((val) => val.split(',').map((s) => s.trim()).filter(Boolean)),
  colors: z.string().transform((val) => val.split(',').map((s) => s.trim()).filter(Boolean)),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductFormPage() {
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: '',
      imageHint: '',
      sizes: [],
      colors: [],
    },
  });

  useEffect(() => {
    if (!isNew && firestore) {
      const fetchProduct = async () => {
        const docRef = doc(firestore, 'clothing_items', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          form.reset({
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            imageUrl: data.image?.imageUrl || '',
            imageHint: data.image?.imageHint || '',
            sizes: Array.isArray(data.sizes) ? data.sizes.join(', ') : '',
            colors: Array.isArray(data.colors) ? data.colors.join(', ') : '',
          } as any);
        } else {
          toast({ variant: 'destructive', title: 'Produto não encontrado.' });
          router.push('/admin/products');
        }
      };
      fetchProduct();
    }
  }, [id, isNew, firestore, router, toast, form]);

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    if (!firestore) return;
    
    const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        image: {
            imageUrl: data.imageUrl,
            imageHint: data.imageHint,
        },
        sizes: data.sizes,
        colors: data.colors,
        updatedAt: serverTimestamp(),
    };

    if (isNew) {
        const collectionRef = collection(firestore, 'clothing_items');
        const finalProductData = {
            ...productData,
            createdAt: serverTimestamp(),
        };
        addDoc(collectionRef, finalProductData)
            .then(docRef => {
                // Set the ID in the document after creation
                setDoc(doc(firestore, 'clothing_items', docRef.id), { id: docRef.id }, { merge: true })
                    .catch(error => {
                        const permissionError = new FirestorePermissionError({
                            path: docRef.path,
                            operation: 'update', // or 'create' if this is the intended main operation
                            requestResourceData: { id: docRef.id },
                        });
                        errorEmitter.emit('permission-error', permissionError);
                        toast({ variant: 'destructive', title: 'Erro de permissão ao definir ID do produto.' });
                    })
                toast({ title: 'Produto criado com sucesso!' });
                router.push('/admin/products');
            })
            .catch(error => {
                const permissionError = new FirestorePermissionError({
                    path: collectionRef.path,
                    operation: 'create',
                    requestResourceData: finalProductData,
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({ variant: 'destructive', title: 'Erro ao criar produto' });
            });
    } else {
        const docRef = doc(firestore, 'clothing_items', id);
        setDoc(docRef, productData, { merge: true })
            .then(() => {
                toast({ title: 'Produto atualizado com sucesso!' });
                router.push('/admin/products');
            })
            .catch(error => {
                const permissionError = new FirestorePermissionError({
                    path: docRef.path,
                    operation: 'update',
                    requestResourceData: productData,
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({ variant: 'destructive', title: 'Erro ao atualizar produto' });
            });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? 'Novo Produto' : 'Editar Produto'}</CardTitle>
        <CardDescription>Preencha os detalhes do produto abaixo.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição detalhada" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Preço</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" placeholder="99.99" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                        <Input placeholder="Ex: Vestidos" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="imageHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dica de IA para Imagem (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: red dress" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanhos (separados por vírgula)</FormLabel>
                  <FormControl>
                    <Input placeholder="P, M, G, GG" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="colors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cores (separadas por vírgula)</FormLabel>
                  <FormControl>
                    <Input placeholder="Preto, Branco, Azul" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Produto'}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
