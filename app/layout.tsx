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
  title: "MatematikOyun - Eglenceli Matematik Ogrenme Platformu",
  description:
    "Ortaokul ogrencileri icin interaktif matematik oyunlari ve konu anlatimlari. 5, 6, 7 ve 8. sinif matematik konularini oyunlarla ogren!",
  keywords: [
    "matematik",
    "oyun",
    "egitim",
    "ortaokul",
    "5. sinif",
    "6. sinif",
    "7. sinif",
    "8. sinif",
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
