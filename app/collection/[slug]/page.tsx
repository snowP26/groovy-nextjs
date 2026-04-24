"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";


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
        features: string[];
        colorVariants?: string[];
        sizeChart?: Array<{ size: string; measurements: string }>;
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
        features: ["Waffle fabric", "Structured Fit", "Clean finish", "Elevated basic"],
        colorVariants: ["Black", "White"],
        sizeChart: [
            { size: "S",   measurements: "24.5 × 21.5" },
            { size: "M",   measurements: "25.5 × 22" },
            { size: "L",   measurements: "27 × 22.5" },
            { size: "XL",  measurements: "28.5 × 23.5" },
            { size: "XXL", measurements: "29.5 × 26" },
        ],
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
        sizes: ["S", "M", "L", "XL"],
        features: ["Oversized fit", "Premium cotton", "Structured Fit", "Everyday essential"],
        colorVariants: ["Black", "White"],
        sizeChart: [
            { size: "S",  measurements: "23.5 × 25.5 × 9.5" },
            { size: "M",  measurements: "24.5 × 26.5 × 10" },
            { size: "L",  measurements: "24.5 × 27 × 11" },
            { size: "XL", measurements: "26.5 × 29 × 12" },
        ],
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
        features: ["Oversized fit", "Premium cotton", "Structured Fit", "Everyday essential"],
        colorVariants: ["Black", "White"],
        sizeChart: [
            { size: "S",  measurements: "23.5 × 25.5 × 9.5" },
            { size: "M",  measurements: "24.5 × 26.5 × 10" },
            { size: "L",  measurements: "24.5 × 27 × 11" },
            { size: "XL", measurements: "26.5 × 29 × 12" },
        ],
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
        features: ["Waffle fabric", "Structured Fit", "Clean finish", "Elevated basic"],
        sizeChart: [
            { size: "S",  measurements: "22 × 23 × 9.5" },
            { size: "M",  measurements: "22 × 25 × 10" },
            { size: "L",  measurements: "22.5 × 25.5 × 10.5" },
            { size: "XL", measurements: "24 × 26 × 11" },
        ],
    },
};

const SLUG_ALIAS: Record<string, string> = {
    "graphic-tee-black": "graphic-tee",
    "graphic-tee-white": "graphic-tee",
};

const PLAID_VARIANTS = [
    {
        key: "polo",
        label: "Polo",
        name: "Plaid Polo",
        price: 1650,
        imageIndices: [2, 3],
    },
    {
        key: "longsleeves",
        label: "Longsleeves",
        name: "Plaid Longsleeves",
        price: 1950,
        imageIndices: [0, 1],
    },
];

const ORDER_TEMPLATE = `— Delivery Info —
Name:
Delivery Address:
Contact Number:
Landmark:

— Order Details —
Order:
Quantity:
Color:
Size:`;

export default function Product() {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedPlaidVariant, setSelectedPlaidVariant] = useState<"longsleeves" | "polo">("polo");
    const [templateCopied, setTemplateCopied] = useState(false);
    const params = useParams<{ slug: string }>();
    const slug = typeof params.slug === "string" ? params.slug : "";
    const normalizedSlug = SLUG_ALIAS[slug] ?? slug;
    const product = PRODUCT_BY_SLUG[normalizedSlug];

    useEffect(() => {
        setActiveImageIndex(0);
    }, [normalizedSlug, selectedPlaidVariant]);

    const copyTemplate = async () => {
        await navigator.clipboard.writeText(ORDER_TEMPLATE);
        setTemplateCopied(true);
        setTimeout(() => setTemplateCopied(false), 2000);
    };

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

    const isPlaid = normalizedSlug === "plaid-polo";
    const activePlaidVariant = PLAID_VARIANTS.find((v) => v.key === selectedPlaidVariant)!;
    const visibleImages = isPlaid
        ? activePlaidVariant.imageIndices.map((i) => product.images[i])
        : product.images;
    const totalImages = visibleImages.length;
    const activeImage = visibleImages[activeImageIndex] ?? visibleImages[0];
    const showCarouselControls = totalImages > 1;
    const displayName = isPlaid ? activePlaidVariant.name : product.name;
    const displayPrice = isPlaid ? activePlaidVariant.price : product.price;

    const goToPreviousImage = () => {
        setActiveImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    };

    const goToNextImage = () => {
        setActiveImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    };

    return (
        <>
            <Breadcrumbs
                aria-label="breadcrumb"
                separator="/"
                sx={{
                    px: { xs: "1.25rem", md: "1.75rem" },
                    pt: { xs: "1rem", md: "2rem" },
                    pb: 0,
                    backgroundColor: "var(--color-cream)",
                    "& .MuiLink-root, & .MuiTypography-root": {
                        fontSize: "0.75rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--color-warm-gray)",
                    },
                }}
            >
                <MuiLink component={Link} underline="hover" color="inherit" href="/">
                    Home
                </MuiLink>
                <MuiLink component={Link} underline="hover" color="inherit" href="/collection">
                    Collection
                </MuiLink>
                <Typography
                    color="text.primary"
                    sx={{
                        fontWeight: 700,
                        textDecoration: "underline",
                        textUnderlineOffset: "0.18em",
                    }}
                >
                    {displayName}
                </Typography>
            </Breadcrumbs>
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
                        <>
                            <div className="product-carousel-thumbs" role="tablist" aria-label="Product image previews">
                                {visibleImages.map((image, index) => (
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
                            <p className="product-carousel-count">
                                {activeImageIndex + 1} / {totalImages}
                            </p>
                        </>
                    ) : null}
                </div>

                <div className="product-scaffold-content">
                    {isPlaid ? (
                        <div className="product-variant-selector">
                            {PLAID_VARIANTS.map((v) => (
                                <button
                                    key={v.key}
                                    type="button"
                                    className={`product-variant-btn${selectedPlaidVariant === v.key ? " is-active" : ""}`}
                                    onClick={() => setSelectedPlaidVariant(v.key as "longsleeves" | "polo")}
                                >
                                    {v.label}
                                </button>
                            ))}
                        </div>
                    ) : null}
                    <h1 className="product-scaffold-title">{displayName}</h1>
                    <p className="product-scaffold-price">₱{displayPrice.toLocaleString()}</p>

                    <ul className="product-scaffold-features">
                        {product.features.map((f) => (
                            <li key={f}>{f}</li>
                        ))}
                    </ul>

                    {!product.sizeChart ? (
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
                    ) : null}

                    {product.colorVariants ? (
                        <div className="product-color-variants">
                            <p className="product-scaffold-label">Available Colors</p>
                            <div className="product-color-variant-list">
                                {product.colorVariants.map((color) => (
                                    <div key={color} className="product-color-variant">
                                        <span
                                            className="product-color-swatch"
                                            style={{ backgroundColor: color === "Black" ? "var(--color-black)" : "var(--color-surface)" }}
                                        />
                                        <span className="product-color-label">{color}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {product.sizeChart ? (
                        <div className="product-size-chart">
                            <p className="product-scaffold-label">
                                Size Chart <span className="product-size-chart-unit">in inches</span>
                            </p>
                            <div
                                className="product-size-chart-grid"
                                style={{ "--size-chart-cols": product.sizeChart.length } as React.CSSProperties}
                            >
                                {product.sizeChart.map((row) => (
                                    <div key={row.size} className="product-size-chart-card">
                                        <span className="product-size-chart-card-size">{row.size}</span>
                                        <span className="product-size-chart-card-measurements">{row.measurements}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="product-scaffold-actions">
                        <a
                            href="https://ig.me/m/groovyph_"
                            className="btn product-scaffold-cta"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Order Now
                            <span className="product-scaffold-cta-sub">via Instagram DM</span>
                        </a>
                    </div>
                </div>
            </section>

            <section className="how-to-order-section">
                <div className="how-to-order-grid">
                    <div>
                        <p className="how-to-order-eyebrow">How to Order</p>
                        <ol className="how-to-order-steps">
                            <li>Browse the collection and select your desired item.</li>
                            <li>Click <strong>Order Now</strong> on the product page.</li>
                            <li>You will be redirected to our Instagram account.</li>
                            <li>Send us a direct message with the completed order form.</li>
                            <li>Wait for our confirmation message for availability, payment details, and shipping schedule.</li>
                        </ol>
                    </div>
                    <div className="how-to-order-form-card">
                        <div className="how-to-order-form-header">
                            <div>
                                <p className="how-to-order-form-title">Order Form</p>
                                <p className="how-to-order-form-hint">Copy and send via Instagram DM</p>
                            </div>
                            <button
                                className={`how-to-order-copy-btn${templateCopied ? " is-copied" : ""}`}
                                onClick={copyTemplate}
                            >
                                {templateCopied ? "✓ Copied" : "Copy"}
                            </button>
                        </div>

                        <div className="how-to-order-form-body">
                            {[
                                { heading: "Delivery Info", fields: ["Name", "Delivery Address", "Contact Number", "Landmark"] },
                                { heading: "Order Details", fields: ["Order", "Quantity", "Color", "Size"] },
                            ].map(({ heading, fields }) => (
                                <div key={heading} className="how-to-order-form-group">
                                    <p className="how-to-order-form-group-label">{heading}</p>
                                    <table className="how-to-order-form-table">
                                        <tbody>
                                            {fields.map((label) => (
                                                <tr key={label} className="how-to-order-form-row">
                                                    <td className="how-to-order-form-label">{label}</td>
                                                    <td className="how-to-order-form-colon">:</td>
                                                    <td className="how-to-order-form-value" />
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}