import { useState } from "react";
import { useRadio } from "@/contexts/RadioContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import { toast } from "sonner";
import { 
  ListMusic, 
  MusicIcon, 
  PlayCircle, 
  Plus, 
  Search, 
  Upload 
} from "lucide-react";
import { SongUploader } from "@/components/songs/SongUploader";

const SongsPage = () => {
  const { songs, requestSong } = useRadio();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredSongs = searchQuery
    ? songs.filter(song => 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (song.album && song.album.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : songs;
  
  const handleRequest = (songId: string) => {
    requestSong(songId);
    toast.success("Song requested successfully");
  };
  
  const handleUpload = () => {
    toast.info("Song upload feature would be integrated with your Icecast server");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold">Songs Library</h1>
        <div className="flex gap-2">
          <SongUploader />
          <Button>
            <Plus size={16} className="mr-2" />
            Add Song
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-card">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ListMusic className="h-5 w-5 mr-2 text-harmony-primary" />
              Song Library
            </CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search songs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead className="hidden md:table-cell">Album</TableHead>
                  <TableHead className="hidden md:table-cell">Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSongs.length > 0 ? (
                  filteredSongs.map((song) => (
                    <TableRow key={song.id}>
                      <TableCell>
                        <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                          {song.coverArt ? (
                            <img 
                              src={song.coverArt} 
                              alt={song.title} 
                              className="h-full w-full object-cover rounded-md" 
                            />
                          ) : (
                            <MusicIcon size={16} className="text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{song.title}</TableCell>
                      <TableCell>{song.artist}</TableCell>
                      <TableCell className="hidden md:table-cell">{song.album || "-"}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatDuration(song.duration)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <PlayCircle size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRequest(song.id)}
                        >
                          Request
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No songs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListMusic className="h-5 w-5 mr-2 text-harmony-primary" />
              Library Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Songs:</span>
                <Badge variant="outline" className="text-sm">
                  {songs.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Duration:</span>
                <Badge variant="outline" className="text-sm">
                  {formatDuration(songs.reduce((acc, song) => acc + song.duration, 0))}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Playlists:</span>
                <Badge variant="outline" className="text-sm">
                  3
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Genres:</span>
                <Badge variant="outline" className="text-sm">
                  5
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListMusic className="h-5 w-5 mr-2 text-harmony-primary" />
              Most Requested
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {songs.slice(0, 5).map((song, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
                    {song.coverArt ? (
                      <img 
                        src={song.coverArt} 
                        alt={song.title} 
                        className="h-full w-full object-cover rounded-md" 
                      />
                    ) : (
                      <MusicIcon size={16} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{song.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {Math.floor(Math.random() * 50) + 1} requests
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SongsPage;
