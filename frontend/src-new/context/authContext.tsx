// context/authContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { restoreSession, getMe } from "@/features/client/auth/auth.api";
import {
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/api-setup/client";

import type { User } from "@/features/client/auth/auth.type";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasAttemptedRestore = useRef(false);

  useEffect(() => {
    if (hasAttemptedRestore.current) return;
    hasAttemptedRestore.current = true;

    const attemptRestore = async () => {
      if (!getRefreshToken()) {
        setIsLoading(false);
        return;
      }

      try {
        const session = await restoreSession();
        setAccessToken(session.data.accessToken);
        setRefreshToken(session.data.refreshToken);

        const me = await getMe();
        setUser(me.data);
      } catch {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    attemptRestore();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};