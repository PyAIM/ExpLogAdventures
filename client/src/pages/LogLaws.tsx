/**
 * Logarithm Laws Master - Activity 6
 * - Expand and combine logarithmic expressions using log laws
 * - Product rule: log(AB) = log(A) + log(B)
 * - Quotient rule: log(A/B) = log(A) - log(B)
 * - Power rule: log(A^n) = n·log(A)
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Trophy, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { usePlayer } from "@/contexts/PlayerContext";
import { Scoreboard } from "@/components/Scoreboard";
import { ACTIVITIES } from "@/lib/activityHelpers";

interface Challenge {
  question: string;
  expression: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export default function LogLaws() {
  const { playerName, addActivityScore } = usePlayer();
  const [score, setScore] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const challenges: Challenge[] = [
    {
      question: "Expand using logarithm laws:",
      expression: "log(xy)",
      options: ["log(x) + log(y)", "log(x) - log(y)", "log(x) · log(y)", "log(x) / log(y)"],
      correctIndex: 0,
      explanation: "Product Rule: log(AB) = log(A) + log(B)",
      points: 10
    },
    {
      question: "Expand using logarithm laws:",
      expression: "log(x/y)",
      options: ["log(x) + log(y)", "log(x) - log(y)", "log(x) · log(y)", "log(x) / log(y)"],
      correctIndex: 1,
      explanation: "Quotient Rule: log(A/B) = log(A) - log(B)",
      points: 10
    },
    {
      question: "Expand using logarithm laws:",
      expression: "log(x³)",
      options: ["3 + log(x)", "3 - log(x)", "3 · log(x)", "log(x) / 3"],
      correctIndex: 2,
      explanation: "Power Rule: log(A^n) = n·log(A)",
      points: 15
    },
    {
      question: "Combine into a single logarithm:",
      expression: "log(x) + log(y) + log(z)",
      options: ["log(x + y + z)", "log(xyz)", "log(x) · log(y) · log(z)", "3·log(xyz)"],
      correctIndex: 1,
      explanation: "Product Rule (reverse): log(A) + log(B) + log(C) = log(ABC)",
      points: 15
    },
    {
      question: "Combine into a single logarithm:",
      expression: "2·log(x) - log(y)",
      options: ["log(2x - y)", "log(x²/y)", "log(2x/y)", "log(x² - y)"],
      correctIndex: 1,
      explanation: "Power Rule + Quotient Rule: 2·log(x) - log(y) = log(x²) - log(y) = log(x²/y)",
      points: 20
    },
    {
      question: "Expand completely:",
      expression: "log((x²y³)/z)",
      options: [
        "2·log(x) + 3·log(y) - log(z)",
        "log(x²) + log(y³) - log(z)",
        "2·log(x) · 3·log(y) / log(z)",
        "log(2x + 3y - z)"
      ],
      correctIndex: 0,
      explanation: "Quotient Rule + Product Rule + Power Rule: log((x²y³)/z) = log(x²y³) - log(z) = log(x²) + log(y³) - log(z) = 2·log(x) + 3·log(y) - log(z)",
      points: 25
    },
    {
      question: "Combine into a single logarithm:",
      expression: "3·log(x) + 2·log(y) - 4·log(z)",
      options: ["log(3x + 2y - 4z)", "log((x³y²)/z⁴)", "log(x³ + y² - z⁴)", "log((3x·2y)/4z)"],
      correctIndex: 1,
      explanation: "Power Rule + Product/Quotient Rules: 3·log(x) + 2·log(y) - 4·log(z) = log(x³) + log(y²) - log(z⁴) = log((x³y²)/z⁴)",
      points: 30
    }
  ];
  
  const currentChallenge = challenges[challengeIndex];
  
  const checkAnswer = () => {
    if (selectedOption === null) {
      toast.error("Please select an answer first!");
      return;
    }
    
    if (selectedOption === currentChallenge.correctIndex) {
      const newScore = score + currentChallenge.points;
      setScore(newScore);
      setShowExplanation(true);
      toast.success(`Correct, ${playerName}! +${currentChallenge.points} points! 🎉`, {
        duration: 2000,
      });
      
      setTimeout(() => {
        if (challengeIndex < challenges.length - 1) {
          setChallengeIndex(challengeIndex + 1);
          setSelectedOption(null);
          setShowExplanation(false);
        } else {
          addActivityScore(ACTIVITIES["log-laws"].id, ACTIVITIES["log-laws"].name, newScore);
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
      <header className="border-b-[6px] border-foreground bg-[oklch(0.62_0.24_320)] text-white py-8">
        <div className="container">
          <Link href="/">
            <Button variant="outline" className="mb-4 border-[4px] border-white text-white hover:bg-white hover:text-[oklch(0.62_0.24_320)]">
              <ArrowLeft className="mr-2" strokeWidth={3} /> Back to Activities
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">Logarithm Laws Master</h1>
          <p className="text-xl">Expand and combine expressions using logarithm laws</p>
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

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentChallenge.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full p-4 border-[4px] border-foreground text-left font-mono text-lg transition-all ${
                    selectedOption === idx
                      ? "bg-[oklch(0.62_0.24_320)] text-white shadow-brutal-sm"
                      : "bg-white hover:bg-[oklch(0.98_0.01_90)]"
                  }`}
                >
                  {String.fromCharCode(65 + idx)}. {option}
                </button>
              ))}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <Card className="border-[4px] border-foreground p-4 mb-6 bg-[oklch(0.85_0.15_145)] flex items-start gap-3">
                <Lightbulb className="w-6 h-6 flex-shrink-0 mt-1" strokeWidth={3} />
                <div>
                  <p className="font-bold mb-1">Explanation:</p>
                  <p>{currentChallenge.explanation}</p>
                </div>
              </Card>
            )}

            {/* Check Answer Button */}
            <Button
              onClick={checkAnswer}
              disabled={selectedOption === null}
              className="w-full bg-[oklch(0.62_0.24_320)] text-white border-[4px] border-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold text-xl h-14"
            >
              Check Answer
            </Button>
          </Card>

          {/* Reference Card */}
          <Card className="border-[6px] border-foreground shadow-brutal p-6 mt-8 bg-[oklch(0.98_0.01_90)]">
            <h3 className="text-xl font-bold mb-4">Logarithm Laws Reference:</h3>
            <div className="space-y-2 font-mono">
              <p><strong>Product Rule:</strong> log(AB) = log(A) + log(B)</p>
              <p><strong>Quotient Rule:</strong> log(A/B) = log(A) - log(B)</p>
              <p><strong>Power Rule:</strong> log(A^n) = n·log(A)</p>
            </div>
          </Card>
        </div>
      </main>

      <Scoreboard
        open={showScoreboard}
        onClose={() => setShowScoreboard(false)}
        currentActivityScore={score}
        currentActivityName={ACTIVITIES["log-laws"].name}
      />
    </div>
  );
}
