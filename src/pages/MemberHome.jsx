import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiteFrame from '../components/SiteFrame.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import AdminDashboard from '../components/AdminDashboard.jsx';

export default function MemberHome() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // If accessed directly without auth, show error (or redirect in a real app)
    if (!user) {
        return (
            <SiteFrame title="エラー">
                <div className="text-center py-12">
                    <p className="text-red-500 mb-4">ログインが必要です。</p>
                    <a href="/login" className="text-shuyukan-blue underline">ログインページへ</a>
                </div>
            </SiteFrame>
        );
    }

    const isAdmin = user.role === 'admin';

    return (
        <SiteFrame title={`マイページ (${user.name})`}>
            {/* ログアウトボタン */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-bold transition-colors"
                >
                    ログアウト
                </button>
            </div>

            {isAdmin ? (
                <AdminDashboard user={user} />
            ) : (
                <div className="space-y-8">
                    {/* Member Notification Area */}
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                        <h3 className="font-bold text-lg text-shuyukan-blue mb-4">📢 部員へのお知らせ</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>10/20(土) は合同稽古のため、集合時間が変更になります。</li>
                            <li>スポーツ保険の更新手続きをお願いします（期限：今月末）。</li>
                        </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="border border-gray-200 rounded p-6 shadow-sm">
                            <h4 className="font-bold text-gray-600 mb-2">会員情報</h4>
                            <dl>
                                <div className="flex justify-between py-2 border-b">
                                    <dt className="text-gray-500">会員ID</dt>
                                    <dd>{user.id || 'M000'}</dd>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <dt className="text-gray-500">段位</dt>
                                    <dd>{user.grade || '未登録'}</dd>
                                </div>
                                <div className="flex justify-between py-2">
                                    <dt className="text-gray-500">会費状況</dt>
                                    <dd className="text-green-600 font-bold">納入済</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="border border-gray-200 rounded p-6 shadow-sm">
                            <h4 className="font-bold text-gray-600 mb-2">最近の出席</h4>
                            <div className="flex gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${i < 3 ? 'bg-shuyukan-blue' : 'bg-gray-300'}`}>
                                        {i < 3 ? '出' : '-'}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">※ 直近5回の稽古</p>
                        </div>
                    </div>

                    {/* Drive Link (Legacy feature kept) */}
                    <div className="text-right">
                        <a href="#!" className="text-sm text-gray-400 hover:text-shuyukan-blue">
                            📂 Google Driveを開く
                        </a>
                    </div>
                </div>
            )}
        </SiteFrame>
    );
}
