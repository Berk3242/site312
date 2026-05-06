"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UserProvider } from "@/lib/user-context";

const singlePlayerGames = [
  {
    id: "quiz",
    title: "Quiz Yarışması",
    description: "10 soru cevapla, puan kazan! Her doğru cevap sana puan kazandırır.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "bg-primary",
    href: "/oyunlar/quiz",
  },
  {
    id: "hiz-testi",
    title: "Hız Testi",
    description: "60 saniyede kaç soru cevaplayabilirsin? Zamanla yarış!",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "bg-warning",
    href: "/oyunlar/hiz-testi",
  },
  {
    id: "eslestirme",
    title: "Eşleştirme Oyunu",
    description: "Soru ve cevapları doğru şekilde eşleştir. Hafıza ve matematik bir arada!",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    ),
    color: "bg-success",
    href: "/oyunlar/eslestirme",
  },
];

const multiPlayerGames = [
  {
    id: "duello",
    title: "2 Kişilik Düello",
    description: "Arkadaşınla aynı bilgisayarda yarış! Kim daha hızlı cevaplıyor?",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: "bg-secondary",
    href: "/oyunlar/duello",
  },
  {
    id: "yaris",
    title: "Matematik Yarışı",
    description: "İki oyuncu, bir yarış! İlk 10 puana ulaşan kazanır.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "bg-accent",
    href: "/oyunlar/yaris",
  },
];

export default function OyunlarPage() {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Oyun Modları
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Matematik pratiği yapmanın en eğlenceli yolu! Tek başına veya arkadaşınla oyna.
              </p>
            </div>

            {/* Single Player Games */}
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Tek Kişilik Oyunlar
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {singlePlayerGames.map((game) => (
                  <Link
                    key={game.id}
                    href={game.href}
                    className="group rounded-2xl border border-border bg-card p-6 hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <div className={`w-16 h-16 rounded-2xl ${game.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      {game.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {game.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {game.description}
                    </p>
                    <div className="mt-4 text-primary font-medium group-hover:translate-x-1 transition-transform">
                      Oyna &rarr;
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Multi Player Games */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Çift Kişilik Oyunlar
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {multiPlayerGames.map((game) => (
                  <Link
                    key={game.id}
                    href={game.href}
                    className="group rounded-2xl border border-border bg-card p-6 hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-2xl ${game.color} text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        {game.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          {game.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {game.description}
                        </p>
                        <div className="mt-4 text-primary font-medium group-hover:translate-x-1 transition-transform">
                          Oyna &rarr;
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Grade Selection */}
            <section className="mt-16 rounded-2xl bg-muted/50 p-8">
              <h2 className="text-xl font-bold text-foreground mb-4 text-center">
                Sınıfına Göre Oyna
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[5, 6, 7, 8].map((grade) => {
                  const colors = {
                    5: "bg-grade-5 hover:bg-grade-5/90",
                    6: "bg-grade-6 hover:bg-grade-6/90",
                    7: "bg-grade-7 hover:bg-grade-7/90",
                    8: "bg-grade-8 hover:bg-grade-8/90",
                  };
                  return (
                    <Link
                      key={grade}
                      href={`/oyunlar/quiz?sinif=${grade}`}
                      className={`${colors[grade as keyof typeof colors]} text-white rounded-xl py-4 text-center font-bold text-lg transition-colors`}
                    >
                      {grade}. Sınıf
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}
