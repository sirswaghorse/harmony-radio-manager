
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { MoonIcon, Radio, SunIcon, Upload } from "lucide-react";

const AppearancePage = () => {
  const { theme, setTheme, stationLogo, setStationLogo } = useTheme();
  const [logoUrl, setLogoUrl] = useState(stationLogo || "");
  
  const handleSaveLogo = () => {
    setStationLogo(logoUrl);
    toast.success("Station logo updated successfully");
  };
  
  const handleClearLogo = () => {
    setLogoUrl("");
    setStationLogo(null);
    toast.success("Station logo removed");
  };
  
  const handleThemeChange = (value: "light" | "dark") => {
    setTheme(value);
    toast.success(`Theme changed to ${value} mode`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Appearance</h1>
      <p className="text-muted-foreground">
        Customize the appearance of your station manager.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Station Logo</CardTitle>
            <CardDescription>
              Add your station logo to personalize your Harmony station manager.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center p-6 bg-muted rounded-md">
              {stationLogo ? (
                <div className="relative">
                  <img 
                    src={stationLogo} 
                    alt="Station Logo" 
                    className="h-32 w-32 object-contain" 
                  />
                </div>
              ) : (
                <div className="h-32 w-32 flex items-center justify-center border-2 border-dashed border-muted-foreground/50 rounded-md">
                  <div className="flex flex-col items-center">
                    <Radio className="h-10 w-10 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground mt-2">No Logo</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo-url">Logo URL</Label>
                <Input 
                  id="logo-url" 
                  value={logoUrl} 
                  onChange={(e) => setLogoUrl(e.target.value)} 
                  placeholder="https://example.com/logo.png" 
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleClearLogo}
                >
                  Clear Logo
                </Button>
                <Button onClick={handleSaveLogo}>
                  <Upload size={16} className="mr-2" />
                  Set Logo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription>
              Choose between light and dark mode for your station manager.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              defaultValue={theme} 
              onValueChange={(value) => handleThemeChange(value as "light" | "dark")}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem 
                  value="light" 
                  id="light" 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <SunIcon className="h-6 w-6 mb-2" />
                  Light Mode
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="dark" 
                  id="dark" 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <MoonIcon className="h-6 w-6 mb-2" />
                  Dark Mode
                </Label>
              </div>
            </RadioGroup>
            
            <div className="mt-6 space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Preview</h3>
                <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-card border shadow-md' : 'bg-white border shadow-sm'}`}>
                  <p className="font-medium">Harmony Radio Station</p>
                  <p className="text-sm text-muted-foreground">
                    Currently playing: {theme === 'light' ? 'Sunny Day' : 'Midnight Groove'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Current theme: {theme === 'light' ? 'Light mode' : 'Dark mode'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>
            Additional appearance settings for your station manager.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="station-name">Station Name</Label>
              <Input 
                id="station-name" 
                defaultValue="Harmony Radio" 
                placeholder="Enter station name" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex gap-2 items-center">
                <Input 
                  id="accent-color" 
                  type="color"
                  defaultValue="#6C5CE7" 
                  className="w-16 h-10 p-1"
                />
                <span className="text-sm text-muted-foreground">
                  #6C5CE7 (Default)
                </span>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button>
                Save Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearancePage;
