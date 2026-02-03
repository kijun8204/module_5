'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest } from '@/types/auth';
import * as authApi from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 초기 로드 시 localStorage에서 토큰 확인 및 사용자 정보 조회
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const userData = await authApi.getCurrentUser(savedToken);
          setToken(savedToken);
          setUser(userData);
        } catch (error) {
          // 토큰이 유효하지 않은 경우 제거
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest): Promise<void> => {
    const response = await authApi.login(data);
    const accessToken = response.access_token;

    // 토큰 저장
    localStorage.setItem('token', accessToken);
    setToken(accessToken);

    // 사용자 정보 조회
    const userData = await authApi.getCurrentUser(accessToken);
    setUser(userData);
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    await authApi.register(data);
  };

  const logout = () => {
    authApi.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
