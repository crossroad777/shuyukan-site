import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SiteFrame from '../components/SiteFrame.jsx';
import { isInAppBrowser, getBrowserType } from '../utils/browserUtils';

export default function Login() {
  const { login, isAuthed, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inAppBrowser, setInAppBrowser] = useState(false);
  const [browserName, setBrowserName] = useState('');

  // アプリ内ブラウザ判定
  useEffect(() => {
    if (isInAppBrowser()) {
      setInAppBrowser(true);
      setBrowserName(getBrowserType());
    }
  }, []);

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

          {inAppBrowser ? (
            <div className="space-y-6">
              <div className="bg-red-600 text-white p-6 rounded-xl shadow-lg border-2 border-red-800 animate-pulse">
                <span className="text-4xl mb-4 block">⚠️ 重要</span>
                <p className="text-lg font-bold leading-relaxed mb-4">
                  {browserName}内ではログインできません
                </p>
                <p className="text-sm border-t border-white/20 pt-4 text-left">
                  Googleのセキュリティ制限により、LINEやInstagramの中ではログインがブロックされます。<br />
                  <br />
                  <span className="text-xl underline decoration-shuyukan-gold underline-offset-4">
                    ブラウザ（SafariやChrome）で開き直してください。
                  </span>
                </p>
              </div>

              <div className="text-left bg-shuyukan-blue/5 p-6 rounded-xl border border-shuyukan-blue/20">
                <h4 className="font-bold text-shuyukan-blue mb-4 flex items-center gap-2">
                  <span className="bg-shuyukan-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">?</span>
                  開き直しかた
                </h4>
                <ol className="text-sm text-gray-700 space-y-4 font-bold">
                  <li className="flex items-start gap-2">
                    <span className="text-shuyukan-red">1.</span>
                    <span>画面右上の「︙」または「⋯」ボタン、もしくは「共有アイコン」をタップ</span>
                  </li>
                  <li className="flex items-start gap-2 border-t pt-4">
                    <span className="text-shuyukan-red">2.</span>
                    <span>「ブラウザで開く」または「デフォルトのブラウザで開く」を選択</span>
                  </li>
                </ol>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-shuyukan-blue transition shadow-sm disabled:opacity-50 mb-6"
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

              <div className="text-left bg-amber-50 border border-amber-100 p-4 rounded-lg">
                <h4 className="text-amber-800 font-bold text-sm mb-2 flex items-center gap-2">
                  <span>ℹ️</span> ブラウザ利用のお願い
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed">
                  より安定した動作のため、SafariやChromeなどの標準ブラウザでの利用を推奨しています。
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>※ 管理者の承認後、部員専用コンテンツが閲覧可能になります</p>
        </div>
      </div>
    </SiteFrame>
  );
}

