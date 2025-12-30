"use client";
import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";

interface User {
  _id: string;
  userid: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshAuth: () => Promise<void>; // <--- Add this!
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshAuth: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Define the check function so we can reuse it
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true); // Optional: Set loading true while refreshing? Usually better not to flash loading screen
      const res = await fetch("http://localhost:5000/api/auth/verify", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.loggedIn && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshAuth: checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUser() {
  return useContext(AuthContext);
}
