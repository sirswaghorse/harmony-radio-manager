
import React, { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Globe, Loader, Radio, Shield, Webhook } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const icecastSettingsSchema = z.object({
  hostname: z.string().min(1, "Hostname is required"),
  port: z.coerce.number().int().min(0).max(65535),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  sourcePassword: z.string().min(1, "Source password is required"),
  mountPoint: z.string().min(1, "Mount point is required"),
  enableStats: z.boolean().default(true),
  connectionType: z.enum(["direct", "cors-proxy"]).default("direct"),
  useHttps: z.boolean().default(false),
});

type IcecastSettings = z.infer<typeof icecastSettingsSchema>;

export function IcecastTab() {
  const [savedIcecastSettings, setSavedIcecastSettings] = useLocalStorage<IcecastSettings>("icecast-settings", {
    hostname: "s7.yesstreaming.net",
    port: 8042,
    username: "admin",
    password: "Oh3SnL1FJpvc",
    sourcePassword: "hackme", // Default source password
    mountPoint: "/stream",
    enableStats: true,
    connectionType: "direct",
    useHttps: false,
  });

  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string } | null>(null);
  const [connectionTab, setConnectionTab] = useState("basic");

  const icecastForm = useForm<IcecastSettings>({
    resolver: zodResolver(icecastSettingsSchema),
    defaultValues: savedIcecastSettings,
  });

  const onIcecastSubmit = (data: IcecastSettings) => {
    setSavedIcecastSettings(data);
    toast.success("Icecast Settings Updated", {
      description: "Your Icecast server settings have been saved.",
    });
  };

  const verifyConnection = async () => {
    const values = icecastForm.getValues();
    setVerifying(true);
    setVerificationResult(null);
    
    try {
      // Fixed URL formation - remove any accidental double http:// or https://
      const cleanHostname = values.hostname.replace(/^(https?:\/\/)+/i, '');
      
      // Determine which protocol to use
      const protocol = values.useHttps ? 'https://' : 'http://';
      
      // For direct connection
      let url = `${protocol}${cleanHostname}:${values.port}/status-json.xsl`;
      
      // If using CORS proxy
      if (values.connectionType === "cors-proxy") {
        url = `/api/icecast-proxy?url=${encodeURIComponent(url)}`;
      }
      
      console.log(`Attempting connection to: ${url}`);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch(url, {
          headers: values.connectionType === "direct" ? {
            'Authorization': 'Basic ' + btoa(`${values.username}:${values.password}`)
          } : {},
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          try {
            // Try to parse as JSON to verify it's a valid Icecast response
            const data = await response.json();
            if (data?.icestats) {
              setVerificationResult({
                success: true,
                message: `Successfully connected to Icecast server via ${values.useHttps ? 'HTTPS' : 'HTTP'}!`
              });
            } else {
              throw new Error("Response is not a valid Icecast status");
            }
          } catch (parseError) {
            setVerificationResult({
              success: false,
              message: "Server responded but did not return valid Icecast data. Check if this is actually an Icecast server."
            });
          }
        } else {
          setVerificationResult({
            success: false,
            message: `Server returned error ${response.status}. Check your credentials.`
          });
        }
      } catch (error: any) {
        console.error("Connection error:", error);
        
        if (error instanceof TypeError && error.message.includes("NetworkError")) {
          setVerificationResult({
            success: false,
            message: "Connection failed due to network restrictions. Try using the CORS proxy option in the Advanced settings tab."
          });
        } else if (error.name === 'AbortError') {
          setVerificationResult({
            success: false,
            message: "Connection timed out. The server may be unreachable or slow to respond."
          });
        } else {
          setVerificationResult({
            success: false,
            message: "Connection failed. This may be due to CORS restrictions, the server being unreachable, or incorrect settings."
          });
        }
      }
    } catch (error) {
      console.error("Connection verification general error:", error);
      setVerificationResult({
        success: false,
        message: "Connection failed. Please verify the server address and credentials."
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Icecast Server Configuration</CardTitle>
        <CardDescription>
          Configure your Icecast server connection details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...icecastForm}>
          <form onSubmit={icecastForm.handleSubmit(onIcecastSubmit)} className="space-y-4">
            <Tabs value={connectionTab} onValueChange={setConnectionTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">
                  <Globe className="mr-2 h-4 w-4" />
                  Basic Settings
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <Shield className="mr-2 h-4 w-4" />
                  Advanced Options
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={icecastForm.control}
                    name="hostname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hostname</FormLabel>
                        <FormControl>
                          <Input placeholder="localhost" {...field} />
                        </FormControl>
                        <FormDescription>
                          The hostname or IP address of your Icecast server (without http:// or https://)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={icecastForm.control}
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
                    control={icecastForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Username</FormLabel>
                        <FormControl>
                          <Input placeholder="admin" {...field} />
                        </FormControl>
                        <FormDescription>
                          The admin username for your Icecast server
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={icecastForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormDescription>
                          The admin password for your Icecast server
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={icecastForm.control}
                    name="sourcePassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormDescription>
                          The source client password for uploading songs and broadcasting
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={icecastForm.control}
                    name="mountPoint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mount Point</FormLabel>
                        <FormControl>
                          <Input placeholder="/stream" {...field} />
                        </FormControl>
                        <FormDescription>
                          The mount point for your stream
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={icecastForm.control}
                    name="enableStats"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Enable Statistics</FormLabel>
                          <FormDescription>
                            Allow collection of listener statistics
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
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={icecastForm.control}
                    name="useHttps"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Use HTTPS</FormLabel>
                          <FormDescription>
                            Connect to Icecast server using HTTPS protocol
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
                    control={icecastForm.control}
                    name="connectionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Connection Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select connection type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="direct">Direct Connection</SelectItem>
                            <SelectItem value="cors-proxy">CORS Proxy (For Self-Hosted Servers)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          If you're having CORS issues with a self-hosted server, try the CORS proxy option
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {icecastForm.watch("connectionType") === "cors-proxy" && (
                  <Alert>
                    <Webhook className="h-4 w-4" />
                    <AlertDescription>
                      CORS Proxy mode requires a server-side proxy to be configured. If you're hosting this app yourself, 
                      you'll need to set up a proxy endpoint at /api/icecast-proxy. This helps bypass CORS restrictions
                      that may prevent direct browser connections to your Icecast server.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="flex flex-col space-y-4 mt-6">
              <div className="flex flex-row gap-4">
                <Button type="submit">Save Icecast Settings</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={verifyConnection}
                  disabled={verifying}
                >
                  {verifying ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Connection
                    </>
                  )}
                </Button>
              </div>

              {verificationResult && (
                <Alert variant={verificationResult.success ? "default" : "destructive"}>
                  {verificationResult.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {verificationResult.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
