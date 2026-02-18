import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePlayer } from "@/contexts/PlayerContext";
import { validatePlayerName } from "@/lib/security";

export function PlayerNameModal() {
  const { playerName, setPlayerName } = usePlayer();
  const [tempName, setTempName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(!playerName);
  
  const handleSubmit = () => {
    const validationError = validatePlayerName(tempName);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setPlayerName(tempName.trim());
    setError(null);
    setOpen(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
    // Clear error when user starts typing
    if (error) setError(null);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-[6px] border-foreground shadow-brutal max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold mb-2">Welcome, Scholar!</DialogTitle>
          <DialogDescription className="text-base">
            Enter your name to begin your exponential and logarithmic adventure. Your progress and scores will be saved!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-bold mb-2">Your Name:</label>
            <Input
              type="text"
              value={tempName}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Enter your name..."
              className={`h-12 text-lg border-[4px] ${error ? 'border-red-500' : 'border-foreground'}`}
              maxLength={50}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-1 font-medium">{error}</p>
            )}
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!tempName.trim()}
            className="w-full bg-[oklch(0.55_0.25_265)] text-white border-[4px] border-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold text-lg h-12"
          >
            Start Adventure
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
