"use client";

import Link from "next/link";
import { useUser } from "@/lib/user-context";
import { useState } from "react";

export function Header() {
  const { user, isLoggedIn, logout } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
            M
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:inline">
            Proje: Math
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/siniflar"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Sınıflar
          </Link>
          <Link
            href="/oyunlar"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Oyunlar
          </Link>
          <Link
            href="/skor-tablosu"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Skor Tablosu
          </Link>
        </nav>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {isLoggedIn && user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-foreground">
                  {user.username}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user.totalScore} puan
                </span>
              </div>
              <Link
                href="/profil"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold"
              >
                {user.username[0].toUpperCase()}
              </Link>
              <button
                onClick={logout}
                className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <Link
              href="/giris"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Giriş Yap
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <span
              className={`h-0.5 w-6 bg-foreground transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`h-0.5 w-6 bg-foreground transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-6 bg-foreground transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
            <Link
              href="/siniflar"
              className="rounded-lg px-4 py-2 text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sınıflar
            </Link>
            <Link
              href="/oyunlar"
              className="rounded-lg px-4 py-2 text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Oyunlar
            </Link>
            <Link
              href="/skor-tablosu"
              className="rounded-lg px-4 py-2 text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Skor Tablosu
            </Link>
            {isLoggedIn && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="rounded-lg px-4 py-2 text-left text-muted-foreground hover:bg-muted transition-colors"
              >
                Çıkış Yap
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
