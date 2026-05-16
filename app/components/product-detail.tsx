"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import type { ShopifyProduct, ShopifyVariant } from "../../lib/shopify";
import { useCart } from "../context/cart";

function showToast(icon: "success" | "error", title: string) {
    Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    }).fire({ icon, title });
}

// Maps product handle + option value → price override (in PHP)
const VARIANT_PRICE_MAP: Record<string, Record<string, number>> = {
    "plaid": { Longsleeves: 1950, Polo: 1650 },
};

// Maps product handle + option value → image filename stem (Shopify CDN flattens / to _)
const VARIANT_IMAGE_MAP: Record<string, Record<string, string>> = {
    "embroidered-longsleeves": { White: "longsleeve_3", Black: "longsleeve_2" },
    "graphic-tee":             { White: "graphic_2",    Black: "graphic_1" },
    "embroidered-tee":         { White: "embroid_3",    Black: "embroid_2" },
    "plaid":                   { Longsleeves: "plaid_1", Polo: "plaid_2" },
};

function findImageIndexByStem(
    images: ShopifyProduct["images"],
    stem: string
): number {
    const lower = stem.toLowerCase();
    return images.findIndex((img) => img.url.split("?")[0].toLowerCase().includes(lower));
}

function getOptionNames(variants: ShopifyVariant[]): string[] {
    const names: string[] = [];
    for (const v of variants) {
        for (const o of v.selectedOptions) {
            if (!names.includes(o.name)) names.push(o.name);
        }
    }
    return names;
}

function getOptionValues(variants: ShopifyVariant[], optionName: string): string[] {
    const values: string[] = [];
    for (const v of variants) {
        const opt = v.selectedOptions.find((o) => o.name === optionName);
        if (opt && !values.includes(opt.value)) values.push(opt.value);
    }
    return values;
}

function getAvailableSizes(
    variants: ShopifyVariant[],
    options: Record<string, string | null>
): string[] {
    const sizes: string[] = [];
    for (const v of variants) {
        const nonSizeMatch = Object.entries(options)
            .filter(([name]) => name !== "Size")
            .every(([name, value]) =>
                !value || v.selectedOptions.some((o) => o.name === name && o.value === value)
            );
        if (!nonSizeMatch) continue;
        const sizeOpt = v.selectedOptions.find((o) => o.name === "Size");
        if (sizeOpt && !sizes.includes(sizeOpt.value)) sizes.push(sizeOpt.value);
    }
    return sizes;
}

function findVariantByOptions(
    variants: ShopifyVariant[],
    options: Record<string, string | null>
): ShopifyVariant | null {
    if (Object.values(options).every((v) => !v)) return variants[0] ?? null;
    return (
        variants.find((v) =>
            Object.entries(options).every(
                ([name, value]) =>
                    !value || v.selectedOptions.some((o) => o.name === name && o.value === value)
            )
        ) ?? null
    );
}


export default function ProductDetail({ product }: { product: ShopifyProduct }) {
    const optionNames = getOptionNames(product.variants);
    const hasColors = optionNames.includes("Color");
    const hasSizes = optionNames.includes("Size");
    const otherOptionNames = optionNames.filter((n) => n !== "Color" && n !== "Size");

    const [selectedOptions, setSelectedOptions] = useState<Record<string, string | null>>(() => {
        const initial: Record<string, string | null> = {};
        for (const name of optionNames) {
            initial[name] = name === "Size" ? null : (getOptionValues(product.variants, name)[0] ?? null);
        }
        return initial;
    });

    const [activeImageIndex, setActiveImageIndex] = useState(() => {
        const firstVisual = optionNames.find((n) => n !== "Size");
        if (!firstVisual) return 0;
        const firstValue = getOptionValues(product.variants, firstVisual)[0];
        if (!firstValue) return 0;
        // Try Shopify-assigned variant image first
        const variantImage = product.variants.find((v) =>
            v.selectedOptions.some((o) => o.name === firstVisual && o.value === firstValue)
        )?.image;
        if (variantImage) {
            const idx = product.images.findIndex((img) => img.id === variantImage.id);
            if (idx !== -1) return idx;
        }
        // Fall back to filename stem map
        const stem = VARIANT_IMAGE_MAP[product.handle]?.[firstValue];
        if (stem) {
            const idx = findImageIndexByStem(product.images, stem);
            if (idx !== -1) return idx;
        }
        return 0;
    });

    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const { addToCart } = useCart();

    const colorValues = hasColors ? getOptionValues(product.variants, "Color") : [];
    const sizeValues = hasSizes ? getAvailableSizes(product.variants, selectedOptions) : [];
    const activeVariant = findVariantByOptions(product.variants, selectedOptions);
    const isAvailable = activeVariant?.availableForSale ?? false;
    const stockLeft = activeVariant?.quantityAvailable ?? 0;

    const totalImages = product.images.length;
    const activeImage = product.images[activeImageIndex] ?? product.images[0];
    const showCarouselControls = totalImages > 1;
    let price = parseFloat(activeVariant?.price?.amount ?? product.priceRange.minVariantPrice.amount);
    for (const [name, value] of Object.entries(selectedOptions)) {
        if (name !== "Size" && value) {
            const override = VARIANT_PRICE_MAP[product.handle]?.[value];
            if (override !== undefined) { price = override; break; }
        }
    }

    useEffect(() => {
        setActiveImageIndex(0);
    }, [product.handle]);

    const goToPreviousImage = () => {
        setActiveImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    };

    const goToNextImage = () => {
        setActiveImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    };

    const switchToOptionImage = (optionName: string, value: string) => {
        // Try Shopify-assigned variant image first
        const variantImage = product.variants.find((v) =>
            v.selectedOptions.some((o) => o.name === optionName && o.value === value)
        )?.image;
        if (variantImage) {
            const idx = product.images.findIndex((img) => img.id === variantImage.id);
            if (idx !== -1) { setActiveImageIndex(idx); return; }
        }
        // Fall back to filename stem map
        const stem = VARIANT_IMAGE_MAP[product.handle]?.[value];
        if (!stem) return;
        const idx = findImageIndexByStem(product.images, stem);
        if (idx !== -1) setActiveImageIndex(idx);
    };

    const handleOptionSelect = (optionName: string, value: string) => {
        setSelectedOptions((prev) => {
            const next = { ...prev, [optionName]: value };
            if (optionName !== "Size" && prev["Size"]) {
                const available = getAvailableSizes(product.variants, next);
                if (!available.includes(prev["Size"]!)) next["Size"] = null;
            }
            return next;
        });
        if (optionName !== "Size") switchToOptionImage(optionName, value);
    };

    const handleAddToCart = async () => {
        for (const name of optionNames) {
            if (name !== "Size" && !selectedOptions[name]) {
                showToast("error", `Please select a ${name.toLowerCase()}.`);
                return;
            }
        }
        if (hasSizes && !selectedOptions["Size"]) {
            showToast("error", "Please select a size.");
            return;
        }
        if (!activeVariant || !isAvailable) return;
        setIsLoading(true);
        try {
            await addToCart(activeVariant.id, quantity);
            showToast("success", "Added to cart!");
        } catch {
            showToast("error", "Something went wrong. Please try again.");
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
                    <p className="product-scaffold-price"><span className="currency-label">PHP</span> {price.toLocaleString("en-PH")}</p>

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
                                {colorValues.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`product-color-variant${selectedOptions["Color"] === color ? " is-active" : ""}`}
                                        onClick={() => handleOptionSelect("Color", color)}
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

                    {otherOptionNames.map((optionName) => {
                        const values = getOptionValues(product.variants, optionName);
                        return (
                            <div key={optionName} className="product-scaffold-sizes">
                                <p className="product-scaffold-label">{optionName}</p>
                                <div className="product-scaffold-size-list" role="list" aria-label={`Available ${optionName.toLowerCase()}s`}>
                                    {values.map((value) => (
                                        <div key={value} className="product-scaffold-size-wrap">
                                            <button
                                                type="button"
                                                role="listitem"
                                                className={`product-scaffold-size${selectedOptions[optionName] === value ? " is-active" : ""}`}
                                                onClick={() => handleOptionSelect(optionName, value)}
                                            >
                                                {value}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {hasSizes ? (
                        <div className="product-scaffold-sizes">
                            <p className="product-scaffold-label">Size</p>
                            <div className="product-scaffold-size-list" role="list" aria-label="Available sizes">
                                {sizeValues.map((size) => {
                                    const v = findVariantByOptions(product.variants, { ...selectedOptions, Size: size });
                                    const available = v?.availableForSale ?? false;
                                    const stock = v?.quantityAvailable ?? 0;
                                    const isLow = available && stock > 0 && stock < 5;
                                    return (
                                        <div key={size} className="product-scaffold-size-wrap">
                                            <button
                                                type="button"
                                                role="listitem"
                                                className={`product-scaffold-size${selectedOptions["Size"] === size ? " is-active" : ""}${!available ? " is-disabled" : ""}`}
                                                onClick={() => available && handleOptionSelect("Size", size)}
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
                    </div>
                </div>
            </section>
        </>
    );
}
