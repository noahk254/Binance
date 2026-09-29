import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Binance | Digital Asset Exchange",
  description: "Digital asset exchange interface",
  icons: {
    icon: "/vercel.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="stylesheet" href="https://site-assets.fontawesome.com/releases/v6.4.0/css/all.css" />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
