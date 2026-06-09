import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authStorage } from '../storage/authStorage';

interface AuthContextType {
  userEmail: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load storage state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await authStorage.getToken();
        const email = await authStorage.getUserEmail();
        
        if (token && email) {
          setUserEmail(email);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to initialize auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (password) {
        const isValid = await authStorage.verifyCredentials(normalizedEmail, password);
        if (!isValid) {
          throw new Error('Invalid email or password. Please sign up if you do not have an account.');
        }
      }
      
      const mockToken = `token_${Date.now()}`;
      await authStorage.saveToken(mockToken);
      await authStorage.saveUserEmail(normalizedEmail);
      
      setUserEmail(normalizedEmail);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.log('Failed to login:', error.message || error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const success = await authStorage.registerUser(normalizedEmail, password);
      
      if (!success) {
        throw new Error('This email is already registered. Please sign in instead.');
      }
      
      // Auto-login after successful registration
      const mockToken = `token_${Date.now()}`;
      await authStorage.saveToken(mockToken);
      await authStorage.saveUserEmail(normalizedEmail);
      
      setUserEmail(normalizedEmail);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.log('Failed to register:', error.message || error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authStorage.clearAuth();
      setUserEmail(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userEmail, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
