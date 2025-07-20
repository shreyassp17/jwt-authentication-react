import React, { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType, AuthProviderProps, User } from "../types/auth";
import { tokenManager } from "../utils/tokenManager";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Context not found");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const isAuthenticated = !!user;

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json(); // Parse JSON body
      if (!data.accessToken || !data.refreshToken)
        throw new Error("Something went wrong! Please refresh and try again");
      tokenManager.setTokens(data.accessToken, data.refreshToken);
      setUser({ username, password });
      setError("");
    } catch (error) {
      console.log(error);
      setError(error as string);
      setUser(null);
      tokenManager.clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is already authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          // Try to refresh the access token first
          const newAccessToken = await tokenManager.refreshAccessToken();
          // Then get user profile
          const userResponse = await fetch(
            "http://localhost:8000/profile-details",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ accessToken: newAccessToken }),
            }
          );
          const userData = await userResponse.json();
          setUser(userData);
          setError("");
        } catch (error) {
          console.log(error);
          tokenManager.clearTokens();
          setError(error as string);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        // No refresh token found, so set loading to false
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
