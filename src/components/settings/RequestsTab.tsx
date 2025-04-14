
import React from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";

const requestSettingsSchema = z.object({
  maxRequestsPerHour: z.coerce.number().int().min(0).max(20),
  minRequestInterval: z.coerce.number().int().min(0).max(60),
  enableRequests: z.boolean().default(true),
  requireAccount: z.boolean().default(false),
});

type RequestSettings = z.infer<typeof requestSettingsSchema>;

export function RequestsTab() {
  const [savedRequestSettings, setSavedRequestSettings] = useLocalStorage<RequestSettings>("request-settings", {
    maxRequestsPerHour: 3,
    minRequestInterval: 15,
    enableRequests: true,
    requireAccount: false,
  });

  const requestForm = useForm<RequestSettings>({
    resolver: zodResolver(requestSettingsSchema),
    defaultValues: savedRequestSettings,
  });

  const onRequestSubmit = (data: RequestSettings) => {
    setSavedRequestSettings(data);
    toast({
      title: "Request Settings Updated",
      description: "Your song request settings have been saved.",
    });
  };

  return (
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
  );
}
