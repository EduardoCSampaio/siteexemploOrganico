'use client';
import { useEffect, useState } from 'react';
import { collectionGroup, query, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  userId: string;
  orderDate: {
    seconds: number;
    nanoseconds: number;
  };
  totalAmount: number;
  status: string;
  shippingAddress: {
    name: string;
  }
}

const statusTranslations: { [key: string]: string } = {
    processing: 'Processando',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
};

const statusColors: { [key: string]: string } = {
    processing: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    shipped: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    delivered: 'bg-green-500/20 text-green-300 border-green-500/50',
    cancelled: 'bg-red-500/20 text-red-300 border-red-500/50'
};

function OrderRowSkeleton() {
    return (
      <TableRow>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
        <TableCell className="text-right">
            <Skeleton className="h-8 w-8 inline-block" />
        </TableCell>
      </TableRow>
    );
}

export default function AdminOrdersPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!firestore) return;

      setIsLoading(true);
      try {
        const ordersQuery = query(collectionGroup(firestore, 'orders'));
        const querySnapshot = await getDocs(ordersQuery);
        const ordersData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Order));
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [firestore]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos os Pedidos</CardTitle>
        <CardDescription>Visualize e gerencie os pedidos de todos os clientes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>ID do Usuário</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading && Array.from({length: 5}).map((_, i) => <OrderRowSkeleton key={i} />)}
                {!isLoading && orders?.sort((a,b) => b.orderDate.seconds - a.orderDate.seconds).map((order) => (
                <TableRow key={order.id}>
                    <TableCell>{format(new Date(order.orderDate.seconds * 1000), 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell>{order.shippingAddress?.name || 'Não informado'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{order.userId}</TableCell>
                    <TableCell>R$ {order.totalAmount.toFixed(2).replace('.', ',')}</TableCell>
                    <TableCell>
                        <Badge className={cn("text-xs border", statusColors[order.status] || 'bg-gray-500')}>
                            {statusTranslations[order.status] || order.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <Button
                        variant="ghost"
                        size="icon"
                        // onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
            {!isLoading && orders?.length === 0 && (
                <div className="text-center p-8 text-sm text-muted-foreground">
                    Nenhum pedido encontrado.
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
