import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiteFrame from '../components/SiteFrame.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import AdminDashboard from '../components/AdminDashboard.jsx';
import { useState, useEffect } from 'react';
import { fetchNews } from '../services/newsService';

export default function MemberHome() {
    const { user, logout, isAdmin, isMember, isPending, isGuest, loading } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        furigana: '',
        relation: '本人'
    });

    const [news, setNews] = useState([]);
    const [newsLoading, setNewsLoading] = useState(false);

    useEffect(() => {
        if (isMember || isAdmin) {
            loadMemberNews();
        }
    }, [isMember, isAdmin]);

    const loadMemberNews = async () => {
        setNewsLoading(true);
        try {
            const allNews = await fetchNews();
            // 部員向けカテゴリ、または固定されているものを優先表示
            const memberNews = allNews.filter(n =>
                n.category === '部員向け' || n.category === '重要' || n.isPinned === true || n.isPinned === "TRUE"
            ).slice(0, 5);
            setNews(memberNews);
        } catch (error) {
            console.error('Failed to load member news:', error);
        } finally {
            setNewsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // memberServiceのrequestJoinを呼ぶ
            const { requestJoin } = await import('../services/memberService');
            await requestJoin({
                name: formData.name,
                furigana: formData.furigana,
                email: user.email,
                notes: `申請者区分: ${formData.relation}`,
                memberType: formData.relation === '本人' ? '一般部' : '少年部' // 暫定
            });
            setSubmitted(true);
            // 実際はここでリロードするか、Authの再取得が必要だが、pending表示にするためにモックならすぐに反映される
            setTimeout(() => {
                window.location.reload(); // ステータス再取得のため
            }, 3000);
        } catch (error) {
            alert('申請の送信に失敗しました。');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <SiteFrame title="読み込み中">
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-shuyukan-blue"></div>
                </div>
            </SiteFrame>
        );
    }

    if (!user) {
        return (
            <SiteFrame title="エラー">
                <div className="text-center py-12">
                    <p className="text-red-500 mb-4">ログインが必要です。</p>
                    <a href="/login" className="text-shuyukan-blue underline font-bold px-6 py-3 border-2 border-shuyukan-blue rounded-full hover:bg-shuyukan-blue hover:text-white transition">ログインページへ</a>
                </div>
            </SiteFrame>
        );
    }

    return (
        <SiteFrame title={`マイページ (${user.name})`}>
            {/* 共通のトップバー */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${isAdmin ? 'bg-red-100 text-red-700' :
                        isMember ? 'bg-green-100 text-green-700' :
                            isPending ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {isAdmin ? '管理者' : isMember ? '正会員' : isPending ? '承認待ち' : '未登録'}
                    </span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-sm font-bold transition-colors"
                >
                    ログアウト
                </button>
            </div>

            {isAdmin && <AdminDashboard user={user} />}

            {isMember && (
                <div className="space-y-8 animate-fade-in">
                    {/* Member Notification Area */}
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
                        <h3 className="font-bold text-lg text-shuyukan-blue mb-4 flex items-center gap-2">
                            <span>📢</span> 部員専用のお知らせ
                        </h3>
                        {newsLoading ? (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-shuyukan-blue"></div>
                            </div>
                        ) : news.length > 0 ? (
                            <ul className="space-y-3">
                                {news.map((item) => (
                                    <li key={item.id} className="flex items-start gap-3 bg-white/50 p-2 rounded hover:bg-white transition">
                                        <span className="text-shuyukan-blue font-mono text-xs mt-1">{item.date}</span>
                                        <div className="flex-1">
                                            <p className="text-gray-800 font-bold text-sm leading-snug">
                                                {item.isPinned && <span className="mr-1 text-shuyukan-gold">📌</span>}
                                                {item.title}
                                            </p>
                                            {item.content && <p className="text-gray-500 text-xs mt-1 line-clamp-2">{item.content}</p>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm">現在、新しいお知らせはありません。</p>
                        )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">📂 部員用ドキュメント</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button className="flex items-center gap-3 p-3 border rounded hover:border-shuyukan-blue hover:bg-blue-50 transition text-left group">
                                        <span className="text-2xl group-hover:scale-110 transition">📄</span>
                                        <div>
                                            <p className="text-sm font-bold">部員用マニュアル</p>
                                            <p className="text-xs text-gray-400">PDF / 1.2MB</p>
                                        </div>
                                    </button>
                                    <button className="flex items-center gap-3 p-3 border rounded hover:border-shuyukan-blue hover:bg-blue-50 transition text-left group">
                                        <span className="text-2xl group-hover:scale-110 transition">📄</span>
                                        <div>
                                            <p className="text-sm font-bold">施設利用時の注意点</p>
                                            <p className="text-xs text-gray-400">PDF / 0.8MB</p>
                                        </div>
                                    </button>
                                    <button className="flex items-center gap-3 p-3 border rounded hover:border-shuyukan-blue hover:bg-blue-50 transition text-left group">
                                        <span className="text-2xl group-hover:scale-110 transition">📄</span>
                                        <div>
                                            <p className="text-sm font-bold">昇段・昇級審査申込書</p>
                                            <p className="text-xs text-gray-400">Word / 0.5MB</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h4 className="font-bold text-gray-800">📅 稽古スケジュール</h4>
                                    <a href="https://calendar.google.com" target="_blank" rel="noreferrer" className="text-xs text-shuyukan-blue hover:underline">Googleカレンダーで開く ↗</a>
                                </div>
                                <div className="aspect-video w-full bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                    {/* Google Calendar Iframe Placeholder */}
                                    <p className="text-gray-400 text-sm p-4 text-center">
                                        Googleカレンダーをここに埋め込みます。<br />
                                        <span className="text-xs">（カレンダーIDを設定すると表示されます）</span>
                                    </p>
                                    {/* 
                                    <iframe 
                                        src="https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID&ctz=Asia%2FTokyo" 
                                        style={{border: 0}} 
                                        width="100%" 
                                        height="100%" 
                                        frameBorder="0" 
                                        scrolling="no"
                                    ></iframe> 
                                    */}
                                </div>
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm font-bold text-gray-700">📌 直近の予定（手動入力分）</p>
                                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                                        <div className="text-center bg-white px-3 py-1 rounded border min-w-[60px]">
                                            <p className="text-xs text-gray-500">1/24</p>
                                            <p className="font-bold">土</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-shuyukan-blue text-sm">15:00〜17:00 通常稽古</p>
                                            <p className="text-xs text-gray-500 line-clamp-1">場所：分館 / 鍵当番：田中様</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center">
                                <div className="w-20 h-20 bg-shuyukan-blue/10 text-shuyukan-blue rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                                    {isJunior(user.memberData?.memberType) ? '🥋' : '👤'}
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg">{user.memberData?.name || user.name}</h4>
                                <p className="text-sm text-gray-500 mb-4">{user.memberData?.memberType || (isAdmin ? '管理者' : '一般')}</p>

                                <div className="space-y-2 text-sm text-left">
                                    <div className="bg-gray-50 p-2 rounded flex justify-between">
                                        <span className="text-gray-400 text-xs">会員番号</span>
                                        <span className="font-bold font-mono">{user.memberData?.id || '-'}</span>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded flex justify-between">
                                        <span className="text-gray-400 text-xs">段級位</span>
                                        <span className="font-bold">{user.memberData?.rank || '未設定'}</span>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded flex justify-between">
                                        <span className="text-gray-400 text-xs">入会日</span>
                                        <span className="font-bold">{user.memberData?.joinDate || '-'}</span>
                                    </div>
                                </div>

                                {isAdmin && (
                                    <button
                                        onClick={() => navigate('/member')} // 実際は管理タブへ
                                        className="w-full mt-4 py-2 border border-shuyukan-blue text-shuyukan-blue rounded text-xs font-bold hover:bg-shuyukan-blue hover:text-white transition"
                                    >
                                        管理画面へ
                                    </button>
                                )}
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">🔑 鍵当番のお知らせ</h4>
                                <div className="p-3 bg-shuyukan-gold/10 border border-shuyukan-gold/20 rounded text-sm">
                                    <p className="font-bold text-shuyukan-blue mb-1">今週の担当</p>
                                    <p className="text-gray-800">1月19日(月)〜1月25日(日)</p>
                                    <p className="text-lg font-bold text-gray-900 mt-1">田中・佐藤 様（少年部）</p>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">※当番の交代を希望される場合は、早めに事務局までご連絡ください。</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isPending && (
                <div className="max-w-xl mx-auto py-12 text-center animate-fade-in">
                    <div className="mb-6">
                        <span className="text-6xl animate-pulse">⏳</span>
                    </div>
                    <h3 className="text-2xl font-bold text-shuyukan-blue mb-4">利用承認待ち</h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        アカウントの利用申請を受け付けました。<br />
                        現在、管理者が確認を行っております。<br />
                        承認が完了するまで、もうしばらくお待ちください。
                    </p>
                    <div className="bg-yellow-50 p-4 rounded border border-yellow-200 text-yellow-800 text-sm">
                        承認されると、部員専用のお知らせやドキュメントが閲覧可能になります。
                    </div>
                </div>
            )}

            {isGuest && (
                <div className="max-w-xl mx-auto py-8 animate-fade-in">
                    {submitted ? (
                        <div className="text-center py-12 bg-green-50 rounded-xl border border-green-200">
                            <div className="text-6xl mb-4">✅</div>
                            <h3 className="text-2xl font-bold text-green-800 mb-2">送信完了</h3>
                            <p className="text-green-700">利用申請を送信しました。承認をお待ちください。</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="mb-4">
                                    <span className="text-6xl">📝</span>
                                </div>
                                <h3 className="text-2xl font-bold text-shuyukan-blue mb-2">利用申請</h3>
                                <p className="text-gray-500">部員ポータルを利用するには申請が必要です</p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                                <form onSubmit={handleRequestSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">氏名 (フルネーム)</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border rounded px-3 py-2 text-lg"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="山田 太郎"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">ふりがな</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border rounded px-3 py-2 text-lg"
                                            value={formData.furigana}
                                            onChange={(e) => setFormData({ ...formData, furigana: e.target.value })}
                                            placeholder="やまだ たろう"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">部員との関係</label>
                                        <select
                                            className="w-full border rounded px-3 py-2 text-lg"
                                            value={formData.relation}
                                            onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                                        >
                                            <option>本人</option>
                                            <option>保護者</option>
                                            <option>その他（指導者・OB等）</option>
                                        </select>
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-shuyukan-blue text-white font-bold py-4 rounded-lg hover:bg-shuyukan-gold hover:text-shuyukan-blue transition shadow-md disabled:opacity-50"
                                        >
                                            {submitting ? '送信中...' : '利用申請を送信する'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            )}
        </SiteFrame>
    );
}
