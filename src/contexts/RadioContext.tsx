
import { createContext, useContext, useState } from "react";

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverArt?: string;
}

interface DJ {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  isOnAir: boolean;
}

interface StationStats {
  listeners: number;
  currentSong: Song;
  autoDJActive: boolean;
  recentlyPlayed: Song[];
  recentRequests: Song[];
  currentDJ: DJ | null;
}

interface RadioContextType {
  stats: StationStats;
  songs: Song[];
  djs: DJ[];
  updateStats: (stats: Partial<StationStats>) => void;
  requestSong: (songId: string) => void;
  updateDJs: (djs: DJ[]) => void;
  toggleAutoDJ: () => void;
}

// Mock data for demonstration
const mockSongs: Song[] = [
  {
    id: "s1",
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    duration: 240,
    coverArt: "/placeholder.svg",
  },
  {
    id: "s2",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 203,
    coverArt: "/placeholder.svg",
  },
  {
    id: "s3",
    title: "Dreams",
    artist: "Fleetwood Mac",
    album: "Rumours",
    duration: 257,
    coverArt: "/placeholder.svg",
  },
  {
    id: "s4",
    title: "Don't Stop Believin'",
    artist: "Journey",
    album: "Escape",
    duration: 251,
    coverArt: "/placeholder.svg",
  },
  {
    id: "s5",
    title: "Take On Me",
    artist: "a-ha",
    album: "Hunting High and Low",
    duration: 225,
    coverArt: "/placeholder.svg",
  },
  {
    id: "s6",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: 354,
    coverArt: "/placeholder.svg",
  },
  {
    id: "s7",
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    album: "Appetite for Destruction",
    duration: 356,
    coverArt: "/placeholder.svg",
  },
];

const mockDJs: DJ[] = [
  {
    id: "dj1",
    name: "DJ Harmony",
    avatar: "/placeholder.svg",
    bio: "Playing the best electronic beats",
    isOnAir: true,
  },
  {
    id: "dj2",
    name: "Classic Jack",
    avatar: "/placeholder.svg",
    bio: "Classic rock and blues specialist",
    isOnAir: false,
  },
  {
    id: "dj3",
    name: "Luna Wave",
    avatar: "/placeholder.svg",
    bio: "Ambient and chill vibes for your evening",
    isOnAir: false,
  },
];

// Initial mock data
const initialStats: StationStats = {
  listeners: 127,
  currentSong: mockSongs[0],
  autoDJActive: true,
  recentlyPlayed: mockSongs.slice(1, 6),
  recentRequests: mockSongs.slice(2, 7).reverse(),
  currentDJ: null,
};

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export function RadioProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<StationStats>(initialStats);
  const [songs, setSongs] = useState<Song[]>(mockSongs);
  const [djs, setDJs] = useState<DJ[]>(mockDJs);

  const updateStats = (newStats: Partial<StationStats>) => {
    setStats((prev) => ({ ...prev, ...newStats }));
  };

  const requestSong = (songId: string) => {
    const song = songs.find((s) => s.id === songId);
    if (song) {
      // Add to recent requests
      const updatedRequests = [song, ...stats.recentRequests.slice(0, 4)];
      updateStats({ recentRequests: updatedRequests });
      // Show a feedback to the user that song has been requested
    }
  };

  const updateDJs = (newDJs: DJ[]) => {
    setDJs(newDJs);
    // Update current DJ if needed
    const onAirDJ = newDJs.find((dj) => dj.isOnAir);
    updateStats({ currentDJ: onAirDJ || null });
  };

  const toggleAutoDJ = () => {
    updateStats({ autoDJActive: !stats.autoDJActive });
  };

  return (
    <RadioContext.Provider
      value={{
        stats,
        songs,
        djs,
        updateStats,
        requestSong,
        updateDJs,
        toggleAutoDJ,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const context = useContext(RadioContext);
  if (context === undefined) {
    throw new Error("useRadio must be used within a RadioProvider");
  }
  return context;
}
