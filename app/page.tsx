"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "./components/header";
import Swal from "sweetalert2";

const CONTACT_EMAIL = "groovyclothingph@gmail.com";

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

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  useEffect(() => {
    let cartCount = 0;
    let rafId = 0;

    const loader = document.querySelector<HTMLElement>(".loader");
    const nav = document.querySelector<HTMLElement>(".nav");
    const hero = document.querySelector<HTMLElement>(".hero-content");
    const revealElements = document.querySelectorAll<HTMLElement>(".reveal");

    const onLoad = () => {
      window.setTimeout(() => {
        loader?.classList.add("hidden");
      }, 1500);
    };

    window.addEventListener("load", onLoad);
    if (document.readyState === "complete") {
      onLoad();
    }



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
      const scrolled = window.pageYOffset;

      if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = String(1 - (scrolled / window.innerHeight) * 0.9);
      }

      if (!nav) {
        return;
      }

      if (window.scrollY > 100) {
        nav.style.background = "rgba(237, 235, 231, 0.88)";
        nav.style.backdropFilter = "blur(12px)";
        nav.style.borderBottom = "1px solid rgba(28,26,23,0.08)";
      } else {
        nav.style.background = "transparent";
        nav.style.backdropFilter = "none";
        nav.style.borderBottom = "none";
      }
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
      const move = (event: Event) => {
        const mouseEvent = event as MouseEvent;
        const rect = button.getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left - rect.width / 2;
        const y = mouseEvent.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      };
      const leave = () => {
        button.style.transform = "";
      };

      button.addEventListener("mousemove", move);
      button.addEventListener("mouseleave", leave);
      magneticListeners.push({ element: button, move, leave });
    });

    return () => {
      window.removeEventListener("load", onLoad);
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

  const copyEmailToClipboard = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Email copied to clipboard",
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      });
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = CONTACT_EMAIL;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();

      const didCopy = document.execCommand("copy");
      document.body.removeChild(textarea);

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: didCopy ? "success" : "error",
        title: didCopy ? "Email copied to clipboard" : "Could not copy email",
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      });
    }
  };


  return (
    <div>





      {/* Hero Section */}
      <section className="hero" id="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/groovy-bg.svg" alt="" className="hero-bg" />
        <div className="hero-content">
          <p className="hero-tagline"></p>
          <h1 className="hero-title">
            <span>g</span>
            <span>r</span>
            <span>o</span>
            <span>o</span>
            <span>v</span>
            <span>y</span>
            <span>.</span>
          </h1>
          <p className="hero-subtitle">

          </p>
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
            View All
          </Link>
        </div>
        <div className="featured-grid">
          <div className="product-card reveal">
            <div className="product-image">
              <Image
                src="/assets/shop-partner-1.jpg"
                width={600}
                height={600}
                alt="Embroidered Longsleeves"
                quality={80}
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
            <div className="product-quick-add">Quick Add +</div>
            <div className="product-details">
              <h3 className="product-name">Embroidered Longsleeves</h3>
              <p className="product-price">₱price</p>
            </div>
          </div>
          <div className="product-card reveal">
            <div className="product-image">
              <Image
                src="/assets/shop-black-1.jpg"
                width={600}
                height={600}
                alt="Graphic Tee Black"
                quality={80}
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
            <div className="product-quick-add">Quick Add +</div>
            <div className="product-details">
              <h3 className="product-name">Graphic Tee — Black</h3>
              <p className="product-price">₱price</p>
            </div>
          </div>
          <div className="product-card reveal">
            <div className="product-image">
              <Image
                src="/assets/shop-partner-2.jpg"
                width={600}
                height={600}
                alt="Embroidered Tee"
                quality={80}
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
            <div className="product-quick-add">Quick Add +</div>
            <div className="product-details">
              <h3 className="product-name">Embroidered Tee</h3>
              <p className="product-price">
                <span className="product-price">₱price</span>
              </p>
            </div>
          </div>
          <div className="product-card reveal">
            <div className="product-image">
              <Image
                src="/assets/shop-white-1.jpg"
                width={600}
                height={600}
                alt="Graphic Tee White"
                quality={80}
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
            <div className="product-quick-add">Quick Add +</div>
            <div className="product-details">
              <h3 className="product-name">Graphic Tee — White</h3>
              <p className="product-price">₱price</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="story" id="story">
        <div className="story-image reveal">
          <Image
            fill
            src="/assets/groovy-logo.svg"
            alt="Groovy Logo"
          />
        </div>
        <div className="story-content reveal">
          <p className="story-eyebrow">Our Story</p>
          <h2 className="story-title">Built on growth, worn with purpose</h2>
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
                <a href={`mailto:${CONTACT_EMAIL}`} onClick={copyEmailToClipboard}>
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
              <svg viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/groovyclothing4400"
              className="social-link"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
