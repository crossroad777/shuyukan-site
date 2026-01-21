import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, ADMIN_EMAILS } from '../services/firebase';
import { fetchMemberByEmail } from '../services/memberService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const determineUserRole = async (firebaseUser) => {
    if (!firebaseUser) return null;

    // 1. 管理者チェック（メールアドレスリスト）
    if (ADMIN_EMAILS.includes(firebaseUser.email)) {
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: 'admin',
      };
    }

    // 2. データベース存在チェック
    try {
      const member = await fetchMemberByEmail(firebaseUser.email);
      if (member) {
        const isApproved = member.status === '在籍' || member.status === 'active';

        // スプレッドシートの「権限」カラムに「管理者」と入っているかチェック
        const hasAdminRole = member.role === '管理者' || member.role === 'admin';

        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: hasAdminRole ? 'admin' : (isApproved ? 'member' : 'pending'),
          memberData: member
        };
      }
    } catch (error) {
      console.error('Error fetching member role:', error);
    }

    // 3. ゲスト（未登録）
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      role: 'guest',
    };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userData = await determineUserRole(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const userData = await determineUserRole(result.user);
      setUser(userData);
      return { success: true, role: userData.role };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = useMemo(() => ({
    user,
    loading,
    isAuthed: !!user,
    isAdmin: user?.role === 'admin',
    isMember: user?.role === 'member',
    isPending: user?.role === 'pending',
    isGuest: user?.role === 'guest',
    login,
    logout,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
