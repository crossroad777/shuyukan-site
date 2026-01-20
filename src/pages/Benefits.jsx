/**
 * Benefits Detail Page - 剣道で育つ力
 * 親向けコンテンツの詳細ページ - リッチメディア版
 */

import React from "react";
import SiteFrame from "../components/SiteFrame.jsx";
import FadeInSection from "../components/FadeInSection.jsx";
import InstagramFeed from "../components/InstagramFeed.jsx";
import FacebookFeed from "../components/FacebookFeed.jsx";
import { Link } from "react-router-dom";

export default function Benefits() {
    return (
        <SiteFrame title="剣道で育つ力">
            {/* Hero with Video Background */}
            <section className="relative text-center mb-16 py-16 -mx-6 md:-mx-10 px-6 overflow-hidden bg-gradient-to-b from-shuyukan-blue to-shuyukan-blue/90">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[url('/images/kendo_fun_group.png')] bg-cover bg-center"></div>
                </div>
                <div className="relative z-10">
                    <FadeInSection>
                        <p className="text-shuyukan-gold font-bold tracking-widest uppercase text-sm mb-2 animate-pulse">For Parents</p>
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                            剣道で育つ、<br className="md:hidden" />3つの「楽しい」
                        </h1>
                        <p className="text-white/90 max-w-2xl mx-auto leading-relaxed text-lg">
                            子どもたちは「楽しい」から続けられる。<br />
                            修猷館が大切にしている、剣道だからこそ育まれる力。
                        </p>
                    </FadeInSection>
                </div>
            </section>

            {/* Photo Gallery Hero */}
            <section className="mb-16">
                <FadeInSection>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="aspect-square rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <img src="/images/kendo_friendship.png" alt="仲間との稽古" className="w-full h-full object-cover" />
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <img src="/images/kendo_challenge.png" alt="挑戦する姿" className="w-full h-full object-cover" />
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <img src="/images/kendo_active.png" alt="元気に稽古" className="w-full h-full object-cover" />
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <img src="/images/kendo_fun_group.png" alt="チームワーク" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </FadeInSection>
            </section>

            {/* YouTube Video Section */}
            <section className="mb-20">
                <FadeInSection>
                    <div className="text-center mb-8">
                        <p className="text-shuyukan-red font-bold tracking-widest uppercase text-sm mb-2">🎬 Movie</p>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-shuyukan-blue">
                            稽古の様子を動画で見る
                        </h2>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-shuyukan-gold/20">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                title="修猷館 稽古風景"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                        <p className="text-center text-gray-500 text-sm mt-4">
                            ※ 実際の稽古動画に差し替え予定
                        </p>
                    </div>
                </FadeInSection>
            </section>

            {/* Benefit 1: 仲間といるのが楽しい */}
            <section className="mb-20">
                <FadeInSection>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="md:flex">
                            {/* Image Side */}
                            <div className="md:w-2/5 relative overflow-hidden group">
                                <img
                                    src="/images/kendo_kids_bow.png"
                                    alt="礼をする子どもたち"
                                    className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-shuyukan-blue/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <p className="text-shuyukan-gold font-bold text-sm tracking-widest">BENEFIT 01</p>
                                    <h2 className="text-2xl md:text-3xl font-serif font-bold">仲間といるのが楽しい</h2>
                                    <p className="text-shuyukan-gold font-bold mt-1">友情・礼</p>
                                </div>
                            </div>
                            {/* Content Side */}
                            <div className="md:w-3/5 p-8 md:p-12 space-y-6">
                                <p className="text-gray-700 leading-loose text-lg">
                                    剣道は一人で強くなる競技ではありません。
                                    一緒に汗を流し、時には悔しさを分かち合い、喜びを共有する。
                                    <span className="text-shuyukan-blue font-bold">そんな仲間がいるから、子どもたちは稽古を続けられるのです。</span>
                                </p>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-xl text-center transform hover:-translate-y-2 transition-transform">
                                        <div className="text-4xl mb-2 animate-bounce">👋</div>
                                        <h4 className="font-bold text-shuyukan-blue text-sm">あいさつ</h4>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-xl text-center transform hover:-translate-y-2 transition-transform">
                                        <div className="text-4xl mb-2 animate-bounce" style={{ animationDelay: '0.1s' }}>❤️</div>
                                        <h4 className="font-bold text-shuyukan-blue text-sm">思いやり</h4>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-xl text-center transform hover:-translate-y-2 transition-transform">
                                        <div className="text-4xl mb-2 animate-bounce" style={{ animationDelay: '0.2s' }}>🙏</div>
                                        <h4 className="font-bold text-shuyukan-blue text-sm">敬意</h4>
                                    </div>
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
                        <div className="md:flex md:flex-row-reverse">
                            {/* Image Side */}
                            <div className="md:w-2/5 relative overflow-hidden group">
                                <img
                                    src="/images/kendo_achievement.png"
                                    alt="表彰される子ども"
                                    className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-shuyukan-gold/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <p className="text-white/80 font-bold text-sm tracking-widest">BENEFIT 02</p>
                                    <h2 className="text-2xl md:text-3xl font-serif font-bold">できるようになるのが楽しい</h2>
                                    <p className="text-white/80 font-bold mt-1">挑戦</p>
                                </div>
                            </div>
                            {/* Content Side */}
                            <div className="md:w-3/5 p-8 md:p-12 space-y-6">
                                <p className="text-gray-700 leading-loose text-lg">
                                    最初は竹刀を握ることもできなかった子が、少しずつ形になっていく。
                                    「できた！」という瞬間の輝く目。
                                    <span className="text-shuyukan-gold font-bold">その小さな成功体験の積み重ねが、子どもたちを成長させます。</span>
                                </p>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-yellow-50 p-4 rounded-xl text-center transform hover:-translate-y-2 transition-transform">
                                        <div className="text-4xl mb-2">💪</div>
                                        <h4 className="font-bold text-shuyukan-blue text-sm">諦めない</h4>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-xl text-center transform hover:-translate-y-2 transition-transform">
                                        <div className="text-4xl mb-2">📈</div>
                                        <h4 className="font-bold text-shuyukan-blue text-sm">成長実感</h4>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-xl text-center transform hover:-translate-y-2 transition-transform">
                                        <div className="text-4xl mb-2">🏆</div>
                                        <h4 className="font-bold text-shuyukan-blue text-sm">目標達成</h4>
                                    </div>
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
                        <div className="md:flex">
                            {/* Image Side */}
                            <div className="md:w-2/5 relative overflow-hidden group">
                                <img
                                    src="/images/kendo_active.png"
                                    alt="元気に稽古する子どもたち"
                                    className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-shuyukan-red/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <p className="text-white/80 font-bold text-sm tracking-widest">BENEFIT 03</p>
                                    <h2 className="text-2xl md:text-3xl font-serif font-bold">体を動かすのが楽しい</h2>
                                    <p className="text-white/80 font-bold mt-1">心と体</p>
                                </div>
                            </div>
                            {/* Content Side */}
                            <div className="md:w-3/5 p-8 md:p-12 space-y-6">
                                <p className="text-gray-700 leading-loose text-lg">
                                    ゲームやスマホばかりの毎日。体を動かさない生活が当たり前になっていませんか？
                                    剣道は、思いきり声を出し、全身を使って動く貴重な時間。
                                    <span className="text-shuyukan-red font-bold">心も体もスッキリして、勉強にも好影響！</span>
                                </p>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-red-50 p-4 rounded-xl text-center transform hover:-translate-y-2 transition-transform">
                                        <div className="text-4xl mb-2">🏃</div>
                                        <h4 className="font-bold text-shuyukan-blue text-sm">全身運動</h4>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-xl text-center transform hover:-translate-y-2 transition-transform">
                                        <div className="text-4xl mb-2">📣</div>
                                        <h4 className="font-bold text-shuyukan-blue text-sm">発声</h4>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-xl text-center transform hover:-translate-y-2 transition-transform">
                                        <div className="text-4xl mb-2">😊</div>
                                        <h4 className="font-bold text-shuyukan-blue text-sm">リフレッシュ</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeInSection>
            </section>

            {/* Photo Grid - More Fun Moments */}
            <section className="mb-20">
                <FadeInSection>
                    <div className="text-center mb-8">
                        <p className="text-shuyukan-gold font-bold tracking-widest uppercase text-sm mb-2">📸 Gallery</p>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-shuyukan-blue">
                            楽しい稽古の様子
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                            <img src="/images/kendo_friendship.png" alt="稽古風景1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                            <img src="/images/kendo_kids_bow.png" alt="稽古風景2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                            <img src="/images/kendo_challenge.png" alt="稽古風景3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                            <img src="/images/kendo_fun_group.png" alt="稽古風景4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                            <img src="/images/kendo_achievement.png" alt="稽古風景5" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                            <img src="/images/kendo_active.png" alt="稽古風景6" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                    </div>
                </FadeInSection>
            </section>

            {/* Instagram Feed */}
            <section className="mb-20">
                <FadeInSection>
                    <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-1">
                        <div className="bg-white rounded-xl p-8">
                            <div className="text-center mb-8">
                                <p className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500 font-bold tracking-widest uppercase text-sm mb-2">📷 Instagram</p>
                                <h2 className="text-2xl md:text-3xl font-serif font-bold text-shuyukan-blue">
                                    最新の投稿をチェック
                                </h2>
                            </div>
                            <InstagramFeed />
                        </div>
                    </div>
                </FadeInSection>
            </section>

            {/* Facebook Feed */}
            <section className="mb-20">
                <FadeInSection>
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-1">
                        <div className="bg-white rounded-xl p-8">
                            <div className="text-center mb-8">
                                <p className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-2">👍 Facebook</p>
                                <h2 className="text-2xl md:text-3xl font-serif font-bold text-shuyukan-blue">
                                    活動レポート
                                </h2>
                            </div>
                            <FacebookFeed />
                        </div>
                    </div>
                </FadeInSection>
            </section>

            {/* Parent Testimonials */}
            <section className="mb-20">
                <FadeInSection>
                    <div className="text-center mb-8">
                        <p className="text-shuyukan-gold font-bold tracking-widest uppercase text-sm mb-2">💬 Voice</p>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-shuyukan-blue">
                            保護者の声
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-shuyukan-blue rounded-full flex items-center justify-center text-white font-bold">A</div>
                                <div>
                                    <p className="font-bold text-shuyukan-blue">小3男子の母</p>
                                    <p className="text-sm text-gray-500">入会1年</p>
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                「人見知りだった息子が、今では自分から挨拶できるようになりました。仲間との絆が彼を変えてくれました。」
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-shuyukan-gold rounded-full flex items-center justify-center text-white font-bold">B</div>
                                <div>
                                    <p className="font-bold text-shuyukan-blue">小5女子の父</p>
                                    <p className="text-sm text-gray-500">入会3年</p>
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                「諦めやすかった娘が、今では何事も最後まで頑張れるように。剣道で身についた忍耐力のおかげです。」
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-shuyukan-red rounded-full flex items-center justify-center text-white font-bold">C</div>
                                <div>
                                    <p className="font-bold text-shuyukan-blue">小1男子の母</p>
                                    <p className="text-sm text-gray-500">入会半年</p>
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                「毎週の稽古をとても楽しみにしています。体を動かすことで、夜もぐっすり眠れるようになりました。」
                            </p>
                        </div>
                    </div>
                </FadeInSection>
            </section>

            {/* CTA */}
            <section className="text-center py-16 bg-gradient-to-r from-shuyukan-blue via-shuyukan-blue/95 to-shuyukan-blue text-white -mx-6 md:-mx-10 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/images/kendo_fun_group.png')] bg-cover bg-center"></div>
                </div>
                <FadeInSection>
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-4xl font-serif font-bold mb-6">
                            まずは見学・体験から
                        </h2>
                        <p className="text-white/90 mb-8 max-w-xl mx-auto text-lg">
                            百聞は一見にしかず。<br />
                            お子様が目を輝かせる瞬間を、ぜひ見に来てください。
                        </p>
                        <Link
                            to="/join"
                            className="inline-flex items-center gap-3 px-12 py-5 bg-shuyukan-red text-white font-bold text-xl rounded-full shadow-xl hover:bg-red-600 hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:scale-105 animate-pulse"
                        >
                            <span>🎯 無料体験に申し込む</span>
                        </Link>
                        <p className="text-white/60 mt-4 text-sm">
                            ※ 無理な勧誘は一切ありません
                        </p>
                    </div>
                </FadeInSection>
            </section>
        </SiteFrame>
    );
}
