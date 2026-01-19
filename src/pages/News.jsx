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
 * 日付文字列を月日のみの形式に変換
 */
function formatDateOnly(dateStr) {
  if (!dateStr) return '';
  const originalStr = String(dateStr);
  try {
    const date = new Date(originalStr);
    if (!isNaN(date.getTime())) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
    const dateOnly = originalStr.split(' ')[0];
    const match = dateOnly.match(/(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})/);
    if (match) {
      return `${parseInt(match[2], 10)}/${parseInt(match[3], 10)}`;
    }
  } catch (e) { }
  return originalStr;
}

/**
 * GoogleドライブのURLを直接表示可能なURLに変換
 */
function convertDriveUrl(url) {
  if (!url) return null;

  // Googleドライブの各種URL形式に対応
  // 形式1: https://drive.google.com/open?id=FILE_ID
  // 形式2: https://drive.google.com/file/d/FILE_ID/view
  // 形式3: https://drive.google.com/uc?id=FILE_ID

  let fileId = null;

  if (url.includes('drive.google.com')) {
    // open?id= 形式
    const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (openMatch) {
      fileId = openMatch[1];
    }

    // /file/d/FILE_ID/ 形式
    const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) {
      fileId = fileMatch[1];
    }

    // uc?id= 形式（既に直接リンク）
    const ucMatch = url.match(/\/uc\?id=([a-zA-Z0-9_-]+)/);
    if (ucMatch) {
      fileId = ucMatch[1];
    }
  }

  if (fileId) {
    // サムネイルURL形式を使用（CORS回避）
    return `https://lh3.googleusercontent.com/d/${fileId}=w400`;
  }

  // その他のURL（外部画像など）はそのまま返す
  return url;
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

  // カテゴリ一覧を取得
  const categories = ['すべて', ...new Set(newsItems.map(item => item.category))];

  // フィルタリング
  const filteredNews = selectedCategory === 'すべて'
    ? newsItems
    : newsItems.filter(item => item.category === selectedCategory);

  return (
    <SiteFrame title="お知らせ">
      <FadeInSection>
        {/* カテゴリフィルター */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
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

        {/* ニュース一覧 */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <div className="animate-spin w-10 h-10 border-3 border-shuyukan-blue border-t-transparent rounded-full mx-auto mb-4"></div>
            読み込み中...
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNews.map((item) => (
              <Link
                key={item.id}
                to={item.link || '#'}
                className={`block bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 overflow-hidden ${item.isPinned
                  ? 'border-shuyukan-red bg-red-50/50'
                  : 'border-shuyukan-gold'
                  }`}
              >
                <div className="p-6 flex flex-col md:flex-row md:items-start gap-4">
                  {/* サムネイル画像 */}
                  {item.image && convertDriveUrl(item.image) && (
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(convertDriveUrl(item.image).replace('=w400', '=w1200'), '_blank');
                      }}
                      className="block md:w-32 w-full flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity cursor-zoom-in group relative"
                    >
                      <img
                        src={convertDriveUrl(item.image)}
                        alt={item.title}
                        className="w-full h-auto object-contain max-h-48 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.parentElement.style.display = 'none';
                        }}
                      />
                      <span className="absolute bottom-1 right-1 text-xs bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
                    </div>
                  )}

                  {/* 日付 */}
                  <div className="md:w-24 flex-shrink-0">
                    <span className="text-sm font-mono text-shuyukan-gold font-bold">
                      {formatDateOnly(item.date)}
                    </span>
                  </div>

                  {/* カテゴリ */}
                  <div className="md:w-24 flex-shrink-0">
                    <span className={`inline-block text-xs px-3 py-1 rounded-full font-bold ${item.isPinned
                      ? 'bg-shuyukan-red text-white'
                      : 'bg-shuyukan-blue/10 text-shuyukan-blue'
                      }`}>
                      {item.isPinned && '📌 '}
                      {item.category}
                    </span>
                  </div>

                  {/* タイトルと内容 */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-shuyukan-blue transition-colors">
                      {item.title}
                    </h3>
                    {item.content && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {item.content}
                      </p>
                    )}
                  </div>

                  {/* 矢印 */}
                  <div className="text-gray-300 text-xl hidden md:block">
                    →
                  </div>
                </div>
              </Link>
            ))}
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
