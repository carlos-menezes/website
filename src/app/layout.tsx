import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  weight: ["400", "700"],
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
    <html lang="en" className={cn("dark")}>
      <body
        className={`${inter.className} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <Analytics />
        <div className="px-8 max-w-3xl mx-auto my-24">{children}</div>
      </body>
    </html>
  );
}
