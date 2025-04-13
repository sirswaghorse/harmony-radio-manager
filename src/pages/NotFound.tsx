
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Radio } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const NotFound = () => {
  const location = useLocation();
  const { stationLogo } = useTheme();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="flex justify-center">
          {stationLogo ? (
            <img 
              src={stationLogo} 
              alt="Station Logo" 
              className="h-16 w-16 object-contain" 
            />
          ) : (
            <div className="rounded-full bg-muted p-4">
              <Radio className="h-8 w-8 text-harmony-primary" />
            </div>
          )}
        </div>
        
        <h1 className="text-4xl font-bold text-harmony-primary">404</h1>
        <h2 className="text-xl font-semibold mb-2">Station Not Found</h2>
        
        <p className="text-muted-foreground mb-6">
          We couldn't find the page you're looking for. The frequency might be out of range.
        </p>
        
        <Button asChild className="bg-harmony-primary hover:bg-harmony-secondary">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
