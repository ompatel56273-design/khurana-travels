'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin as loginAdminAPI, getAdminProfile, loginUser as loginUserAPI, getUserProfile } from '@/lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
    checkUserAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        return;
      }
      const profile = await getAdminProfile();
      setAdmin(profile);
    } catch (err) {
      localStorage.removeItem('adminToken');
      setAdmin(null);
    } finally {
      // Don't set loading to false here as checkUserAuth might still be running
    }
  };

  const checkUserAuth = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        return;
      }
      const profile = await getUserProfile();
      setUser(profile);
    } catch (err) {
      localStorage.removeItem('userToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);
      const data = await loginAdminAPI({ username, password });
      localStorage.setItem('adminToken', data.token);
      setAdmin({ _id: data._id, username: data.username, role: data.role });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  const userLoginAction = async (email, password) => {
    try {
      setError(null);
      const data = await loginUserAPI({ email, password });
      localStorage.setItem('userToken', data.token);
      setUser({ _id: data._id, firstName: data.firstName, lastName: data.lastName, email: data.email });
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const userLogout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      admin, user, loading, error, 
      login, logout, checkAuth, 
      userLogin: userLoginAction, userLogout, checkUserAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
