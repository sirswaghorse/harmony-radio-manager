
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getEmbedCode } from "@/lib/utils";
import { toast } from "sonner";
import { PlayerWidget } from "@/components/widgets/PlayerWidget";
import { CurrentSongWidget } from "@/components/widgets/CurrentSongWidget";
import { RecentTracksWidget } from "@/components/widgets/RecentTracksWidget";
import { RecentRequestsWidget } from "@/components/widgets/RecentRequestsWidget";
import { CurrentDJWidget } from "@/components/widgets/CurrentDJWidget";
import { RequestSongWidget } from "@/components/widgets/RequestSongWidget";
import { Code, Copy } from "lucide-react";

const WidgetsPage = () => {
  const [activeWidget, setActiveWidget] = useState("player");
  const [embedCode, setEmbedCode] = useState(getEmbedCode("player"));
  
  const handleTabChange = (value: string) => {
    setActiveWidget(value);
    setEmbedCode(getEmbedCode(value));
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Widgets</h1>
      <p className="text-muted-foreground">
        Embed these widgets on your website to showcase your station content.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Tabs 
            value={activeWidget} 
            onValueChange={handleTabChange} 
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full">
              <TabsTrigger value="player">Player</TabsTrigger>
              <TabsTrigger value="current-song">Current Song</TabsTrigger>
              <TabsTrigger value="recent-tracks">Recent Tracks</TabsTrigger>
              <TabsTrigger value="recent-requests">Recent Requests</TabsTrigger>
              <TabsTrigger value="current-dj">Current DJ</TabsTrigger>
              <TabsTrigger value="request-song">Request Song</TabsTrigger>
            </TabsList>
            
            <TabsContent value="player" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Player Widget</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="bg-muted p-4 rounded-md w-full max-w-lg">
                    <PlayerWidget />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="current-song" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Song Widget</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="bg-muted p-4 rounded-md w-full max-w-lg">
                    <CurrentSongWidget />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recent-tracks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Tracks Widget</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="bg-muted p-4 rounded-md w-full max-w-lg">
                    <RecentTracksWidget />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recent-requests" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Requests Widget</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="bg-muted p-4 rounded-md w-full max-w-lg">
                    <RecentRequestsWidget />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="current-dj" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current DJ Widget</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="bg-muted p-4 rounded-md w-full max-w-lg">
                    <CurrentDJWidget />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="request-song" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Request Song Widget</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="bg-muted p-4 rounded-md h-[400px] overflow-y-auto w-full max-w-lg">
                    <RequestSongWidget />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code size={18} />
                Embed Code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <Textarea 
                value={embedCode} 
                readOnly 
                rows={12} 
                className="font-mono text-sm h-full min-h-[250px]"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={copyToClipboard} className="ml-auto">
                <Copy size={16} className="mr-2" />
                Copy Code
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Widget Options</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add these widgets to your website by copying the embed code and pasting it into your HTML.
                </p>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Width:</span> Adjust with CSS on your site
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Height:</span> Auto-adjusts to content
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Style:</span> Inherits your site's theme
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetsPage;
