import React from 'react';
import SiteFrame from '../components/SiteFrame.jsx';

export default function Teacher() {
    return (
        <SiteFrame title="指導者紹介">
            <div className="space-y-12">
                {/* Main Teacher */}
                <section className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-full md:w-1/3">
                        {/* Placeholder for teacher image */}
                        <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden shadow-lg relative group">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                                写真
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-2/3">
                        <h2 className="text-2xl font-serif font-bold text-shuyukan-blue mb-2">
                            <span className="text-sm block text-shuyukan-gold tracking-widest mb-1">代表者</span>
                            村田 茂男 <span className="text-lg font-normal ml-2"></span>
                        </h2>
                        <div className="w-16 h-1 bg-shuyukan-gold mb-6"></div>

                        <div className="prose text-gray-700 leading-relaxed mb-6">
                            <p>
                                「知行合一」を座右の銘とし、技術の指導だけでなく、剣道を通じた人間形成に重きを置いています。
                                勝利にこだわるだけでなく、打って反省、打たれて感謝の精神を次世代に伝えることを使命としています。
                            </p>
                        </div>

                        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                            <div className="border-t border-gray-100 pt-4">
                                <dt className="font-bold text-sm text-gray-500">経歴</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    （確認中）
                                </dd>
                            </div>
                            <div className="border-t border-gray-100 pt-4">
                                <dt className="font-bold text-sm text-gray-500">指導方針</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    基本を大切にし、理にかなった剣道を追求する。<br />
                                    生涯剣道を実践できる基礎体力を養う。
                                </dd>
                            </div>
                        </dl>
                    </div>
                </section>

                {/* Message Section */}
                <section className="bg-blue-50 p-8 rounded-lg text-center border border-blue-100">
                    <h3 className="text-xl font-bold text-shuyukan-blue mb-4">入部を検討されている皆様</h3>
                    <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed text-left sm:text-center text-sm sm:text-base">
                        剣道は年齢や性別を問わず、誰もが始められる武道です。
                        厳しさの中にも楽しさがあり、仲間と共に汗を流す時間は何事にも代えがたい財産となります。道場でお会いできることを楽しみにしています。
                    </p>
                </section>
            </div>
        </SiteFrame>
    );
}
