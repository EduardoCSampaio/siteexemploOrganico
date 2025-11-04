
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    isCartOpen: boolean;
    toggleCart: () => void;
    addItem: (item: CartItem) => void;
    removeItem: (itemId: string) => void;
    updateItemQuantity: (itemId: string, quantity: number) => void;
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
        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);
            if (existingItem) {
                return prevItems.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            return [...prevItems, item];
        });
        setIsCartOpen(true);
    };

    const removeItem = (itemId: string) => {
        setCartItems(prevItems => prevItems.filter(i => i.id !== itemId));
    };

    const updateItemQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(itemId);
        } else {
            setCartItems(prevItems =>
                prevItems.map(i => (i.id === itemId ? { ...i, quantity } : i))
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
