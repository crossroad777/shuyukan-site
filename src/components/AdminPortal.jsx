import React, { useState } from 'react';
import PortalButton from './PortalButton';
import AdminDashboard from './AdminDashboard';
import DocumentManager from './DocumentManager';
import NewsAddModal from './NewsAddModal';
import AttendanceDashboard from './AttendanceDashboard';
import { addNews } from '../services/newsService';

export default function AdminPortal({ user }) {
    const [activeView, setActiveView] = useState('menu');
    const [isQuickNewsModalOpen, setIsQuickNewsModalOpen] = useState(false);

    // クイックアクション - 最も頻繁に使う機能
    const quickActions = [
        { id: 'quick_news', label: 'お知らせ投稿', icon: '📢', highlight: true },
        { id: 'members', label: '会員管理', icon: '👥', highlight: false },
    ];

    // 部員向けコンテンツ管理
    const memberContentItems = [
        { id: 'manual', label: 'マニュアル編集', icon: '📖' },
        { id: 'events', label: '行事管理', icon: '📅' },
        { id: 'admin_schedule', label: '稽古日程管理', icon: '🗓️' },
        { id: 'key', label: '鍵当番管理', icon: '🔑' },
        { id: 'docs', label: 'ドキュメント管理', icon: '📁' },
    ];

    // 運営・事務管理
    const operationalItems = [
        { id: 'new_requests', label: '新規申込確認', icon: '📝' },
        { id: 'inquiries', label: '問い合わせ確認', icon: '❓' },
        { id: 'attendance', label: '出欠管理', icon: '✅' },
        { id: 'accounting', label: '会計管理', icon: '💰' },
    ];

    const handleQuickNewsAdd = async (newsData) => {
        await addNews(newsData);
        setIsQuickNewsModalOpen(false);
    };

    if (activeView !== 'menu') {
        return (
            <div className="space-y-6 animate-fade-in">
                <button
                    onClick={() => setActiveView('menu')}
                    className="text-shuyukan-blue font-bold flex items-center gap-2 hover:underline mb-4"
                >
                    ← メニューに戻る
                </button>

                <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                    {activeView === 'members' ? (
                        <AdminDashboard user={user} />
                    ) : activeView === 'manual' ? (
                        <DocumentManager
                            initialFolderId="1y69KPQZVezRg04VbQHBEWNTpfU77HkS-"
                            title="マニュアル編集"
                            userRole="admin"
                            readOnly={false}
                        />
                    ) : activeView === 'events' ? (
                        <DocumentManager
                            initialFolderId="1GbcEPDo_ElXhJ11Al20EbLUnh8YHW-sK"
                            title="行事管理"
                            userRole="admin"
                            readOnly={false}
                        />
                    ) : activeView === 'key' ? (
                        <DocumentManager
                            initialFolderId="1ASJ5aVH7LlH1KiNkOVdtcUDwdrdIbCcC"
                            title="鍵当番・連絡網管理"
                            userRole="admin"
                            readOnly={false}
                        />
                    ) : activeView === 'new_requests' || activeView === 'inquiries' ? (
                        <DocumentManager
                            initialFolderId="1OUVODsItawhhsPQm3XDndtzgVl1Nbs_Q"
                            title={activeView === 'new_requests' ? "新規申込確認" : "問い合わせ確認"}
                            userRole="admin"
                            readOnly={false}
                        />
                    ) : activeView === 'admin_schedule' ? (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-shuyukan-blue mb-6 border-b pb-4 flex justify-between items-center">
                                <span>稽古日程管理</span>
                                <a
                                    href="https://calendar.google.com/calendar/u/0/r"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm px-4 py-2 bg-shuyukan-blue text-white rounded-lg hover:bg-opacity-90 transition-all"
                                >
                                    Googleカレンダーで編集 ↗
                                </a>
                            </h2>
                            <div className="relative w-full aspect-video md:aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden border">
                                <iframe
                                    title="剣道部 稽古日程"
                                    src="https://calendar.google.com/calendar/embed?src=98e522073c688c30411bc67f17eb8ce9617db601c6329411f4dd676ca809e82b%40group.calendar.google.com&ctz=Asia%2FTokyo"
                                    className="absolute top-0 left-0 w-full h-full border-0"
                                    frameBorder="0"
                                    scrolling="no"
                                />
                            </div>
                        </div>
                    ) : activeView === 'attendance' ? (
                        <AttendanceDashboard />

                    ) : activeView === 'accounting' ? (
                        <DocumentManager
                            initialFolderId="1D9rUdo_OXBJJIQ9_CO705lhDtKJWxA_K"
                            title="会計管理"
                            userRole="admin"
                            readOnly={false}
                        />
                    ) : activeView === 'docs' ? (
                        <DocumentManager
                            initialFolderId={import.meta.env.VITE_DOCUMENTS_FOLDER_ID}
                            title="クラブ全ドキュメント"
                            userRole="admin"
                            readOnly={false}
                        />
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-shuyukan-blue mb-6 border-b pb-4">
                                管理機能: {activeView}
                            </h2>

                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <span className="text-6xl mb-4">⚒️</span>
                                <p>この機能は現在開発中です</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8 animate-fade-in">
            {/* 管理者識別バー */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-3 rounded-lg shadow-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🛡️</span>
                    <div>
                        <h2 className="text-xl font-bold">管理者ダッシュボード</h2>
                        <p className="text-red-100 text-sm">運営に必要なすべての機能へアクセスできます</p>
                    </div>
                </div>
                <span className="bg-white text-red-600 px-3 py-1 rounded-full text-xs font-bold">ADMIN</span>
            </div>

            <div className="space-y-8">
                {/* クイックアクション - 最も使用頻度の高い機能 */}
                <section className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                    <h3 className="text-lg font-bold text-amber-700 mb-4 flex items-center gap-2">
                        <span className="p-1.5 bg-amber-500 text-white rounded">⚡</span>
                        クイックアクション
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => setIsQuickNewsModalOpen(true)}
                            className="flex items-center gap-4 p-4 bg-white border-2 border-amber-400 rounded-xl hover:bg-amber-50 hover:border-amber-500 transition-all shadow-sm group"
                        >
                            <span className="text-3xl group-hover:scale-110 transition-transform">📢</span>
                            <div className="text-left">
                                <div className="font-bold text-gray-800">お知らせ投稿</div>
                                <div className="text-sm text-gray-500">新しいお知らせを作成</div>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveView('members')}
                            className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
                        >
                            <span className="text-3xl group-hover:scale-110 transition-transform">👥</span>
                            <div className="text-left">
                                <div className="font-bold text-gray-800">会員管理</div>
                                <div className="text-sm text-gray-500">会員一覧・承認・編集</div>
                            </div>
                        </button>
                    </div>
                </section>

                {/* 部員向けコンテンツ管理 */}
                <section>
                    <h3 className="text-lg font-bold text-shuyukan-blue mb-4 flex items-center gap-2">
                        <span className="p-1 bg-shuyukan-blue text-white rounded">📋</span>
                        部員向けコンテンツ管理
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {memberContentItems.map((item) => (
                            <PortalButton
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                onClick={() => setActiveView(item.id)}
                            />
                        ))}
                    </div>
                </section>

                {/* 運営・事務管理 */}
                <section>
                    <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <span className="p-1 bg-gray-700 text-white rounded">⚙️</span>
                        運営・事務管理
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {operationalItems.map((item) => (
                            <PortalButton
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                onClick={() => setActiveView(item.id)}
                            />
                        ))}
                    </div>
                </section>
            </div>

            {/* クイックお知らせ投稿モーダル */}
            {isQuickNewsModalOpen && (
                <NewsAddModal
                    onClose={() => setIsQuickNewsModalOpen(false)}
                    onAdd={handleQuickNewsAdd}
                />
            )}
        </div>
    );
}
