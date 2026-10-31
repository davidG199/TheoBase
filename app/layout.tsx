import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader, Space_Grotesk } from "next/font/google";
import "./globals.css";


const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "TheoBase — Línea del tiempo bíblica",
  description: "Explora la historia bíblica y el mundo a través del tiempo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} ${inter.variable} ${newsreader.variable}`}>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
