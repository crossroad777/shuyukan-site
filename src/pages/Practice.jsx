/**
 * Author: BaseLine Designs.com
 * Version: v0.3
 * Last Updated: 2026-01-27 JST
 * Changes: Mobile-friendly calendar display, use env variable for calendar ID
 * Unchanged: Site layout/components
 */

import React from 'react';
import SiteFrame from '../components/SiteFrame.jsx';

const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID;
const CALENDAR_SRC = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CALENDAR_ID)}&ctz=Asia%2FTokyo&mode=MONTH&wkst=1&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0`;

export default function Practice() {
    return (
        <SiteFrame title="稽古日程">
            <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-shuyukan-blue p-4 text-shuyukan-dark">
                    <p className="font-bold">公開用カレンダー</p>
                    <p className="text-sm">※場所・時間・持ち物など最低限の情報のみ掲載しています。部員はログインして詳細を確認してください。</p>
                </div>

                {/* モバイル: 縦長で見やすく / PC: 横長アスペクト比 */}
                <div className="relative w-full h-[500px] sm:h-[450px] md:h-auto md:aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden shadow-inner border">
                    <iframe
                        title="剣道部 練習予定（公開）"
                        src={CALENDAR_SRC}
                        className="absolute top-0 left-0 w-full h-[calc(100%+40px)] border-0"
                        frameBorder="0"
                        scrolling="no"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <p className="text-sm text-gray-400">表示されない場合は、ブラウザの広告ブロック等を一度OFFにして確認してください。</p>
                    <a
                        href={`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(CALENDAR_ID)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                        📅 Googleカレンダーで開く
                    </a>
                </div>
            </div>
        </SiteFrame>
    );
}
