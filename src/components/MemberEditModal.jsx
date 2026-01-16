/**
 * MemberEditModal - 会員編集モーダル
 */
import React, { useState, useEffect } from 'react';

const gradeOptions = [
    '年少', '年中', '年長',
    '小学1年', '小学2年', '小学3年', '小学4年', '小学5年', '小学6年',
    '中学1年', '中学2年', '中学3年',
    '高校1年', '高校2年', '高校3年',
    '一般'
];

const rankOptions = [
    '級外', '10級', '9級', '8級', '7級', '6級', '5級', '4級', '3級', '2級', '1級',
    '初段', '二段', '三段', '四段', '五段', '六段', '七段', '錬士', '教士', '範士'
];

const statusOptions = ['在籍', '休会', '退会'];

export default function MemberEditModal({ member, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        furigana: '',
        birthDate: '',
        gender: '男',
        grade: '',
        memberType: '少年部',
        rank: '',
        status: '在籍',
        notes: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (member) {
            setFormData({
                name: member.name || '',
                furigana: member.furigana || '',
                birthDate: member.birthDate || '',
                gender: member.gender || '男',
                grade: member.grade || '',
                memberType: member.memberType || '少年部',
                rank: member.rank || '',
                status: member.status || '在籍',
                notes: member.notes || ''
            });
        }
    }, [member]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            alert('氏名は必須です');
            return;
        }
        setSaving(true);
        try {
            await onSave(member.id, formData);
            onClose();
        } catch (error) {
            alert('保存に失敗しました: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (!member) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-shuyukan-blue">会員編集</h3>
                    <p className="text-sm text-gray-500">会員番号: {member.id}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">氏名 *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ふりがな</label>
                            <input
                                type="text"
                                name="furigana"
                                value={formData.furigana}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                            />
                        </div>
                    </div>

                    {/* Birth Date & Gender */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">生年月日</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                            >
                                <option value="男">男</option>
                                <option value="女">女</option>
                            </select>
                        </div>
                    </div>

                    {/* MemberType & Grade */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">区分</label>
                            <select
                                name="memberType"
                                value={formData.memberType}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                            >
                                <option value="少年部">少年部</option>
                                <option value="一般部">一般部</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">学年</label>
                            <select
                                name="grade"
                                value={formData.grade}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                            >
                                <option value="">選択してください</option>
                                {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Rank & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">段級位</label>
                            <select
                                name="rank"
                                value={formData.rank}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                            >
                                <option value="">選択してください</option>
                                {rankOptions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                            >
                                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-shuyukan-blue text-white rounded hover:bg-shuyukan-gold hover:text-shuyukan-blue font-bold transition disabled:opacity-50"
                        >
                            {saving ? '保存中...' : '保存'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
