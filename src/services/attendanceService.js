const API_URL = import.meta.env.VITE_MEMBER_API_URL;

/**
 * 指定した日付の出欠リストを取得
 * @param {string} date - "yyyy-MM-dd"
 */
export const fetchAttendance = async (date) => {
    try {
        const url = new URL(API_URL);
        url.searchParams.append('action', 'getAttendance');
        if (date) url.searchParams.append('date', date);

        const response = await fetch(url.toString());
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('fetchAttendance error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * 出席データを更新/追加
 */
export const updateAttendance = async (attendanceData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'updateAttendance',
                ...attendanceData
            }),
            headers: {
                'Content-Type': 'text/plain' // CORS対策
            }
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('updateAttendance error:', error);
        return { success: false, error: error.message };
    }
};
