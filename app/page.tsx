"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";
import ProductCard from "./components/product-card";

const CONTACT_EMAIL = "shop@groovyph.com";

const FAQS = [
    {
        q: "What size should I get?",
        a: "We recommend checking our Size Guide page for detailed measurements before placing your order. If you're in between sizes, we suggest sizing up for a more relaxed fit.",
    },
    {
        q: "Are your items available for pre-order?",
        a: "Some releases may be limited or made available through pre-order. This will always be indicated in the product description or announcement posts.",
    },
    {
        q: "How long does shipping take?",
        a: "Orders are typically processed within 1–3 business days. Delivery time depends on your location, but usually takes 2–7 business days within the Philippines.",
    },
    {
        q: "Do you accept returns or exchanges?",
        a: "We only allow exchanges for defective or incorrect items. Please contact us within 48 hours of receiving your order.",
    },
    {
        q: "Can I cancel or change my order?",
        a: "Orders cannot be changed or cancelled once they have been processed. Please double-check your details before checkout.",
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept GCash, bank transfer, and other payment methods indicated at checkout.",
    },
    {
        q: "How do I track my order?",
        a: "Tracking details will be sent via email or message once your order has been shipped.",
    },
];

const FEATURED_PRODUCTS = [
    {
        src: "/assets/shop-partner-1.jpg",
        alt: "Embroidered Longsleeves",
        name: "Embroidered Longsleeves",
        slug: "embroidered-longsleeves",
    },
    {
        src: "/assets/shop-black-1.jpg",
        alt: "Graphic Tee Black",
        name: "Graphic Tee — Black",
        slug: "graphic-tee",
    },
    {
        src: "/assets/shop-partner-2.jpg",
        alt: "Embroidered Tee",
        name: "Embroidered Tee",
        slug: "embroidered-tee",
    },
    {
        src: "/assets/shop-white-1.jpg",
        alt: "Graphic Tee White",
        name: "Graphic Tee — White",
        slug: "graphic-tee",
    },
];

export default function Home() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    useEffect(() => {
        let cartCount = 0;
        let rafId = 0;

        const hero = document.querySelector<HTMLElement>(".hero-content");
        const revealElements = document.querySelectorAll<HTMLElement>(".reveal");



        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        window.setTimeout(() => {
                            entry.target.classList.add("visible");
                        }, index * 100);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            },
        );
        revealElements.forEach((element) => revealObserver.observe(element));

        const anchorListeners: Array<{ element: HTMLAnchorElement; listener: EventListener }> = [];
        document
            .querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
            .forEach((anchor) => {
                const listener = (event: Event) => {
                    event.preventDefault();
                    const href = anchor.getAttribute("href");
                    if (!href || !href.startsWith("#") || href === "#") {
                        return;
                    }
                    const target = document.querySelector<HTMLElement>(href);
                    target?.scrollIntoView({ behavior: "smooth", block: "start" });
                };
                anchor.addEventListener("click", listener);
                anchorListeners.push({ element: anchor, listener });
            });

        const onScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                if (hero && scrolled < window.innerHeight) {
                    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
                    hero.style.opacity = String(1 - (scrolled / window.innerHeight) * 0.9);
                }
            });
        };
        window.addEventListener("scroll", onScroll);

        const cartListeners: Array<{ element: HTMLElement; listener: EventListener }> = [];
        document.querySelectorAll<HTMLElement>(".product-quick-add").forEach((button) => {
            const listener = () => {
                cartCount += 1;
                const counter = document.querySelector<HTMLElement>(".nav-cart-count");
                if (!counter) {
                    return;
                }

                counter.textContent = String(cartCount);
                counter.style.transform = "scale(1.3)";
                window.setTimeout(() => {
                    counter.style.transform = "scale(1)";
                }, 200);
            };
            button.addEventListener("click", listener);
            cartListeners.push({ element: button, listener });
        });

        const magneticListeners: Array<{
            element: HTMLElement;
            move: EventListener;
            leave: EventListener;
        }> = [];
        document.querySelectorAll<HTMLElement>(".btn, .submit-btn").forEach((button) => {
            let magneticRaf = 0;
            const move = (event: Event) => {
                const mouseEvent = event as MouseEvent;
                cancelAnimationFrame(magneticRaf);
                magneticRaf = requestAnimationFrame(() => {
                    const rect = button.getBoundingClientRect();
                    const x = mouseEvent.clientX - rect.left - rect.width / 2;
                    const y = mouseEvent.clientY - rect.top - rect.height / 2;
                    button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                });
            };
            const leave = () => {
                button.style.transform = "";
            };

            button.addEventListener("mousemove", move);
            button.addEventListener("mouseleave", leave);
            magneticListeners.push({ element: button, move, leave });
        });

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.cancelAnimationFrame(rafId);
            revealObserver.disconnect();

            anchorListeners.forEach(({ element, listener }) => {
                element.removeEventListener("click", listener);
            });

            cartListeners.forEach(({ element, listener }) => {
                element.removeEventListener("click", listener);
            });

            magneticListeners.forEach(({ element, move, leave }) => {
                element.removeEventListener("mousemove", move);
                element.removeEventListener("mouseleave", leave);
            });
        };
    }, []);

    return (
        <div>
            <section className="hero" id="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <Image
                            src="/assets/text-icon.svg"
                            alt="Groovy"
                            className="hero-title-image"
                            width={1200}
                            height={582}
                            priority
                        />
                    </h1>
                    <div className="hero-cta">
                        <Link href="/collection" className="btn">
                            Explore Collection
                        </Link>
                    </div>
                </div>
            </section>

            {/* Latest Drop Section */}
            <section className="featured" id="collection">
                <div className="section-header reveal">
                    <div>
                        <p className="section-subtitle">Latest Drop</p>
                        <h2 className="section-title">Metamorphosis</h2>
                    </div>
                    <Link href="/collection" className="btn">
                        View Collection
                    </Link>
                </div>
                <div className="featured-grid">
                    {FEATURED_PRODUCTS.map((product) => (
                        <ProductCard
                            key={product.src}
                            src={product.src}
                            alt={product.alt}
                            name={product.name}
                            slug={product.slug}
                        />
                    ))}
                </div>
            </section>

            {/* Brand Story Section */}
            <section className="story" id="story">
                <div className="story-image reveal">
                    <Image
                        fill
                        src="/assets/groovy-logo.svg"
                        alt="Groovy Logo"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                </div>
                <div className="story-content reveal">
                    <p className="story-eyebrow">Our Story</p>
                    <p className="story-text">
                        Groovy began in 2019 as a creative outlet, translating ideas into
                        tangible pieces. Over time, it evolved into something more personal,
                        shaped by emotion and lived experiences. As the brand grew, it became
                        clear that it was never meant to exist in isolation, but to connect
                        and resonate beyond itself.
                    </p>
                    <blockquote className="story-quote">
                        "Stepping out of your comfort zone — the feeling of doing something
                        once thought impossible."
                    </blockquote>
                    <p className="story-text">
                        At its core, Groovy stands for stepping out of one's comfort zone and
                        embracing growth — the feeling of doing something once thought
                        impossible.
                    </p>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq reveal" id="faq">
                <div className="faq-inner">
                    <div className="faq-header">
                        <p className="section-subtitle">FAQ</p>
                        <h2 className="faq-title">Frequently Asked Questions</h2>
                    </div>
                    <div className="faq-list">
                        {FAQS.map((item, i) => (
                            <div
                                key={i}
                                className={`faq-item${openFaq === i ? " open" : ""}`}
                            >
                                <button
                                    className="faq-question"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    aria-expanded={openFaq === i}
                                >
                                    <span>{item.q}</span>
                                    <span className="faq-icon" aria-hidden="true" />
                                </button>
                                <div className="faq-answer">
                                    <div className="faq-answer-inner">
                                        <p>{item.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact" id="contact">
                <div className="contact-info reveal">
                    <h2>Get in Touch</h2>
                    <div className="contact-details">
                        <div className="contact-item">
                            <p className="contact-label">Email</p>
                            <p className="contact-value">
                                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`} target="_blank" rel="noopener noreferrer">
                                    {CONTACT_EMAIL}
                                </a>
                            </p>
                        </div>
                        <div className="contact-item">
                            <p className="contact-label">Location</p>
                            <p className="contact-value">Naga City, Philippines</p>
                        </div>
                    </div>
                    <div className="social-links">
                        <a
                            href="https://www.instagram.com/groovyph_/"
                            className="social-link"
                            aria-label="Instagram"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a
                            href="https://www.facebook.com/groovyclothing4400"
                            className="social-link"
                            aria-label="Facebook"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a
                            href="https://www.tiktok.com/@groovyph"
                            className="social-link"
                            aria-label="TikTok"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FontAwesomeIcon icon={faTiktok} />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
