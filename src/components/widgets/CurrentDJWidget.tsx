
import { useRadio } from "@/contexts/RadioContext";
import { UserCheck, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CurrentDJWidget() {
  const { stats } = useRadio();
  
  const dj = stats.currentDJ;
  const autoDjActive = stats.autoDJActive;

  return (
    <div className="bg-card border rounded-md p-3 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Radio size={16} className="text-harmony-primary" />
        <h3 className="font-medium">Now On Air</h3>
      </div>
      
      {dj ? (
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-muted flex-shrink-0 overflow-hidden">
            {dj.avatar ? (
              <img 
                src={dj.avatar} 
                alt={dj.name} 
                className="h-full w-full object-cover" 
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <UserCheck size={24} className="text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <div className="font-medium">{dj.name}</div>
            <div className="text-sm text-muted-foreground line-clamp-2">
              {dj.bio || "Live on air"}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
            <Radio size={24} className={autoDjActive ? "text-harmony-primary" : "text-muted-foreground"} />
          </div>
          <div>
            <div className="font-medium">Auto DJ</div>
            <div className="text-sm text-muted-foreground">
              {autoDjActive ? (
                <>
                  <Badge variant="outline" className="mr-2">Active</Badge>
                  Playing the best tracks automatically
                </>
              ) : (
                "Currently inactive"
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
