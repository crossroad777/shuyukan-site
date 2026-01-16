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
 * 新規ニュースを追加
 * @param {Object} newsData - ニュースデータ
 * @returns {Promise<Object>} 追加されたニュース
 */
export async function addNews(newsData) {
    if (!NEWS_API_URL) {
        const newNews = {
            ...newsData,
            id: fallbackNews.length + 1,
            date: new Date().toLocaleDateString('ja-JP').replace(/\//g, '.')
        };
        fallbackNews.push(newNews);
        console.log('ニュースを追加しました（モック）:', newNews);
        return newNews;
    }

    try {
        const response = await fetch(NEWS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'add', ...newsData })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('ニュース追加エラー:', error);
        throw error;
    }
}

/**
 * ニュースを更新
 * @param {number|string} id - ニュースID
 * @param {Object} newsData - 更新データ
 * @returns {Promise<Object>} 更新されたニュース
 */
export async function updateNews(id, newsData) {
    if (!NEWS_API_URL) {
        const index = fallbackNews.findIndex(n => n.id === id);
        if (index === -1) throw new Error('ニュースが見つかりません');
        fallbackNews[index] = { ...fallbackNews[index], ...newsData };
        return fallbackNews[index];
    }

    try {
        const response = await fetch(NEWS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update', id, ...newsData })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('ニュース更新エラー:', error);
        throw error;
    }
}

/**
 * ニュースを削除
 * @param {number|string} id - ニュースID
 * @returns {Promise<boolean>} 成功/失敗
 */
export async function deleteNews(id) {
    if (!NEWS_API_URL) {
        const index = fallbackNews.findIndex(n => n.id === id);
        if (index === -1) throw new Error('ニュースが見つかりません');
        fallbackNews.splice(index, 1);
        return true;
    }

    try {
        const response = await fetch(NEWS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error('ニュース削除エラー:', error);
        throw error;
    }
}

export default {
    fetchNews,
    fetchPinnedNews,
    fetchNewsByCategory,
    addNews,
    updateNews,
    deleteNews
};
