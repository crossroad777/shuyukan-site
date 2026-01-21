/**
 * NewsEditModal - お知らせ編集モーダル
 */
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { uploadNewsImage } from '../services/newsService';

const categoryOptions = ['お知らせ', '行事', '稽古日', '体験会', 'その他'];

export default function NewsEditModal({ item, onClose, onSave }) {
    const fileInputRef = useRef(null);
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
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (item) {
            let displayDate = item.date || '';
            if (displayDate.includes('T')) {
                displayDate = displayDate.split('T')[0].replace(/-/g, '.');
            }

            setFormData({
                title: item.title || '',
                category: item.category || 'お知らせ',
                date: displayDate,
                image: item.image || '',
                link: item.link || '',
                content: item.content || '',
                isPinned: !!item.isPinned
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : value;

        // Google Drive URLを直接表示用URLに自動変換 (NewsAddModalと同期)
        if (name === 'image' && typeof newValue === 'string') {
            const driveMatch = newValue.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
            if (driveMatch) {
                newValue = `https://lh3.googleusercontent.com/d/${driveMatch[1]}=w800`;
            }
            const openMatch = newValue.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
            if (openMatch) {
                newValue = `https://lh3.googleusercontent.com/d/${openMatch[1]}=w800`;
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await uploadNewsImage(file);
            if (result.success && result.url) {
                let finalUrl = result.url;
                if (finalUrl.includes('lh3.googleusercontent.com') && !finalUrl.includes('=')) {
                    finalUrl += '=w800';
                }
                setFormData(prev => ({ ...prev, image: finalUrl }));
            }
        } catch (error) {
            alert('画像のアップロードに失敗しました: ' + error.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
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

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">画像</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://drive.google.com/..."
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shuyukan-blue text-sm"
                            />
                            <button
                                type="button"
                                onClick={triggerFileSelect}
                                disabled={uploading}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium border border-gray-300 transition-colors whitespace-nowrap"
                            >
                                {uploading ? '中...' : '画像を選択'}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        {formData.image && (
                            <div className="relative w-full aspect-video bg-gray-50 rounded border border-dashed border-gray-300 overflow-hidden group">
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-full object-contain"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        <p className="text-[10px] text-gray-400 mt-1">※ローカルから選択するか、Googleドライブの直接URLを指定してください</p>
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
