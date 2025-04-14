
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Layout,
  Users,
  PlaySquare,
  Palette,
  Music,
  Radio,
  Settings,
  Link as LinkIcon,
  Headphones,
  Rss,
  Broadcast,
} from "lucide-react";

export function AppSidebar() {
  const { theme, setTheme, stationLogo } = useTheme();
  const location = useLocation();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-3 py-2 flex flex-col items-center">
          {stationLogo ? (
            <img
              src={stationLogo}
              alt="Station Logo"
              className="h-12 w-12 object-contain"
            />
          ) : (
            <div className="flex items-center justify-center">
              <Radio className="h-8 w-8 text-harmony-primary" />
              <span className="font-bold text-lg ml-2">Harmony</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Station Manager</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Home />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/widgets">
                    <Layout />
                    <span>Widgets</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/djs">
                    <Users />
                    <span>DJs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/djs?tab=broadcast">
                    <Broadcast />
                    <span>Broadcast</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/auto-dj">
                    <PlaySquare />
                    <span>Auto DJ</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/songs">
                    <Music />
                    <span>Songs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/appearance">
                    <Palette />
                    <span>Appearance</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer" onClick={(e) => {
                    e.preventDefault();
                    // URL will come from settings in a real implementation
                    window.open('https://station.example.com/listen', '_blank');
                  }}>
                    <Headphones />
                    <span>Listen Live</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer" onClick={(e) => {
                    e.preventDefault();
                    // URL will come from settings in a real implementation
                    window.open('https://station.example.com/listen.m3u', '_blank');
                  }}>
                    <LinkIcon />
                    <span>Stream URL</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer" onClick={(e) => {
                    e.preventDefault();
                    // URL will come from settings in a real implementation
                    window.open('https://station.example.com/podcast', '_blank');
                  }}>
                    <Rss />
                    <span>Podcast Feed</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-center p-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition duration-200"
          >
            {theme === "light" ? <MoonIcon size={18} /> : <SunIcon size={18} />}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
