
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";  // Change import to lucide-react
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface UpdateInfo {
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
  lastChecked: string;
  releaseUrl: string;
}

export function UpdatesTab() {
  const [checkingForUpdates, setCheckingForUpdates] = useState(false);
  
  const [updateInfo, setUpdateInfo] = useLocalStorage<UpdateInfo>("update-info", {
    currentVersion: "1.0.0",
    latestVersion: "1.0.0",
    updateAvailable: false,
    lastChecked: new Date().toISOString(),
    releaseUrl: "https://github.com/sirswaghorse/harmony-icecast-manager/releases/latest"
  });

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

  const formattedLastChecked = new Date(updateInfo.lastChecked).toLocaleString();

  return (
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
  );
}
