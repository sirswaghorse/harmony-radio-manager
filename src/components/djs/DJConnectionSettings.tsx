
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "sonner";
import { Mic, Copy } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const connectionSchema = z.object({
  serverUrl: z.string().min(1, "Server URL is required"),
  port: z.coerce.number().int().min(0).max(65535),
  mountpoint: z.string().min(1, "Mountpoint is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  encodingBitrate: z.coerce.number().int().min(32).max(320),
  encodingFormat: z.enum(["mp3", "aac", "ogg"]),
});

type ConnectionSettings = z.infer<typeof connectionSchema>;

export function DJConnectionSettings() {
  const [icecastSettings] = useLocalStorage("icecast-settings", {
    hostname: "s7.yesstreaming.net",
    port: 8042,
    username: "admin", 
    password: "Oh3SnL1FJpvc",
    mountPoint: "/stream",
    enableStats: true,
  });
  
  const [savedSettings, setSavedSettings] = useLocalStorage<ConnectionSettings>(
    "dj-connection-settings",
    {
      serverUrl: icecastSettings.hostname || "stream.yourstation.com",
      port: icecastSettings.port || 8000,
      mountpoint: icecastSettings.mountPoint || "/live",
      username: "source",
      password: "",
      encodingBitrate: 128,
      encodingFormat: "mp3",
    }
  );
  
  const form = useForm<ConnectionSettings>({
    resolver: zodResolver(connectionSchema),
    defaultValues: savedSettings,
  });
  
  useEffect(() => {
    if (icecastSettings) {
      // Remove any http:// or https:// prefixes from hostname for consistency
      const cleanHostname = icecastSettings.hostname.replace(/^(https?:\/\/)+/i, '');
      
      form.setValue("serverUrl", cleanHostname);
      form.setValue("port", icecastSettings.port);
      form.setValue("mountpoint", icecastSettings.mountPoint);
    }
  }, [icecastSettings, form]);

  const onSubmit = (data: ConnectionSettings) => {
    setSavedSettings(data);
    toast.success("Connection settings saved", {
      description: "Your DJ connection settings have been updated.",
    });
  };

  const copyConnectionDetails = () => {
    const values = form.getValues();
    const details = `Server: ${values.serverUrl}\nPort: ${values.port}\nMountpoint: ${values.mountpoint}\nUsername: ${values.username}\nPassword: ${values.password}\nEncoding: ${values.encodingFormat} at ${values.encodingBitrate}kbps`;
    
    navigator.clipboard.writeText(details)
      .then(() => {
        toast.success("Copied to clipboard", {
          description: "Connection details have been copied to your clipboard."
        });
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy", {
          description: "Could not copy to clipboard. Please try again."
        });
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" /> DJ Connection Settings
        </CardTitle>
        <CardDescription>
          Configure how DJs can connect to your radio station
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serverUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server URL</FormLabel>
                    <FormControl>
                      <Input placeholder="stream.yourstation.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      The URL of your Icecast server (without http:// or https://)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="8000" {...field} />
                    </FormControl>
                    <FormDescription>
                      The port your Icecast server is running on
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mountpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mountpoint</FormLabel>
                    <FormControl>
                      <Input placeholder="/live" {...field} />
                    </FormControl>
                    <FormDescription>
                      The mountpoint for DJ broadcasts
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Username</FormLabel>
                    <FormControl>
                      <Input placeholder="source" {...field} />
                    </FormControl>
                    <FormDescription>
                      Username for source client authentication
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      Password for source client authentication
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="encodingBitrate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Encoding Bitrate (kbps)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="128" {...field} />
                    </FormControl>
                    <FormDescription>
                      Recommended bitrate for DJ broadcasts
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="encodingFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Encoding Format</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="mp3">MP3</option>
                        <option value="aac">AAC</option>
                        <option value="ogg">OGG/Vorbis</option>
                      </select>
                    </FormControl>
                    <FormDescription>
                      Recommended encoding format
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-4 flex flex-row gap-4">
              <Button type="submit">Save Connection Settings</Button>
              <Button 
                type="button" 
                variant="secondary"
                onClick={copyConnectionDetails}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Connection Details
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
