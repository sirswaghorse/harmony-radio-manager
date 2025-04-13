
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WidgetsPage from "./pages/WidgetsPage";
import DJsPage from "./pages/DJsPage";
import AutoDJPage from "./pages/AutoDJPage";
import AppearancePage from "./pages/AppearancePage";
import SongsPage from "./pages/SongsPage";
import SettingsPage from "./pages/SettingsPage";
import QuickLinksPage from "./pages/QuickLinksPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AppLayout>
              <Index />
            </AppLayout>
          } />
          <Route path="/widgets" element={
            <AppLayout>
              <WidgetsPage />
            </AppLayout>
          } />
          <Route path="/djs" element={
            <AppLayout>
              <DJsPage />
            </AppLayout>
          } />
          <Route path="/auto-dj" element={
            <AppLayout>
              <AutoDJPage />
            </AppLayout>
          } />
          <Route path="/appearance" element={
            <AppLayout>
              <AppearancePage />
            </AppLayout>
          } />
          <Route path="/songs" element={
            <AppLayout>
              <SongsPage />
            </AppLayout>
          } />
          <Route path="/settings" element={
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          } />
          <Route path="/quick-links" element={
            <AppLayout>
              <QuickLinksPage />
            </AppLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
