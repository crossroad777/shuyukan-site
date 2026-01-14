/**
 * Character Page - Shuyukan Image Characters
 * イメージキャラクター紹介ページ
 */
import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const Character = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-shuyukan-dark via-shuyukan-blue to-shuyukan-dark">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url(/src/assets/pattern_bamboo.png)', backgroundSize: '200px' }}></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    {/* Page Title */}
                    <div className="text-center mb-16 animate-fade-in">
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 tracking-wider">
                            キャラクター
                        </h1>
                        <p className="text-xl text-shuyukan-gold font-serif tracking-widest uppercase">
                            Image Characters
                        </p>
                        <div className="mt-6 w-24 h-1 bg-gradient-to-r from-transparent via-shuyukan-gold to-transparent mx-auto"></div>
                        <p className="mt-8 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            修猷館のイメージキャラクターをご紹介します。<br />
                            彼らと一緒に剣道の道を楽しみましょう！
                        </p>
                    </div>

                    {/* Characters Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Character 1 - Tetta */}
                        <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-shuyukan-gold/50 transition-all duration-500 shadow-2xl hover:shadow-shuyukan-gold/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative p-6">
                                <img
                                    src="/src/assets/character_tetta.jpg"
                                    alt="五十嵐 鉄太 (IGARASHI TETTA)"
                                    className="w-full rounded-xl shadow-lg transform group-hover:scale-[1.02] transition-transform duration-500"
                                />
                                <div className="mt-6 text-center">
                                    <h2 className="text-2xl font-serif font-bold text-white mb-2">
                                        五十嵐 鉄太
                                    </h2>
                                    <p className="text-shuyukan-gold text-sm tracking-widest uppercase mb-3">
                                        IGARASHI TETTA
                                    </p>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        修猷館の広報担当。<br />
                                        穏やかでポジティブ、日々研鑽に取り組む剣士。
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Character 2 - Yomo */}
                        <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-shuyukan-gold/50 transition-all duration-500 shadow-2xl hover:shadow-shuyukan-gold/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative p-6">
                                <img
                                    src="/src/assets/character_yomo.jpg"
                                    alt="ヨモ (YOMO)"
                                    className="w-full rounded-xl shadow-lg transform group-hover:scale-[1.02] transition-transform duration-500"
                                />
                                <div className="mt-6 text-center">
                                    <h2 className="text-2xl font-serif font-bold text-white mb-2">
                                        ヨモ
                                    </h2>
                                    <p className="text-shuyukan-gold text-sm tracking-widest uppercase mb-3">
                                        YOMO
                                    </p>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        知恵袋猫 / 生活・精神アドバイザー。<br />
                                        優しく、容赦ない。見抜くが、責めない。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message Section */}
                    <div className="mt-16 text-center">
                        <div className="inline-block bg-gradient-to-r from-shuyukan-gold/20 via-shuyukan-gold/10 to-shuyukan-gold/20 px-8 py-6 rounded-xl border border-shuyukan-gold/30">
                            <p className="text-xl font-serif text-white leading-relaxed">
                                「<span className="text-shuyukan-gold">生産性・集中力・判断力</span>の"土台"としての身体を整える」
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Character;
