
import { useRadio } from "@/contexts/RadioContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";
import {
  BarChart,
  BadgeCheck,
  Clock,
  MusicIcon,
  Radio,
  UserCheck,
  Play,
  Square,
  RefreshCcw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const Index = () => {
  const { stats, toggleAutoDJ } = useRadio();
  const [stationStatus, setStationStatus] = useState<"running" | "stopped" | "restarting">(
    stats.autoDJActive ? "running" : "stopped"
  );

  const handleStart = () => {
    if (stationStatus === "stopped") {
      setStationStatus("running");
      toggleAutoDJ();
      toast({
        title: "Station Started",
        description: "The radio station is now broadcasting",
      });
    }
  };

  const handleStop = () => {
    if (stationStatus === "running") {
      setStationStatus("stopped");
      toggleAutoDJ();
      toast({
        title: "Station Stopped",
        description: "The radio station has been stopped",
      });
    }
  };

  const handleRestart = () => {
    setStationStatus("restarting");
    
    // Simulate restart process
    setTimeout(() => {
      setStationStatus("running");
      toast({
        title: "Station Restarted",
        description: "The radio station has been restarted successfully",
      });
    }, 2000);
  };

  return (
    <div className="space-y-4 w-full max-w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Station Overview</h1>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleStart}
            disabled={stationStatus === "running" || stationStatus === "restarting"}
            className="flex gap-1"
          >
            <Play size={16} />
            Start
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleStop}
            disabled={stationStatus === "stopped" || stationStatus === "restarting"}
            className="flex gap-1"
          >
            <Square size={16} />
            Stop
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRestart}
            disabled={stationStatus === "restarting" || stationStatus === "stopped"}
            className="flex gap-1"
          >
            <RefreshCcw size={16} className={stationStatus === "restarting" ? "animate-spin" : ""} />
            Restart
          </Button>
        </div>
      </div>
      
      {/* Stats Cards - Expanded for larger screens */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Radio size={16} className="text-harmony-primary" />
              Listeners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.listeners}</div>
            <p className="text-xs text-muted-foreground">Current listeners</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MusicIcon size={16} className="text-harmony-primary" />
              Now Playing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium truncate">{stats.currentSong.title}</div>
            <p className="text-xs text-muted-foreground truncate">{stats.currentSong.artist}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UserCheck size={16} className="text-harmony-primary" />
              DJ Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.currentDJ ? (
              <>
                <div className="text-lg font-medium truncate">{stats.currentDJ.name}</div>
                <p className="text-xs text-muted-foreground">Live on air</p>
              </>
            ) : (
              <>
                <div className="text-lg font-medium truncate">Auto DJ</div>
                <p className="text-xs text-muted-foreground">
                  {stats.autoDJActive ? "Active" : "Inactive"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart size={16} className="text-harmony-primary" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">Daily requests</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Widgets Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Featured Widgets - Full width on smaller screens, 2/3 width on larger screens */}
        <div className="xl:col-span-2 space-y-4">
          {/* Player Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Station Player</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-harmony-light rounded-md flex items-center justify-center">
                  <Radio size={24} className="text-harmony-primary" />
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <div className="font-medium text-lg truncate">{stats.currentSong.title}</div>
                    <div className="text-sm text-muted-foreground truncate">{stats.currentSong.artist}</div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="bg-harmony-primary h-full w-1/3 rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1:23</span>
                    <span>{formatDuration(stats.currentSong.duration)}</span>
                  </div>
                </div>
                <Button variant="secondary" size="icon" className="rounded-full h-12 w-12">
                  <Play size={20} />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recently Played */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={16} className="text-harmony-primary" />
                  Recently Played
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentlyPlayed.slice(0, 4).map((song, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                        {song.coverArt ? (
                          <img 
                            src={song.coverArt} 
                            alt={song.title} 
                            className="h-full w-full object-cover rounded-md" 
                          />
                        ) : (
                          <MusicIcon size={20} className="text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{song.title}</div>
                        <div className="text-sm text-muted-foreground truncate">{song.artist}</div>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDuration(song.duration)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Requests */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BadgeCheck size={16} className="text-harmony-primary" />
                  Recent Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentRequests.slice(0, 4).map((song, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                        {song.coverArt ? (
                          <img 
                            src={song.coverArt} 
                            alt={song.title} 
                            className="h-full w-full object-cover rounded-md" 
                          />
                        ) : (
                          <MusicIcon size={20} className="text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{song.title}</div>
                        <div className="text-sm text-muted-foreground truncate">{song.artist}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">Requested</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Sidebar Widgets - 1/3 width on larger screens */}
        <div className="space-y-4">
          {/* Current DJ/Auto DJ Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck size={16} className="text-harmony-primary" />
                On Air
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.currentDJ ? (
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                    {stats.currentDJ.avatar ? (
                      <img 
                        src={stats.currentDJ.avatar} 
                        alt={stats.currentDJ.name} 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <UserCheck size={24} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{stats.currentDJ.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {stats.currentDJ.bio || "Live on air"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                    <Radio size={24} className={stats.autoDJActive ? "text-harmony-primary" : "text-muted-foreground"} />
                  </div>
                  <div>
                    <div className="font-medium">Auto DJ</div>
                    <div className="text-sm text-muted-foreground">
                      {stats.autoDJActive ? (
                        <>
                          <Badge variant="outline" className="mr-2">Active</Badge>
                          Playing automatically
                        </>
                      ) : (
                        "Currently inactive"
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart size={16} className="text-harmony-primary" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Total Tracks:</div>
                  <div className="font-medium">1,245</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Broadcast Hours:</div>
                  <div className="font-medium">214</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Monthly Listeners:</div>
                  <div className="font-medium">5,392</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Top Genre:</div>
                  <div className="font-medium">Electronic</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="text-sm">CPU Usage</div>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-harmony-primary h-full w-1/4 rounded-full"></div>
                </div>
                <div className="text-sm font-medium">25%</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">Memory</div>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-harmony-primary h-full w-2/5 rounded-full"></div>
                </div>
                <div className="text-sm font-medium">40%</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">Disk</div>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-harmony-primary h-full w-3/5 rounded-full"></div>
                </div>
                <div className="text-sm font-medium">60%</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
