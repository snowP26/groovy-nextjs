"use client";

import { useEffect, useState } from "react";

const ITEMS = [
  {
    name: "Basics Tee",
    category: "Everyday Essentials",
    tag: "Basics",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80",
    alt: "Basics Tee",
  },
  {
    name: "Streetwear Set",
    category: "Urban Edge",
    tag: "Streetwear",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80",
    alt: "Streetwear Set",
  },
  {
    name: "Minimalist Coat",
    category: "Clean Lines",
    tag: "Minimalist",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    alt: "Minimalist Coat",
  },
  {
    name: "Linen Shirt",
    category: "Everyday Essentials",
    tag: "Basics",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
    alt: "Linen Shirt",
  },
  {
    name: "Cargo Trousers",
    category: "Urban Edge",
    tag: "Streetwear",
    image: "https://images.unsplash.com/photo-1584864486-a6e6ed4e6f34?w=600&q=80",
    alt: "Cargo Trousers",
  },
  {
    name: "Monochrome Knit",
    category: "Clean Lines",
    tag: "Minimalist",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
    alt: "Monochrome Knit",
  },
  {
    name: "Oversized Blazer",
    category: "Outerwear",
    tag: "Outerwear",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    alt: "Oversized Blazer",
  },
  {
    name: "Canvas Tote",
    category: "Accessories",
    tag: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    alt: "Canvas Tote",
  },
  {
    name: "Wide-Leg Pants",
    category: "Everyday Essentials",
    tag: "Basics",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    alt: "Wide-Leg Pants",
  },
];

const FILTERS = ["All", "Basics", "Streetwear", "Minimalist", "Outerwear", "Accessories"];

export default function CollectionPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? ITEMS
    : ITEMS.filter((item) => item.tag === activeFilter);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let rafId = 0;

    const loader = document.querySelector<HTMLElement>(".loader");
    const cursor = document.querySelector<HTMLElement>(".cursor");
    const nav = document.querySelector<HTMLElement>(".nav");
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

    const onMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };
    document.addEventListener("mousemove", onMouseMove);

    const animateCursor = () => {
      if (cursor) {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        cursor.style.left = `${cursorX - 10}px`;
        cursor.style.top = `${cursorY - 10}px`;
      }
      rafId = window.requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const hoverElements = document.querySelectorAll<HTMLElement>(
      "a, button, .collection-item, .filter-pill",
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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    revealElements.forEach((element) => revealObserver.observe(element));

    const anchorListeners: Array<{ element: HTMLAnchorElement; listener: EventListener }> = [];
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
      const listener = (event: Event) => {
        event.preventDefault();
        const href = anchor.getAttribute("href");
        if (!href || !href.startsWith("#") || href === "#") return;
        const target = document.querySelector<HTMLElement>(href);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      anchor.addEventListener("click", listener);
      anchorListeners.push({ element: anchor, listener });
    });

    const onScroll = () => {
      if (!nav) return;
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

    const magneticListeners: Array<{
      element: HTMLElement;
      move: EventListener;
      leave: EventListener;
    }> = [];
    document.querySelectorAll<HTMLElement>(".btn").forEach((button) => {
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
      document.removeEventListener("mousemove", onMouseMove);
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
      magneticListeners.forEach(({ element, move, leave }) => {
        element.removeEventListener("mousemove", move);
        element.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <div>
      {/* Loader */}
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
      <div className="cursor" />

      {/* Navigation */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          groovy.
        </a>
        <ul className="nav-links">
          <li>
            <a href="/#collection">Collection</a>
          </li>
          <li>
            <a href="/#story">Our Story</a>
          </li>
          <li>
            <a href="/#featured">Shop</a>
          </li>
          <li>
            <a href="/#contact">Contact</a>
          </li>
        </ul>
      </nav>

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
          <p>
            Guided by a stronger vision and a renewed sense of identity.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="collection-filters">
        <div className="filter-pills">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-pill${activeFilter === f ? " active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <select className="sort-select" aria-label="Sort by">
          <option>Sort: Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest First</option>
        </select>
      </div>

      {/* Collection Grid */}
      <div className="collection-page-body">
        <div className="collection-grid">
          {filtered.map((item) => (
            <div key={item.name} className="collection-item reveal">
              <img src={item.image} alt={item.alt} />
              <div className="collection-info">
                <h3 className="collection-name">{item.name}</h3>
                <p className="collection-category">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
