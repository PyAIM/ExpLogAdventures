/* Compound Interest Quest Activity:
 * - Real-world scenario: saving for goals
 * - Adjust principal, rate, time, compounding frequency
 * - Visual comparison of different compounding methods
 * - Achievement unlocks for reaching goals
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Link } from "wouter";
import { ArrowLeft, Target, TrendingUp, Award, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useAudio } from "@/contexts/AudioContext";
import { Scoreboard } from "@/components/Scoreboard";
import { ACTIVITIES, roundTo } from "@/lib/activityHelpers";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const goals = [
  { name: "Gaming Console", amount: 500, emoji: "🎮" },
  { name: "Laptop", amount: 1500, emoji: "💻" },
  { name: "Used Car", amount: 5000, emoji: "🚗" },
  { name: "College Fund", amount: 20000, emoji: "🎓" },
];

export default function CompoundInterest() {
  const { playerName, addActivityScore } = usePlayer();
  const { isMuted, toggleMute, playGameMusic } = useAudio();
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);
  const [selectedGoal, setSelectedGoal] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showScoreboard, setShowScoreboard] = useState(false);
  
  useEffect(() => {
    playGameMusic();
  }, []);
  
  const goal = goals[selectedGoal];
  
  // Calculate compound interest for different frequencies
  const calculateCompound = (n: number) => {
    return principal * Math.pow(1 + rate / 100 / n, n * years);
  };
  
  const calculateContinuous = () => {
    return principal * Math.exp((rate / 100) * years);
  };
  
  const monthly = calculateCompound(12);
  const quarterly = calculateCompound(4);
  const annually = calculateCompound(1);
  const continuous = calculateContinuous();
  
  // Generate data for chart
  const generateChartData = () => {
    const data = [];
    for (let t = 0; t <= years; t++) {
      data.push({
        year: t,
        monthly: principal * Math.pow(1 + rate / 100 / 12, 12 * t),
        quarterly: principal * Math.pow(1 + rate / 100 / 4, 4 * t),
        annually: principal * Math.pow(1 + rate / 100, t),
        continuous: principal * Math.exp((rate / 100) * t),
      });
    }
    return data;
  };
  
  const chartData = generateChartData();
  
  const goalReached = continuous >= goal.amount;
  const yearsToGoal = Math.log(goal.amount / principal) / (Math.log(1 + rate / 100));
  
  // Track goal achievements
  useEffect(() => {
    if (goalReached && !achievements.includes(goal.name)) {
      const newAchievements = [...achievements, goal.name];
      setAchievements(newAchievements);
      const points = goal.amount / 100; // Points based on goal value
      setScore(score + points);
      toast.success(`Goal achieved, ${playerName}! ${goal.emoji} +${points} points!`, { duration: 3000 });
      
      // If all goals achieved, show scoreboard
      if (newAchievements.length === goals.length) {
        setTimeout(() => {
          addActivityScore(ACTIVITIES["compound-interest"].id, ACTIVITIES["compound-interest"].name, score + points);
          setShowScoreboard(true);
        }, 2000);
      }
    }
  }, [goalReached, goal.name]);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-[6px] border-foreground bg-[oklch(0.65_0.20_145)] text-white py-8 relative">
        <div className="container">
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 p-3 border-[4px] border-white hover:bg-white hover:text-[oklch(0.65_0.20_145)] transition-colors"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-6 h-6" strokeWidth={3} /> : <Volume2 className="w-6 h-6" strokeWidth={3} />}
          </button>
          <Link href="/">
            <Button variant="outline" className="mb-4 border-[4px] border-white bg-transparent text-white hover:bg-white hover:text-[oklch(0.65_0.20_145)] font-bold">
              <ArrowLeft className="mr-2" /> Back to Activities
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">Compound Interest Quest</h1>
          <p className="text-xl">Watch your money grow exponentially!</p>
          {playerName && (
            <p className="text-lg mt-2">Player: <span className="font-bold">{playerName}</span></p>
          )}
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Goal Selection */}
            <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-[oklch(0.70_0.20_55)]">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8" strokeWidth={3} />
                <h2 className="text-2xl font-bold">Your Goal</h2>
              </div>
              <div className="space-y-3">
                {goals.map((g, idx) => (
                  <Button
                    key={idx}
                    onClick={() => setSelectedGoal(idx)}
                    className={`w-full h-16 text-lg font-bold border-[4px] border-foreground transition-all ${
                      selectedGoal === idx
                        ? "bg-white text-foreground shadow-none"
                        : "bg-[oklch(0.65_0.20_145)] text-white shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                    }`}
                  >
                    <span className="text-2xl mr-2">{g.emoji}</span>
                    {g.name} (${g.amount.toLocaleString()})
                  </Button>
                ))}
              </div>
            </Card>
            
            {/* Controls */}
            <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-card">
              <h3 className="text-2xl font-bold mb-6">Adjust Your Savings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-bold mb-2">
                    Principal: <span className="mono text-[oklch(0.65_0.20_145)]">${principal.toLocaleString()}</span>
                  </label>
                  <p className="text-sm text-muted-foreground mb-3">Initial amount you invest</p>
                  <Slider
                    value={[principal]}
                    onValueChange={(val) => setPrincipal(val[0])}
                    min={100}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-bold mb-2">
                    Interest Rate: <span className="mono text-[oklch(0.55_0.25_265)]">{rate}%</span>
                  </label>
                  <p className="text-sm text-muted-foreground mb-3">Annual percentage rate</p>
                  <Slider
                    value={[rate]}
                    onValueChange={(val) => setRate(val[0])}
                    min={1}
                    max={15}
                    step={0.5}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-bold mb-2">
                    Time: <span className="mono text-[oklch(0.60_0.25_310)]">{years} years</span>
                  </label>
                  <p className="text-sm text-muted-foreground mb-3">How long you'll save</p>
                  <Slider
                    value={[years]}
                    onValueChange={(val) => setYears(val[0])}
                    min={1}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>
            
            {/* Goal Progress */}
            <Card className={`border-[6px] border-foreground shadow-brutal p-6 ${
              goalReached ? "bg-[oklch(0.65_0.20_145)] text-white" : "bg-card"
            }`}>
              <h3 className="text-xl font-bold mb-4">
                {goalReached ? "🎉 Goal Reached!" : "Goal Progress"}
              </h3>
              {goalReached ? (
                <div>
                  <p className="text-lg mb-2">
                    You'll have <span className="mono font-bold">${continuous.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                  </p>
                  <p className="text-lg">
                    That's <span className="mono font-bold">${(continuous - goal.amount).toLocaleString(undefined, {maximumFractionDigits: 2})}</span> extra!
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-base mb-3">
                    You'll have <span className="mono font-bold">${continuous.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                  </p>
                  <p className="text-base mb-3">
                    Need <span className="mono font-bold">${(goal.amount - continuous).toLocaleString(undefined, {maximumFractionDigits: 2})}</span> more
                  </p>
                  <p className="text-sm text-muted-foreground">
                    At this rate, you'll reach your goal in <span className="mono font-bold">{yearsToGoal.toFixed(1)} years</span>
                  </p>
                </div>
              )}
            </Card>
          </div>
          
          {/* Right Column: Visualization */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart */}
            <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-card">
              <h2 className="text-3xl font-bold mb-4">Growth Over Time</h2>
              <div className="h-[400px] border-[4px] border-foreground bg-white p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeWidth={2} stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="year" 
                      stroke="#000" 
                      strokeWidth={2}
                      label={{ value: 'Years', position: 'insideBottom', offset: -10, style: { fontSize: 14, fontWeight: 'bold' } }}
                    />
                    <YAxis 
                      stroke="#000" 
                      strokeWidth={2}
                      label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', style: { fontSize: 14, fontWeight: 'bold' } }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      formatter={(value: number) => `$${value.toLocaleString(undefined, {maximumFractionDigits: 2})}`}
                      contentStyle={{ border: '3px solid #000', borderRadius: 0 }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="monthly" stroke="oklch(0.55 0.25 265)" strokeWidth={3} name="Monthly" dot={false} />
                    <Line type="monotone" dataKey="quarterly" stroke="oklch(0.60 0.25 310)" strokeWidth={3} name="Quarterly" dot={false} />
                    <Line type="monotone" dataKey="annually" stroke="oklch(0.65 0.22 35)" strokeWidth={3} name="Annually" dot={false} />
                    <Line type="monotone" dataKey="continuous" stroke="oklch(0.65 0.20 145)" strokeWidth={4} name="Continuous" dot={false} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            {/* Comparison Table */}
            <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-card">
              <h2 className="text-3xl font-bold mb-4">Compounding Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-[4px] border-foreground">
                  <thead className="bg-[oklch(0.65_0.20_145)] text-white">
                    <tr>
                      <th className="border-[3px] border-foreground p-3 text-left font-bold">Method</th>
                      <th className="border-[3px] border-foreground p-3 text-left font-bold">Formula</th>
                      <th className="border-[3px] border-foreground p-3 text-right font-bold">Final Amount</th>
                      <th className="border-[3px] border-foreground p-3 text-right font-bold">Interest Earned</th>
                    </tr>
                  </thead>
                  <tbody className="mono">
                    <tr className="bg-white">
                      <td className="border-[3px] border-foreground p-3 font-bold">Annually</td>
                      <td className="border-[3px] border-foreground p-3 text-sm">P(1 + r)^t</td>
                      <td className="border-[3px] border-foreground p-3 text-right">${annually.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                      <td className="border-[3px] border-foreground p-3 text-right text-[oklch(0.65_0.20_145)]">+${(annually - principal).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                    </tr>
                    <tr className="bg-[oklch(0.98_0.01_90)]">
                      <td className="border-[3px] border-foreground p-3 font-bold">Quarterly</td>
                      <td className="border-[3px] border-foreground p-3 text-sm">P(1 + r/4)^(4t)</td>
                      <td className="border-[3px] border-foreground p-3 text-right">${quarterly.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                      <td className="border-[3px] border-foreground p-3 text-right text-[oklch(0.65_0.20_145)]">+${(quarterly - principal).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border-[3px] border-foreground p-3 font-bold">Monthly</td>
                      <td className="border-[3px] border-foreground p-3 text-sm">P(1 + r/12)^(12t)</td>
                      <td className="border-[3px] border-foreground p-3 text-right">${monthly.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                      <td className="border-[3px] border-foreground p-3 text-right text-[oklch(0.65_0.20_145)]">+${(monthly - principal).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                    </tr>
                    <tr className="bg-[oklch(0.70_0.20_55)]">
                      <td className="border-[3px] border-foreground p-3 font-bold">Continuous</td>
                      <td className="border-[3px] border-foreground p-3 text-sm">Pe^(rt)</td>
                      <td className="border-[3px] border-foreground p-3 text-right font-bold">${continuous.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                      <td className="border-[3px] border-foreground p-3 text-right font-bold">+${(continuous - principal).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                💡 <strong>Key Insight:</strong> More frequent compounding means more growth! Continuous compounding gives the maximum possible return.
              </p>
            </Card>
          </div>
        </div>
      </main>
      
      <Scoreboard
        open={showScoreboard}
        onClose={() => setShowScoreboard(false)}
        currentActivityScore={score}
        currentActivityName={ACTIVITIES["compound-interest"].name}
      />
    </div>
  );
}
