
import React from "react";
import { AlertCircle, Server } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InstallationStatus {
  isInstalled: boolean;
  installedVersion: string;
  lastInstallDate: string | null;
}

export function InstallationTab() {
  const [installationStatus] = useLocalStorage<InstallationStatus>("icecast-installation", {
    isInstalled: false,
    installedVersion: "",
    lastInstallDate: null
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Icecast Server Installation</CardTitle>
        <CardDescription>
          Follow these instructions to install Icecast on your server
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Server className="h-4 w-4" />
          <AlertTitle>Server Access Required</AlertTitle>
          <AlertDescription>
            You'll need SSH access to your server to install Icecast. Make sure you have administrative (sudo) privileges.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="ubuntu" className="w-full">
          <TabsList>
            <TabsTrigger value="ubuntu">Ubuntu/Debian</TabsTrigger>
            <TabsTrigger value="centos">CentOS/RHEL</TabsTrigger>
            <TabsTrigger value="source">From Source</TabsTrigger>
          </TabsList>

          <TabsContent value="ubuntu" className="space-y-4">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Ubuntu/Debian Installation Steps:</h3>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Update your package list:
                    <pre className="mt-2 p-2 bg-muted rounded-md">
                      sudo apt-get update
                    </pre>
                  </li>
                  <li>Install Icecast2:
                    <pre className="mt-2 p-2 bg-muted rounded-md">
                      sudo apt-get install icecast2
                    </pre>
                  </li>
                  <li>During installation, you'll be prompted to configure Icecast. Enter your desired:
                    <ul className="list-disc list-inside ml-4 mt-2">
                      <li>Admin password</li>
                      <li>Hostname</li>
                      <li>Source password</li>
                      <li>Relay password</li>
                    </ul>
                  </li>
                  <li>Start Icecast service:
                    <pre className="mt-2 p-2 bg-muted rounded-md">
                      sudo systemctl start icecast2
                    </pre>
                  </li>
                  <li>Enable Icecast to start on boot:
                    <pre className="mt-2 p-2 bg-muted rounded-md">
                      sudo systemctl enable icecast2
                    </pre>
                  </li>
                </ol>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="centos" className="space-y-4">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                <h3 className="font-semibold">CentOS/RHEL Installation Steps:</h3>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Install EPEL repository:
                    <pre className="mt-2 p-2 bg-muted rounded-md">
                      sudo yum install epel-release
                    </pre>
                  </li>
                  <li>Install Icecast:
                    <pre className="mt-2 p-2 bg-muted rounded-md">
                      sudo yum install icecast
                    </pre>
                  </li>
                  <li>Copy the default config:
                    <pre className="mt-2 p-2 bg-muted rounded-md">
                      sudo cp /etc/icecast.xml.example /etc/icecast.xml
                    </pre>
                  </li>
                  <li>Edit the configuration:
                    <pre className="mt-2 p-2 bg-muted rounded-md">
                      sudo nano /etc/icecast.xml
                    </pre>
                  </li>
                  <li>Start Icecast service:
                    <pre className="mt-2 p-2 bg-muted rounded-md">
                      sudo systemctl start icecast
                    </pre>
                  </li>
                  <li>Enable Icecast to start on boot:
                    <pre className="mt-2 p-2 bg-muted rounded-md">
                      sudo systemctl enable icecast
                    </pre>
                  </li>
                </ol>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="source" className="space-y-4">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Installing from Source:</h3>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Install required dependencies:
                    <pre className="mt-2 p-2 bg-muted rounded-md">
                      sudo apt-get install build-essential libxml2-dev libxslt1-dev libvorbis-dev
                    </pre>
                  </li>
                  <li>Download latest source:
                    <pre className="mt-2 p-2 bg-muted rounded-md">
                      wget https://downloads.xiph.org/releases/icecast/icecast-2.4.4.tar.gz
                    </pre>
                  </li>
                  <li>Extract the archive:
                    <pre className="mt-2 p-2 bg-muted rounded-md">
                      tar -xzf icecast-2.4.4.tar.gz
                      cd icecast-2.4.4
                    </pre>
                  </li>
                  <li>Configure and compile:
                    <pre className="mt-2 p-2 bg-muted rounded-md">
                      ./configure
                      make
                      sudo make install
                    </pre>
                  </li>
                </ol>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Post-Installation</AlertTitle>
          <AlertDescription>
            After installation, configure your firewall to allow incoming connections on port 8000 (default Icecast port).
            Then update your Icecast settings in the "Icecast Server" tab with your server details.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
