import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Répartition des tâches — Classe primaire",
  description: "Gérez les tâches de la classe : balai, chaises, collation… Calendrier jour par jour.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-classe-mint/30 antialiased">{children}</body>
    </html>
  );
}
