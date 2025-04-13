
import { useState } from "react";
import { useRadio } from "@/contexts/RadioContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CircleAlertIcon, MusicIcon, PlayCircle, PlusIcon, Trash2Icon } from "lucide-react";

const AutoDJPage = () => {
  const { stats, toggleAutoDJ } = useRadio();
  const [crossfade, setCrossfade] = useState(5);
  const [selectedPlaylist, setSelectedPlaylist] = useState("all");
  const [playlists, setPlaylists] = useState([
    { id: "1", name: "Top Hits", songCount: 45 },
    { id: "2", name: "Classic Rock", songCount: 67 },
    { id: "3", name: "Chill Vibes", songCount: 32 },
  ]);
  
  const handleToggleAutoDJ = () => {
    toggleAutoDJ();
    toast.success(stats.autoDJActive 
      ? "Auto DJ deactivated. Please assign a DJ to go on air." 
      : "Auto DJ activated"
    );
  };
  
  const handleSaveSettings = () => {
    toast.success("Auto DJ settings saved successfully");
  };
  
  const handleDeletePlaylist = (id: string) => {
    setPlaylists(playlists.filter(playlist => playlist.id !== id));
    toast.success("Playlist removed from rotation");
  };
  
  // In a real app, this would add a new playlist from a dialog
  const handleAddPlaylist = () => {
    const newPlaylist = { 
      id: `${Date.now()}`, 
      name: "New Playlist", 
      songCount: 0 
    };
    setPlaylists([...playlists, newPlaylist]);
    toast.success("New playlist added. Configure it in the playlists section.");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Auto DJ</h1>
      <p className="text-muted-foreground">
        Configure the Auto DJ settings to automatically play music when no DJ is on air.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auto DJ Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Auto DJ</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically plays songs when no DJ is broadcasting
                  </p>
                </div>
                <Switch 
                  checked={stats.autoDJActive} 
                  onCheckedChange={handleToggleAutoDJ} 
                />
              </div>
              
              {!stats.autoDJActive && (
                <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-3 rounded-md flex items-center gap-2 text-sm">
                  <CircleAlertIcon size={16} />
                  <span>Auto DJ is currently inactive. No music will play unless a DJ is broadcasting.</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Playback Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Crossfade Duration</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Slider 
                        value={[crossfade]} 
                        onValueChange={values => setCrossfade(values[0])} 
                        min={0} 
                        max={10} 
                        step={1} 
                      />
                    </div>
                    <div className="w-12 text-center">
                      {crossfade}s
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Playlist Selection</Label>
                  <Select value={selectedPlaylist} onValueChange={setSelectedPlaylist}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a playlist" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Songs</SelectItem>
                      {playlists.map(playlist => (
                        <SelectItem key={playlist.id} value={playlist.id}>
                          {playlist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Repeat Mode</Label>
                  <Select defaultValue="shuffle">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shuffle">Shuffle</SelectItem>
                      <SelectItem value="sequential">Sequential</SelectItem>
                      <SelectItem value="repeat-one">Repeat One</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    Save Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Playlists in Rotation</CardTitle>
              <Button size="sm" variant="outline" onClick={handleAddPlaylist}>
                <PlusIcon size={16} className="mr-1" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {playlists.map(playlist => (
                  <div 
                    key={playlist.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                  >
                    <div className="flex items-center">
                      <MusicIcon size={16} className="mr-2 text-harmony-primary" />
                      <div>
                        <p className="font-medium">{playlist.name}</p>
                        <p className="text-xs text-muted-foreground">{playlist.songCount} songs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-harmony-primary"
                      >
                        <PlayCircle size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeletePlaylist(playlist.id)}
                      >
                        <Trash2Icon size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tracks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50"
                  >
                    <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
                      <MusicIcon size={16} className="text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {["Summer Vibes", "Electric Dreams", "Midnight City", "Ocean Blue", "Mountain High"][i-1]}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {["DJ Harmony", "Luna Wave", "Electric Pulse", "Ambient Flow", "Classic Jack"][i-1]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AutoDJPage;
