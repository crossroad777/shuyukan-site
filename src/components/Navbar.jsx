import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'ホーム', en: 'HOME', path: '/' },
        { name: '修猷館について', en: 'ABOUT', path: '/about' },
        { name: '稽古日程', en: 'SCHEDULE', path: '/practice' },
        { name: '指導者', en: 'TEACHER', path: '/Teacher' },
        { name: '入会案内', en: 'JOIN US', path: '/join' },
        { name: 'お知らせ', en: 'NEWS', path: '/news' },
        { name: 'よくある質問', en: 'FAQ', path: '/faq' },
        { name: 'リンク集', en: 'LINKS', path: '/links' },
        { name: 'キャラクター', en: 'CHARACTER', path: '/character' },
        { name: 'お問い合わせ', en: 'CONTACT', path: '/contact' },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="fixed w-full z-50 bg-gradient-to-r from-shuyukan-blue to-shuyukan-dark text-white border-b border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-14 h-14 rounded-full bg-white p-0.5 group-hover:scale-105 transition-transform duration-300 border-2 border-shuyukan-gold/30">
                            <img
                                src="/assets/logo_shuyukan.jpg"
                                alt="Shuyukan Logo"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-serif text-white tracking-widest font-bold group-hover:text-shuyukan-gold transition-colors duration-300">
                                修猷館
                            </span>
                            <span className="text-[0.6rem] text-gray-400 uppercase tracking-[0.2em] font-light">
                                Shuyukan Kendo Club
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center h-full">
                        {navLinks.map((link, index) => (
                            <React.Fragment key={link.name}>
                                <Link
                                    to={link.path}
                                    className={`
                                        group relative h-full flex flex-col justify-center items-center px-3 transition-all duration-300
                                        ${location.pathname === link.path ? 'bg-white/5' : 'hover:bg-white/5'}
                                    `}
                                >
                                    <span className={`text-sm font-serif font-medium tracking-wide transition-colors ${location.pathname === link.path ? 'text-shuyukan-red' : 'text-gray-200 group-hover:text-white'}`}>
                                        {link.name}
                                    </span>
                                    <span className="text-[0.55rem] uppercase tracking-wider text-gray-400 mt-1 font-sans group-hover:text-shuyukan-red/70 transition-colors">
                                        {link.en}
                                    </span>

                                    {/* Active Indicator */}
                                    <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-shuyukan-red transition-transform duration-300 origin-left ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                                </Link>
                                {/* Vertical Divider */}
                                {index < navLinks.length - 1 && (
                                    <div className="h-4 w-[1px] bg-white/10"></div>
                                )}
                            </React.Fragment>
                        ))}

                        <div className="ml-3 pl-3 border-l border-white/10 h-10 flex items-center">
                            <Link to="/login" className="px-4 py-2 bg-shuyukan-purple text-white hover:bg-purple-800 transition-all duration-300 rounded-sm text-xs font-bold tracking-widest shadow-lg border border-white/10 whitespace-nowrap">
                                ログイン
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white focus:outline-none transition-colors"
                        >
                            <span className="sr-only">メニューを開く</span>
                            <div className="space-y-1.5">
                                <span className={`block w-8 h-0.5 bg-current transform transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                <span className={`block w-8 h-0.5 bg-current transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block w-8 h-0.5 bg-current transform transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute w-full bg-shuyukan-dark/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-4 pt-4 pb-8 space-y-1">
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
                    <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center mt-8 px-5 py-4 bg-shuyukan-purple text-white hover:bg-purple-800 transition-all rounded-sm text-sm font-bold shadow-md tracking-widest"
                    >
                        会員ログイン
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
