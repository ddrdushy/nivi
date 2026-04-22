import type { Metadata } from "next";
import { SITE_URL } from "@/lib/jsonLd";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nivi Organics | Premium Natural Skincare",
    template: "%s | Nivi Organics",
  },
  description:
    "High-end natural skincare, single-origin essential oils, raw butters, and organic powders — sourced directly from nature.",
  keywords: [
    "essential oils",
    "organic skincare",
    "shea butter",
    "beeswax",
    "henna powder",
    "natural beauty",
    "Sri Lanka",
  ],
  openGraph: {
    title: "Nivi Organics",
    description:
      "Premium single-origin essential oils, raw butters, and herbal powders.",
    siteName: "Nivi Organics",
    url: SITE_URL,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nivi Organics",
    description:
      "Premium single-origin essential oils, raw butters, and herbal powders.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
