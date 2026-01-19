/**
 * Admin Dashboard - 管理者専用の会員管理画面
 * Firebase認証済みの管理者のみアクセス可能
 */
import React, { useEffect, useState } from 'react';
import { fetchMembers, fetchActiveMembers, addMember, updateMember, deleteMember, approveMember } from '../services/memberService.js';
import { fetchNews, addNews, updateNews, deleteNews } from '../services/newsService.js';
import MemberEditModal from './MemberEditModal.jsx';
import MemberAddModal from './MemberAddModal.jsx';
import DeleteConfirmModal from './DeleteConfirmModal.jsx';
import NewsAddModal from './NewsAddModal.jsx';
import NewsEditModal from './NewsEditModal.jsx';

/**
 * 日付文字列を月日のみの形式に変換
 */
function formatDateOnly(dateStr) {
    if (!dateStr) return '';
    const originalStr = String(dateStr);
    try {
        const date = new Date(originalStr);
        if (!isNaN(date.getTime())) {
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }
        const dateOnly = originalStr.split(' ')[0];
        const match = dateOnly.match(/(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})/);
        if (match) {
            return `${parseInt(match[2], 10)}/${parseInt(match[3], 10)}`;
        }
    } catch (e) { }
    return originalStr;
}

export default function AdminDashboard({ user, initialStatusFilter = 'all' }) {
    const [members, setMembers] = useState([]);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('members'); // members, news
    const [filter, setFilter] = useState('all'); // all, 少年部, 一般部
    const [statusFilter, setStatusFilter] = useState(initialStatusFilter); // 初期表示フィルター


    // Modal states
    const [editMember, setEditMember] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteMemberTarget, setDeleteMemberTarget] = useState(null);

    // News Modal states
    const [editNewsItem, setEditNewsItem] = useState(null);
    const [isAddNewsModalOpen, setIsAddNewsModalOpen] = useState(false);
    const [deleteNewsTarget, setDeleteNewsTarget] = useState(null);

    // Notification state
    const [successMessage, setSuccessMessage] = useState(null);

    // 承認待ちの人数
    const pendingCount = members.filter(m => m.status === '承認待ち' || m.status === 'pending').length;

    // 3秒後にメッセージを消すタイマー
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // プロップスからの初期フィルター同期
    useEffect(() => {
        if (initialStatusFilter) {
            setStatusFilter(initialStatusFilter);
        }
    }, [initialStatusFilter]);


    useEffect(() => {
        if (activeTab === 'members') {
            loadMembers();
        } else {
            loadNews();
        }
    }, [activeTab, statusFilter]);

    const loadMembers = async () => {
        setLoading(true);
        try {
            const data = statusFilter === 'active'
                ? await fetchActiveMembers()
                : await fetchMembers();
            setMembers(data);
            setError(null);
        } catch (error) {
            console.error('会員データ取得エラー:', error);
            setError(`会員データの取得に失敗しました: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const loadNews = async () => {
        setLoading(true);
        try {
            const data = await fetchNews();
            setNews(data);
        } catch (error) {
            console.error('ニュース取得エラー:', error);
        } finally {
            setLoading(false);
        }
    };

    // CRUD Handlers
    const handleAddMember = async (memberData) => {
        setLoading(true);
        try {
            await addMember(memberData);
            setSuccessMessage(`${memberData.name || '会員'}を新規登録しました。「承認待ち」として追加されたため、全件表示に切り替えます。`);
            setStatusFilter('all'); // 全表示に切り替え
            await loadMembers();
        } catch (error) {
            setError(`登録に失敗しました: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    const handleUpdateMember = async (memberId, memberData) => {
        setLoading(true);
        try {
            await updateMember(memberId, memberData);
            setSuccessMessage(`${memberData.name || '会員'}の情報を更新しました。`);
            await loadMembers();
        } catch (error) {
            console.error('Update error:', error);
            setError(`更新に失敗しました: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    const handleApproveMember = async (member) => {
        try {
            if (!window.confirm(`${member.name}様の入会申請を承認し、ポータルの利用を許可しますか？`)) return;

            setLoading(true);
            await approveMember(member.id);
            setSuccessMessage(`${member.name}様の承認が完了しました。`);
            await loadMembers();
        } catch (error) {
            setError(`承認に失敗しました: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMember = async (memberId) => {
        await deleteMember(memberId);
        await loadMembers();
    };

    // News Handlers
    const handleAddNews = async (newsData) => {
        await addNews(newsData);
        await loadNews();
    };

    const handleUpdateNews = async (id, newsData) => {
        await updateNews(id, newsData);
        await loadNews();
    };

    const handleDeleteNews = async (id) => {
        await deleteNews(id);
        await loadNews();
    };

    const isJunior = (type) => {
        if (!type) return false;
        return type.includes('少年') || type.includes('小') || type.includes('中') || type.includes('幼');
    };

    const isAdult = (type) => {
        if (!type) return false;
        return type.includes('一般') || type.includes('大') || type.includes('高');
    };

    const filteredMembers = members.filter(m => {
        // 1. ステータスによるフィルタリング
        if (statusFilter === 'active') {
            if (!(m.status === '在籍' || m.status === 'active')) return false;
        } else if (statusFilter === 'pending') {
            if (!(m.status === '承認待ち' || m.status === 'pending')) return false;
        }

        // 2. 所属（少年部・一般部等）によるフィルタリング
        if (filter === 'all') return true;
        if (filter === '少年部') return isJunior(m.memberType);
        if (filter === '一般部') return isAdult(m.memberType);
        return m.memberType === filter;
    });


    const stats = {
        total: members.length,
        junior: members.filter(m => isJunior(m.memberType)).length,
        adult: members.filter(m => isAdult(m.memberType)).length,
    };

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('members')}
                    className={`px-6 py-3 font-bold transition-all ${activeTab === 'members'
                        ? 'border-b-2 border-shuyukan-blue text-shuyukan-blue'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    👤 会員管理
                </button>
                <button
                    onClick={() => setActiveTab('news')}
                    className={`px-6 py-3 font-bold transition-all ${activeTab === 'news'
                        ? 'border-b-2 border-shuyukan-blue text-shuyukan-blue'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    📢 お知らせ管理
                </button>
            </div>

            {activeTab === 'members' ? (
                <div className="space-y-6">
                    {successMessage && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md animate-bounce">
                            <div className="flex items-center">
                                <span className="text-xl mr-2">✅</span>
                                <p className="font-bold">{successMessage}</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm mb-6">
                            <strong>⚠️ エラーが発生しました:</strong> {error}
                            <p className="mt-1 text-xs opacity-75">APIのURL設定やSpreadsheetの権限をご確認ください。</p>
                        </div>
                    )}

                    {/* Pending Requests Alert */}
                    {pendingCount > 0 && (
                        <div id="pending-alert" className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse-subtle">
                            <div className="flex items-center gap-4 text-left">
                                <span className="text-4xl">🔔</span>
                                <div>
                                    <h3 className="text-lg font-bold text-amber-800">未承認の入会申請があります ({pendingCount}件)</h3>
                                    <p className="text-amber-700 text-sm">申請内容を確認し、利用を許可する場合は「承認」ボタンを押してください。</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setFilter('all');
                                    setStatusFilter('pending');
                                    // テーブルへスクロール
                                    document.getElementById('member-table-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-md shrink-0"
                            >
                                申請を確認する
                            </button>
                        </div>
                    )}


                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-shuyukan-blue">会員管理</h2>
                            <p className="text-gray-500 text-sm">ログイン: {user?.email}</p>
                        </div>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-shuyukan-blue text-white px-4 py-2 rounded hover:bg-shuyukan-gold hover:text-shuyukan-blue transition"
                        >
                            + 新規登録
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <p className="text-3xl font-bold text-shuyukan-blue">{stats.total}</p>
                            <p className="text-gray-500 text-sm">総会員数</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <p className="text-3xl font-bold text-green-600">{stats.junior}</p>
                            <p className="text-gray-500 text-sm">少年部</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <p className="text-3xl font-bold text-purple-600">{stats.adult}</p>
                            <p className="text-gray-500 text-sm">一般部</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded text-sm font-bold transition ${filter === 'all'
                                    ? 'bg-shuyukan-blue text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                全員
                            </button>
                            <button
                                onClick={() => setFilter('少年部')}
                                className={`px-4 py-2 rounded text-sm font-bold transition ${filter === '少年部'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                少年部
                            </button>
                            <button
                                onClick={() => setFilter('一般部')}
                                className={`px-4 py-2 rounded text-sm font-bold transition ${filter === '一般部'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                一般部
                            </button>
                        </div>
                    </div>

                    <div id="member-table-section" className="mb-4 flex flex-wrap items-center gap-4 text-sm bg-gray-50 p-3 rounded-lg border">
                        <span className="font-bold text-gray-700">表示対象:</span>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="statusFilter"
                                className="mr-2"
                                checked={statusFilter === 'all'}
                                onChange={() => setStatusFilter('all')}
                            />
                            全件表示
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="statusFilter"
                                className="mr-2"
                                checked={statusFilter === 'active'}
                                onChange={() => setStatusFilter('active')}
                            />
                            在籍者のみ
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="statusFilter"
                                className="mr-2"
                                checked={statusFilter === 'pending'}
                                onChange={() => setStatusFilter('pending')}
                            />
                            <span className={pendingCount > 0 ? "text-amber-600 font-bold" : ""}>
                                承認待ちのみ {pendingCount > 0 && `(${pendingCount})`}
                            </span>
                        </label>
                    </div>


                    {/* Member Table */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shuyukan-blue"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">会員番号</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">氏名</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学年</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">区分</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">段級位</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredMembers.map((m) => (
                                            <tr key={m.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{m.id}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="font-bold text-gray-900">{m.name}</div>
                                                    <div className="text-xs text-gray-400">{m.furigana}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{m.grade}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isJunior(m.memberType)
                                                        ? 'bg-green-100 text-green-800'
                                                        : isAdult(m.memberType)
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {m.memberType}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{m.rank}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${m.status === '在籍' || m.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : m.status === '休会'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {m.status === 'active' ? '在籍' : m.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                    {(m.status === '承認待ち' || m.status === 'pending') && (
                                                        <button
                                                            onClick={() => handleApproveMember(m)}
                                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-bold mr-3 shadow-sm transition-all animate-bounce-in"
                                                        >
                                                            承認
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setEditMember(m)}
                                                        className="text-shuyukan-blue hover:text-shuyukan-gold mr-3"
                                                    >
                                                        編集
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteMemberTarget(m)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        削除
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {!loading && filteredMembers.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                <p>該当する会員がいません</p>
                                <p className="text-xs mt-2">(取得済みデータ総数: {members.length})</p>
                            </div>
                        )}
                    </div>

                </div>
            ) : (
                <div className="space-y-6">
                    {/* News Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-shuyukan-blue">お知らせ管理</h2>
                            <p className="text-gray-500 text-sm">サイトのお知らせを更新・管理します</p>
                        </div>
                        <button
                            onClick={() => setIsAddNewsModalOpen(true)}
                            className="bg-shuyukan-blue text-white px-4 py-2 rounded hover:bg-shuyukan-gold hover:text-shuyukan-blue transition"
                        >
                            + 新規投稿
                        </button>
                    </div>

                    {/* News Table */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shuyukan-blue"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日付</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">カテゴリ</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイトル</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">固定</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {news.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{formatDateOnly(item.date)}</td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm font-bold text-gray-900 line-clamp-1 max-w-xs">{item.title}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.isPinned ? '📌' : '-'}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => setEditNewsItem(item)}
                                                        className="text-shuyukan-blue hover:text-shuyukan-gold mr-3"
                                                    >
                                                        編集
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('このお知らせを削除してもよろしいですか？')) {
                                                                handleDeleteNews(item.id);
                                                            }
                                                        }}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        削除
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {!loading && news.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                お知らせはありません
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modals */}
            {editMember && (
                <MemberEditModal
                    member={editMember}
                    onClose={() => setEditMember(null)}
                    onSave={handleUpdateMember}
                />
            )}

            {isAddModalOpen && (
                <MemberAddModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddMember}
                />
            )}

            {deleteMemberTarget && (
                <DeleteConfirmModal
                    member={deleteMemberTarget}
                    onClose={() => setDeleteMemberTarget(null)}
                    onConfirm={handleDeleteMember}
                />
            )}

            {/* News Modals */}
            {editNewsItem && (
                <NewsEditModal
                    item={editNewsItem}
                    onClose={() => setEditNewsItem(null)}
                    onSave={handleUpdateNews}
                />
            )}

            {isAddNewsModalOpen && (
                <NewsAddModal
                    onClose={() => setIsAddNewsModalOpen(false)}
                    onAdd={handleAddNews}
                />
            )}
        </div>
    );
}

