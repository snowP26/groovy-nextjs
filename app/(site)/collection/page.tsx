import Image from "next/image";
import Link from "next/link";
import CollectionAnimations from "../../components/collection-animations";
import CollectionBreadcrumb from "../../components/collection-breadcrumb";
import { getProducts } from "../../../lib/shopify";

export const revalidate = 60;

export default async function CollectionPage() {
  const products = await getProducts(20);

  return (
    <div>
      <CollectionAnimations />
      <CollectionBreadcrumb />

      {/* Page Hero */}
      <div className="collection-page-hero reveal">
        <div className="collection-page-hero-left">
          <p className="section-subtitle">Latest Drop</p>
          <h1 className="collection-page-title">Metamorphosis</h1>
        </div>
        <div className="collection-page-story">
          <p>
            Over the past few years, Groovy experienced shifts that led to a loss
            of clarity in its identity.
          </p>
          <p>
            This collection marks a return, shedding what no longer aligns and
            reconnecting with what truly does. A process of preserving the core
            while evolving with purpose.
          </p>
        </div>
      </div>

      {/* Collection Grid */}
      <div className="collection-page-body">
        <div className="collection-grid">
          {products.map((product) => {
            const image = product.images[0];
            return (
              <Link
                key={product.handle}
                href={`/collection/${product.handle}`}
                className="collection-item reveal"
              >
                <div className="collection-item-image">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.altText ?? product.title}
                      width={600}
                      height={600}
                      quality={80}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : null}
                </div>
                <div className="collection-info">
                  <div className="collection-info-text">
                    <h3 className="collection-name">{product.title}</h3>
                    <p className="collection-category">Metamorphosis</p>
                  </div>
                  <span className="collection-info-arrow" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={16} height={16}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
