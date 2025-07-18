import { ReactNode } from "react";

export interface AuthContextType {
    isAuthenticated: boolean
}

export interface AuthProviderProps {
    children: ReactNode;
}

export interface User {
    username: string
    password: string
}