import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Target, Zap } from "lucide-react";

interface InstructionsModalProps {
  open: boolean;
  onClose: () => void;
}

export function InstructionsModal({ open, onClose }: InstructionsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-[6px] border-foreground shadow-brutal max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-4xl font-bold mb-4 flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-[oklch(0.55_0.25_265)]" strokeWidth={3} />
            How to Play
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Welcome */}
          <div>
            <h3 className="text-2xl font-bold mb-2">Welcome to Exponential & Logarithmic Adventures!</h3>
            <p className="text-base leading-relaxed">
              This gamified learning environment helps you master exponential and logarithmic functions through interactive challenges and real-world applications. Each activity focuses on different concepts and skills.
            </p>
          </div>
          
          {/* How It Works */}
          <div className="border-[4px] border-foreground p-6 bg-[oklch(0.98_0.01_90)]">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Target className="w-6 h-6" strokeWidth={3} />
              How It Works
            </h3>
            <ol className="space-y-2 list-decimal list-inside">
              <li className="font-medium">Enter your name to start your adventure</li>
              <li className="font-medium">Choose an activity from the home page</li>
              <li className="font-medium">Complete challenges to earn points</li>
              <li className="font-medium">Track your progress on the scoreboard</li>
              <li className="font-medium">Master all activities to become an expert!</li>
            </ol>
          </div>
          
          {/* Scoring */}
          <div className="border-[4px] border-foreground p-6 bg-[oklch(0.70_0.20_55)]">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Trophy className="w-6 h-6" strokeWidth={3} />
              Scoring System
            </h3>
            <p className="mb-3 font-medium">
              Each activity has its own scoring system based on:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li className="font-medium">Accuracy of your answers</li>
              <li className="font-medium">Speed of completion (in some activities)</li>
              <li className="font-medium">Difficulty level of challenges</li>
            </ul>
            <p className="mt-3 font-medium">
              Your total score accumulates across all activities and is saved automatically!
            </p>
          </div>
          
          {/* Activities Overview */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Zap className="w-6 h-6" strokeWidth={3} />
              Activities Overview
            </h3>
            <div className="space-y-3">
              <div className="border-[4px] border-foreground p-4 bg-white">
                <h4 className="font-bold text-lg mb-1">1. Exponential Explorer</h4>
                <p className="text-sm">Master the basics of f(x) = a·b^x through interactive graph manipulation</p>
              </div>
              
              <div className="border-[4px] border-foreground p-4 bg-white">
                <h4 className="font-bold text-lg mb-1">2. Log Detective</h4>
                <p className="text-sm">Convert between exponential and logarithmic forms in a timed matching game</p>
              </div>
              
              <div className="border-[4px] border-foreground p-4 bg-white">
                <h4 className="font-bold text-lg mb-1">3. Compound Interest Quest</h4>
                <p className="text-sm">Apply exponential growth to real-world savings scenarios</p>
              </div>
              
              <div className="border-[4px] border-foreground p-4 bg-white">
                <h4 className="font-bold text-lg mb-1">4. Viral Video Challenge</h4>
                <p className="text-sm">Predict viral content spread using exponential growth models</p>
              </div>
              
              <div className="border-[4px] border-foreground p-4 bg-white">
                <h4 className="font-bold text-lg mb-1">5. Carbon Dating Lab</h4>
                <p className="text-sm">Calculate artifact ages using exponential decay and half-life</p>
              </div>
              
              <div className="border-[4px] border-foreground p-4 bg-white">
                <h4 className="font-bold text-lg mb-1">6. Logarithm Laws Master</h4>
                <p className="text-sm">Expand and combine logarithmic expressions using logarithm laws</p>
              </div>
              
              <div className="border-[4px] border-foreground p-4 bg-white">
                <h4 className="font-bold text-lg mb-1">7. Logarithm Evaluation Expert</h4>
                <p className="text-sm">Evaluate logarithms using laws and cancellation rules</p>
              </div>
              
              <div className="border-[4px] border-foreground p-4 bg-white">
                <h4 className="font-bold text-lg mb-1">8. Equation Solver Challenge</h4>
                <p className="text-sm">Solve logarithmic and exponential equations algebraically</p>
              </div>
            </div>
          </div>
          
          {/* Tips */}
          <div className="border-[4px] border-foreground p-6 bg-[oklch(0.65_0.20_145)] text-white">
            <h3 className="text-xl font-bold mb-3">💡 Pro Tips</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li className="font-medium">Take your time to understand each concept</li>
              <li className="font-medium">Use the visual feedback to guide your learning</li>
              <li className="font-medium">Don't be afraid to experiment with different values</li>
              <li className="font-medium">Review the formulas and properties before each activity</li>
              <li className="font-medium">Your progress is saved, so you can return anytime!</li>
            </ul>
          </div>
          
          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full bg-[oklch(0.55_0.25_265)] text-white border-[4px] border-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold text-lg h-12"
          >
            Got It! Let's Start
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
