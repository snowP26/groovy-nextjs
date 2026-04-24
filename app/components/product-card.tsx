import Link from "next/link";
import Image from "next/image";
import Link from "next/link";

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
        <span className="product-details-arrow" aria-hidden="true">→</span>
      </div>
    </Link>
  );
}
