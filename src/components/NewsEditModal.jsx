/**
 * NewsEditModal - お知らせ編集モーダル
 */
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const categoryOptions = ['お知らせ', '行事', '稽古日', '体験会', 'その他'];

export default function NewsEditModal({ item, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        category: 'お知らせ',
        date: '',
        image: '',
        link: '',
        content: '',
        isPinned: false
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (item) {
            setFormData({
                title: item.title || '',
                category: item.category || 'お知らせ',
                date: item.date || '',
                image: item.image || '',
                link: item.link || '',
                content: item.content || '',
                isPinned: !!item.isPinned
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert('タイトルは必須です');
            return;
        }
        setSaving(true);
        try {
            await onSave(item.id, formData);
            onClose();
        } catch (error) {
            alert('更新に失敗しました: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (!item) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-shuyukan-blue">お知らせ編集</h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">タイトル *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="例: ○月の稽古日程を更新しました"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                            required
                        />
                    </div>

                    {/* Category & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                            >
                                {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">日付 (YYYY.MM.DD)</label>
                            <input
                                type="text"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                placeholder="2026.01.17"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">画像URL (Googleドライブ等)</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://drive.google.com/..."
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                        />
                    </div>

                    {/* Link URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">詳細リンク先URL</label>
                        <input
                            type="text"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder="例: /practice (内部) または外部URL"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={3}
                            placeholder="お知らせの詳細内容を入力してください"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue"
                        />
                    </div>

                    {/* Pin Status */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isPinned"
                            id="editIsPinned"
                            checked={formData.isPinned}
                            onChange={handleChange}
                            className="w-4 h-4 text-shuyukan-blue border-gray-300 rounded focus:ring-shuyukan-blue"
                        />
                        <label htmlFor="editIsPinned" className="text-sm font-medium text-gray-700 cursor-pointer">
                            📌 一覧の最上部に固定する（重要なお知らせ）
                        </label>
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
                            {saving ? '更新中...' : '更新する'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
