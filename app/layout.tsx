import type { Metadata, Viewport } from "next";
import { Nunito, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Proje: Math - Eğlenceli Matematik Öğrenme Platformu",
  description:
    "Ortaokul öğrencileri için interaktif matematik oyunları ve konu anlatımları. 5, 6, 7 ve 8. sınıf matematik konularını oyunlarla öğren!",
  keywords: [
    "matematik",
    "oyun",
    "eğitim",
    "ortaokul",
    "5. sınıf",
    "6. sınıf",
    "7. sınıf",
    "8. sınıf",
  ],
};

export const viewport: Viewport = {
  themeColor: "#4361ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${nunito.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
