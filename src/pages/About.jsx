import React from 'react';
import { Link } from 'react-router-dom';
import SiteFrame from '../components/SiteFrame.jsx';
import FadeInSection from '../components/FadeInSection.jsx';

export default function About() {
    return (
        <SiteFrame title="">
            {/* Hero Section */}
            <div className="relative -mx-6 md:-mx-10 -mt-6 md:-mt-10 mb-16 overflow-hidden">
                <div className="absolute inset-0 bg-shuyukan-blue/80 mix-blend-multiply z-10"></div>
                <img
                    src="/assets/zanshin/hero_bg.png"
                    alt="Shuyukan Philosophy"
                    className="w-full h-[500px] object-cover object-center"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4 text-white">
                    <FadeInSection>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 tracking-widest text-shadow-lg">
                            豊中修猷館について
                        </h2>
                        <p className="text-xl md:text-2xl font-serif font-medium leading-relaxed tracking-wider">
                            心・技・体を磨き、<br />
                            人としての成長を目指す場所。
                        </p>
                    </FadeInSection>
                </div>
            </div>

            <div className="max-w-5xl mx-auto space-y-24">

                {/* Section 1: The 3 Principles (Merits) */}
                <section>
                    <div className="text-center mb-16">
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-shuyukan-blue mb-4">
                            豊中修猷館の三つの柱
                        </h3>
                        <div className="w-20 h-1 bg-shuyukan-gold mx-auto rounded-full"></div>
                        <p className="mt-6 text-gray-600 leading-relaxed max-w-2xl mx-auto text-left sm:text-center">
                            私たちが大切にしている3つの理念。<br className="hidden sm:inline" />
                            これらは剣道の技術向上だけでなく、<br className="hidden sm:inline" />
                            人生を豊かにするための指針です。
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Principle 1 */}
                        <FadeInSection>
                            <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                                <div className="w-full md:w-1/3 flex justify-center">
                                    <div className="w-32 h-32 rounded-full bg-shuyukan-blue text-white flex items-center justify-center text-4xl font-serif border-4 border-double border-shuyukan-gold">
                                        和
                                    </div>
                                </div>
                                <div className="w-full md:w-2/3">
                                    <h4 className="text-xl font-bold text-shuyukan-blue mb-2 font-serif">心身の調和 (Harmony)</h4>
                                    <p className="text-gray-600 leading-loose">
                                        剣道は「気・剣・体」の一致を求めます。心の動きと体の動きを調和させることで、日常生活においてもブレない軸を作ります。ストレス社会といわれる現代において、自分自身を見つめ直し、心を整える時間はかけがえのない財産となります。
                                    </p>
                                </div>
                            </div>
                        </FadeInSection>

                        {/* Principle 2 */}
                        <FadeInSection delay={200}>
                            <div className="flex flex-col md:flex-row-reverse gap-8 items-center bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                                <div className="w-full md:w-1/3 flex justify-center">
                                    <div className="w-32 h-32 rounded-full bg-white text-shuyukan-blue flex items-center justify-center text-4xl font-serif border-4 border-shuyukan-blue shadow-lg">
                                        礼
                                    </div>
                                </div>
                                <div className="w-full md:w-2/3">
                                    <h4 className="text-xl font-bold text-shuyukan-blue mb-2 font-serif">礼節と伝統 (Tradition)</h4>
                                    <p className="text-gray-600 leading-loose">
                                        「礼に始まり、礼に終わる」。相手を敬い、感謝する心は、人間関係の基本です。豊中修猷館では、伝統的な作法を通じて、自然と美しい所作や相手を思いやる心が身につくよう指導しています。これは学校や職場、社会生活のあらゆる場面で信頼される力となります。
                                    </p>
                                </div>
                            </div>
                        </FadeInSection>

                        {/* Principle 3 */}
                        <FadeInSection delay={400}>
                            <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                                <div className="w-full md:w-1/3 flex justify-center">
                                    <div className="w-32 h-32 rounded-full bg-shuyukan-gold text-white flex items-center justify-center text-4xl font-serif border-4 border-white shadow-md">
                                        道
                                    </div>
                                </div>
                                <div className="w-full md:w-2/3">
                                    <h4 className="text-xl font-bold text-shuyukan-blue mb-2 font-serif">生涯剣道 (Lifelong Kendo)</h4>
                                    <p className="text-gray-600 leading-loose">
                                        剣道に引退はありません。子供から大人、シニアまで、年齢や体力に応じた稽古が可能です。
                                        世代を超えた仲間との交流は、人生を豊かに彩ります。目標を持ち、昨日の自分を超えていく喜びを、私たちと一緒に味わいましょう。
                                    </p>
                                </div>
                            </div>
                        </FadeInSection>
                    </div>
                </section>

                {/* Section 2: Message to Parents */}
                <section className="bg-stone-50 rounded-3xl p-8 md:p-12 border border-stone-100">
                    <FadeInSection>
                        <div className="text-center mb-12">
                            <span className="text-shuyukan-red font-bold tracking-widest uppercase text-sm">For Parents</span>
                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mt-2 mb-6">
                                保護者の皆様へ
                            </h3>
                            <p className="text-stone-600 font-medium max-w-2xl mx-auto text-sm sm:text-base text-left sm:text-center">
                                大切なお子様をお預かりする以上、私たちは何よりも「安全」と「信頼」を最優先に考え、日々の稽古に取り組んでいます。
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                            {/* Safety */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-shuyukan-red">
                                <h4 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                                    <span className="text-2xl">🛡️</span> 安全への取り組み
                                </h4>
                                <ul className="space-y-4 text-sm text-stone-600 leading-relaxed">
                                    <li>
                                        <span className="font-bold block text-stone-700">段階的な指導プログラム</span>
                                        いきなり防具をつけて打ち合うことはありません。基礎を徹底し、体ができてから徐々にステップアップします。
                                    </li>
                                    <li>
                                        <span className="font-bold block text-stone-700">スポーツ安全保険への加入</span>
                                        万が一の怪我や事故に備え、加入を義務付けています。往復中の事故も補償対象となります。
                                    </li>
                                </ul>
                            </div>

                            {/* Trust */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-shuyukan-gold">
                                <h4 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                                    <span className="text-2xl">🤝</span> 指導方針と信頼
                                </h4>
                                <ul className="space-y-4 text-sm text-stone-600 leading-relaxed">
                                    <li>
                                        <span className="font-bold block text-stone-700">公的団体との連携</span>
                                        「豊中市剣道協会」および「大阪府剣道連盟」の指針に則り、適正な運営を行っています。
                                    </li>
                                    <li>
                                        <span className="font-bold block text-stone-700">地域に根ざした活動</span>
                                        学校や学年の枠を超えた仲間との交流は、お子様の社会性を大きく広げます。
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </FadeInSection>
                </section>

                {/* CTA Section */}
                <section className="text-center py-10">
                    <FadeInSection>
                        <h3 className="text-2xl font-serif font-bold text-shuyukan-blue mb-6">未来への約束</h3>
                        <p className="text-gray-600 leading-loose mb-10 max-w-3xl mx-auto text-left sm:text-center">
                            お子様が大人になった時、<br className="hidden sm:inline" />
                            「豊中修猷館で剣道をやっていてよかった」と思える場所であり続けます。
                        </p>
                        <Link to="/join" className="group inline-flex items-center gap-3 px-8 py-4 bg-shuyukan-red text-white font-bold text-base rounded-full shadow-lg hover:bg-red-700 hover:shadow-xl transition-all transform hover:-translate-y-1 tracking-wider">
                            <span>体験入会・見学申込</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </FadeInSection>
                </section>

            </div>
        </SiteFrame>
    );
}
