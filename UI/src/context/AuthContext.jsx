import { createContext, useContext, useState, useEffect } from 'react';
import apiCall from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await apiCall('/users/me');
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('Failed to load user data');
      // Clear invalid token
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      // Store only the token
      localStorage.setItem('token', response.token);
      
      // Fetch and set user data
      setUser(response.user);
      
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const refreshUser = async () => {
    await fetchUserData();
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    userType: user?.userType,
    userId: user?.id,
    userName: user?.name,
    userEmail: user?.email,
    profileImage: user?.profileImage,
    universityId: user?.universityId,
    departmentId: user?.departmentId
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
