import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playMenuMusic: () => void;
  playGameMusic: () => void;
  stopMusic: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const menuAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackRef = useRef<"menu" | "game" | null>(null);
  
  useEffect(() => {
    // Initialize audio elements with local files
    menuAudioRef.current = new Audio("/gameintro.mp3");
    gameAudioRef.current = new Audio("/gametime.mp3");
    
    // Set loop and volume
    if (menuAudioRef.current) {
      menuAudioRef.current.loop = true;
      menuAudioRef.current.volume = 0.3;
    }
    if (gameAudioRef.current) {
      gameAudioRef.current.loop = true;
      gameAudioRef.current.volume = 0.3;
    }
    
    // Load from localStorage
    const savedMute = localStorage.getItem("audioMuted");
    if (savedMute === "true") {
      setIsMuted(true);
    }
    
    return () => {
      // Cleanup
      if (menuAudioRef.current) {
        menuAudioRef.current.pause();
        menuAudioRef.current = null;
      }
      if (gameAudioRef.current) {
        gameAudioRef.current.pause();
        gameAudioRef.current = null;
      }
    };
  }, []);
  
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem("audioMuted", String(newMuted));
    
    if (newMuted) {
      if (menuAudioRef.current) menuAudioRef.current.pause();
      if (gameAudioRef.current) gameAudioRef.current.pause();
    } else {
      // Resume current track
      if (currentTrackRef.current === "menu" && menuAudioRef.current) {
        menuAudioRef.current.play().catch(e => console.log("Audio play failed:", e));
      } else if (currentTrackRef.current === "game" && gameAudioRef.current) {
        gameAudioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
    }
  };
  
  const playMenuMusic = () => {
    if (isMuted) return;
    
    // Stop game music if playing
    if (gameAudioRef.current) {
      gameAudioRef.current.pause();
      gameAudioRef.current.currentTime = 0;
    }
    
    // Play menu music
    if (menuAudioRef.current) {
      currentTrackRef.current = "menu";
      menuAudioRef.current.currentTime = 0;
      menuAudioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };
  
  const playGameMusic = () => {
    if (isMuted) return;
    
    // Stop menu music if playing
    if (menuAudioRef.current) {
      menuAudioRef.current.pause();
      menuAudioRef.current.currentTime = 0;
    }
    
    // Play game music
    if (gameAudioRef.current) {
      currentTrackRef.current = "game";
      gameAudioRef.current.currentTime = 0;
      gameAudioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };
  
  const stopMusic = () => {
    if (menuAudioRef.current) {
      menuAudioRef.current.pause();
      menuAudioRef.current.currentTime = 0;
    }
    if (gameAudioRef.current) {
      gameAudioRef.current.pause();
      gameAudioRef.current.currentTime = 0;
    }
    currentTrackRef.current = null;
  };
  
  return (
    <AudioContext.Provider
      value={{
        isMuted,
        toggleMute,
        playMenuMusic,
        playGameMusic,
        stopMusic
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
