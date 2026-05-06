"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UserProvider, useUser } from "@/lib/user-context";
import { generateQuestions, Question, TOPICS } from "@/lib/question-generator";

interface MatchItem {
  id: string;
  content: string;
  type: "question" | "answer";
  questionId: string;
  matched: boolean;
}

function MatchingGameContent() {
  const searchParams = useSearchParams();
  const gradeParam = searchParams.get("sinif");
  const topicParam = searchParams.get("konu");
  
  const { user, updateProgress } = useUser();
  
  const [gameState, setGameState] = useState<"setup" | "playing" | "finished">("setup");
  const [selectedGrade, setSelectedGrade] = useState<5 | 6 | 7 | 8>(
    gradeParam ? (parseInt(gradeParam) as 5 | 6 | 7 | 8) : 5
  );
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(topicParam || undefined);
  const [items, setItems] = useState<MatchItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MatchItem | null>(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const [showError, setShowError] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const startGame = useCallback(() => {
    const questions = generateQuestions(selectedGrade, 6, selectedTopic);
    
    const matchItems: MatchItem[] = [];
    questions.forEach((q) => {
      matchItems.push({
        id: `q-${q.id}`,
        content: q.question,
        type: "question",
        questionId: q.id,
        matched: false,
      });
      matchItems.push({
        id: `a-${q.id}`,
        content: q.options[q.correctAnswer],
        type: "answer",
        questionId: q.id,
        matched: false,
      });
    });

    // Shuffle items
    const shuffled = matchItems.sort(() => Math.random() - 0.5);
    
    setItems(shuffled);
    setSelectedItem(null);
    setScore(0);
    setMistakes(0);
    setMatchedPairs(0);
    setTotalPairs(questions.length);
    setStartTime(Date.now());
    setGameState("playing");
  }, [selectedGrade, selectedTopic]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === "playing") {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, startTime]);

  const handleItemClick = (item: MatchItem) => {
    if (item.matched || showError) return;

    if (!selectedItem) {
      setSelectedItem(item);
    } else {
      if (selectedItem.id === item.id) {
        setSelectedItem(null);
        return;
      }

      // Check if it's a valid pair (one question, one answer from same question)
      if (
        selectedItem.questionId === item.questionId &&
        selectedItem.type !== item.type
      ) {
        // Correct match!
        setItems(prev =>
          prev.map(i =>
            i.questionId === item.questionId ? { ...i, matched: true } : i
          )
        );
        setScore(prev => prev + 20);
        setMatchedPairs(prev => {
          const newCount = prev + 1;
          if (newCount === totalPairs) {
            if (user) {
              updateProgress({
                grade: selectedGrade,
                topic: selectedTopic || "karisik",
                score: score + 20,
                totalQuestions: totalPairs,
                correctAnswers: totalPairs,
                date: new Date().toISOString(),
              });
            }
            setTimeout(() => setGameState("finished"), 500);
          }
          return newCount;
        });
        setSelectedItem(null);
      } else {
        // Wrong match
        setShowError(true);
        setMistakes(prev => prev + 1);
        setTimeout(() => {
          setShowError(false);
          setSelectedItem(null);
        }, 800);
      }
    }
  };

  const topics = TOPICS[selectedGrade];

  if (gameState === "setup") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Eslestirme Oyunu</h1>
            <p className="text-muted-foreground">Soru ve cevaplari dogru sekilde eslestir!</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
            {/* Grade Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Sinif Sec
              </label>
              <div className="grid grid-cols-4 gap-3">
                {([5, 6, 7, 8] as const).map((grade) => {
                  const colors = {
                    5: selectedGrade === 5 ? "bg-grade-5 text-white" : "border-grade-5 text-grade-5 hover:bg-grade-5/10",
                    6: selectedGrade === 6 ? "bg-grade-6 text-white" : "border-grade-6 text-grade-6 hover:bg-grade-6/10",
                    7: selectedGrade === 7 ? "bg-grade-7 text-white" : "border-grade-7 text-grade-7 hover:bg-grade-7/10",
                    8: selectedGrade === 8 ? "bg-grade-8 text-white" : "border-grade-8 text-grade-8 hover:bg-grade-8/10",
                  };
                  return (
                    <button
                      key={grade}
                      onClick={() => {
                        setSelectedGrade(grade);
                        setSelectedTopic(undefined);
                      }}
                      className={`py-3 rounded-xl font-bold border-2 transition-colors ${colors[grade]}`}
                    >
                      {grade}. Sinif
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Topic Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Konu Sec
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedTopic(undefined)}
                  className={`py-3 px-4 rounded-xl font-medium border-2 transition-colors ${
                    !selectedTopic 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "border-border text-foreground hover:bg-muted"
                  }`}
                >
                  Karisik
                </button>
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`py-3 px-4 rounded-xl font-medium border-2 transition-colors text-left ${
                      selectedTopic === topic.id 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {topic.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startGame}
              className="w-full py-4 rounded-2xl bg-success text-success-foreground font-bold text-lg hover:bg-success/90 transition-colors"
            >
              Oyunu Baslat
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "finished") {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">Tebrikler!</h1>
            <p className="text-lg text-muted-foreground mb-6">Tum eslestirmeleri tamamladin!</p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="rounded-xl bg-primary/10 p-4">
                <div className="text-2xl font-bold text-primary">{score}</div>
                <div className="text-sm text-muted-foreground">Puan</div>
              </div>
              <div className="rounded-xl bg-secondary/10 p-4">
                <div className="text-2xl font-bold text-secondary">{mistakes}</div>
                <div className="text-sm text-muted-foreground">Hata</div>
              </div>
              <div className="rounded-xl bg-warning/10 p-4">
                <div className="text-2xl font-bold text-warning">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-muted-foreground">Sure</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setGameState("setup")}
                className="w-full py-3 rounded-xl bg-success text-success-foreground font-semibold hover:bg-success/90 transition-colors"
              >
                Tekrar Oyna
              </button>
              <Link
                href="/oyunlar"
                className="w-full py-3 rounded-xl border-2 border-border text-foreground font-semibold hover:bg-muted transition-colors text-center"
              >
                Oyunlara Don
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const questions = items.filter(i => i.type === "question");
  const answers = items.filter(i => i.type === "answer");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{score}</div>
              <div className="text-xs text-muted-foreground">Puan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{matchedPairs}/{totalPairs}</div>
              <div className="text-xs text-muted-foreground">Eslesen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{mistakes}</div>
              <div className="text-xs text-muted-foreground">Hata</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, "0")}
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Questions Column */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">Sorular</h3>
            <div className="space-y-3">
              {questions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  disabled={item.matched}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    item.matched
                      ? "bg-success/20 border-success text-success opacity-50"
                      : selectedItem?.id === item.id
                      ? "bg-primary/20 border-primary text-primary"
                      : showError && selectedItem?.id === item.id
                      ? "bg-secondary/20 border-secondary text-secondary"
                      : "bg-card border-border hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <span className="font-medium">{item.content}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Answers Column */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">Cevaplar</h3>
            <div className="space-y-3">
              {answers.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  disabled={item.matched}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    item.matched
                      ? "bg-success/20 border-success text-success opacity-50"
                      : selectedItem?.id === item.id
                      ? "bg-primary/20 border-primary text-primary"
                      : showError && selectedItem?.id === item.id
                      ? "bg-secondary/20 border-secondary text-secondary"
                      : "bg-card border-border hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <span className="font-medium">{item.content}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Bir soru sec, sonra dogru cevabi bul!
        </p>
      </div>
    </div>
  );
}

export default function EslestirmePage() {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success"></div>
            </div>
          }>
            <MatchingGameContent />
          </Suspense>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}
