import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Club Atlético Aldosivi | Centro de Rendimiento",
  description: "Dashboard oficial de estadísticas y rendimiento del Club Atlético Aldosivi. Datos de la Liga Profesional de Fútbol (LPF) y la Asociación del Fútbol Argentino (AFA).",
  keywords: ["Aldosivi", "Liga Profesional de Fútbol", "AFA", "Estadísticas", "Fútbol Argentino", "Mar del Plata"],
  authors: [{ name: "Club Atlético Aldosivi" }],
  icons: {
    icon: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Aldosivi_logo.png",
  },
  openGraph: {
    title: "C.A. Aldosivi - Data Hub",
    description: "Centro de datos del Tiburón en la Liga Profesional de Fútbol",
    url: "https://aldosivi.com",
    siteName: "Club Atlético Aldosivi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aldosivi Data Hub",
    description: "Análisis y rendimiento LPF",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
