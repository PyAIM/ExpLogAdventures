/**
 * Equation Solver Challenge - Activity 8
 * - Solve logarithmic and exponential equations algebraically
 * - Apply logarithm properties and exponential rules
 * - Multi-step algebraic manipulation
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
  equation: string;
  answer: number;
  explanation: string;
  points: number;
  tolerance?: number;
}

export default function EquationSolver() {
  const { playerName, addActivityScore } = usePlayer();
  const [score, setScore] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  
  const challenges: Challenge[] = [
    {
      question: "Solve for x:",
      equation: "2^x = 8",
      answer: 3,
      explanation: "Since 2³ = 8, we have x = 3. Or take log of both sides: x·log(2) = log(8), so x = log(8)/log(2) = 3",
      points: 10
    },
    {
      question: "Solve for x:",
      equation: "log₂(x) = 4",
      answer: 16,
      explanation: "Convert to exponential form: x = 2⁴ = 16",
      points: 10
    },
    {
      question: "Solve for x:",
      equation: "e^x = 20",
      answer: roundTo(Math.log(20), 2),
      explanation: `Take natural log of both sides: ln(e^x) = ln(20), so x = ln(20) ≈ ${roundTo(Math.log(20), 2)}`,
      points: 15,
      tolerance: 0.1
    },
    {
      question: "Solve for x:",
      equation: "ln(x) = 2",
      answer: roundTo(Math.E ** 2, 2),
      explanation: `Convert to exponential form: x = e² ≈ ${roundTo(Math.E ** 2, 2)}`,
      points: 15,
      tolerance: 0.1
    },
    {
      question: "Solve for x:",
      equation: "3^(x+1) = 27",
      answer: 2,
      explanation: "Since 27 = 3³, we have 3^(x+1) = 3³, so x+1 = 3, thus x = 2",
      points: 20
    },
    {
      question: "Solve for x:",
      equation: "log(x) + log(x-3) = 1",
      answer: 5,
      explanation: "Combine logs: log(x(x-3)) = 1. Convert to exponential: x(x-3) = 10¹ = 10. Solve: x² - 3x - 10 = 0, (x-5)(x+2) = 0. Since x > 0, x = 5",
      points: 25
    },
    {
      question: "Solve for x:",
      equation: "2^(2x) = 32",
      answer: 2.5,
      explanation: "Since 32 = 2⁵, we have 2^(2x) = 2⁵, so 2x = 5, thus x = 2.5",
      points: 20
    },
    {
      question: "Solve for x:",
      equation: "ln(x+1) - ln(x) = ln(3)",
      answer: 0.5,
      explanation: "Use quotient rule: ln((x+1)/x) = ln(3). So (x+1)/x = 3. Solve: x+1 = 3x, thus 1 = 2x, x = 0.5",
      points: 25
    },
    {
      question: "Solve for x:",
      equation: "5^x = 100",
      answer: roundTo(Math.log(100) / Math.log(5), 2),
      explanation: `Take log of both sides: x·log(5) = log(100), so x = log(100)/log(5) = 2/log(5) ≈ ${roundTo(Math.log(100) / Math.log(5), 2)}`,
      points: 30,
      tolerance: 0.1
    },
    {
      question: "Solve for x:",
      equation: "log₃(x²) = 4",
      answer: 9,
      explanation: "Convert to exponential: x² = 3⁴ = 81. So x = ±9. Since logarithms require positive arguments, x = 9",
      points: 25
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
      toast.success(`Excellent work, ${playerName}! +${currentChallenge.points} points! 🎉`, {
        duration: 2000,
      });
      
      setTimeout(() => {
        if (challengeIndex < challenges.length - 1) {
          setChallengeIndex(challengeIndex + 1);
          setUserAnswer("");
          setShowExplanation(false);
        } else {
          addActivityScore(ACTIVITIES["equation-solver"].id, ACTIVITIES["equation-solver"].name, newScore);
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
      <header className="border-b-[6px] border-foreground bg-[oklch(0.58_0.22_15)] text-white py-8">
        <div className="container">
          <Link href="/">
            <Button variant="outline" className="mb-4 border-[4px] border-white text-white hover:bg-white hover:text-[oklch(0.58_0.22_15)]">
              <ArrowLeft className="mr-2" strokeWidth={3} /> Back to Activities
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">Equation Solver Challenge</h1>
          <p className="text-xl">Solve logarithmic and exponential equations algebraically</p>
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
            
            {/* Equation Display */}
            <div className="bg-[oklch(0.98_0.01_90)] border-[4px] border-foreground p-6 mb-6 text-center">
              <p className="text-3xl font-mono font-bold">{currentChallenge.equation}</p>
            </div>

            {/* Answer Input */}
            <div className="mb-6">
              <label className="block text-lg font-bold mb-2">x =</label>
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
                placeholder="Enter your answer..."
                className="h-14 text-xl border-[4px] border-foreground font-mono"
                step="any"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Round to 2 decimal places if necessary
              </p>
            </div>

            {/* Explanation */}
            {showExplanation && (
              <Card className="border-[4px] border-foreground p-4 mb-6 bg-[oklch(0.85_0.15_145)] flex items-start gap-3">
                <Lightbulb className="w-6 h-6 flex-shrink-0 mt-1" strokeWidth={3} />
                <div>
                  <p className="font-bold mb-1">Solution:</p>
                  <p>{currentChallenge.explanation}</p>
                </div>
              </Card>
            )}

            {/* Check Answer Button */}
            <Button
              onClick={checkAnswer}
              disabled={!userAnswer}
              className="w-full bg-[oklch(0.58_0.22_15)] text-white border-[4px] border-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold text-xl h-14"
            >
              Check Answer
            </Button>
          </Card>

          {/* Strategy Tips */}
          <Card className="border-[6px] border-foreground shadow-brutal p-6 mt-8 bg-[oklch(0.98_0.01_90)]">
            <h3 className="text-xl font-bold mb-4">Solving Strategies:</h3>
            <div className="space-y-2">
              <p><strong>Exponential Equations:</strong> Take log of both sides or rewrite with same base</p>
              <p><strong>Logarithmic Equations:</strong> Combine logs, then convert to exponential form</p>
              <p><strong>Check Your Answer:</strong> Substitute back into the original equation</p>
            </div>
          </Card>
        </div>
      </main>

      <Scoreboard
        open={showScoreboard}
        onClose={() => setShowScoreboard(false)}
        currentActivityScore={score}
        currentActivityName={ACTIVITIES["equation-solver"].name}
      />
    </div>
  );
}
