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
import { AlertCircle, CheckCircle, Loader } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const icecastSettingsSchema = z.object({
  hostname: z.string().min(1, "Hostname is required"),
  port: z.coerce.number().int().min(0).max(65535),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  mountPoint: z.string().min(1, "Mount point is required"),
  enableStats: z.boolean().default(true),
});

type IcecastSettings = z.infer<typeof icecastSettingsSchema>;

export function IcecastTab() {
  const [savedIcecastSettings, setSavedIcecastSettings] = useLocalStorage<IcecastSettings>("icecast-settings", {
    hostname: "s7.yesstreaming.net",
    port: 8042,
    username: "admin",
    password: "Oh3SnL1FJpvc",
    mountPoint: "/stream",
    enableStats: true,
  });

  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string } | null>(null);

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
      const baseUrl = `https://${values.hostname}:${values.port}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const response = await fetch(`${baseUrl}/status-json.xsl`, {
          headers: {
            'Authorization': 'Basic ' + btoa(`${values.username}:${values.password}`)
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setVerificationResult({
            success: true,
            message: "Successfully connected to Icecast server!"
          });
          return;
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.log("HTTPS connection failed, trying HTTP");
      }
      
      const httpController = new AbortController();
      const httpTimeoutId = setTimeout(() => httpController.abort(), 10000);
      
      try {
        const httpResponse = await fetch(`http://${values.hostname}:${values.port}/status-json.xsl`, {
          headers: {
            'Authorization': 'Basic ' + btoa(`${values.username}:${values.password}`)
          },
          signal: httpController.signal
        });
        
        clearTimeout(httpTimeoutId);
        
        if (httpResponse.ok) {
          setVerificationResult({
            success: true,
            message: "Successfully connected to Icecast server!"
          });
          return;
        } else {
          setVerificationResult({
            success: false,
            message: `Server returned error ${httpResponse.status}. Check your credentials.`
          });
        }
      } catch (httpError) {
        clearTimeout(httpTimeoutId);
        console.error("HTTP connection error:", httpError);
        
        setVerificationResult({
          success: false,
          message: "Connection failed. This may be due to CORS restrictions or the server may be unreachable. Try using a server proxy or check if the server is online."
        });
      }
    } catch (error) {
      console.error("Connection verification error:", error);
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
                      The hostname or IP address of your Icecast server
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
