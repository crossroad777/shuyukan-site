/**
 * Login Page - Firebase Google Authentication
 * 管理者のみログイン可能
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SiteFrame from '../components/SiteFrame.jsx';

export default function Login() {
  const { login, isAuthed, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 既にログイン済みなら会員ページへ
  React.useEffect(() => {
    if (isAuthed) {
      navigate('/member');
    }
  }, [isAuthed, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    const result = await login();

    if (result.success) {
      navigate('/member');
    } else {
      setError(result.error || 'ログインに失敗しました');
    }

    setLoading(false);
  };

  if (authLoading) {
    return (
      <SiteFrame title="ログイン">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-shuyukan-blue"></div>
        </div>
      </SiteFrame>
    );
  }

  return (
    <SiteFrame title="会員ログイン">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm text-center">
          <div className="mb-6">
            <span className="text-5xl">🥋</span>
          </div>

          <h3 className="font-bold text-xl text-shuyukan-blue mb-2">部員・関係者専用</h3>
          <p className="text-sm text-gray-600 mb-6">
            Googleアカウントでログインしてください。<br />
            初めての方はログイン後に利用申請を行えます。
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-shuyukan-blue transition shadow-sm disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="font-bold text-gray-700">
              {loading ? 'ログイン中...' : 'Googleでログイン'}
            </span>
          </button>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>※ 管理者の承認後、部員専用コンテンツが閲覧可能になります</p>
        </div>
      </div>
    </SiteFrame>
  );
}
