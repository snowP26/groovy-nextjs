"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const ITEMS = [
  {
    name: "Embroidered Longsleeves",
    category: "Metamorphosis",
    tag: "Tops",
    slug: "embroidered-longsleeves",
    image: "/assets/longsleeve/2.jpg",
    alt: "Embroidered Longsleeves",
  },
  {
    name: "Graphic Tee",
    category: "Metamorphosis",
    tag: "Tops",
    slug: "graphic-tee",
    image: "/assets/shop-black-1.jpg",
    alt: "Graphic Tee Black",
  },
  {
    name: "Embroidered Tee",
    category: "Metamorphosis",
    tag: "Tops",
    slug: "embroidered-tee",
    image: "/assets/embroid/1.jpg",
    alt: "Embroidered Tee",
  },
  {
    name: "Plaid Longsleeves Polo",
    category: "Metamorphosis",
    tag: "Tops",
    slug: "plaid-polo",
    image: "/assets/plaid/1.jpg",
    alt: "Plaid Longsleeves Polo",
  },
];

export default function CollectionPage() {

  useEffect(() => {
    const rafId = 0;

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

    const magneticListeners: Array<{
      element: HTMLElement;
      move: EventListener;
      leave: EventListener;
    }> = [];
    document.querySelectorAll<HTMLElement>(".btn").forEach((button) => {
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
      window.cancelAnimationFrame(rafId);
      revealObserver.disconnect();
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
        <Typography
          color="text.primary"
          sx={{
            fontWeight: 700,
            textDecoration: "underline",
            textUnderlineOffset: "0.18em",
          }}
        >
          Collection
        </Typography>
      </Breadcrumbs>

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
          {ITEMS.map((item, index) => (
            <Link key={`${item.slug}-${index}`} href={`/collection/${item.slug}`} className="collection-item reveal">
              <div className="collection-item-image">
                <Image src={item.image} alt={item.alt} width={600} height={600} quality={80} sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="collection-info">
                <div className="collection-info-text">
                  <h3 className="collection-name">{item.name}</h3>
                  <p className="collection-category">{item.category}</p>
                </div>
                <span className="collection-info-arrow" aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
