
import React from "react";
import { AlertCircle } from "lucide-react";  // Change import to lucide-react
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Download, Server } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface InstallationStatus {
  isInstalled: boolean;
  installedVersion: string;
  isInstalling: boolean;
  installProgress: number;
  lastInstallDate: string | null;
  installError: string | null;
}

export function InstallationTab() {
  const [installationStatus, setInstallationStatus] = useLocalStorage<InstallationStatus>("icecast-installation", {
    isInstalled: false,
    installedVersion: "",
    isInstalling: false,
    installProgress: 0,
    lastInstallDate: null,
    installError: null
  });

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

  const formattedInstallDate = installationStatus.lastInstallDate 
    ? new Date(installationStatus.lastInstallDate).toLocaleString() 
    : "Never";

  return (
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
  );
}
