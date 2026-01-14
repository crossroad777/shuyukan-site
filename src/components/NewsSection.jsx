import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FadeInSection from './FadeInSection';
import { fetchNews } from '../services/newsService';

/**
 * GoogleドライブのURLを直接表示可能なURLに変換
 */
function convertDriveUrl(url) {
    if (!url) return null;

    let fileId = null;

    if (url.includes('drive.google.com')) {
        const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (openMatch) fileId = openMatch[1];

        const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (fileMatch) fileId = fileMatch[1];

        const ucMatch = url.match(/\/uc\?id=([a-zA-Z0-9_-]+)/);
        if (ucMatch) fileId = ucMatch[1];
    }

    if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}=w400`;
    }

    return url;
}

const NewsSection = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [pinnedItems, setPinnedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const data = await fetchNews();
                // 固定表示と通常のニュースを分離
                const pinned = data.filter(item => item.isPinned);
                const regular = data.filter(item => !item.isPinned);
                setPinnedItems(pinned);
                setNewsItems(regular.slice(0, 4)); // 最新4件
            } catch (error) {
                console.error('ニュース取得エラー:', error);
            } finally {
                setLoading(false);
            }
        };
        loadNews();
    }, []);

    return (
        <section className="bg-paper relative z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
            {/* 固定表示：体験会・キャンペーン告知バナー */}
            {pinnedItems.length > 0 && (
                <FadeInSection>
                    <div className="mb-8">
                        {pinnedItems.map((item) => (
                            <Link
                                key={item.id}
                                to={item.link || '#'}
                                className="block bg-gradient-to-r from-shuyukan-red via-red-600 to-shuyukan-red text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            >
                                <div className="flex items-center justify-between p-4 md:p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="hidden md:flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
                                            <span className="text-3xl">🎯</span>
                                        </div>
                                        <div>
                                            <span className="inline-block bg-white/20 text-xs px-2 py-1 rounded mb-2">
                                                {item.category}
                                            </span>
                                            <h3 className="text-xl md:text-2xl font-bold font-serif">
                                                {item.title}
                                            </h3>
                                            {item.content && (
                                                <p className="text-sm text-white/80 mt-1 hidden md:block">
                                                    {item.content}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-white/80 text-2xl">
                                        →
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </FadeInSection>
            )}

            {/* 最新情報一覧 */}
            <FadeInSection>
                <div className="bg-white rounded-lg shadow-xl border-t-4 border-shuyukan-gold p-6 md:p-8">
                    <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-shuyukan-blue flex items-center gap-3">
                                <span className="text-shuyukan-gold">●</span>
                                最新情報
                            </h2>
                            <p className="text-xs text-gray-400 mt-1 pl-6">Latest Information</p>
                        </div>
                        <Link to="/news" className="text-sm text-shuyukan-blue hover:text-shuyukan-gold transition-colors font-bold">
                            一覧を見る →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-8 text-gray-400">
                            <div className="animate-spin w-8 h-8 border-2 border-shuyukan-blue border-t-transparent rounded-full mx-auto mb-2"></div>
                            読み込み中...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {newsItems.map((item) => (
                                <Link
                                    key={item.id}
                                    to={item.link || '#'}
                                    className="group block bg-gray-50 rounded overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-shuyukan-gold/30"
                                >
                                    {/* サムネイル画像 */}
                                    {item.image && convertDriveUrl(item.image) && (
                                        <div className="w-full bg-gray-100 overflow-hidden">
                                            <img
                                                src={convertDriveUrl(item.image)}
                                                alt={item.title}
                                                className="w-full h-auto object-contain max-h-40 group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.parentElement.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <span className="inline-block bg-shuyukan-blue/10 text-shuyukan-blue text-[10px] px-2 py-1 rounded mb-2 font-bold">
                                            {item.category}
                                        </span>
                                        <p className="text-xs text-shuyukan-gold font-bold mb-1 font-mono">{item.date}</p>
                                        <h3 className="text-sm font-bold text-gray-800 leading-relaxed group-hover:text-shuyukan-blue transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>
                                        {item.content && (
                                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                                {item.content}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {newsItems.length === 0 && !loading && (
                        <div className="text-center py-8 text-gray-400">
                            現在お知らせはありません
                        </div>
                    )}
                </div>
            </FadeInSection>
        </section>
    );
};

export default NewsSection;
