
import { useRadio } from "@/contexts/RadioContext";
import { formatDuration } from "@/lib/utils";
import { Clock, MusicIcon } from "lucide-react";

export function RecentTracksWidget() {
  const { stats } = useRadio();

  return (
    <div className="bg-card border rounded-md p-3 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={16} className="text-harmony-primary" />
        <h3 className="font-medium">Recently Played</h3>
      </div>
      
      <div className="space-y-3">
        {stats.recentlyPlayed.map((song, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
              {song.coverArt ? (
                <img 
                  src={song.coverArt} 
                  alt={song.title} 
                  className="h-full w-full object-cover rounded-md" 
                />
              ) : (
                <MusicIcon size={14} className="text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{song.title}</div>
              <div className="text-xs text-muted-foreground truncate">{song.artist}</div>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDuration(song.duration)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
