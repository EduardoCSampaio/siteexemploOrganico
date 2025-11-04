
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart, CartItem } from '@/context/cart-context';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Trash2, Plus, Minus, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';

function CartItemCard({ item }: { item: CartItem }) {
    const { updateItemQuantity, removeItem } = useCart();

    return (
        <div className="flex items-start gap-4 py-4">
            <div className="relative h-24 w-20 flex-shrink-0 border-2 border-primary/30 bg-black/50 p-1">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex-grow">
                <h4 className="text-sm font-semibold text-primary">{item.name}</h4>
                <p className="text-xs text-muted-foreground">Preço: R$ {item.price.toFixed(2).replace('.', ',')}</p>
                <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <p className="text-sm font-bold text-primary">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export function CartContent() {
    const { cartItems, subtotal, cartCount, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        setIsLoading(true);
        console.log("Iniciando checkout...");
        // A lógica para criar a sessão de checkout do Stripe virá aqui.
        // Por enquanto, apenas simulamos o carregamento.
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Checkout finalizado (simulação).");
        setIsLoading(false);
    }

    if (cartCount === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-primary">Seu carrinho está vazio</h3>
                <p className="mt-2 text-sm text-muted-foreground">Adicione itens para vê-los aqui.</p>
                <Button asChild className="mt-6 font-game text-xs" variant="outline">
                    <Link href="/products">Explorar Produtos</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-grow pr-6 -mr-6">
                <div className="divide-y divide-primary/30">
                    {cartItems.map(item => (
                        <CartItemCard key={item.id} item={item} />
                    ))}
                </div>
            </ScrollArea>
            <div className="mt-auto border-t-2 border-primary/30 pt-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold text-primary text-lg">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <p className="text-xs text-muted-foreground">Frete e impostos serão calculados no checkout.</p>
                <Button onClick={handleCheckout} disabled={isLoading} className="w-full font-game text-sm">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Finalizar Compra'}
                </Button>
                <Button variant="outline" className="w-full text-xs" onClick={clearCart}>Limpar Carrinho</Button>
            </div>
        </div>
    );
}
