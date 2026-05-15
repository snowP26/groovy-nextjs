"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/cart";

export default function CartDrawer() {
    const { isOpen, closeCart, lines, removeFromCart, updateCartQuantity, isLoading } = useCart();

    return (
        <>
            {isOpen ? (
                <div className="cart-overlay" onClick={closeCart} aria-hidden="true" />
            ) : null}

            <aside className={`cart-drawer${isOpen ? " is-open" : ""}`} aria-label="Shopping cart">
                <div className="cart-drawer-header">
                    <h2 className="cart-drawer-title">Your Cart</h2>
                    <button
                        type="button"
                        className="cart-drawer-close"
                        onClick={closeCart}
                        aria-label="Close cart"
                    >
                        ✕
                    </button>
                </div>

                <div className="cart-drawer-body">
                    {lines.length === 0 ? (
                        <p className="cart-drawer-empty">Your cart is empty.</p>
                    ) : (
                        <ul className="cart-drawer-lines">
                            {lines.map((line) => (
                                <li key={line.id} className="cart-line">
                                    {line.imageUrl ? (
                                        <div className="cart-line-image">
                                            <Image
                                                src={line.imageUrl}
                                                alt={line.imageAlt ?? line.productTitle}
                                                width={80}
                                                height={80}
                                                quality={70}
                                            />
                                        </div>
                                    ) : null}
                                    <div className="cart-line-info">
                                        <p className="cart-line-title">{line.productTitle}</p>
                                        <p className="cart-line-variant">{line.variantTitle}</p>
                                        <p className="cart-line-price">
                                            <span className="currency-label">PHP</span> {(parseFloat(line.price) * line.quantity).toLocaleString()}
                                        </p>
                                        <div className="cart-line-qty">
                                            <button
                                                type="button"
                                                className="cart-line-qty-btn"
                                                onClick={() => line.quantity === 1 ? removeFromCart(line.id) : updateCartQuantity(line.id, line.quantity - 1)}
                                                aria-label="Decrease quantity"
                                                disabled={isLoading}
                                            >−</button>
                                            <span className="cart-line-qty-value">{line.quantity}</span>
                                            <button
                                                type="button"
                                                className="cart-line-qty-btn"
                                                onClick={() => updateCartQuantity(line.id, line.quantity + 1)}
                                                aria-label="Increase quantity"
                                                disabled={isLoading}
                                            >+</button>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="cart-line-remove"
                                        onClick={() => removeFromCart(line.id)}
                                        aria-label={`Remove ${line.productTitle}`}
                                        disabled={isLoading}
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {lines.length > 0 ? (
                    <div className="cart-drawer-footer">
                        <Link
                            href="/checkout"
                            className="btn cart-checkout-btn"
                            onClick={closeCart}
                        >
                            Checkout
                        </Link>
                    </div>
                ) : null}
            </aside>
        </>
    );
}
