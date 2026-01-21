import React, { useState } from 'react';
import PortalButton from './PortalButton';
import AdminDashboard from './AdminDashboard';
import DocumentManager from './DocumentManager';
import { FOLDER_IDS } from '../services/documentService';
import NewsAddModal from './NewsAddModal';
import AttendanceDashboard from './AttendanceDashboard';
import AccountingDashboard from './AccountingDashboard';
import { fetchSummaryCounts } from '../services/memberService';
import { addNews } from '../services/newsService';
import { useEffect } from 'react';
import InquiryManager from './InquiryManager';


export default function AdminPortal({ user }) {
    const [activeView, setActiveView] = useState('menu');
    const [isQuickNewsModalOpen, setIsQuickNewsModalOpen] = useState(false);
    const [summary, setSummary] = useState({ pendingMembers: 0, newInquiries: 0 });
    const [dashboardFilter, setDashboardFilter] = useState('all');


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

    // 1. 📢 クイックアクション
    const quickActions = [
        { id: 'quick_news', label: 'お知らせ投稿', icon: '📢', highlight: true },
        { id: 'new_requests', label: '新規申込の承認', icon: '📝', badgeCount: summary.pendingMembers },
    ];

    // 2. 📋 部員向けコンテンツ
    const memberContentItems = [
        { id: 'manual', label: 'ガイドの編集', icon: '📖' },
        { id: 'events', label: '行事予定の管理', icon: '📅' },
        { id: 'admin_schedule', label: '稽古日程表の管理', icon: '🗓️' },
        { id: 'key', label: '当番・連絡網', icon: '🔑' },
        { id: 'docs', label: 'ファイル一括管理', icon: '📁' },
    ];

    // 3. ⚙️ 運営・会員管理
    const operationalItems = [
        { id: 'members', label: '会員名簿の管理', icon: '👥' },
        { id: 'news_admin', label: 'お知らせ機能管理', icon: '📢' },
        { id: 'inquiries', label: 'お問い合わせ管理', icon: '❓', badgeCount: summary.newInquiries },
        { id: 'attendance', label: '全員の出欠管理', icon: '✅' },
        { id: 'accounting', label: '会計・予算管理', icon: '💰' },
        { id: 'instagram_config', label: 'SNS連携設定', icon: '📸' },
    ];

    const handleQuickNewsAdd = async (newsData) => {
        await addNews(newsData);
        setIsQuickNewsModalOpen(false);
    };

    const navigateToMembers = (filter = 'all') => {
        setDashboardFilter(filter);
        setActiveView('members');
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
                    {activeView === 'members' || activeView === 'new_requests' ? (
                        <AdminDashboard user={user} initialStatusFilter={dashboardFilter} />
                    ) : activeView === 'news_admin' ? (
                        <AdminDashboard user={user} initialTab="news" />
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
                    ) : activeView === 'inquiries' ? (
                        <InquiryManager />
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
                <div className="flex flex-col items-end gap-1">
                    <span className="bg-white text-red-600 px-3 py-1 rounded-full text-xs font-bold font-sans">ADMIN ONLY</span>
                    <span className="text-[10px] text-red-200 opacity-70">Release v1.0.0</span>
                </div>
            </div>

            <div className="space-y-8">
                {/* 承認待ちアラート - 最優先で表示 */}
                {summary.pendingMembers > 0 && (
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-1 rounded-xl shadow-lg animate-pulse-subtle">
                        <div className="bg-white p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4 text-center md:text-left">
                                <span className="text-4xl">📩</span>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        未処理の入会申請が <span className="text-amber-600 text-2xl">{summary.pendingMembers}件</span> あります
                                    </h3>
                                    <p className="text-gray-500">新しい部員候補が承認を待っています。内容を確認して承認を行ってください。</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigateToMembers('pending')}
                                className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                ✏️ 申請を確認・承認する
                            </button>
                        </div>
                    </div>
                )}

                {/* お問い合わせ・体験申込アラート - 最優先で表示 */}
                {summary.newInquiries > 0 && (
                    <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-1 rounded-xl shadow-xl animate-pulse-subtle relative overflow-hidden">
                        {/* 光沢エフェクト */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
                        <div className="bg-white p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 relative">
                            <div className="flex items-center gap-4 text-center md:text-left">
                                <div className="relative">
                                    <span className="text-5xl">📩</span>
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-[10px] items-center justify-center font-bold">{summary.newInquiries}</span>
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                                        📬 新しいお問い合わせ・体験申込が <span className="text-teal-600 text-2xl md:text-3xl">{summary.newInquiries}件</span> 届いています！
                                    </h3>
                                    <p className="text-gray-600 mt-1">体験入学の希望や一般のお問い合わせが届いています。早めの対応をお願いします。</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveView('inquiries')}
                                className="w-full md:w-auto bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 text-lg hover:scale-105"
                            >
                                🔍 今すぐ確認する
                            </button>
                        </div>
                    </div>
                )}


                {/* 1. 📢 クイックアクション */}
                <section className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
                    <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                        <span className="p-1.5 bg-red-600 text-white rounded">📢</span>
                        クイックアクション
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => setIsQuickNewsModalOpen(true)}
                            className="flex items-center gap-4 p-4 bg-white border-2 border-red-500 rounded-xl hover:bg-red-50 hover:border-red-600 transition-all shadow-sm group"
                        >
                            <span className="text-3xl group-hover:scale-110 transition-transform">📢</span>
                            <div className="text-left">
                                <div className="font-bold text-gray-800 text-lg">お知らせ投稿</div>
                                <div className="text-sm text-gray-500">部員へのお知らせを即時投稿します</div>
                            </div>
                        </button>
                        <button
                            onClick={() => navigateToMembers('pending')}
                            className={`flex items-center justify-between gap-4 p-4 bg-white border-2 rounded-xl transition-all shadow-sm group ${summary.pendingMembers > 0 ? 'border-amber-500 hover:bg-amber-50' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-3xl group-hover:scale-110 transition-transform">📝</span>
                                <div className="text-left">
                                    <div className="font-bold text-gray-800 text-lg">新規申込の承認</div>
                                    <div className="text-sm text-gray-500">入会希望者の承認・確認</div>
                                </div>
                            </div>
                            {summary.pendingMembers > 0 && (
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                                    {summary.pendingMembers}
                                </span>
                            )}
                        </button>
                    </div>
                </section>

                {/* 2. 📋 部員向けコンテンツ */}
                <section className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-shuyukan-blue mb-4 flex items-center gap-2">
                        <span className="p-1 bg-shuyukan-blue text-white rounded">📋</span>
                        部員向けコンテンツ
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

                {/* 3. ⚙️ 運営・会員管理 */}
                <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <span className="p-1 bg-gray-700 text-white rounded">⚙️</span>
                        運営・会員管理
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {operationalItems.map((item) => (
                            <PortalButton
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                onClick={() => {
                                    if (item.id === 'members') {
                                        navigateToMembers('all');
                                    } else {
                                        setActiveView(item.id);
                                    }
                                }}
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
