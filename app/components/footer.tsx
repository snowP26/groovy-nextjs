import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
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
    </footer>
  );
}