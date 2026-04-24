import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  src: string;
  alt: string;
  name: string;
  price: string;
  redirect?: string;
};

export default function ProductCard({ src, alt, name, redirect }: ProductCardProps) {
  if (redirect) {
    return (
      <Link href={redirect} className="product-card reveal">
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
          <h3 className="product-name">{name}</h3>
        </div>
      </Link>
    );
  }

  return (
    <div className="product-card reveal">
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
        <h3 className="product-name">{name}</h3>
      </div>
    </div>
  );
}
