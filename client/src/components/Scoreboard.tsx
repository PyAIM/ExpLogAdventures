import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePlayer } from "@/contexts/PlayerContext";
import { Trophy, Award, Star } from "lucide-react";
import { Link } from "wouter";

interface ScoreboardProps {
  open: boolean;
  onClose: () => void;
  currentActivityScore?: number;
  currentActivityName?: string;
}

export function Scoreboard({ open, onClose, currentActivityScore, currentActivityName }: ScoreboardProps) {
  const { playerName, totalScore, activityScores } = usePlayer();
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-[6px] border-foreground shadow-brutal max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-[oklch(0.70_0.20_55)]" strokeWidth={3} />
            {playerName}'s Scoreboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4 pb-4">
          {/* Current Activity Score */}
          {currentActivityScore !== undefined && currentActivityName && (
            <Card className="border-[6px] border-foreground shadow-brutal-sm p-6 bg-[oklch(0.70_0.20_55)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold mb-1">Just Completed:</p>
                  <p className="text-2xl font-bold">{currentActivityName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold mb-1">Score:</p>
                  <p className="text-4xl font-bold mono">+{currentActivityScore}</p>
                </div>
              </div>
            </Card>
          )}
          
          {/* Total Score */}
          <Card className="border-[6px] border-foreground shadow-brutal p-6 bg-[oklch(0.65_0.20_145)] text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8" strokeWidth={3} />
                <p className="text-2xl font-bold">Total Score</p>
              </div>
              <p className="text-5xl font-bold mono">{totalScore}</p>
            </div>
          </Card>
          
          {/* Activity Breakdown */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Award className="w-6 h-6" strokeWidth={3} />
              Activity Breakdown
            </h3>
            
            {activityScores.length === 0 ? (
              <Card className="border-[4px] border-foreground p-6 bg-[oklch(0.98_0.01_90)]">
                <p className="text-center text-muted-foreground">
                  No activities completed yet. Start your adventure!
                </p>
              </Card>
            ) : (
              <div className="space-y-2">
                {activityScores.map((score, idx) => (
                  <Card key={idx} className="border-[4px] border-foreground p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{score.activityName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(score.completedAt).toLocaleDateString()} at{" "}
                          {new Date(score.completedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <p className="text-2xl font-bold mono text-[oklch(0.65_0.20_145)]">
                        {score.score}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <Link href="/" className="flex-1">
              <Button
                className="w-full bg-[oklch(0.55_0.25_265)] text-white border-[4px] border-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold h-12"
              >
                Back to Activities
              </Button>
            </Link>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-[4px] border-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold h-12"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
