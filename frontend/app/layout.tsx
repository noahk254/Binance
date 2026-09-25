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
      <body className="min-h-full">{children}</body>
    </html>
  );
}
