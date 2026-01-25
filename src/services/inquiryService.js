/**
 * Inquiry Service
 * 問い合わせデータの取得・返信を管理
 */

const MEMBER_API_URL = import.meta.env.VITE_MEMBER_API_URL;

/**
 * 問い合わせ一覧を取得
 * @returns {Promise<Array>} 問い合わせデータの配列
 */
export async function fetchInquiries() {
    if (!MEMBER_API_URL) {
        console.warn('VITE_MEMBER_API_URL is not configured');
        return [];
    }

    try {
        const url = new URL(MEMBER_API_URL);
        url.searchParams.append('action', 'getInquiries');

        const response = await fetch(url.toString());
        const data = await response.json();

        if (data && data.success) {
            return data.data || [];
        } else {
            throw new Error(data.error || '問い合わせの取得に失敗しました');
        }
    } catch (error) {
        console.error('[InquiryService] Fetch error:', error);
        return [];
    }
}

/**
 * 問い合わせに返信を送信
 * @param {string|number} id - 問い合わせID（行番号）
 * @param {string} email - 返信先メールアドレス
 * @param {string} message - 返信本文
 * @returns {Promise<Object>} 結果
 */
/**
 * 新規問い合わせを送信
 * @param {Object} formData - { name, email, type, content }
 * @returns {Promise<Object>} 結果
 */
export async function submitInquiry(formData) {
    if (!MEMBER_API_URL) {
        throw new Error('API URL is not configured');
    }

    try {
        const url = new URL(MEMBER_API_URL);
        url.searchParams.append('action', 'submitInquiry');
        url.searchParams.append('data', JSON.stringify(formData));

        const response = await fetch(url.toString(), {
            method: 'GET', // GASの制限回避のためGETを使用
            redirect: 'follow'
        });

        const data = await response.json();
        if (data && data.success) {
            return data;
        } else {
            throw new Error(data.error || '問い合わせの送信に失敗しました');
        }
    } catch (error) {
        console.error('[InquiryService] Submit error:', error);
        throw error;
    }
}

export async function replyToInquiry(id, email, message) {
    if (!MEMBER_API_URL) {
        throw new Error('API URL is not configured');
    }

    try {
        const url = new URL(MEMBER_API_URL);
        url.searchParams.append('action', 'replyToInquiry');
        url.searchParams.append('id', id);
        url.searchParams.append('email', email);
        url.searchParams.append('message', message);

        const response = await fetch(url.toString(), {
            method: 'GET', // GASの制限回避のためGETを使用
            redirect: 'follow'
        });

        const data = await response.json();
        if (data && data.success) {
            return data;
        } else {
            throw new Error(data.error || '返信の送信に失敗しました');
        }
    } catch (error) {
        console.error('[InquiryService] Reply error:', error);
        throw error;
    }
}

export async function deleteInquiry(id) {
    if (!MEMBER_API_URL) {
        throw new Error('API URL is not configured');
    }

    try {
        const url = new URL(MEMBER_API_URL);
        url.searchParams.append('action', 'deleteInquiry');
        url.searchParams.append('id', id);

        const response = await fetch(url.toString(), {
            method: 'GET',
            redirect: 'follow'
        });

        const data = await response.json();
        if (data && data.success) {
            return data;
        } else {
            throw new Error(data.error || '削除に失敗しました');
        }
    } catch (error) {
        console.error('[InquiryService] Delete error:', error);
        throw error;
    }
}
