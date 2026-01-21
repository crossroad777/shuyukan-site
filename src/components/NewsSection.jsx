import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FadeInSection from './FadeInSection';
import { fetchNews } from '../services/newsService';

/**
 * 日付文字列を年月日の形式に変換
 * "2026-01-13T15:41:20.960Z" → "2026年1月13日"
 * "2026.01.15 10:30:00" → "2026年1月15日"
 */
function formatDateOnly(dateStr) {
    if (!dateStr) return '';

    // 文字列でない場合は文字列に変換して試行
    const originalStr = String(dateStr);

    try {
        // Date オブジェクトとして解析を試みる（ISO 8601 などに対応）
        const date = new Date(originalStr);
        if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${year}年${month}月${day}日`;
        }

        // 独自のパターンの抽出（YYYY.MM.DD など）
        const dateOnly = originalStr.split(' ')[0];
        const match = dateOnly.match(/(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})/);
        if (match) {
            const year = parseInt(match[1], 10);
            const month = parseInt(match[2], 10);
            const day = parseInt(match[3], 10);
            return `${year}年${month}月${day}日`;
        }
    } catch (e) {
        console.error('Date parsing error:', e);
    }

    return originalStr;
}

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
                // 固定表示（バナー用）を抽出
                const pinned = data.filter(item => item.isPinned === true || item.isPinned === "TRUE");
                setPinnedItems(pinned);

                // 「最新情報」一覧には固定・通常問わず最新の数件を表示
                // これにより、投稿が1件（固定）のみの場合でも「お知らせはありません」と表示されるのを防ぎます
                setNewsItems(data.slice(0, 6));
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
                                    {/* サムネイル画像 - 控えめなプレイスホルダー付き */}
                                    <div className="w-full bg-gray-100 overflow-hidden aspect-video flex items-center justify-center relative bg-gradient-to-br from-gray-100 to-gray-200">
                                        {item.image ? (
                                            <img
                                                src={convertDriveUrl(item.image)}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
                                                loading="lazy"
                                                onError={(e) => {
                                                    // 画像読み込みエラー時は透明にして背後のアイコンを見せる
                                                    e.target.style.opacity = '0';
                                                }}
                                            />
                                        ) : null}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="flex flex-col items-center gap-1 opacity-30">
                                                <span className="text-4xl text-shuyukan-gold">⚔️</span>
                                                <span className="text-[8px] text-shuyukan-gold font-bold tracking-widest uppercase">Shuyukan</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="inline-block bg-shuyukan-blue/5 text-shuyukan-blue text-[9px] px-1.5 py-0.5 rounded border border-shuyukan-blue/10 font-bold">
                                                {item.category}
                                            </span>
                                            {/* 控えめなNEWラベル */}
                                            {item.date && (new Date() - new Date(item.date)) / (1000 * 60 * 60 * 24) < 7 && (
                                                <span className="inline-flex items-center bg-shuyukan-red text-white text-[9px] px-2 py-0.5 rounded-sm font-bold tracking-tighter shadow-sm">
                                                    NEW
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-shuyukan-gold font-bold mb-1 font-mono opacity-80">{formatDateOnly(item.date)}</p>
                                        <h3 className="text-sm font-bold text-gray-800 leading-relaxed group-hover:text-shuyukan-blue transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>
                                        {item.content && !item.content.startsWith('http') && (
                                            <p className="text-[11px] text-gray-500 mt-2 line-clamp-2 leading-relaxed">
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
