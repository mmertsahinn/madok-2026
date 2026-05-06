import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl = "https://madok26.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MADOK 2026 | 1. Ulusal Mehmet Akif Ersoy Diş Hekimliği Öğrenci Kongresi",
    template: "%s | MADOK 2026",
  },
  description:
    "MADOK 2026 – Burdur'da düzenlenen 1. Ulusal Mehmet Akif Ersoy Diş Hekimliği Öğrenci Kongresi. Bildiri, poster gönderimi ve kayıt için sitemizi ziyaret edin.",
  keywords: [
    "MADOK 2026",
    "diş hekimliği kongresi",
    "ulusal diş hekimliği kongresi",
    "Mehmet Akif Ersoy Üniversitesi",
    "Burdur diş hekimliği",
    "öğrenci kongresi",
    "diş hekimliği öğrenci kongresi 2026",
    "MAKÜ diş hekimliği",
    "bildiri gönderimi",
    "poster kongresi",
    "madok26",
  ],
  authors: [{ name: "MADOK 2026 Organizasyon Komitesi" }],
  creator: "MADOK 2026",
  publisher: "Mehmet Akif Ersoy Üniversitesi Diş Hekimliği Fakültesi",
  category: "Akademik Kongre",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "MADOK 2026",
    title: "MADOK 2026 | 1. Ulusal Diş Hekimliği Öğrenci Kongresi",
    description:
      "Burdur'da düzenlenen 1. Ulusal Mehmet Akif Ersoy Diş Hekimliği Öğrenci Kongresi. Bildiri ve poster gönderimi için kayıt olun.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MADOK 2026 - 1. Ulusal Diş Hekimliği Öğrenci Kongresi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MADOK 2026 | 1. Ulusal Diş Hekimliği Öğrenci Kongresi",
    description:
      "Burdur'da düzenlenen 1. Ulusal Mehmet Akif Ersoy Diş Hekimliği Öğrenci Kongresi.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "0b769927b3c28a0d",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* Google Ads – gtag.js */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18144236556"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18144236556');
          `}
        </Script>
        {/* Schema.org – Event structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: "MADOK 2026 – 1. Ulusal Mehmet Akif Ersoy Diş Hekimliği Öğrenci Kongresi",
              description:
                "Mehmet Akif Ersoy Üniversitesi Diş Hekimliği Fakültesi öğrencileri tarafından düzenlenen ulusal diş hekimliği öğrenci kongresi.",
              url: siteUrl,
              startDate: "2026-10-01",
              endDate: "2026-10-02",
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
              location: {
                "@type": "Place",
                name: "Mehmet Akif Ersoy Üniversitesi Kongre ve Sergi Salonu",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "MAKÜ Kongre ve Sergi Salonu",
                  addressLocality: "Burdur",
                  addressCountry: "TR",
                },
              },
              organizer: {
                "@type": "Organization",
                name: "MADOK 2026 Organizasyon Komitesi",
                url: siteUrl,
              },
              inLanguage: "tr",
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
