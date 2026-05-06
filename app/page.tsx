"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UserProvider } from "@/lib/user-context";

const grades = [
  {
    grade: 5,
    color: "bg-grade-5",
    topics: ["Doğal Sayılar", "Kesirler", "Çarpma-Bölme"],
  },
  {
    grade: 6,
    color: "bg-grade-6",
    topics: ["Tam Sayılar", "Oran-Orantı", "OBEB-OKEK"],
  },
  {
    grade: 7,
    color: "bg-grade-7",
    topics: ["Yüzde", "Denklemler", "Çember-Daire"],
  },
  {
    grade: 8,
    color: "bg-grade-8",
    topics: ["Üslü Sayılar", "Karekök", "Pisagor"],
  },
];

const gameTypes = [
  {
    id: "quiz",
    title: "Quiz Yarışması",
    description: "Soruları doğru cevapla ve puan kazan!",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    href: "/oyunlar/quiz",
  },
  {
    id: "hiz",
    title: "Hız Testi",
    description: "Zamanla yarış, en hızlı sen ol!",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    href: "/oyunlar/hiz-testi",
  },
  {
    id: "eslestirme",
    title: "Eşleştirme",
    description: "Soru ve cevapları eşleştir!",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16m-7 6h7"
        />
      </svg>
    ),
    href: "/oyunlar/eslestirme",
  },
  {
    id: "duello",
    title: "2 Kişilik Düello",
    description: "Arkadaşınla yarış, kim daha iyi?",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    href: "/oyunlar/duello",
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Matematik Öğrenmek{" "}
              <span className="text-primary">Hiç Bu Kadar</span>{" "}
              <span className="text-secondary">Eğlenceli</span> Olmamıştı!
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 text-pretty">
              5, 6, 7 ve 8. sınıf matematik konularını interaktif oyunlarla
              öğren. Tek başına ya da arkadaşınla birlikte oyna!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/siniflar"
                className="rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
              >
                Hemen Başla
              </Link>
              <Link
                href="/oyunlar"
                className="rounded-2xl border-2 border-primary px-8 py-4 text-lg font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Oyunları Keşfet
              </Link>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Animated math symbols */}
              <div className="absolute top-0 left-1/4 text-6xl font-bold text-primary/20 animate-float">
                +
              </div>
              <div
                className="absolute top-1/4 right-0 text-5xl font-bold text-secondary/20 animate-float"
                style={{ animationDelay: "0.5s" }}
              >
                x
              </div>
              <div
                className="absolute bottom-1/4 left-0 text-5xl font-bold text-accent/20 animate-float"
                style={{ animationDelay: "1s" }}
              >
                =
              </div>
              <div
                className="absolute bottom-0 right-1/4 text-6xl font-bold text-success/20 animate-float"
                style={{ animationDelay: "1.5s" }}
              >
                /
              </div>

              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl animate-pulse-scale">
                  <span className="text-7xl md:text-8xl font-bold text-white">
                    M
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GradesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sınıfını Seç
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Her sınıf seviyesine uygun konular ve sorular seni bekliyor
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {grades.map((item) => (
            <Link
              key={item.grade}
              href={`/sinif/${item.grade}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div
                className={`absolute top-0 right-0 w-24 h-24 ${item.color} rounded-bl-[100px] opacity-20 group-hover:opacity-30 transition-opacity`}
              />
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${item.color} text-white text-2xl font-bold mb-4`}
              >
                {item.grade}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {item.grade}. Sınıf
              </h3>
              <ul className="space-y-1">
                {item.topics.map((topic) => (
                  <li key={topic} className="text-sm text-muted-foreground">
                    {topic}
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                Konuları Gör &rarr;
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function GamesSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Oyun Türleri
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Farklı oyun modlarıyla matematik pratiği yap
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gameTypes.map((game) => (
            <Link
              key={game.id}
              href={game.href}
              className="group rounded-2xl border border-border bg-card p-6 hover:shadow-xl transition-all hover:-translate-y-1 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {game.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {game.title}
              </h3>
              <p className="text-sm text-muted-foreground">{game.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "20+", label: "Farklı Konu" },
    { value: "Sonsuz", label: "Soru Çeşidi" },
    { value: "4", label: "Oyun Modu" },
    { value: "4", label: "Sınıf Seviyesi" },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-white/80 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "Algoritmik Sorular",
      description:
        "Sorular otomatik olarak üretilir, her seferinde farklı sorularla karşılaşırsın!",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      title: "İlerleme Takibi",
      description:
        "Tüm başarılarını ve ilerlemenizi profilinde görebilirsin.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "Çift Kişilik Modlar",
      description:
        "Arkadaşınla aynı bilgisayarda yarışın, kim daha iyi matematikte?",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Neden Proje: Math?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <GradesSection />
          <GamesSection />
          <StatsSection />
          <FeaturesSection />
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}
