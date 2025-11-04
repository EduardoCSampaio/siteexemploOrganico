
'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { CartContent } from './CartContent';

export function CartWidget() {
    const { cartCount, isCartOpen, toggleCart } = useCart();
    return (
        <Sheet open={isCartOpen} onOpenChange={toggleCart}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-primary hover:text-white">
                    <ShoppingBag className="h-6 w-6" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                            {cartCount}
                        </span>
                    )}
                    <span className="sr-only">Abrir carrinho de compras</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:max-w-none bg-background border-primary/30 font-game flex flex-col">
                <SheetHeader>
                    <SheetTitle className="text-primary">Seu Carrinho</SheetTitle>
                </SheetHeader>
                <CartContent />
            </SheetContent>
        </Sheet>
    )
}
