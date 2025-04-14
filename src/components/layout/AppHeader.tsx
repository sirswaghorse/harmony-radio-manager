
import { useTheme } from "@/contexts/ThemeContext";
import { useRadio } from "@/contexts/RadioContext";
import { Button } from "@/components/ui/button";
import { Menu, Radio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

interface AppHeaderProps {
  onMenuToggle: () => void;
}

export function AppHeader({ onMenuToggle }: AppHeaderProps) {
  const { stationLogo } = useTheme();
  const { stats } = useRadio();
  const { setOpenMobile } = useSidebar();

  const handleMenuToggle = () => {
    setOpenMobile(true);  // Explicitly open the mobile sidebar
    onMenuToggle();       // Call the original toggle function as well
  };

  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleMenuToggle}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            {stationLogo ? (
              <img 
                src={stationLogo} 
                alt="Station Logo" 
                className="h-8 w-8 object-contain" 
              />
            ) : (
              <Radio className="h-6 w-6 text-harmony-primary" />
            )}
            <h1 className="text-xl font-bold">Harmony</h1>
          </div>
        </div>
        
        <Card className="p-2 px-4 flex items-center gap-4 bg-background">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></div>
            <span className="text-sm font-medium">
              Listeners: {stats.listeners}
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm font-medium">Now Playing:</span>
            <span className="text-sm">
              {stats.currentSong.artist} - {stats.currentSong.title}
            </span>
            <span className="text-xs text-muted-foreground">
              ({formatDuration(stats.currentSong.duration)})
            </span>
          </div>
          
          <div className="hidden lg:block">
            <Badge 
              variant={stats.autoDJActive ? "default" : "secondary"}
              className="text-xs"
            >
              {stats.autoDJActive 
                ? "Auto DJ: Active" 
                : stats.currentDJ 
                  ? `On Air: ${stats.currentDJ.name}` 
                  : "Auto DJ: Inactive"
              }
            </Badge>
          </div>
        </Card>
      </div>
    </header>
  );
}
