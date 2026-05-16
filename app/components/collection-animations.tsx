"use client";

import { useEffect } from "react";

export default function CollectionAnimations() {
    useEffect(() => {
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
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
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

    return null;
}
