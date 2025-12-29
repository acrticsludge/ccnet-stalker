import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";
import Footer from "./Footer";
import BackgroundImage from "./BackgroundImage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CCNet Stalker",
  description: "CCNet Nations upkeep data and analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Background */}
        <BackgroundImage />

        {/* Navbar */}
        <NavBar />

        {/* CENTERING HAPPENS HERE */}
        <main className="flex-1 flex items-center justify-center">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
