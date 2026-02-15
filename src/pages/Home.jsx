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
      {/* <NewsSection /> */}

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
                  静寂の中で自らを見つめる。
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

        {/* Parent Benefits Section - 保護者向けコンテンツ */}
        <section className="py-20 px-6 md:px-12">
          <FadeInSection>
            <div className="text-center mb-12">
              <span className="text-shuyukan-red font-bold tracking-widest uppercase text-sm">For Parents</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-shuyukan-blue mt-2 mb-4">
                剣道で育つ、3つの<span className="whitespace-nowrap">「楽しい」</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base text-left sm:text-center">
                子どもたちは「楽しい」から続けられる。<br className="hidden sm:inline" />
                豊中修猷館が大切にしている、剣道だからこそ育まれる力。
              </p>
            </div>
          </FadeInSection>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: 仲間といるのが楽しい */}
            <FadeInSection delay={200}>
              <Link to="/benefits" className="block group h-full">
                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-shuyukan-gold transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
                  <div className="w-full h-40 mb-4 rounded-xl overflow-hidden">
                    <img src="/images/gallery_fun_2.png" alt="仲間との稽古" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-shuyukan-blue mb-2 font-serif">仲間といるのが楽しい</h3>
                  <p className="text-shuyukan-gold text-sm font-bold mb-4">友情・礼</p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-6 flex-1">
                    <li className="flex items-start gap-2">
                      <span className="text-shuyukan-gold">✓</span>
                      <span>あいさつができる</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-shuyukan-gold">✓</span>
                      <span>仲間を大切にする</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-shuyukan-gold">✓</span>
                      <span>勝っても負けても相手を敬う</span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg italic text-left sm:text-center">
                    剣道は一人で強くなる競技ではありません。仲間がいるから楽しい、続けられる。
                  </p>
                  <div className="mt-4 text-shuyukan-blue text-sm font-bold group-hover:text-shuyukan-gold transition-colors">
                    詳しく見る →
                  </div>
                </div>
              </Link>
            </FadeInSection>

            {/* Card 2: できるようになるのが楽しい */}
            <FadeInSection delay={400}>
              <Link to="/benefits" className="block group h-full">
                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-shuyukan-gold transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
                  <div className="w-full h-40 mb-4 rounded-xl overflow-hidden">
                    <img src="/images/4.jpg" alt="挑戦する姿" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-shuyukan-blue mb-2 font-serif">できるようになるのが楽しい</h3>
                  <p className="text-shuyukan-gold text-sm font-bold mb-4">挑戦</p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-6 flex-1">
                    <li className="flex items-start gap-2">
                      <span className="text-shuyukan-gold">✓</span>
                      <span>うまくいかなくてもやめない</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-shuyukan-gold">✓</span>
                      <span>少しずつ上達する喜びを知る</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-shuyukan-gold">✓</span>
                      <span>自分の成長を感じる</span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg italic text-left sm:text-center">
                    昨日より今日、今日より明日。成長そのものが楽しさになる剣道を大切にします。
                  </p>
                  <div className="mt-4 text-shuyukan-blue text-sm font-bold group-hover:text-shuyukan-gold transition-colors">
                    詳しく見る →
                  </div>
                </div>
              </Link>
            </FadeInSection>

            {/* Card 3: 体を動かすのが楽しい */}
            <FadeInSection delay={600}>
              <Link to="/benefits" className="block group h-full">
                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-shuyukan-gold transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
                  <div className="w-full h-40 mb-4 rounded-xl overflow-hidden">
                    <img src="/images/gallery_fun_kids_new.jpg" alt="元気に稽古" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-shuyukan-blue mb-2 font-serif">体を動かすのが楽しい</h3>
                  <p className="text-shuyukan-gold text-sm font-bold mb-4">心と体</p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-6 flex-1">
                    <li className="flex items-start gap-2">
                      <span className="text-shuyukan-gold">✓</span>
                      <span>思いきり動く</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-shuyukan-gold">✓</span>
                      <span>大きな声を出す</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-shuyukan-gold">✓</span>
                      <span>心と体を元気にする</span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg italic text-left sm:text-center">
                    剣道は勉強のための我慢ではなく、心も体もスッキリする時間です。
                  </p>
                  <div className="mt-4 text-shuyukan-blue text-sm font-bold group-hover:text-shuyukan-gold transition-colors">
                    詳しく見る →
                  </div>
                </div>
              </Link>
            </FadeInSection>
          </div>

          {/* CTA Button */}
          <FadeInSection delay={800}>
            <div className="text-center mt-12">
              <Link
                to="/join"
                className="inline-flex items-center gap-3 px-8 py-4 bg-shuyukan-red text-white font-bold rounded-full shadow-lg hover:bg-red-700 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <span>まずは無料体験から</span>
                <span>→</span>
              </Link>
            </div>
          </FadeInSection>
        </section>

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
