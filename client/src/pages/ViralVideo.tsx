/* Viral Video Challenge Activity:
 * - Model exponential growth of social media content
 * - Students predict views/shares over time
 * - Compare different growth rates
 * - Leaderboard for accurate predictions
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { ArrowLeft, Play, Users, Share2, Eye, TrendingUp, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useAudio } from "@/contexts/AudioContext";
import { Scoreboard } from "@/components/Scoreboard";
import { ACTIVITIES, roundTo } from "@/lib/activityHelpers";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { toast } from "sonner";

interface Scenario {
  title: string;
  description: string;
  initialViews: number;
  growthRate: number;
  timeUnit: string;
  targetTime: number;
  icon: string;
}

const scenarios: Scenario[] = [
  {
    title: "Dance Challenge",
    description: "A catchy dance video starts trending",
    initialViews: 1000,
    growthRate: 1.5,
    timeUnit: "hours",
    targetTime: 24,
    icon: "💃"
  },
  {
    title: "Breaking News",
    description: "Important news spreads rapidly",
    initialViews: 5000,
    growthRate: 2.0,
    timeUnit: "hours",
    targetTime: 12,
    icon: "📰"
  },
  {
    title: "Cute Animal Video",
    description: "Adorable pet video gains traction",
    initialViews: 500,
    growthRate: 1.3,
    timeUnit: "days",
    targetTime: 7,
    icon: "🐱"
  },
  {
    title: "Celebrity Drama",
    description: "Celebrity controversy goes viral",
    initialViews: 10000,
    growthRate: 2.5,
    timeUnit: "hours",
    targetTime: 6,
    icon: "⭐"
  }
];

export default function ViralVideo() {
  const { playerName, addActivityScore } = usePlayer();
  const { isMuted, toggleMute, playGameMusic } = useAudio();
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [prediction, setPrediction] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showScoreboard, setShowScoreboard] = useState(false);
  
  useEffect(() => {
    playGameMusic();
  }, []);
  
  const scenario = scenarios[selectedScenario];
  
  // Calculate actual views at target time: V(t) = V₀ · r^t
  const actualViews = scenario.initialViews * Math.pow(scenario.growthRate, scenario.targetTime);
  
  // Generate chart data
  const generateChartData = () => {
    const data = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const t = (scenario.targetTime / steps) * i;
      const views = scenario.initialViews * Math.pow(scenario.growthRate, t);
      data.push({
        time: t,
        views: Math.round(views)
      });
    }
    return data;
  };
  
  const chartData = generateChartData();
  
  const handleSubmit = () => {
    const predictionNum = parseInt(prediction.replace(/,/g, ""));
    
    if (isNaN(predictionNum) || predictionNum <= 0) {
      toast.error("Please enter a valid number!");
      return;
    }
    
    setRevealed(true);
    setAttempts(attempts + 1);
    
    // Calculate accuracy
    const percentError = Math.abs((predictionNum - actualViews) / actualViews) * 100;
    
    let points = 0;
    let message = "";
    
    if (percentError < 5) {
      points = 50;
      message = "🎯 Incredible! Almost perfect prediction!";
    } else if (percentError < 15) {
      points = 30;
      message = "🎉 Great job! Very close!";
    } else if (percentError < 30) {
      points = 15;
      message = "👍 Good effort! Getting warmer!";
    } else {
      points = 5;
      message = "📊 Keep practicing! Try another scenario.";
    }
    
    setScore(score + points);
    toast.success(`${message}, ${playerName}! +${points} points`, { duration: 3000 });
    
    // Show scoreboard after completing all scenarios
    if (attempts + 1 >= scenarios.length) {
      setTimeout(() => {
        addActivityScore(ACTIVITIES["viral-video"].id, ACTIVITIES["viral-video"].name, score + points);
        setShowScoreboard(true);
      }, 2000);
    }
  };
  
  const nextScenario = () => {
    setSelectedScenario((selectedScenario + 1) % scenarios.length);
    setPrediction("");
    setRevealed(false);
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-[6px] border-foreground bg-[oklch(0.65_0.22_35)] text-white py-8 relative">
        <div className="container">
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 p-3 border-[4px] border-white hover:bg-white hover:text-[oklch(0.65_0.22_35)] transition-colors"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-6 h-6" strokeWidth={3} /> : <Volume2 className="w-6 h-6" strokeWidth={3} />}
          </button>
          <Link href="/">
            <Button variant="outline" className="mb-4 border-[4px] border-white bg-transparent text-white hover:bg-white hover:text-[oklch(0.65_0.22_35)] font-bold">
              <ArrowLeft className="mr-2" /> Back to Activities
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">Viral Video Challenge</h1>
          <p className="text-xl">Predict how fast content spreads using exponential growth!</p>
          {playerName && (
            <p className="text-lg mt-2">Player: <span className="font-bold">{playerName}</span></p>
          )}
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Scenario Selection & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Score */}
            <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-[oklch(0.70_0.20_55)]">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8" strokeWidth={3} />
                <h2 className="text-2xl font-bold">Score</h2>
              </div>
              <p className="text-5xl font-bold mono">{score}</p>
              <p className="text-sm mt-2">Attempts: {attempts}</p>
            </Card>
            
            {/* Scenario Selection */}
            <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-card">
              <h3 className="text-2xl font-bold mb-4">Choose Scenario</h3>
              <div className="space-y-3">
                {scenarios.map((s, idx) => (
                  <Button
                    key={idx}
                    onClick={() => {
                      setSelectedScenario(idx);
                      setPrediction("");
                      setRevealed(false);
                    }}
                    className={`w-full h-auto py-3 px-4 text-left border-[4px] border-foreground transition-all ${
                      selectedScenario === idx
                        ? "bg-[oklch(0.65_0.22_35)] text-white shadow-brutal-orange"
                        : "bg-white text-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{s.icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-base">{s.title}</p>
                        <p className="text-sm opacity-90">{s.description}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
            
            {/* Scenario Details */}
            <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-[oklch(0.98_0.01_90)]">
              <h3 className="text-xl font-bold mb-4">Scenario Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Initial Views:</span>
                  <span className="mono text-lg">{scenario.initialViews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">Growth Rate:</span>
                  <span className="mono text-lg">{scenario.growthRate}x per {scenario.timeUnit.slice(0, -1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">Time Period:</span>
                  <span className="mono text-lg">{scenario.targetTime} {scenario.timeUnit}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white border-[3px] border-foreground">
                <p className="text-xs font-bold mb-1">Formula:</p>
                <p className="mono text-sm">V(t) = {scenario.initialViews.toLocaleString()} × {scenario.growthRate}^t</p>
              </div>
            </Card>
          </div>
          
          {/* Right Column: Prediction & Visualization */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prediction Input */}
            <Card className="border-[6px] border-foreground shadow-brutal-orange p-6 bg-card">
              <h2 className="text-3xl font-bold mb-4">
                <span className="text-4xl mr-2">{scenario.icon}</span>
                {scenario.title}
              </h2>
              <p className="text-lg mb-6">{scenario.description}</p>
              
              <div className="bg-[oklch(0.98_0.01_90)] border-[4px] border-foreground p-6 mb-6">
                <h3 className="text-xl font-bold mb-3">Your Challenge:</h3>
                <p className="text-base mb-4">
                  If a video starts with <strong className="mono">{scenario.initialViews.toLocaleString()}</strong> views 
                  and grows at a rate of <strong className="mono">{scenario.growthRate}x</strong> per {scenario.timeUnit.slice(0, -1)}, 
                  how many views will it have after <strong className="mono">{scenario.targetTime}</strong> {scenario.timeUnit}?
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Your Prediction:</label>
                    <Input
                      type="text"
                      value={prediction}
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, "");
                        if (/^\d*$/.test(value)) {
                          setPrediction(parseInt(value || "0").toLocaleString());
                        }
                      }}
                      placeholder="Enter number of views..."
                      className="h-14 text-xl font-bold mono border-[4px] border-foreground"
                      disabled={revealed}
                    />
                  </div>
                  
                  {!revealed ? (
                    <Button 
                      onClick={handleSubmit}
                      disabled={!prediction}
                      className="w-full bg-[oklch(0.65_0.22_35)] text-white border-[4px] border-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold text-lg h-12"
                    >
                      Submit Prediction
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-[oklch(0.65_0.20_145)] text-white border-[4px] border-foreground p-4">
                        <p className="text-sm font-bold mb-1">Actual Views:</p>
                        <p className="text-3xl font-bold mono">{actualViews.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border-[4px] border-foreground p-3">
                          <p className="text-xs font-bold mb-1">Your Prediction:</p>
                          <p className="text-lg font-bold mono">{prediction}</p>
                        </div>
                        <div className="bg-white border-[4px] border-foreground p-3">
                          <p className="text-xs font-bold mb-1">Difference:</p>
                          <p className="text-lg font-bold mono">
                            {Math.abs(parseInt(prediction.replace(/,/g, "")) - actualViews).toLocaleString(undefined, {maximumFractionDigits: 0})}
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={nextScenario}
                        className="w-full bg-[oklch(0.55_0.25_265)] text-white border-[4px] border-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold text-lg h-12"
                      >
                        Next Scenario
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
            
            {/* Chart */}
            {revealed && (
              <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-card">
                <h2 className="text-2xl font-bold mb-4">Growth Visualization</h2>
                <div className="h-[400px] border-[4px] border-foreground bg-white p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeWidth={2} stroke="#e0e0e0" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#000" 
                        strokeWidth={2}
                        label={{ value: `Time (${scenario.timeUnit})`, position: 'insideBottom', offset: -10, style: { fontSize: 14, fontWeight: 'bold' } }}
                      />
                      <YAxis 
                        stroke="#000" 
                        strokeWidth={2}
                        label={{ value: 'Views', angle: -90, position: 'insideLeft', style: { fontSize: 14, fontWeight: 'bold' } }}
                        tickFormatter={(value) => formatNumber(value)}
                      />
                      <Tooltip 
                        formatter={(value: number) => [value.toLocaleString(), "Views"]}
                        contentStyle={{ border: '3px solid #000', borderRadius: 0 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="views" 
                        stroke="oklch(0.65 0.22 35)" 
                        strokeWidth={4} 
                        dot={{ fill: "oklch(0.65 0.22 35)", r: 4, strokeWidth: 2, stroke: "#000" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  💡 <strong>Notice:</strong> The curve gets steeper over time—that's exponential growth! 
                  Small differences in growth rate lead to massive differences in final views.
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Scoreboard
        open={showScoreboard}
        onClose={() => setShowScoreboard(false)}
        currentActivityScore={score}
        currentActivityName={ACTIVITIES["viral-video"].name}
      />
    </div>
  );
}
