
import React, { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Globe, Loader, Shield } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { IcecastSettings, icecastSettingsSchema, defaultIcecastSettings } from "./icecast/icecast-schema";
import { useIcecastVerification } from "./icecast/use-icecast-verification";
import { BasicSettingsForm } from "./icecast/BasicSettingsForm";
import { AdvancedSettingsForm } from "./icecast/AdvancedSettingsForm";
import { VerificationResultDisplay } from "./icecast/VerificationResult";

export function IcecastTab() {
  const [savedIcecastSettings, setSavedIcecastSettings] = useLocalStorage<IcecastSettings>(
    "icecast-settings",
    defaultIcecastSettings
  );

  const { verifying, verificationResult, verifyConnection } = useIcecastVerification();
  const [connectionTab, setConnectionTab] = useState("basic");

  const icecastForm = useForm<IcecastSettings>({
    resolver: zodResolver(icecastSettingsSchema),
    defaultValues: savedIcecastSettings,
  });

  const onIcecastSubmit = (data: IcecastSettings) => {
    setSavedIcecastSettings(data);
    toast.success("Icecast Settings Updated", {
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
            <Tabs value={connectionTab} onValueChange={setConnectionTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">
                  <Globe className="mr-2 h-4 w-4" />
                  Basic Settings
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <Shield className="mr-2 h-4 w-4" />
                  Advanced Options
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <BasicSettingsForm form={icecastForm} />
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4">
                <AdvancedSettingsForm form={icecastForm} />
              </TabsContent>
            </Tabs>
            
            <div className="flex flex-col space-y-4 mt-6">
              <div className="flex flex-row gap-4">
                <Button type="submit">Save Icecast Settings</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => verifyConnection(icecastForm.getValues())}
                  disabled={verifying}
                >
                  {verifying ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Connection
                    </>
                  )}
                </Button>
              </div>

              <VerificationResultDisplay result={verificationResult} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
