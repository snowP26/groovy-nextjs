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

export default function Product() {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedPlaidVariant, setSelectedPlaidVariant] = useState<"longsleeves" | "polo">("polo");
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [formCopied, setFormCopied] = useState(false);
    const [orderForm, setOrderForm] = useState({
        name: "", address: "", contact: "", landmark: "",
        order: "", quantity: "", color: "", size: "",
    });
    const params = useParams<{ slug: string }>();
    const slug = typeof params.slug === "string" ? params.slug : "";
    const normalizedSlug = SLUG_ALIAS[slug] ?? slug;
    const product = PRODUCT_BY_SLUG[normalizedSlug];

    useEffect(() => {
        setActiveImageIndex(0);
    }, [normalizedSlug, selectedPlaidVariant]);

    useEffect(() => {
        document.body.style.overflow = orderModalOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [orderModalOpen]);

    const buildMessage = () =>
        `Order Form\n\nName: ${orderForm.name}\nDelivery Address: ${orderForm.address}\nContact Number: ${orderForm.contact}\nLandmark: ${orderForm.landmark}\n\nOrder: ${orderForm.order}\nQuantity: ${orderForm.quantity}\nColor: ${orderForm.color}\nSize: ${orderForm.size}`;

    const copyOrderForm = async () => {
        await navigator.clipboard.writeText(buildMessage());
        setFormCopied(true);
        setTimeout(() => setFormCopied(false), 2000);
    };

    const handleFormChange = (field: keyof typeof orderForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrderForm((prev) => ({ ...prev, [field]: e.target.value }));
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
                        <button
                            className="btn product-scaffold-cta"
                            onClick={() => setOrderModalOpen(true)}
                        >
                            Order Now
                            <span className="product-scaffold-cta-sub">via Instagram</span>
                        </button>
                    </div>
                </div>
            </section>

            {orderModalOpen && (
                <div className="order-modal-overlay" onClick={() => setOrderModalOpen(false)}>
                    <div className="order-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="order-modal-header">
                            <p className="order-modal-title">Order Now</p>
                            <button className="order-modal-close" onClick={() => setOrderModalOpen(false)} aria-label="Close">&#x2715;</button>
                        </div>
                        <ol className="order-modal-steps">
                            <li>Fill in the form below.</li>
                            <li>On mobile, tap <strong>Send via Instagram</strong> — your details will be pre-filled in the DM.</li>
                            <li>On desktop, tap <strong>Copy Form</strong> and paste it in our Instagram DMs.</li>
                            <li>Wait for our confirmation on availability, payment, and shipping.</li>
                        </ol>
                        <div className="how-to-order-fields">
                            {([
                                { label: "Name", field: "name", placeholder: "Juan Dela Cruz" },
                                { label: "Delivery Address", field: "address", placeholder: "123 Street, City" },
                                { label: "Contact Number", field: "contact", placeholder: "09XX XXX XXXX" },
                                { label: "Landmark", field: "landmark", placeholder: "Near SM City" },
                                { label: "Order", field: "order", placeholder: "Embroidered Longsleeves" },
                                { label: "Quantity", field: "quantity", placeholder: "1" },
                                { label: "Color", field: "color", placeholder: "Black" },
                                { label: "Size", field: "size", placeholder: "M" },
                            ] as { label: string; field: keyof typeof orderForm; placeholder: string }[]).map(({ label, field, placeholder }) => (
                                <div key={field} className="how-to-order-field-row">
                                    <label className="how-to-order-label">{label}</label>
                                    <input
                                        className="how-to-order-input"
                                        type="text"
                                        placeholder={placeholder}
                                        value={orderForm[field]}
                                        onChange={handleFormChange(field)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="order-modal-actions">
                            <a
                                href={`https://ig.me/m/groovyph_?text=${encodeURIComponent(buildMessage())}`}
                                className="order-modal-send"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setOrderModalOpen(false)}
                            >
                                Send via Instagram
                            </a>
                            <button className="order-modal-copy" onClick={copyOrderForm}>
                                {formCopied ? "Copied!" : "Copy Form"}
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
}