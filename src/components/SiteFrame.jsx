import React from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function SiteFrame({ title, children, hero }) {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-paper selection:bg-shuyukan-gold selection:text-shuyukan-blue">
      <Navbar />

      {/* Hero Section or Navbar Spacer */}
      {hero ? (
        <div className="w-full relative">
          {hero}
        </div>
      ) : (
        <div className="h-20 bg-shuyukan-dark" />
      )}

      {/* Main Content */}
      <main className={`flex-grow w-full ${hero ? '' : 'pt-8'} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12`}>
        {title && (
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-serif font-bold text-shuyukan-blue mb-3">{title}</h1>
            <div className="w-16 h-1 bg-shuyukan-gold mx-auto rounded-full" />
          </div>
        )}

        {/* Content Wrapper */}
        <div className="bg-white/50 backdrop-blur-sm shadow-sm rounded-sm p-6 md:p-10 border border-gray-100/50">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
