import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const navLinks = [
    '/',
    '/about',
    '/benefits',
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

    // /benefits/:section などのサブパスも考慮
    const currentPath = location.pathname.startsWith('/benefits') ? '/benefits' : location.pathname;
    const currentIndex = navLinks.indexOf(currentPath);

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
        <div className="md:hidden">
            {/* 左ボタン（前のページへ） */}
            <button
                onClick={goToPrev}
                className="fixed left-2 top-1/2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-md text-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-white/30 active:scale-90 transition-all"
                aria-label="前のページ"
            >
                <ChevronLeft size={28} strokeWidth={2.5} />
            </button>

            {/* 右ボタン（次のページへ） */}
            <button
                onClick={goToNext}
                className="fixed right-2 top-1/2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-md text-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-white/30 active:scale-90 transition-all"
                aria-label="次のページ"
            >
                <ChevronRight size={28} strokeWidth={2.5} />
            </button>
        </div>
    );
};

export default SwipeIndicators;
