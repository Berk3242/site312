"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UserProvider, useUser } from "@/lib/user-context";
import { generateQuestions, Question, TOPICS } from "@/lib/question-generator";

function QuizGameContent() {
  const searchParams = useSearchParams();
  const gradeParam = searchParams.get("sinif");
  const topicParam = searchParams.get("konu");
  
  const { user, updateProgress } = useUser();
  
  const [gameState, setGameState] = useState<"setup" | "playing" | "finished">("setup");
  const [selectedGrade, setSelectedGrade] = useState<5 | 6 | 7 | 8>(
    gradeParam ? (parseInt(gradeParam) as 5 | 6 | 7 | 8) : 5
  );
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(topicParam || undefined);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const startGame = useCallback(() => {
    const newQuestions = generateQuestions(selectedGrade, 10, selectedTopic);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCorrectAnswers(0);
    setAnswers([]);
    setGameState("playing");
  }, [selectedGrade, selectedTopic]);

  useEffect(() => {
    if (gradeParam && topicParam) {
      startGame();
    }
  }, [gradeParam, topicParam, startGame]);

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === questions[currentQuestionIndex].correctAnswer;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      const points = questions[currentQuestionIndex].difficulty === "kolay" ? 10 : 
                     questions[currentQuestionIndex].difficulty === "orta" ? 15 : 20;
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Game finished
      if (user) {
        updateProgress({
          grade: selectedGrade,
          topic: selectedTopic || "karisik",
          score,
          totalQuestions: questions.length,
          correctAnswers,
          date: new Date().toISOString(),
        });
      }
      setGameState("finished");
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const topics = TOPICS[selectedGrade];

  if (gameState === "setup") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Yarismasi</h1>
            <p className="text-muted-foreground">Sinifini ve konunu sec, basla!</p>
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
                Konu Sec (Opsiyonel)
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
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors"
            >
              Oyunu Baslat
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "finished") {
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    let message = "";
    let messageColor = "";
    
    if (percentage >= 80) {
      message = "Mukemmel! Harika bir performans!";
      messageColor = "text-success";
    } else if (percentage >= 60) {
      message = "Iyi is! Biraz daha pratik yaparsan daha da iyi olacaksin.";
      messageColor = "text-primary";
    } else if (percentage >= 40) {
      message = "Fena degil, ama gelistirmeye devam et!";
      messageColor = "text-warning";
    } else {
      message = "Konulari tekrar gozden gecir ve tekrar dene!";
      messageColor = "text-secondary";
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl font-bold text-primary">{percentage}%</span>
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">Oyun Bitti!</h1>
            <p className={`text-lg font-medium ${messageColor} mb-6`}>{message}</p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="rounded-xl bg-muted p-4">
                <div className="text-2xl font-bold text-foreground">{score}</div>
                <div className="text-sm text-muted-foreground">Puan</div>
              </div>
              <div className="rounded-xl bg-muted p-4">
                <div className="text-2xl font-bold text-success">{correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Dogru</div>
              </div>
              <div className="rounded-xl bg-muted p-4">
                <div className="text-2xl font-bold text-secondary">{questions.length - correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Yanlis</div>
              </div>
            </div>

            {/* Answer Summary */}
            <div className="flex justify-center gap-2 mb-8">
              {answers.map((isCorrect, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                    isCorrect ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setGameState("setup");
                }}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Yeni Oyun
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Soru {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {score} puan
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              currentQuestion.difficulty === "kolay" ? "bg-success/20 text-success" :
              currentQuestion.difficulty === "orta" ? "bg-warning/20 text-warning" :
              "bg-secondary/20 text-secondary"
            }`}>
              {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-6">
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
              } else if (selectedAnswer === index) {
                buttonClass = "border-primary bg-primary/10 text-primary";
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

        {/* Explanation */}
        {showResult && (
          <div className={`rounded-2xl p-6 mb-6 ${
            selectedAnswer === currentQuestion.correctAnswer 
              ? "bg-success/10 border border-success/30" 
              : "bg-secondary/10 border border-secondary/30"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <>
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-bold text-success">Dogru!</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="font-bold text-secondary">Yanlis!</span>
                </>
              )}
            </div>
            <p className="text-foreground">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Next Button */}
        {showResult && (
          <button
            onClick={nextQuestion}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors"
          >
            {currentQuestionIndex < questions.length - 1 ? "Sonraki Soru" : "Sonuclari Gor"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          }>
            <QuizGameContent />
          </Suspense>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}
