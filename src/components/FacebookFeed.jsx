import React, { useEffect } from 'react';

/**
 * FacebookFeed - 公式Facebookページのタイムラインを表示するコンポーネント
 * 
 * Facebook Page Pluginを使用しています。
 * URL: https://www.facebook.com/p/%E8%B1%8A%E4%B8%AD%E4%BF%AE%E7%8C%B7%E9%A4%A8-100064393673892/
 */
export default function FacebookFeed() {
    useEffect(() => {
        // Facebook SDKの読み込み（既に読み込まれている場合はスキップ）
        if (window.FB) {
            window.FB.XFBML.parse();
        } else {
            const script = document.createElement('script');
            script.src = "https://connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v21.0";
            script.async = true;
            script.defer = true;
            script.crossOrigin = "anonymous";
            document.body.appendChild(script);
        }
    }, []);

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-serif font-bold text-shuyukan-blue flex items-center justify-center gap-3">
                        <span className="text-blue-600 text-xl">📘</span> 公式Facebook
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">最新情報や稽古の様子を随時更新しています</p>
                </div>

                <div className="flex justify-center">
                    <div className="bg-white p-2 rounded-lg shadow-md border border-gray-200">
                        {/* Facebook Page Plugin Container */}
                        <div
                            className="fb-page"
                            data-href="https://www.facebook.com/people/%E8%B1%8A%E4%B8%AD%E4%BF%AE%E7%8C%B7%E9%A4%A8/100064393673892/"
                            data-tabs="timeline"
                            data-width="500"
                            data-height="600"
                            data-small-header="false"
                            data-adapt-container-width="true"
                            data-hide-cover="false"
                            data-show-facepile="true"
                        >
                            <blockquote cite="https://www.facebook.com/people/%E8%B1%8A%E4%B8%AD%E4%BF%AE%E7%8C%B7%E9%A4%A8/100064393673892/" className="fb-xfbml-parse-ignore">
                                <a href="https://www.facebook.com/people/%E8%B1%8A%E4%B8%AD%E4%BF%AE%E7%8C%B7%E9%A4%A8/100064393673892/">豊中修猷館</a>
                            </blockquote>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <a
                        href="https://www.facebook.com/people/%E8%B1%8A%E4%B8%AD%E4%BF%AE%E7%8C%B7%E9%A4%A8/100064393673892/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-2 border-2 border-blue-600 text-blue-600 font-bold rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                    >
                        Facebookで詳しく見る
                    </a>
                </div>
            </div>

            {/* SDK loading target */}
            <div id="fb-root"></div>
        </section>
    );
}
