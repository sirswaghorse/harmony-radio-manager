
import React from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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

type IcecastSettings = z.infer<typeof icecastSettingsSchema>;

export function IcecastTab() {
  const [savedIcecastSettings, setSavedIcecastSettings] = useLocalStorage<IcecastSettings>("icecast-settings", {
    hostname: "localhost",
    port: 8000,
    username: "admin",
    password: "hackme",
    mountPoint: "/stream",
    enableStats: true,
  });

  const icecastForm = useForm<IcecastSettings>({
    resolver: zodResolver(icecastSettingsSchema),
    defaultValues: savedIcecastSettings,
  });

  const onIcecastSubmit = (data: IcecastSettings) => {
    setSavedIcecastSettings(data);
    toast({
      title: "Icecast Settings Updated",
      description: "Your Icecast server settings have been saved.",
    });
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
            
            <Button type="submit" className="mt-6">Save Icecast Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
