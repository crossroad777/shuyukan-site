/**
 * News Page - お知らせ一覧
 * Google Sheetsから取得したニュースを表示
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteFrame from '../components/SiteFrame.jsx';
import FadeInSection from '../components/FadeInSection.jsx';
import { fetchNews } from '../services/newsService.js';

/**
 * 日付文字列を年月日の形式に変換
 */
function formatDateOnly(dateStr) {
  if (!dateStr || dateStr === 'テスト' || dateStr === 'お知らせ') return '2026年◯月◯日';
  const originalStr = String(dateStr);
  try {
    // もし日付列にカテゴリ名などが混入している場合はフォールバック
    if (!originalStr.includes('-') && !originalStr.includes('/') && !originalStr.includes('.')) {
      return '2026年◯月◯日';
    }
    const date = new Date(originalStr);
    if (!isNaN(date.getTime())) {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }
    const match = originalStr.match(/(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})/);
    if (match) {
      return `${parseInt(match[1], 10)}年${parseInt(match[2], 10)}月${parseInt(match[3], 10)}日`;
    }
  } catch (e) { }
  return '2026年◯月◯日';
}

/**
 * GoogleドライブのURLを直接表示可能なURLに変換
 */
function convertDriveUrl(url) {
  if (!url) return null;
  const strUrl = String(url);
  let fileId = null;
  if (strUrl.includes('drive.google.com')) {
    const m = strUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/) || strUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || strUrl.match(/\/uc\?id=([a-zA-Z0-9_-]+)/);
    if (m) fileId = m[1];
  }
  if (fileId) return `https://lh3.googleusercontent.com/d/${fileId}=w400`;
  return strUrl;
}

/**
 * テキスト中から最初の画像URLを抽出する
 */
function extractFirstImageUrl(text) {
  if (!text) return null;
  const match = String(text).match(/https:\/\/(drive\.google\.com|lh3\.googleusercontent\.com)\/[^\s)"]+/);
  return match ? match[0] : null;
}

/**
 * 本文（Content）から画像URLなどの不要なテキストを除去する
 */
function cleanContent(text) {
  if (!text) return '';
  // URLを除去
  return String(text)
    .replace(/https:\/\/[^\s)"]+/g, '')
    .trim();
}

export default function News() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('すべて');

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchNews();
        setNewsItems(data);
      } catch (error) {
        console.error('ニュース取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  const categories = ['すべて', ...new Set(newsItems.map(item => item.category).filter(c => c && typeof c === 'string' && c.trim() !== '' && c !== 'お知らせ'))];

  const filteredNews = selectedCategory === 'すべて'
    ? newsItems
    : newsItems.filter(item => item.category === selectedCategory);

  return (
    <SiteFrame title="お知らせ">
      <FadeInSection>
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category, index) => (
            <button
              key={`category-${category}-${index}`}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedCategory === category
                ? 'bg-shuyukan-blue text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <div className="animate-spin w-10 h-10 border-3 border-shuyukan-blue border-t-transparent rounded-full mx-auto mb-4"></div>
            読み込み中...
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNews.map((item, index) => {
              const hasLink = !!item.link && item.link !== '#';
              const rawImage = item.image || extractFirstImageUrl(item.content);
              const imageUrl = convertDriveUrl(rawImage);
              const displayContent = cleanContent(item.content);

              return (
                <Link
                  key={item.id || `news-${index}`}
                  to={hasLink ? item.link : '#'}
                  onClick={(e) => {
                    if (!hasLink && imageUrl) {
                      e.preventDefault();
                      window.open(imageUrl.replace('=w400', '=w1200'), '_blank');
                    }
                  }}
                  className={`block bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 overflow-hidden ${item.isPinned
                    ? 'border-shuyukan-red bg-red-50/50'
                    : 'border-shuyukan-gold'
                    } ${!hasLink && !imageUrl ? 'cursor-default hover:translate-y-0 hover:shadow-sm' : 'cursor-pointer'}`}
                >
                  <div className="p-6 flex flex-col md:flex-row md:items-start gap-4">
                    {imageUrl && (
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(imageUrl.replace('=w400', '=w1200'), '_blank');
                        }}
                        className="block md:w-32 w-full aspect-square md:aspect-auto md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity cursor-zoom-in group relative"
                      >
                        <img
                          src={imageUrl}
                          alt={item.title || 'ニュース画像'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.parentElement.style.display = 'none';
                          }}
                        />
                        <span className="absolute bottom-1 right-1 text-xs bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
                      </div>
                    )}

                    <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
                      <div className="md:w-28 flex-shrink-0">
                        <span className="text-sm font-mono text-shuyukan-gold font-bold">
                          {formatDateOnly(item.date)}
                        </span>
                      </div>

                      <div className="md:w-24 flex-shrink-0">
                        <span className={`inline-block text-xs px-3 py-1 rounded-full font-bold ${item.isPinned
                          ? 'bg-shuyukan-red text-white'
                          : 'bg-shuyukan-blue/10 text-shuyukan-blue'
                          }`}>
                          {item.isPinned && '📌 '}
                          {(item.category && item.category !== 'お知らせ') ? item.category : (item.date && isNaN(new Date(item.date)) ? item.date : 'お知らせ')}
                        </span>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-shuyukan-blue transition-colors">
                          {item.title && item.title !== 'お知らせ' ? item.title : '最新のお知らせ'}
                        </h3>
                        {displayContent && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {displayContent}
                          </p>
                        )}
                      </div>

                      <div className="text-gray-300 text-xl hidden md:block">
                        {hasLink ? '→' : ''}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {filteredNews.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">該当するお知らせはありません</p>
          </div>
        )}
      </FadeInSection>
    </SiteFrame>
  );
}
