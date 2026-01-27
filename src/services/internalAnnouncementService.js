/**
 * Internal Announcement Service - 部員専用お知らせ
 * Google Sheets連携で部員のみに表示するお知らせを管理
 */

const API_URL = import.meta.env.VITE_MEMBER_API_URL || '';

/**
 * 部員向けお知らせ一覧を取得
 * @returns {Promise<Array>} お知らせ配列
 */
export async function fetchInternalAnnouncements() {
    if (!API_URL) {
        console.log('[InternalAnnouncement] API URL未設定');
        return [];
    }

    try {
        const url = new URL(API_URL);
        url.searchParams.append('action', 'getInternalAnnouncements');

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.success === false) {
            console.error('[InternalAnnouncement] API Error:', data.error);
            return [];
        }

        const announcements = data.data || (Array.isArray(data) ? data : []);

        // 2週間以上前のものはフィルタ（バックエンド側でも削除するが、フロントでも念のため）
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        return announcements.filter(a => {
            const announcementDate = new Date(a.date);
            return announcementDate >= twoWeeksAgo;
        });
    } catch (error) {
        console.error('[InternalAnnouncement] データ取得エラー:', error);
        return [];
    }
}

/**
 * 部員向けお知らせを追加
 * @param {Object} announcementData - お知らせデータ {title, body, priority}
 * @returns {Promise<Object>} 追加されたお知らせ
 */
export async function addInternalAnnouncement(announcementData) {
    if (!API_URL) {
        throw new Error('API URL未設定');
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify({
                action: 'addInternalAnnouncement',
                announcementData: announcementData
            }),
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.success === false) {
            throw new Error(data.error || 'お知らせの追加に失敗しました');
        }

        console.log('[InternalAnnouncement] 追加成功:', data);
        return data;
    } catch (error) {
        console.error('[InternalAnnouncement] 追加エラー:', error);
        throw error;
    }
}

/**
 * 部員向けお知らせを削除
 * @param {number|string} id - お知らせID
 * @returns {Promise<boolean>} 成功/失敗
 */
export async function deleteInternalAnnouncement(id) {
    if (!API_URL) {
        throw new Error('API URL未設定');
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify({
                action: 'deleteInternalAnnouncement',
                id: id
            }),
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.success === false) {
            throw new Error(data.error || 'お知らせの削除に失敗しました');
        }

        console.log('[InternalAnnouncement] 削除成功');
        return true;
    } catch (error) {
        console.error('[InternalAnnouncement] 削除エラー:', error);
        throw error;
    }
}

export default {
    fetchInternalAnnouncements,
    addInternalAnnouncement,
    deleteInternalAnnouncement
};
