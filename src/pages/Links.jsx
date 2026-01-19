import React from 'react';
import SiteFrame from '../components/SiteFrame.jsx';
import FadeInSection from '../components/FadeInSection.jsx';

const LinkCard = ({ title, url, description, isOfficial }) => (
    <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`group block p-6 bg-white rounded-lg shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isOfficial
            ? 'border-l-4 border-l-shuyukan-gold hover:border-shuyukan-red'
            : 'hover:border-shuyukan-gold/50'
            }`}
    >
        <div className="flex justify-between items-start mb-2">
            <h4 className="text-xl font-bold font-serif text-shuyukan-blue group-hover:text-shuyukan-red transition-colors">
                {title}
            </h4>
            <span className="text-gray-300 group-hover:text-shuyukan-gold transition-colors">
                ↗
            </span>
        </div>
        {description && (
            <p className="text-sm text-gray-600 leading-relaxed font-sans">
                {description}
            </p>
        )}
    </a>
);

export default function Links() {
    const links = [
        {
            category: "公的機関・関連団体",
            icon: "🏢",
            description: "所属組織および公的情報の確認",
            items: [
                { name: "全日本剣道連盟", url: "https://www.kendo.or.jp/", description: "剣道の普及振興を図る統括団体", isOfficial: true },
                { name: "大阪府剣道連盟", url: "https://osa-kendo.or.jp/", description: "大阪府内の剣道活動を統括", isOfficial: true },
                { name: "豊中市剣道協会", url: "http://toyonakakendo.blog.fc2.com/", description: "豊中市内の剣道行事・大会情報など", isOfficial: true },
            ]
        },
        {
            category: "近隣道場・関連施設",
            icon: "⚔️",
            description: "豊中市内で活動する友好団体および主要な稽古場所",
            items: [
                { name: "豊中市立武道館ひびき", url: "https://www.city.toyonaka.osaka.jp/shisetsu/sports/budoukan.html", description: "主要な稽古場所・試合会場" },
                { name: "西丘剣友会", url: "https://nishiokakenyukai.crayonsite.com/" },
                { name: "いずみ会", url: "https://osa-kendo.or.jp/dojo?gid=585", description: "大阪府剣道連盟 加盟団体" },
                { name: "初心会", url: "https://osa-kendo.or.jp/dojo?gid=606", description: "大阪府剣道連盟 加盟団体" },
                { name: "豊中剣道教室 (豊剣教)", url: "https://osa-kendo.or.jp/dojo?gid=607", description: "大阪府剣道連盟 加盟団体" },
                { name: "小曽根剣友会", url: "https://ozoneterauchi.1web.jp/" },
                { name: "庄内南剣道クラブ", url: "https://shominakendo.amebaownd.com/" },
                { name: "千里剣心会", url: "https://senri-kenshinkai.net/" },
                { name: "野田剣友会仁風館", url: "https://ameblo.jp/nodajinpukan/", description: "公式ブログ" },
                { name: "豊南剣修館", url: "https://honankenshukan.wixsite.com/toppage" },
                { name: "豊中南桜塚剣友会", url: "https://minasakukennyuukai.wixsite.com/home" },
                { name: "少路剣道クラブ", url: "http://shojikendoclub.blogspot.com/" },
                { name: "あすなろ剣友会", url: "https://osa-kendo.or.jp/dojo?gid=140", description: "大阪府剣道連盟 加盟団体" },
                { name: "庄内講武会", url: "https://osa-kendo.or.jp/dojo?gid=142", description: "大阪府剣道連盟 加盟団体" },
                { name: "東丘剣友会", url: "https://osa-kendo.or.jp/dojo?gid=143", description: "大阪府剣道連盟 加盟団体" },
                { name: "寺内剣友会", url: "https://osa-kendo.or.jp/dojo?gid=144", description: "大阪府剣道連盟 加盟団体" },
                { name: "さくら剣友会", url: "https://osa-kendo.or.jp/dojo?gid=1506", description: "大阪府剣道連盟 加盟団体" },
            ]
        },
        {
            category: "安全・保険",
            icon: "🛡️",
            description: "安心・安全に稽古を行うための取り組み",
            items: [
                { name: "公益財団法人 スポーツ安全協会", url: "https://www.sportsanzen.org/", description: "当会が加入している「スポーツ安全保険」の案内。怪我への対応や補償内容について。", isOfficial: true },
            ]
        }
    ];

    return (
        <SiteFrame title="リンク集">
            <div className="space-y-16">
                {links.map((section, index) => (
                    <section key={section.category}>
                        <FadeInSection delay={index * 200}>
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-3xl">{section.icon}</span>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-shuyukan-blue">
                                        {section.category}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-sans mt-1">
                                        {section.description}
                                    </p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {section.items.map((item) => (
                                    <LinkCard
                                        key={item.name}
                                        title={item.name}
                                        url={item.url}
                                        description={item.description}
                                        isOfficial={item.isOfficial}
                                    />
                                ))}
                            </div>
                        </FadeInSection>
                    </section>
                ))}
            </div>
        </SiteFrame>
    );
}
