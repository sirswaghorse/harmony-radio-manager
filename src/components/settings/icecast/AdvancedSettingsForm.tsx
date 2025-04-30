
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IcecastSettings } from "./icecast-schema";
import { Webhook } from "lucide-react";

interface AdvancedSettingsFormProps {
  form: UseFormReturn<IcecastSettings>;
}

export function AdvancedSettingsForm({ form }: AdvancedSettingsFormProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <FormField
          control={form.control}
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
      
      {form.watch("connectionType") === "cors-proxy" && (
        <Alert>
          <Webhook className="h-4 w-4" />
          <AlertDescription>
            CORS Proxy mode requires a server-side proxy to be configured. If you're hosting this app yourself, 
            you'll need to set up a proxy endpoint at /api/icecast-proxy. This helps bypass CORS restrictions
            that may prevent direct browser connections to your Icecast server.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
