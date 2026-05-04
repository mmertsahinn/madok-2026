import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MADOK 2026 | Ulusal Kongre",
  description: "MADOK 2026 Ulusal Kongresi'ne hoş geldiniz. Kayıt, program ve detaylı bilgi için sitemizi ziyaret edin.",
  keywords: "MADOK, kongre, 2026, ulusal, bilimsel, konferans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        {children}
      </body>
    </html>
  );
}
