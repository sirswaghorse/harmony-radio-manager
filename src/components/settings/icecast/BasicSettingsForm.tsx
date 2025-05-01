
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { IcecastSettings } from "./icecast-schema";

interface BasicSettingsFormProps {
  form: UseFormReturn<IcecastSettings>;
}

export function BasicSettingsForm({ form }: BasicSettingsFormProps) {
  const useDirectUrl = form.watch("useDirectUrl");

  return (
    <div>
      <FormField
        control={form.control}
        name="useDirectUrl"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
            <div className="space-y-0.5">
              <FormLabel>Use Direct URL</FormLabel>
              <FormDescription>
                Use a single URL to connect to your Icecast server (useful for proxied or same-server installations)
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

      {useDirectUrl ? (
        <FormField
          control={form.control}
          name="directUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direct Icecast URL</FormLabel>
              <FormControl>
                <Input placeholder="https://harmonyicecast.site/icecast/" {...field} />
              </FormControl>
              <FormDescription>
                The complete URL to your Icecast server (e.g., https://harmonyicecast.site/icecast/)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
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
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
    </div>
  );
}
