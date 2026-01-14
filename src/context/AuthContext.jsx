/**
 * Author: BaseLine Designs.com
 * Version: v0.1
 * Last Updated: 2026-01-10 JST
 * Changes: Simple localStorage auth for demo
 */
import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const LS_KEY = 'shuyukan_demo_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    // userData should now include role, id, etc.
    // e.g. { name: 'Taro', role: 'admin', id: 'M001' }
    const next = userData || { name: 'Demo User', role: 'member' };
    setUser(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { }
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem(LS_KEY); } catch { }
  };

  const value = useMemo(() => ({
    user,
    isAuthed: !!user,
    login,
    logout,
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
