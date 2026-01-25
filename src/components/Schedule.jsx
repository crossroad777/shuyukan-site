import React from 'react';
import FadeInSection from './FadeInSection.jsx';

const Schedule = () => {
    return (
        <section className="py-20 bg-paper relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <FadeInSection>
                    <div className="text-center mb-16">
                        <h2 className="text-shuyukan-blue text-xs font-bold uppercase tracking-[0.2em] mb-3">Digital Dojo</h2>
                        <h3 className="text-3xl font-serif font-bold text-shuyukan-blue mb-6">稽古日程</h3>
                        <div className="w-16 h-[2px] bg-shuyukan-gold mx-auto" />
                    </div>
                </FadeInSection>

                <FadeInSection delay={200}>
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-8 max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-shuyukan-blue mb-4 border-b pb-2">稽古日程（令和7年度）</h4>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h5 className="font-bold text-blue-600 mb-2">土曜日</h5>
                                        <ul className="space-y-1 text-slate-700 text-sm">
                                            <li className="flex justify-between">
                                                <span>小学生低学年・高学年</span>
                                                <span className="font-medium">17:00 ～ 19:00</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>中学生以上</span>
                                                <span className="font-medium">18:00 ～ 20:00</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h5 className="font-bold text-shuyukan-red mb-2">日曜日</h5>
                                        <ul className="space-y-1 text-slate-700 text-sm">
                                            <li className="flex justify-between">
                                                <span>小学生低学年・高学年</span>
                                                <span className="font-medium">14:00 ～ 16:00</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>中学生以上</span>
                                                <span className="font-medium">14:00 ～ 16:00</span>
                                            </li>
                                        </ul>
                                        <p className="text-xs text-gray-500 mt-2">
                                            ※第3・5日曜 16:15～18:15<br />
                                            （他団体利用の為 18:45完全撤収）
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-shuyukan-blue mb-4 border-b pb-2">場所・会費</h4>
                                <p className="text-sm text-slate-600 mb-4">
                                    <strong>熊野田小学校体育館</strong><br />
                                    〒560-0015 豊中市赤阪1丁目5-1
                                </p>
                                <div className="bg-shuyukan-gold/10 p-4 rounded-lg mb-4">
                                    <h5 className="font-bold text-shuyukan-blue text-sm mb-2">【会費】</h5>
                                    <ul className="text-xs text-slate-700 space-y-1">
                                        <li className="flex justify-between">
                                            <span>入会金</span>
                                            <span className="font-medium">2,000円</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>月謝（一般）</span>
                                            <span className="font-medium">2,000円/月</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>月謝（中学生）</span>
                                            <span className="font-medium">1,000円/月</span>
                                        </li>
                                    </ul>
                                    <p className="text-[10px] text-gray-500 mt-2">
                                        ※月謝は原則 3・6・9・12月末に3ヶ月分を納入
                                    </p>
                                </div>
                                <p className="text-xs text-slate-500 bg-gray-50 p-2 rounded">
                                    対象：幼児、小学生、中学生、高校生、一般初心者<br />
                                    出稽古も歓迎いたします。
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection delay={400}>
                    <div className="bg-white p-4 shadow-xl rounded-sm border border-gray-100 max-w-5xl mx-auto">
                        {/* カレンダー下部の「追加」リンクを隠すためのクロッピングコンテナ */}
                        <div className="relative w-full aspect-video md:aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden shadow-inner border">
                            <iframe
                                title="剣道部 練習予定（公開）"
                                src="https://calendar.google.com/calendar/embed?src=98e522073c688c30411bc67f17eb8ce9617db601c6329411f4dd676ca809e82b%40group.calendar.google.com&ctz=Asia%2FTokyo&mode=MONTH&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0"
                                className="absolute top-0 left-0 w-full h-[calc(100%+40px)] border-0"
                                style={{ pointerEvents: 'auto' }}
                                frameBorder="0"
                                scrolling="no"
                            />
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                            <p className="text-sm text-gray-400">
                                表示されない場合は、ブラウザの広告ブロック等を一度OFFにして確認してください。
                            </p>
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection delay={600}>
                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            ※ 試合や遠征により変更となる場合があります。
                        </p>
                    </div>
                </FadeInSection>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-shuyukan-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-shuyukan-blue/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </section>
    );
};

export default Schedule;
