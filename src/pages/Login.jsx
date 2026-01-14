import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SiteFrame from '../components/SiteFrame.jsx';
import { db } from '../services/mockDb.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async (email) => {
    setLoading(true);
    try {
      // Simulate API call
      const user = await db.authenticate(email, 'password');
      if (user) {
        login(user);
        navigate('/member');
      } else {
        alert('ログインに失敗しました');
      }
    } catch (e) {
      console.error(e);
      alert('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteFrame title="部員ログイン">
      <div className="max-w-md mx-auto">
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8 text-center">
          <h3 className="font-bold text-shuyukan-blue mb-2">ログイン</h3>
          <p className="text-sm text-gray-600 mb-4">
            以下のアカウントを選択してください。
          </p>

          <div className="space-y-3">
            <button
              onClick={() => handleDemoLogin('sensei@shuyukan.com')}
              disabled={loading}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded hover:bg-shuyukan-gold hover:border-shuyukan-gold hover:text-shuyukan-blue transition shadow-sm group"
            >
              <div className="text-left">
                <span className="block font-bold text-shuyukan-blue group-hover:text-shuyukan-blue">管理者</span>
                <span className="text-xs text-gray-500">会員管理・編集権限</span>
              </div>
              <span className="text-xl">🔑</span>
            </button>

            <button
              onClick={() => handleDemoLogin('jiro@example.com')}
              disabled={loading}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded hover:bg-gray-100 transition shadow-sm"
            >
              <div className="text-left">
                <span className="block font-bold text-gray-800">一般部員</span>
                <span className="text-xs text-gray-500">プロフィール確認・出欠登録</span>
              </div>
              <span className="text-xl">🧑‍🎓</span>
            </button>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="text-center text-gray-400 text-sm">
          <p>※ パスワードログイン機能は準備中です</p>
        </div>
      </div>
    </SiteFrame>
  );
}
