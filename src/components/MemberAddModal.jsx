/**
 * MemberAddModal - 新規会員登録モーダル
 */
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const gradeOptions = [
    '幼児',
    '小学1年', '小学2年', '小学3年', '小学4年', '小学5年', '小学6年',
    '中学1年', '中学2年', '中学3年',
    '高校1年', '高校2年', '高校3年',
    '大学生', '一般'
];

const rankOptions = [
    '級外', '10級', '9級', '8級', '7級', '6級', '5級', '4級', '3級', '2級', '1級',
    '初段', '二段', '三段', '四段', '五段', '六段', '七段', '錬士', '教士', '範士'
];

export default function MemberAddModal({ onClose, onAdd }) {
    const [formData, setFormData] = useState({
        name: '',
        furigana: '',
        birthDate: '',
        gender: '男',
        grade: '',
        memberType: '少年部',
        rank: '',
        notes: ''
    });
    const [saving, setSaving] = useState(false);

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
        if (!formData.grade) {
            alert('学年・区分を選択してください');
            return;
        }
        setSaving(true);
        try {
            await onAdd(formData);
            onClose();
        } catch (error) {
            alert('登録に失敗しました: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-shuyukan-blue">新規会員登録</h3>
                    <p className="text-sm text-gray-500">会員番号は自動で採番されます</p>
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
                                placeholder="山田 太郎"
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
                                placeholder="やまだ たろう"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                            />
                        </div>
                    </div>

                    {/* Grade - Primary field for 会員種別 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">学年・区分 *</label>
                            <select
                                name="grade"
                                value={formData.grade}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                                required
                            >
                                <option value="">選択してください</option>
                                {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">所属（自動判定）</label>
                            <div className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-gray-600">
                                {(() => {
                                    const g = formData.grade || '';
                                    if (g.includes('小') || g.includes('中') || g.includes('幼') ||
                                        g.includes('年少') || g.includes('年中') || g.includes('年長')) {
                                        return <span className="text-green-600 font-bold">少年部</span>;
                                    }
                                    if (g) {
                                        return <span className="text-purple-600 font-bold">一般部</span>;
                                    }
                                    return <span className="text-gray-400">学年を選択してください</span>;
                                })()}
                            </div>
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

                    {/* Rank */}
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

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="特記事項があれば入力"
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
                            {saving ? '登録中...' : '登録'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
