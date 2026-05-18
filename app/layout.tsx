import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Inter } from 'next/font/google';
import Footer from "./components/Footer";

import Navbar from './components/Navbar';
import { SessionProvider } from "next-auth/react";
import Providers from './components/providers';


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  });



export const metadata: Metadata = {
  title: "mon blog",
  description: "Un blog moderne avec Next.js et Prisma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="fr" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-stone-50 text-stone-900 font-body antialiased min-h-screen">
        <Providers>
          <Navbar></Navbar>
          <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>
          <Footer></Footer>
        </Providers>
      </body>
    </html>
  );
}
