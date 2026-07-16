import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, check if a user session is stored in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('exclusive_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signup = (name, email, password) => {
    // Get existing accounts
    const accounts = JSON.parse(localStorage.getItem('exclusive_accounts') || '[]');
    // Check if email already exists
    if (accounts.find(a => a.email === email)) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser = { id: Date.now(), name, email, password, avatar: null };
    accounts.push(newUser);
    localStorage.setItem('exclusive_accounts', JSON.stringify(accounts));
    // Auto-login after signup
    const sessionUser = { id: newUser.id, name, email, avatar: null };
    localStorage.setItem('exclusive_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true };
  };

  const login = (email, password) => {
    const accounts = JSON.parse(localStorage.getItem('exclusive_accounts') || '[]');
    const found = accounts.find(a => a.email === email && a.password === password);
    if (!found) {
      return { success: false, message: 'Invalid email or password.' };
    }
    const sessionUser = { id: found.id, name: found.name, email: found.email, avatar: found.avatar };
    localStorage.setItem('exclusive_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('exclusive_user');
    setUser(null);
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    // Also update in accounts list
    const accounts = JSON.parse(localStorage.getItem('exclusive_accounts') || '[]');
    const idx = accounts.findIndex(a => a.id === user.id);
    if (idx !== -1) {
      accounts[idx] = { ...accounts[idx], ...updates };
      localStorage.setItem('exclusive_accounts', JSON.stringify(accounts));
    }
    localStorage.setItem('exclusive_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
