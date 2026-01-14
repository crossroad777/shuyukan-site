/**
 * Author: BaseLine Designs.com
 * Version: v0.2
 * Last Updated: 2026-01-10 JST
 * Changes: Embed public Google Calendar on Practice page
 * Unchanged: Site layout/components
 */

import React from 'react';
import SiteFrame from '../components/SiteFrame.jsx';

const CALENDAR_SRC =
    'https://calendar.google.com/calendar/embed?src=98e522073c688c30411bc67f17eb8ce9617db601c6329411f4dd676ca809e82b%40group.calendar.google.com&ctz=Asia%2FTokyo';

export default function Practice() {
    return (
        <SiteFrame title="稽古日程">
            <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-shuyukan-blue p-4 text-shuyukan-dark">
                    <p className="font-bold">公開用カレンダー</p>
                    <p className="text-sm">※場所・時間・持ち物など最低限の情報のみ掲載しています。部員はログインして詳細を確認してください。</p>
                </div>

                <div className="relative w-full aspect-video md:aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden shadow-inner">
                    <iframe
                        title="剣道部 練習予定（公開）"
                        src={CALENDAR_SRC}
                        className="absolute top-0 left-0 w-full h-full border-0"
                        frameBorder="0"
                        scrolling="no"
                    />
                </div>

                <div className="text-center text-sm text-gray-400">
                    <p>表示されない場合は、ブラウザの広告ブロック等を一度OFFにして確認してください。</p>
                </div>
            </div>
        </SiteFrame>
    );
}
