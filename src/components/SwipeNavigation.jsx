import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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

const SwipeNavigation = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;

        const MIN_DISTANCE = 80; // Minimum distance for swipe
        const MAX_VERTICAL_DISTANCE = 100; // Ignore swipe if vertical movement is too much

        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        };

        const handleTouchEnd = (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        };

        const handleSwipe = () => {
            const distanceX = touchEndX - touchStartX;
            const distanceY = Math.abs(touchEndY - touchStartY);

            // Only process if horizontal swipe is significant and vertical movement is minimal
            if (Math.abs(distanceX) > MIN_DISTANCE && distanceY < MAX_VERTICAL_DISTANCE) {
                const currentIndex = navLinks.indexOf(location.pathname);

                // If not in navLinks (e.g. member pages), don't swipe
                if (currentIndex === -1) return;

                if (distanceX > 0) {
                    // Swipe Right -> Previous Page
                    const prevIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
                    navigate(navLinks[prevIndex]);
                } else {
                    // Swipe Left -> Next Page
                    const nextIndex = (currentIndex + 1) % navLinks.length;
                    navigate(navLinks[nextIndex]);
                }
            }
        };

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [location.pathname, navigate]);

    return <>{children}</>;
};

export default SwipeNavigation;
