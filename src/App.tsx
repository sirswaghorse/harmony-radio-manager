
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import WidgetsPage from "./pages/WidgetsPage";
import DJsPage from "./pages/DJsPage";
import AutoDJPage from "./pages/AutoDJPage";
import AppearancePage from "./pages/AppearancePage";
import SongsPage from "./pages/SongsPage";
import SettingsPage from "./pages/SettingsPage";
import QuickLinksPage from "./pages/QuickLinksPage";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main app component with routes
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout>
            <Index />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/widgets" element={
        <ProtectedRoute>
          <AppLayout>
            <WidgetsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/djs" element={
        <ProtectedRoute>
          <AppLayout>
            <DJsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/auto-dj" element={
        <ProtectedRoute>
          <AppLayout>
            <AutoDJPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/appearance" element={
        <ProtectedRoute>
          <AppLayout>
            <AppearancePage />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/songs" element={
        <ProtectedRoute>
          <AppLayout>
            <SongsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <AppLayout>
            <SettingsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/quick-links" element={
        <ProtectedRoute>
          <AppLayout>
            <QuickLinksPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
