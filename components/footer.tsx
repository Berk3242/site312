import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
                M
              </div>
              <span className="text-xl font-bold text-foreground">
                MatematikOyun
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Ortaokul ogrencileri icin eglenceli ve interaktif matematik
              ogrenme platformu.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Hizli Erisim</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/siniflar"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Siniflar
                </Link>
              </li>
              <li>
                <Link
                  href="/oyunlar"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Oyunlar
                </Link>
              </li>
              <li>
                <Link
                  href="/skor-tablosu"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skor Tablosu
                </Link>
              </li>
            </ul>
          </div>

          {/* Grades */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Siniflar</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/sinif/5"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  5. Sinif
                </Link>
              </li>
              <li>
                <Link
                  href="/sinif/6"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  6. Sinif
                </Link>
              </li>
              <li>
                <Link
                  href="/sinif/7"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  7. Sinif
                </Link>
              </li>
              <li>
                <Link
                  href="/sinif/8"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  8. Sinif
                </Link>
              </li>
            </ul>
          </div>

          {/* Game Types */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Oyun Turleri</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/oyunlar?tur=tek"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tek Kisilik
                </Link>
              </li>
              <li>
                <Link
                  href="/oyunlar?tur=cift"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cift Kisilik
                </Link>
              </li>
              <li>
                <Link
                  href="/oyunlar?tur=hiz"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hiz Testi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            2024 MatematikOyun. Tum haklari saklidir.
          </p>
          <p className="text-sm font-medium text-foreground">
            Yusuf Sefa Yesil
          </p>
        </div>
      </div>
    </footer>
  );
}
