"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const isCollection = pathname === "/collection";
    const isProduct = pathname.startsWith("/collection/");

    return (
        <nav className="nav">
            <Link href="/" className="nav-logo">
                Groovy.
            </Link>
            <ul className="nav-links">
                {isProduct ? (
                    <>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/collection">Collection</Link></li>
                    </>
                ) : isCollection ? (
                    <li><Link href="/">Home</Link></li>
                ) : (
                    <>
                        <li><Link href="/#collection">Collection</Link></li>
                        <li><Link href="/#story">Story</Link></li>
                        <li><Link href="/#faq">FAQ</Link></li>
                        <li><Link href="/#contact">Contact</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}