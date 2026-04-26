import Link from "next/link";
import Image from "next/image";
type ProductCardProps = {
  src: string;
  alt: string;
  name: string;
  slug: string;
};

export default function ProductCard({ src, alt, name, slug }: ProductCardProps) {
  return (
    <Link href={`/collection/${slug}`} className="product-card reveal">
      <div className="product-image">
        <Image
          src={src}
          width={600}
          height={600}
          alt={alt}
          quality={80}
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
      <div className="product-details">
        <div className="product-details-text">
          <h3 className="product-name">{name}</h3>
        </div>
        <span className="product-details-arrow" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={16} height={16}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
