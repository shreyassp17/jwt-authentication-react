import React,{createContext, useEffect, useState } from "react";
import { AuthContextType, AuthProviderProps, User } from "../types/auth";
import { tokenManager } from "../utils/tokenManager";

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {

    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    
    const isAuthenticated = !!user

    const value: AuthContextType = {
        isAuthenticated
    }

    // Check if user is already authenticated on app load
    useEffect(()=> {

        
        const initializeAuth = async() => {
            
            const refreshToken = tokenManager.getRefreshToken()
            if(refreshToken) {
               try {
                // Try to refresh the access token first
                const newAccessToken = await tokenManager.refreshAccessToken();
          
                // Then get user profile
                // const userData = await mockApi.getProfile(newAccessToken);
                setUser(userData);
            } catch (error) {
                console.error('Failed to restore authentication:', error);
                tokenManager.clearTokens();
            }
            }
        }


    }, [])


    return <AuthContext value={value}>
        {children}
    </AuthContext>
}