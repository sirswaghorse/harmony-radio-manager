
import { useState } from "react";
import { useRadio } from "@/contexts/RadioContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MusicIcon, Search } from "lucide-react";
import { toast } from "sonner";

export function RequestSongWidget() {
  const { songs, requestSong } = useRadio();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredSongs = searchQuery
    ? songs.filter(song => 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : songs;
    
  const handleRequest = (songId: string) => {
    requestSong(songId);
    toast.success("Song requested successfully");
  };
  
  return (
    <div className="bg-card border rounded-md p-3 max-w-md mx-auto">
      <div className="mb-3">
        <h3 className="font-medium mb-2">Request a Song</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search songs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hidden">
        {filteredSongs.length > 0 ? (
          filteredSongs.map(song => (
            <div 
              key={song.id} 
              className="flex items-center justify-between gap-2 p-2 hover:bg-muted/50 rounded-md"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
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
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{song.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{song.artist}</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={() => handleRequest(song.id)}
              >
                Request
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            {searchQuery ? "No songs found matching your search" : "Start typing to search for songs"}
          </div>
        )}
      </div>
    </div>
  );
}
