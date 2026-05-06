"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UserProvider } from "@/lib/user-context";
import { generateQuestion, Question, TOPICS } from "@/lib/question-generator";

interface Player {
  name: string;
  score: number;
  position: number;
}

function RaceGameContent() {
  const searchParams = useSearchParams();
  const gradeParam = searchParams.get("sinif");
  
  const [gameState, setGameState] = useState<"setup" | "names" | "playing" | "finished">("setup");
  const [selectedGrade, setSelectedGrade] = useState<5 | 6 | 7 | 8>(
    gradeParam ? (parseInt(gradeParam) as 5 | 6 | 7 | 8) : 5
  );
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(undefined);
  const [winningScore] = useState(10);
  const [player1, setPlayer1] = useState<Player>({ name: "Oyuncu 1", score: 0, position: 0 });
  const [player2, setPlayer2] = useState<Player>({ name: "Oyuncu 2", score: 0, position: 0 });
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const generateNewQuestion = useCallback(() => {
    const question = generateQuestion(selectedGrade, selectedTopic);
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [selectedGrade, selectedTopic]);

  const startGame = () => {
    setGameState("names");
  };

  const startPlaying = () => {
    setPlayer1(prev => ({ ...prev, score: 0, position: 0 }));
    setPlayer2(prev => ({ ...prev, score: 0, position: 0 }));
    setCurrentTurn(1);
    generateNewQuestion();
    setGameState("playing");
  };

  const handleAnswer = (answerIndex: number) => {
    if (showResult || !currentQuestion) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const currentPlayer = currentTurn === 1 ? player1 : player2;
    const setCurrentPlayer = currentTurn === 1 ? setPlayer1 : setPlayer2;

    if (isCorrect) {
      const newScore = currentPlayer.score + 1;
      const newPosition = (newScore / winningScore) * 100;
      
      setCurrentPlayer(prev => ({
        ...prev,
        score: newScore,
        position: newPosition,
      }));

      if (newScore >= winningScore) {
        setWinner(currentPlayer.name);
        setTimeout(() => setGameState("finished"), 1000);
        return;
      }
    }

    setTimeout(() => {
      setCurrentTurn(currentTurn === 1 ? 2 : 1);
      generateNewQuestion();
    }, 1500);
  };

  const topics = TOPICS[selectedGrade];
  const currentPlayer = currentTurn === 1 ? player1 : player2;

  if (gameState === "setup") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Matematik Yarisi</h1>
            <p className="text-muted-foreground">Ilk {winningScore} puana ulaşan kazanir!</p>
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
              className="w-full py-4 rounded-2xl bg-accent text-accent-foreground font-bold text-lg hover:bg-accent/90 transition-colors"
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
            <p className="text-muted-foreground">Sirali oynanacak - her oyuncu sirayla cevaplar</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Oyuncu 1
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
                <label className="block text-sm font-medium text-accent mb-2">
                  Oyuncu 2
                </label>
                <input
                  type="text"
                  value={player2.name}
                  onChange={(e) => setPlayer2(prev => ({ ...prev, name: e.target.value || "Oyuncu 2" }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:border-accent focus:outline-none"
                  placeholder="Oyuncu 2"
                />
              </div>
            </div>

            <button
              onClick={startPlaying}
              className="w-full py-4 rounded-2xl bg-accent text-accent-foreground font-bold text-lg hover:bg-accent/90 transition-colors"
            >
              Yarisi Baslat
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
            <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {winner} Kazandi!
            </h1>
            <p className="text-lg text-muted-foreground mb-6">Tebrikler, {winningScore} puana ilk ulasan sensin!</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`rounded-xl p-4 ${player1.score >= winningScore ? "bg-secondary/20 border-2 border-secondary" : "bg-muted"}`}>
                <div className="text-lg font-bold text-foreground mb-1">{player1.name}</div>
                <div className="text-3xl font-bold text-secondary">{player1.score}</div>
              </div>
              <div className={`rounded-xl p-4 ${player2.score >= winningScore ? "bg-accent/20 border-2 border-accent" : "bg-muted"}`}>
                <div className="text-lg font-bold text-foreground mb-1">{player2.name}</div>
                <div className="text-3xl font-bold text-accent">{player2.score}</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setGameState("setup")}
                className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
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
      <div className="max-w-2xl mx-auto">
        {/* Race Track */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
            Yaris Pisti - Hedef: {winningScore} Puan
          </h3>
          
          {/* Player 1 Track */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-sm font-medium ${currentTurn === 1 ? "text-secondary" : "text-muted-foreground"}`}>
                {player1.name}
              </span>
              <span className="text-sm text-muted-foreground">{player1.score}/{winningScore}</span>
            </div>
            <div className="h-8 rounded-full bg-muted relative overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-secondary/30 transition-all duration-500"
                style={{ width: `${player1.position}%` }}
              />
              <div 
                className="absolute top-1 bottom-1 w-6 rounded-full bg-secondary transition-all duration-500 flex items-center justify-center"
                style={{ left: `calc(${player1.position}% - 12px)` }}
              >
                <span className="text-xs font-bold text-secondary-foreground">1</span>
              </div>
            </div>
          </div>

          {/* Player 2 Track */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-sm font-medium ${currentTurn === 2 ? "text-accent" : "text-muted-foreground"}`}>
                {player2.name}
              </span>
              <span className="text-sm text-muted-foreground">{player2.score}/{winningScore}</span>
            </div>
            <div className="h-8 rounded-full bg-muted relative overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-accent/30 transition-all duration-500"
                style={{ width: `${player2.position}%` }}
              />
              <div 
                className="absolute top-1 bottom-1 w-6 rounded-full bg-accent transition-all duration-500 flex items-center justify-center"
                style={{ left: `calc(${player2.position}% - 12px)` }}
              >
                <span className="text-xs font-bold text-accent-foreground">2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Turn Indicator */}
        <div className={`rounded-xl p-4 mb-6 text-center ${
          currentTurn === 1 ? "bg-secondary/20 border-2 border-secondary" : "bg-accent/20 border-2 border-accent"
        }`}>
          <span className="text-lg font-bold text-foreground">
            {currentPlayer.name} oynuyor
          </span>
        </div>

        {/* Question Card */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "border-border text-foreground hover:bg-muted";
              
              if (showResult) {
                if (index === currentQuestion.correctAnswer) {
                  buttonClass = "border-success bg-success/10 text-success";
                } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                  buttonClass = "border-secondary bg-secondary/10 text-secondary";
                } else {
                  buttonClass = "border-border text-muted-foreground opacity-50";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full py-4 px-6 rounded-xl border-2 font-medium text-left transition-colors ${buttonClass}`}
                >
                  <span className="inline-flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Result Feedback */}
        {showResult && (
          <div className={`rounded-2xl p-4 text-center ${
            selectedAnswer === currentQuestion.correctAnswer ? "bg-success/20" : "bg-secondary/20"
          }`}>
            <p className="font-bold text-foreground">
              {selectedAnswer === currentQuestion.correctAnswer 
                ? `Dogru! ${currentPlayer.name} 1 adim ilerledi.`
                : `Yanlis! Sira ${currentTurn === 1 ? player2.name : player1.name}'e gecti.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function YarisPage() {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
          }>
            <RaceGameContent />
          </Suspense>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}
