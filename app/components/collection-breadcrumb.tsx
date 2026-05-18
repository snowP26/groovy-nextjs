import Link from "next/link";

export default function CollectionBreadcrumb() {
    return (
        <nav aria-label="breadcrumb" className="collection-breadcrumb">
            <Link href="/" className="collection-breadcrumb-link">
                Home
            </Link>
            <span className="collection-breadcrumb-sep" aria-hidden="true">
                /
            </span>
            <span className="collection-breadcrumb-current" aria-current="page">
                Collection
            </span>
        </nav>
    );
}
