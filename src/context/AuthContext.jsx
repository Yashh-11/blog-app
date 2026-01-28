import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const users = await response.json();
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...safeUser } = foundUser;
        setUser(safeUser);
        localStorage.setItem('user', JSON.stringify(safeUser));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const users = await response.json();
      
      if (users.some(u => u.email === email)) {
        return { success: false, error: 'Email already exists' };
      }

      const newUser = {
        id: users.length ? Math.max(...users.map(u => parseInt(u.id))) + 1 : 1,
        username,
        email,
        password
      };

      const response2 = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      const createdUser = await response2.json();
      const { password: _, ...safeUser } = createdUser;
      setUser(safeUser);
      localStorage.setItem('user', JSON.stringify(safeUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
