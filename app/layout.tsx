import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";
import Footer from "./Footer";
import BackgroundImage from "./BackgroundImage";
import { AuthProvider, useUser } from "./context/AuthProvider";
import { Analytics } from "@vercel/analytics/next";
import { ReactLenis } from "lenis/react";

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
    <>
      <ReactLenis
        root
        options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}
      >
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
          >
            <AuthProvider>
              {/* Background */}
              <BackgroundImage />

              {/* Navbar */}
              <NavBar />

              {/* CENTERING HAPPENS HERE */}
              <main className="flex-1 flex items-center justify-center pt-20 pb-20">
                {children}
                <Analytics />
              </main>

              {/* Footer */}
              <Footer />
            </AuthProvider>
          </body>
        </html>
      </ReactLenis>
    </>
  );
}
