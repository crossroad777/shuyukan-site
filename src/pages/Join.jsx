/**
 * Author: BaseLine Designs.com
 * Version: v0.2
 * Last Updated: 2026-01-10 JST
 * Changes:
 * - Embed Google Form for Trial/Join page
 * Unchanged:
 * - Site layout/components
 */

import React, { useState } from "react";
import SiteFrame from "../components/SiteFrame.jsx";
import { submitInquiry } from "../services/inquiryService";

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
                <h3 className="text-2xl font-bold text-shuyukan-blue mb-4">ご入会ありがとうございます。</h3>
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
                className="w-full bg-shuyukan-blue text-white font-bold py-4 rounded-lg hover:bg-shuyukan-gold hover:text-shuyukan-blue transition-all shadow-md disabled:opacity-50"
            >
                {status === 'submitting' ? '送信中...' : '体験申込を送信する'}
            </button>
        </form>
    );
}

export default function Join() {
    return (
        <SiteFrame title="体験申込">
            <div className="max-w-2xl mx-auto">
                <p className="muted mb-8 text-left">
                    見学・体験は随時受け付けております。<br />
                    下記フォームよりお気軽にお申し込みください。<br />
                    <span className="text-shuyukan-blue font-bold">経験者のお子様も大歓迎です！</span>
                </p>

                <TrialForm />

                <p className="muted mt-8 text-sm text-left">
                    送信後、2～3日以内に担当者よりメールにてご連絡いたします。
                </p>
            </div>

            {/* FAQ Link Section */}
            <div className="mt-12 text-center bg-gradient-to-r from-shuyukan-gold/10 to-shuyukan-gold/5 p-8 rounded-lg border border-shuyukan-gold/20">
                <p className="text-shuyukan-dark mb-4 font-bold text-lg">
                    ご不明な点はありませんか？
                </p>
                <p className="text-gray-600 mb-6 text-sm">
                    費用や持ち物、初心者の方からよくいただくご質問をまとめています。
                </p>
                <a
                    href="/faq"
                    className="inline-block bg-shuyukan-blue text-white font-bold py-3 px-8 rounded hover:bg-shuyukan-gold hover:text-shuyukan-blue transition-colors shadow-md"
                >
                    よくある質問を見る →
                </a>
            </div>
        </SiteFrame>
    );
}
