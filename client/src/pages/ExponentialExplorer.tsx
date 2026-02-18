/* Exponential Explorer Activity:
 * - Interactive graph manipulation to master f(x) = a·b^x
 * - Adjust parameters a and b with sliders
 * - Visual feedback on growth vs decay
 * - Points/badges for identifying properties
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Link } from "wouter";
import { ArrowLeft, Trophy, Star, Volume2, VolumeX } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";
import { toast } from "sonner";
import { usePlayer } from "@/contexts/PlayerContext";
import { useAudio } from "@/contexts/AudioContext";
import { Scoreboard } from "@/components/Scoreboard";
import { ACTIVITIES, randomExcluding } from "@/lib/activityHelpers";

export default function ExponentialExplorer() {
  const { playerName, addActivityScore } = usePlayer();
  const { isMuted, toggleMute, playGameMusic } = useAudio();
  // Initial state: b = 1 (constant function, not growth or decay)
  // This ensures the first challenge is not already satisfied
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [score, setScore] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [showScoreboard, setShowScoreboard] = useState(false);
  
  useEffect(() => {
    playGameMusic();
  }, []);
  
  const challenges = [
    { question: "Create an exponential GROWTH function (b > 1)", checkFn: () => b > 1, points: 10 },
    { question: "Create an exponential DECAY function (0 < b < 1)", checkFn: () => b > 0 && b < 1, points: 10 },
    { question: "Make the y-intercept equal to 3 (hint: adjust 'a')", checkFn: () => Math.abs(a - 3) < 0.1, points: 15 },
    { question: "Create a function that passes through (0, -2)", checkFn: () => Math.abs(a - (-2)) < 0.1, points: 15 },
    { question: "Make a steep growth curve (b > 3)", checkFn: () => b > 3, points: 20 }
  ];
  
  const currentChallenge = challenges[challengeIndex];
  
  // Generate data points for the graph
  const generateData = () => {
    const points = [];
    for (let x = -3; x <= 3; x += 0.2) {
      const y = a * Math.pow(b, x);
      // Clamp y values to prevent overflow
      const clampedY = Math.max(-10, Math.min(10, y));
      points.push({ x: Number(x.toFixed(1)), y: Number(clampedY.toFixed(2)) });
    }
    return points;
  };
  
  const data = generateData();
  
  const checkAnswer = () => {
    if (currentChallenge.checkFn()) {
      setScore(score + currentChallenge.points);
      toast.success(`Correct, ${playerName}! +${currentChallenge.points} points! 🎉`, {
        duration: 2000,
      });
      
      if (challengeIndex < challenges.length - 1) {
        setTimeout(() => {
          setChallengeIndex(challengeIndex + 1);
        }, 1500);
      } else {
        const finalScore = score + currentChallenge.points;
        setTimeout(() => {
          addActivityScore(ACTIVITIES["exponential-explorer"].id, ACTIVITIES["exponential-explorer"].name, finalScore);
          setShowScoreboard(true);
        }, 1500);
      }
    } else {
      toast.error("Not quite! Try adjusting the sliders.", {
        duration: 2000,
      });
    }
  };
  
  const functionType = b > 1 ? "Exponential Growth" : b === 1 ? "Constant Function" : "Exponential Decay";
  const yIntercept = a;
  const horizontalAsymptote = a > 0 ? "y = 0" : "y = 0";
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-[6px] border-foreground bg-[oklch(0.55_0.25_265)] text-white py-8 relative">
        <div className="container">
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 p-3 border-[4px] border-white hover:bg-white hover:text-[oklch(0.55_0.25_265)] transition-colors"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-6 h-6" strokeWidth={3} /> : <Volume2 className="w-6 h-6" strokeWidth={3} />}
          </button>
          <Link href="/">
            <Button variant="outline" className="mb-4 border-[4px] border-white bg-transparent text-white hover:bg-white hover:text-[oklch(0.55_0.25_265)] font-bold">
              <ArrowLeft className="mr-2" /> Back to Activities
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">Exponential Explorer</h1>
          <p className="text-xl">Master f(x) = a·b^x by adjusting the parameters</p>
          {playerName && (
            <p className="text-lg mt-2">Player: <span className="font-bold">{playerName}</span></p>
          )}
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Controls and Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Score Card */}
            <Card className="border-[6px] border-foreground shadow-brutal-blue p-6 bg-[oklch(0.70_0.20_55)]">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-8 h-8" strokeWidth={3} />
                <h2 className="text-3xl font-bold">Score</h2>
              </div>
              <p className="text-5xl font-bold mono">{score}</p>
            </Card>
            
            {/* Challenge Card */}
            <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-[oklch(0.70_0.20_55)]" strokeWidth={3} />
                <h3 className="text-xl font-bold">Challenge {challengeIndex + 1}/{challenges.length}</h3>
              </div>
              <p className="text-lg font-medium mb-6">{currentChallenge.question}</p>
              <Button 
                onClick={checkAnswer}
                className="w-full bg-[oklch(0.55_0.25_265)] text-white border-[4px] border-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold text-lg h-12"
              >
                Check Answer
              </Button>
            </Card>
            
            {/* Controls Card */}
            <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-card">
              <h3 className="text-2xl font-bold mb-6">Adjust Parameters</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-bold mb-2">
                    a = <span className="mono text-[oklch(0.55_0.25_265)]">{a.toFixed(1)}</span>
                  </label>
                  <p className="text-sm text-muted-foreground mb-3">Controls y-intercept and vertical stretch</p>
                  <Slider
                    value={[a]}
                    onValueChange={(val) => setA(val[0])}
                    min={-5}
                    max={5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-bold mb-2">
                    b = <span className="mono text-[oklch(0.60_0.25_310)]">{b.toFixed(1)}</span>
                  </label>
                  <p className="text-sm text-muted-foreground mb-3">Controls growth/decay rate</p>
                  <Slider
                    value={[b]}
                    onValueChange={(val) => setB(val[0])}
                    min={0.1}
                    max={5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>
            
            {/* Properties Card */}
            <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-[oklch(0.98_0.01_90)]">
              <h3 className="text-xl font-bold mb-4">Function Properties</h3>
              <div className="space-y-3 mono text-sm">
                <div className="flex justify-between">
                  <span className="font-bold">Type:</span>
                  <span className={b > 1 ? "text-[oklch(0.65_0.20_145)]" : b < 1 ? "text-[oklch(0.65_0.22_35)]" : ""}>{functionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">y-intercept:</span>
                  <span>({0}, {yIntercept.toFixed(1)})</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">H. Asymptote:</span>
                  <span>{horizontalAsymptote}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Domain:</span>
                  <span>(-∞, ∞)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Range:</span>
                  <span>{a > 0 ? "(0, ∞)" : "(-∞, 0)"}</span>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Right Column: Graph */}
          <div className="lg:col-span-2">
            <Card className="border-[6px] border-foreground shadow-brutal-blue p-6 bg-card h-full">
              <div className="mb-4">
                <h2 className="text-3xl font-bold mb-2">f(x) = <span className="text-[oklch(0.55_0.25_265)]">{a.toFixed(1)}</span> · <span className="text-[oklch(0.60_0.25_310)]">{b.toFixed(1)}</span><sup>x</sup></h2>
              </div>
              
              <div className="h-[600px] border-[4px] border-foreground bg-white p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeWidth={2} stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="x" 
                      stroke="#000" 
                      strokeWidth={3}
                      label={{ value: 'x', position: 'insideBottomRight', offset: -10, style: { fontSize: 18, fontWeight: 'bold' } }}
                    />
                    <YAxis 
                      stroke="#000" 
                      strokeWidth={3}
                      label={{ value: 'y', angle: -90, position: 'insideLeft', style: { fontSize: 18, fontWeight: 'bold' } }}
                      domain={[-10, 10]}
                    />
                    <ReferenceLine y={0} stroke="#000" strokeWidth={2} />
                    <ReferenceLine x={0} stroke="#000" strokeWidth={2} />
                    <Line 
                      type="monotone" 
                      dataKey="y" 
                      stroke="oklch(0.55 0.25 265)" 
                      strokeWidth={4} 
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <Scoreboard
        open={showScoreboard}
        onClose={() => setShowScoreboard(false)}
        currentActivityScore={score}
        currentActivityName={ACTIVITIES["exponential-explorer"].name}
      />
    </div>
  );
}
