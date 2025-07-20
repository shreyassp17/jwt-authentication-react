import type { ReactNode } from "react";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  error: string;
  // logout: () => void;
  // refreshToken: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface User {
  username: string;
  password: string;
}
