
import React, { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Mic, MicOff, Radio, Headphones, Volume2, Info, Broadcast } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ConnectionSettings = {
  serverUrl: string;
  port: number;
  mountpoint: string;
  username: string;
  password: string;
  encodingBitrate: number;
  encodingFormat: "mp3" | "aac" | "ogg";
};

const broadcasterSchema = z.object({
  djName: z.string().min(1, "DJ name is required"),
  showName: z.string().optional(),
  enableEcho: z.boolean().default(false),
  enableNoiseReduction: z.boolean().default(true),
});

type BroadcasterSettings = z.infer<typeof broadcasterSchema>;

export function DJBroadcastPanel() {
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

  const [broadcasting, setBroadcasting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [micAccess, setMicAccess] = useState<boolean | null>(null);
  const [selectedMic, setSelectedMic] = useState<string>("");
  const [availableMics, setAvailableMics] = useState<MediaDeviceInfo[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const form = useForm<BroadcasterSettings>({
    resolver: zodResolver(broadcasterSchema),
    defaultValues: {
      djName: "",
      showName: "",
      enableEcho: false,
      enableNoiseReduction: true,
    },
  });

  // Request microphone access
  const requestMicAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicAccess(true);
      
      // Get available microphones
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter(device => device.kind === 'audioinput');
      setAvailableMics(mics);
      
      if (mics.length > 0) {
        setSelectedMic(mics[0].deviceId);
      }
      
      // Initialize audio context
      audioContextRef.current = new AudioContext();
      
      toast.success("Microphone access granted");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setMicAccess(false);
      toast.error("Could not access microphone");
    }
  };

  const connectToServer = () => {
    // In a real implementation, this would establish a connection to the Icecast server
    // For demo purposes, we'll simulate connecting
    toast.loading("Connecting to server...");
    
    setTimeout(() => {
      setConnected(true);
      toast.success("Connected to server");
    }, 1500);
  };

  const disconnectFromServer = () => {
    // In a real implementation, this would close the connection to the Icecast server
    setConnected(false);
    setBroadcasting(false);
    toast.success("Disconnected from server");
  };

  const startBroadcasting = () => {
    if (!connected) {
      connectToServer();
    }
    
    // In a real implementation, this would start sending audio to the Icecast server
    setBroadcasting(true);
    toast.success("Broadcasting started");
  };

  const stopBroadcasting = () => {
    // In a real implementation, this would stop sending audio to the Icecast server
    setBroadcasting(false);
    toast.success("Broadcasting stopped");
  };

  const changeMicrophone = (deviceId: string) => {
    setSelectedMic(deviceId);
    
    // In a real implementation, this would switch the audio input
    toast.success("Microphone changed");
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Broadcast className="h-5 w-5" /> DJ Broadcasting Panel
        </CardTitle>
        <CardDescription>
          Broadcast directly to your station from your browser
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {micAccess === null ? (
          <div className="text-center py-6">
            <Mic className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Microphone Access Required</h3>
            <p className="text-sm text-muted-foreground mb-4">
              To broadcast, we need access to your microphone. Click the button below to grant access.
            </p>
            <Button onClick={requestMicAccess}>
              <Mic className="mr-2 h-4 w-4" /> Grant Microphone Access
            </Button>
          </div>
        ) : micAccess === false ? (
          <Alert variant="destructive">
            <MicOff className="h-4 w-4" />
            <AlertTitle>Microphone access denied</AlertTitle>
            <AlertDescription>
              Broadcasting requires microphone access. Please enable it in your browser settings and reload the page.
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormLabel>Microphone</FormLabel>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedMic}
                      onChange={(e) => changeMicrophone(e.target.value)}
                    >
                      {availableMics.map(mic => (
                        <option key={mic.deviceId} value={mic.deviceId}>
                          {mic.label || `Microphone ${mic.deviceId.slice(0, 4)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <FormLabel>Input Volume</FormLabel>
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        value={volume}
                        onValueChange={setVolume}
                        max={100}
                        step={1}
                      />
                      <span className="text-sm text-muted-foreground w-8">{volume[0]}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-md p-4 space-y-2">
                  <h3 className="font-medium">Connection Status</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className={connected ? "text-green-500" : "text-muted-foreground"} size={16} />
                      <span>{connected ? "Connected" : "Disconnected"}</span>
                    </div>
                    <Button 
                      size="sm"
                      variant={connected ? "outline" : "default"}
                      onClick={connected ? disconnectFromServer : connectToServer}
                    >
                      {connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {connected ? 
                      `Connected to ${settings.serverUrl}:${settings.port}${settings.mountpoint}` :
                      "Not connected to server"
                    }
                  </div>
                </div>
                
                <div className="pt-4 flex justify-center">
                  {broadcasting ? (
                    <Button 
                      size="lg" 
                      variant="destructive"
                      className="px-12"
                      onClick={stopBroadcasting}
                    >
                      <Radio className="mr-2 h-5 w-5 animate-pulse" /> Stop Broadcasting
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      className="px-12"
                      onClick={startBroadcasting}
                    >
                      <Mic className="mr-2 h-5 w-5" /> Start Broadcasting
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              <Form {...form}>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="djName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>DJ Name</FormLabel>
                          <FormControl>
                            <Input placeholder="DJ Name" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your name as it will appear to listeners
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="showName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Show Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Show Name (optional)" {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of your show (optional)
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="enableNoiseReduction"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Noise Reduction</FormLabel>
                            <FormDescription>
                              Reduce background noise in your broadcast
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="enableEcho"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Echo Cancellation</FormLabel>
                            <FormDescription>
                              Remove echoes from your audio
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Connection Information</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>You're broadcasting to:</p>
                  <p><strong>Server:</strong> {settings.serverUrl}</p>
                  <p><strong>Port:</strong> {settings.port}</p>
                  <p><strong>Mountpoint:</strong> {settings.mountpoint}</p>
                  <p><strong>Format:</strong> {settings.encodingFormat.toUpperCase()} @ {settings.encodingBitrate}kbps</p>
                </AlertDescription>
              </Alert>
              
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  This feature uses your browser's audio capabilities to broadcast. For professional broadcasting with more features, consider using dedicated broadcasting software like BUTT, Mixxx, or Radiologik DJ.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
