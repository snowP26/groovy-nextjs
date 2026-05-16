export const metadata = { title: "Under Maintenance — Groovy" };

export default function MaintenancePage() {
    return (
        <main style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            textAlign: "center",
            padding: "2rem",
            fontFamily: "inherit",
        }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
                We&apos;ll be back soon.
            </h1>
            <p style={{ fontSize: "1rem", color: "#666" }}>
                Groovy is currently under maintenance. Check back shortly.
            </p>
        </main>
    );
}
