/**
 * Philosophy: Etiquette (礼節と伝統) Page
 * 菜根譚からの引用を含む哲学ページ
 */
import React from 'react';
import { Link } from 'react-router-dom';
import SiteFrame from '../components/SiteFrame.jsx';
import FadeInSection from '../components/FadeInSection.jsx';

export default function PhilosophyEtiquette() {
    return (
        <SiteFrame title="礼節と伝統">
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <FadeInSection>
                    <div className="text-center mb-16">
                        <span className="text-sm font-sans tracking-[0.3em] text-shuyukan-gold uppercase">Etiquette and Tradition</span>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-shuyukan-blue mt-4 mb-8">礼節と伝統</h1>
                        <p className="text-xl text-gray-600 font-serif leading-relaxed">
                            相手を敬い、己を律する。<br />
                            美しき所作は、心の表れ。
                        </p>
                    </div>
                </FadeInSection>

                {/* Main Quote */}
                <FadeInSection delay={200}>
                    <div className="bg-shuyukan-blue text-white p-12 rounded-lg shadow-xl mb-16">
                        <blockquote className="text-center">
                            <p className="text-2xl md:text-3xl font-serif leading-relaxed mb-6">
                                「処世譲一歩為高」<br />
                                <span className="text-lg text-gray-300">世を渡るには、一歩を譲るを高しとなす</span>
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
                                礼に始まり、礼に終わる
                            </h2>
                            <p>
                                剣道において「礼」は形式ではありません。
                                相手への敬意、そして自らを律する心の表れです。
                                菜根譚は教えます。「徳は事業の基なり」と。
                            </p>
                            <p className="mt-4">
                                一つ一つの礼法に心を込めることで、
                                私たちは武道の精神を日常生活にも活かすことができます。
                            </p>
                        </section>
                    </FadeInSection>

                    <FadeInSection delay={400}>
                        <section className="bg-gray-50 p-8 rounded-lg border-l-4 border-shuyukan-gold">
                            <blockquote className="text-xl italic text-gray-600">
                                「譲路は高致なり、利人は実に己を利するなり」
                            </blockquote>
                            <p className="mt-4 text-base text-gray-500">
                                道を譲ることこそ高い徳である。人を利することは、実は自分を利することである。
                                相手を立てることで、自らも高められるという教え。
                            </p>
                        </section>
                    </FadeInSection>

                    <FadeInSection delay={500}>
                        <section>
                            <h2 className="text-2xl font-bold text-shuyukan-blue mb-4 flex items-center gap-3">
                                <span className="text-shuyukan-gold">●</span>
                                伝統の継承
                            </h2>
                            <p>
                                数百年の歴史を持つ剣道。
                                その技術だけでなく、精神性もまた受け継がれてきました。
                                私たちは先人から学び、次の世代へと伝えていく責任があります。
                            </p>
                            <p className="mt-4">
                                「古人の心を知りて、今の世に生かす」
                                これが伝統を守ることの本質です。
                            </p>
                        </section>
                    </FadeInSection>

                    <FadeInSection delay={600}>
                        <section className="bg-shuyukan-blue/5 p-8 rounded-lg">
                            <h3 className="text-xl font-bold text-shuyukan-blue mb-4">菜根譚の教え</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-shuyukan-gold mt-1">◆</span>
                                    <span>「人を責むるには、含蓄あることを要す」</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-shuyukan-gold mt-1">◆</span>
                                    <span>「恩を施しては報いを求むることなかれ」</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-shuyukan-gold mt-1">◆</span>
                                    <span>「寛厚にして思いやりあれば、万物皆春なり」</span>
                                </li>
                            </ul>
                        </section>
                    </FadeInSection>
                </div>

                {/* Navigation */}
                <FadeInSection delay={700}>
                    <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between items-center">
                        <Link to="/philosophy/harmony" className="text-shuyukan-blue hover:text-shuyukan-gold transition-colors font-serif">
                            ← 心身の調和
                        </Link>
                        <Link to="/philosophy/lifelong" className="text-shuyukan-blue hover:text-shuyukan-gold transition-colors font-serif">
                            生涯剣道 →
                        </Link>
                    </div>
                </FadeInSection>
            </div>
        </SiteFrame>
    );
}
