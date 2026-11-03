import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';
import { User, UserRole, AuthState } from '../types';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  zone: string;
}

interface AuthContextType extends AuthState {
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_DEMO_USERS: Record<string, { pass: string; user: User }> = {
  'citizen@aqualogix.com': {
    pass: 'citizen123',
    user: {
      id: 'USR-CUST-01',
      name: 'Priya Nair',
      email: 'citizen@aqualogix.com',
      role: 'Consumer / Citizen',
      zone: 'South-East Zone'
    }
  },
  'admin@aqualogix.com': {
    pass: 'admin123',
    user: {
      id: 'USR-001',
      name: 'Vikrant Roy',
      email: 'admin@aqualogix.com',
      role: 'Operations Dispatcher',
      zone: 'Central Urban Core'
    }
  },
  'fleet@aqualogix.com': {
    pass: 'fleet123',
    user: {
      id: 'USR-002',
      name: 'Ananya Sharma',
      email: 'fleet@aqualogix.com',
      role: 'Fleet Supervisor',
      zone: 'South-West Zone A'
    }
  },
  'scada@aqualogix.com': {
    pass: 'scada123',
    user: {
      id: 'USR-003',
      name: 'Dr. Rajesh Iyer',
      email: 'scada@aqualogix.com',
      role: 'Water Quality Inspector',
      zone: 'All Metropolitan Zones'
    }
  }
};

const getRegisteredUsers = (): Record<string, { pass: string; user: User }> => {
  try {
    const raw = localStorage.getItem('aqualogix_registered_users');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveRegisteredUser = (email: string, pass: string, user: User) => {
  try {
    const current = getRegisteredUsers();
    current[email.toLowerCase()] = { pass, user };
    localStorage.setItem('aqualogix_registered_users', JSON.stringify(current));
  } catch {}
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('aqualogix_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('aqualogix_auth_token');
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('aqualogix_auth_token');
      if (storedToken) {
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('aqualogix_auth_user', JSON.stringify(res.data.user));
          }
        } catch {}
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const normalizedEmail = email.toLowerCase().trim();

    try {
      const res = await apiClient.post('/auth/login', { email: normalizedEmail, password });
      if (res.data?.token && res.data?.user) {
        const receivedToken = res.data.token;
        const receivedUser = res.data.user;

        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('aqualogix_auth_token', receivedToken);
        localStorage.setItem('aqualogix_auth_user', JSON.stringify(receivedUser));
        return { success: true };
      }
    } catch (err: any) {
      console.warn('Backend login attempt failed, trying local fallback:', err.message);
    }

    const registeredUsers = getRegisteredUsers();
    if (registeredUsers[normalizedEmail] && registeredUsers[normalizedEmail].pass === password) {
      const matched = registeredUsers[normalizedEmail];
      const mockToken = `token_${matched.user.id}_${Date.now()}`;
      setToken(mockToken);
      setUser(matched.user);
      localStorage.setItem('aqualogix_auth_token', mockToken);
      localStorage.setItem('aqualogix_auth_user', JSON.stringify(matched.user));
      return { success: true };
    }

    const matched = DEFAULT_DEMO_USERS[normalizedEmail];
    if (matched && matched.pass === password) {
      const mockToken = `demo_jwt_token_${matched.user.id}_${Date.now()}`;
      setToken(mockToken);
      setUser(matched.user);
      localStorage.setItem('aqualogix_auth_token', mockToken);
      localStorage.setItem('aqualogix_auth_user', JSON.stringify(matched.user));
      return { success: true };
    }

    return { success: false, message: 'Invalid email or password. Please try again.' };
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message?: string }> => {
    const normalizedEmail = userData.email.toLowerCase().trim();

    try {
      const res = await apiClient.post('/auth/register', userData);
      if (res.data?.token && res.data?.user) {
        const receivedToken = res.data.token;
        const receivedUser = res.data.user;

        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('aqualogix_auth_token', receivedToken);
        localStorage.setItem('aqualogix_auth_user', JSON.stringify(receivedUser));
        saveRegisteredUser(normalizedEmail, userData.password, receivedUser);
        return { success: true };
      }
    } catch (err: any) {
      console.warn('Backend registration failed, using local persistence:', err.message);
    }

    const existing = getRegisteredUsers();
    if (existing[normalizedEmail] || DEFAULT_DEMO_USERS[normalizedEmail]) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: userData.name,
      email: normalizedEmail,
      role: userData.role,
      zone: userData.zone
    };

    saveRegisteredUser(normalizedEmail, userData.password, newUser);

    const fallbackToken = `token_${newUser.id}_${Date.now()}`;
    setToken(fallbackToken);
    setUser(newUser);
    localStorage.setItem('aqualogix_auth_token', fallbackToken);
    localStorage.setItem('aqualogix_auth_user', JSON.stringify(newUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aqualogix_auth_token');
    localStorage.removeItem('aqualogix_auth_user');
  };

  const isAdmin = user ? user.role !== 'Consumer / Citizen' : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin,
        login,
        register,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
