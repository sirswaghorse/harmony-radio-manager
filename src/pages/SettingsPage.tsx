
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { IcecastTab } from "@/components/settings/IcecastTab";
import { RequestsTab } from "@/components/settings/RequestsTab";
import { InstallationTab } from "@/components/settings/InstallationTab";
import { UpdatesTab } from "@/components/settings/UpdatesTab";
import { SecurityTab } from "@/components/settings/SecurityTab";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("icecast");
  const { logout } = useAuth();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your server and request settings</p>
        </div>
        <Button variant="outline" onClick={logout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="icecast">Icecast Server</TabsTrigger>
          <TabsTrigger value="requests">Song Requests</TabsTrigger>
          <TabsTrigger value="install">Install Icecast</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="icecast" className="space-y-4">
          <IcecastTab />
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <RequestsTab />
        </TabsContent>

        <TabsContent value="install" className="space-y-4">
          <InstallationTab />
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <UpdatesTab />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
