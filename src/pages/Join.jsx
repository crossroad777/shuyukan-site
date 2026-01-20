/**
 * Join Page - LP Marketing Style
 * マーケティングLP形式の体験申込ページ
 */

import React, { useState } from "react";
import SiteFrame from "../components/SiteFrame.jsx";
import { submitInquiry } from "../services/inquiryService";
import FadeInSection from "../components/FadeInSection.jsx";

const gradeOptions = [
    '未就学児（幼保）',
    '小学1年', '小学2年', '小学3年', '小学4年', '小学5年', '小学6年',
    '中学1年', '中学2年', '中学3年',
    '高校1年', '高校2年', '高校3年',
    '大学生', '一般'
];

function TrialForm() {
    const [status, setStatus] = useState('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        grade: '',
        experience: '未経験',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await submitInquiry({
                name: formData.name,
                email: formData.email,
                type: '体験申込',
                content: `学年: ${formData.grade}\n経験: ${formData.experience}\n備考: ${formData.notes}`
            });
            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center py-12 animate-fade-in bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="text-6xl mb-6">✨</div>
                <h3 className="text-2xl font-bold text-shuyukan-blue mb-4">お申し込みありがとうございます！</h3>
                <p className="text-gray-600 leading-relaxed px-6">
                    体験への申し込みを受け付けました。<br />
                    数日中に担当者よりメールにて詳細をご案内いたします。
                </p>
                <a
                    href="/"
                    className="mt-8 inline-block text-shuyukan-blue font-bold border-b-2 border-shuyukan-blue hover:text-shuyukan-gold hover:border-shuyukan-gold transition-colors"
                >
                    トップページへ戻る
                </a>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">お名前 *</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="例：山田 太郎"
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
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">学年・区分 *</label>
                    <select
                        name="grade"
                        required
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                    >
                        <option value="">選択してください</option>
                        {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">経験 *</label>
                    <select
                        name="experience"
                        required
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                    >
                        <option value="未経験">未経験</option>
                        <option value="経験あり">経験あり</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">特記事項・ご質問など</label>
                <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="兄弟での参加希望など、何かありましたらご記入ください。"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                ></textarea>
            </div>

            {status === 'error' && (
                <p className="text-red-500 text-sm">エラーが発生しました。時間を置いて再度お試しください。</p>
            )}

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-shuyukan-red text-white font-bold py-4 rounded-lg hover:bg-red-700 transition-all shadow-lg disabled:opacity-50 text-lg"
            >
                {status === 'submitting' ? '送信中...' : '🎯 今すぐ無料体験に申し込む'}
            </button>
            <p className="text-center text-xs text-gray-400">
                ※ 30秒で完了します。勧誘は一切ありません。
            </p>
        </form>
    );
}

export default function Join() {
    return (
        <SiteFrame title="">
            {/* Hero Section - 共感を呼ぶキャッチコピー */}
            <section className="text-center py-12 md:py-20 bg-gradient-to-b from-shuyukan-blue to-shuyukan-blue/90 text-white -mx-6 md:-mx-10 -mt-6 md:-mt-10 px-6 mb-16">
                <FadeInSection>
                    <p className="text-shuyukan-gold font-bold tracking-widest uppercase text-sm mb-4">無料体験受付中</p>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                        「うちの子に<br className="md:hidden" />何か習わせたい」<br />
                        そう思ったら、剣道です。
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed text-left sm:text-center">
                        あいさつ、礼儀、仲間との絆。<br className="hidden sm:inline" />
                        剣道は、お子様の一生の財産になります。
                    </p>
                </FadeInSection>
            </section>

            {/* Pain Points - 親の悩みに共感 */}
            <section className="max-w-4xl mx-auto mb-20 px-4">
                <FadeInSection>
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-shuyukan-blue mb-4">
                            こんなお悩みありませんか？
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-shuyukan-red">
                            <div className="text-3xl mb-3">😟</div>
                            <p className="text-gray-700 font-medium">ゲームばかりで<br />体を動かさない</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-shuyukan-red">
                            <div className="text-3xl mb-3">😔</div>
                            <p className="text-gray-700 font-medium">あいさつが<br />ちゃんとできない</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-shuyukan-red">
                            <div className="text-3xl mb-3">😰</div>
                            <p className="text-gray-700 font-medium">すぐに諦めて<br />続かない</p>
                        </div>
                    </div>
                </FadeInSection>
            </section>

            {/* Solution - 剣道で変わること */}
            <section className="max-w-4xl mx-auto mb-20 px-4">
                <FadeInSection>
                    <div className="text-center mb-10">
                        <p className="text-shuyukan-gold font-bold tracking-widest uppercase text-sm mb-2">Solution</p>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-shuyukan-blue mb-4">
                            剣道を始めると、こう変わります
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg text-center border-2 border-transparent hover:border-shuyukan-gold transition-all">
                            <div className="w-16 h-16 bg-shuyukan-blue rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">🤝</div>
                            <h3 className="font-bold text-shuyukan-blue text-lg mb-2">仲間ができる</h3>
                            <p className="text-sm text-gray-600 leading-relaxed text-left sm:text-center">
                                一緒に汗を流す仲間は、学校の友達とはまた違う絆で結ばれます。
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg text-center border-2 border-transparent hover:border-shuyukan-gold transition-all">
                            <div className="w-16 h-16 bg-shuyukan-gold rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">🎯</div>
                            <h3 className="font-bold text-shuyukan-blue text-lg mb-2">自信がつく</h3>
                            <p className="text-sm text-gray-600 leading-relaxed text-left sm:text-center">
                                できなかったことができるようになる喜び。小さな成功体験が自信に。
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg text-center border-2 border-transparent hover:border-shuyukan-gold transition-all">
                            <div className="w-16 h-16 bg-shuyukan-red rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">💪</div>
                            <h3 className="font-bold text-shuyukan-blue text-lg mb-2">心身が強くなる</h3>
                            <p className="text-sm text-gray-600 leading-relaxed text-left sm:text-center">
                                思いきり声を出し、体を動かすことで心も体もスッキリします。
                            </p>
                        </div>
                    </div>
                </FadeInSection>
            </section>

            {/* 入会の流れ - 連動したステップ */}
            <section className="bg-shuyukan-blue/5 py-16 -mx-6 md:-mx-10 px-6 mb-16">
                <div className="max-w-4xl mx-auto">
                    <FadeInSection>
                        <div className="text-center mb-12">
                            <p className="text-shuyukan-red font-bold tracking-widest uppercase text-sm mb-2">3 Easy Steps</p>
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-shuyukan-blue mb-4">
                                3ステップで始められる
                            </h2>
                            <p className="text-gray-600">初めてでも安心。まずは気軽に見学から。</p>
                        </div>

                        {/* Connected Timeline */}
                        <div className="relative">
                            {/* Connection Line */}
                            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-1 bg-gradient-to-r from-shuyukan-blue via-shuyukan-gold to-shuyukan-red"></div>

                            <div className="grid md:grid-cols-3 gap-8 relative">
                                {/* Step 1 */}
                                <div className="text-center relative">
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-shuyukan-blue text-white flex items-center justify-center text-3xl font-bold shadow-xl border-4 border-white relative z-10">
                                        1
                                    </div>
                                    <h3 className="font-bold text-shuyukan-blue text-lg mb-2">見学・体験申込</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-3">
                                        下のフォームから<br />30秒で申込完了
                                    </p>
                                    <span className="inline-block bg-shuyukan-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                                        無料
                                    </span>
                                </div>

                                {/* Step 2 */}
                                <div className="text-center relative">
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-shuyukan-gold text-white flex items-center justify-center text-3xl font-bold shadow-xl border-4 border-white relative z-10">
                                        2
                                    </div>
                                    <h3 className="font-bold text-shuyukan-blue text-lg mb-2">体験参加</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-3">
                                        道着がなくてもOK<br />動きやすい服装で
                                    </p>
                                    <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        手ぶらでOK
                                    </span>
                                </div>

                                {/* Step 3 */}
                                <div className="text-center relative">
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-shuyukan-red text-white flex items-center justify-center text-3xl font-bold shadow-xl border-4 border-white relative z-10">
                                        3
                                    </div>
                                    <h3 className="font-bold text-shuyukan-blue text-lg mb-2">入会を検討</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-3">
                                        お子様・保護者様が<br />納得してから
                                    </p>
                                    <span className="inline-block bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        勧誘なし
                                    </span>
                                </div>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* 安心メッセージ */}
            <section className="max-w-3xl mx-auto mb-16 px-4">
                <FadeInSection>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 text-center">
                        <div className="text-5xl mb-4">🌱</div>
                        <h3 className="text-xl font-bold text-green-800 mb-3">
                            <span className="whitespace-nowrap">「ちょっと見てみたいだけ」で</span><br className="sm:hidden" />
                            <span className="whitespace-nowrap">大丈夫です</span>
                        </h3>
                        <p className="text-green-700 leading-relaxed text-left sm:text-center">
                            無理な勧誘は一切ありません。<br className="hidden sm:inline" />
                            お子様に合うかどうか、まずは見て・体験してから<br className="hidden sm:inline" />
                            ゆっくりご検討ください。
                        </p>
                    </div>
                </FadeInSection>
            </section>

            {/* CTA + Form Section */}
            <section id="form" className="max-w-2xl mx-auto mb-16 px-4">
                <FadeInSection>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-shuyukan-blue mb-4">
                            無料体験申込フォーム
                        </h2>
                        <p className="text-gray-500 text-sm">
                            土曜日17:00〜・日曜日14:00〜 いつでも体験できます<br />
                            <span className="text-shuyukan-blue font-bold">経験者のお子様も大歓迎！</span>
                        </p>
                    </div>

                    <TrialForm />

                    <p className="text-center text-gray-400 text-sm mt-6">
                        <span className="whitespace-nowrap">送信後、2～3日以内に担当者より</span><br className="sm:hidden" />
                        <span className="whitespace-nowrap">メールにてご連絡いたします。</span>
                    </p>
                </FadeInSection>
            </section>

            {/* FAQ Link */}
            <section className="max-w-3xl mx-auto px-4 mb-8">
                <div className="text-center bg-gray-50 p-8 rounded-xl border border-gray-200">
                    <p className="text-gray-700 mb-4 font-bold">
                        まだ不安がありますか？
                    </p>
                    <p className="text-gray-500 mb-6 text-sm">
                        <span className="whitespace-nowrap">費用や持ち物、初心者の方から</span><br className="sm:hidden" />
                        <span className="whitespace-nowrap">よくいただくご質問をまとめています。</span>
                    </p>
                    <a
                        href="/faq"
                        className="inline-block border-2 border-shuyukan-blue text-shuyukan-blue font-bold py-3 px-8 rounded-full hover:bg-shuyukan-blue hover:text-white transition-colors"
                    >
                        よくある質問を見る →
                    </a>
                </div>
            </section>
        </SiteFrame>
    );
}
