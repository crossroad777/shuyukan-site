import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SiteFrame from '../components/SiteFrame.jsx';
import LoginOptions from '../components/LoginOptions.jsx';

export default function Login() {
  const { login, loginWithLine, isAuthed, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 既にログイン済みなら会員ページへ
  useEffect(() => {
    if (isAuthed) {
      navigate('/member');
    }
  }, [isAuthed, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    const result = await login();

    if (result.success) {
      if (result.redirect) {
        // モバイル等でリダイレクトが発生する場合、ナビゲートせずに遷移を待つ
        console.log('Redirecting to Google...');
        return;
      }
      navigate('/member');
    } else {
      setError(result.error || 'ログインに失敗しました');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <SiteFrame title="ログイン中">
        <div className="flex flex-col justify-center items-center py-20 px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-shuyukan-blue mb-6"></div>
          <p className="text-xl font-bold text-shuyukan-blue mb-2">ログイン情報を確認中...</p>
          <p className="text-gray-500 text-sm">そのまましばらくお待ちください。</p>
        </div>
      </SiteFrame>
    );
  }

  return (
    <SiteFrame title="会員ログイン">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm text-center">

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

          <LoginOptions
            onGoogleLogin={handleGoogleLogin}
            onLineLogin={loginWithLine}
          />

          <div className="mt-8 text-left bg-blue-50 border border-blue-100 p-4 rounded-lg">
            <h4 className="text-blue-800 font-bold text-sm mb-2 flex items-center gap-2">
              <span>💡</span> ログインでお困りですか？
            </h4>
            <ul className="text-xs text-blue-900 leading-relaxed list-disc list-inside space-y-1">
              <li>Googleアカウントをお持ちでない方は「メールでログイン」をご利用ください。</li>
              <li>LINEからの閲覧でGoogleログインができない場合は「LINEでログイン」をお試しください。</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>※ 管理者の承認後、部員専用コンテンツが閲覧可能になります</p>
          <p className="text-[8px] mt-2 opacity-30">v20260203-0040</p>
        </div>
      </div>
    </SiteFrame>
  );
}

