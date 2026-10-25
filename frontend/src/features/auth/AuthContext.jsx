import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'kanban_auth_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async ({ identifier, password: _password }) => {
    // Simula llamada de autenticación
    await new Promise((resolve) => setTimeout(resolve, 500));

    const username = identifier?.includes('@')
      ? identifier.split('@')[0]
      : identifier;

    const userData = {
      id: 'usr_' + Date.now(),
      username: username || 'desarrollador',
      email: identifier?.includes('@') ? identifier : `${identifier}@devboard.io`,
      token: 'jwt-simulated-token-' + Date.now(),
    };

    setUser(userData);
    return userData;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
