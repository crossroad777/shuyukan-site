/**
 * News Service - Google Sheets連携
 * スプレッドシートからお知らせ・告知データを取得
 */

// Google Apps ScriptでデプロイしたWebアプリのURL
// 管理者がスプレッドシートを作成後、ここにURLを設定します
const NEWS_API_URL = import.meta.env.VITE_NEWS_API_URL || '';

// ローカル開発用のフォールバックデータ（本番版では空）
const fallbackNews = [];

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
        const url = new URL(NEWS_API_URL);
        url.searchParams.append('action', 'getNews');
        console.log('[NewsService] リクエスト URL:', url.toString());

        const response = await fetch(url.toString());
        console.log('[NewsService] レスポンスステータス:', response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('[NewsService] 受信データ:', data);

        // GAS側からエラーオブジェクト（{success: false, error: "..."}）が返ってきた場合
        if (data && data.success === false) {
            console.error('[NewsService] API Error:', data.error);
            // エラー時はフォールバックを使用すべきだが、一旦空配列かフォールバックを返す
            return fallbackNews;
        }

        const news = data.data || (Array.isArray(data) ? data : null);
        console.log('[NewsService] 解析されたニュース:', news);

        if (!Array.isArray(news)) {
            console.error('[NewsService] Unexpected data format:', data);
            return fallbackNews;
        }

        // データが空の場合の警告
        if (news.length === 0) {
            console.warn('[NewsService] お知らせデータが空です。フォールバックデータを使用します。');
            return fallbackNews;
        }

        return news;
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
        // Google Apps ScriptはJSON POSTでCORSエラーになるため、
        // Content-Type: text/plain を使用してプリフライト(OPTIONS)を回避する
        const response = await fetch(NEWS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify({
                action: 'addNews',
                newsData: newsData
            }),
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data && data.success === false) {
            throw new Error(data.error || 'ニュースの追加に失敗しました');
        }
        console.log('[NewsService] News added successfully:', data);
        return data;
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
        // Google Apps ScriptはJSON POSTでCORSエラーになるため、
        // Content-Type: text/plain を使用してプリフライト(OPTIONS)を回避する
        const response = await fetch(NEWS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify({
                action: 'updateNews',
                id: id,
                newsData: newsData
            }),
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data && data.success === false) {
            throw new Error(data.error || 'ニュースの更新に失敗しました');
        }
        console.log('[NewsService] News updated successfully:', data);
        return data;
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
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify({
                action: 'deleteNews',
                id: id
            }),
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.success === false) {
            throw new Error(data.error || 'ニュースの削除に失敗しました');
        }
        console.log('[NewsService] News deleted successfully');
        return true;
    } catch (error) {
        console.error('ニュース削除エラー:', error);
        throw error;
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

/**
 * 画像をアップロード
 * @param {File} file - 画像ファイル
 * @returns {Promise<Object>} アップロード結果 ({success, url, fileId})
 */
export async function uploadNewsImage(file) {
    if (!NEWS_API_URL) {
        // モック: ローカルプレビューURLを返す
        const mockUrl = URL.createObjectURL(file);
        return { success: true, url: mockUrl, name: file.name };
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const base64Data = reader.result.split(',')[1];
                const payload = {
                    action: 'uploadFile',
                    fileName: file.name,
                    mimeType: file.type,
                    base64Data: base64Data
                };

                const response = await fetch(NEWS_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: JSON.stringify(payload),
                    redirect: 'follow'
                });

                if (!response.ok) {
                    throw new Error(`Upload failed: ${response.status}`);
                }

                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.error || 'Upload failed');
                }

                resolve(data);
            } catch (error) {
                console.error('[NewsService] Image upload error:', error);
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

export default {
    fetchNews,
    fetchPinnedNews,
    fetchNewsByCategory,
    addNews,
    updateNews,
    deleteNews,
    uploadNewsImage
};
