"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UserProvider } from "@/lib/user-context";
import { TOPICS } from "@/lib/question-generator";

const gradeInfo = {
  5: {
    color: "bg-grade-5",
    borderColor: "border-grade-5",
    textColor: "text-grade-5",
    description:
      "Dogal sayilar, kesirler ve temel aritmetik islemleri ogreniyoruz.",
  },
  6: {
    color: "bg-grade-6",
    borderColor: "border-grade-6",
    textColor: "text-grade-6",
    description:
      "Tam sayilar, oran-oranti ve cebire giris konularini isliyoruz.",
  },
  7: {
    color: "bg-grade-7",
    borderColor: "border-grade-7",
    textColor: "text-grade-7",
    description:
      "Denklemler, yuzde hesaplamalari ve geometri konularini ogreniyoruz.",
  },
  8: {
    color: "bg-grade-8",
    borderColor: "border-grade-8",
    textColor: "text-grade-8",
    description:
      "Uslu sayilar, karekok ve ileri matematik konularina hazirlanyoruz.",
  },
};

export default function SiniflarPage() {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Sinif Secimleri
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Kendi sinifini sec ve konulari kesfet. Her sinifta seni bekleyen
                onlarca soru ve eglenceli oyunlar var!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {([5, 6, 7, 8] as const).map((grade) => {
                const info = gradeInfo[grade];
                const topics = TOPICS[grade];

                return (
                  <div
                    key={grade}
                    className={`rounded-2xl border-2 ${info.borderColor} bg-card overflow-hidden`}
                  >
                    <div className={`${info.color} p-6`}>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                          <span className="text-4xl font-bold text-white">
                            {grade}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">
                            {grade}. Sinif
                          </h2>
                          <p className="text-white/80 text-sm">
                            {topics.length} Konu
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-muted-foreground mb-4">
                        {info.description}
                      </p>

                      <h3 className="font-semibold text-foreground mb-3">
                        Konular:
                      </h3>
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {topics.map((topic) => (
                          <Link
                            key={topic.id}
                            href={`/sinif/${grade}/${topic.id}`}
                            className="flex items-center gap-2 p-3 rounded-xl border border-border hover:bg-muted transition-colors group"
                          >
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {topic.name}
                            </span>
                          </Link>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={`/sinif/${grade}`}
                          className={`flex-1 py-3 rounded-xl ${info.color} text-white font-semibold text-center hover:opacity-90 transition-opacity`}
                        >
                          Konulara Git
                        </Link>
                        <Link
                          href={`/oyunlar/quiz?sinif=${grade}`}
                          className="flex-1 py-3 rounded-xl border-2 border-border text-foreground font-semibold text-center hover:bg-muted transition-colors"
                        >
                          Hizli Quiz
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}
