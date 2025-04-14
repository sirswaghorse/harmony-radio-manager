
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";  // Change import to lucide-react
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function SecurityTab() {
  const { setNewPassword: updateAdminPassword } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChangePassword = () => {
    setPasswordError("");
    
    if (!newPassword) {
      setPasswordError("Please enter a new password");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    updateAdminPassword(newPassword);
    setIsChangePasswordOpen(false);
    setNewPassword("");
    setConfirmPassword("");
    
    toast({
      title: "Password Updated",
      description: "Your admin password has been updated successfully.",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage application security and admin access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertTitle>Admin Password</AlertTitle>
                <AlertDescription>
                  Your admin password is required every time you access Harmony Icecast Manager. 
                  Keep it secure and don't share it with unauthorized users.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={() => setIsChangePasswordOpen(true)} 
                className="gap-2 w-full sm:w-auto"
              >
                <Lock className="h-4 w-4" />
                Change Admin Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Admin Password</DialogTitle>
            <DialogDescription>
              Enter a new password for accessing Harmony Icecast Manager.
            </DialogDescription>
          </DialogHeader>
          
          {passwordError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="new-password" className="col-span-4">
                New Password
              </FormLabel>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="col-span-4"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="confirm-password" className="col-span-4">
                Confirm Password
              </FormLabel>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="col-span-4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleChangePassword}>
              Save Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
