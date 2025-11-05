'use client';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, DollarSign, ShoppingCart, Users, Package, ShieldAlert } from 'lucide-react';
import { useMemoFirebase } from '@/firebase/provider';
import { collection, query, limit, orderBy, collectionGroup, doc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

interface Order {
  id: string;
  orderDate: {
    seconds: number;
    nanoseconds: number;
  };
  totalAmount: number;
  status: string;
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

function StatCard({ title, value, icon: Icon, isLoading }: { title: string; value: string | number, icon: React.ElementType, isLoading: boolean }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-8 w-3/4" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
            </CardContent>
        </Card>
    );
}

function RecentOrders({ orders, isLoading }: { orders: Order[] | null, isLoading: boolean }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pedidos Recentes</CardTitle>
                <CardDescription>Os 5 pedidos mais recentes.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID do Pedido</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && Array.from({length: 5}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                                </TableRow>
                            ))}
                            {!isLoading && orders?.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium text-xs truncate">{order.id}</TableCell>
                                    <TableCell>
                                        <Badge className={cn("text-xs border", statusColors[order.status] || 'bg-gray-500')}>
                                            {statusTranslations[order.status] || order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{format(new Date(order.orderDate.seconds * 1000), 'dd/MM/yyyy HH:mm')}</TableCell>
                                    <TableCell className="text-right">R$ {order.totalAmount.toFixed(2).replace('.', ',')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     {!isLoading && orders?.length === 0 && (
                        <div className="text-center p-8 text-sm text-muted-foreground">
                            <Package className="h-10 w-10 mx-auto mb-2"/>
                            Nenhum pedido encontrado ainda.
                        </div>
                    )}
                 </div>
            </CardContent>
        </Card>
    )
}

function DashboardContent() {
    const firestore = useFirestore();

    const allOrdersQuery = useMemoFirebase(
      () => query(collectionGroup(firestore, 'orders')),
      [firestore]
    );
    const { data: allOrders, isLoading: areOrdersLoading } = useCollection<Order>(allOrdersQuery);
  
    const recentOrdersQuery = useMemoFirebase(
      () => query(collectionGroup(firestore, 'orders'), orderBy('orderDate', 'desc'), limit(5)),
      [firestore]
    );
    const { data: recentOrders, isLoading: areRecentOrdersLoading } = useCollection<Order>(recentOrdersQuery);
  
    const usersQuery = useMemoFirebase(
      () => collection(firestore, 'users'),
      [firestore]
    );
    const { data: users, isLoading: areUsersLoading } = useCollection(usersQuery);
  
    const totalRevenue = useMemo(() => {
      if (!allOrders) return 0;
      return allOrders.reduce((acc, order) => acc + order.totalAmount, 0);
    }, [allOrders]);

    const isLoadingStats = areOrdersLoading || areUsersLoading;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                    title="Receita Total"
                    value={`R$ ${totalRevenue.toFixed(2).replace('.', ',')}`}
                    icon={DollarSign}
                    isLoading={isLoadingStats}
                />
                <StatCard 
                    title="Pedidos"
                    value={allOrders?.length ?? 0}
                    icon={ShoppingCart}
                    isLoading={isLoadingStats}
                />
                <StatCard 
                    title="Clientes"
                    value={users?.length ?? 0}
                    icon={Users}
                    isLoading={isLoadingStats}
                />
            </div>
            <div>
                <RecentOrders orders={recentOrders} isLoading={areRecentOrdersLoading} />
            </div>
        </div>
    )
}

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const adminRoleRef = useMemoFirebase(
    () => (firestore && user?.uid ? doc(firestore, 'roles_admin', user.uid) : null),
    [firestore, user?.uid]
  );
  const { data: adminRole, isLoading: isAdminRoleLoading } = useDoc(adminRoleRef);
  
  const isAdmin = adminRole !== null && adminRole !== undefined;

  if (isUserLoading || isAdminRoleLoading || !firestore) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 bg-black/50 border-2 border-primary/30 rounded-lg">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">Verificando permissões...</p>
            </div>
        </div>
    );
  }

  if (!isAdmin) {
    return (
       <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 bg-black/50 border-2 border-destructive/50 rounded-lg">
                <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
                <h3 className="mt-4 text-lg font-bold text-destructive">Acesso Negado</h3>
                <p className="mt-2 text-sm text-muted-foreground">Você não tem permissão para acessar o dashboard.</p>
                <p className="mt-1 text-xs text-muted-foreground">Se você acredita que isso é um erro, contate o suporte.</p>
            </div>
        </div>
    );
  }

  return <DashboardContent />;
}
