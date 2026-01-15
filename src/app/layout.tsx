import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  weight: ["400", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  weight: ["100", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Carlos Menezes",
  authors: {
    name: "Carlos Menezes",
    url: "https://carlos-menezes.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${geistSans.variable} antialiased`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
