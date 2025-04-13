
import { useState } from "react";
import { useRadio } from "@/contexts/RadioContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatDuration } from "@/lib/utils";
import { Pause, Play, Volume2 } from "lucide-react";

export function PlayerWidget() {
  const { stats } = useRadio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="bg-card border rounded-md p-3 w-full max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 bg-muted rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
          {stats.currentSong?.coverArt ? (
            <img 
              src={stats.currentSong.coverArt} 
              alt={stats.currentSong.title} 
              className="h-full w-full object-cover" 
            />
          ) : (
            <div className="h-6 w-6 bg-harmony-primary rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{stats.currentSong.title}</div>
          <div className="text-sm text-muted-foreground truncate">{stats.currentSong.artist}</div>
        </div>
        
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full h-10 w-10"
          onClick={togglePlayback}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </Button>
        
        <div className="hidden md:flex items-center gap-2 w-28">
          <Volume2 size={16} className="text-muted-foreground" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            className="w-full"
            max={100}
            step={1}
          />
        </div>
      </div>
    </div>
  );
}
