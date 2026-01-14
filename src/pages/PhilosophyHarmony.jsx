/**
 * Philosophy: Harmony (心身の調和) Page
 * 菜根譚からの引用を含む哲学ページ
 */
import React from 'react';
import { Link } from 'react-router-dom';
import SiteFrame from '../components/SiteFrame.jsx';
import FadeInSection from '../components/FadeInSection.jsx';

export default function PhilosophyHarmony() {
    return (
        <SiteFrame title="心身の調和">
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <FadeInSection>
                    <div className="text-center mb-16">
                        <span className="text-sm font-sans tracking-[0.3em] text-shuyukan-gold uppercase">Harmony of Mind and Body</span>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-shuyukan-blue mt-4 mb-8">心身の調和</h1>
                        <p className="text-xl text-gray-600 font-serif leading-relaxed">
                            心と体を一つにする。<br />
                            静寂の中で自らを見つめる。
                        </p>
                    </div>
                </FadeInSection>

                {/* Main Quote */}
                <FadeInSection delay={200}>
                    <div className="bg-shuyukan-blue text-white p-12 rounded-lg shadow-xl mb-16">
                        <blockquote className="text-center">
                            <p className="text-2xl md:text-3xl font-serif leading-relaxed mb-6">
                                「静中に動あり、動中に静あり」
                            </p>
                            <footer className="text-shuyukan-gold">― 菜根譚</footer>
                        </blockquote>
                    </div>
                </FadeInSection>

                {/* Philosophy Content */}
                <div className="space-y-12 text-lg text-gray-700 font-serif leading-loose">
                    <FadeInSection delay={300}>
                        <section>
                            <h2 className="text-2xl font-bold text-shuyukan-blue mb-4 flex items-center gap-3">
                                <span className="text-shuyukan-gold">●</span>
                                静と動の融合
                            </h2>
                            <p>
                                剣道において、「構え」は単なる姿勢ではありません。それは心の在り方そのものです。
                                菜根譚は語ります。「忙しき中にも、のんびりと趣を楽しむ時間を持て」と。
                            </p>
                            <p className="mt-4">
                                激しい打ち合いの中にも、心の静けさを保つこと。
                                これこそが「動中の静」であり、剣道が目指す境地の一つです。
                            </p>
                        </section>
                    </FadeInSection>

                    <FadeInSection delay={400}>
                        <section className="bg-gray-50 p-8 rounded-lg border-l-4 border-shuyukan-gold">
                            <blockquote className="text-xl italic text-gray-600">
                                「心安ければ、茅屋も殿堂なり」
                            </blockquote>
                            <p className="mt-4 text-base text-gray-500">
                                心が安らかであれば、粗末な家も宮殿と同じである。
                                外部の環境ではなく、内なる心の状態が重要だという教え。
                            </p>
                        </section>
                    </FadeInSection>

                    <FadeInSection delay={500}>
                        <section>
                            <h2 className="text-2xl font-bold text-shuyukan-blue mb-4 flex items-center gap-3">
                                <span className="text-shuyukan-gold">●</span>
                                自己との対話
                            </h2>
                            <p>
                                稽古とは、竹刀を通じた自己との対話です。
                                相手と向き合う前に、まず自分と向き合う。
                                菜根譚の言葉を借りれば「己を知る者は、人を知る」のです。
                            </p>
                        </section>
                    </FadeInSection>

                    <FadeInSection delay={600}>
                        <section className="bg-shuyukan-blue/5 p-8 rounded-lg">
                            <h3 className="text-xl font-bold text-shuyukan-blue mb-4">菜根譚の教え</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-shuyukan-gold mt-1">◆</span>
                                    <span>「水清ければ月を映し、心静かなれば自づから悟る」</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-shuyukan-gold mt-1">◆</span>
                                    <span>「忍の一字は、万金に値す」</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-shuyukan-gold mt-1">◆</span>
                                    <span>「心広ければ天下も狭し、心狭ければ一室も広し」</span>
                                </li>
                            </ul>
                        </section>
                    </FadeInSection>
                </div>

                {/* Navigation */}
                <FadeInSection delay={700}>
                    <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between items-center">
                        <Link to="/" className="text-shuyukan-blue hover:text-shuyukan-gold transition-colors font-serif">
                            ← ホームに戻る
                        </Link>
                        <Link to="/philosophy/etiquette" className="text-shuyukan-blue hover:text-shuyukan-gold transition-colors font-serif">
                            礼節と伝統 →
                        </Link>
                    </div>
                </FadeInSection>
            </div>
        </SiteFrame>
    );
}
