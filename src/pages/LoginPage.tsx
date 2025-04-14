
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const { login, hasPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError("Please enter a password");
      return;
    }
    
    const success = login(password);
    
    if (success) {
      toast({
        title: hasPassword ? "Login Successful" : "Password Set",
        description: hasPassword 
          ? "Welcome back to Harmony Icecast Manager." 
          : "Your admin password has been set successfully.",
      });
      navigate("/");
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Harmony Icecast Manager</h1>
          <p className="text-muted-foreground mt-2">
            {hasPassword ? "Enter your password to continue" : "Set up your admin password"}
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {hasPassword ? "Admin Login" : "Create Admin Password"}
            </CardTitle>
            <CardDescription>
              {hasPassword 
                ? "Please enter your password to access the application." 
                : "This password will be required for future logins."}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                {hasPassword ? "Login" : "Set Password & Continue"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
