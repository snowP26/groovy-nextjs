"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import type { ShopifyProduct, ShopifyVariant } from "../../lib/shopify";
import { useCart } from "../context/cart";

function getColors(variants: ShopifyVariant[]): string[] {
    const colors = new Set<string>();
    for (const v of variants) {
        const colorOpt = v.selectedOptions.find((o) => o.name === "Color");
        if (colorOpt) colors.add(colorOpt.value);
    }
    return Array.from(colors);
}

function getSizes(variants: ShopifyVariant[], color: string | null): string[] {
    const sizes: string[] = [];
    for (const v of variants) {
        const colorOpt = v.selectedOptions.find((o) => o.name === "Color");
        const sizeOpt = v.selectedOptions.find((o) => o.name === "Size");
        if (!sizeOpt) continue;
        if (!color || !colorOpt || colorOpt.value === color) {
            if (!sizes.includes(sizeOpt.value)) sizes.push(sizeOpt.value);
        }
    }
    return sizes;
}

function findVariant(
    variants: ShopifyVariant[],
    color: string | null,
    size: string | null
): ShopifyVariant | null {
    if (!color && !size) return variants[0] ?? null;
    return (
        variants.find((v) => {
            const colorOpt = v.selectedOptions.find((o) => o.name === "Color");
            const sizeOpt = v.selectedOptions.find((o) => o.name === "Size");
            const colorMatch = !color || (colorOpt && colorOpt.value === color);
            const sizeMatch = !size || (sizeOpt && sizeOpt.value === size);
            return colorMatch && sizeMatch;
        }) ?? null
    );
}

export default function ProductDetail({ product }: { product: ShopifyProduct }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);
    const { addToCart } = useCart();

    const colors = getColors(product.variants);
    const hasColors = colors.length > 0;
    const sizes = getSizes(product.variants, selectedColor);
    const hasSizes = sizes.length > 0;

    const activeVariant = findVariant(product.variants, selectedColor, selectedSize);
    const isAvailable = activeVariant?.availableForSale ?? false;
    const stockLeft = activeVariant?.quantityAvailable ?? 0;

    const totalImages = product.images.length;
    const activeImage = product.images[activeImageIndex] ?? product.images[0];
    const showCarouselControls = totalImages > 1;

    const price = parseFloat(product.priceRange.minVariantPrice.amount);

    useEffect(() => {
        setActiveImageIndex(0);
    }, [product.handle]);

    const goToPreviousImage = () => {
        setActiveImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    };

    const goToNextImage = () => {
        setActiveImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    };

    const handleAddToCart = async () => {
        if (hasColors && !selectedColor) {
            setFeedback({ type: "error", message: "Please select a color." });
            return;
        }
        if (hasSizes && !selectedSize) {
            setFeedback({ type: "error", message: "Please select a size." });
            return;
        }
        if (!activeVariant || !isAvailable) return;
        setIsLoading(true);
        setFeedback(null);
        try {
            await addToCart(activeVariant.id, quantity);
            setFeedback({ type: "success", message: "Added to cart!" });
            setTimeout(() => setFeedback(null), 3000);
        } catch {
            setFeedback({ type: "error", message: "Something went wrong. Please try again." });
        } finally {
            setIsLoading(false);
        }
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
                    {product.title}
                </Typography>
            </Breadcrumbs>

            <section className="product-scaffold">
                <div className="product-scaffold-image product-carousel">
                    <div className="product-carousel-stage">
                        {activeImage ? (
                            <Image
                                src={activeImage.url}
                                alt={activeImage.altText ?? product.title}
                                width={1000}
                                height={1200}
                                quality={85}
                                sizes="(max-width: 768px) 100vw, 38vw"
                                priority
                                className="product-carousel-media"
                            />
                        ) : null}

                        {showCarouselControls ? (
                            <>
                                <button
                                    type="button"
                                    className="product-carousel-nav product-carousel-nav-prev"
                                    aria-label="Show previous image"
                                    onClick={goToPreviousImage}
                                >
                                    <span className="product-carousel-nav-icon" aria-hidden="true">{"‹"}</span>
                                </button>
                                <button
                                    type="button"
                                    className="product-carousel-nav product-carousel-nav-next"
                                    aria-label="Show next image"
                                    onClick={goToNextImage}
                                >
                                    <span className="product-carousel-nav-icon" aria-hidden="true">{"›"}</span>
                                </button>
                            </>
                        ) : null}
                    </div>

                    {showCarouselControls ? (
                        <>
                            <div className="product-carousel-thumbs" role="tablist" aria-label="Product image previews">
                                {product.images.map((image, index) => (
                                    <button
                                        key={image.url}
                                        type="button"
                                        className={`product-carousel-thumb${index === activeImageIndex ? " is-active" : ""}`}
                                        onClick={() => setActiveImageIndex(index)}
                                        aria-label={`Show image ${index + 1}`}
                                        aria-selected={index === activeImageIndex}
                                    >
                                        <Image src={image.url} alt={image.altText ?? product.title} width={120} height={120} quality={70} sizes="72px" />
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
                    <h1 className="product-scaffold-title">{product.title}</h1>
                    <p className="product-scaffold-price"><span className="currency-label">PHP</span> {price.toLocaleString()}</p>

                    {product.description ? (
                        <ul className="product-scaffold-features">
                            {product.description.split("\n").filter(Boolean).map((line) => (
                                <li key={line}>{line}</li>
                            ))}
                        </ul>
                    ) : null}

                    {hasColors ? (
                        <div className="product-color-variants">
                            <p className="product-scaffold-label">Color</p>
                            <div className="product-color-variant-list">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`product-color-variant${selectedColor === color ? " is-active" : ""}`}
                                        onClick={() => {
                                            const availableSizes = getSizes(product.variants, color);
                                            setSelectedColor(color);
                                            if (selectedSize && !availableSizes.includes(selectedSize)) {
                                                setSelectedSize(null);
                                            }
                                        }}
                                    >
                                        <span
                                            className="product-color-swatch"
                                            style={{ backgroundColor: color.toLowerCase() }}
                                        />
                                        <span className="product-color-label">{color}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {hasSizes ? (
                        <div className="product-scaffold-sizes">
                            <p className="product-scaffold-label">Size</p>
                            <div className="product-scaffold-size-list" role="list" aria-label="Available sizes">
                                {sizes.map((size) => {
                                    const v = findVariant(product.variants, selectedColor, size);
                                    const available = v?.availableForSale ?? false;
                                    const stock = v?.quantityAvailable ?? 0;
                                    const isLow = available && stock > 0 && stock < 5;
                                    return (
                                        <div key={size} className="product-scaffold-size-wrap">
                                            <button
                                                type="button"
                                                role="listitem"
                                                className={`product-scaffold-size${selectedSize === size ? " is-active" : ""}${!available ? " is-disabled" : ""}`}
                                                onClick={() => available && setSelectedSize(size)}
                                                disabled={!available}
                                                aria-disabled={!available}
                                            >
                                                {size}
                                            </button>
                                            {isLow ? <span className="product-size-low-stock">{stock} left</span> : null}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : null}

                    <div className="product-quantity">
                        <p className="product-scaffold-label">Quantity</p>
                        <div className="product-quantity-control">
                            <button
                                type="button"
                                className="product-quantity-btn"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                aria-label="Decrease quantity"
                                disabled={quantity <= 1}
                            >−</button>
                            <span className="product-quantity-value">{quantity}</span>
                            <button
                                type="button"
                                className="product-quantity-btn"
                                onClick={() => setQuantity((q) => Math.min(stockLeft || 99, q + 1))}
                                aria-label="Increase quantity"
                                disabled={quantity >= (stockLeft || 99)}
                            >+</button>
                        </div>
                    </div>


                    <div className="product-scaffold-actions">
                        <button
                            type="button"
                            className="btn product-scaffold-cta"
                            onClick={handleAddToCart}
                            disabled={isLoading || (!isAvailable && !!activeVariant)}
                        >
                            {isLoading
                                ? "Adding…"
                                : !isAvailable && activeVariant
                                ? "Out of Stock"
                                : "Add to Cart"}
                        </button>
                        {feedback ? (
                            <p className={`product-add-feedback product-add-feedback--${feedback.type}`}>
                                {feedback.message}
                            </p>
                        ) : null}
                    </div>
                </div>
            </section>
        </>
    );
}
