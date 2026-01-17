import React, { useState } from 'react';
import PortalButton from './PortalButton';
import DocumentManager from './DocumentManager';

export default function MemberPortal({ user }) {
    const [activeView, setActiveView] = useState('menu'); // menu, manual, events, schedule, key, docs

    const menuItems = [
        { id: 'manual', label: '部員用マニュアル', icon: '📖' },
        { id: 'events', label: '行事・イベント案内', icon: '📅' },
        { id: 'schedule', label: '稽古日程', icon: '⚔️' },
        { id: 'key', label: '鍵当番連絡網', icon: '🔑' },
        { id: 'docs', label: '各種ドキュメント', icon: '📁' },
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
                            initialFolderId="1y69KPQZVezRg04VbQHBEWNTpfU77HkS-"
                            title="部員用マニュアル"
                            userRole="member"
                            readOnly={true}
                        />
                    ) : activeView === 'events' ? (
                        <DocumentManager
                            initialFolderId="1GbcEPDo_ElXhJ11Al20EbLUnh8YHW-sK"
                            title="行事・イベント案内"
                            userRole="member"
                            readOnly={true}
                        />
                    ) : activeView === 'key' ? (
                        <DocumentManager
                            initialFolderId="1ASJ5aVH7LlH1KiNkOVdtcUDwdrdIbCcC"
                            title="鍵当番連絡網"
                            userRole="member"
                            readOnly={true}
                        />
                    ) : activeView === 'docs' ? (
                        <DocumentManager
                            initialFolderId={import.meta.env.VITE_DOCUMENTS_FOLDER_ID}
                            title="各種ドキュメント"
                            userRole="member"
                            readOnly={true}
                        />
                    ) : activeView === 'schedule' ? (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-shuyukan-blue mb-6 border-b pb-4">稽古日程</h2>
                            <div className="relative w-full aspect-video md:aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden border">
                                <iframe
                                    title="剣道部 稽古日程"
                                    src="https://calendar.google.com/calendar/embed?src=98e522073c688c30411bc67f17eb8ce9617db601c6329411f4dd676ca809e82b%40group.calendar.google.com&ctz=Asia%2FTokyo"
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
                                機能
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
        <div className="max-w-md mx-auto space-y-4 py-8 animate-fade-in">
            {/* 部員識別バー */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 rounded-lg shadow-md flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">⚔️</span>
                    <div>
                        <h2 className="text-xl font-bold">部員ポータル</h2>
                        <p className="text-blue-100 text-sm">お知らせ・資料を確認できます</p>
                    </div>
                </div>
                <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold">MEMBER</span>
            </div>

            {/* 閲覧専用バッジ */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center text-sm text-blue-700 flex items-center justify-center gap-2">
                <span>📖</span>
                <span>このポータルは閲覧専用です</span>
            </div>

            {menuItems.map((item) => (
                <PortalButton
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => setActiveView(item.id)}
                />
            ))}
        </div>
    );
}
