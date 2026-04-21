"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const HOME_LOADER_SEEN_KEY = "groovy-home-loader-seen";
const LOADER_DURATION_MS = 1500;

export default function InitialLoader() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (pathname !== "/") {
            setIsVisible(false);
            return;
        }

        const hasSeenLoader = window.sessionStorage.getItem(HOME_LOADER_SEEN_KEY) === "1";
        if (hasSeenLoader) {
            setIsVisible(false);
            return;
        }

        setIsVisible(true);
        const timerId = window.setTimeout(() => {
            setIsVisible(false);
            window.sessionStorage.setItem(HOME_LOADER_SEEN_KEY, "1");
        }, LOADER_DURATION_MS);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [pathname]);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="loader" role="status" aria-live="polite" aria-label="Loading">
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
    );
}
