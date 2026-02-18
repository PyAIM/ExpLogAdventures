/**
 * Logarithm Evaluation Expert - Activity 7
 * - Evaluate logarithms using laws and cancellation rules
 * - Cancellation rules: ln(e^x) = x, e^(ln x) = x, log(10^x) = x, 10^(log x) = x, b^(log_b x) = x, log_b(b^x) = x
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { ArrowLeft, Trophy, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { usePlayer } from "@/contexts/PlayerContext";
import { Scoreboard } from "@/components/Scoreboard";
import { ACTIVITIES, roundTo } from "@/lib/activityHelpers";

interface Challenge {
  question: string;
  expression: string;
  answer: number;
  explanation: string;
  points: number;
  tolerance?: number;
}

export default function LogEvaluation() {
  const { playerName, addActivityScore } = usePlayer();
  const [score, setScore] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  
  const challenges: Challenge[] = [
    {
      question: "Evaluate:",
      expression: "ln(e³)",
      answer: 3,
      explanation: "Cancellation Rule: ln(e^x) = x, so ln(e³) = 3",
      points: 10
    },
    {
      question: "Evaluate:",
      expression: "e^(ln 5)",
      answer: 5,
      explanation: "Cancellation Rule: e^(ln x) = x, so e^(ln 5) = 5",
      points: 10
    },
    {
      question: "Evaluate:",
      expression: "log(10⁴)",
      answer: 4,
      explanation: "Cancellation Rule: log(10^x) = x, so log(10⁴) = 4",
      points: 10
    },
    {
      question: "Evaluate:",
      expression: "10^(log 7)",
      answer: 7,
      explanation: "Cancellation Rule: 10^(log x) = x, so 10^(log 7) = 7",
      points: 10
    },
    {
      question: "Evaluate:",
      expression: "log₂(8)",
      answer: 3,
      explanation: "Since 2³ = 8, we have log₂(8) = 3",
      points: 15
    },
    {
      question: "Evaluate:",
      expression: "log₅(125)",
      answer: 3,
      explanation: "Since 5³ = 125, we have log₅(125) = 3",
      points: 15
    },
    {
      question: "Evaluate:",
      expression: "ln(e) + ln(e²)",
      answer: 3,
      explanation: "ln(e) = 1 and ln(e²) = 2, so ln(e) + ln(e²) = 1 + 2 = 3",
      points: 20
    },
    {
      question: "Evaluate:",
      expression: "2·log(10) + 3·log(100)",
      answer: 8,
      explanation: "log(10) = 1 and log(100) = 2, so 2·1 + 3·2 = 2 + 6 = 8",
      points: 20
    },
    {
      question: "Evaluate:",
      expression: "log₃(27) - log₃(9)",
      answer: 1,
      explanation: "log₃(27) = 3 and log₃(9) = 2, so 3 - 2 = 1. Or use quotient rule: log₃(27/9) = log₃(3) = 1",
      points: 25
    },
    {
      question: "Evaluate:",
      expression: "5^(log₅ 12)",
      answer: 12,
      explanation: "Cancellation Rule: b^(log_b x) = x, so 5^(log₅ 12) = 12",
      points: 15
    }
  ];
  
  const currentChallenge = challenges[challengeIndex];
  
  const checkAnswer = () => {
    const numAnswer = parseFloat(userAnswer);
    
    if (isNaN(numAnswer)) {
      toast.error("Please enter a valid number!");
      return;
    }
    
    const tolerance = currentChallenge.tolerance || 0.01;
    const isCorrect = Math.abs(numAnswer - currentChallenge.answer) < tolerance;
    
    if (isCorrect) {
      const newScore = score + currentChallenge.points;
      setScore(newScore);
      setShowExplanation(true);
      toast.success(`Correct, ${playerName}! +${currentChallenge.points} points! 🎉`, {
        duration: 2000,
      });
      
      setTimeout(() => {
        if (challengeIndex < challenges.length - 1) {
          setChallengeIndex(challengeIndex + 1);
          setUserAnswer("");
          setShowExplanation(false);
        } else {
          addActivityScore(ACTIVITIES["log-evaluation"].id, ACTIVITIES["log-evaluation"].name, newScore);
          setShowScoreboard(true);
        }
      }, 2500);
    } else {
      toast.error("Not quite right! Try again.", {
        duration: 2000,
      });
      setShowExplanation(true);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-[6px] border-foreground bg-[oklch(0.60_0.20_180)] text-white py-8">
        <div className="container">
          <Link href="/">
            <Button variant="outline" className="mb-4 border-[4px] border-white text-white hover:bg-white hover:text-[oklch(0.60_0.20_180)]">
              <ArrowLeft className="mr-2" strokeWidth={3} /> Back to Activities
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">Logarithm Evaluation Expert</h1>
          <p className="text-xl">Evaluate logarithms using laws and cancellation rules</p>
          {playerName && (
            <p className="text-lg mt-2">Player: <span className="font-bold">{playerName}</span></p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Score Display */}
          <Card className="border-[6px] border-foreground shadow-brutal p-6 mb-8 bg-[oklch(0.70_0.20_55)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8" strokeWidth={3} />
                <span className="text-2xl font-bold">Score: {score}</span>
              </div>
              <span className="text-lg font-bold">
                Challenge {challengeIndex + 1} of {challenges.length}
              </span>
            </div>
          </Card>

          {/* Challenge Card */}
          <Card className="border-[6px] border-foreground shadow-brutal p-8 bg-white">
            <h2 className="text-2xl font-bold mb-4">{currentChallenge.question}</h2>
            
            {/* Expression Display */}
            <div className="bg-[oklch(0.98_0.01_90)] border-[4px] border-foreground p-6 mb-6 text-center">
              <p className="text-3xl font-mono font-bold">{currentChallenge.expression}</p>
            </div>

            {/* Answer Input */}
            <div className="mb-6">
              <label className="block text-lg font-bold mb-2">Your Answer:</label>
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
                placeholder="Enter your answer..."
                className="h-14 text-xl border-[4px] border-foreground font-mono"
                step="any"
              />
            </div>

            {/* Explanation */}
            {showExplanation && (
              <Card className="border-[4px] border-foreground p-4 mb-6 bg-[oklch(0.85_0.15_145)] flex items-start gap-3">
                <Lightbulb className="w-6 h-6 flex-shrink-0 mt-1" strokeWidth={3} />
                <div>
                  <p className="font-bold mb-1">Explanation:</p>
                  <p>{currentChallenge.explanation}</p>
                  <p className="mt-2 font-mono">Answer: {currentChallenge.answer}</p>
                </div>
              </Card>
            )}

            {/* Check Answer Button */}
            <Button
              onClick={checkAnswer}
              disabled={!userAnswer}
              className="w-full bg-[oklch(0.60_0.20_180)] text-white border-[4px] border-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold text-xl h-14"
            >
              Check Answer
            </Button>
          </Card>

          {/* Reference Card */}
          <Card className="border-[6px] border-foreground shadow-brutal p-6 mt-8 bg-[oklch(0.98_0.01_90)]">
            <h3 className="text-xl font-bold mb-4">Cancellation Rules Reference:</h3>
            <div className="space-y-2 font-mono text-sm md:text-base">
              <p><strong>Natural Log:</strong> ln(e^x) = x  and  e^(ln x) = x</p>
              <p><strong>Common Log:</strong> log(10^x) = x  and  10^(log x) = x</p>
              <p><strong>General Base:</strong> log_b(b^x) = x  and  b^(log_b x) = x</p>
            </div>
          </Card>
        </div>
      </main>

      <Scoreboard
        open={showScoreboard}
        onClose={() => setShowScoreboard(false)}
        currentActivityScore={score}
        currentActivityName={ACTIVITIES["log-evaluation"].name}
      />
    </div>
  );
}
