"use client";

import { use } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UserProvider } from "@/lib/user-context";
import { TOPICS } from "@/lib/question-generator";

const gradeInfo = {
  5: {
    color: "bg-grade-5",
    lightColor: "bg-grade-5/10",
    textColor: "text-grade-5",
    title: "5. Sinif Matematik",
    description:
      "Bu sinifta dogal sayilar, kesirler ve temel dort islem konularini ogreneceksin. Matematik temellerin burada atiliyor!",
  },
  6: {
    color: "bg-grade-6",
    lightColor: "bg-grade-6/10",
    textColor: "text-grade-6",
    title: "6. Sinif Matematik",
    description:
      "Tam sayilar, oran-oranti ve cebirin temelleri bu sinifta ogreniliyor. OBEB ve OKEK konularina hakim ol!",
  },
  7: {
    color: "bg-grade-7",
    lightColor: "bg-grade-7/10",
    textColor: "text-grade-7",
    title: "7. Sinif Matematik",
    description:
      "Denklemler, yuzde hesaplamalari ve geometri bu sinifin temel konulari. Cember ve daire problemlerini coz!",
  },
  8: {
    color: "bg-grade-8",
    lightColor: "bg-grade-8/10",
    textColor: "text-grade-8",
    title: "8. Sinif Matematik",
    description:
      "Liseye hazirlik sinifi! Uslu sayilar, karekok, denklem sistemleri ve Pitagor teoremi seni bekliyor.",
  },
};

export default function SinifPage({
  params,
}: {
  params: Promise<{ sinif: string }>;
}) {
  const resolvedParams = use(params);
  const grade = parseInt(resolvedParams.sinif) as 5 | 6 | 7 | 8;

  if (![5, 6, 7, 8].includes(grade)) {
    return (
      <UserProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Sinif Bulunamadi
              </h1>
              <p className="text-muted-foreground mb-8">
                Aradiginiz sinif mevcut degil.
              </p>
              <Link
                href="/siniflar"
                className="rounded-xl bg-primary px-6 py-3 text-primary-foreground font-semibold"
              >
                Siniflara Don
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </UserProvider>
    );
  }

  const info = gradeInfo[grade];
  const topics = TOPICS[grade];

  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Header */}
          <div className={`${info.color} py-12`}>
            <div className="container mx-auto px-4">
              <Link
                href="/siniflar"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Tum Siniflar
              </Link>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">{grade}</span>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {info.title}
                  </h1>
                  <p className="text-white/80 max-w-2xl">{info.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">Konular</h2>
              <Link
                href={`/oyunlar/quiz?sinif=${grade}`}
                className={`px-6 py-2 rounded-xl ${info.color} text-white font-medium hover:opacity-90 transition-opacity`}
              >
                Tum Konular Quiz
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic, index) => (
                <div
                  key={topic.id}
                  className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className={`${info.lightColor} p-6`}>
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center text-white font-bold`}
                      >
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {topic.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/sinif/${grade}/${topic.id}`}
                        className="w-full py-3 rounded-xl border-2 border-border text-foreground font-medium text-center hover:bg-muted transition-colors"
                      >
                        Konu Anlatimi
                      </Link>
                      <Link
                        href={`/oyunlar/quiz?sinif=${grade}&konu=${topic.id}`}
                        className={`w-full py-3 rounded-xl ${info.color} text-white font-medium text-center hover:opacity-90 transition-opacity`}
                      >
                        Quiz Baslat
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href={`/oyunlar/hiz-testi?sinif=${grade}`}
                className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-warning/20 text-warning mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-7 h-7"
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
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Hiz Testi
                </h3>
                <p className="text-sm text-muted-foreground">
                  Zamanla yaris, hizli cevap ver!
                </p>
              </Link>

              <Link
                href={`/oyunlar/eslestirme?sinif=${grade}`}
                className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-success/20 text-success mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-7 h-7"
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
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Eslestirme Oyunu
                </h3>
                <p className="text-sm text-muted-foreground">
                  Soru ve cevaplari eslestir!
                </p>
              </Link>

              <Link
                href={`/oyunlar/duello?sinif=${grade}`}
                className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-secondary/20 text-secondary mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  2 Kisilik Duello
                </h3>
                <p className="text-sm text-muted-foreground">
                  Arkadasinla yaris!
                </p>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}
