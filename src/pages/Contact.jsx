/**
 * Author: BaseLine Designs.com
 * Version: v0.2
 * Last Updated: 2026-01-10 JST
 * Changes:
 * - Embed Google Form for Contact page
 */

import React, { useState } from "react";
import SiteFrame from "../components/SiteFrame.jsx";
import FadeInSection from "../components/FadeInSection.jsx";
import { GOOGLE } from "../config/google.js";
import { submitInquiry } from "../services/inquiryService";

function ContactForm() {
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: '見学・体験について',
        content: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await submitInquiry(formData);
            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center py-12 animate-fade-in">
                <div className="text-6xl mb-6">✉️</div>
                <h3 className="text-2xl font-bold text-shuyukan-blue mb-4">お問い合わせありがとうございます。</h3>
                <p className="text-gray-600 leading-relaxed">
                    いただいた内容を確認し、担当者より折り返しご連絡させていただきます。<br />
                    今しばらくお待ちください。
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-shuyukan-blue font-bold border-b-2 border-shuyukan-blue hover:text-shuyukan-gold hover:border-shuyukan-gold transition-colors"
                >
                    別の件で問い合わせる
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">お名前 *</label>
                <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="例：豊中 太郎"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">メールアドレス *</label>
                <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="例：example@mail.com"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">お問い合わせ種別 *</label>
                <select
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                >
                    <option value="見学・体験について">見学・体験について</option>
                    <option value="入会について">入会について</option>
                    <option value="その他">その他</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">内容 *</label>
                <textarea
                    name="content"
                    required
                    rows="5"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="お問い合わせ内容を詳しくご記入ください。"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                ></textarea>
            </div>

            {status === 'error' && (
                <p className="text-red-500 text-sm">エラーが発生しました。時間を置いて再度お試しください。</p>
            )}

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-shuyukan-blue text-white font-bold py-4 rounded-lg hover:bg-shuyukan-gold hover:text-shuyukan-blue transition-all shadow-md disabled:opacity-50"
            >
                {status === 'submitting' ? '送信中...' : '送信する'}
            </button>
        </form>
    );
}

export default function Contact() {
    return (
        <SiteFrame title="お問い合わせ">
            {/* 安心メッセージ */}
            <FadeInSection>
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <p className="text-shuyukan-gold font-bold tracking-widest uppercase text-sm mb-2">Contact Us</p>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-shuyukan-blue mb-4">
                        些細なことでも、お気軽にどうぞ
                    </h2>
                    <p className="text-gray-600 leading-loose text-sm sm:text-base md:text-lg">
                        <span className="whitespace-nowrap">「まだ入会するか決めていないけど、ちょっと聞きたい」</span><br />
                        <span className="whitespace-nowrap">「子どもに合うか不安で…」</span><br />
                        <span className="block mt-2">そんなご相談も大歓迎です。</span>
                        <span className="block">お気軽にお問い合わせください。</span>
                    </p>
                </div>
            </FadeInSection>

            {/* よくあるご質問への誘導 */}
            <FadeInSection delay={100}>
                <div className="max-w-3xl mx-auto mb-12">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col md:flex-row items-center gap-4">
                        <div className="text-4xl">💡</div>
                        <div className="flex-1 text-center md:text-left">
                            <p className="font-bold text-shuyukan-blue mb-1">よくあるご質問をまとめています</p>
                            <p className="text-sm text-gray-600">費用・持ち物・体験の流れなど、多くの方から頂くご質問への回答をご覧いただけます。</p>
                        </div>
                        <a
                            href="/faq"
                            className="inline-block bg-shuyukan-blue text-white font-bold py-2 px-6 rounded-full hover:bg-shuyukan-gold hover:text-shuyukan-blue transition-colors text-sm whitespace-nowrap"
                        >
                            FAQを見る →
                        </a>
                    </div>
                </div>
            </FadeInSection>

            <FadeInSection delay={200}>
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Form Section */}
                    <div className="space-y-6">
                        <div className="bg-white/60 backdrop-blur-md border-l-4 border-shuyukan-blue p-6 rounded-r-lg shadow-sm">
                            <h3 className="font-bold text-shuyukan-dark mb-2 text-lg">お問い合わせフォーム</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                見学・体験のお申し込み、入会に関するご質問など<br />
                                なんでもお気軽にどうぞ。
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                            <ContactForm />
                        </div>

                        {/* 返信について */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <p className="text-sm text-green-700">
                                <span className="font-bold">📧 通常2〜3日以内にご返信いたします</span><br />
                                <span className="text-xs">※ 土日祝日を挟む場合はお時間をいただくことがあります</span>
                            </p>
                        </div>
                    </div>

                    {/* Access / Info Section */}
                    <FadeInSection delay={200}>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-serif font-bold text-shuyukan-blue border-b-2 border-shuyukan-gold pb-2 mb-4">
                                    道場アクセス
                                </h3>
                                <a
                                    href="https://www.google.com/maps/place/%E8%B1%8A%E4%B8%AD%E5%B8%82%E7%AB%8B%E7%86%8A%E9%87%8E%E7%94%B0%E5%B0%8F%E5%AD%A6%E6%A0%A1/@34.7766699,135.4746610,17z"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block aspect-video w-full bg-gray-200 rounded-lg overflow-hidden shadow-md mb-4 relative group cursor-pointer"
                                >
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3278.490806497214!2d135.47466107574744!3d34.77666997289297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e4e6900257bb%3A0xe67756f43279163f!2z6LGK5Lit5biC56uL54aK6YeO55Sw5bCP5a2m5qCh!5e0!3m2!1sja!2sjp!4v1705663123456!5m2!1sja!2sjp"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, pointerEvents: 'none' }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-shuyukan-blue font-bold py-2 px-4 rounded-full shadow-lg text-sm">
                                            🗺️ Googleマップで開く
                                        </span>
                                    </div>
                                </a>
                                <address className="not-italic text-gray-600 space-y-2">
                                    <p className="font-bold text-lg">豊中市立熊野田小学校 体育館</p>
                                    <p>〒560-0015 豊中市赤阪1丁目5-1</p>
                                    <p className="text-sm">※ 学校敷地内への駐車はできません。近隣のコインパーキングをご利用ください。</p>
                                </address>
                            </div>

                            <div>
                                <h3 className="text-xl font-serif font-bold text-shuyukan-blue border-b-2 border-shuyukan-gold pb-2 mb-4">
                                    稽古日時（令和7年度）
                                </h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="border-b border-gray-100 pb-2">
                                        <span className="font-bold block">土曜日</span>
                                        <span className="text-sm">小学生 17:00-19:00 / 中学生以上 18:00-20:00</span>
                                    </li>
                                    <li className="border-b border-gray-100 pb-2">
                                        <span className="font-bold block">日曜日</span>
                                        <span className="text-sm">全学年 14:00-16:00</span>
                                    </li>
                                    <li className="text-sm text-gray-500 mt-2">
                                        ※第3・5日曜 16:15-18:15<br />
                                        ※学校行事等により変更になる場合があります
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </FadeInSection>
        </SiteFrame>
    );
}
