
import { useState, useEffect } from "react";
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
import { AlertCircle, CheckCircle2, RefreshCw, Download, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

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

interface UpdateInfo {
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
  lastChecked: string;
  releaseUrl: string;
}

interface InstallationStatus {
  isInstalled: boolean;
  installedVersion: string;
  isInstalling: boolean;
  installProgress: number;
  lastInstallDate: string | null;
  installError: string | null;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("icecast");
  const [checkingForUpdates, setCheckingForUpdates] = useState(false);
  const [installing, setInstalling] = useState(false);
  
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

  const [updateInfo, setUpdateInfo] = useLocalStorage<UpdateInfo>("update-info", {
    currentVersion: "1.0.0",
    latestVersion: "1.0.0",
    updateAvailable: false,
    lastChecked: new Date().toISOString(),
    releaseUrl: "https://github.com/sirswaghorse/harmony-icecast-manager/releases/latest"
  });

  const [installationStatus, setInstallationStatus] = useLocalStorage<InstallationStatus>("icecast-installation", {
    isInstalled: false,
    installedVersion: "",
    isInstalling: false,
    installProgress: 0,
    lastInstallDate: null,
    installError: null
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

  const checkForUpdates = async () => {
    setCheckingForUpdates(true);
    
    try {
      // In a real app, you'd fetch data from GitHub API
      // For demo purposes, we'll simulate the check with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate random updates
      const hasUpdate = Math.random() > 0.5;
      const newVersion = hasUpdate ? "1.1.0" : updateInfo.currentVersion;
      
      setUpdateInfo({
        ...updateInfo,
        latestVersion: newVersion,
        updateAvailable: hasUpdate,
        lastChecked: new Date().toISOString(),
      });
      
      toast({
        title: hasUpdate ? "Update Available" : "No Updates Available",
        description: hasUpdate 
          ? `Version ${newVersion} is available for download.` 
          : "You're running the latest version.",
      });
    } catch (error) {
      toast({
        title: "Error Checking for Updates",
        description: "Failed to check for updates. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setCheckingForUpdates(false);
    }
  };

  const installIcecast = async () => {
    setInstallationStatus(prev => ({
      ...prev,
      isInstalling: true,
      installProgress: 0,
      installError: null
    }));

    // Simulate installation process
    try {
      // Downloading phase
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setInstallationStatus(prev => ({
          ...prev,
          installProgress: i
        }));
      }
      
      // Complete installation
      setInstallationStatus({
        isInstalled: true,
        installedVersion: "2.4.99",
        isInstalling: false,
        installProgress: 100,
        lastInstallDate: new Date().toISOString(),
        installError: null
      });

      toast({
        title: "Installation Complete",
        description: "Icecast 2.4.99 has been successfully installed.",
      });
    } catch (error) {
      setInstallationStatus(prev => ({
        ...prev,
        isInstalling: false,
        installError: "Failed to install Icecast. Please try again."
      }));

      toast({
        title: "Installation Failed",
        description: "There was an error installing Icecast. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format the last checked date in a readable format
  const formattedLastChecked = new Date(updateInfo.lastChecked).toLocaleString();
  const formattedInstallDate = installationStatus.lastInstallDate 
    ? new Date(installationStatus.lastInstallDate).toLocaleString() 
    : "Never";

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
          <TabsTrigger value="install">Install Icecast</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
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

        <TabsContent value="install" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Icecast Server Installation</CardTitle>
              <CardDescription>
                One-click installation of Icecast 2 server from icecast.org
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Installation Status</span>
                    <span className="text-sm">
                      {installationStatus.isInstalled 
                        ? <span className="text-green-500 flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Installed
                          </span> 
                        : "Not Installed"}
                    </span>
                  </div>
                  {installationStatus.isInstalled && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Installed Version</span>
                        <span className="text-sm">{installationStatus.installedVersion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Installation Date</span>
                        <span className="text-sm">{formattedInstallDate}</span>
                      </div>
                    </>
                  )}
                </div>

                {installationStatus.isInstalling && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Installing Icecast...</span>
                      <span className="text-sm">{installationStatus.installProgress}%</span>
                    </div>
                    <Progress value={installationStatus.installProgress} />
                  </div>
                )}

                {installationStatus.installError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Installation Failed</AlertTitle>
                    <AlertDescription>
                      {installationStatus.installError}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col gap-4">
                  <Alert>
                    <Server className="h-4 w-4" />
                    <AlertTitle>Icecast Server</AlertTitle>
                    <AlertDescription>
                      This will download and install the latest version of Icecast 2 from icecast.org.
                      The installation process will configure Icecast with the settings you've defined
                      in the Icecast Server tab.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    onClick={installIcecast} 
                    disabled={installationStatus.isInstalling}
                    className="gap-2 w-full sm:w-auto"
                  >
                    {installationStatus.isInstalling && <Download className="h-4 w-4 animate-pulse" />}
                    {!installationStatus.isInstalling && <Download className="h-4 w-4" />}
                    {installationStatus.isInstalled 
                      ? "Reinstall Icecast Server" 
                      : "Install Icecast Server"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Software Updates</CardTitle>
              <CardDescription>
                Check for updates to Harmony Icecast Manager
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Current Version</span>
                    <span className="text-sm">{updateInfo.currentVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Latest Version</span>
                    <span className="text-sm">{updateInfo.latestVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Last Checked</span>
                    <span className="text-sm">{formattedLastChecked}</span>
                  </div>
                </div>

                {updateInfo.updateAvailable && (
                  <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <AlertTitle>Update Available</AlertTitle>
                    <AlertDescription>
                      Version {updateInfo.latestVersion} is available. Visit the{" "}
                      <a 
                        href={updateInfo.releaseUrl}
                        target="_blank" 
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                      >
                        GitHub repository
                      </a>{" "}
                      to download the latest version.
                    </AlertDescription>
                  </Alert>
                )}

                {!updateInfo.updateAvailable && updateInfo.lastChecked && (
                  <Alert className="bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle>Up to Date</AlertTitle>
                    <AlertDescription>
                      You're running the latest version of Harmony Icecast Manager.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={checkForUpdates}
                    disabled={checkingForUpdates}
                    className="gap-2"
                  >
                    {checkingForUpdates && <RefreshCw className="h-4 w-4 animate-spin" />}
                    {!checkingForUpdates && <RefreshCw className="h-4 w-4" />}
                    Check for Updates
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
