import type { Metadata } from "next";
import "./globals.css";
import { COMPANY_INFO } from "@/data/content";

export const metadata: Metadata = {
  title: "Perfect Printers | Professional Offset Printing in Sangli & Miraj",
  description:
    "Perfect Printers provides professional offset printing solutions in Miraj and Sangli with 20+ years of industry experience. Discover multicolor printing, Met-Pet printing, UV drip-off coating and Thermal CTP solutions.",
  keywords: [
    "Offset Printing in Sangli",
    "Offset Printing in Miraj",
    "Printing Services in Sangli",
    "Commercial Printing in Sangli",
    "Offset Printer in Miraj",
    "Printing Company in Sangli Miraj Kupwad",
    "Met-Pet Printing Sangli",
    "UV Drip-off Coating Miraj",
    "Thermal CTP Miraj MIDC",
    "Packaging Box Printing Sangli",
  ],
  authors: [{ name: "Perfect Printers" }],
  creator: "Perfect Printers",
  publisher: "Perfect Printers",
  metadataBase: new URL("https://perfectprintersmiraj.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Perfect Printers | Professional Offset Printing in Sangli & Miraj",
    description:
      "Precision Offset Printing, Met-Pet Printing, UV Drip-Off Coating & Thermal CTP in MIDC Miraj, Sangli. 20+ Years Experience.",
    url: "https://perfectprintersmiraj.com",
    siteName: "Perfect Printers",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Perfect Printers - Commercial Offset Press & Packaging Miraj",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perfect Printers | Professional Offset Printing in Sangli & Miraj",
    description:
      "Precision Offset Printing, Met-Pet, UV Drip-Off & Thermal CTP in Miraj MIDC. 20+ Years Experience.",
    images: ["https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1200&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": COMPANY_INFO.name,
  "image": "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1200&auto=format&fit=crop",
  "telephone": COMPANY_INFO.phone,
  "url": "https://perfectprintersmiraj.com",
  "priceRange": "₹₹",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "MIDC Industrial Area",
    "addressLocality": "Miraj, Sangli Miraj Kupwad",
    "addressRegion": "Maharashtra",
    "postalCode": "416410",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 16.832478,
    "longitude": 74.639148
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "20:30"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": COMPANY_INFO.googleRating,
    "reviewCount": COMPANY_INFO.reviewCount,
    "bestRating": "5",
    "worstRating": "1"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Commercial Printing Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Met-Pet Printing",
          "description": "Premium Met-Pet printing solutions for applications that require a distinctive metallic appearance and high visual impact."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "UV Drip-Off Coating",
          "description": "Advanced UV drip-off coating that adds contrast, depth and a premium finish to printed materials."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Multicolor Printing",
          "description": "High-quality multicolor printing with precise reproduction, vibrant results and consistent output."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Thermal CTP",
          "description": "Thermal Computer-to-Plate technology supporting accurate plate production and reliable print quality."
        }
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#070A0F] text-slate-100 min-h-screen flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
