import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
    const { isAuthed, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'ホーム', en: 'HOME', path: '/' },
        { name: '豊中修猷館について', en: 'ABOUT', path: '/about' },
        { name: '稽古日', en: 'SCHEDULE', path: '/practice' },
        { name: '指導者', en: 'TEACHER', path: '/Teacher' },
        { name: 'ご入会', en: 'JOIN', path: '/join' },
        { name: 'お知らせ', en: 'NEWS', path: '/news' },
        { name: 'よくある質問', en: 'FAQ', path: '/faq' },
        { name: 'リンク集', en: 'LINKS', path: '/links' },
        // { name: 'キャラクター紹介', en: 'CHARACTER', path: '/character' },
        { name: 'お問い合わせ', en: 'CONTACT', path: '/contact' },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
    };

    return (
        <nav className="fixed w-full z-50 bg-gradient-to-r from-shuyukan-blue to-shuyukan-dark text-white border-b border-white/10 shadow-lg">
            <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-12">
                <div className="flex items-center h-24 gap-4 lg:gap-20">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-4 group flex-shrink-0">
                        <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white p-0.5 group-hover:scale-105 transition-transform duration-300 border-2 border-shuyukan-gold/30">
                            <img
                                src="/assets/logo_shuyukan.jpg"
                                alt="Shuyukan Logo"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl lg:text-3xl font-serif text-white tracking-widest font-bold group-hover:text-shuyukan-gold transition-colors duration-300">
                                豊中修猷館
                            </span>
                            <span className="text-[0.45rem] lg:text-[0.6rem] text-gray-400 uppercase tracking-[0.1em] font-light">
                                Toyonaka Shuyukan
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center h-full flex-grow">
                        <div className="flex h-full items-center flex-grow justify-between">
                            {navLinks.map((link, index) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`
                                        group relative h-full flex flex-col justify-center items-center px-1 xl:px-2 2xl:px-4 transition-all duration-300
                                        ${location.pathname === link.path ? 'bg-white/5' : 'hover:bg-white/5'}
                                    `}
                                >
                                    <span className={`text-[0.6rem] xl:text-[0.75rem] 2xl:text-[0.9rem] font-serif font-bold tracking-tighter transition-colors whitespace-nowrap ${location.pathname === link.path ? 'text-shuyukan-red' : 'text-gray-100 group-hover:text-white'}`}>
                                        {link.name}
                                    </span>
                                    <span className="text-[0.3rem] xl:text-[0.4rem] 2xl:text-[0.55rem] uppercase tracking-tighter text-gray-400 mt-0.5 font-sans group-hover:text-shuyukan-red/70 transition-colors">
                                        {link.en}
                                    </span>

                                    {/* Active Indicator */}
                                    <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-shuyukan-red transition-transform duration-300 origin-left ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                                </Link>
                            ))}
                        </div>

                        {/* Login/Portal Button pushed to the far right */}
                        <div className="ml-2 xl:ml-4 pl-2 xl:pl-4 border-l border-white/10 h-12 flex items-center gap-2 flex-shrink-0">
                            {isAuthed ? (
                                <>
                                    {isAdmin && (
                                        <span className="flex items-center gap-1 bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-1 rounded text-[0.6rem] xl:text-[0.7rem] font-bold tracking-tight whitespace-nowrap">
                                            <span className="text-xs">🛡️</span> 管理者
                                        </span>
                                    )}
                                    <Link to="/member" className="px-3 xl:px-5 py-2 xl:py-3 bg-shuyukan-blue text-white hover:bg-blue-800 transition-all duration-300 rounded-sm text-[0.65rem] xl:text-xs 2xl:text-sm font-bold tracking-wider shadow-lg border border-white/10 whitespace-nowrap">
                                        マイページ
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="px-3 xl:px-5 py-2 xl:py-3 bg-transparent text-gray-300 hover:text-white transition-all duration-300 rounded-sm text-[0.65rem] xl:text-xs 2xl:text-sm font-bold whitespace-nowrap border border-white/20"
                                    >
                                        ログアウト
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="px-3 xl:px-5 py-2 xl:py-3 bg-shuyukan-purple text-white hover:bg-purple-800 transition-all duration-300 rounded-sm text-[0.65rem] xl:text-xs 2xl:text-sm font-bold tracking-wider shadow-lg border border-white/10 whitespace-nowrap">
                                    ログイン
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button & Portal Link */}
                    <div className="flex lg:hidden items-center gap-2">
                        {isAuthed ? (
                            <Link
                                to="/member"
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-1.5 bg-shuyukan-blue text-white rounded-sm text-[0.65rem] font-bold shadow-md border border-white/10"
                            >
                                マイページ
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-1.5 bg-shuyukan-purple text-white rounded-sm text-[0.65rem] font-bold shadow-md border border-white/10"
                            >
                                会員登録・ログイン
                            </Link>
                        )}
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white focus:outline-none transition-colors"
                        >
                            <span className="sr-only">メニューを開く</span>
                            <div className="space-y-1.5">
                                <span className={`block w-8 h-0.5 bg-white transform transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                <span className={`block w-8 h-0.5 bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block w-8 h-0.5 bg-white transform transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className={`lg:hidden absolute top-full left-0 w-full bg-shuyukan-dark/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[85vh] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-4 pt-4 pb-24 space-y-1">
                    <div className="pb-4 border-b border-white/10">
                        {isAuthed ? (
                            <div className="grid grid-cols-2 gap-2">
                                {isAdmin && (
                                    <div className="col-span-2 flex justify-center mb-2">
                                        <span className="flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
                                            🛡️ 管理者権限でログイン中
                                        </span>
                                    </div>
                                )}
                                <Link
                                    to="/member"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center px-4 py-3 bg-shuyukan-blue text-white rounded-sm text-sm font-bold shadow-md"
                                >
                                    マイページ
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block text-center px-4 py-3 bg-gray-700 text-white rounded-sm text-sm font-bold shadow-md"
                                >
                                    ログアウト
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-center px-5 py-4 bg-shuyukan-purple text-white hover:bg-purple-800 transition-all rounded-sm text-sm font-bold shadow-md tracking-widest"
                            >
                                会員ログイン
                            </Link>
                        )}
                    </div>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-4 border-b border-white/5 group
                                ${location.pathname === link.path
                                    ? 'bg-white/5'
                                    : 'hover:bg-white/5'}
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <span className={`text-lg font-serif ${location.pathname === link.path ? 'text-shuyukan-red' : 'text-gray-200'}`}>{link.name}</span>
                                <span className="text-xs text-gray-400 uppercase tracking-widest">{link.en}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
