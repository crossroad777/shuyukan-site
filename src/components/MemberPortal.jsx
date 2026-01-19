import React, { useState } from 'react';
import PortalButton from './PortalButton';
import DocumentManager from './DocumentManager';
import { FOLDER_IDS } from '../services/documentService';

export default function MemberPortal({ user }) {
    const [activeView, setActiveView] = useState('menu'); // menu, manual, events, schedule, key, docs

    const menuItems = [
        { id: 'manual', label: '部員用ガイド', icon: '📖' },
        { id: 'events', label: '予定されている行事', icon: '📅' },
        { id: 'schedule', label: '稽古日程表', icon: '⚔️' },
        { id: 'key', label: '緊急連絡網・当番', icon: '🔑' },
        { id: 'docs', label: '共有配布資料', icon: '📁' },
    ];

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
                    {activeView === 'manual' ? (
                        <DocumentManager
                            initialFolderId={FOLDER_IDS.MANUAL}
                            title="📖 部員用ガイド"
                            userRole="member"
                            readOnly={true}
                        />
                    ) : activeView === 'events' ? (
                        <DocumentManager
                            initialFolderId={FOLDER_IDS.EVENTS}
                            title="📅 予定されている行事"
                            userRole="member"
                            readOnly={true}
                        />
                    ) : activeView === 'key' ? (
                        <DocumentManager
                            initialFolderId={FOLDER_IDS.KEY}
                            title="🔑 緊急連絡網・当番"
                            userRole="member"
                            readOnly={true}
                        />
                    ) : activeView === 'docs' ? (
                        <DocumentManager
                            initialFolderId={FOLDER_IDS.DOCS}
                            title="📁 共有配布資料"
                            userRole="member"
                            readOnly={true}
                        />
                        // ... (中略)
                    ) : activeView === 'schedule' ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b pb-4 mb-6">
                                <h2 className="text-2xl font-bold text-shuyukan-blue">稽古日程表</h2>
                                <a
                                    href={`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(import.meta.env.VITE_GOOGLE_CALENDAR_ID)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-bold px-4 py-2 bg-shuyukan-blue text-white rounded-lg hover:bg-shuyukan-gold hover:text-shuyukan-blue transition-all shadow-sm"
                                >
                                    Googleカレンダーに追加 ↗
                                </a>
                            </div>
                            <div className="relative w-full aspect-video md:aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden border">
                                <iframe
                                    title="剣道部 稽古日程"
                                    src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(import.meta.env.VITE_GOOGLE_CALENDAR_ID)}&ctz=Asia%2FTokyo`}
                                    className="absolute top-0 left-0 w-full h-full border-0"
                                    frameBorder="0"
                                    scrolling="no"
                                />
                            </div>
                            <p className="text-sm text-gray-500">※ 場所や時間の詳細はカレンダー内の各項目をクリックして確認してください。</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-shuyukan-blue mb-6 border-b pb-4">
                                詳細情報
                            </h2>

                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <span className="text-6xl mb-4">⚒️</span>
                                <p>この項目は現在準備中です</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 py-8 animate-fade-in">
            {/* 部員識別バー */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-3xl shadow-inner border border-white/10">
                        ⚔️
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">部員ポータル</h2>
                        <p className="text-blue-100 text-sm font-medium">最新のお知らせや配布資料を確認できます</p>
                    </div>
                </div>
                <div className="hidden sm:block">
                    <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                        MEMBER ACCESS
                    </span>
                </div>
            </div>

            {/* 閲覧専用アナウンス */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 flex items-center gap-3 shadow-sm">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-lg">ℹ️</span>
                <div className="font-medium">
                    このポータルは閲覧・確認専用です。情報の編集が必要な場合は、顧問または担当者へお問い合わせください。
                </div>
            </div>

            {/* メニューグリッド */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                    <div key={item.id} className="group">
                        <PortalButton
                            icon={item.icon}
                            label={item.label}
                            onClick={() => setActiveView(item.id)}
                            color="bg-shuyukan-blue"
                        />
                        <div className="mt-2 text-xs text-slate-400 px-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>クリックで詳細表示</span>
                            <span>{item.id === 'schedule' ? '最終更新: 本日' : ''}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* フッター補足 */}
            <div className="mt-12 text-center text-slate-400 text-sm border-t pt-8">
                <p>© 豊中修猷館剣道部 - 部員専用セキュアポータル</p>
            </div>
        </div>
    );
}
