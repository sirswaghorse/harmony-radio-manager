
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RadioProvider } from "@/contexts/RadioContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { useState } from "react";
import { Github } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
    // Note: Mobile sidebar opening is now handled in the AppHeader component
  };

  return (
    <ThemeProvider>
      <RadioProvider>
        <SidebarProvider defaultOpen={sidebarOpen} open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <div className="min-h-screen flex flex-col">
            <AppHeader onMenuToggle={handleMenuToggle} />
            <div className="flex-1 flex overflow-hidden">
              <AppSidebar />
              <main className="flex-1 overflow-auto p-6">
                <div className="animate-fade-in">
                  {children}
                </div>
              </main>
            </div>
            <footer className="p-4 text-center text-sm text-muted-foreground bg-background border-t">
              <a 
                href="https://github.com/sirswaghorse" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center hover:text-foreground transition-colors"
              >
                <Github className="mr-2 h-4 w-4" />
                Developed by Jonah the Goodra
              </a>
            </footer>
          </div>
        </SidebarProvider>
      </RadioProvider>
    </ThemeProvider>
  );
}
