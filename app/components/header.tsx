"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/cart";

export default function Header() {
    const pathname = usePathname();
    const isCollection = pathname === "/collection";
    const isProduct = pathname.startsWith("/collection/");
    const isCheckout = pathname.startsWith("/checkout");
    const { totalQuantity, openCart } = useCart();

    if (isCheckout) return null;

    return (
        <nav className="nav">
            <Link href="/" className="nav-logo">
                <Image
                    src="/assets/groovy-icon.png"
                    alt="Groovy"
                    className="nav-logo-image"
                    fill
                    priority
                    sizes="48px"
                />
            </Link>
            <ul className="nav-links">
                {isProduct ? (
                    <>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/collection">Collection</Link></li>
                    </>
                ) : isCollection ? (
                    <>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/collection" className="nav-link--active">Collection</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link href="/#collection">Collection</Link></li>
                        <li><Link href="/#story">Story</Link></li>
                        <li><Link href="/#faq">FAQ</Link></li>
                        <li><Link href="/#contact">Contact</Link></li>
                    </>
                )}
            </ul>
            <div className="nav-cart">
                <button
                    type="button"
                    className="nav-cart-btn"
                    onClick={openCart}
                    aria-label={`Open cart, ${totalQuantity} items`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={22} height={22}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                    </svg>
                    {totalQuantity > 0 ? (
                        <span className="nav-cart-count">{totalQuantity}</span>
                    ) : null}
                </button>
            </div>
        </nav>
    );
}
