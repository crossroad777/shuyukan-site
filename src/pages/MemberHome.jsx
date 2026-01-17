import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiteFrame from '../components/SiteFrame.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import AdminPortal from '../components/AdminPortal.jsx';
import MemberPortal from '../components/MemberPortal.jsx';
import { useState, useEffect } from 'react';
import { fetchNews } from '../services/newsService';
import { fetchDocuments } from '../services/documentService';

export default function MemberHome() {
    const { user, logout, isAdmin, isMember, isPending, isGuest, loading } = useAuth();

    useEffect(() => {
        console.log('[MemberHome] User State:', { user, isAdmin, isMember, isPending, isGuest });
    }, [user, isAdmin, isMember, isPending, isGuest]);

    const isJunior = (type) => {
        if (!type) return false;
        return type.includes('少年') || type.includes('小') || type.includes('中') || type.includes('幼');
    };
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
    const [documents, setDocuments] = useState([]);
    const [docsLoading, setDocsLoading] = useState(false);

    const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID;
    const isCalendarConfigured = CALENDAR_ID && CALENDAR_ID !== 'YOUR_CALENDAR_ID_HERE';

    useEffect(() => {
        if (isMember || isAdmin) {
            loadMemberNews();
            loadDocuments();
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

    const loadDocuments = async () => {
        setDocsLoading(true);
        try {
            const data = await fetchDocuments();
            setDocuments(data);
        } catch (error) {
            console.error('Failed to load documents:', error);
        } finally {
            setDocsLoading(false);
        }
    };

    const formatSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const getFileIcon = (mimeType) => {
        if (mimeType.includes('pdf')) return '📄';
        if (mimeType.includes('image')) return '🖼️';
        if (mimeType.includes('word') || mimeType.includes('text')) return '📝';
        if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
        return '📁';
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

            {isAdmin ? (
                <AdminPortal user={user} />
            ) : isMember ? (
                <MemberPortal user={user} />
            ) : null}

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
