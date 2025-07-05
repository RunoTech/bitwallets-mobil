import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  // login
  loginEmail: string;
  setLoginEmail: (email: string) => void;
  loginPassword: string;
  setLoginPassword: (password: string) => void;
  loginCurrentStep: number;
    setLoginCurrentStep: (step: number) => void;
  // register
  registerEmail: string;
  setRegisterEmail: (email: string) => void;
  registerPassword: string;
  setRegisterPassword: (password: string) => void;
  registerConfirmPassword: string;
  setRegisterConfirmPassword: (confirmPassword: string) => void;
  registerCurrentStep: number;
  setRegisterCurrentStep: (step: number) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginCurrentStep, setLoginCurrentStep] = useState(1);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
    const [registerCurrentStep, setRegisterCurrentStep] = useState(1);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      // This is just a mock implementation
      const mockToken = 'mock-jwt-token';
      await AsyncStorage.setItem('auth_token', mockToken);
      setToken(mockToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      // This is just a mock implementation
      const mockToken = 'mock-jwt-token';
      await AsyncStorage.setItem('auth_token', mockToken);
      setToken(mockToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      setToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  if (isLoading) {
    return null; // or a loading screen
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      token,
      loginEmail,
      setLoginEmail,
      loginPassword,
      setLoginPassword,
      loginCurrentStep,
      setLoginCurrentStep,
      registerEmail,
      setRegisterEmail,
      registerPassword,
      setRegisterPassword,
      registerConfirmPassword,
      setRegisterConfirmPassword,
      registerCurrentStep,
      setRegisterCurrentStep
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
export default AuthProvider; 