const API_URL = import.meta.env.VITE_MEMBER_API_URL;

/**
 * 会計データの取得
 */
export const fetchAccountingData = async () => {
    try {
        const response = await fetch(`${API_URL}?action=getAccounting`);
        const result = await response.json();
        if (result.success) {
            return result.data;
        }
        throw new Error(result.error);
    } catch (error) {
        console.error('fetchAccountingData error:', error);
        return [];
    }
};

/**
 * データの追加・更新
 */
export const updateAccountingRecord = async (data) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'updateAccounting',
                ...data
            }),
        });
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('updateAccountingRecord error:', error);
        return false;
    }
};

/**
 * データの削除
 */
export const deleteAccountingRecord = async (id) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'updateAccounting',
                method: 'delete',
                id
            }),
        });
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('deleteAccountingRecord error:', error);
        return false;
    }
};
