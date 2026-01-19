import React from 'react';
import { Link } from 'react-router-dom';
import SiteFrame from '../components/SiteFrame.jsx';
import Hero from '../components/Hero.jsx';
import Schedule from '../components/Schedule.jsx';
import InstagramFeed from '../components/InstagramFeed.jsx';
import FacebookFeed from '../components/FacebookFeed.jsx';
import DojoAccess from '../components/DojoAccess.jsx';

import FadeInSection from '../components/FadeInSection.jsx';

import NewsSection from '../components/NewsSection.jsx';

export default function Home() {
  return (
    <SiteFrame title="" hero={<Hero />}>
      <NewsSection />

      <div className="py-20 bg-paper relative">
        <div className="absolute inset-0 asanoha-pattern mix-blend-multiply opacity-15"></div>

        {/* Dojo Identity / Introduction Section */}
        <section className="relative py-24 px-6 md:px-12 overflow-hidden">
          {/* Background Watermark (Big Character) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 opacity-30">
            <span className="font-serif text-[20rem] text-shuyukan-blue/30 leading-none">心</span>
          </div>

          <div className="max-w-4xl mx-auto relative z-10 text-left">
            <FadeInSection>
              <h2 className="text-4xl md:text-5xl font-bold font-serif mb-12 tracking-widest text-shuyukan-blue">
                道場紹介
              </h2>
            </FadeInSection>

            <div className="space-y-8 font-serif leading-loose text-lg text-gray-800">
              <FadeInSection delay={200}>
                <p>
                  <span className="text-xl sm:text-2xl font-bold block mb-4 text-shuyukan-blue">「知るとは、変わること」</span>
                  剣道は単なるスポーツではありません。
                  竹刀を交えることで、己を知り、相手を知り、その瞬間に「変化」し続ける。<br className="sm:hidden" />
                  自己への探求です。
                </p>
              </FadeInSection>
              <FadeInSection delay={400}>
                <p className="text-gray-700">
                  だからこそ、私たちは今日も汗を流し、大声で叫び、
                  理屈ではない「何か」を掴み取ろうとします。
                  豊中修猷館は、そんな<span className="text-shuyukan-red font-bold">「生涯の剣道」</span>を志す<br className="sm:hidden" />
                  人々のための場所です。
                </p>
              </FadeInSection>
            </div>
          </div>

          {/* Three Principles Grid - Dark Premium Style */}
          <div className="max-w-6xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
            {/* 1. Harmony */}
            <FadeInSection delay={200}>
              <Link to="/philosophy/harmony" className="block group p-10 rounded-lg bg-shuyukan-blue shadow-lg border border-shuyukan-gold/20 hover:border-shuyukan-gold/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
                <h3 className="text-xl font-sans font-thin tracking-[0.3em] text-shuyukan-gold mb-2 uppercase group-hover:text-white transition-colors">Harmony</h3>
                <h4 className="text-3xl font-serif font-bold text-white mb-6">心身の調和</h4>
                <p className="text-sm text-gray-300 leading-relaxed font-serif text-center">
                  心と体を一つにする。<br />
                  静寂の中で<br className="sm:hidden" />自らを見つめる。
                </p>
              </Link>
            </FadeInSection>

            {/* 2. Etiquette */}
            <FadeInSection delay={400}>
              <Link to="/philosophy/etiquette" className="block group p-10 rounded-lg bg-shuyukan-blue shadow-lg border border-shuyukan-gold/20 hover:border-shuyukan-gold/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
                <h3 className="text-xl font-sans font-thin tracking-[0.3em] text-shuyukan-gold mb-2 uppercase group-hover:text-white transition-colors">Etiquette</h3>
                <h4 className="text-3xl font-serif font-bold text-white mb-6">礼節と伝統</h4>
                <p className="text-sm text-gray-300 leading-relaxed font-serif">
                  相手を敬い、己を律する。<br />
                  美しき所作は、心の表れ。
                </p>
              </Link>
            </FadeInSection>

            {/* 3. Lifelong */}
            <FadeInSection delay={600}>
              <Link to="/philosophy/lifelong" className="block group p-10 rounded-lg bg-shuyukan-blue border border-white/10 hover:border-shuyukan-gold transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-shuyukan-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h3 className="text-xl font-sans font-thin tracking-[0.3em] text-shuyukan-gold mb-2 uppercase group-hover:text-white transition-colors relative z-10">Lifelong</h3>
                <h4 className="text-3xl font-serif font-bold text-white mb-6 relative z-10">生涯剣道</h4>

                <p className="text-sm text-gray-300 leading-relaxed font-serif relative z-10">
                  終わりなき道を歩む。<br />
                  昨日の自分を超え続ける。
                </p>
              </Link>
            </FadeInSection>
          </div>
        </section>

        {/* ZANSHIN Concept Banner */}
        <FadeInSection>
          <div className="w-full mb-32 relative group overflow-hidden rounded-lg shadow-2xl border border-shuyukan-blue/30">
            <div className="absolute inset-0 bg-shuyukan-blue/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
            <img
              src="/assets/zanshin/concept_banner.png"
              alt="ZANSHIN Concept"
              className="w-full h-auto object-cover object-top transform group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            <div className="absolute bottom-8 right-8 z-20 text-right">
              <p className="text-white/80 font-serif tracking-[0.5em] text-sm uppercase">The Beautiful Aftermath</p>
              <h3 className="text-3xl font-bold text-white font-serif tracking-widest mt-2 text-shadow-lg">残心</h3>
            </div>
          </div>
        </FadeInSection>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-20">
            <FadeInSection>
              <InstagramFeed />
            </FadeInSection>
          </div>
          <div className="mt-20">
            <FadeInSection>
              <FacebookFeed />
            </FadeInSection>
          </div>
          <FadeInSection>
            <DojoAccess />
          </FadeInSection>
        </div>
      </div>
    </SiteFrame>
  );
}
