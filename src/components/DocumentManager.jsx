import React, { useState, useEffect } from 'react';
import { fetchDocuments } from '../services/documentService';

export default function DocumentManager({ initialFolderId, title, userRole = 'guest', readOnly = true, userEmail = null }) {
    // Google DriveのURLにauthuserパラメータを追加してアカウント選択を省略
    const appendAuthUser = (url) => {
        if (!url || !userEmail) return url;
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}authuser=${encodeURIComponent(userEmail)}`;
    };

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [path, setPath] = useState([{ id: initialFolderId, name: title || 'ルート' }]);
    const [error, setError] = useState(null);

    const ROOT_FOLDER_ID = import.meta.env.VITE_DOCUMENTS_FOLDER_ID;
    const currentFolder = path[path.length - 1];

    useEffect(() => {
        loadDocuments(currentFolder.id);
    }, [currentFolder.id]);

    const loadDocuments = async (folderId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchDocuments(folderId);

            // 役割に応じたフィルタリング（ルートフォルダの場合のみ適用）
            let filteredData = data;
            // ルートフォルダの場合のみ、フォルダの表示を数字付きに制限して整理する
            if (folderId === ROOT_FOLDER_ID) {
                if (userRole === 'admin') {
                    // 全て表示
                    filteredData = data;
                } else if (userRole === 'member') {
                    // フォルダは数字（01_など）で始まるものに限定し、ファイル制限は解除して利便性を高める
                    filteredData = data.filter(item => {
                        const isFolder = item.type === 'folder';
                        const startsWithDigit = /^[0-9０-９]+/.test(item.name);
                        const isPublicInfo = !item.name.includes('管理者') && !item.name.includes('アーカイブ');

                        if (isFolder) {
                            return startsWithDigit && isPublicInfo;
                        }
                        return isPublicInfo; // ファイルは数字なしでも表示（単発配布物に対応）
                    });
                } else {
                    // ゲストは「01_」で始まる、かつ不適切ワードを含まないもののみ表示
                    filteredData = data.filter(item =>
                        /^(01|０１)/.test(item.name) &&
                        !item.name.includes('管理者') &&
                        !item.name.includes('アーカイブ')
                    );
                }
            }

            setDocuments(filteredData);
        } catch (err) {
            setError('ドキュメントの取得に失敗しました。');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFolderClick = (folder) => {
        setPath([...path, { id: folder.id, name: folder.name }]);
    };

    const handleBreadcrumbClick = (index) => {
        setPath(path.slice(0, index + 1));
    };

    const formatSize = (bytes) => {
        if (!bytes) return '---';
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '---';
        const date = new Date(dateStr);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-4">
            {/* パンくずリスト */}
            <nav className="flex items-center text-sm text-gray-500 overflow-x-auto pb-2">
                {path.map((folder, index) => (
                    <React.Fragment key={folder.id}>
                        {index > 0 && <span className="mx-2">/</span>}
                        <button
                            onClick={() => handleBreadcrumbClick(index)}
                            className={`hover:text-shuyukan-blue whitespace-nowrap ${index === path.length - 1 ? 'font-bold text-shuyukan-blue' : ''
                                }`}
                        >
                            {folder.name}
                        </button>
                    </React.Fragment>
                ))}
            </nav>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin h-8 w-8 border-4 border-shuyukan-blue border-t-transparent rounded-full"></div>
                </div>
            ) : error ? (
                <div className="text-center py-20 text-red-500 bg-red-50 rounded-xl border border-red-100">
                    <p className="font-bold underline mb-2">エラーが発生しました</p>
                    <p>{error}</p>
                </div>
            ) : documents.length === 0 ? (
                <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <span className="text-4xl mb-4 block">📁</span>
                    <p>このフォルダは空です</p>
                </div>
            ) : (
                <div className="overflow-hidden bg-white border border-gray-100 rounded-xl">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名前</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">最終更新</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">サイズ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {documents.map((item) => (
                                <tr key={item.id} className="hover:bg-blue-50 transition-colors cursor-pointer group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <span className="text-xl mr-3">
                                                {item.type === 'folder' ? '📁' : '📄'}
                                            </span>
                                            {item.type === 'folder' ? (
                                                <button
                                                    onClick={() => handleFolderClick(item)}
                                                    className="text-gray-900 font-medium group-hover:text-shuyukan-blue text-left"
                                                >
                                                    {item.name}
                                                </button>
                                            ) : (
                                                <a
                                                    href={appendAuthUser(item.url)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-900 font-medium group-hover:text-shuyukan-blue"
                                                >
                                                    {item.name}
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                        {formatDate(item.updated)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                        {item.type === 'folder' ? '--' : formatSize(item.size)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!readOnly && (
                <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 italic">
                        ※ ファイルのアップロード・削除は直接 Google Drive で行ってください。
                        （反映には数秒かかる場合があります）
                    </p>
                    <a
                        href={appendAuthUser(`https://drive.google.com/drive/folders/${currentFolder.id}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-shuyukan-blue text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all"
                    >
                        Google Drive で開く ↗
                    </a>
                </div>
            )}
        </div>
    );
}
