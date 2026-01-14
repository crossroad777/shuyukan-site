/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Modern Budo Palette (Taisho Inspired)
                'shuyukan-blue': '#001E43', // Deep Indigo (Kachi-iro)
                'shuyukan-dark': '#000f24', // Almost Black
                'shuyukan-gold': '#c5a059', // Muted Gold
                'shuyukan-gold-light': '#e6d5b8', // Light Gold
                'shuyukan-purple': '#6D325E', // Accent Purple (Kodai-murasaki)
                'paper': '#f8f9fa', // Clean White/Off-white
                'shuyukan-red': '#8A1C1C', // Accent Red
            },
            fontFamily: {
                'sans': ['"Inter"', '"Noto Sans JP"', 'sans-serif'],
                'serif': ['"Cinzel"', '"Noto Serif JP"', 'serif'],
            },
            backgroundImage: {
                'bamboo-pattern': "url('/assets/pattern_bamboo.png')",
                'hero-dojo': "url('/assets/hero_bg.png')",
            }
        },
    },
    plugins: [],
}
