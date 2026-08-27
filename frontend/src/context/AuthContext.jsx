import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Optional: fetch current user profile here
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      setToken(res.token);
      setUser(res.user);
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      toast.error('Login failed');
      return false;
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      const res = await api.register({ name, email, phone, password });
      setToken(res.token);
      setUser(res.user);
      toast.success('Registered successfully');
      return true;
    } catch (error) {
      toast.error('Registration failed');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{
      user, token, isAuthenticated: !!token, login, register, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
