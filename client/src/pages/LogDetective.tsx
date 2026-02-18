/* Log Detective Activity:
 * - Match exponential and logarithmic forms
 * - Drag-and-drop or click-to-match interface
 * - Timed challenges with increasing difficulty
 * - Visual representation of inverse relationship
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Trophy, Clock, CheckCircle2, XCircle, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { usePlayer } from "@/contexts/PlayerContext";
import { useAudio } from "@/contexts/AudioContext";
import { Scoreboard } from "@/components/Scoreboard";
import { ACTIVITIES } from "@/lib/activityHelpers";

interface Problem {
  exponential: string;
  logarithmic: string;
  id: number;
}

const problemSets: Problem[][] = [
  // Level 1: Basic conversions
  [
    { id: 1, exponential: "2³ = 8", logarithmic: "log₂(8) = 3" },
    { id: 2, exponential: "10² = 100", logarithmic: "log(100) = 2" },
    { id: 3, exponential: "5² = 25", logarithmic: "log₅(25) = 2" },
  ],
  // Level 2: With variables
  [
    { id: 4, exponential: "bˣ = y", logarithmic: "log_b(y) = x" },
    { id: 5, exponential: "e^t = z", logarithmic: "ln(z) = t" },
    { id: 6, exponential: "3^(2x) = 9", logarithmic: "log₃(9) = 2x" },
  ],
  // Level 3: Negative and fractional exponents
  [
    { id: 7, exponential: "2⁻³ = 1/8", logarithmic: "log₂(1/8) = -3" },
    { id: 8, exponential: "4^(1/2) = 2", logarithmic: "log₄(2) = 1/2" },
    { id: 9, exponential: "10⁻² = 0.01", logarithmic: "log(0.01) = -2" },
  ],
];

export default function LogDetective() {
  const { playerName, addActivityScore } = usePlayer();
  const { isMuted, toggleMute, playGameMusic } = useAudio();
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedExp, setSelectedExp] = useState<number | null>(null);
  const [selectedLog, setSelectedLog] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [isActive, setIsActive] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  
  useEffect(() => {
    playGameMusic();
  }, []);
  
  const currentProblems = problemSets[level];
  
  // Shuffle arrays for display
  const [shuffledExp, setShuffledExp] = useState<Problem[]>([]);
  const [shuffledLog, setShuffledLog] = useState<Problem[]>([]);
  
  useEffect(() => {
    setShuffledExp([...currentProblems].sort(() => Math.random() - 0.5));
    setShuffledLog([...currentProblems].sort(() => Math.random() - 0.5));
  }, [level]);
  
  // Timer
  useEffect(() => {
    if (!isActive) return;
    
    if (timeLeft <= 0) {
      setIsActive(false);
      toast.error("Time's up! Try again!", { duration: 3000 });
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(time => time - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, isActive]);
  
  const startGame = () => {
    setIsActive(true);
    setTimeLeft(60);
    setScore(0);
    setLevel(0);
    setMatched(new Set());
    setSelectedExp(null);
    setSelectedLog(null);
  };
  
  const handleExpClick = (id: number) => {
    if (matched.has(id)) return;
    setSelectedExp(id);
    
    if (selectedLog !== null) {
      checkMatch(id, selectedLog);
    }
  };
  
  const handleLogClick = (id: number) => {
    if (matched.has(id)) return;
    setSelectedLog(id);
    
    if (selectedExp !== null) {
      checkMatch(selectedExp, id);
    }
  };
  
  const checkMatch = (expId: number, logId: number) => {
    if (expId === logId) {
      // Correct match!
      const newMatched = new Set(matched);
      newMatched.add(expId);
      setMatched(newMatched);
      setScore(score + 10 + timeLeft); // Bonus for speed
      
      toast.success(`Perfect match, ${playerName}! 🎯`, { duration: 1500 });
      
      // Check if level complete
      if (newMatched.size === currentProblems.length) {
        if (level < problemSets.length - 1) {
          setTimeout(() => {
            setLevel(level + 1);
            setMatched(new Set());
            setTimeLeft(timeLeft + 20); // Bonus time for next level
            toast.success("Level Complete! Moving to next level! 🎉", { duration: 2000 });
          }, 1000);
        } else {
          const finalScore = score + 10 + timeLeft;
          setTimeout(() => {
            setIsActive(false);
            addActivityScore(ACTIVITIES["log-detective"].id, ACTIVITIES["log-detective"].name, finalScore);
            setShowScoreboard(true);
          }, 1000);
        }
      }
    } else {
      // Wrong match
      toast.error("Not a match! Try again.", { duration: 1500 });
      setTimeLeft(Math.max(0, timeLeft - 3)); // Time penalty
    }
    
    setSelectedExp(null);
    setSelectedLog(null);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-[6px] border-foreground bg-[oklch(0.60_0.25_310)] text-white py-8 relative">
        <div className="container">
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 p-3 border-[4px] border-white hover:bg-white hover:text-[oklch(0.60_0.25_310)] transition-colors"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-6 h-6" strokeWidth={3} /> : <Volume2 className="w-6 h-6" strokeWidth={3} />}
          </button>
          <Link href="/">
            <Button variant="outline" className="mb-4 border-[4px] border-white bg-transparent text-white hover:bg-white hover:text-[oklch(0.60_0.25_310)] font-bold">
              <ArrowLeft className="mr-2" /> Back to Activities
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">Log Detective</h1>
          <p className="text-xl">Match exponential and logarithmic forms to crack the code!</p>
          {playerName && (
            <p className="text-lg mt-2">Player: <span className="font-bold">{playerName}</span></p>
          )}
        </div>
      </header>

      <main className="container py-8">
        {!isActive ? (
          <div className="max-w-2xl mx-auto">
            <Card className="border-[6px] border-foreground shadow-brutal-purple p-8 bg-card text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Investigate?</h2>
              <p className="text-lg mb-6">
                Match exponential forms with their logarithmic equivalents. Work fast for bonus points!
              </p>
              <div className="bg-[oklch(0.98_0.01_90)] border-[4px] border-foreground p-6 mb-6">
                <h3 className="font-bold text-xl mb-3">How to Play:</h3>
                <ul className="text-left space-y-2 text-base">
                  <li>• Click an exponential form, then click its matching logarithmic form</li>
                  <li>• Correct matches earn points + time bonus</li>
                  <li>• Wrong matches cost you 3 seconds</li>
                  <li>• Complete all 3 levels before time runs out!</li>
                </ul>
              </div>
              <Button 
                onClick={startGame}
                className="bg-[oklch(0.60_0.25_310)] text-white border-[4px] border-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold text-xl h-14 px-12"
              >
                Start Investigation
              </Button>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-[6px] border-foreground shadow-brutal p-4 bg-[oklch(0.70_0.20_55)]">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8" strokeWidth={3} />
                  <div>
                    <p className="text-sm font-bold">Score</p>
                    <p className="text-3xl font-bold mono">{score}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="border-[6px] border-foreground shadow-brutal p-4 bg-[oklch(0.55_0.25_265)] text-white">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8" strokeWidth={3} />
                  <div>
                    <p className="text-sm font-bold">Time Left</p>
                    <p className="text-3xl font-bold mono">{timeLeft}s</p>
                  </div>
                </div>
              </Card>
              
              <Card className="border-[6px] border-foreground shadow-brutal p-4 bg-card">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-[oklch(0.65_0.20_145)]" strokeWidth={3} />
                  <div>
                    <p className="text-sm font-bold">Level {level + 1}/3</p>
                    <p className="text-3xl font-bold mono">{matched.size}/{currentProblems.length}</p>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Matching Game */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Exponential Forms */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-center">Exponential Form</h3>
                <div className="space-y-4">
                  {shuffledExp.map((problem) => (
                    <Button
                      key={problem.id}
                      onClick={() => handleExpClick(problem.id)}
                      disabled={matched.has(problem.id)}
                      className={`w-full h-20 text-xl font-bold border-[4px] border-foreground transition-all ${
                        matched.has(problem.id)
                          ? "bg-[oklch(0.65_0.20_145)] text-white shadow-none"
                          : selectedExp === problem.id
                          ? "bg-[oklch(0.65_0.22_35)] text-white shadow-brutal-orange translate-x-0 translate-y-0"
                          : "bg-card text-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                      }`}
                    >
                      {matched.has(problem.id) && <CheckCircle2 className="mr-2" />}
                      <span className="mono">{problem.exponential}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Logarithmic Forms */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-center">Logarithmic Form</h3>
                <div className="space-y-4">
                  {shuffledLog.map((problem) => (
                    <Button
                      key={problem.id}
                      onClick={() => handleLogClick(problem.id)}
                      disabled={matched.has(problem.id)}
                      className={`w-full h-20 text-xl font-bold border-[4px] border-foreground transition-all ${
                        matched.has(problem.id)
                          ? "bg-[oklch(0.65_0.20_145)] text-white shadow-none"
                          : selectedLog === problem.id
                          ? "bg-[oklch(0.60_0.25_310)] text-white shadow-brutal-purple translate-x-0 translate-y-0"
                          : "bg-card text-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                      }`}
                    >
                      {matched.has(problem.id) && <CheckCircle2 className="mr-2" />}
                      <span className="mono">{problem.logarithmic}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Scoreboard
        open={showScoreboard}
        onClose={() => setShowScoreboard(false)}
        currentActivityScore={score}
        currentActivityName={ACTIVITIES["log-detective"].name}
      />
    </div>
  );
}
