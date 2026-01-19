"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  userid: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    const token = localStorage.getItem("ccnet_token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // decode JWT payload (no backend call needed)
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ userid: payload.userid });
    } catch {
      localStorage.removeItem("ccnet_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("ccnet_token");
    setUser(null);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useUser = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useUser must be used inside AuthProvider");
  return ctx;
};
