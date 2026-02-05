import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { syncService } from '../services/syncService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const initUser = () => {
      const savedUser = localStorage.getItem('user');
      if (mounted && savedUser) {
        setUser(JSON.parse(savedUser));
      }
      if (mounted) setLoading(false);
    };
    initUser();
    return () => { mounted = false; };
  }, []);

  const login = async (email, password) => {
    const userData = await apiService.login(email, password);
    setUser(userData);
    // Trigger sync after login
    await syncService.pullFromCloud();
  };

  const register = async (email, password) => {
    const userData = await apiService.register(email, password);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const sync = async () => {
    if (user) {
      await syncService.syncToCloud();
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout, sync }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
