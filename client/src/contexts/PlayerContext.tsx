import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { sanitizeInput, sanitizeStorageData } from "@/lib/security";

interface ActivityScore {
  activityId: string;
  activityName: string;
  score: number;
  completedAt: string;
}

interface PlayerContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
  totalScore: number;
  activityScores: ActivityScore[];
  addActivityScore: (activityId: string, activityName: string, score: number) => void;
  resetScores: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playerName, setPlayerNameState] = useState<string>("");
  const [activityScores, setActivityScores] = useState<ActivityScore[]>([]);
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    const savedScores = localStorage.getItem("activityScores");
    
    if (savedName) {
      // Sanitize loaded name
      const sanitized = sanitizeInput(savedName);
      if (sanitized && sanitized.length <= 50) {
        setPlayerNameState(sanitized);
      }
    }
    
    if (savedScores) {
      try {
        const parsed = JSON.parse(savedScores);
        // Validate data structure
        if (Array.isArray(parsed) && sanitizeStorageData('activityScores', parsed)) {
          setActivityScores(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved scores", e);
        localStorage.removeItem("activityScores");
      }
    }
  }, []);
  
  const setPlayerName = (name: string) => {
    // Sanitize input before storing
    const sanitized = sanitizeInput(name);
    if (sanitized && sanitized.length <= 50) {
      setPlayerNameState(sanitized);
      localStorage.setItem("playerName", sanitized);
    }
  };
  
  const addActivityScore = (activityId: string, activityName: string, score: number) => {
    const newScore: ActivityScore = {
      activityId,
      activityName,
      score,
      completedAt: new Date().toISOString()
    };
    
    // Update or add score for this activity
    const updatedScores = activityScores.filter(s => s.activityId !== activityId);
    updatedScores.push(newScore);
    
    setActivityScores(updatedScores);
    // Validate before storing
    const sanitized = sanitizeStorageData('activityScores', updatedScores);
    if (sanitized) {
      localStorage.setItem("activityScores", JSON.stringify(sanitized));
    }
  };
  
  const resetScores = () => {
    setActivityScores([]);
    localStorage.removeItem("activityScores");
  };
  
  const totalScore = activityScores.reduce((sum, score) => sum + score.score, 0);
  
  return (
    <PlayerContext.Provider
      value={{
        playerName,
        setPlayerName,
        totalScore,
        activityScores,
        addActivityScore,
        resetScores
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
