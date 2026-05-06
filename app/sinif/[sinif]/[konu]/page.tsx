"use client";

import { use } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UserProvider } from "@/lib/user-context";
import { TOPICS } from "@/lib/question-generator";

const topicExplanations: Record<string, Record<string, { title: string; content: string[]; examples: { question: string; solution: string }[]; tips: string[] }>> = {
  "5": {
    toplama: {
      title: "Toplama Islemi",
      content: [
        "Toplama, iki veya daha fazla sayiyi birlestirerek tek bir sayi elde etme islemidir.",
        "Toplama isleminde sirasi degisen sayilarin toplami degismez. Bu kurala degisme ozelligi denir.",
        "Bir sayiya sifir ekledigimizde sayi degismez. Bu kurala etkisiz eleman denir.",
      ],
      examples: [
        { question: "234 + 567 = ?", solution: "Birler basamagindan basla: 4+7=11, 1 yaz 1 akilda. Onlar: 3+6+1=10, 0 yaz 1 akilda. Yuzler: 2+5+1=8. Sonuc: 801" },
        { question: "1.456 + 2.789 = ?", solution: "Basamak basamak topla: 6+9=15, 5+8+1=14, 4+7+1=12, 1+2+1=4. Sonuc: 4.245" },
      ],
      tips: [
        "Toplama yaparken basamak degerlerini alt alta hizala",
        "Saga dogru birler basamagindan basla",
        "10 veya daha buyuk ciktiginda elde var demektir",
      ],
    },
    cikarma: {
      title: "Cikarma Islemi",
      content: [
        "Cikarma, bir sayidan baska bir sayiyi alma islemidir.",
        "Cikarma isleminde buyuk sayidan kucuk sayi cikarilir.",
        "Cikarilan sayi, cikan sayidan buyukse basamak odunc alinir.",
      ],
      examples: [
        { question: "523 - 267 = ?", solution: "Birler: 3-7 yapamayz, onlardan 1 al. 13-7=6. Onlar: 1-6 yapamayz, yuzlerden 1 al. 11-6=5. Yuzler: 4-2=2. Sonuc: 256" },
        { question: "1.000 - 456 = ?", solution: "Sifirlardan odunc almak icin en soldan basla. Sonuc: 544" },
      ],
      tips: [
        "Cikarma yaparken de basamaklari hizala",
        "Odunc alirken bir ust basamaktan 10 alirsin",
        "Sonucu toplama ile kontrol edebilirsin",
      ],
    },
    carpma: {
      title: "Carpma Islemi",
      content: [
        "Carpma, bir sayiyi belli bir kez toplama islemidir.",
        "3 x 4 demek, 3'u 4 kez toplamak demektir: 3+3+3+3=12",
        "Carpma isleminde siralama sonucu degistirmez: 3x4 = 4x3",
      ],
      examples: [
        { question: "23 x 4 = ?", solution: "23'u 4 ile carp: 3x4=12, 2 yaz 1 elde. 2x4=8+1=9. Sonuc: 92" },
        { question: "15 x 12 = ?", solution: "15x2=30, 15x10=150. 30+150=180" },
      ],
      tips: [
        "Carpim tablosunu ezberle, islemler hizlanir",
        "Iki basamakli carpmada parcalara ayir",
        "Carpma toplama ile kontrol edilebilir",
      ],
    },
    bolme: {
      title: "Bolme Islemi",
      content: [
        "Bolme, bir sayinin kac esit parcaya ayrilabilecegini gosterir.",
        "12 : 3 = 4 demek, 12 tane nesneyi 3 gruba bolerken her grupta 4 tane olur.",
        "Bolme islemi carpmanin tersidir.",
      ],
      examples: [
        { question: "144 : 12 = ?", solution: "12 x ? = 144. 12 x 12 = 144. Sonuc: 12" },
        { question: "85 : 5 = ?", solution: "80:5=16, 5:5=1. 16+1=17. Sonuc: 17" },
      ],
      tips: [
        "Bolunen, bolen ve bolume dikkat et",
        "Kalanli bolmede kalan bolenden kucuk olmali",
        "Sonucu carpma ile kontrol et",
      ],
    },
    kesirToplama: {
      title: "Kesirlerle Toplama",
      content: [
        "Kesir, bir butunun esit parcalarindan birini gosterir.",
        "Kesirde ust kisma pay, alt kisma payda denir.",
        "Ayni paydali kesirleri toplarken sadece paylar toplanir.",
      ],
      examples: [
        { question: "2/5 + 1/5 = ?", solution: "Paydalar ayni, paylari topla: 2+1=3. Sonuc: 3/5" },
        { question: "3/8 + 2/8 = ?", solution: "Paydalar ayni: 3+2=5. Sonuc: 5/8" },
      ],
      tips: [
        "Ayni paydali kesirlerde sadece paylari topla",
        "Payda degismez",
        "Sonucu sadeslestirmeyi unutma",
      ],
    },
  },
  "6": {
    tamSayiToplama: {
      title: "Tam Sayilarla Toplama",
      content: [
        "Tam sayilar pozitif, negatif sayilar ve sifirdan olusur.",
        "Ayni isaretli sayilari toplarken isaret ayni kalir, mutlak degerler toplanir.",
        "Farkli isaretli sayilari toplarken mutlak degeri buyuk olanin isareti alinir.",
      ],
      examples: [
        { question: "(-5) + (-3) = ?", solution: "Iki negatif: mutlak degerler toplanir. 5+3=8, isaret negatif. Sonuc: -8" },
        { question: "7 + (-4) = ?", solution: "Farkli isaret: 7-4=3. 7 daha buyuk, pozitif. Sonuc: 3" },
      ],
      tips: [
        "Sayi dogrusu uzerinde dusun",
        "Negatif sayi eklemek sola, pozitif saga gitmek",
        "Mutlak deger her zaman pozitiftir",
      ],
    },
    tamSayiCarpma: {
      title: "Tam Sayilarla Carpma",
      content: [
        "Ayni isaretli sayilarin carpimi pozitiftir.",
        "Farkli isaretli sayilarin carpimi negatiftir.",
        "Sifir ile carpim her zaman sifirdir.",
      ],
      examples: [
        { question: "(-4) x (-3) = ?", solution: "Iki negatif carpimi pozitif: 4x3=12. Sonuc: 12" },
        { question: "5 x (-6) = ?", solution: "Bir pozitif bir negatif: sonuc negatif. 5x6=30. Sonuc: -30" },
      ],
      tips: [
        "Isaret kurali: ++ veya -- = +",
        "Isaret kurali: +- veya -+ = -",
        "Once isareti belirle, sonra carpim yap",
      ],
    },
    oran: {
      title: "Oran ve Oranti",
      content: [
        "Oran, iki nicelik arasindaki iliskiyi gosterir.",
        "a/b seklinde yazilir ve 'a nin b ye orani' olarak okunur.",
        "Oranti, iki oranin esitligidir: a/b = c/d",
      ],
      examples: [
        { question: "2/3 oraninda, 2 yerine 8 yazilirsa 3 yerine ne yazilir?", solution: "2 x 4 = 8, o halde 3 x 4 = 12. Sonuc: 12" },
        { question: "5 kalemin fiyati 30 TL ise 8 kalem kac TL?", solution: "1 kalem = 6 TL. 8 kalem = 48 TL" },
      ],
      tips: [
        "Oran problemlerinde orantiya dikkat et",
        "Ters orantiyi karistirma",
        "Birim fiyat bulmak kolaylastirir",
      ],
    },
    obeb: {
      title: "OBEB (Ortak Bolen En Buyugu)",
      content: [
        "OBEB, iki veya daha fazla sayinin ortak bolenlerinden en buyugudur.",
        "OBEB bulmak icin sayilari asil carpanlara ayir.",
        "Ortak asil carpanlarin en kucuk kuvvetlerini carp.",
      ],
      examples: [
        { question: "OBEB(12, 18) = ?", solution: "12 = 2² x 3, 18 = 2 x 3². Ortak: 2 ve 3. OBEB = 2 x 3 = 6" },
        { question: "OBEB(24, 36) = ?", solution: "24 = 2³ x 3, 36 = 2² x 3². Ortak minimum: 2² x 3 = 12" },
      ],
      tips: [
        "Asil carpanlara ayirmayi ogren",
        "Ortak olanlarin en kucugunu al",
        "OBEB her zaman sayilarin boludur",
      ],
    },
    okek: {
      title: "OKEK (Ortak Kat En Kucugu)",
      content: [
        "OKEK, iki veya daha fazla sayinin ortak katlarindan en kucugudur.",
        "OKEK bulmak icin asil carpanlarin en buyuk kuvvetlerini al.",
        "OBEB x OKEK = iki sayinin carpimi",
      ],
      examples: [
        { question: "OKEK(4, 6) = ?", solution: "4 = 2², 6 = 2 x 3. En buyuk kuvvetler: 2² x 3 = 12" },
        { question: "OKEK(8, 12) = ?", solution: "8 = 2³, 12 = 2² x 3. OKEK = 2³ x 3 = 24" },
      ],
      tips: [
        "OKEK her iki sayiya da bolunebilir",
        "OKEK, OBEB ten buyuk veya esittir",
        "Kesir paydasi bulmada kullanilir",
      ],
    },
  },
  "7": {
    yuzde: {
      title: "Yuzde Hesaplama",
      content: [
        "Yuzde, bir sayinin yuzde birinin kac katini ifade eder.",
        "%50 demek, 100 un 50 si, yani yarisi demektir.",
        "Yuzde bulmak icin: Sayi x Yuzde / 100",
      ],
      examples: [
        { question: "200 un %25 i kac?", solution: "200 x 25 / 100 = 50" },
        { question: "80 in %15 i kac?", solution: "80 x 15 / 100 = 12" },
      ],
      tips: [
        "%100 sayinin kendisidir",
        "%50 sayinin yarisidir",
        "%10 sayinin onda biri, virgulu sola kaydir",
      ],
    },
    denklem: {
      title: "Denklem Cozme",
      content: [
        "Denklem, esitlik iceren matematiksel ifadedir.",
        "Denklem cozmek, bilinmeyen degeri bulmaktir.",
        "Her iki tarafa ayni islemi uygulayarak cozulur.",
      ],
      examples: [
        { question: "3x + 5 = 20, x = ?", solution: "3x = 20 - 5 = 15. x = 15 / 3 = 5" },
        { question: "2x - 4 = 10, x = ?", solution: "2x = 10 + 4 = 14. x = 14 / 2 = 7" },
      ],
      tips: [
        "Bilinmeyeni bir tarafa topla",
        "Sayilari diger tarafa tasirken isaret degisir",
        "Carpan bolen, bolen carpan olur",
      ],
    },
    cemberCevre: {
      title: "Cember ve Daire",
      content: [
        "Cember, bir noktadan esit uzakliktaki noktalarin olusturdugu kapalı egridir.",
        "Daire, cemberin ic kismidir.",
        "Cevre = 2 x pi x r, Alan = pi x r²",
      ],
      examples: [
        { question: "Yaricapi 7 cm olan cemberin cevresi?", solution: "Cevre = 2 x pi x 7 = 14pi cm (yaklasik 44 cm)" },
        { question: "Yaricapi 5 cm olan dairenin alani?", solution: "Alan = pi x 5² = 25pi cm² (yaklasik 78.5 cm²)" },
      ],
      tips: [
        "pi yaklasik 3.14 tur",
        "Cap = 2 x yaricap",
        "Alan her zaman kare birimdir",
      ],
    },
    esitsizlik: {
      title: "Esitsizlikler",
      content: [
        "Esitsizlik, iki ifadenin buyukluk iliskisini gosterir.",
        "< kucuktur, > buyuktur isaretidir.",
        "Negatif sayiyla carparken isaret yonu degisir.",
      ],
      examples: [
        { question: "2x > 8 cozum kumesi?", solution: "x > 4" },
        { question: "-3x < 9 cozum kumesi?", solution: "x > -3 (negatifle bolunce isaret degisti)" },
      ],
      tips: [
        "Denklem gibi coz ama isareti koru",
        "Negatifle carp/bol = isaret degisir",
        "Sayi dogrusunda goster",
      ],
    },
    aciHesaplama: {
      title: "Acilar",
      content: [
        "Aci, ayni noktadan cikan iki isininin olusturdugu aciklik.",
        "Tam aci 360 derece, dogru aci 180 derece, dik aci 90 derece.",
        "Butunler acilar toplami 180, tumleer acilar toplami 90 derece.",
      ],
      examples: [
        { question: "50 derecenin butunleri?", solution: "180 - 50 = 130 derece" },
        { question: "35 derecenin tumleri?", solution: "90 - 35 = 55 derece" },
      ],
      tips: [
        "Butunler = 180 derece",
        "Tumler = 90 derece",
        "Komsu acilar birbirini tamamlar",
      ],
    },
  },
  "8": {
    usluSayilar: {
      title: "Uslu Sayilar",
      content: [
        "Uslu sayi, bir sayinin kendisiyle carpimini kisa gosterir.",
        "2³ = 2 x 2 x 2 = 8 demektir.",
        "Us kurallari: a^m x a^n = a^(m+n)",
      ],
      examples: [
        { question: "3⁴ = ?", solution: "3 x 3 x 3 x 3 = 81" },
        { question: "2³ x 2² = ?", solution: "2^(3+2) = 2⁵ = 32" },
      ],
      tips: [
        "Ayni tabanli usler toplanir",
        "Us usu = usler carpilir",
        "0. kuvvet = 1",
      ],
    },
    karekok: {
      title: "Karekok",
      content: [
        "Karekok, bir sayinin karesini veren sayiyi bulma islemidir.",
        "Kare alma isleminin tersidir.",
        "Negatif sayinin karekoku yoktur (gercek sayilarda).",
      ],
      examples: [
        { question: "√81 = ?", solution: "9 x 9 = 81 oldugu icin √81 = 9" },
        { question: "√50 = ?", solution: "√50 = √(25x2) = 5√2" },
      ],
      tips: [
        "Tam kare sayilari ez ber: 1,4,9,16,25,36,49,64,81,100...",
        "Karekok carpiminda ic ice al",
        "Carpanlarinda tam kare ara",
      ],
    },
    denklemSistemi: {
      title: "Denklem Sistemleri",
      content: [
        "Iki veya daha fazla denklemin birlikte cozulmesidir.",
        "Yerine koyma ve yok etme yontemleri kullanilir.",
        "Ortak cozum her iki denklemi de saglar.",
      ],
      examples: [
        { question: "x + y = 5, x - y = 1, x ve y = ?", solution: "Toplayinca: 2x = 6, x = 3. Yerine koy: 3 + y = 5, y = 2" },
        { question: "2x + y = 7, x + y = 4", solution: "Cikar: x = 3. Yerine koy: 3 + y = 4, y = 1" },
      ],
      tips: [
        "Ayni katsayili olanlari topla/cikar",
        "Bir bilinmeyeni yok et",
        "Sonucu kontrol et",
      ],
    },
    pitagor: {
      title: "Pitagor Teoremi",
      content: [
        "Dik ucgende hipotenus karesi, dik kenarlarin karelerinin toplamidir.",
        "a² + b² = c² (c hipotenus)",
        "3-4-5, 5-12-13 gibi ucluler Pitagor uclusudur.",
      ],
      examples: [
        { question: "Dik kenarlari 3 ve 4 cm, hipotenus = ?", solution: "c² = 3² + 4² = 9 + 16 = 25, c = 5 cm" },
        { question: "Hipotenus 13, bir kenar 5, diger kenar = ?", solution: "b² = 13² - 5² = 169 - 25 = 144, b = 12" },
      ],
      tips: [
        "Hipotenus her zaman en uzun kenar",
        "Pitagor uclulerini ezberle",
        "Karekok almayı unutma",
      ],
    },
    olasilik: {
      title: "Olasilik",
      content: [
        "Olasilik, bir olayın gerceklesme ihtimalidir.",
        "P(A) = Istenen / Toplam",
        "Olasilik 0 ile 1 arasindadir.",
      ],
      examples: [
        { question: "6 kirmizi, 4 mavi bilyeden kirmizi cekme olasiligi?", solution: "P = 6/10 = 3/5" },
        { question: "Zar atinca 3 ten buyuk gelme olasiligi?", solution: "4,5,6 = 3 sayi. P = 3/6 = 1/2" },
      ],
      tips: [
        "Toplam sonuc sayisini bul",
        "Istenen sonuc sayisini say",
        "Kesri sadeslestir",
      ],
    },
  },
};

const gradeInfo = {
  5: { color: "bg-grade-5", textColor: "text-grade-5" },
  6: { color: "bg-grade-6", textColor: "text-grade-6" },
  7: { color: "bg-grade-7", textColor: "text-grade-7" },
  8: { color: "bg-grade-8", textColor: "text-grade-8" },
};

export default function KonuPage({
  params,
}: {
  params: Promise<{ sinif: string; konu: string }>;
}) {
  const resolvedParams = use(params);
  const grade = parseInt(resolvedParams.sinif) as 5 | 6 | 7 | 8;
  const topicId = resolvedParams.konu;

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

  const topics = TOPICS[grade];
  const topic = topics.find((t) => t.id === topicId);
  const explanation = topicExplanations[grade.toString()]?.[topicId];
  const info = gradeInfo[grade];

  if (!topic || !explanation) {
    return (
      <UserProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Konu Bulunamadi
              </h1>
              <Link
                href={`/sinif/${grade}`}
                className="rounded-xl bg-primary px-6 py-3 text-primary-foreground font-semibold"
              >
                Konulara Don
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </UserProvider>
    );
  }

  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Header */}
          <div className={`${info.color} py-8`}>
            <div className="container mx-auto px-4">
              <Link
                href={`/sinif/${grade}`}
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
                {grade}. Sinif
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {explanation.title}
              </h1>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Theory */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-lg ${info.color} flex items-center justify-center text-white text-sm`}>
                      1
                    </span>
                    Konu Anlatimi
                  </h2>
                  <div className="space-y-4">
                    {explanation.content.map((paragraph, index) => (
                      <p key={index} className="text-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Examples */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-lg ${info.color} flex items-center justify-center text-white text-sm`}>
                      2
                    </span>
                    Ornek Sorular
                  </h2>
                  <div className="space-y-6">
                    {explanation.examples.map((example, index) => (
                      <div
                        key={index}
                        className="rounded-xl bg-muted/50 p-4 space-y-2"
                      >
                        <p className="font-semibold text-foreground">
                          Soru {index + 1}: {example.question}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Cozum: </span>
                          {example.solution}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-lg ${info.color} flex items-center justify-center text-white text-sm`}>
                      3
                    </span>
                    Ipuclari
                  </h2>
                  <ul className="space-y-3">
                    {explanation.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className={`w-6 h-6 rounded-full ${info.color}/20 ${info.textColor} flex items-center justify-center text-sm font-medium shrink-0 mt-0.5`}>
                          {index + 1}
                        </span>
                        <span className="text-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 sticky top-20">
                  <h3 className="font-bold text-foreground mb-4">
                    Pratik Yap
                  </h3>
                  <div className="space-y-3">
                    <Link
                      href={`/oyunlar/quiz?sinif=${grade}&konu=${topicId}`}
                      className={`block w-full py-3 rounded-xl ${info.color} text-white font-semibold text-center hover:opacity-90 transition-opacity`}
                    >
                      Quiz Baslat
                    </Link>
                    <Link
                      href={`/oyunlar/hiz-testi?sinif=${grade}&konu=${topicId}`}
                      className="block w-full py-3 rounded-xl border-2 border-border text-foreground font-semibold text-center hover:bg-muted transition-colors"
                    >
                      Hiz Testi
                    </Link>
                    <Link
                      href={`/oyunlar/eslestirme?sinif=${grade}&konu=${topicId}`}
                      className="block w-full py-3 rounded-xl border-2 border-border text-foreground font-semibold text-center hover:bg-muted transition-colors"
                    >
                      Eslestirme Oyunu
                    </Link>
                  </div>

                  <hr className="my-6 border-border" />

                  <h3 className="font-bold text-foreground mb-4">
                    Diger Konular
                  </h3>
                  <ul className="space-y-2">
                    {topics
                      .filter((t) => t.id !== topicId)
                      .map((t) => (
                        <li key={t.id}>
                          <Link
                            href={`/sinif/${grade}/${t.id}`}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {t.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}
