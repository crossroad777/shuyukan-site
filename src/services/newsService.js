/**
 * News Service - Google Sheets連携
 * スプレッドシートからお知らせ・告知データを取得
 */

// Google Apps ScriptでデプロイしたWebアプリのURL
// 管理者がスプレッドシートを作成後、ここにURLを設定します
const NEWS_API_URL = import.meta.env.VITE_NEWS_API_URL || '';

// ローカル開発用のフォールバックデータ
const fallbackNews = [
    {
        id: 1,
        date: '2026.01.11',
        title: '体験入部 随時受付中！',
        category: '体験会',
        isPinned: true,
        content: '初心者大歓迎。見学・体験は土曜日17:00〜、日曜日14:00〜で受付中です。',
        link: '/join'
    },
    {
        id: 2,
        date: '2026.01.10',
        title: '1月の稽古日程について',
        category: 'お知らせ',
        isPinned: false,
        content: '1月の稽古日程を更新しました。詳細はカレンダーをご確認ください。',
        link: '/practice'
    },
    {
        id: 3,
        date: '2026.01.05',
        title: '新年初稽古のお知らせ',
        category: '行事',
        isPinned: false,
        content: '1月6日（日）に新年初稽古を行います。',
        link: '#'
    }
];

/**
 * お知らせ一覧を取得
 * @returns {Promise<Array>} ニュース配列
 */
export async function fetchNews() {
    // APIが設定されていない場合はフォールバックデータを返す
    if (!NEWS_API_URL) {
        console.log('[NewsService] API URL未設定のためフォールバックデータを使用');
        return fallbackNews;
    }

    try {
        const response = await fetch(NEWS_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('[NewsService] データ取得エラー:', error);
        // エラー時はフォールバックデータを返す
        return fallbackNews;
    }
}

/**
 * 固定表示のお知らせのみ取得
 * @returns {Promise<Array>} 固定表示のニュース配列
 */
export async function fetchPinnedNews() {
    const news = await fetchNews();
    return news.filter(item => item.isPinned);
}

/**
 * カテゴリ別にお知らせを取得
 * @param {string} category カテゴリ名
 * @returns {Promise<Array>} フィルタされたニュース配列
 */
export async function fetchNewsByCategory(category) {
    const news = await fetchNews();
    return news.filter(item => item.category === category);
}

export default {
    fetchNews,
    fetchPinnedNews,
    fetchNewsByCategory
};
