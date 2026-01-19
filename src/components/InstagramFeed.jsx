import React from 'react';
import { Instagram } from 'lucide-react';
import { instagramPosts } from '../data/instagram';

export default function InstagramFeed() {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-serif font-bold text-shuyukan-blue flex items-center justify-center gap-3">
                        <span className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                            <Instagram size={24} className="text-white" />
                        </span>
                        公式Instagram
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
                        className="inline-flex items-center gap-2 px-6 py-2 border-2 border-pink-500 text-pink-500 font-bold rounded-full hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 hover:text-white hover:border-transparent transition-all"
                    >
                        <Instagram size={20} />
                        公式Instagramを見る
                    </a>
                </div>
            </div>
        </section>
    );
}
