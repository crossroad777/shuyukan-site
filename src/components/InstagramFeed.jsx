import React from 'react';
import { instagramPosts } from '../data/instagram';

export default function InstagramFeed() {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-serif font-bold text-shuyukan-blue flex items-center justify-center gap-3">
                        <span className="text-shuyukan-gold text-xl">📷</span> 公式Instagram
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">道場の様子を日々発信しています</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {instagramPosts.map((post) => (
                        <a
                            key={post.id}
                            href="#"
                            className="group relative block aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            <img
                                src={post.image}
                                alt={post.caption}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <p className="text-white text-xs line-clamp-2 mb-1">{post.caption}</p>
                                <div className="flex items-center text-shuyukan-gold text-xs">
                                    <span className="mr-1">❤️</span> {post.likes}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <a
                        href="https://www.instagram.com/shuyukan.toyonaka.kumanoda/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-2 border-2 border-shuyukan-blue text-shuyukan-blue font-bold rounded-full hover:bg-shuyukan-blue hover:text-white transition-colors"
                    >
                        公式アカウントをフォロー
                    </a>
                </div>
            </div>
        </section>
    );
}
