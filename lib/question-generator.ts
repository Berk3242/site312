// Algoritmik Soru Ureteci - Sonsuz Soru Cesitliligi

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "kolay" | "orta" | "zor";
}

// Rastgele sayi ureteci
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Benzersiz ID ureteci
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Secenekleri karistir
function shuffleOptions(
  correct: number,
  wrongOptions: number[]
): { options: string[]; correctIndex: number } {
  const allOptions = [correct, ...wrongOptions];
  const shuffled = allOptions.sort(() => Math.random() - 0.5);
  return {
    options: shuffled.map((n) => n.toString()),
    correctIndex: shuffled.indexOf(correct),
  };
}

// OBEB hesaplama
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// OKEK hesaplama
function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

// 5. SINIF SORU URETECLERI
export const grade5Generators = {
  // Dogal Sayilarla Toplama
  toplama: (): Question => {
    const a = randomInt(100, 9999);
    const b = randomInt(100, 9999);
    const correct = a + b;
    const wrong1 = correct + randomInt(1, 100);
    const wrong2 = correct - randomInt(1, 100);
    const wrong3 = correct + randomInt(101, 500);

    const { options, correctIndex } = shuffleOptions(correct, [
      wrong1,
      wrong2,
      wrong3,
    ]);

    return {
      id: generateId(),
      question: `${a.toLocaleString("tr-TR")} + ${b.toLocaleString("tr-TR")} = ?`,
      options,
      correctAnswer: correctIndex,
      explanation: `${a.toLocaleString("tr-TR")} ile ${b.toLocaleString("tr-TR")} toplandığında ${correct.toLocaleString("tr-TR")} elde edilir.`,
      difficulty: a > 5000 ? "zor" : a > 2000 ? "orta" : "kolay",
    };
  },

  // Dogal Sayilarla Cikarma
  cikarma: (): Question => {
    const a = randomInt(1000, 9999);
    const b = randomInt(100, a - 1);
    const correct = a - b;
    const wrong1 = correct + randomInt(1, 50);
    const wrong2 = correct - randomInt(1, 50);
    const wrong3 = a + b;

    const { options, correctIndex } = shuffleOptions(correct, [
      wrong1,
      wrong2,
      wrong3,
    ]);

    return {
      id: generateId(),
      question: `${a.toLocaleString("tr-TR")} - ${b.toLocaleString("tr-TR")} = ?`,
      options,
      correctAnswer: correctIndex,
      explanation: `${a.toLocaleString("tr-TR")} sayisindan ${b.toLocaleString("tr-TR")} cikarildiginda ${correct.toLocaleString("tr-TR")} elde edilir.`,
      difficulty: a > 7000 ? "zor" : a > 4000 ? "orta" : "kolay",
    };
  },

  // Carpma Islemi
  carpma: (): Question => {
    const a = randomInt(12, 99);
    const b = randomInt(2, 12);
    const correct = a * b;
    const wrong1 = correct + randomInt(1, 20);
    const wrong2 = correct - randomInt(1, 20);
    const wrong3 = (a + 1) * b;

    const { options, correctIndex } = shuffleOptions(correct, [
      wrong1,
      wrong2,
      wrong3,
    ]);

    return {
      id: generateId(),
      question: `${a} x ${b} = ?`,
      options,
      correctAnswer: correctIndex,
      explanation: `${a} ile ${b} carpildiginda ${correct} elde edilir.`,
      difficulty: a > 50 ? "zor" : a > 25 ? "orta" : "kolay",
    };
  },

  // Bolme Islemi
  bolme: (): Question => {
    const b = randomInt(2, 12);
    const quotient = randomInt(5, 50);
    const a = b * quotient;
    const correct = quotient;
    const wrong1 = quotient + randomInt(1, 5);
    const wrong2 = quotient - randomInt(1, 4);
    const wrong3 = b;

    const { options, correctIndex } = shuffleOptions(correct, [
      wrong1,
      wrong2,
      wrong3,
    ]);

    return {
      id: generateId(),
      question: `${a} : ${b} = ?`,
      options,
      correctAnswer: correctIndex,
      explanation: `${a} sayisi ${b}'e bolundugunde ${correct} elde edilir.`,
      difficulty: quotient > 30 ? "zor" : quotient > 15 ? "orta" : "kolay",
    };
  },

  // Kesirler
  kesirToplama: (): Question => {
    const payda = randomInt(2, 10);
    const pay1 = randomInt(1, payda - 1);
    const pay2 = randomInt(1, payda - pay1);
    const correctPay = pay1 + pay2;

    const options = [
      `${correctPay}/${payda}`,
      `${correctPay + 1}/${payda}`,
      `${pay1}/${payda}`,
      `${correctPay}/${payda + 1}`,
    ].sort(() => Math.random() - 0.5);

    return {
      id: generateId(),
      question: `${pay1}/${payda} + ${pay2}/${payda} = ?`,
      options,
      correctAnswer: options.indexOf(`${correctPay}/${payda}`),
      explanation: `Ayni paydali kesirlerde paylar toplanir: ${pay1} + ${pay2} = ${correctPay}`,
      difficulty: payda > 7 ? "zor" : payda > 4 ? "orta" : "kolay",
    };
  },
};

// 6. SINIF SORU URETECLERI
export const grade6Generators = {
  // Tam Sayilar Toplama
  tamSayiToplama: (): Question => {
    const a = randomInt(-50, 50);
    const b = randomInt(-50, 50);
    const correct = a + b;
    const wrong1 = correct + randomInt(1, 10);
    const wrong2 = correct - randomInt(1, 10);
    const wrong3 = a - b;

    const { options, correctIndex } = shuffleOptions(correct, [
      wrong1,
      wrong2,
      wrong3,
    ]);

    const aStr = a >= 0 ? a.toString() : `(${a})`;
    const bStr = b >= 0 ? `+ ${b}` : `+ (${b})`;

    return {
      id: generateId(),
      question: `${aStr} ${bStr} = ?`,
      options,
      correctAnswer: correctIndex,
      explanation: `${a} ile ${b} toplandığında ${correct} elde edilir.`,
      difficulty: Math.abs(a) > 30 || Math.abs(b) > 30 ? "zor" : "orta",
    };
  },

  // Tam Sayilar Carpma
  tamSayiCarpma: (): Question => {
    const a = randomInt(-12, 12);
    const b = randomInt(-12, 12);
    const correct = a * b;
    const wrong1 = correct + randomInt(1, 20);
    const wrong2 = -correct;
    const wrong3 = Math.abs(a * b);

    const { options, correctIndex } = shuffleOptions(correct, [
      wrong1,
      wrong2,
      wrong3,
    ]);

    const aStr = a >= 0 ? a.toString() : `(${a})`;
    const bStr = b >= 0 ? b.toString() : `(${b})`;

    return {
      id: generateId(),
      question: `${aStr} x ${bStr} = ?`,
      options,
      correctAnswer: correctIndex,
      explanation:
        a * b >= 0
          ? "Ayni isaretli iki sayi carpildiginda sonuc pozitiftir."
          : "Farkli isaretli iki sayi carpildiginda sonuc negatiftir.",
      difficulty: "orta",
    };
  },

  // Oran Orani
  oran: (): Question => {
    const a = randomInt(2, 10);
    const b = randomInt(2, 10);
    const multiplier = randomInt(2, 5);
    const newA = a * multiplier;
    const correct = b * multiplier;
    const wrong1 = correct + randomInt(1, 5);
    const wrong2 = correct - randomInt(1, 3);
    const wrong3 = b * (multiplier + 1);

    const { options, correctIndex } = shuffleOptions(correct, [
      wrong1,
      wrong2,
      wrong3,
    ]);

    return {
      id: generateId(),
      question: `${a}/${b} oraninda, ${a} yerine ${newA} yazilirsa ${b} yerine ne yazilmalidir?`,
      options,
      correctAnswer: correctIndex,
      explanation: `${a} sayisi ${multiplier} ile carpilarak ${newA} edilmis. Ayni sekilde ${b} x ${multiplier} = ${correct}`,
      difficulty: multiplier > 3 ? "zor" : "orta",
    };
  },

  // OBEB
  obeb: (): Question => {
    const a = randomInt(12, 48);
    const b = randomInt(12, 48);
    const correct = gcd(a, b);
    const wrong1 = correct + randomInt(1, 5);
    const wrong2 = lcm(a, b) > 100 ? correct * 2 : lcm(a, b);
    const wrong3 = Math.min(a, b);

    const { options, correctIndex } = shuffleOptions(correct, [
      wrong1,
      wrong2,
      wrong3,
    ]);

    return {
      id: generateId(),
      question: `OBEB(${a}, ${b}) = ?`,
      options,
      correctAnswer: correctIndex,
      explanation: `${a} ve ${b} sayilarinin ortak bolenleri arasinda en buyugu ${correct}'dir.`,
      difficulty: a > 36 || b > 36 ? "zor" : "orta",
    };
  },

  // OKEK
  okek: (): Question => {
    const a = randomInt(4, 15);
    const b = randomInt(4, 15);
    const correct = lcm(a, b);
    const wrong1 = correct + randomInt(1, 10);
    const wrong2 = a * b;
    const wrong3 = gcd(a, b);

    const { options, correctIndex } = shuffleOptions(correct, [
      wrong1,
      wrong2,
      wrong3,
    ]);

    return {
      id: generateId(),
      question: `OKEK(${a}, ${b}) = ?`,
      options,
      correctAnswer: correctIndex,
      explanation: `${a} ve ${b} sayilarinin ortak katlari arasinda en kucugu ${correct}'dur.`,
      difficulty: correct > 60 ? "zor" : "orta",
    };
  },
};

// 7. SINIF SORU URETECLERI
export const grade7Generators = {
  // Yuzde Hesaplama
  yuzde: (): Question => {
    const percent = randomInt(1, 9) * 10;
    const base = randomInt(2, 20) * 10;
    const correct = (percent * base) / 100;
    const wrong1 = correct + randomInt(1, 20);
    const wrong2 = correct - randomInt(1, 10);
    const wrong3 = base - correct;

    const { options, correctIndex } = shuffleOptions(correct, [
      wrong1,
      wrong2,
      wrong3,
    ]);

    return {
      id: generateId(),
      question: `${base} sayisinin %${percent}'i kactir?`,
      options,
      correctAnswer: correctIndex,
      explanation: `${base} x ${percent}/100 = ${correct}`,
      difficulty: percent > 50 ? "orta" : "kolay",
    };
  },

  // Denklem Cozme
  denklem: (): Question => {
    const x = randomInt(1, 20);
    const a = randomInt(2, 10);
    const b = randomInt(1, 30);
    const result = a * x + b;

    const wrong1 = x + randomInt(1, 5);
    const wrong2 = x - randomInt(1, 3);
    const wrong3 = result / a;

    const { options, correctIndex } = shuffleOptions(x, [
      wrong1,
      wrong2,
      Math.floor(wrong3),
    ]);

    return {
      id: generateId(),
      question: `${a}x + ${b} = ${result} ise x = ?`,
      options,
      correctAnswer: correctIndex,
      explanation: `${a}x = ${result} - ${b} = ${result - b}, x = ${(result - b) / a}`,
      difficulty: a > 5 ? "zor" : "orta",
    };
  },

  // Cember Cevresi
  cemberCevre: (): Question => {
    const r = randomInt(2, 15);
    const correct = 2 * r;
    const wrong1 = r * r;
    const wrong2 = r;
    const wrong3 = 2 * r + randomInt(1, 5);

    const { options, correctIndex } = shuffleOptions(correct, [
      wrong1,
      wrong2,
      wrong3,
    ]);
    const formattedOptions = options.map((o) => `${o}π`);

    return {
      id: generateId(),
      question: `Yaricapi ${r} cm olan cemberin cevresi kac cm'dir? (π cinsinden)`,
      options: formattedOptions,
      correctAnswer: correctIndex,
      explanation: `Cevre = 2πr = 2 x π x ${r} = ${correct}π cm`,
      difficulty: r > 10 ? "orta" : "kolay",
    };
  },

  // Esitsizlik
  esitsizlik: (): Question => {
    const a = randomInt(2, 8);
    const b = randomInt(5, 30);
    const threshold = Math.ceil(b / a);

    const options = [
      `x > ${threshold}`,
      `x < ${threshold}`,
      `x > ${threshold - 1}`,
      `x < ${threshold + 1}`,
    ].sort(() => Math.random() - 0.5);

    return {
      id: generateId(),
      question: `${a}x > ${b} esitsizliginin cozum kumesi nedir?`,
      options,
      correctAnswer: options.indexOf(`x > ${threshold}`),
      explanation: `${a}x > ${b} => x > ${b}/${a} => x > ${threshold}`,
      difficulty: "orta",
    };
  },

  // Aci Hesaplama
  aciHesaplama: (): Question => {
    const x = randomInt(10, 60);
    const supplement = 180 - x;

    const wrong1 = 90 - x;
    const wrong2 = x;
    const wrong3 = supplement + randomInt(1, 20);

    const { options, correctIndex } = shuffleOptions(supplement, [
      wrong1,
      wrong2,
      wrong3,
    ]);

    return {
      id: generateId(),
      question: `${x} derecelik acinin butunleri kac derecedir?`,
      options,
      correctAnswer: correctIndex,
      explanation: `Butunler acilarin toplami 180 derecedir. 180 - ${x} = ${supplement}`,
      difficulty: "kolay",
    };
  },
};

// 8. SINIF SORU URETECLERI
export const grade8Generators = {
  // Uslu Sayilar
  usluSayilar: (): Question => {
    const base = randomInt(2, 5);
    const exp = randomInt(2, 4);
    const correct = Math.pow(base, exp);
    const wrong1 = base * exp;
    const wrong2 = Math.pow(base, exp + 1);
    const wrong3 = Math.pow(base + 1, exp);

    const { options, correctIndex } = shuffleOptions(correct, [
      wrong1,
      wrong2,
      wrong3,
    ]);

    return {
      id: generateId(),
      question: `${base}^${exp} = ?`,
      options,
      correctAnswer: correctIndex,
      explanation: `${base}^${exp} = ${Array(exp).fill(base).join(" x ")} = ${correct}`,
      difficulty: exp > 3 ? "orta" : "kolay",
    };
  },

  // Karekoklu Sayilar
  karekok: (): Question => {
    const root = randomInt(2, 15);
    const number = root * root;
    const wrong1 = root + 1;
    const wrong2 = root - 1;
    const wrong3 = number / 2;

    const { options, correctIndex } = shuffleOptions(root, [
      wrong1,
      wrong2,
      Math.floor(wrong3),
    ]);

    return {
      id: generateId(),
      question: `√${number} = ?`,
      options,
      correctAnswer: correctIndex,
      explanation: `${root} x ${root} = ${number} oldugu icin √${number} = ${root}`,
      difficulty: root > 10 ? "orta" : "kolay",
    };
  },

  // Denklem Sistemi
  denklemSistemi: (): Question => {
    const x = randomInt(1, 10);
    const y = randomInt(1, 10);
    const a1 = randomInt(1, 5);
    const b1 = randomInt(1, 5);
    const c1 = a1 * x + b1 * y;
    const a2 = randomInt(1, 5);
    const b2 = randomInt(1, 5);
    const c2 = a2 * x + b2 * y;

    const correctSum = x + y;
    const wrong1 = correctSum + randomInt(1, 5);
    const wrong2 = correctSum - randomInt(1, 3);
    const wrong3 = x * y;

    const { options, correctIndex } = shuffleOptions(correctSum, [
      wrong1,
      wrong2,
      wrong3,
    ]);

    return {
      id: generateId(),
      question: `${a1}x + ${b1}y = ${c1} ve ${a2}x + ${b2}y = ${c2} ise x + y = ?`,
      options,
      correctAnswer: correctIndex,
      explanation: `Denklem sistemi cozuldugunde x = ${x}, y = ${y} bulunur. x + y = ${correctSum}`,
      difficulty: "zor",
    };
  },

  // Pitagor Teoremi
  pitagor: (): Question => {
    const pairs = [
      [3, 4, 5],
      [5, 12, 13],
      [6, 8, 10],
      [8, 15, 17],
      [9, 12, 15],
    ];
    const [a, b, c] = pairs[randomInt(0, pairs.length - 1)];
    const askType = randomInt(0, 2);

    let question: string;
    let correct: number;
    let explanation: string;

    if (askType === 0) {
      question = `Dik ucgenin dik kenarlari ${a} ve ${b} cm ise hipotenus kac cm'dir?`;
      correct = c;
      explanation = `√(${a}² + ${b}²) = √(${a * a} + ${b * b}) = √${c * c} = ${c}`;
    } else if (askType === 1) {
      question = `Dik ucgenin hipotenusi ${c} cm, bir dik kenari ${a} cm ise diger dik kenar kac cm'dir?`;
      correct = b;
      explanation = `√(${c}² - ${a}²) = √(${c * c} - ${a * a}) = √${b * b} = ${b}`;
    } else {
      question = `Dik ucgenin hipotenusi ${c} cm, bir dik kenari ${b} cm ise diger dik kenar kac cm'dir?`;
      correct = a;
      explanation = `√(${c}² - ${b}²) = √(${c * c} - ${b * b}) = √${a * a} = ${a}`;
    }

    const wrong1 = correct + randomInt(1, 3);
    const wrong2 = correct - randomInt(1, 2);
    const wrong3 = a + b;

    const { options, correctIndex } = shuffleOptions(correct, [
      wrong1,
      wrong2,
      wrong3,
    ]);

    return {
      id: generateId(),
      question,
      options,
      correctAnswer: correctIndex,
      explanation,
      difficulty: "orta",
    };
  },

  // Olasilik
  olasilik: (): Question => {
    const total = randomInt(2, 5) * 2;
    const favorable = randomInt(1, total - 1);
    const g = gcd(favorable, total);
    const simplifiedNum = favorable / g;
    const simplifiedDen = total / g;

    const options = [
      `${simplifiedNum}/${simplifiedDen}`,
      `${simplifiedNum + 1}/${simplifiedDen}`,
      `${simplifiedNum}/${simplifiedDen + 1}`,
      `${total - favorable}/${total}`,
    ].sort(() => Math.random() - 0.5);

    return {
      id: generateId(),
      question: `Bir torbada ${total} bilye vardir. ${favorable} tanesi kirmizi ise, rastgele cekilen bir bilyenin kirmizi olma olasiligi nedir?`,
      options,
      correctAnswer: options.indexOf(`${simplifiedNum}/${simplifiedDen}`),
      explanation: `Olasilik = Istenen / Toplam = ${favorable}/${total} = ${simplifiedNum}/${simplifiedDen}`,
      difficulty: "kolay",
    };
  },
};

// Tum siniflar icin soru uret
export function generateQuestion(
  grade: 5 | 6 | 7 | 8,
  topic?: string
): Question {
  const generators = {
    5: grade5Generators,
    6: grade6Generators,
    7: grade7Generators,
    8: grade8Generators,
  };

  const gradeGenerators = generators[grade];
  const topics = Object.keys(gradeGenerators);

  if (topic && topics.includes(topic)) {
    return gradeGenerators[topic as keyof typeof gradeGenerators]();
  }

  const randomTopic = topics[randomInt(0, topics.length - 1)];
  return gradeGenerators[randomTopic as keyof typeof gradeGenerators]();
}

// Belirli sayida soru uret
export function generateQuestions(
  grade: 5 | 6 | 7 | 8,
  count: number,
  topic?: string
): Question[] {
  return Array(count)
    .fill(null)
    .map(() => generateQuestion(grade, topic));
}

// Konu listesi
export const TOPICS = {
  5: [
    { id: "toplama", name: "Toplama İşlemi", icon: "Plus" },
    { id: "cikarma", name: "Çıkarma İşlemi", icon: "Minus" },
    { id: "carpma", name: "Çarpma İşlemi", icon: "X" },
    { id: "bolme", name: "Bölme İşlemi", icon: "Divide" },
    { id: "kesirToplama", name: "Kesirlerle Toplama", icon: "Percent" },
  ],
  6: [
    { id: "tamSayiToplama", name: "Tam Sayılarla Toplama", icon: "PlusCircle" },
    { id: "tamSayiCarpma", name: "Tam Sayılarla Çarpma", icon: "XCircle" },
    { id: "oran", name: "Oran ve Orantı", icon: "Scale" },
    { id: "obeb", name: "OBEB", icon: "GitMerge" },
    { id: "okek", name: "OKEK", icon: "GitBranch" },
  ],
  7: [
    { id: "yuzde", name: "Yüzde Hesaplama", icon: "Percent" },
    { id: "denklem", name: "Denklem Çözme", icon: "Equal" },
    { id: "cemberCevre", name: "Çember ve Daire", icon: "Circle" },
    { id: "esitsizlik", name: "Eşitsizlikler", icon: "ArrowLeftRight" },
    { id: "aciHesaplama", name: "Açılar", icon: "Triangle" },
  ],
  8: [
    { id: "usluSayilar", name: "Üslü Sayılar", icon: "Superscript" },
    { id: "karekok", name: "Karekök", icon: "SquareRoot" },
    { id: "denklemSistemi", name: "Denklem Sistemleri", icon: "Workflow" },
    { id: "pitagor", name: "Pisagor Teoremi", icon: "Triangle" },
    { id: "olasilik", name: "Olasılık", icon: "Dice5" },
  ],
} as const;
