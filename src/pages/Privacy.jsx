/**
 * Privacy Policy Page - プライバシーポリシー
 * 豊中修猷館剣道部の個人情報保護方針
 */
import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-shuyukan-dark via-shuyukan-blue to-shuyukan-dark">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url(/assets/pattern_bamboo.png)', backgroundSize: '200px' }}></div>

                <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
                    {/* Page Title */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 tracking-wider">
                            プライバシーポリシー
                        </h1>
                        <p className="text-lg text-shuyukan-gold font-serif tracking-widest uppercase">
                            Privacy Policy
                        </p>
                        <div className="mt-6 w-24 h-1 bg-gradient-to-r from-transparent via-shuyukan-gold to-transparent mx-auto"></div>
                    </div>

                    {/* Content */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 border border-white/20">
                        <div className="prose prose-lg max-w-none text-gray-700">

                            <section className="mb-10">
                                <h2 className="text-2xl font-serif font-bold text-shuyukan-blue mb-4 pb-2 border-b-2 border-shuyukan-gold/30">
                                    1. 基本方針
                                </h2>
                                <p className="leading-relaxed">
                                    豊中修猷館剣道部（以下「当会」）は、会員および関係者の個人情報の重要性を認識し、
                                    個人情報の保護に関する法律その他の関連法令を遵守し、
                                    適正な取り扱いおよび保護に努めます。
                                </p>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-serif font-bold text-shuyukan-blue mb-4 pb-2 border-b-2 border-shuyukan-gold/30">
                                    2. 収集する情報
                                </h2>
                                <p className="leading-relaxed mb-4">
                                    当会では、以下の情報を収集することがあります：
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>氏名、住所、電話番号、メールアドレス</li>
                                    <li>生年月日、年齢</li>
                                    <li>保護者情報（未成年の場合）</li>
                                    <li>剣道経験・段位等の情報</li>
                                    <li>緊急連絡先</li>
                                    <li>写真・動画（稽古風景、イベント等）</li>
                                </ul>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-serif font-bold text-shuyukan-blue mb-4 pb-2 border-b-2 border-shuyukan-gold/30">
                                    3. 利用目的
                                </h2>
                                <p className="leading-relaxed mb-4">
                                    収集した個人情報は、以下の目的で利用いたします：
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>会員管理および連絡事項のお知らせ</li>
                                    <li>稽古・試合・イベント等の運営</li>
                                    <li>剣道連盟等への登録手続き</li>
                                    <li>緊急時の連絡</li>
                                    <li>当会ウェブサイト・SNS等での活動報告</li>
                                </ul>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-serif font-bold text-shuyukan-blue mb-4 pb-2 border-b-2 border-shuyukan-gold/30">
                                    4. 第三者への提供
                                </h2>
                                <p className="leading-relaxed">
                                    当会は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。
                                    ただし、剣道連盟への登録等、目的達成に必要な範囲において、
                                    適切な管理のもとで提供する場合があります。
                                </p>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-serif font-bold text-shuyukan-blue mb-4 pb-2 border-b-2 border-shuyukan-gold/30">
                                    5. 写真・動画の取り扱い
                                </h2>
                                <p className="leading-relaxed">
                                    稽古風景やイベントの写真・動画は、当会のウェブサイトやSNS（Instagram等）で
                                    活動報告として掲載することがあります。
                                    掲載を望まない場合は、お申し出ください。
                                </p>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-serif font-bold text-shuyukan-blue mb-4 pb-2 border-b-2 border-shuyukan-gold/30">
                                    6. 個人情報の管理
                                </h2>
                                <p className="leading-relaxed">
                                    当会は、個人情報への不正アクセス、紛失、破壊、改ざん、漏洩等を防止するため、
                                    適切な安全管理措置を講じます。
                                </p>
                            </section>

                            <section className="mb-10">
                                <h2 className="text-2xl font-serif font-bold text-shuyukan-blue mb-4 pb-2 border-b-2 border-shuyukan-gold/30">
                                    7. お問い合わせ
                                </h2>
                                <p className="leading-relaxed">
                                    個人情報の開示、訂正、削除等のご請求、その他ご質問がございましたら、
                                    下記までお問い合わせください。
                                </p>
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <p className="font-bold text-shuyukan-blue">豊中修猷館剣道部</p>
                                    <p className="text-sm text-gray-600">
                                        メール：<a href="mailto:info@shuyukan-kendo.com" className="text-shuyukan-blue hover:underline">info@shuyukan-kendo.com</a>
                                    </p>
                                </div>
                            </section>

                            <section className="text-center pt-8 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    制定日：2026年1月1日
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Privacy;
