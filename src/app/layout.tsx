import { GoogleAnalytics } from "@next/third-parties/google";

import type { Metadata } from "next";

import Header from "@components/Header";
import Footer from "@components/Footer";

import { GTWalsheimProRegular } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dennis Acosta",
  description: "Dennis Acosta Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${GTWalsheimProRegular.variable}`}>
        <Header />
        {children}
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-MZNW38HJB7" />
    </html>
  );
}
