/**
 * Admin Dashboard - 管理者専用の会員管理画面
 * Firebase認証済みの管理者のみアクセス可能
 */
import React, { useEffect, useState } from 'react';
import { fetchMembers, fetchActiveMembers, addMember, updateMember, deleteMember } from '../services/memberService.js';
import MemberEditModal from './MemberEditModal.jsx';
import MemberAddModal from './MemberAddModal.jsx';
import DeleteConfirmModal from './DeleteConfirmModal.jsx';

export default function AdminDashboard({ user }) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, 少年部, 一般部
    const [statusFilter, setStatusFilter] = useState('active'); // all, active

    // Modal states
    const [editMember, setEditMember] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteMemberTarget, setDeleteMemberTarget] = useState(null);

    useEffect(() => {
        loadMembers();
    }, [statusFilter]);

    const loadMembers = async () => {
        setLoading(true);
        try {
            const data = statusFilter === 'active'
                ? await fetchActiveMembers()
                : await fetchMembers();
            setMembers(data);
        } catch (error) {
            console.error('会員データ取得エラー:', error);
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

    const filteredMembers = filter === 'all'
        ? members
        : members.filter(m => {
            if (filter === '少年部') return m.memberType === '少年部' || m.memberType === '少年';
            if (filter === '一般部') return m.memberType === '一般部' || m.memberType === '一般';
            return m.memberType === filter;
        });

    const stats = {
        total: members.length,
        junior: members.filter(m => m.memberType === '少年部' || m.memberType === '少年').length,
        adult: members.filter(m => m.memberType === '一般部' || m.memberType === '一般').length,
    };

    return (
        <div className="space-y-6">
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
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${m.memberType === '少年部'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-purple-100 text-purple-800'
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
                        該当する会員がいません
                    </div>
                )}
            </div>

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
        </div>
    );
}

