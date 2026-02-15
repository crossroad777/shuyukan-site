import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithRedirect,
  getRedirectResult,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';
import { auth, googleProvider, ADMIN_EMAILS } from '../services/firebase';
import { fetchMemberByEmail, fetchMembers } from '../services/memberService';
import liff from '@line/liff';

console.log('[Auth] AuthContext loaded v20260201-2045');
console.log('[Auth] Firebase objects check:', { auth: !!auth, googleProvider: !!googleProvider, ADMIN_EMAILS: !!ADMIN_EMAILS });

const LIFF_ID = import.meta.env.VITE_LIFF_ID;
const MEMBER_API_URL = import.meta.env.VITE_MEMBER_API_URL;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liffError, setLiffError] = useState(null);

  const determineUserRole = async (firebaseUser, lineUser) => {
    const uid = firebaseUser?.uid || lineUser?.userId;
    const email = firebaseUser?.email || lineUser?.email;
    const name = firebaseUser?.displayName || lineUser?.displayName;
    const photoURL = firebaseUser?.photoURL || lineUser?.pictureUrl;
    const lineId = lineUser?.userId;

    if (!email && !lineId) return null;

    // 1. 管理者チェック（メールアドレスリスト）
    if (email && ADMIN_EMAILS.includes(email)) {
      return {
        uid,
        email,
        name,
        photoURL,
        role: 'admin',
        loginMethod: lineUser ? 'line' : 'firebase',
        lineId
      };
    }

    // 2. データベース照合
    try {
      let member = null;
      if (email) {
        member = await fetchMemberByEmail(email);
      }

      if (!member && lineId) {
        console.log('[Auth] Email lookup failed, trying LINE ID:', lineId);
        const members = await fetchMembers();
        member = members.find(m => m.lineId === lineId) || null;
        if (member) {
          console.log('[Auth] Member found by LINE ID:', member.id);
        } else {
          console.warn('[Auth] No member found for LINE ID:', lineId);
          // デバッグ用: 会員一覧の先頭5件のLINE IDを出力
          console.log('[Auth] First 5 members lineIds:', members.slice(0, 5).map(m => ({ id: m.id, lineId: m.lineId })));
        }
      }

      if (member) {
        const mStatus = String(member.status || '').trim().toLowerCase();
        const mRole = String(member.role || '').trim().toLowerCase();

        const isApproved = mStatus === '在籍' || mStatus === 'active';
        // '管理者' または 'admin' を(小文字で)含んでいるかチェック
        const hasAdminRole = mRole.includes('管理者') || mRole.includes('admin') || mRole.includes('管理') || mRole.includes('権限');

        console.log('[Auth] Member DB Lookup:', {
          id: member.id,
          email: member.email,
          status: mStatus,
          role: mRole,
          raw_role_from_db: member.role,
          isApproved,
          hasAdminRole
        });

        return {
          uid,
          email,
          name,
          photoURL,
          role: hasAdminRole ? 'admin' : (isApproved ? 'member' : 'pending'),
          memberData: member,
          loginMethod: lineUser ? 'line' : 'firebase',
          lineId
        };
      }
    } catch (error) {
      console.error('[Auth] Error fetching member role (continuing as guest):', error);
    }

    // 3. ゲスト（未登録またはAPIエラー時）
    const guestUser = {
      uid,
      email,
      name,
      photoURL,
      role: 'guest',
      loginMethod: lineUser ? 'line' : 'firebase',
      lineId
    };
    console.log('[Auth] Role determined: guest', guestUser);
    return guestUser;
  };

  useEffect(() => {
    let isSubscribed = true;

    const initAuth = async () => {
      setLoading(true);

      let lineFound = false;

      // 1. LIFF の初期化
      if (LIFF_ID) {
        try {
          console.log('[Auth] Initializing LIFF with ID:', LIFF_ID);
          await liff.init({ liffId: LIFF_ID });
          console.log('[Auth] LIFF init success');

          // ログアウト状態のチェック（URLパラメータまたはlocalStorage）
          const urlParams = new URLSearchParams(window.location.search);
          const isLogoutInUrl = urlParams.has('logout');
          const isLoggedOutFlag = window.localStorage.getItem('shuyukan_logged_out') === 'true';

          if (isLogoutInUrl || isLoggedOutFlag) {
            // ログアウト直後の場合は自動ログインをスキップし、フラグを維持（firebase監視へ）
            console.log('Logout state detected, skipping LIFF auto-login');
          } else if (liff.isLoggedIn()) {
            const profile = await liff.getProfile();
            const userData = await determineUserRole(null, profile);
            setUser(userData);
            lineFound = true;
          }
        } catch (err) {
          console.error('LIFF init error:', err);
          setLiffError(err.message);
        }
      }

      try {
        // 2. Firebase メールリンク認証のチェック
        if (isSignInWithEmailLink(auth, window.location.href)) {
          let email = window.localStorage.getItem('emailForSignIn');
          if (!email) {
            email = window.prompt('確認のためメールアドレスを再入力してください');
          }
          if (email) {
            const result = await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            const userData = await determineUserRole(result.user);
            setUser(userData);
            setLoading(false);
            return;
          }
        }

        // 3. Firebase リダイレクト結果をチェック
        if (!lineFound) {
          const result = await getRedirectResult(auth);
          if (result && isSubscribed) {
            const userData = await determineUserRole(result.user);
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        // 4. AuthStateObserver を開始
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (!isSubscribed) return;

          try {
            const urlParams = new URLSearchParams(window.location.search);
            const isLogoutInUrl = urlParams.has('logout');
            const isLoggedOutFlag = window.localStorage.getItem('shuyukan_logged_out') === 'true';
            const isTrulyLoggedOut = isLogoutInUrl || isLoggedOutFlag;

            if (firebaseUser && !isTrulyLoggedOut) {
              const userData = await determineUserRole(firebaseUser);
              setUser(userData);
            } else if (LIFF_ID && liff.isLoggedIn() && !isTrulyLoggedOut) {
              // liff.isLoggedIn() は init 済みである必要があるが、この時点では initAuth 内で init されているはず
              const profile = await liff.getProfile();
              const userData = await determineUserRole(null, profile);
              setUser(userData);
            } else {
              setUser(null);
            }
          } catch (err) {
            console.error('AuthStateChanged error:', err);
            setUser(null);
          } finally {
            setLoading(false);
          }
        });

        return unsubscribe;
      }
    };

    const authUnsubscribePromise = initAuth();

    return () => {
      isSubscribed = false;
      authUnsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe());
    };
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      window.localStorage.removeItem('shuyukan_logged_out');
      const result = await signInWithPopup(auth, googleProvider);
      const userData = await determineUserRole(result.user);
      setUser(userData);
      return { success: true, role: userData.role };
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/operation-not-supported-in-this-environment') {
        await signInWithRedirect(auth, googleProvider);
        return { success: true, redirect: true };
      }
      return { success: false, error: error.message, code: error.code };
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email) => {
    try {
      setLoading(true);
      window.localStorage.removeItem('shuyukan_logged_out');
      const actionCodeSettings = {
        url: window.location.origin + '/login',
        handleCodeInApp: true,
      };
      console.log('[Auth] Sending sign-in link to:', email, 'with settings:', actionCodeSettings);
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      return { success: true };
    } catch (error) {
      console.error('Email link login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithLine = () => {
    window.localStorage.removeItem('shuyukan_logged_out');
    if (LIFF_ID) {
      console.log('[Auth] Initiating LINE Login with direct redirect to /member');
      if (!liff.isLoggedIn()) {
        const redirectUri = window.location.origin + '/member';
        console.log('[Auth] LIFF login redirectUri:', redirectUri);
        liff.login({ redirectUri });
      } else {
        console.log('[Auth] LINE already logged in, navigating to /member');
        window.location.href = '/member';
      }
    } else {
      console.error('LIFF ID is missing');
      alert('LINEログインの設定が見つかりません。');
    }
  };

  const logout = async () => {
    try {
      // ログアウトフラグを立てる（自動ログインを防ぐ）
      window.localStorage.setItem('shuyukan_logged_out', 'true');

      if (LIFF_ID && liff.isLoggedIn()) {
        liff.logout();
      }
      await signOut(auth);
      setUser(null);
      // セッションを確実にリセット（キャッシュ回避のためタイムスタンプ付与）
      window.location.replace('/?logout=' + Date.now());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      let userData = null;
      if (auth.currentUser) {
        userData = await determineUserRole(auth.currentUser);
      } else if (LIFF_ID && liff.isLoggedIn()) {
        const profile = await liff.getProfile();
        userData = await determineUserRole(null, profile);
      }
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    } finally {
      setLoading(false);
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
    loginWithEmail,
    loginWithLine,
    logout,
    liffError,
    refreshUser,
  }), [user, loading, liffError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
