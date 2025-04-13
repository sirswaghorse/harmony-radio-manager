
import { useRadio } from "@/contexts/RadioContext";
import { formatDuration } from "@/lib/utils";
import { MusicIcon } from "lucide-react";

export function CurrentSongWidget() {
  const { stats } = useRadio();

  return (
    <div className="bg-card border rounded-md p-3 w-full max-w-md mx-auto">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 bg-muted rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
          {stats.currentSong?.coverArt ? (
            <img 
              src={stats.currentSong.coverArt} 
              alt={stats.currentSong.title} 
              className="h-full w-full object-cover" 
            />
          ) : (
            <MusicIcon size={18} className="text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">Now Playing</p>
          <div className="font-medium truncate">{stats.currentSong.title}</div>
          <div className="text-sm text-muted-foreground truncate">
            {stats.currentSong.artist} • {formatDuration(stats.currentSong.duration)}
          </div>
        </div>
      </div>
    </div>
  );
}
