
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
    id: string; // ID do produto base
    name: string;
    price: number;
    image: string;
    quantity: number;
    size: string | null;
    color: string | null;
    // O ID único do item no carrinho, combinando produto, tamanho e cor
    cartItemId?: string; 
}

interface CartContextType {
    cartItems: CartItem[];
    isCartOpen: boolean;
    toggleCart: () => void;
    addItem: (item: CartItem) => void;
    removeItem: (cartItemId: string) => void;
    updateItemQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const addItem = (item: CartItem) => {
        // Cria um ID único para a variante do item (produto + cor + tamanho)
        const cartItemId = `${item.id}-${item.color || ''}-${item.size || ''}`;

        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i.cartItemId === cartItemId);
            
            if (existingItem) {
                // Se o item já existe, apenas aumenta a quantidade
                return prevItems.map(i =>
                    i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            // Se for um novo item (ou nova variante), adiciona ao carrinho
            return [...prevItems, { ...item, cartItemId }];
        });
        setIsCartOpen(true);
    };

    const removeItem = (cartItemId: string) => {
        setCartItems(prevItems => prevItems.filter(i => i.cartItemId !== cartItemId));
    };

    const updateItemQuantity = (cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(cartItemId);
        } else {
            setCartItems(prevItems =>
                prevItems.map(i => (i.cartItemId === cartItemId ? { ...i, quantity } : i))
            );
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                isCartOpen,
                toggleCart,
                addItem,
                removeItem,
                updateItemQuantity,
                clearCart,
                cartCount,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
