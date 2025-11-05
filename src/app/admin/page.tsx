'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { collectionGroup, getDocs, query, orderBy, limit, collection } from 'firebase/firestore';


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

export default function AdminDashboardPage() {
    const firestore = useFirestore();

    const [stats, setStats] = useState<{ totalRevenue: number; orderCount: number; userCount: number; }>({ totalRevenue: 0, orderCount: 0, userCount: 0 });
    const [recentOrders, setRecentOrders] = useState<Order[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!firestore) return;

            setIsLoading(true);
            try {
                // Fetch all orders for stats
                const allOrdersQuery = query(collectionGroup(firestore, 'orders'));
                const allOrdersSnapshot = await getDocs(allOrdersQuery);
                const allOrdersData = allOrdersSnapshot.docs.map(doc => doc.data() as Order);
                
                const totalRevenue = allOrdersData.reduce((acc, order) => acc + order.totalAmount, 0);
                const orderCount = allOrdersData.length;

                // Fetch all users for stats
                const usersQuery = collection(firestore, 'users');
                const usersSnapshot = await getDocs(usersQuery);
                const userCount = usersSnapshot.size;

                setStats({ totalRevenue, orderCount, userCount });

                // Fetch recent orders
                const recentOrdersQuery = query(collectionGroup(firestore, 'orders'), orderBy('orderDate', 'asc'), limit(5));
                const recentOrdersSnapshot = await getDocs(recentOrdersQuery);
                const recentOrdersData = recentOrdersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
                setRecentOrders(recentOrdersData.sort((a, b) => b.orderDate.seconds - a.orderDate.seconds));

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [firestore]);


    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                    title="Receita Total"
                    value={`R$ ${stats.totalRevenue.toFixed(2).replace('.', ',')}`}
                    icon={DollarSign}
                    isLoading={isLoading}
                />
                <StatCard 
                    title="Pedidos"
                    value={stats.orderCount}
                    icon={ShoppingCart}
                    isLoading={isLoading}
                />
                <StatCard 
                    title="Clientes"
                    value={stats.userCount}
                    icon={Users}
                    isLoading={isLoading}
                />
            </div>
            <div>
                <RecentOrders orders={recentOrders} isLoading={isLoading} />
            </div>
        </div>
    )
}
