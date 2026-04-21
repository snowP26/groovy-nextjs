"use client";

import Image from "next/image";
import { useEffect, type FormEvent } from "react";

export default function Home() {
  useEffect(() => {
    let cartCount = 0;
    let rafId = 0;

    const loader = document.querySelector<HTMLElement>(".loader");
    const cursor = document.querySelector<HTMLElement>(".cursor");
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


    const hoverElements = document.querySelectorAll<HTMLElement>(
      "a, button, .collection-item, .product-card",
    );
    const hoverListeners: Array<{
      element: HTMLElement;
      enter: EventListener;
      leave: EventListener;
    }> = [];
    hoverElements.forEach((element) => {
      const enter = () => cursor?.classList.add("hover");
      const leave = () => cursor?.classList.remove("hover");
      element.addEventListener("mouseenter", enter);
      element.addEventListener("mouseleave", leave);
      hoverListeners.push({ element, enter, leave });
    });

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
        hero.style.opacity = String(1 - (scrolled / window.innerHeight) * 0.8);
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

      hoverListeners.forEach(({ element, enter, leave }) => {
        element.removeEventListener("mouseenter", enter);
        element.removeEventListener("mouseleave", leave);
      });

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

  const handleNewsletterSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const input = form.querySelector<HTMLInputElement>("input");
    const button = form.querySelector<HTMLButtonElement>("button");

    if (!button) {
      return;
    }

    const originalText = button.textContent;
    button.textContent = "Subscribed!";
    button.style.backgroundColor = "var(--color-accent)";
    if (input) {
      input.value = "";
    }

    window.setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = "";
    }, 2000);
  };


  return (
    <div>
      <div className="loader">
        <div className="loader-text">
          <span style={{ animationDelay: "0s" }}>g</span>
          <span style={{ animationDelay: "0.1s" }}>r</span>
          <span style={{ animationDelay: "0.2s" }}>o</span>
          <span style={{ animationDelay: "0.3s" }}>o</span>
          <span style={{ animationDelay: "0.4s" }}>v</span>
          <span style={{ animationDelay: "0.5s" }}>y</span>
          <span style={{ animationDelay: "0.6s" }}>.</span>
        </div>
      </div>

      {/* Custom Cursor */}
      {/* <div className="cursor" /> */}

      {/* Navigation */}
      <nav className="nav">
        <a href="#" className="nav-logo">
          groovy.
        </a>
        <ul className="nav-links">
          <li>
            <a href="#collection">Collection</a>
          </li>
          <li>
            <a href="#story">Our Story</a>
          </li>
          <li>
            <a href="#featured">Shop</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <p className="hero-tagline">Homegrown Filipino Brand</p>
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
            Timeless pieces crafted with intention. Where comfort meets conscious
            style.
          </p>
          <div className="hero-cta">
            <a href="#collection" className="btn">
              Explore Collection
            </a>
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section className="collection" id="collection">
        <div className="section-header reveal">
          <div>
            <p className="section-subtitle">Latest Drop</p>
            <h2 className="section-title">Metamorphosis</h2>
          </div>
          <a href="/collection" className="btn">
            View All
          </a>
        </div>
        <div className="collection-grid">
          <div className="collection-item reveal">
            <Image
              src="/assets/black-shirt-1.jpg"
              width={600}
              height={600}
              alt="Basics Collection"
            />
            <div className="collection-info">
              <h3 className="collection-name">Basics</h3>
              <p className="collection-category">Everyday Essentials</p>
            </div>
          </div>
          <div className="collection-item reveal">
            <Image
              src="/assets/white-shirt-2.jpg"
              width={600}
              height={600}
              alt="Basics Collection"
            />
            <div className="collection-info">
              <h3 className="collection-name">Streetwear</h3>
              <p className="collection-category">Urban Edge</p>
            </div>
          </div>
          <div className="collection-item reveal">
            <Image
              src="/assets/white-shirt-1.jpg"
              width={600}
              height={600}
              alt="Basics Collection"
            />
            <div className="collection-info">
              <h3 className="collection-name">Minimalist</h3>
              <p className="collection-category">Clean Lines</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="story" id="story">
        <div className="story-image reveal">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
            alt="Our Story"
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


      {/* Featured Products Section */}
      <section className="featured" id="featured">
        <div className="section-header reveal">
          <div>
            <p className="section-subtitle">Best Sellers</p>
            <h2 className="section-title">Featured Pieces</h2>
          </div>
        </div>
        <div className="featured-grid">
          <div className="product-card reveal">
            <div className="product-image">
              <Image
                src="/assets/shop-partner-1.jpg"
                width={600}
                height={600}
                alt="Basics Collection"
              />
            </div>
            <div className="product-quick-add">Quick Add +</div>
            <div className="product-details">
              <h3 className="product-name">White Tee</h3>
              <p className="product-price">₱899</p>
            </div>
          </div>
          <div className="product-card reveal">
            <div className="product-image">
              <Image
                src="/assets/shop-black-1.jpg"
                width={600}
                height={600}
                alt="Basics Collection"
              />
            </div>
            <div className="product-quick-add">Quick Add +</div>
            <div className="product-details">
              <h3 className="product-name">Oversized Hoodie</h3>
              <p className="product-price">₱1,899</p>
            </div>
          </div>
          <div className="product-card reveal">
            <div className="product-image">
              <Image
                src="/assets/shop-partner-2.jpg"
                width={600}
                height={600}
                alt="Basics Collection"
              />
            </div>
            <div className="product-quick-add">Quick Add +</div>
            <div className="product-details">
              <h3 className="product-name">Cargo Pants</h3>
              <p className="product-price">
                <span className="original">₱2,499</span>
                <span className="sale">₱1,999</span>
              </p>
            </div>
          </div>
          <div className="product-card reveal">
            <div className="product-image">
              <Image
                src="/assets/shop-white-1.jpg"
                width={600}
                height={600}
                alt="Basics Collection"
              />
            </div>
            <div className="product-quick-add">Quick Add +</div>
            <div className="product-details">
              <h3 className="product-name">Denim Jacket</h3>
              <p className="product-price">₱2,899</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter reveal">
        <h2 className="newsletter-title">Stay in the Loop</h2>
        <p className="newsletter-text">
          Subscribe to get early access to new drops, exclusive offers, and
          styling tips.
        </p>
        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
          <input
            type="email"
            className="newsletter-input"
            placeholder="Enter your email"
            required
          />
          <button type="submit" className="newsletter-btn">
            Subscribe
          </button>
        </form>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="contact-info reveal">
          <h2>Get in Touch</h2>
          <div className="contact-details">
            <div className="contact-item">
              <p className="contact-label">Email</p>
              <p className="contact-value">
                <a href="mailto:groovyclothingph@gmail.com">groovyclothingph@gmail.com</a>
              </p>
            </div>
            <div className="contact-item">
              <p className="contact-label">Phone</p>
              <p className="contact-value">
                <a href="tel:+639171234567">+63 917 123 4567</a>
              </p>
            </div>
            <div className="contact-item">
              <p className="contact-label">Location</p>
              <p className="contact-value">Manila, Philippines</p>
            </div>
          </div>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="TikTok">
              <svg viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
