'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  collection,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { Product } from '@/lib/data';
import { useMemoFirebase } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

function ProductRowSkeleton() {
    return (
      <TableRow>
        <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell className="text-right space-x-2">
            <Skeleton className="h-8 w-8 inline-block" />
            <Skeleton className="h-8 w-8 inline-block" />
        </TableCell>
      </TableRow>
    );
  }

export default function AdminProductsPage() {
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'clothing_items') : null),
    [firestore]
  );
  const { data: products, isLoading } = useCollection<Product>(productsQuery);
  const router = useRouter();
  const { toast } = useToast();
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDeleteProduct = async () => {
    if (!productToDelete || !firestore) return;
    try {
      await deleteDoc(doc(firestore, 'clothing_items', productToDelete));
      toast({ title: 'Produto excluído com sucesso!' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao excluir produto.' });
      console.error(error);
    } finally {
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Produtos</h2>
        <Button onClick={() => router.push('/admin/products/new')}>
          <Plus className="mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({length: 5}).map((_, i) => <ProductRowSkeleton key={i} />)}
            {!isLoading && products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.image?.imageUrl ?? 'https://placehold.co/40x40'}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/admin/products/${product.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setProductToDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá
                          permanentemente o produto.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setProductToDelete(null)}>
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProduct}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
