/**
 * Graph Matcher Activity - Neo-Brutalist Design
 * - Bold geometric cards with thick black borders
 * - Vibrant teal color scheme
 * - Progressive difficulty from easy to hard
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { ArrowLeft, Volume2, VolumeX, Trophy } from "lucide-react";
import { toast } from "sonner";
import { usePlayer } from "@/contexts/PlayerContext";
import { useAudio } from "@/contexts/AudioContext";
import { Scoreboard } from "@/components/Scoreboard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface Challenge {
  id: number;
  difficulty: "easy" | "medium" | "hard";
  graph: { type: "exp" | "log"; a: number; b: number; h: number; k: number };
  options: string[];
  correctAnswer: string;
}

const generateGraphData = (type: "exp" | "log", a: number, b: number, h: number, k: number) => {
  const data = [];
  if (type === "exp") {
    for (let x = -5; x <= 5; x += 0.2) {
      const y = a * Math.pow(b, x - h) + k;
      if (y >= -10 && y <= 10) {
        data.push({ x: Number(x.toFixed(1)), y: Number(y.toFixed(2)) });
      }
    }
  } else {
    // logarithmic
    for (let x = 0.1; x <= 10; x += 0.2) {
      const y = a * Math.log(x - h) / Math.log(b) + k;
      if (!isNaN(y) && y >= -10 && y <= 10 && x > h) {
        data.push({ x: Number(x.toFixed(1)), y: Number(y.toFixed(2)) });
      }
    }
  }
  return data;
};

const challenges: Challenge[] = [
  // Easy - Basic exponential
  {
    id: 1,
    difficulty: "easy",
    graph: { type: "exp", a: 1, b: 2, h: 0, k: 0 },
    options: ["y = 2^x", "y = 3^x", "y = e^x", "y = (1/2)^x"],
    correctAnswer: "y = 2^x"
  },
  // Easy - Basic logarithm
  {
    id: 2,
    difficulty: "easy",
    graph: { type: "log", a: 1, b: 2, h: 0, k: 0 },
    options: ["y = log₂(x)", "y = log₃(x)", "y = ln(x)", "y = log(x)"],
    correctAnswer: "y = log₂(x)"
  },
  // Easy - Vertical shift
  {
    id: 3,
    difficulty: "easy",
    graph: { type: "exp", a: 1, b: 2, h: 0, k: 2 },
    options: ["y = 2^x + 2", "y = 2^x - 2", "y = 2^(x+2)", "y = 2^(x-2)"],
    correctAnswer: "y = 2^x + 2"
  },
  // Medium - Horizontal shift
  {
    id: 4,
    difficulty: "medium",
    graph: { type: "exp", a: 1, b: 2, h: 1, k: 0 },
    options: ["y = 2^(x-1)", "y = 2^(x+1)", "y = 2^x - 1", "y = 2^x + 1"],
    correctAnswer: "y = 2^(x-1)"
  },
  // Medium - Reflection
  {
    id: 5,
    difficulty: "medium",
    graph: { type: "exp", a: -1, b: 2, h: 0, k: 0 },
    options: ["y = -2^x", "y = 2^(-x)", "y = -(1/2)^x", "y = 2^x"],
    correctAnswer: "y = -2^x"
  },
  // Medium - Vertical stretch
  {
    id: 6,
    difficulty: "medium",
    graph: { type: "log", a: 2, b: 2, h: 0, k: 0 },
    options: ["y = 2·log₂(x)", "y = log₂(2x)", "y = log₂(x) + 2", "y = log₂(x²)"],
    correctAnswer: "y = 2·log₂(x)"
  },
  // Hard - Multiple transformations
  {
    id: 7,
    difficulty: "hard",
    graph: { type: "exp", a: 2, b: 2, h: -1, k: 3 },
    options: ["y = 2·2^(x+1) + 3", "y = 2·2^(x-1) + 3", "y = 2·2^x + 4", "y = 2^(x+1) + 3"],
    correctAnswer: "y = 2·2^(x+1) + 3"
  },
  // Hard - Log with transformations
  {
    id: 8,
    difficulty: "hard",
    graph: { type: "log", a: -1, b: 2, h: 0, k: 2 },
    options: ["y = -log₂(x) + 2", "y = log₂(-x) + 2", "y = -log₂(x+2)", "y = log₂(x) - 2"],
    correctAnswer: "y = -log₂(x) + 2"
  },
  // Hard - Complex exponential
  {
    id: 9,
    difficulty: "hard",
    graph: { type: "exp", a: 0.5, b: 3, h: 1, k: -1 },
    options: ["y = 0.5·3^(x-1) - 1", "y = 0.5·3^(x+1) - 1", "y = 3^(x-1) - 0.5", "y = 0.5·3^x - 1"],
    correctAnswer: "y = 0.5·3^(x-1) - 1"
  },
  // Hard - Complex logarithm
  {
    id: 10,
    difficulty: "hard",
    graph: { type: "log", a: 3, b: 2, h: 1, k: -2 },
    options: ["y = 3·log₂(x-1) - 2", "y = 3·log₂(x+1) - 2", "y = 3·log₂(x) - 3", "y = log₂(3x-1) - 2"],
    correctAnswer: "y = 3·log₂(x-1) - 2"
  }
];

// Shuffle array helper function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function GraphMatcher() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  
  const { playerName, addActivityScore } = usePlayer();
  const { isMuted, toggleMute, playGameMusic } = useAudio();

  const challenge = challenges[currentChallenge];
  const graphData = generateGraphData(
    challenge.graph.type,
    challenge.graph.a,
    challenge.graph.b,
    challenge.graph.h,
    challenge.graph.k
  );

  // Shuffle options when challenge changes
  useEffect(() => {
    setShuffledOptions(shuffleArray(challenge.options));
  }, [currentChallenge]);

  useEffect(() => {
    playGameMusic();
  }, []);

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      toast.error("Please select an answer first!");
      return;
    }

    setShowResult(true);
    const isCorrect = selectedAnswer === challenge.correctAnswer;

    if (isCorrect) {
      const points = challenge.difficulty === "easy" ? 10 : challenge.difficulty === "medium" ? 20 : 30;
      setScore(score + points);
      toast.success(`Correct, ${playerName}! +${points} points! 🎉`);
    } else {
      toast.error(`Not quite, ${playerName}. The correct answer is: ${challenge.correctAnswer}`);
    }
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      // Options will be shuffled by useEffect
    } else {
      setCompleted(true);
      addActivityScore("graph-matcher", "Graph Matcher Challenge", score);
      setShowScoreboard(true);
      toast.success(`🎊 Congratulations, ${playerName}! You've completed all challenges! Final Score: ${score}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-[oklch(0.65_0.20_145)]"; // green
      case "medium": return "bg-[oklch(0.70_0.20_60)]"; // orange
      case "hard": return "bg-[oklch(0.60_0.25_0)]"; // red
      default: return "bg-[oklch(0.55_0.25_190)]";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="border-b-[6px] border-foreground bg-[oklch(0.55_0.25_190)] text-white py-8 relative">
        <div className="container">
          <Link href="/">
            <Button
              variant="outline"
              className="absolute top-4 left-4 md:top-8 md:left-8 border-[4px] border-white text-white hover:bg-white hover:text-[oklch(0.55_0.25_190)] font-bold"
            >
              <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={3} />
              Back to Activities
            </Button>
          </Link>
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 md:top-8 md:right-8 p-3 border-[4px] border-white hover:bg-white hover:text-[oklch(0.55_0.25_190)] transition-colors"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-6 h-6" strokeWidth={3} /> : <Volume2 className="w-6 h-6" strokeWidth={3} />}
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
            Graph Matcher Challenge
          </h1>
          <p className="text-xl md:text-2xl font-medium">
            Match transformed graphs to their equations
          </p>
          <p className="text-lg md:text-xl mt-2 font-bold">
            Player: {playerName}
          </p>
        </div>
      </header>

      <div className="container mt-8">
        {!completed ? (
          <>
            {/* Progress Bar */}
            <Card className="border-[6px] border-foreground shadow-brutal mb-8 p-6 bg-[oklch(0.70_0.20_60)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8" strokeWidth={3} />
                  <span className="text-2xl font-bold">Score: {score}</span>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-4 py-2 border-[4px] border-foreground ${getDifficultyColor(challenge.difficulty)} font-bold text-lg`}>
                    {challenge.difficulty.toUpperCase()}
                  </div>
                  <div className="text-lg font-bold mt-2">
                    Challenge {currentChallenge + 1} of {challenges.length}
                  </div>
                </div>
              </div>
            </Card>

            {/* Graph Display */}
            <Card className="border-[6px] border-foreground shadow-brutal mb-8 p-6 bg-card">
              <h2 className="text-2xl font-bold mb-4">Which equation matches this graph?</h2>
              <div className="bg-white border-[4px] border-foreground p-4">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={graphData}>
                    <CartesianGrid strokeWidth={2} stroke="#000" />
                    <XAxis
                      dataKey="x"
                      stroke="#000"
                      strokeWidth={2}
                      domain={challenge.graph.type === "log" ? [0, 10] : [-5, 5]}
                      ticks={challenge.graph.type === "log" ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]}
                    />
                    <YAxis
                      stroke="#000"
                      strokeWidth={2}
                      domain={[-10, 10]}
                      ticks={[-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10]}
                    />
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="#6366f1"
                      strokeWidth={4}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Answer Options */}
            <Card className="border-[6px] border-foreground shadow-brutal mb-8 p-6 bg-card">
              <h3 className="text-xl font-bold mb-4">Select the correct equation:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shuffledOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showResult}
                    className={`p-6 border-[4px] border-foreground font-mono text-xl font-bold transition-all ${
                      selectedAnswer === option
                        ? "bg-[oklch(0.55_0.25_190)] text-white scale-105"
                        : "bg-muted hover:bg-[oklch(0.55_0.25_190)] hover:text-white"
                    } ${showResult && option === challenge.correctAnswer ? "bg-[oklch(0.65_0.20_145)] text-white" : ""}
                    ${showResult && selectedAnswer === option && option !== challenge.correctAnswer ? "bg-[oklch(0.60_0.25_0)] text-white" : ""}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              {!showResult ? (
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  className="border-[4px] border-foreground bg-[oklch(0.55_0.25_190)] hover:bg-[oklch(0.50_0.25_190)] text-white font-bold text-xl px-12 py-6 shadow-brutal"
                >
                  Check Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="border-[4px] border-foreground bg-[oklch(0.65_0.20_145)] hover:bg-[oklch(0.60_0.20_145)] text-white font-bold text-xl px-12 py-6 shadow-brutal"
                >
                  {currentChallenge < challenges.length - 1 ? "Next Challenge" : "Finish"}
                </Button>
              )}
            </div>
          </>
        ) : (
          <Card className="border-[6px] border-foreground shadow-brutal p-8 bg-card text-center">
            <Trophy className="w-24 h-24 mx-auto mb-6 text-[oklch(0.70_0.20_60)]" strokeWidth={3} />
            <h2 className="text-4xl font-bold mb-4">Challenge Complete!</h2>
            <p className="text-2xl mb-6">
              Great job, {playerName}! Final Score: <span className="font-bold text-[oklch(0.55_0.25_190)]">{score}</span>
            </p>
            <Link href="/">
              <Button
                size="lg"
                className="border-[4px] border-foreground bg-[oklch(0.55_0.25_190)] hover:bg-[oklch(0.50_0.25_190)] text-white font-bold text-xl px-12 py-6 shadow-brutal"
              >
                Back to Activities
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {showScoreboard && <Scoreboard open={showScoreboard} onClose={() => setShowScoreboard(false)} currentActivityScore={score} currentActivityName="Graph Matcher Challenge" />}
    </div>
  );
}
