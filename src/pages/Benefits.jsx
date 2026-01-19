/**
 * Benefits Detail Page - 剣道で育つ力
 * 親向けコンテンツの詳細ページ
 */

import React from "react";
import SiteFrame from "../components/SiteFrame.jsx";
import FadeInSection from "../components/FadeInSection.jsx";
import { Link } from "react-router-dom";

export default function Benefits() {
    return (
        <SiteFrame title="剣道で育つ力">
            {/* Hero */}
            <section className="text-center mb-16">
                <FadeInSection>
                    <p className="text-shuyukan-gold font-bold tracking-widest uppercase text-sm mb-2">For Parents</p>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-shuyukan-blue mb-6">
                        なぜ今、剣道なのか
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-left sm:text-center">
                        デジタル時代だからこそ、子どもたちには「本物の体験」が必要です。<br className="hidden sm:inline" />
                        剣道は、スポーツを超えた人間教育の場。<br className="hidden sm:inline" />
                        お子様の一一生を支える力が、ここで育まれます。
                    </p>
                </FadeInSection>
            </section>

            {/* Benefit 1: 仲間といるのが楽しい */}
            <section className="mb-20">
                <FadeInSection>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="bg-shuyukan-blue text-white p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-5xl">🤝</span>
                                <div>
                                    <p className="text-shuyukan-gold font-bold text-sm tracking-widest">BENEFIT 01</p>
                                    <h2 className="text-2xl md:text-3xl font-serif font-bold">仲間といるのが楽しい</h2>
                                </div>
                            </div>
                            <p className="text-shuyukan-gold font-bold">友情・礼</p>
                        </div>
                        <div className="p-8 md:p-12 space-y-6">
                            <p className="text-gray-700 leading-loose text-left">
                                剣道は一人で強くなる競技ではありません。<br className="hidden sm:inline" />
                                一緒に汗を流し、時には悔しさを分かち合い、喜びを共有する。<br className="hidden sm:inline" />
                                そんな仲間がいるから、子どもたちは稽古を続けられるのです。
                            </p>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-blue-50 p-6 rounded-xl text-center">
                                    <div className="text-3xl mb-2">👋</div>
                                    <h4 className="font-bold text-shuyukan-blue mb-2">あいさつができる</h4>
                                    <p className="text-sm text-gray-600">
                                        道場に入る時、稽古の始めと終わり。自然と声が出るようになります。
                                    </p>
                                </div>
                                <div className="bg-blue-50 p-6 rounded-xl text-center">
                                    <div className="text-3xl mb-2">❤️</div>
                                    <h4 className="font-bold text-shuyukan-blue mb-2">仲間を大切にする</h4>
                                    <p className="text-sm text-gray-600">
                                        学校や学年を超えた仲間との絆。社会に出ても続く人間関係の基礎に。
                                    </p>
                                </div>
                                <div className="bg-blue-50 p-6 rounded-xl text-center">
                                    <div className="text-3xl mb-2">🙏</div>
                                    <h4 className="font-bold text-shuyukan-blue mb-2">相手を敬う</h4>
                                    <p className="text-sm text-gray-600">
                                        勝っても負けても礼をする。勝敗を超えた尊敬の心が育ちます。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeInSection>
            </section>

            {/* Benefit 2: できるようになるのが楽しい */}
            <section className="mb-20">
                <FadeInSection>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="bg-shuyukan-gold text-white p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-5xl">🎯</span>
                                <div>
                                    <p className="text-white/80 font-bold text-sm tracking-widest">BENEFIT 02</p>
                                    <h2 className="text-2xl md:text-3xl font-serif font-bold">できるようになるのが楽しい</h2>
                                </div>
                            </div>
                            <p className="text-white/80 font-bold">挑戦</p>
                        </div>
                        <div className="p-8 md:p-12 space-y-6">
                            <p className="text-gray-700 leading-loose text-left">
                                最初は竹刀を握ることもできなかった子が、少しずつ形になっていく。<br className="hidden sm:inline" />
                                「できた！」という瞬間の輝く目。<br className="hidden sm:inline" />
                                その小さな成功体験の積み重ねが、子どもたちを成長させます。
                            </p>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-yellow-50 p-6 rounded-xl text-center">
                                    <div className="text-3xl mb-2">💪</div>
                                    <h4 className="font-bold text-shuyukan-blue mb-2">諦めない心</h4>
                                    <p className="text-sm text-gray-600">
                                        うまくいかなくても、何度でも挑戦する。その姿勢が身につきます。
                                    </p>
                                </div>
                                <div className="bg-yellow-50 p-6 rounded-xl text-center">
                                    <div className="text-3xl mb-2">📈</div>
                                    <h4 className="font-bold text-shuyukan-blue mb-2">成長の実感</h4>
                                    <p className="text-sm text-gray-600">
                                        昨日できなかったことが今日できる。自分の成長を日々感じられます。
                                    </p>
                                </div>
                                <div className="bg-yellow-50 p-6 rounded-xl text-center">
                                    <div className="text-3xl mb-2">🏆</div>
                                    <h4 className="font-bold text-shuyukan-blue mb-2">目標を持つ</h4>
                                    <p className="text-sm text-gray-600">
                                        次の級、次の試合。目標に向かって努力する習慣が身につきます。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeInSection>
            </section>

            {/* Benefit 3: 体を動かすのが楽しい */}
            <section className="mb-20">
                <FadeInSection>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="bg-shuyukan-red text-white p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-5xl">💪</span>
                                <div>
                                    <p className="text-white/80 font-bold text-sm tracking-widest">BENEFIT 03</p>
                                    <h2 className="text-2xl md:text-3xl font-serif font-bold">体を動かすのが楽しい</h2>
                                </div>
                            </div>
                            <p className="text-white/80 font-bold">心と体</p>
                        </div>
                        <div className="p-8 md:p-12 space-y-6">
                            <p className="text-gray-700 leading-loose text-left">
                                ゲームやスマホばかりの毎日。体を動かさない生活が当たり前になっていませんか？<br className="hidden sm:inline" />
                                剣道は、思いきり声を出し、全身を使って動く貴重な時間。<br className="hidden sm:inline" />
                                心も体もスッキリして、勉強にも好影響を与えます。
                            </p>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-red-50 p-6 rounded-xl text-center">
                                    <div className="text-3xl mb-2">🏃</div>
                                    <h4 className="font-bold text-shuyukan-blue mb-2">思いきり動く</h4>
                                    <p className="text-sm text-gray-600">
                                        飛んだり、踏み込んだり。全身運動で体力と運動能力が向上します。
                                    </p>
                                </div>
                                <div className="bg-red-50 p-6 rounded-xl text-center">
                                    <div className="text-3xl mb-2">📣</div>
                                    <h4 className="font-bold text-shuyukan-blue mb-2">大きな声を出す</h4>
                                    <p className="text-sm text-gray-600">
                                        気合いを込めて声を出すことで、ストレス発散と自己表現力が育ちます。
                                    </p>
                                </div>
                                <div className="bg-red-50 p-6 rounded-xl text-center">
                                    <div className="text-3xl mb-2">😊</div>
                                    <h4 className="font-bold text-shuyukan-blue mb-2">心身リフレッシュ</h4>
                                    <p className="text-sm text-gray-600">
                                        稽古後の爽快感。心も体もスッキリして、メリハリのある生活に。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeInSection>
            </section>

            {/* CTA */}
            <section className="text-center py-16 bg-gradient-to-r from-shuyukan-blue to-shuyukan-blue/90 text-white -mx-6 md:-mx-10 px-6">
                <FadeInSection>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">
                        まずは見学・体験から
                    </h2>
                    <p className="text-white/80 mb-8 max-w-xl mx-auto">
                        百聞は一見にしかず。<br />
                        お子様が目を輝かせる瞬間を、ぜひ見に来てください。
                    </p>
                    <Link
                        to="/join"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-shuyukan-red text-white font-bold text-lg rounded-full shadow-xl hover:bg-red-700 hover:shadow-2xl transition-all transform hover:-translate-y-1"
                    >
                        <span>無料体験に申し込む</span>
                        <span>→</span>
                    </Link>
                </FadeInSection>
            </section>
        </SiteFrame>
    );
}
