/**
 * 豊中修猷館 ドキュメント管理サービス
 * Google Apps Script (Unified API) を経由して Google Drive のファイルを取得します。
 */

const API_URL = import.meta.env.VITE_MEMBER_API_URL;
const FOLDER_ID = import.meta.env.VITE_DOCUMENTS_FOLDER_ID;

/**
 * 指定されたフォルダ内のファイル一覧を取得します
 */
export const fetchDocuments = async () => {
    if (!FOLDER_ID || FOLDER_ID === 'YOUR_FOLDER_ID_HERE') {
        console.warn('Google Drive Folder ID is not configured.');
        return [];
    }

    try {
        const response = await fetch(`${API_URL}?action=getDocuments&folderId=${FOLDER_ID}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Failed to fetch documents:', error);
        return [];
    }
};
