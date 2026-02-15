/**
 * Internal Announcement Service - 部員専用お知らせ
 * Google Sheets連携で部員のみに表示するお知らせを管理
 */

const API_URL = import.meta.env.VITE_MEMBER_API_URL;

/**
 * オブジェクトをBase64エンコードする（UTF-8対応）
 */
const toBase64 = (obj) => {
    try {
        const json = JSON.stringify(obj);
        return window.btoa(unescape(encodeURIComponent(json)));
    } catch (e) {
        console.error('Base64 encoding error:', e);
        return "";
    }
};

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
        const url = new URL(API_URL);
        url.searchParams.append('action', 'announcementAdd');
        url.searchParams.append('data64', toBase64(announcementData));

        const response = await fetch(url.toString(), {
            method: 'GET',
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.success === false) {
            throw new Error(data.error || 'お知らせの追加に失敗しました');
        }

        console.log('[InternalAnnouncement] 追加成功 (GET):', data);
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
        const url = new URL(API_URL);
        url.searchParams.append('action', 'announcementDelete');
        url.searchParams.append('id', id);

        const response = await fetch(url.toString(), {
            method: 'GET',
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.success === false) {
            throw new Error(data.error || 'お知らせの削除に失敗しました');
        }

        console.log('[InternalAnnouncement] 削除成功 (GET)');
        return true;
    } catch (error) {
        console.error('[InternalAnnouncement] 削除エラー:', error);
        throw error;
    }
}

/**
 * 部員向けお知らせを更新
 * @param {number|string} id - お知らせID
 * @param {Object} announcementData - お知らせデータ {title, body, priority}
 * @returns {Promise<Object>} 更新されたお知らせ
 */
export async function updateInternalAnnouncement(id, announcementData) {
    if (!API_URL) {
        throw new Error('API URL未設定');
    }

    try {
        const url = new URL(API_URL);
        url.searchParams.append('action', 'announcementUpdate');
        url.searchParams.append('id', id);
        url.searchParams.append('data64', toBase64(announcementData));

        const response = await fetch(url.toString(), {
            method: 'GET',
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.success === false) {
            throw new Error(data.error || 'お知らせの更新に失敗しました');
        }

        console.log('[InternalAnnouncement] 更新成功 (GET):', data);
        return data;
    } catch (error) {
        console.error('[InternalAnnouncement] 更新エラー:', error);
        throw error;
    }
}

export default {
    fetchInternalAnnouncements,
    addInternalAnnouncement,
    updateInternalAnnouncement,
    deleteInternalAnnouncement
};
