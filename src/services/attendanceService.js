import axios from 'axios';

const API_URL = import.meta.env.VITE_MEMBER_API_URL;

/**
 * 指定した日付の出欠リストを取得
 * @param {string} date - "yyyy-MM-dd"
 */
export const fetchAttendance = async (date) => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                action: 'getAttendance',
                date: date
            }
        });
        return response.data;
    } catch (error) {
        console.error('fetchAttendance error:', error);
        throw error;
    }
};

/**
 * 出席データを更新/追加
 */
export const updateAttendance = async (attendanceData) => {
    try {
        const response = await axios.post(API_URL, {
            action: 'updateAttendance',
            ...attendanceData
        }, {
            headers: {
                'Content-Type': 'text/plain' // CORS対策
            }
        });
        return response.data;
    } catch (error) {
        console.error('updateAttendance error:', error);
        throw error;
    }
};
