'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
  username: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const savedUsername = sessionStorage.getItem('username');
    
    if (token && savedUsername) {
      setIsAuthenticated(true);
      setUsername(savedUsername);
    }
  }, []);

  const login = (token: string, username: string) => {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('username', username);
    setIsAuthenticated(true);
    setUsername(username);
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, username }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  
  const checkAuthError = useCallback((error: any) => {
    if (error?.response?.status === 401 || 
        error?.message === 'Unauthorized' || 
        error?.message?.includes('401')) {
      context.logout();
      window.location.href = '/login';
      return true;
    }
    return false;
  }, [context]);

  return { 
    ...context, 
    checkAuthError 
  };
}