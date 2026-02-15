import React, { useState, useEffect } from 'react';

export default function InternalAnnouncementEditModal({ item, onClose, onSave }) {
    const [title, setTitle] = useState(item.title || '');
    const [body, setBody] = useState(item.body || '');
    const [priority, setPriority] = useState(item.priority || 'normal'); // normal | important
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('タイトルを入力してください');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave(item.id, {
                title: title.trim(),
                body: body.trim(),
                priority: priority,
                date: item.date // 日付は維持
            });
            onClose();
        } catch (error) {
            alert('更新に失敗しました: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in">
                {/* ヘッダー */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">✏️</span>
                            <div>
                                <h2 className="text-xl font-bold">部員向けお知らせ編集</h2>
                                <p className="text-blue-100 text-sm">投稿内容を変更します</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white text-2xl"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* フォーム */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* 重要度 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            重要度
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setPriority('normal')}
                                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${priority === 'normal'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <span className="text-xl">📌</span>
                                <span className="ml-2 font-medium">通常</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPriority('important')}
                                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${priority === 'important'
                                    ? 'border-red-500 bg-red-50 text-red-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <span className="text-xl">🚨</span>
                                <span className="ml-2 font-medium">重要</span>
                            </button>
                        </div>
                    </div>

                    {/* タイトル */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            タイトル <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="例: 来月の稽古時間変更について"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* 本文 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            本文（任意）
                        </label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="詳細な内容を入力してください..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* 注意書き */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                        <p className="font-medium">📢 このお知らせは公開日から2週間後に自動削除されます</p>
                        <p className="mt-1 text-amber-600">公開日: {item.date}</p>
                    </div>

                    {/* ボタン */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim()}
                            className={`flex-1 py-3 px-4 rounded-lg font-bold text-white transition-all ${priority === 'important'
                                ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isSubmitting ? '保存中...' : '💾 変更を保存する'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
