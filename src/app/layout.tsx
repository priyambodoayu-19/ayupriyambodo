import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ayu Priyambodo — Creative Director & Brand Identity Designer",
  description:
    "Portfolio of Ayu Priyambodo: Zero-to-one brand identity, manufacturing-ready packaging & print production, commercial art direction, and executive editorial systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${newsreader.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#141413] selection:bg-[#141413] selection:text-[#FAF9F5]">
        {children}
      </body>
    </html>
  );
}
