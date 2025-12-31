import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";
import Footer from "./Footer";
import BackgroundImage from "./BackgroundImage";
import { AuthProvider, useUser } from "./context/AuthProvider";

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
        <AuthProvider>
          {/* Background */}
          <BackgroundImage />

          {/* Navbar */}
          <NavBar />

          {/* CENTERING HAPPENS HERE */}
          <main className="flex-1 flex items-center justify-center pt-20">
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
