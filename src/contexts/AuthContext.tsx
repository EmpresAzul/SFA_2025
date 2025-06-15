
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  registrationDate: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Mock user data
  const mockUser: User = {
    id: '1',
    email: 'leandro@fluxoazul.com',
    name: 'Leandro Silva',
    registrationDate: '2024-01-15',
    address: 'Rua das Flores, 123',
    number: '123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP'
  };

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('fluxoazul_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    if (email === 'leandro@fluxoazul.com' && password === 'jayafcg3') {
      setUser(mockUser);
      localStorage.setItem('fluxoazul_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fluxoazul_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('fluxoazul_user', JSON.stringify(updatedUser));
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // Mock password update
    if (currentPassword === 'jayafcg3') {
      console.log('Password updated successfully');
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
