/* Carbon Dating Lab Activity:
 * - Exponential decay in radioactive materials
 * - Solve for age of artifacts using half-life
 * - Interactive timeline visualization
 * - Scientific discovery theme
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { ArrowLeft, Microscope, Award, Calendar, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useAudio } from "@/contexts/AudioContext";
import { Scoreboard } from "@/components/Scoreboard";
import { ACTIVITIES, roundTo } from "@/lib/activityHelpers";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import { toast } from "sonner";

interface Artifact {
  name: string;
  description: string;
  percentRemaining: number;
  actualAge: number;
  icon: string;
  discovered: boolean;
}

const artifacts: Artifact[] = [
  {
    name: "Ancient Pottery",
    description: "Clay vessel from early civilization",
    percentRemaining: 88.4,
    actualAge: 1000,
    icon: "🏺",
    discovered: false
  },
  {
    name: "Wooden Tool",
    description: "Primitive hunting implement",
    percentRemaining: 70.7,
    actualAge: 2865,
    icon: "🪓",
    discovered: false
  },
  {
    name: "Bone Fragment",
    description: "Remains of ancient animal",
    percentRemaining: 50.0,
    actualAge: 5730,
    icon: "🦴",
    discovered: false
  },
  {
    name: "Cave Painting Charcoal",
    description: "Pigment from prehistoric art",
    percentRemaining: 25.0,
    actualAge: 11460,
    icon: "🎨",
    discovered: false
  },
  {
    name: "Fossilized Plant",
    description: "Ancient vegetation sample",
    percentRemaining: 12.5,
    actualAge: 17190,
    icon: "🌿",
    discovered: false
  }
];

const HALF_LIFE = 5730; // Carbon-14 half-life in years

export default function CarbonDating() {
  const { playerName, addActivityScore } = usePlayer();
  const { isMuted, toggleMute, playGameMusic } = useAudio();
  const [selectedArtifact, setSelectedArtifact] = useState(0);
  const [ageGuess, setAgeGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [discoveredArtifacts, setDiscoveredArtifacts] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [showScoreboard, setShowScoreboard] = useState(false);
  
  useEffect(() => {
    playGameMusic();
  }, []);
  
  const artifact = artifacts[selectedArtifact];
  
  // Calculate age from percent remaining: t = (ln(N/N₀) / ln(0.5)) × t_half
  const calculateAge = (percentRemaining: number) => {
    return (Math.log(percentRemaining / 100) / Math.log(0.5)) * HALF_LIFE;
  };
  
  // Generate decay curve data
  const generateDecayData = () => {
    const data = [];
    const maxYears = 25000;
    const steps = 50;
    
    for (let i = 0; i <= steps; i++) {
      const years = (maxYears / steps) * i;
      const halfLives = years / HALF_LIFE;
      const percentRemaining = 100 * Math.pow(0.5, halfLives);
      data.push({
        years: Math.round(years),
        percent: percentRemaining
      });
    }
    return data;
  };
  
  const decayData = generateDecayData();
  
  const handleSubmit = () => {
    const guessNum = parseInt(ageGuess);
    
    if (isNaN(guessNum) || guessNum <= 0) {
      toast.error("Please enter a valid age!");
      return;
    }
    
    setRevealed(true);
    
    const percentError = Math.abs((guessNum - artifact.actualAge) / artifact.actualAge) * 100;
    
    let points = 0;
    let message = "";
    
    if (percentError < 5) {
      points = 100;
      message = "🏆 Exceptional! You're a master archaeologist!";
    } else if (percentError < 15) {
      points = 60;
      message = "🎯 Excellent work! Very accurate dating!";
    } else if (percentError < 30) {
      points = 30;
      message = "👍 Good job! Close estimate!";
    } else {
      points = 10;
      message = "📊 Keep learning! Try the formula again.";
    }
    
    // Mark artifact as discovered
    let newDiscovered = new Set(discoveredArtifacts);
    if (!discoveredArtifacts.has(selectedArtifact)) {
      newDiscovered.add(selectedArtifact);
      setDiscoveredArtifacts(newDiscovered);
      points += 20; // Bonus for first discovery
      message += " +20 Discovery Bonus!";
    }
    
    setScore(score + points);
    toast.success(`${message}, ${playerName}! +${points} points`, { duration: 3000 });
    
    // Show scoreboard after discovering all artifacts
    if (newDiscovered.size === artifacts.length) {
      setTimeout(() => {
        addActivityScore(ACTIVITIES["carbon-dating"].id, ACTIVITIES["carbon-dating"].name, score + points);
        setShowScoreboard(true);
      }, 2000);
    }
  };
  
  const nextArtifact = () => {
    setSelectedArtifact((selectedArtifact + 1) % artifacts.length);
    setAgeGuess("");
    setRevealed(false);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-[6px] border-foreground bg-[oklch(0.65_0.18_40)] text-white py-8 relative">
        <div className="container">
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 p-3 border-[4px] border-white hover:bg-white hover:text-[oklch(0.65_0.18_40)] transition-colors"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-6 h-6" strokeWidth={3} /> : <Volume2 className="w-6 h-6" strokeWidth={3} />}
          </button>
          <Link href="/">
            <Button variant="outline" className="mb-4 border-[4px] border-white bg-transparent text-white hover:bg-white hover:text-[oklch(0.65_0.18_40)] font-bold">
              <ArrowLeft className="mr-2" /> Back to Activities
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">Carbon Dating Lab</h1>
          <p className="text-xl">Uncover ancient secrets using exponential decay!</p>
          {playerName && (
            <p className="text-lg mt-2">Player: <span className="font-bold">{playerName}</span></p>
          )}
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Artifacts & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Score & Discoveries */}
            <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-[oklch(0.70_0.20_55)]">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8" strokeWidth={3} />
                <h2 className="text-2xl font-bold">Lab Progress</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Score:</span>
                  <span className="text-3xl font-bold mono">{score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">Discoveries:</span>
                  <span className="text-2xl font-bold mono">{discoveredArtifacts.size}/{artifacts.length}</span>
                </div>
              </div>
            </Card>
            
            {/* Artifact Selection */}
            <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-card">
              <h3 className="text-2xl font-bold mb-4">Select Artifact</h3>
              <div className="space-y-3">
                {artifacts.map((a, idx) => (
                  <Button
                    key={idx}
                    onClick={() => {
                      setSelectedArtifact(idx);
                      setAgeGuess("");
                      setRevealed(false);
                    }}
                    className={`w-full h-auto py-3 px-4 text-left border-[4px] border-foreground transition-all ${
                      selectedArtifact === idx
                        ? "bg-[oklch(0.65_0.18_40)] text-white shadow-brutal"
                        : discoveredArtifacts.has(idx)
                        ? "bg-[oklch(0.65_0.20_145)] text-white shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                        : "bg-white text-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{a.icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-base">{a.name}</p>
                        <p className="text-sm opacity-90">{a.description}</p>
                        {discoveredArtifacts.has(idx) && (
                          <p className="text-xs mt-1 font-bold">✓ Discovered</p>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
            
            {/* Reference Info */}
            <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-[oklch(0.98_0.01_90)]">
              <div className="flex items-center gap-2 mb-4">
                <Microscope className="w-6 h-6" strokeWidth={3} />
                <h3 className="text-xl font-bold">Carbon-14 Facts</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-bold mb-1">Half-Life:</p>
                  <p className="mono text-lg">{HALF_LIFE.toLocaleString()} years</p>
                </div>
                <div>
                  <p className="font-bold mb-1">Decay Formula:</p>
                  <p className="mono text-xs">N(t) = N₀ × (1/2)^(t/t_half)</p>
                </div>
                <div>
                  <p className="font-bold mb-1">Age Formula:</p>
                  <p className="mono text-xs">t = [ln(N/N₀) / ln(0.5)] × t_half</p>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Right Column: Analysis & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analysis Card */}
            <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-card">
              <h2 className="text-3xl font-bold mb-4">
                <span className="text-4xl mr-2">{artifact.icon}</span>
                {artifact.name}
              </h2>
              <p className="text-lg mb-6">{artifact.description}</p>
              
              <div className="bg-[oklch(0.98_0.01_90)] border-[4px] border-foreground p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Laboratory Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white border-[3px] border-foreground p-4">
                    <p className="text-sm font-bold mb-1">Original C-14:</p>
                    <p className="text-2xl font-bold mono">100%</p>
                  </div>
                  <div className="bg-[oklch(0.65_0.18_40)] text-white border-[3px] border-foreground p-4">
                    <p className="text-sm font-bold mb-1">Remaining C-14:</p>
                    <p className="text-2xl font-bold mono">{artifact.percentRemaining}%</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Calculate the age (in years):</label>
                    <Input
                      type="text"
                      value={ageGuess}
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, "");
                        if (/^\d*$/.test(value)) {
                          setAgeGuess(value);
                        }
                      }}
                      placeholder="Enter age in years..."
                      className="h-14 text-xl font-bold mono border-[4px] border-foreground"
                      disabled={revealed}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Hint: Use the age formula with {artifact.percentRemaining}% remaining
                    </p>
                  </div>
                  
                  {!revealed ? (
                    <Button 
                      onClick={handleSubmit}
                      disabled={!ageGuess}
                      className="w-full bg-[oklch(0.65_0.18_40)] text-white border-[4px] border-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold text-lg h-12"
                    >
                      Submit Analysis
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-[oklch(0.65_0.20_145)] text-white border-[4px] border-foreground p-4">
                        <p className="text-sm font-bold mb-1">Actual Age:</p>
                        <p className="text-3xl font-bold mono">{artifact.actualAge.toLocaleString()} years</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border-[4px] border-foreground p-3">
                          <p className="text-xs font-bold mb-1">Your Estimate:</p>
                          <p className="text-lg font-bold mono">{parseInt(ageGuess).toLocaleString()} yrs</p>
                        </div>
                        <div className="bg-white border-[4px] border-foreground p-3">
                          <p className="text-xs font-bold mb-1">Difference:</p>
                          <p className="text-lg font-bold mono">
                            {Math.abs(parseInt(ageGuess) - artifact.actualAge).toLocaleString()} yrs
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={nextArtifact}
                        className="w-full bg-[oklch(0.55_0.25_265)] text-white border-[4px] border-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold text-lg h-12"
                      >
                        Analyze Next Artifact
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
            
            {/* Decay Curve */}
            <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-card">
              <h2 className="text-2xl font-bold mb-4">Carbon-14 Decay Curve</h2>
              <div className="h-[400px] border-[4px] border-foreground bg-white p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={decayData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeWidth={2} stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="years" 
                      stroke="#000" 
                      strokeWidth={2}
                      label={{ value: 'Years', position: 'insideBottom', offset: -10, style: { fontSize: 14, fontWeight: 'bold' } }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <YAxis 
                      stroke="#000" 
                      strokeWidth={2}
                      label={{ value: 'C-14 Remaining (%)', angle: -90, position: 'insideLeft', style: { fontSize: 14, fontWeight: 'bold' } }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, "C-14 Remaining"]}
                      labelFormatter={(label) => `${label.toLocaleString()} years`}
                      contentStyle={{ border: '3px solid #000', borderRadius: 0 }}
                    />
                    <ReferenceLine y={50} stroke="oklch(0.60 0.25 310)" strokeWidth={2} strokeDasharray="5 5" label={{ value: "1 Half-Life", position: "right" }} />
                    <ReferenceLine y={25} stroke="oklch(0.65 0.22 35)" strokeWidth={2} strokeDasharray="5 5" label={{ value: "2 Half-Lives", position: "right" }} />
                    {revealed && (
                      <ReferenceLine 
                        x={artifact.actualAge} 
                        stroke="oklch(0.65 0.20 145)" 
                        strokeWidth={3}
                        label={{ value: artifact.name, position: "top", fill: "oklch(0.65 0.20 145)", fontWeight: "bold" }}
                      />
                    )}
                    <Line 
                      type="monotone" 
                      dataKey="percent" 
                      stroke="oklch(0.65 0.18 40)" 
                      strokeWidth={4} 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                💡 <strong>Exponential Decay:</strong> Every {HALF_LIFE.toLocaleString()} years, exactly half of the remaining C-14 decays. 
                This predictable pattern lets us date ancient artifacts!
              </p>
            </Card>
          </div>
        </div>
      </main>
      
      <Scoreboard
        open={showScoreboard}
        onClose={() => setShowScoreboard(false)}
        currentActivityScore={score}
        currentActivityName={ACTIVITIES["carbon-dating"].name}
      />
    </div>
  );
}
