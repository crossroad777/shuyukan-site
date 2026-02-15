import React from 'react';
import { Link } from 'react-router-dom';
import { Sword } from 'lucide-react';

const StickyCTA = () => {
    return (
        <div className="fixed bottom-0 left-0 w-full z-[100] bg-shuyukan-blue/95 backdrop-blur-sm border-t border-shuyukan-gold/30 px-4 py-3 md:py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
            <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                {/* Left Side: Badge and Slogan */}
                <div className="flex items-center gap-4">
                    <span className="bg-shuyukan-gold text-shuyukan-blue text-[10px] md:text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                        体験無料
                    </span>
                    <p className="text-white text-xs md:text-lg font-serif font-medium tracking-wider hidden sm:block">
                        豊中市で剣道を始めるなら、<span className="text-shuyukan-gold">豊中修猷館</span>へ！
                    </p>
                </div>

                {/* Right Side: Action Buttons */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link
                        to="/join"
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-shuyukan-red text-white font-bold rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg hover:-translate-y-1 text-sm md:text-base whitespace-nowrap"
                    >
                        <Sword className="w-4 h-4 md:w-5 md:h-5" />
                        <span>見学申込</span>
                    </Link>
                    <Link
                        to="/contact"
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-white text-shuyukan-blue font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:-translate-y-1 text-sm md:text-base whitespace-nowrap"
                    >
                        <Sword className="w-4 h-4 md:w-5 md:h-5" />
                        <span>お問い合わせ</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StickyCTA;
