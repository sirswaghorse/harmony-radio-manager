
import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";

const icecastSettingsSchema = z.object({
  hostname: z.string().min(1, "Hostname is required"),
  port: z.coerce.number().int().min(0).max(65535),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  mountPoint: z.string().min(1, "Mount point is required"),
  enableStats: z.boolean().default(true),
});

const requestSettingsSchema = z.object({
  maxRequestsPerHour: z.coerce.number().int().min(0).max(20),
  minRequestInterval: z.coerce.number().int().min(0).max(60),
  enableRequests: z.boolean().default(true),
  requireAccount: z.boolean().default(false),
});

type IcecastSettings = z.infer<typeof icecastSettingsSchema>;
type RequestSettings = z.infer<typeof requestSettingsSchema>;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("icecast");
  
  const [savedIcecastSettings, setSavedIcecastSettings] = useLocalStorage<IcecastSettings>("icecast-settings", {
    hostname: "localhost",
    port: 8000,
    username: "admin",
    password: "hackme",
    mountPoint: "/stream",
    enableStats: true,
  });

  const [savedRequestSettings, setSavedRequestSettings] = useLocalStorage<RequestSettings>("request-settings", {
    maxRequestsPerHour: 3,
    minRequestInterval: 15,
    enableRequests: true,
    requireAccount: false,
  });

  const icecastForm = useForm<IcecastSettings>({
    resolver: zodResolver(icecastSettingsSchema),
    defaultValues: savedIcecastSettings,
  });

  const requestForm = useForm<RequestSettings>({
    resolver: zodResolver(requestSettingsSchema),
    defaultValues: savedRequestSettings,
  });

  const onIcecastSubmit = (data: IcecastSettings) => {
    setSavedIcecastSettings(data);
    toast({
      title: "Icecast Settings Updated",
      description: "Your Icecast server settings have been saved.",
    });
  };

  const onRequestSubmit = (data: RequestSettings) => {
    setSavedRequestSettings(data);
    toast({
      title: "Request Settings Updated",
      description: "Your song request settings have been saved.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your server and request settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="icecast">Icecast Server</TabsTrigger>
          <TabsTrigger value="requests">Song Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="icecast" className="space-y-4">
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
                  
                  <Button type="submit" className="mt-6">Save Icecast Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Song Request Settings</CardTitle>
              <CardDescription>
                Configure how listeners can request songs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...requestForm}>
                <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
                  <FormField
                    control={requestForm.control}
                    name="enableRequests"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Enable Song Requests</FormLabel>
                          <FormDescription>
                            Allow listeners to request songs
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
                    control={requestForm.control}
                    name="maxRequestsPerHour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Requests Per Hour Per Listener</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Slider
                              min={0}
                              max={20}
                              step={1}
                              value={[field.value]}
                              onValueChange={([value]) => field.onChange(value)}
                            />
                            <div className="flex justify-between">
                              <span className="text-sm">Current value: {field.value}</span>
                              <Input
                                type="number"
                                className="w-20 h-8"
                                value={field.value}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                min={0}
                                max={20}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Limit how many requests a single listener can make per hour (0 for unlimited)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={requestForm.control}
                    name="minRequestInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Time Between Requests (minutes)</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Slider
                              min={0}
                              max={60}
                              step={1}
                              value={[field.value]}
                              onValueChange={([value]) => field.onChange(value)}
                            />
                            <div className="flex justify-between">
                              <span className="text-sm">Current value: {field.value} minutes</span>
                              <Input
                                type="number"
                                className="w-20 h-8"
                                value={field.value}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                min={0}
                                max={60}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Minimum time a listener must wait between song requests (0 for no wait)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={requestForm.control}
                    name="requireAccount"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Require Account for Requests</FormLabel>
                          <FormDescription>
                            Only allow registered users to make song requests
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
                  
                  <Button type="submit" className="mt-6">Save Request Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
