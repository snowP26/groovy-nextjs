export const metadata = { title: "Under Maintenance — Groovy" };

export default function MaintenancePage() {
    return (
        <div className="maintenance-page">
            <div className="maintenance-inner">
                <p className="maintenance-eyebrow">Groovy.</p>
                <h1 className="maintenance-heading">We&apos;ll be<br />back soon.</h1>
                <p className="maintenance-body">
                    Something good is coming. We&apos;re working on it.
                </p>
                <div className="maintenance-building">
                    <span className="maintenance-building-dot" aria-hidden="true" />
                    Building the new site
                </div>
                <div className="maintenance-divider" />
                <p className="maintenance-contact">
                    Questions? Reach us at{" "}
                    <a href="mailto:shop@groovyph.com" className="maintenance-link">
                        shop@groovyph.com
                    </a>
                </p>
            </div>
        </div>
    );
}
