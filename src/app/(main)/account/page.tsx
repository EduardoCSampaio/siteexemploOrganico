'use client';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { collection, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Package, FileText, User as UserIcon } from 'lucide-react';
import { AnimatedHeader } from '@/components/AnimatedHeader';
import { useMemoFirebase } from '@/firebase/provider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  orderDate: {
    seconds: number;
    nanoseconds: number;
  };
  totalAmount: number;
  status: string;
  items?: OrderItem[]; // Será preenchido separadamente
}

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
}


function OrderItemCard({ orderId }: { orderId: string }) {
    const { user } = useUser();
    const firestore = useFirestore();

    const orderItemsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid || !orderId) return null;
        return collection(firestore, 'users', user.uid, 'orders', orderId, 'order_items');
    }, [firestore, user?.uid, orderId]);
    
    const { data: items, isLoading } = useCollection<OrderItem>(orderItemsQuery);

    if (isLoading) {
        return <div className="text-center text-xs p-4"><Loader2 className="h-4 w-4 animate-spin mx-auto"/></div>
    }

    if (!items || items.length === 0) {
        return <div className="text-center text-xs p-4 text-muted-foreground">Não foi possível carregar os itens deste pedido.</div>
    }

    return (
        <div className="space-y-3">
            {items?.map(item => (
                <div key={item.id} className="flex gap-3 items-center bg-black/30 p-2">
                    <Image src={item.image} alt={item.name} width={60} height={80} className="object-cover border-2 border-primary/30"/>
                    <div className="flex-grow">
                        <p className="text-xs font-semibold text-primary">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                </div>
            ))}
        </div>
    );
}

function ProfileCardContent() {
    const { user } = useUser();
    const firestore = useFirestore();

    const userProfileRef = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user?.uid]);

    const { data: userProfile, isLoading } = useDoc<UserProfile>(userProfileRef);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-5 w-3/4" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-5 w-4/5" />
                </div>
            </div>
        )
    }

    const displayName = userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : (user?.displayName || 'Não informado');
    const displayEmail = userProfile ? userProfile.email : (user?.email || 'Não informado');

    return (
        <div className="space-y-3">
             <div className="flex flex-col">
                <span className="font-bold text-primary text-xs">Nome:</span> 
                <span className="text-muted-foreground text-sm">{displayName}</span>
            </div>
             <div className="flex flex-col">
                <span className="font-bold text-primary text-xs">Email:</span> 
                <span className="text-muted-foreground text-sm">{displayEmail}</span>
            </div>
        </div>
    );
}


export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login?from=/account');
    }
  }, [user, isUserLoading, router]);

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'users', user.uid, 'orders');
  }, [firestore, user?.uid]);

  const { data: orders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);

  if (isUserLoading || !user) {
    return (
        <div className="flex items-center justify-center h-full container py-12">
            <div className="text-center p-8 bg-black/50 border-2 border-primary/30">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><UserIcon className="h-5 w-5" /> Perfil</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm pt-4">
                        <ProfileCardContent />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> Histórico de Pedidos</CardTitle>
                        <CardDescription>Veja os detalhes de suas compras anteriores.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {areOrdersLoading && (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}
                        {!areOrdersLoading && (!orders || orders.length === 0) && (
                            <div className="text-center p-8 border-2 border-dashed border-primary/30">
                                <Package className="h-12 w-12 mx-auto text-muted-foreground"/>
                                <p className="mt-4 text-sm text-muted-foreground">Você ainda não fez nenhum pedido.</p>
                            </div>
                        )}
                         {!areOrdersLoading && orders && orders.length > 0 && (
                            <Accordion type="single" collapsible className="w-full">
                                {orders.sort((a,b) => b.orderDate.seconds - a.orderDate.seconds).map(order => (
                                    <AccordionItem value={order.id} key={order.id}>
                                        <AccordionTrigger>
                                            <div className="flex justify-between w-full pr-4 text-xs">
                                                <span>Pedido de {format(new Date(order.orderDate.seconds * 1000), 'dd/MM/yyyy')}</span>
                                                <span className="font-bold text-primary">R$ {order.totalAmount.toFixed(2).replace('.', ',')}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                           <OrderItemCard orderId={order.id}/>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                         )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
