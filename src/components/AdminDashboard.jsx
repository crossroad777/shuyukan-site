/**
 * Admin Dashboard - 管理者専用の会員管理画面
 * Firebase認証済みの管理者のみアクセス可能
 */
import React, { useEffect, useState } from 'react';
import { fetchMembers, fetchActiveMembers, addMember, updateMember, deleteMember } from '../services/memberService.js';
import { fetchNews, addNews, updateNews, deleteNews } from '../services/newsService.js';
import MemberEditModal from './MemberEditModal.jsx';
import MemberAddModal from './MemberAddModal.jsx';
import DeleteConfirmModal from './DeleteConfirmModal.jsx';
import NewsAddModal from './NewsAddModal.jsx';
import NewsEditModal from './NewsEditModal.jsx';

export default function AdminDashboard({ user }) {
    const [members, setMembers] = useState([]);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('members'); // members, news
    const [filter, setFilter] = useState('all'); // all, 少年部, 一般部
    const [statusFilter, setStatusFilter] = useState('active'); // all, active

    // Modal states
    const [editMember, setEditMember] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteMemberTarget, setDeleteMemberTarget] = useState(null);

    // News Modal states
    const [editNewsItem, setEditNewsItem] = useState(null);
    const [isAddNewsModalOpen, setIsAddNewsModalOpen] = useState(false);
    const [deleteNewsTarget, setDeleteNewsTarget] = useState(null);

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
        await addMember(memberData);
        await loadMembers();
    };

    const handleUpdateMember = async (memberId, memberData) => {
        await updateMember(memberId, memberData);
        await loadMembers();
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

    const filteredMembers = filter === 'all'
        ? members
        : members.filter(m => {
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
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm mb-6">
                            <strong>⚠️ エラーが発生しました:</strong> {error}
                            <p className="mt-1 text-xs opacity-75">APIのURL設定やSpreadsheetの権限をご確認ください。</p>
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
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={statusFilter === 'active'}
                                onChange={(e) => setStatusFilter(e.target.checked ? 'active' : 'all')}
                                className="rounded"
                            />
                            在籍者のみ表示
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
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{item.date}</td>
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

