import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <div className="relative h-screen min-h-[800px] w-full overflow-hidden bg-shuyukan-dark text-white">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-hero-dojo bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] ease-out opacity-40 filter grayscale contrast-125"
                style={{ transform: loaded ? 'scale(100)' : 'scale(105)' }}
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-shuyukan-blue/90 via-shuyukan-dark/50 to-transparent" />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-shuyukan-dark via-transparent to-transparent" />

            {/* Texture Overlay */}
            <div className="absolute inset-0 z-10 asanoha-pattern mix-blend-overlay pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Column: Vertical Calligraphy & Title */}
                    <div className="lg:col-span-5 flex flex-col items-start relative lg:pl-16">
                        {/* Dynamic Vertical Text Entry */}
                        <div className={`writing-vertical text-shuyukan-gold/20 absolute -left-20 top-0 text-[10rem] font-serif font-bold pointer-events-none select-none transition-all duration-1000 ${loaded ? 'opacity-20 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ textShadow: '10px 10px 20px rgba(0,0,0,0.5)' }}>
                            知行合一
                        </div>

                        <div className={`transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                            <h2 className="text-shuyukan-gold font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-4">
                                <span className="w-12 h-[1px] bg-shuyukan-gold"></span>
                                Essence of Kendo
                            </h2>
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold leading-tight mb-8 tracking-wide text-shadow-lg">
                                <span className="block text-white mb-4">知ることは、</span>
                                <span className="block text-white pl-4 sm:pl-12">打つことなり。</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-stone-200 font-serif tracking-widest border-l-4 border-shuyukan-red pl-6 py-2 italic opacity-90">
                                理屈はいらない。<br />
                                その一本で語れ。
                            </p>
                        </div>
                    </div>

                    {/* Right Column: CTA & Info Cards (Bento Grid) */}
                    <div className="lg:col-span-7 flex flex-col lg:items-end space-y-8 mt-12 lg:mt-0">
                        <div className={`bg-white/10 backdrop-blur-md p-8 md:p-10 rounded-lg border-l-4 border-shuyukan-gold shadow-2xl max-w-lg transform transition-all hover:scale-105 duration-500 group ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-white flex items-baseline gap-4">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-shuyukan-gold to-yellow-200">
                                    しなやかな心と体
                                </span>
                            </h2>
                            <p className="text-gray-200 mb-8 leading-relaxed font-sans font-light tracking-wide text-lg">
                                基本を大切に、正しく美しい剣道を目指します。<br />
                                初心者から経験者まで、それぞれの目標に向かって。
                            </p>
                            <div className="flex gap-4">
                                <Link to="/about" className="px-8 py-3 bg-shuyukan-red text-white font-bold rounded-full hover:bg-red-700 transition-all shadow-lg hover:shadow-red-900/50 flex items-center gap-2 group-hover:pl-10">
                                    道場について深く知る <span>→</span>
                                </Link>
                            </div>
                        </div>

                        <div className={`flex flex-wrap gap-4 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <Link
                                to="/join"
                                className="px-10 py-4 bg-shuyukan-purple hover:bg-purple-700 text-white font-bold tracking-widest shadow-lg shadow-purple-900/50 transition-all duration-300 flex items-center gap-2"
                            >
                                <span className="text-xl">⚔️</span> 入会案内
                            </Link>
                            <Link
                                to="/practice"
                                className="px-10 py-4 border border-white/30 hover:bg-white/10 text-white font-bold tracking-widest transition-all duration-300"
                            >
                                稽古日程
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-4">
                <span className="writing-vertical text-gray-500 text-xs tracking-[0.3em] font-light">SCROLL</span>
                <div className="h-24 w-[1px] bg-gray-700 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-shuyukan-gold animate-rain"></div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
