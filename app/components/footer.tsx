"use client";

import { usePathname } from "next/navigation";
import { InstagramIcon, FacebookIcon, TiktokIcon } from "./social-icons";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/checkout")) return null;

  return (
    <footer className="footer">
      <a href="/" className="footer-logo">Groovy.</a>
      <p className="footer-copy">&copy; 2019 Groovy. All rights reserved.</p>
      <div className="footer-meta">
        <div className="social-links">
          <a
            href="https://www.instagram.com/groovyph_/"
            className="social-link"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://www.facebook.com/groovyclothing4400"
            className="social-link"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon />
          </a>
          <a
            href="https://www.tiktok.com/@groovyph"
            className="social-link"
            aria-label="TikTok"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TiktokIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
