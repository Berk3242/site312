"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UserProvider } from "@/lib/user-context";
import { generateQuestion, Question, TOPICS } from "@/lib/question-generator";

interface Player {
  name: string;
  score: number;
  correctAnswers: number;
  key: string;
}

function DuelloGameContent() {
  const searchParams = useSearchParams();
  const gradeParam = searchParams.get("sinif");
  
  const [gameState, setGameState] = useState<"setup" | "names" | "playing" | "finished">("setup");
  const [selectedGrade, setSelectedGrade] = useState<5 | 6 | 7 | 8>(
    gradeParam ? (parseInt(gradeParam) as 5 | 6 | 7 | 8) : 5
  );
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(undefined);
  const [player1, setPlayer1] = useState<Player>({ name: "Oyuncu 1", score: 0, correctAnswers: 0, key: "a" });
  const [player2, setPlayer2] = useState<Player>({ name: "Oyuncu 2", score: 0, correctAnswers: 0, key: "l" });
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions] = useState(10);
  const [showResult, setShowResult] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [lastAnswer, setLastAnswer] = useState<{ player: string; correct: boolean } | null>(null);

  const generateNewQuestion = useCallback(() => {
    const question = generateQuestion(selectedGrade, selectedTopic);
    setCurrentQuestion(question);
    setShowResult(false);
    setLastAnswer(null);
  }, [selectedGrade, selectedTopic]);

  const startGame = () => {
    setGameState("names");
  };

  const startPlaying = () => {
    setPlayer1(prev => ({ ...prev, score: 0, correctAnswers: 0 }));
    setPlayer2(prev => ({ ...prev, score: 0, correctAnswers: 0 }));
    setQuestionNumber(1);
    generateNewQuestion();
    setGameState("playing");
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameState !== "playing" || showResult || !currentQuestion) return;

    const key = event.key.toLowerCase();
    
    // Player 1 keys: A, S, D, F for options 0, 1, 2, 3
    // Player 2 keys: J, K, L, ; for options 0, 1, 2, 3
    const player1Keys = ["a", "s", "d", "f"];
    const player2Keys = ["j", "k", "l", ";"];

    let playerName = "";
    let answerIndex = -1;

    if (player1Keys.includes(key)) {
      playerName = player1.name;
      answerIndex = player1Keys.indexOf(key);
    } else if (player2Keys.includes(key)) {
      playerName = player2.name;
      answerIndex = player2Keys.indexOf(key);
    }

    if (answerIndex >= 0 && answerIndex < currentQuestion.options.length) {
      const isCorrect = answerIndex === currentQuestion.correctAnswer;
      const points = currentQuestion.difficulty === "kolay" ? 10 : 
                     currentQuestion.difficulty === "orta" ? 15 : 20;

      setLastAnswer({ player: playerName, correct: isCorrect });
      setShowResult(true);

      if (isCorrect) {
        if (playerName === player1.name) {
          setPlayer1(prev => ({
            ...prev,
            score: prev.score + points,
            correctAnswers: prev.correctAnswers + 1,
          }));
        } else {
          setPlayer2(prev => ({
            ...prev,
            score: prev.score + points,
            correctAnswers: prev.correctAnswers + 1,
          }));
        }
      }

      setTimeout(() => {
        if (questionNumber >= totalQuestions) {
          // Determine winner
          const p1Score = player1.score + (playerName === player1.name && isCorrect ? points : 0);
          const p2Score = player2.score + (playerName === player2.name && isCorrect ? points : 0);
          
          if (p1Score > p2Score) {
            setWinner(player1.name);
          } else if (p2Score > p1Score) {
            setWinner(player2.name);
          } else {
            setWinner("Berabere");
          }
          setGameState("finished");
        } else {
          setQuestionNumber(prev => prev + 1);
          generateNewQuestion();
        }
      }, 1500);
    }
  }, [gameState, showResult, currentQuestion, player1, player2, questionNumber, totalQuestions, generateNewQuestion]);

  // Add keyboard listener
  useState(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  });

  const topics = TOPICS[selectedGrade];

  if (gameState === "setup") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">2 Kisilik Duello</h1>
            <p className="text-muted-foreground">Arkadasinla ayni klavyede yaris!</p>
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

            {/* How to Play */}
            <div className="rounded-xl bg-muted/50 p-4">
              <h3 className="font-semibold text-foreground mb-2">Nasil Oynanir?</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-secondary mb-1">Oyuncu 1 (Sol)</p>
                  <p className="text-muted-foreground">A, S, D, F tuslari</p>
                </div>
                <div>
                  <p className="font-medium text-primary mb-1">Oyuncu 2 (Sag)</p>
                  <p className="text-muted-foreground">J, K, L, ; tuslari</p>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startGame}
              className="w-full py-4 rounded-2xl bg-secondary text-secondary-foreground font-bold text-lg hover:bg-secondary/90 transition-colors"
            >
              Devam Et
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "names") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Oyuncu Isimleri</h1>
            <p className="text-muted-foreground">Isimlerinizi girin</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Oyuncu 1 (A, S, D, F)
                </label>
                <input
                  type="text"
                  value={player1.name}
                  onChange={(e) => setPlayer1(prev => ({ ...prev, name: e.target.value || "Oyuncu 1" }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-secondary focus:outline-none"
                  placeholder="Oyuncu 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Oyuncu 2 (J, K, L, ;)
                </label>
                <input
                  type="text"
                  value={player2.name}
                  onChange={(e) => setPlayer2(prev => ({ ...prev, name: e.target.value || "Oyuncu 2" }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none"
                  placeholder="Oyuncu 2"
                />
              </div>
            </div>

            <button
              onClick={startPlaying}
              className="w-full py-4 rounded-2xl bg-secondary text-secondary-foreground font-bold text-lg hover:bg-secondary/90 transition-colors"
            >
              Oyunu Baslat
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "finished") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="w-24 h-24 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {winner === "Berabere" ? "Berabere!" : `${winner} Kazandi!`}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">Harika bir mucadele!</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`rounded-xl p-4 ${player1.score >= player2.score ? "bg-secondary/20 border-2 border-secondary" : "bg-muted"}`}>
                <div className="text-lg font-bold text-foreground mb-1">{player1.name}</div>
                <div className="text-3xl font-bold text-secondary">{player1.score}</div>
                <div className="text-sm text-muted-foreground">{player1.correctAnswers} dogru</div>
              </div>
              <div className={`rounded-xl p-4 ${player2.score >= player1.score ? "bg-primary/20 border-2 border-primary" : "bg-muted"}`}>
                <div className="text-lg font-bold text-foreground mb-1">{player2.name}</div>
                <div className="text-3xl font-bold text-primary">{player2.score}</div>
                <div className="text-sm text-muted-foreground">{player2.correctAnswers} dogru</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setGameState("setup")}
                className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-colors"
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Score Board */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl bg-secondary/10 border-2 border-secondary p-4 text-center">
            <div className="text-sm text-muted-foreground">{player1.name}</div>
            <div className="text-3xl font-bold text-secondary">{player1.score}</div>
            <div className="text-xs text-muted-foreground mt-1">A S D F</div>
          </div>
          <div className="rounded-xl bg-muted p-4 text-center">
            <div className="text-sm text-muted-foreground">Soru</div>
            <div className="text-3xl font-bold text-foreground">{questionNumber}/{totalQuestions}</div>
          </div>
          <div className="rounded-xl bg-primary/10 border-2 border-primary p-4 text-center">
            <div className="text-sm text-muted-foreground">{player2.name}</div>
            <div className="text-3xl font-bold text-primary">{player2.score}</div>
            <div className="text-xs text-muted-foreground mt-1">J K L ;</div>
          </div>
        </div>

        {/* Question Card */}
        <div className="rounded-2xl border border-border bg-card p-8 mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
              const p1Keys = ["A", "S", "D", "F"];
              const p2Keys = ["J", "K", "L", ";"];
              
              let buttonClass = "border-border";
              if (showResult && index === currentQuestion.correctAnswer) {
                buttonClass = "border-success bg-success/20";
              }

              return (
                <div
                  key={index}
                  className={`relative p-6 rounded-xl border-2 ${buttonClass} transition-colors`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="px-2 py-1 rounded bg-secondary/20 text-secondary text-xs font-bold">
                      {p1Keys[index]}
                    </span>
                    <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-bold">
                      {p2Keys[index]}
                    </span>
                  </div>
                  <div className="text-xl font-medium text-foreground text-center">
                    {option}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Result Feedback */}
        {showResult && lastAnswer && (
          <div className={`rounded-2xl p-6 text-center ${
            lastAnswer.correct ? "bg-success/20" : "bg-secondary/20"
          }`}>
            <p className="text-xl font-bold text-foreground">
              {lastAnswer.player} {lastAnswer.correct ? "dogru cevapladi!" : "yanlis cevapladi!"}
            </p>
          </div>
        )}

        {/* Instructions */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Ilk dogru cevabi veren puan kazanir!
        </p>
      </div>
    </div>
  );
}

export default function DuelloPage() {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
          }>
            <DuelloGameContent />
          </Suspense>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}
