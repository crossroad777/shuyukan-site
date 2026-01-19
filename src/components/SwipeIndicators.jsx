import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navLinks = [
    '/',
    '/about',
    '/practice',
    '/Teacher',
    '/join',
    '/news',
    '/faq',
    '/links',
    '/character',
    '/contact',
];

/**
 * スマホ表示時に画面端に◀▶ナビゲーションボタンを表示
 * クリックで前後のページに移動
 */
const SwipeIndicators = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const currentIndex = navLinks.indexOf(location.pathname);

    // 現在のページがnavLinksにない場合（ログインページなど）は表示しない
    if (currentIndex === -1) return null;

    const goToPrev = () => {
        const prevIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
        navigate(navLinks[prevIndex]);
    };

    const goToNext = () => {
        const nextIndex = (currentIndex + 1) % navLinks.length;
        navigate(navLinks[nextIndex]);
    };

    return (
        <>
            {/* 左ボタン（前のページへ） */}
            <button
                onClick={goToPrev}
                className="fixed left-2 top-1/2 -translate-y-1/2 z-40 md:hidden w-10 h-10 flex items-center justify-center bg-shuyukan-blue/80 text-white rounded-full shadow-lg hover:bg-shuyukan-blue active:scale-95 transition-all"
                aria-label="前のページ"
            >
                ◀
            </button>

            {/* 右ボタン（次のページへ） */}
            <button
                onClick={goToNext}
                className="fixed right-2 top-1/2 -translate-y-1/2 z-40 md:hidden w-10 h-10 flex items-center justify-center bg-shuyukan-blue/80 text-white rounded-full shadow-lg hover:bg-shuyukan-blue active:scale-95 transition-all"
                aria-label="次のページ"
            >
                ▶
            </button>
        </>
    );
};

export default SwipeIndicators;
