import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Órbita 180 | Plataforma de Inteligência Empreendedora",
  description: "Gestão completa de ecossistemas, instituições e startups.",
};

import DashboardLayout from "@/components/layout/DashboardLayout";
import { AuthProvider } from "@/context/AuthContext";
import AppWrapper from "@/components/layout/AppWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body>
        <AuthProvider>
          <AppWrapper>
            {children}
          </AppWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
