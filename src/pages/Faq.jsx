/**
 * Author: BaseLine Designs.com
 * Version: v0.1
 * Last Updated: 2026-01-10 JST
 * Changes: Initial demo page
 */
import React from 'react';
import SiteFrame from '../components/SiteFrame.jsx';

const faqs = [
  {
    q: "初心者でも大丈夫ですか？",
    a: "全く問題ありません。当道場の約半数が大人になってから剣道を始めた方です。基礎体作りから丁寧に指導しますので、運動未経験の方でも安心してご参加ください。"
  },
  {
    q: "必要な道具は？すぐに購入する必要がありますか？",
    a: "最初は動きやすい服装（ジャージなど）で参加いただけます。入会後、1〜2ヶ月ほど稽古を続けてから、竹刀や剣道着、防具を段階的に揃えていきます。購入時期や選び方については指導陣が相談に乗ります。"
  },
  {
    q: "費用はどのくらいかかりますか？",
    a: "入会金3,000円、月会費は一般会員3,000円、学生2,000円です。その他、スポーツ保険（年間1,850円〜）への加入が必要です。防具一式は初心者用セットで4〜6万円程度が目安です。"
  },
  {
    q: "保護者の当番はありますか？",
    a: "基本的にはありませんが、大会時や合宿時などのイベントの際に、有志でお手伝いをお願いすることがあります。強制ではありませんので、ご家庭の事情に合わせてご協力いただければ幸いです。"
  },
  {
    q: "見学や体験はできますか？",
    a: "はい、随時受け付けています。「稽古日程」を確認の上、直接道場にお越しいただくか、お問い合わせフォームよりご予約ください。"
  },
  {
    q: "写真は公開されますか？",
    a: "いいえ、ご本人（お子様の場合は保護者の方）の許可なく、お写真をウェブサイトやSNSに掲載することはございません。入会時に掲載の可否を確認させていただきますので、ご安心ください。掲載を希望されない場合は、遠慮なくお申し出ください。"
  }
];

export default function Faq() {
  // JSON-LD構造化データを生成
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <SiteFrame title="よくある質問">
      {/* JSON-LD構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((item, index) => (
          <details key={index} className="group bg-white border border-gray-200 rounded-lg shadow-sm open:shadow-md transition-all duration-200">
            <summary className="flex justify-between items-center cursor-pointer p-6 font-bold text-shuyukan-blue text-lg list-none">
              <span className="flex items-center gap-3">
                <span className="text-shuyukan-gold text-xl">Q.</span>
                {item.q}
              </span>
              <span className="text-gray-400 group-open:rotate-180 transition-transform duration-300">
                ▼
              </span>
            </summary>
            <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
              <span className="font-bold text-shuyukan-red mr-2">A.</span>
              {item.a}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-12 text-center bg-blue-50 p-8 rounded-lg border border-blue-100">
        <p className="text-shuyukan-dark mb-4 font-bold">その他、ご不明な点はありますか？</p>
        <a
          href="/contact"
          className="inline-block bg-shuyukan-blue text-white font-bold py-3 px-8 rounded hover:bg-shuyukan-gold hover:text-shuyukan-blue transition-colors"
        >
          お問い合わせフォームへ
        </a>
      </div>
    </SiteFrame>
  );
}
