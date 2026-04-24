import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer";
import Header from "./components/header";
import InitialLoader from "./components/initial-loader";

const SOCIAL_PROFILES = [
  "https://www.instagram.com/groovyph_/",
  "https://www.facebook.com/groovyclothing4400",
];

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.groovyph.com"),
  title: {
    default: "Groovy Clothing | Minimalist Streetwear & Clean Apparel Naga City",
    template: "%s | Groovy Clothing",
  },
  description:
    "Shop Groovy: The premier minimalist streetwear brand from Naga City, Philippines. Since 2019, we've crafted clean clothing inspired by creativity and lived experiences. Step out of your comfort zone with our latest apparel.",
  keywords: [
    "Groovy clothing",
    "Naga City clothing brand",
    "streetwear Philippines",
    "minimalist streetwear",
    "clean clothing aesthetic",
    "local brand Naga City",
    "Groovy PH",
    "Bicol Streetwear",
    "Bicol Clothing",
    "Camarines Sur Clothing",
    "Joma Magno",
    "POMAN",
    "Local Clothing",
    "Aesthetic",
    "Aesthetic clothing brand",
    "local brand bicol",
    "local brand philippines",
    "RichBoyz",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Groovy | Naga City",
    description:
      "Authentic streetwear from Naga City. Shop clean designs and minimalist apparel designed for those stepping out of their comfort zone.",
    url: "https://www.groovyph.com",
    siteName: "Groovy Clothing",
    locale: "en_PH",
    type: "website",
    images: [
      {
        url: "/assets/groovy-logo.svg",
        width: 1200,
        height: 630,
        alt: "Groovy Clothing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Groovy Clothing | Minimalist Streetwear & Clean Apparel Naga City",
    description:
      "Shop Groovy: the minimalist streetwear brand from Naga City, Philippines.",
    images: ["/assets/groovy-logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "facebook:app_id": "groovyclothing4400",
    "instagram:profile": "groovyph_",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Groovy Clothing",
              url: "https://www.groovyph.com",
              logo: "https://www.groovyph.com/assets/groovy-logo.svg",
              sameAs: SOCIAL_PROFILES,
            }),
          }}
        />
        <InitialLoader />
        <Header />
        <main className="site-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
