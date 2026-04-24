import Link from "next/link";

export default function HeaderCollection() {
    return (
        <nav className="nav">
            <Link href="/" className="nav-logo">
                Groovy.
            </Link>
            <ul className="nav-links">
                <li><Link href="/">Home</Link></li>
            </ul>
        </nav>
    );
}
