import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api, getAuthToken, setAuthToken, clearAuthToken } from '../api/client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: any) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('meddoc_user') || localStorage.getItem('pharmapulse_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const res = await api.getProfile();
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('meddoc_user', JSON.stringify(res.user));
          }
        } catch {
          // If token expired or backend restarted, keep current stored user or clean
          if (!user) clearAuthToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.login(credentials);
    if (res.token && res.user) {
      setAuthToken(res.token);
      setUser(res.user);
      localStorage.setItem('meddoc_user', JSON.stringify(res.user));
    }
  };

  const register = async (userData: any) => {
    const res = await api.register(userData);
    if (res.token && res.user) {
      setAuthToken(res.token);
      setUser(res.user);
      localStorage.setItem('meddoc_user', JSON.stringify(res.user));
    }
  };

  const demoLogin = async (role: UserRole) => {
    try {
      const res = await api.demoLogin(role);
      if (res.token && res.user) {
        setAuthToken(res.token);
        setUser(res.user);
        localStorage.setItem('meddoc_user', JSON.stringify(res.user));
      }
    } catch {
      // Fallback demo state
      const fallbackUser: User = {
        id: `demo-${role.toLowerCase()}`,
        name: role === 'HEALTH_OFFICER' ? 'Dr. Arjun Venkatesh' : role === 'PHARMACY_MANAGER' ? 'Priya Sundaram' : role === 'SUPPLY_CHAIN_MANAGER' ? 'Rajesh Kumar' : 'System Admin',
        email: `demo.${role.toLowerCase()}@meddoc.health`,
        role,
        organization: 'Meddoc Health Intelligence Network',
      };
      setUser(fallbackUser);
      setAuthToken('demo-token');
      localStorage.setItem('meddoc_user', JSON.stringify(fallbackUser));
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
