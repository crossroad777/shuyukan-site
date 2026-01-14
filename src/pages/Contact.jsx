/**
 * Author: BaseLine Designs.com
 * Version: v0.2
 * Last Updated: 2026-01-10 JST
 * Changes:
 * - Embed Google Form for Contact page
 */

import React from "react";
import SiteFrame from "../components/SiteFrame.jsx";
import FadeInSection from "../components/FadeInSection.jsx";
import { GOOGLE } from "../config/google.js";

export default function Contact() {
    return (
        <SiteFrame title="お問い合わせ">
            <FadeInSection>
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Form Section */}
                    <div className="space-y-6">
                        <div className="bg-white/60 backdrop-blur-md border-l-4 border-shuyukan-blue p-6 rounded-r-lg shadow-sm">
                            <h3 className="font-bold text-shuyukan-dark mb-2 text-lg">お問い合わせフォーム</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                見学・体験のお申し込み、その他ご質問はこちらからお気軽にどうぞ。<br />
                                下記フォームが表示されない場合は、ブラウザの再読み込みをお試しください。
                            </p>
                        </div>
                        <div className="w-full aspect-[4/5] bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 relative">
                            <iframe
                                title="剣道部 お問い合わせフォーム"
                                src={GOOGLE.contactFormSrc}
                                className="w-full h-full border-0"
                                frameBorder="0"
                                marginHeight="0"
                                marginWidth="0"
                            >
                                読み込んでいます…
                            </iframe>
                        </div>
                    </div>

                    {/* Access / Info Section */}
                    <FadeInSection delay={200}>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-serif font-bold text-shuyukan-blue border-b-2 border-shuyukan-gold pb-2 mb-4">
                                    道場アクセス
                                </h3>
                                <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden shadow-md mb-4">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3278.490806497214!2d135.47466107574744!3d34.77666997289297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e4e6900257bb%3A0xe67756f43279163f!2z6LGK5Lit5biC56uL54aK6YeO55Sw5bCP5a2m5qCh!5e0!3m2!1sja!2sjp!4v1705663123456!5m2!1sja!2sjp"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                                <address className="not-italic text-gray-600 space-y-2">
                                    <p className="font-bold text-lg">豊中市立熊野田小学校 体育館</p>
                                    <p>〒560-0015 豊中市赤阪1丁目5-1</p>
                                    <p className="text-sm">※ 学校敷地内への駐車はできません。近隣のコインパーキングをご利用ください。</p>
                                </address>
                            </div>

                            <div>
                                <h3 className="text-xl font-serif font-bold text-shuyukan-blue border-b-2 border-shuyukan-gold pb-2 mb-4">
                                    稽古日時
                                </h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex justify-between border-b border-gray-100 pb-1">
                                        <span className="font-bold">土曜日</span>
                                        <span>17:00 - 20:00</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-100 pb-1">
                                        <span className="font-bold">日曜日</span>
                                        <span>14:00 - 16:00</span>
                                    </li>
                                    <li className="text-sm text-gray-500 mt-2">※ 学校行事や試験期間により変更になる場合があります。</li>
                                </ul>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </FadeInSection>
        </SiteFrame>
    );
}
