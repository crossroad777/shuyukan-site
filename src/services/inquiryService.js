/**
 * Inquiry Service
 * お問い合わせ・体験申込のPOST送信を担当
 */

const API_URL = import.meta.env.VITE_MEMBER_API_URL;

/**
 * お問い合わせを送信
 * @param {Object} data - { name, email, type, content }
 */
export async function submitInquiry(data) {
    if (!API_URL) {
        console.warn('API_URL is not configured, simulating success');
        return { success: true };
    }

    try {
        // GASのCORS制約を回避するため、GETクエリパラメータ経由で送信
        const url = new URL(API_URL);
        url.searchParams.append('action', 'submitInquiry');
        url.searchParams.append('data', JSON.stringify(data));

        const response = await fetch(url.toString(), {
            method: 'GET',
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        if (result && result.success === false) {
            throw new Error(result.error || '送信に失敗しました');
        }
        return result;
    } catch (error) {
        console.error('Inquiry Submit Error:', error);
        throw error;
    }
}
