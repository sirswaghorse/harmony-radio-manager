
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { stats } = useRadio();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Station Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={16} className="text-harmony-primary" />
              Recently Played
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentlyPlayed.map((song, index) => (
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
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgeCheck size={16} className="text-harmony-primary" />
              Recent Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentRequests.map((song, index) => (
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
  );
};

export default Index;
