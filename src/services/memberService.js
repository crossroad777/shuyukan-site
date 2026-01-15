/**
 * Member Database Service
 * Google SheetsのApps Script APIから会員データを取得
 */

const MEMBER_API_URL = import.meta.env.VITE_MEMBER_API_URL;

/**
 * 全会員データを取得
 * @returns {Promise<Array>} 会員配列
 */
export async function fetchMembers() {
    if (!MEMBER_API_URL) {
        console.warn('VITE_MEMBER_API_URL is not configured, using mock data');
        return getMockMembers();
    }

    try {
        const response = await fetch(MEMBER_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('会員データ取得エラー:', error);
        return getMockMembers();
    }
}

/**
 * 在籍中の会員のみ取得
 * @returns {Promise<Array>} 在籍会員配列
 */
export async function fetchActiveMembers() {
    const members = await fetchMembers();
    return members.filter(m => m.status === '在籍' || m.status === 'active');
}

/**
 * 会員種別ごとに取得
 * @param {string} type - '少年部' | '一般部'
 * @returns {Promise<Array>} フィルタされた会員配列
 */
export async function fetchMembersByType(type) {
    const members = await fetchMembers();
    return members.filter(m => m.memberType === type);
}

/**
 * 会員番号で1件取得
 * @param {string} memberId - 会員番号 (例: S001)
 * @returns {Promise<Object|null>} 会員オブジェクト
 */
export async function fetchMemberById(memberId) {
    const members = await fetchMembers();
    return members.find(m => m.id === memberId) || null;
}

/**
 * モックデータ（API未設定時のフォールバック）
 */
function getMockMembers() {
    return [
        {
            id: 'S001',
            familyId: 'F001',
            name: '鈴木 健太',
            furigana: 'すずき けんた',
            birthDate: '2015-08-20',
            gender: '男',
            grade: '小学4年',
            memberType: '少年部',
            rank: '2級',
            joinDate: '2023-04-01',
            status: '在籍',
            notes: ''
        },
        {
            id: 'S002',
            familyId: 'F001',
            name: '鈴木 美咲',
            furigana: 'すずき みさき',
            birthDate: '2017-03-15',
            gender: '女',
            grade: '小学2年',
            memberType: '少年部',
            rank: '5級',
            joinDate: '2024-04-01',
            status: '在籍',
            notes: ''
        },
        {
            id: 'S003',
            familyId: 'F002',
            name: '田中 翔太',
            furigana: 'たなか しょうた',
            birthDate: '2014-11-05',
            gender: '男',
            grade: '小学5年',
            memberType: '少年部',
            rank: '1級',
            joinDate: '2022-04-01',
            status: '在籍',
            notes: ''
        },
        {
            id: 'A001',
            familyId: 'F003',
            name: '山田 太郎',
            furigana: 'やまだ たろう',
            birthDate: '1985-05-10',
            gender: '男',
            grade: '一般',
            memberType: '一般部',
            rank: '三段',
            joinDate: '2020-04-01',
            status: '在籍',
            notes: ''
        }
    ];
}
