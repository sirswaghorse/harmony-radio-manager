
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useNavigate, useLocation } from "react-router-dom";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  hasPassword: boolean;
  setNewPassword: (password: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [storedPassword, setStoredPassword] = useLocalStorage<string | null>("admin-password", null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication on initial load
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("auth-status");
      if (authStatus === "authenticated") {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  // Handle password check
  const login = (password: string): boolean => {
    if (!storedPassword) {
      // If no password is set, set it
      setStoredPassword(password);
      localStorage.setItem("auth-status", "authenticated");
      setIsAuthenticated(true);
      return true;
    }

    // Check if password matches
    if (password === storedPassword) {
      localStorage.setItem("auth-status", "authenticated");
      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("auth-status");
    setIsAuthenticated(false);
    navigate("/login");
  };

  // Set new password
  const setNewPassword = (password: string) => {
    setStoredPassword(password);
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    hasPassword: !!storedPassword,
    setNewPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
