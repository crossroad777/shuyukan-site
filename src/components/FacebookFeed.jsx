import React from 'react';
import { Facebook } from 'lucide-react';

/**
 * FacebookFeed - 公式Facebookページのモックアップ表示
 * 
 * 実際のFacebook連携は管理者と相談後に実装予定
 * URL: https://www.facebook.com/p/%E8%B1%8A%E4%B8%AD%E4%BF%AE%E7%8C%B7%E9%A4%A8-100064393673892/
 */
export default function FacebookFeed() {
    const facebookUrl = "https://www.facebook.com/people/%E8%B1%8A%E4%B8%AD%E4%BF%AE%E7%8C%B7%E9%A4%A8/100064393673892/";

    // モックアップ投稿データ
    const mockPosts = [
        {
            id: 1,
            date: '2026年1月19日',
            content: '本日の稽古風景です。寒い中、子どもたちも元気に稽古に励んでいます！',
            likes: 24,
            image: true
        },
        {
            id: 2,
            date: '2026年1月12日',
            content: '新年最初の稽古を行いました。今年も一年よろしくお願いします。',
            likes: 18,
            image: true
        },
        {
            id: 3,
            date: '2026年1月5日',
            content: '2026年の稽古始めです。今年も心技体の向上を目指して頑張りましょう！',
            likes: 32,
            image: false
        }
    ];

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-serif font-bold text-shuyukan-blue flex items-center justify-center gap-3">
                        <span className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Facebook size={24} className="text-white" />
                        </span>
                        公式Facebook
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">最新情報や稽古の様子を随時更新しています</p>
                </div>

                {/* モックアップFacebookフィード */}
                <div className="flex justify-center">
                    <div className="w-full max-w-[500px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        {/* ヘッダー */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                                <Facebook size={28} className="text-blue-600" />
                            </div>
                            <div className="text-white">
                                <h3 className="font-bold">豊中修猷館</h3>
                                <p className="text-xs text-blue-200">@shuyukan.toyonaka</p>
                            </div>
                        </div>

                        {/* 投稿モックアップ */}
                        <div className="divide-y divide-gray-100">
                            {mockPosts.map(post => (
                                <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <p className="text-xs text-gray-400 mb-2">{post.date}</p>
                                    <p className="text-gray-700 text-sm mb-3 leading-relaxed">{post.content}</p>
                                    {post.image && (
                                        <div className="bg-gray-100 rounded-lg h-32 mb-3 flex items-center justify-center text-gray-400">
                                            <span className="text-4xl">📷</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>👍 {post.likes}</span>
                                        <span>💬 コメント</span>
                                        <span>↗️ シェア</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* フッター */}
                        <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                            <p className="text-xs text-gray-400">※ これはプレビュー表示です</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2 border-2 border-blue-600 text-blue-600 font-bold rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                    >
                        <Facebook size={20} />
                        公式Facebookを見る
                    </a>
                </div>
            </div>
        </section>
    );
}


