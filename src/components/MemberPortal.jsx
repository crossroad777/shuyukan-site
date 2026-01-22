import React, { useState } from 'react';
import PortalButton from './PortalButton';
import DocumentManager from './DocumentManager';
import { FOLDER_IDS } from '../services/documentService';

export default function MemberPortal({ user }) {
    const memberData = user.memberData || {};
    // 必須項目が埋まっているかチェック (氏名、ふりがな、生年月日、学年、段級位、緊急連絡先)
    const isProfileIncomplete = !memberData.name || !memberData.furigana || !memberData.birthDate || !memberData.grade || !memberData.rank || !memberData.emergencyContact;

    const [activeView, setActiveView] = useState(isProfileIncomplete ? 'initialSetup' : 'menu'); // menu, manual, events, schedule, key, docs, initialSetup

    const menuItems = [
        { id: 'manual', label: '部員用ガイド', icon: '📖' },
        { id: 'events', label: '予定されている行事', icon: '📅' },
        { id: 'schedule', label: '稽古日程表', icon: '⚔️' },
        { id: 'key', label: '緊急連絡網・当番', icon: '🔑' },
        { id: 'docs', label: '共有配布資料', icon: '📁' },
        { id: 'profile', label: 'マイプロフィール設定', icon: '⚙️' },
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
                    ) : activeView === 'profile' || activeView === 'initialSetup' ? (
                        <ProfileEditView
                            user={user}
                            isInitial={activeView === 'initialSetup'}
                            onBack={() => setActiveView('menu')}
                        />
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

function ProfileEditView({ user, onBack, isInitial }) {
    const memberData = user.memberData || {};
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: memberData.name || user.name || '',
        furigana: memberData.furigana || '',
        grade: memberData.grade || '',
        rank: memberData.rank || '',
        birthDate: memberData.birthDate || '',
        emergencyContact: memberData.emergencyContact || '',
        email: user.email || ''
    });

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { updateMember } = await import('../services/memberService');
            // user.memberData.id が行番号として保存されている前提
            await updateMember(memberData.id, formData);
            setSuccess(true);
            // 初回設定の場合はメニューに遷移、通常更新は少し待ってからリロード
            setTimeout(() => {
                if (isInitial) {
                    window.location.href = '/member'; // メニューページへ遷移
                } else {
                    window.location.reload();
                }
            }, 2000);
        } catch (error) {
            alert('更新に失敗しました: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('【重要】退会処理を行い、登録データを完全に削除しますか？\nこの操作は取り消せません。')) return;
        if (!window.confirm('本当によろしいですか？（データは即座に抹消されます）')) return;

        setLoading(true);
        try {
            const { deleteMember } = await import('../services/memberService');
            await deleteMember(user.id);
            alert('データの削除が完了しました。ご利用ありがとうございました。');
            window.location.href = '/'; // トップへ戻る
        } catch (error) {
            alert('削除に失敗しました: ' + error.message);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-4">
            {isInitial ? (
                <div className="bg-shuyukan-blue text-white p-6 rounded-xl shadow-lg mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span>👋</span> 初回プロフィール設定
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">ご登録ありがとうございます！ご利用の前に、必須情報の登録をお願いします。</p>
                </div>
            ) : (
                <h2 className="text-2xl font-bold text-shuyukan-blue border-b pb-4 mb-6">⚙️ マイプロフィール設定</h2>
            )}

            {success ? (
                <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-xl text-center shadow-inner">
                    <span className="text-5xl mb-4 block">✨</span>
                    <p className="text-xl font-bold">プロフィールを更新しました</p>
                    <p className="text-sm opacity-75 mt-2">最新の情報を反映しています...</p>
                </div>
            ) : (
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">氏名</label>
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-shuyukan-blue focus:border-shuyukan-blue"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">ふりがな</label>
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-shuyukan-blue focus:border-shuyukan-blue"
                                value={formData.furigana}
                                onChange={e => setFormData({ ...formData, furigana: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">学年・区分</label>
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-shuyukan-blue focus:border-shuyukan-blue"
                                value={formData.grade}
                                onChange={e => setFormData({ ...formData, grade: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">段級位 <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-shuyukan-blue focus:border-shuyukan-blue"
                                value={formData.rank}
                                onChange={e => setFormData({ ...formData, rank: e.target.value })}
                                placeholder="例：三段"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">生年月日 <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                                <select
                                    className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-shuyukan-blue focus:border-shuyukan-blue"
                                    value={formData.birthDate ? formData.birthDate.split('-')[0] : ''}
                                    onChange={e => {
                                        const parts = (formData.birthDate || '--').split('-');
                                        parts[0] = e.target.value;
                                        setFormData({ ...formData, birthDate: parts.join('-') });
                                    }}
                                    required
                                >
                                    <option value="">年</option>
                                    {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                        <option key={y} value={y}>{y}年</option>
                                    ))}
                                </select>
                                <select
                                    className="w-20 border-gray-300 rounded-lg shadow-sm focus:ring-shuyukan-blue focus:border-shuyukan-blue"
                                    value={formData.birthDate ? formData.birthDate.split('-')[1] : ''}
                                    onChange={e => {
                                        const parts = (formData.birthDate || '--').split('-');
                                        parts[1] = e.target.value;
                                        setFormData({ ...formData, birthDate: parts.join('-') });
                                    }}
                                    required
                                >
                                    <option value="">月</option>
                                    {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(m => (
                                        <option key={m} value={m}>{parseInt(m)}月</option>
                                    ))}
                                </select>
                                <select
                                    className="w-20 border-gray-300 rounded-lg shadow-sm focus:ring-shuyukan-blue focus:border-shuyukan-blue"
                                    value={formData.birthDate ? formData.birthDate.split('-')[2] : ''}
                                    onChange={e => {
                                        const parts = (formData.birthDate || '--').split('-');
                                        parts[2] = e.target.value;
                                        setFormData({ ...formData, birthDate: parts.join('-') });
                                    }}
                                    required
                                >
                                    <option value="">日</option>
                                    {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(d => (
                                        <option key={d} value={d}>{parseInt(d)}日</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">緊急連絡先 (電話番号) <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-shuyukan-blue focus:border-shuyukan-blue"
                                value={formData.emergencyContact}
                                onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
                                placeholder="090-0000-0000"
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label className="text-sm font-bold text-gray-700 block mb-1">登録メールアドレス</label>
                        <p className="text-lg font-mono text-gray-600 border-b pb-2">{formData.email}</p>
                        <p className="text-xs text-gray-400 mt-2">※ ログインメールアドレスの変更は管理者へお問い合わせください。</p>
                    </div>

                    <div className="pt-6 border-t flex flex-col sm:flex-row justify-between gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-3 rounded-lg font-bold shadow-md transition-all disabled:opacity-50 flex-1 ${isInitial ? 'bg-shuyukan-gold text-shuyukan-blue hover:scale-105' : 'bg-shuyukan-blue text-white hover:bg-shuyukan-gold hover:text-shuyukan-blue'
                                }`}
                        >
                            {loading ? '保存中...' : isInitial ? '入会情報を登録してスタート！' : '変更内容を保存する'}
                        </button>
                        {!isInitial && (
                            <button
                                type="button"
                                onClick={onBack}
                                className="bg-white border text-gray-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all flex-1"
                            >
                                キャンセル
                            </button>
                        )}
                    </div>

                    <div className="mt-12 pt-8 border-t">
                        <h3 className="text-lg font-bold text-red-600 mb-4">🚨 危険な操作区域</h3>
                        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold text-red-800">退会・データ抹消</p>
                                <p className="text-xs text-red-600">この操作を行うと、あなたの登録データはポータルから完全に削除されます。</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="bg-white text-red-600 border border-red-300 text-xs px-4 py-2 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all whitespace-nowrap"
                            >
                                退会する
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}
