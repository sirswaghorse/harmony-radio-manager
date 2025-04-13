
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RadioProvider } from "@/contexts/RadioContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { useState } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ThemeProvider>
      <RadioProvider>
        <div className="min-h-screen flex flex-col">
          <AppHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <div className="flex flex-1 overflow-hidden">
            <SidebarProvider defaultOpen={sidebarOpen} open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <div className="flex w-full">
                <AppSidebar />
                <main className="flex-1 overflow-auto p-6">
                  <div className="animate-fade-in">
                    {children}
                  </div>
                </main>
              </div>
            </SidebarProvider>
          </div>
        </div>
      </RadioProvider>
    </ThemeProvider>
  );
}
