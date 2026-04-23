"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const INSTAGRAM_ORDER_LINK = "https://www.instagram.com/groovyph_/";
const SIZE_CHART_IMAGE = "/assets/size-chart.jpg";

const PRODUCT_BY_SLUG: Record<
    string,
    {
        name: string;
        price: number;
        images: Array<{
            src: string;
            alt: string;
        }>;
        sizes: string[];
    }
> = {
    "embroidered-longsleeves": {
        name: "Embroidered Longsleeves",
        price: 1290,
        images: [
            { src: "/assets/longsleeve/1.jpg", alt: "Embroidered Longsleeves black & white" },
            { src: "/assets/longsleeve/2.jpg", alt: "Embroidered Longsleeves black" },
            { src: "/assets/longsleeve/3.jpg", alt: "Embroidered Longsleeves white" },
        ],
        sizes: ["S", "M", "L", "XL"],
    },
    "embroidered-tee": {
        name: "Embroidered Tee",
        price: 790,
        images: [
            { src: "/assets/embroid/4.jpg", alt: "Embroidered Tee Together" },
            { src: "/assets/embroid/1.jpg", alt: "Embroidered Tee black" },
            { src: "/assets/embroid/2.jpg", alt: "Embroidered Tee black 2" },
            { src: "/assets/embroid/3.jpg", alt: "Embroidered Tee white" },
        ],
        sizes: ["S", "M", "L"],
    },
    "graphic-tee": {
        name: "Graphic Tee",
        price: 850,
        images: [
            { src: "/assets/graphic/1.jpg", alt: "Graphic Tee black" },
            { src: "/assets/graphic/5.jpg", alt: "Graphic Tee white product" },
            { src: "/assets/graphic/2.jpg", alt: "Graphic Tee white" },
            { src: "/assets/graphic/3.jpg", alt: "Graphic Tee black product" },
            { src: "/assets/graphic/4.jpg", alt: "Graphic Tee white product" },
        ],
        sizes: ["S", "M", "L", "XL"],
    },
    "plaid-polo": {
        name: "Plaid Polo",
        price: 1650,
        images: [
            { src: "/assets/plaid/1.jpg", alt: "Plaid Polo female" },
            { src: "/assets/plaid/4.jpg", alt: "Plaid Polo long male" },
            { src: "/assets/plaid/2.jpg", alt: "Plaid Longsleeves" },
            { src: "/assets/plaid/3.jpg", alt: "Plaid Longsleeves" },
        ],
        sizes: ["S", "M", "L", "XL"],
    },
};

const SLUG_ALIAS: Record<string, string> = {
    "graphic-tee-black": "graphic-tee",
    "graphic-tee-white": "graphic-tee",
};

export default function Product() {
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const params = useParams<{ slug: string }>();
    const slug = typeof params.slug === "string" ? params.slug : "";
    const normalizedSlug = SLUG_ALIAS[slug] ?? slug;
    const product = PRODUCT_BY_SLUG[normalizedSlug];

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;

        if (isSizeChartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = originalOverflow;
        }

        return () => {
            document.body.style.overflow = originalOverflow;
        }
    }, [isSizeChartOpen]);

    useEffect(() => {
        if (!isSizeChartOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsSizeChartOpen(false);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isSizeChartOpen]);

    useEffect(() => {
        setActiveImageIndex(0);
    }, [normalizedSlug]);

    if (!product) {
        return (
            <section className="product-not-found">
                <p className="section-subtitle">Collection</p>
                <h1 className="product-not-found-title">Product not found</h1>
                <p className="product-not-found-copy">
                    The item you are looking for does not exist or may have been removed.
                </p>
                <Link href="/collection" className="btn">
                    Back to Collection
                </Link>
            </section>
        );
    }

    const totalImages = product.images.length;
    const activeImage = product.images[activeImageIndex] ?? product.images[0];
    const showCarouselControls = totalImages > 1;

    const isLongsleevesVariant = normalizedSlug === "plaid-polo" && activeImageIndex >= 2;
    const displayName = isLongsleevesVariant ? "Plaid Longsleeves" : product.name;
    const displayPrice = isLongsleevesVariant ? 1950 : product.price;

    const goToPreviousImage = () => {
        setActiveImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    };

    const goToNextImage = () => {
        setActiveImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    };

    return (
        <>
            <section className="product-scaffold">
                <div className="product-scaffold-image product-carousel">
                    <div className="product-carousel-stage">
                        <Image
                            src={activeImage.src}
                            alt={activeImage.alt}
                            width={1000}
                            height={1200}
                            quality={85}
                            sizes="(max-width: 768px) 100vw, 38vw"
                            priority
                            className="product-carousel-media"
                        />

                        {showCarouselControls ? (
                            <>
                                <button
                                    type="button"
                                    className="product-carousel-nav product-carousel-nav-prev"
                                    aria-label="Show previous image"
                                    onClick={goToPreviousImage}
                                >
                                    <span className="product-carousel-nav-icon" aria-hidden="true">{"\u2039"}</span>
                                </button>
                                <button
                                    type="button"
                                    className="product-carousel-nav product-carousel-nav-next"
                                    aria-label="Show next image"
                                    onClick={goToNextImage}
                                >
                                    <span className="product-carousel-nav-icon" aria-hidden="true">{"\u203A"}</span>
                                </button>
                            </>
                        ) : null}
                    </div>

                    {showCarouselControls ? (
                        <div className="product-carousel-thumbs" role="tablist" aria-label="Product image previews">
                            {product.images.map((image, index) => (
                                <button
                                    key={image.src}
                                    type="button"
                                    className={`product-carousel-thumb${index === activeImageIndex ? " is-active" : ""}`}
                                    onClick={() => setActiveImageIndex(index)}
                                    aria-label={`Show image ${index + 1}`}
                                    aria-selected={index === activeImageIndex}
                                >
                                    <Image src={image.src} alt={image.alt} width={120} height={120} quality={70} sizes="72px" />
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>

                <div className="product-scaffold-content">
                    <p className="section-subtitle">Product</p>
                    <h1 className="product-scaffold-title">{displayName}</h1>
                    <p className="product-scaffold-price">₱{displayPrice.toLocaleString()}</p>
                    {showCarouselControls ? (
                        <p className="product-carousel-count">
                            {activeImageIndex + 1} / {totalImages}
                        </p>
                    ) : null}

                    <div className="product-scaffold-sizes">
                        <p className="product-scaffold-label">Size available</p>
                        <div className="product-scaffold-size-list" role="list" aria-label="Available sizes">
                            {product.sizes.map((size) => (
                                <span key={size} className="product-scaffold-size" role="listitem">
                                    {size}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="product-scaffold-actions">
                        <Link
                            href={INSTAGRAM_ORDER_LINK}
                            className="btn product-scaffold-cta"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Order Now
                        </Link>
                        <button
                            type="button"
                            className="product-scaffold-size-chart-link"
                            onClick={() => setIsSizeChartOpen(true)}
                        >
                            Size Chart
                        </button>
                    </div>
                </div>
            </section>

            {isSizeChartOpen ? (
                <div className="size-chart-modal-overlay" role="presentation" onClick={() => setIsSizeChartOpen(false)}>
                    <div
                        className="size-chart-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Size chart"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="size-chart-modal-close"
                            aria-label="Close size chart"
                            onClick={() => setIsSizeChartOpen(false)}
                        >
                            ✕
                        </button>
                        <div className="size-chart-modal-image-wrap">
                            <Image
                                src={SIZE_CHART_IMAGE}
                                alt="Groovy size chart"
                                width={1200}
                                height={1600}
                                quality={90}
                                sizes="(max-width: 900px) 92vw, 70vw"
                            />
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}