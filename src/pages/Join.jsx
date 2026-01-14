/**
 * Author: BaseLine Designs.com
 * Version: v0.2
 * Last Updated: 2026-01-10 JST
 * Changes:
 * - Embed Google Form for Trial/Join page
 * Unchanged:
 * - Site layout/components
 */

import React from "react";
import SiteFrame from "../components/SiteFrame.jsx";
import { GOOGLE } from "../config/google.js";

export default function Join() {
    return (
        <SiteFrame title="体験申込">
            <p className="muted">
                ※こちらのフォームから体験申込をお願いします（ログイン不要）。
            </p>

            <div style={{ width: "100%", overflow: "hidden", borderRadius: 12 }}>
                <iframe
                    title="剣道部 体験申込フォーム"
                    src={GOOGLE.trialFormSrc}
                    style={{ width: "100%", height: 1000, border: 0 }}
                    frameBorder="0"
                    marginHeight="0"
                    marginWidth="0"
                >
                    読み込んでいます…
                </iframe>
            </div>

            <p className="muted" style={{ marginTop: 10 }}>
                送信後、必要に応じて担当からメールでご連絡します。
            </p>

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
