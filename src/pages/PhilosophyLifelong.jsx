/**
 * Philosophy: Lifelong (生涯剣道) Page
 * 菜根譚からの引用を含む哲学ページ
 */
import React from 'react';
import { Link } from 'react-router-dom';
import SiteFrame from '../components/SiteFrame.jsx';
import FadeInSection from '../components/FadeInSection.jsx';

export default function PhilosophyLifelong() {
    return (
        <SiteFrame title="生涯剣道">
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <FadeInSection>
                    <div className="text-center mb-16">
                        <span className="text-sm font-sans tracking-[0.3em] text-shuyukan-gold uppercase">Lifelong Kendo</span>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-shuyukan-blue mt-4 mb-8">生涯剣道</h1>
                        <p className="text-xl text-gray-600 font-serif leading-relaxed">
                            終わりなき道を歩む。<br />
                            昨日の自分を超え続ける。
                        </p>
                    </div>
                </FadeInSection>

                {/* Main Quote */}
                <FadeInSection delay={200}>
                    <div className="bg-shuyukan-blue text-white p-12 rounded-lg shadow-xl mb-16">
                        <blockquote className="text-center">
                            <p className="text-2xl md:text-3xl font-serif leading-relaxed mb-6">
                                「日々新たに、日に日に新たに」
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
                                終わりなき道
                            </h2>
                            <p>
                                剣道には「完成」がありません。
                                八段の先生も、初心者の子どもも、同じ道の上を歩んでいます。
                                菜根譚は語ります。「学ぶに如くはなし」と。
                            </p>
                            <p className="mt-4">
                                年齢を重ねても、体力が衰えても、
                                心の修行に終わりはありません。
                                これが「生涯剣道」の意味するところです。
                            </p>
                        </section>
                    </FadeInSection>

                    <FadeInSection delay={400}>
                        <section className="bg-gray-50 p-8 rounded-lg border-l-4 border-shuyukan-gold">
                            <blockquote className="text-xl italic text-gray-600">
                                「人生は朝露のごとし、されど道を楽しむ」
                            </blockquote>
                            <p className="mt-4 text-base text-gray-500">
                                人生は短く儚いものだからこそ、
                                道を歩むこと自体を楽しむべきである。
                                結果ではなく、過程を大切にするという教え。
                            </p>
                        </section>
                    </FadeInSection>

                    <FadeInSection delay={500}>
                        <section>
                            <h2 className="text-2xl font-bold text-shuyukan-blue mb-4 flex items-center gap-3">
                                <span className="text-shuyukan-gold">●</span>
                                共に歩む仲間
                            </h2>
                            <p>
                                生涯剣道の道は、決して孤独ではありません。
                                同じ志を持つ仲間と共に汗を流し、励まし合い、成長していく。
                                修猷館は、そんな「道場」であり続けたいと願っています。
                            </p>
                            <p className="mt-4">
                                子どもから大人まで、初心者から有段者まで。
                                すべての人が自分のペースで歩める場所。
                                それが私たちの目指す道場です。
                            </p>
                        </section>
                    </FadeInSection>

                    <FadeInSection delay={600}>
                        <section className="bg-shuyukan-blue/5 p-8 rounded-lg">
                            <h3 className="text-xl font-bold text-shuyukan-blue mb-4">菜根譚の教え</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-shuyukan-gold mt-1">◆</span>
                                    <span>「老いて益々壮んなるべし」</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-shuyukan-gold mt-1">◆</span>
                                    <span>「志あれば事竟に成る」</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-shuyukan-gold mt-1">◆</span>
                                    <span>「歩を進むれば、景は自づから変わる」</span>
                                </li>
                            </ul>
                        </section>
                    </FadeInSection>

                    {/* Call to Action */}
                    <FadeInSection delay={700}>
                        <section className="text-center bg-shuyukan-gold/10 p-12 rounded-lg border border-shuyukan-gold/30">
                            <h3 className="text-2xl font-bold text-shuyukan-blue mb-4">一緒に歩みませんか？</h3>
                            <p className="text-gray-600 mb-6">
                                修猷館では、随時見学・体験を受け付けています。
                            </p>
                            <Link
                                to="/join"
                                className="inline-block px-8 py-3 bg-shuyukan-blue text-white rounded hover:bg-shuyukan-blue/90 transition-colors font-bold"
                            >
                                入会案内を見る
                            </Link>
                        </section>
                    </FadeInSection>
                </div>

                {/* Navigation */}
                <FadeInSection delay={800}>
                    <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between items-center">
                        <Link to="/philosophy/etiquette" className="text-shuyukan-blue hover:text-shuyukan-gold transition-colors font-serif">
                            ← 礼節と伝統
                        </Link>
                        <Link to="/" className="text-shuyukan-blue hover:text-shuyukan-gold transition-colors font-serif">
                            ホームに戻る →
                        </Link>
                    </div>
                </FadeInSection>
            </div>
        </SiteFrame>
    );
}
