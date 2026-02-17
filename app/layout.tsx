import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Répartition des tâches — Classe primaire",
  description: "Gérez les tâches de la classe : balai, chaises, collation… Calendrier jour par jour.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={nunito.variable}>
      <body className="min-h-screen bg-classe-mint/40 font-sans text-lg antialiased">
        {children}
      </body>
    </html>
  );
}
