import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nivi Organics | Premium Natural Skincare",
  description: "High-end natural skincare, essential oils, and organic powders.",
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
