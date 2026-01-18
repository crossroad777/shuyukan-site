import React, { useState } from 'react';
import PortalButton from './PortalButton';
import AdminDashboard from './AdminDashboard';
import DocumentManager from './DocumentManager';
import { FOLDER_IDS } from '../services/documentService';
import NewsAddModal from './NewsAddModal';
import AttendanceDashboard from './AttendanceDashboard';
import AccountingDashboard from './AccountingDashboard';
import { fetchSummaryCounts } from '../services/memberService';
import { useEffect } from 'react';

export default function AdminPortal({ user }) {
    const [activeView, setActiveView] = useState('menu');
    const [isQuickNewsModalOpen, setIsQuickNewsModalOpen] = useState(false);
    const [summary, setSummary] = useState({ pendingMembers: 0, newInquiries: 0 });

    useEffect(() => {
        const loadSummary = async () => {
            const data = await fetchSummaryCounts();
            setSummary(data);
        };
        loadSummary();
        // 5分おきに更新
        const timer = setInterval(loadSummary, 5 * 60 * 1000);
        return () => clearInterval(timer);
    }, []);

    // クイックアクション - 最も頻繁に使う機能
    const quickActions = [
        { id: 'quick_news', label: 'お知らせ投稿', icon: '📢', highlight: true },
        { id: 'members', label: '会員管理', icon: '👥', highlight: false, badgeCount: summary.pendingMembers },
    ];

    // 部員向けコンテンツ管理
    const memberContentItems = [
        { id: 'manual', label: 'ガイドの編集', icon: '📖' },
        { id: 'events', label: '行事予定の管理', icon: '📅' },
        { id: 'admin_schedule', label: '稽古日程表の管理', icon: '🗓️' },
        { id: 'key', label: '当番・連絡網の編成', icon: '🔑' },
        { id: 'docs', label: 'ファイル一括管理', icon: '📁' },
    ];

    // 運営・事務管理
    const operationalItems = [
        { id: 'new_requests', label: '入会申込の承認', icon: '📝', badgeCount: summary.pendingMembers },
        { id: 'inquiries', label: 'お問い合わせ管理', icon: '❓', badgeCount: summary.newInquiries },
        { id: 'attendance', label: '全員の出欠管理', icon: '✅' },
        { id: 'accounting', label: '会計・予算管理', icon: '💰' },
        { id: 'instagram_config', label: 'SNS連携設定', icon: '📸' },
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
                            initialFolderId={FOLDER_IDS.MANUAL}
                            title="📖 ガイドの編集"
                            userRole="admin"
                            readOnly={false}
                        />
                    ) : activeView === 'events' ? (
                        <DocumentManager
                            initialFolderId={FOLDER_IDS.EVENTS}
                            title="📅 行事予定の管理"
                            userRole="admin"
                            readOnly={false}
                        />
                    ) : activeView === 'key' ? (
                        <DocumentManager
                            initialFolderId={FOLDER_IDS.KEY}
                            title="🔑 当番・連絡網の編成"
                            userRole="admin"
                            readOnly={false}
                        />
                    ) : activeView === 'new_requests' || activeView === 'inquiries' ? (
                        <DocumentManager
                            initialFolderId={FOLDER_IDS.INQUIRIES}
                            title={activeView === 'new_requests' ? "📝 入会申込の承認" : "❓ お問い合わせ管理"}
                            userRole="admin"
                            readOnly={false}
                        />
                    ) : activeView === 'admin_schedule' ? (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-shuyukan-blue mb-6 border-b pb-4 flex justify-between items-center">
                                <span>🗓️ 稽古日程表の管理</span>
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
                                    src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(import.meta.env.VITE_GOOGLE_CALENDAR_ID)}&ctz=Asia%2FTokyo`}
                                    className="absolute top-0 left-0 w-full h-full border-0"
                                    frameBorder="0"
                                    scrolling="no"
                                />
                            </div>
                        </div>
                    ) : activeView === 'attendance' ? (
                        <AttendanceDashboard />

                    ) : activeView === 'accounting' ? (
                        <AccountingDashboard />
                    ) : activeView === 'docs' ? (
                        <DocumentManager
                            initialFolderId={import.meta.env.VITE_DOCUMENTS_FOLDER_ID}
                            title="📤 ファイル一括管理"
                            userRole="admin"
                            readOnly={false}
                        />
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-shuyukan-blue mb-6 border-b pb-4">
                                管理画面: {activeView}
                            </h2>

                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <span className="text-6xl mb-4">⚒️</span>
                                <p>この項目は現在設定中です</p>
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
                        <h2 className="text-xl font-bold">管理者ポータル</h2>
                        <p className="text-red-100 text-sm">運営・編集などの管理業務を一括で行います</p>
                    </div>
                </div>
                <span className="bg-white text-red-600 px-3 py-1 rounded-full text-xs font-bold font-sans">ADMIN ONLY</span>
            </div>

            <div className="space-y-8">
                {/* クイックアクション - 最も使用頻度の高い機能 */}
                <section className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                    <h3 className="text-lg font-bold text-amber-700 mb-4 flex items-center gap-2">
                        <span className="p-1.5 bg-amber-500 text-white rounded">⚡</span>
                        管理用クイックアクション
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => setIsQuickNewsModalOpen(true)}
                            className="flex items-center gap-4 p-4 bg-white border-2 border-amber-400 rounded-xl hover:bg-amber-50 hover:border-amber-500 transition-all shadow-sm group"
                        >
                            <span className="text-3xl group-hover:scale-110 transition-transform">📢</span>
                            <div className="text-left">
                                <div className="font-bold text-gray-800">最新情報の発信</div>
                                <div className="text-sm text-gray-500">部員へのお知らせを即時投稿</div>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveView('members')}
                            className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
                        >
                            <span className="text-3xl group-hover:scale-110 transition-transform">👥</span>
                            <div className="text-left">
                                <div className="font-bold text-gray-800">会員名簿の管理</div>
                                <div className="text-sm text-gray-500">会員情報の編集・承認作業</div>
                            </div>
                        </button>
                    </div>
                </section>

                {/* 部員向けコンテンツ管理 */}
                <section className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-shuyukan-blue mb-4 flex items-center gap-2">
                        <span className="p-1 bg-shuyukan-blue text-white rounded">📋</span>
                        部員用コンテンツの編集・反映
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
                    <p className="mt-4 text-xs text-gray-400">※ ここでの変更は部員用ポータルへ即座に反映されます。</p>
                </section>

                {/* 運営・事務管理 */}
                <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <span className="p-1 bg-gray-700 text-white rounded">⚙️</span>
                        クラブ内部運営・事務管理
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {operationalItems.map((item) => (
                            <PortalButton
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                onClick={() => setActiveView(item.id)}
                                badgeCount={item.badgeCount}
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
