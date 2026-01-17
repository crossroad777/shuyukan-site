import React from 'react';

export default function DojoAccess() {
    return (
        <section className="mb-20 pt-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-serif text-shuyukan-blue mb-4 tracking-widest">
                    道場アクセス
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-shuyukan-red to-transparent mx-auto"></div>
            </div>

            <div className="bg-white/50 backdrop-blur-md border border-shuyukan-blue/10 rounded-lg p-8 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Map */}
                    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-shuyukan-blue/10 shadow-inner group relative">
                        <div className="absolute inset-0 bg-shuyukan-blue/20 pointer-events-none group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                        <iframe
                            src="https://maps.google.com/maps?q=%E8%B1%8A%E4%B8%AD%E5%B8%82%E7%AB%8B%E7%86%8A%E9%87%8E%E7%94%B0%E5%B0%8F%E5%AD%A6%E6%A0%A1&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            className="filter grayscale hover:grayscale-0 transition-all duration-1000"
                        ></iframe>
                    </div>

                    {/* Info */}
                    <div className="text-gray-700 space-y-6 font-sans">
                        <div>
                            <h3 className="text-xl text-shuyukan-blue font-serif mb-2 border-b border-shuyukan-blue/10 pb-2 font-bold">所在地</h3>
                            <p className="flex items-start gap-3">
                                <span className="text-shuyukan-red mt-1">📍</span>
                                <span>
                                    〒560-0015<br />
                                    大阪府豊中市赤阪1丁目5-1<br />
                                    豊中市立熊野田小学校
                                </span>
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl text-shuyukan-blue font-serif mb-2 border-b border-shuyukan-blue/10 pb-2 font-bold">稽古時間</h3>
                            <ul className="space-y-2">
                                <li className="flex justify-between border-b border-gray-200 pb-1">
                                    <span className="font-bold">土曜日</span>
                                    <span>17:00 - 20:00</span>
                                </li>
                                <li className="flex justify-between border-b border-gray-200 pb-1">
                                    <span className="font-bold">日曜日</span>
                                    <span>14:00 - 16:00</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl text-shuyukan-blue font-serif mb-2 border-b border-shuyukan-blue/10 pb-2 font-bold">連絡先</h3>
                            <p className="flex items-center gap-3">
                                <span className="text-shuyukan-red">✉️</span>
                                <a href="mailto:shuyukan.info@gmail.com" className="text-shuyukan-blue hover:text-shuyukan-gold transition-colors font-medium">
                                    shuyukan.info@gmail.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
