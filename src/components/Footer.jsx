import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-shuyukan-blue text-white pt-24 pb-12 border-t-8 border-shuyukan-gold relative overflow-hidden">
            {/* Background Pattern for Texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url(/assets/pattern_bamboo.png)', backgroundSize: '200px' }}></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row gap-16 md:gap-8 justify-between mb-20">

                    {/* Brand Section - Enhanced */}
                    <div className="md:w-1/2 space-y-8">
                        {/* Logo & Name */}
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white p-1 filter drop-shadow-lg border-2 border-shuyukan-gold/50 flex-shrink-0 aspect-square">
                                <img
                                    src="/assets/logo_shuyukan.jpg"
                                    alt="Shuyukan Logo"
                                    className="w-full h-full object-contain rounded-full"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-4xl md:text-5xl font-serif font-bold tracking-widest text-white leading-tight">
                                    修猷館
                                </span>
                                <span className="text-sm md:text-base text-shuyukan-gold uppercase tracking-[0.4em] font-light mt-2">
                                    Shuyukan Kendo Club
                                </span>
                            </div>
                        </div>

                        {/* Philosophy Text - Larger & More Prominent */}
                        <div className="relative pl-6 border-l-2 border-shuyukan-purple/50">
                            <p className="text-lg md:text-xl font-serif leading-loose text-white/90 tracking-wide font-medium">
                                <span className="block mb-2 text-shuyukan-gold">剣道を通じた人間形成。</span>
                                心身を鍛え、礼節を学び、<br />
                                生涯共に歩む仲間を作る。<br />
                                <span className="text-base text-gray-400 mt-2 block font-sans font-normal">
                                    初心者から有段者まで、随時会員募集中です。
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:w-1/2 flex flex-col md:flex-row gap-12 md:gap-20 justify-end">
                        {/* Quick Link Section */}
                        <div>
                            <h4 className="text-shuyukan-gold text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-shuyukan-gold"></span> メニュー
                            </h4>
                            <ul className="space-y-4 text-base font-medium font-serif">
                                <li><Link to="/about" className="text-gray-300 hover:text-white hover:text-shuyukan-gold transition-colors block py-1">修猷館について</Link></li>
                                <li><Link to="/practice" className="text-gray-300 hover:text-white hover:text-shuyukan-gold transition-colors block py-1">稽古日程</Link></li>
                                <li><Link to="/Teacher" className="text-gray-300 hover:text-white hover:text-shuyukan-gold transition-colors block py-1">指導者紹介</Link></li>
                                <li><Link to="/join" className="text-gray-300 hover:text-white hover:text-shuyukan-gold transition-colors block py-1">入会案内</Link></li>
                                <li><Link to="/news" className="text-gray-300 hover:text-white hover:text-shuyukan-gold transition-colors block py-1">お知らせ</Link></li>
                                <li><Link to="/faq" className="text-gray-300 hover:text-white hover:text-shuyukan-gold transition-colors block py-1">よくある質問</Link></li>
                                <li><Link to="/links" className="text-gray-300 hover:text-white hover:text-shuyukan-gold transition-colors block py-1">リンク集</Link></li>
                                <li><Link to="/character" className="text-gray-300 hover:text-white hover:text-shuyukan-gold transition-colors block py-1">キャラクター紹介</Link></li>
                            </ul>
                        </div>

                        {/* Contact Section */}
                        <div>
                            <h4 className="text-shuyukan-gold text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-shuyukan-gold"></span> お問い合わせ
                            </h4>
                            <ul className="space-y-6 text-sm text-gray-300">
                                <li>
                                    <span className="block text-white/50 mb-1 font-serif text-xs tracking-widest">道場所在地</span>
                                    <span className="font-serif text-base text-white">豊中市立熊野田小学校</span><br />
                                    〒560-0015 豊中市赤阪1丁目5-1
                                </li>
                                <li>
                                    <span className="block text-white/50 mb-1 font-serif text-xs tracking-widest">連絡先</span>
                                    <a href="mailto:shuyukan.info@gmail.com" className="font-sans text-white hover:text-shuyukan-gold transition-colors text-base">
                                        shuyukan.info@gmail.com
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.instagram.com/shuyukan.toyonaka.kumanoda/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-full hover:opacity-90 transition-opacity group">
                                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                        </svg>
                                        <span className="font-bold text-white">Instagram</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.facebook.com/people/%E8%B1%8A%E4%B8%AD%E4%BF%AE%E7%8C%B7%E9%A4%A8/100064393673892/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors group">
                                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                        </svg>
                                        <span className="font-bold text-white">Facebook</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 tracking-wider">
                    <p>
                        &copy; {currentYear} Shuyukan Kendo Club. All rights reserved. <span className="ml-4 opacity-50">v1.0.0</span>
                    </p>
                    <div className="flex space-x-8 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link>
                        <Link to="/contact" className="hover:text-white transition-colors">お問い合わせ</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
