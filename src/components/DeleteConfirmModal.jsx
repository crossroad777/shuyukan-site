/**
 * DeleteConfirmModal - 削除確認ダイアログ
 */
import React, { useState } from 'react';

export default function DeleteConfirmModal({ member, onClose, onConfirm }) {
    const [deleting, setDeleting] = useState(false);

    const handleConfirm = async () => {
        setDeleting(true);
        try {
            await onConfirm(member.id);
            onClose();
        } catch (error) {
            alert('削除に失敗しました: ' + error.message);
        } finally {
            setDeleting(false);
        }
    };

    if (!member) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">会員を削除</h3>
                            <p className="text-sm text-gray-500">この操作は取り消せません</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded p-4 mb-6">
                        <p className="text-gray-700">
                            以下の会員を削除してもよろしいですか？
                        </p>
                        <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                            <p className="font-bold text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.furigana}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="text-xs text-gray-400">ID: {member.id}</span>
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${member.memberType === '少年部'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-purple-100 text-purple-800'
                                    }`}>
                                    {member.memberType}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={deleting}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                        >
                            キャンセル
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={deleting}
                            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold transition disabled:opacity-50"
                        >
                            {deleting ? '削除中...' : '削除する'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
