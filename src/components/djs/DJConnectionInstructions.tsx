
import React from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Headphones, Info, Laptop, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ConnectionSettings = {
  serverUrl: string;
  port: number;
  mountpoint: string;
  username: string;
  password: string;
  encodingBitrate: number;
  encodingFormat: "mp3" | "aac" | "ogg";
};

export function DJConnectionInstructions() {
  const [settings] = useLocalStorage<ConnectionSettings>(
    "dj-connection-settings",
    {
      serverUrl: "stream.yourstation.com",
      port: 8000,
      mountpoint: "/live",
      username: "source",
      password: "",
      encodingBitrate: 128,
      encodingFormat: "mp3",
    }
  );

  const copyConnectionString = () => {
    // Create a connection string in the format many DJ apps expect
    const connectionString = `${settings.serverUrl}:${settings.port}${settings.mountpoint}`;
    navigator.clipboard.writeText(connectionString);
    toast.success("Connection string copied to clipboard");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones className="h-5 w-5" /> DJ Connection Instructions
        </CardTitle>
        <CardDescription>
          How DJs can connect their broadcasting software to your station
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Share these details with your DJs</AlertTitle>
          <AlertDescription>
            DJs will need to configure their broadcasting software with these settings to go live.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h3 className="font-medium">Connection Details</h3>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-sm font-medium">Server URL:</div>
            <div className="text-sm">{settings.serverUrl}</div>
            
            <div className="text-sm font-medium">Port:</div>
            <div className="text-sm">{settings.port}</div>
            
            <div className="text-sm font-medium">Mountpoint:</div>
            <div className="text-sm">{settings.mountpoint}</div>
            
            <div className="text-sm font-medium">Username:</div>
            <div className="text-sm">{settings.username}</div>
            
            <div className="text-sm font-medium">Password:</div>
            <div className="text-sm">••••••••</div>
            
            <div className="text-sm font-medium">Recommended Bitrate:</div>
            <div className="text-sm">{settings.encodingBitrate} kbps</div>
            
            <div className="text-sm font-medium">Recommended Format:</div>
            <div className="text-sm">{settings.encodingFormat.toUpperCase()}</div>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={copyConnectionString}>
              Copy Connection String
            </Button>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <h3 className="font-medium">Recommended Software</h3>
          <div className="space-y-2 text-sm">
            <p><strong>For Desktop:</strong> BUTT, Mixxx, Radiologik DJ</p>
            <p><strong>For Mobile:</strong> Broadcast Me, Spreaker Studio, iCast</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
