'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  hasPersonalAccount: boolean;
  isAccountActive: boolean;
  consentToPersonalData: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: 'realtor' | 'client' | null;
  login: (token: string, username: string, role: 'realtor' | 'client', clientData?: Client) => void;
  logout: () => void;
  username: string | null;
  client: Client | null;
  updateClient: (clientData: Client) => void; // ДОБАВЛЯЕМ ЭТУ ФУНКЦИЮ
  checkAuthError: (error: any) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'realtor' | 'client' | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const savedUsername = sessionStorage.getItem('username');
    const savedRole = sessionStorage.getItem('userRole') as 'realtor' | 'client' | null;
    const savedClient = sessionStorage.getItem('clientData');
    
    if (token && savedUsername && savedRole) {
      setIsAuthenticated(true);
      setUsername(savedUsername);
      setUserRole(savedRole);
      
      if (savedRole === 'client' && savedClient) {
        setClient(JSON.parse(savedClient));
      }
    }
  }, []);

  const login = (token: string, username: string, role: 'realtor' | 'client', clientData?: Client) => {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('userRole', role);
    
    if (role === 'client' && clientData) {
      sessionStorage.setItem('clientData', JSON.stringify(clientData));
      setClient(clientData);
    }
    
    setIsAuthenticated(true);
    setUsername(username);
    setUserRole(role);
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('clientData');
    setIsAuthenticated(false);
    setUsername(null);
    setUserRole(null);
    setClient(null);
  };

  // ДОБАВЛЯЕМ ФУНКЦИЮ ОБНОВЛЕНИЯ КЛИЕНТА
  const updateClient = (clientData: Client) => {
    sessionStorage.setItem('clientData', JSON.stringify(clientData));
    setClient(clientData);
  };

  const checkAuthError = useCallback((error: any) => {
    if (error?.response?.status === 401 || 
        error?.message === 'Unauthorized' || 
        error?.message?.includes('401')) {
      logout();
      window.location.href = '/';
      return true;
    }
    return false;
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      username,
      userRole,
      client,
      updateClient, 
      checkAuthError 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}