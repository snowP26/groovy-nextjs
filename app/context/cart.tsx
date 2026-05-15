"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type CartLine = {
    id: string;
    quantity: number;
    variantId: string;
    productTitle: string;
    variantTitle: string;
    price: string;
    imageUrl: string | null;
    imageAlt: string | null;
};

type CartContextValue = {
    cartId: string | null;
    lines: CartLine[];
    totalQuantity: number;
    checkoutUrl: string | null;
    isOpen: boolean;
    isLoading: boolean;
    openCart: () => void;
    closeCart: () => void;
    addToCart: (variantId: string, quantity: number) => Promise<void>;
    removeFromCart: (lineId: string) => Promise<void>;
    updateCartQuantity: (lineId: string, quantity: number) => Promise<void>;
    clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartId, setCartId] = useState<string | null>(null);
    const [lines, setLines] = useState<CartLine[]>([]);
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const totalQuantity = lines.reduce((sum, l) => sum + l.quantity, 0);

    const fetchCart = useCallback(async (id: string) => {
        const res = await fetch(`/api/cart?cartId=${id}`);
        if (!res.ok) return;
        const data = await res.json();
        setLines(data.lines ?? []);
        setCheckoutUrl(data.checkoutUrl ?? null);
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("shopify_cart_id");
        if (stored) {
            setCartId(stored);
            fetchCart(stored);
        }
    }, [fetchCart]);

    const addToCart = useCallback(async (variantId: string, quantity: number) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ variantId, quantity, cartId }),
            });
            const data = await res.json();
            setCartId(data.cartId);
            setLines(data.lines ?? []);
            setCheckoutUrl(data.checkoutUrl ?? null);
            localStorage.setItem("shopify_cart_id", data.cartId);
        } finally {
            setIsLoading(false);
        }
    }, [cartId]);

    const removeFromCart = useCallback(async (lineId: string) => {
        if (!cartId) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/cart", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cartId, lineId }),
            });
            const data = await res.json();
            setLines(data.lines ?? []);
            setCheckoutUrl(data.checkoutUrl ?? null);
        } finally {
            setIsLoading(false);
        }
    }, [cartId]);

    const updateCartQuantity = useCallback(async (lineId: string, quantity: number) => {
        if (!cartId) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/cart", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cartId, lineId, quantity }),
            });
            const data = await res.json();
            setLines(data.lines ?? []);
            setCheckoutUrl(data.checkoutUrl ?? null);
        } finally {
            setIsLoading(false);
        }
    }, [cartId]);

    const clearCart = useCallback(() => {
        setCartId(null);
        setLines([]);
        setCheckoutUrl(null);
        localStorage.removeItem("shopify_cart_id");
    }, []);

    return (
        <CartContext.Provider value={{
            cartId,
            lines,
            totalQuantity,
            checkoutUrl,
            isOpen,
            isLoading,
            openCart: () => setIsOpen(true),
            closeCart: () => setIsOpen(false),
            addToCart,
            removeFromCart,
            updateCartQuantity,
            clearCart,
        }}>
            {children}
        </CartContext.Provider>
    );
}
