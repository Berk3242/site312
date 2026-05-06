"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UserProvider, useUser } from "@/lib/user-context";
import { generateQuestion, Question, TOPICS } from "@/lib/question-generator";

function SpeedTestContent() {
  const searchParams = useSearchParams();
  const gradeParam = searchParams.get("sinif");
  const topicParam = searchParams.get("konu");
  
  const { user, updateProgress } = useUser();
  
  const [gameState, setGameState] = useState<"setup" | "countdown" | "playing" | "finished">("setup");
  const [selectedGrade, setSelectedGrade] = useState<5 | 6 | 7 | 8>(
    gradeParam ? (parseInt(gradeParam) as 5 | 6 | 7 | 8) : 5
  );
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(topicParam || undefined);
  const [timeLimit, setTimeLimit] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [countdown, setCountdown] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateNewQuestion = useCallback(() => {
    const question = generateQuestion(selectedGrade, selectedTopic);
    setCurrentQuestion(question);
  }, [selectedGrade, selectedTopic]);

  const startGame = () => {
    setCountdown(3);
    setGameState("countdown");
  };

  useEffect(() => {
    if (gameState === "countdown" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "countdown" && countdown === 0) {
      setTimeLeft(timeLimit);
      setScore(0);
      setCorrectAnswers(0);
      setWrongAnswers(0);
      setStreak(0);
      setBestStreak(0);
      generateNewQuestion();
      setGameState("playing");
    }
  }, [gameState, countdown, timeLimit, generateNewQuestion]);

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    } else if (gameState === "playing" && timeLeft === 0) {
      if (user) {
        updateProgress({
          grade: selectedGrade,
          topic: selectedTopic || "karisik",
          score,
          totalQuestions: correctAnswers + wrongAnswers,
          correctAnswers,
          date: new Date().toISOString(),
        });
      }
      setGameState("finished");
    }
  }, [gameState, timeLeft, user, selectedGrade, selectedTopic, score, correctAnswers, wrongAnswers, updateProgress]);

  const handleAnswer = (answerIndex: number) => {
    if (!currentQuestion || gameState !== "playing") return;

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const basePoints = currentQuestion.difficulty === "kolay" ? 10 : 
                         currentQuestion.difficulty === "orta" ? 15 : 20;
      const streakBonus = Math.min(streak, 5) * 2;
      setScore(prev => prev + basePoints + streakBonus);
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
    } else {
      setWrongAnswers(prev => prev + 1);
      setStreak(0);
    }
    
    generateNewQuestion();
  };

  const topics = TOPICS[selectedGrade];

  if (gameState === "setup") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Hiz Testi</h1>
            <p className="text-muted-foreground">Zamanla yaris! Ne kadar hizli cevaplayabilirsin?</p>
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

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Sure Sec
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[30, 60, 90].map((time) => (
                  <button
                    key={time}
                    onClick={() => setTimeLimit(time)}
                    className={`py-3 rounded-xl font-medium border-2 transition-colors ${
                      timeLimit === time 
                        ? "bg-warning text-warning-foreground border-warning" 
                        : "border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {time} saniye
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startGame}
              className="w-full py-4 rounded-2xl bg-warning text-warning-foreground font-bold text-lg hover:bg-warning/90 transition-colors"
            >
              Baslat
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "countdown") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-warning flex items-center justify-center mx-auto mb-6 animate-pulse-scale">
              <span className="text-6xl font-bold text-warning-foreground">{countdown}</span>
            </div>
            <p className="text-xl text-muted-foreground">Hazir ol!</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "finished") {
    const totalQuestions = correctAnswers + wrongAnswers;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="w-24 h-24 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">Sure Doldu!</h1>
            <p className="text-lg text-muted-foreground mb-6">Harika bir performans!</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="rounded-xl bg-primary/10 p-4">
                <div className="text-3xl font-bold text-primary">{score}</div>
                <div className="text-sm text-muted-foreground">Toplam Puan</div>
              </div>
              <div className="rounded-xl bg-success/10 p-4">
                <div className="text-3xl font-bold text-success">{correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Dogru Cevap</div>
              </div>
              <div className="rounded-xl bg-secondary/10 p-4">
                <div className="text-3xl font-bold text-secondary">{wrongAnswers}</div>
                <div className="text-sm text-muted-foreground">Yanlis Cevap</div>
              </div>
              <div className="rounded-xl bg-warning/10 p-4">
                <div className="text-3xl font-bold text-warning">{bestStreak}</div>
                <div className="text-sm text-muted-foreground">En Iyi Seri</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-sm text-muted-foreground mb-1">Dogruluk Orani</div>
              <div className="h-4 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-success transition-all"
                  style={{ width: `${accuracy}%` }}
                />
              </div>
              <div className="text-lg font-bold text-foreground mt-1">%{accuracy}</div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setGameState("setup")}
                className="w-full py-3 rounded-xl bg-warning text-warning-foreground font-semibold hover:bg-warning/90 transition-colors"
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

  if (!currentQuestion) return null;

  const timePercentage = (timeLeft / timeLimit) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{score}</div>
              <div className="text-xs text-muted-foreground">Puan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{correctAnswers}</div>
              <div className="text-xs text-muted-foreground">Dogru</div>
            </div>
            {streak > 1 && (
              <div className="px-3 py-1 rounded-full bg-warning/20 text-warning font-bold text-sm">
                {streak}x Seri!
              </div>
            )}
          </div>
          <div className={`text-4xl font-bold ${timeLeft <= 10 ? "text-secondary animate-pulse" : "text-foreground"}`}>
            {timeLeft}
          </div>
        </div>

        {/* Timer Bar */}
        <div className="h-3 rounded-full bg-muted overflow-hidden mb-6">
          <div 
            className={`h-full transition-all duration-1000 ${
              timePercentage > 30 ? "bg-warning" : "bg-secondary"
            }`}
            style={{ width: `${timePercentage}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="py-4 px-6 rounded-xl border-2 border-border font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors text-center"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HizTestiPage() {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warning"></div>
            </div>
          }>
            <SpeedTestContent />
          </Suspense>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}
