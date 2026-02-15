import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiteFrame from '../components/SiteFrame.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import AdminPortal from '../components/AdminPortal.jsx';
import MemberPortal from '../components/MemberPortal.jsx';
import { useState, useEffect } from 'react';
import { fetchNews } from '../services/newsService';
import { fetchDocuments } from '../services/documentService';

const gradeOptions = [
    '幼児',
    '小学1年', '小学2年', '小学3年', '小学4年', '小学5年', '小学6年',
    '中学1年', '中学2年', '中学3年',
    '高校1年', '高校2年', '高校3年',
    '大学生', '一般'
];

export default function MemberHome() {
    const { user, logout, isAdmin, isMember, isPending, isGuest, loading, refreshUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        lastNameFurigana: '',
        firstNameFurigana: '',
        relation: '本人',
        grade: '',
        guardianLastName: '',
        guardianFirstName: '',
        memberLastName: '',
        memberFirstName: '',
        birthYear: '2000',
        birthMonth: '1',
        birthDay: '1',
        email: ''
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [news, setNews] = useState([]);
    const [newsLoading, setNewsLoading] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [docsLoading, setDocsLoading] = useState(false);

    // 認証状態のデバッグ
    useEffect(() => {
        console.log('[MemberHome] Current State:', {
            loading,
            authenticated: !!user,
            email: user?.email,
            role: user?.role,
            isGuest,
            isMember,
            isPending,
            isAdmin
        });

        if (loading) return;

        if (!user) {
            console.warn('[MemberHome] User is not authenticated, showing error/login link');
        } else if (isGuest) {
            console.log('[MemberHome] User is Guest, showing application form');
        } else if (isPending) {
            console.log('[MemberHome] User is Pending, showing waiting message');
        } else if (isAdmin) {
            console.log('[MemberHome] User is ADMIN, showing AdminPortal');
        } else if (isMember) {
            console.log('[MemberHome] User is MEMBER, showing MemberPortal');
        }
    }, [user, loading, isGuest, isMember, isPending, isAdmin]);

    // LINEプロフィールの自動反映（ゲストかつ姓名が未入力の場合のみ）
    useEffect(() => {
        if (isGuest && user?.name && !formData.lastName && !formData.firstName) {
            const fullName = user.name.trim();
            console.log('[MemberHome] Auto-filling name from profile:', fullName);

            // 1. 姓名の分割を試みる（全角・半角スペース両方対応）
            const splitName = fullName.split(/[\s　]+/);

            if (splitName.length >= 2) {
                setFormData(prev => ({
                    ...prev,
                    lastName: splitName[0],
                    firstName: splitName.slice(1).join(' ')
                }));
            } else {
                // 2. スペースがない場合、文字数に応じた日本の姓名用ヒューリスティック
                // 日本人の姓名は4文字(2-2), 3文字(2-1), 2文字(1-1)が多いため、それに応じた推測を行う
                const len = fullName.length;
                let estimatedLast = fullName;
                let estimatedFirst = '';

                if (len === 5) {
                    // 「一条孝太郎」->「一条」「孝太郎」
                    // 5文字の場合は2-3または3-2が考えられるが、2-3を優先（一条 孝太郎 など）
                    estimatedLast = fullName.substring(0, 2);
                    estimatedFirst = fullName.substring(2);
                } else if (len === 4) {
                    // 「鈴木太郎」->「鈴木」「太郎」
                    estimatedLast = fullName.substring(0, 2);
                    estimatedFirst = fullName.substring(2);
                } else if (len === 3) {
                    // 「佐藤健」->「佐藤」「健」
                    estimatedLast = fullName.substring(0, 2);
                    estimatedFirst = fullName.substring(2);
                } else if (len === 2) {
                    // 「王将」->「王」「将」
                    estimatedLast = fullName.substring(0, 1);
                    estimatedFirst = fullName.substring(1);
                }

                setFormData(prev => ({
                    ...prev,
                    lastName: estimatedLast,
                    firstName: estimatedFirst
                }));
                console.log('[MemberHome] Applied name split heuristic:', { estimatedLast, estimatedFirst });
            }
        }
    }, [user, isGuest, formData.lastName, formData.firstName]);


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

    const handleLogout = async () => {
        await logout();
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();

        // メールアドレスのバリデーション
        const emailToUse = formData.email || user.email;
        if (!emailToUse) {
            alert('メールアドレスを入力してください。');
            return;
        }

        setSubmitting(true);
        try {
            const { requestJoin } = await import('../services/memberService');

            // 氏名との結合
            const fullMemberName = formData.relation === '保護者'
                ? `${formData.memberLastName} ${formData.memberFirstName}`.trim()
                : `${formData.lastName} ${formData.firstName}`.trim();

            const fullGuardianName = formData.relation === '保護者'
                ? `${formData.guardianLastName} ${formData.guardianFirstName}`.trim()
                : '';

            const fullFurigana = formData.relation === '保護者'
                ? `${formData.lastNameFurigana} ${formData.firstNameFurigana}`.trim() // 保護者の場合の挙動は検討の余地ありだが現状踏襲
                : `${formData.lastNameFurigana} ${formData.firstNameFurigana}`.trim();

            const submitData = {
                name: fullMemberName,
                furigana: fullFurigana,
                email: emailToUse,
                guardianName: fullGuardianName,
                grade: formData.grade,
                birthDate: `${formData.birthYear}-${String(formData.birthMonth).padStart(2, '0')}-${String(formData.birthDay).padStart(2, '0')}`,
                notes: `申請者区分: ${formData.relation}`,
                memberType: formData.relation === '保護者' ? '少年部' : '一般部',
                lineId: user.lineId
            };

            const result = await requestJoin(submitData);
            if (result) {
                setSubmitted(true);
                // ページをスクロールトップへ
                window.scrollTo(0, 0);
                // 最新のステータス（pending）を反映するためにユーザー情報を更新
                await refreshUser();
            }
        } catch (error) {
            console.error('Request submission error:', error);
            alert(`申請の送信に失敗しました: ${error.message || '不明なエラー'}`);
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
        <SiteFrame title="マイページ">
            {/* ロール識別ヘッダー (プレミアムIDカード設計) */}
            <div className={`mb-8 p-0.5 rounded-2xl shadow-sm border overflow-hidden ${isAdmin ? 'bg-red-50 border-red-100' : isMember ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                <div className="bg-white/80 backdrop-blur-sm rounded-[14px] px-3 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto overflow-hidden">
                        <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-sm ${isAdmin ? 'bg-red-600 text-white shadow-red-200' : isMember ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-gray-500 text-white shadow-gray-200'}`}>
                            <span className="text-xl sm:text-2xl">{isAdmin ? '🛡️' : isMember ? '👤' : '⌛'}</span>
                        </div>
                        <div className="flex-grow min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-0.5">
                                <h2 className="text-base sm:text-xl font-bold font-serif text-slate-800 truncate">
                                    {user.name} <span className="text-[10px] sm:text-sm font-normal text-slate-500">様</span>
                                </h2>
                                <span className={`px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold tracking-wider uppercase inline-block whitespace-nowrap ${isAdmin ? 'bg-red-600 text-white' : isMember ? 'bg-blue-600 text-white' : 'bg-gray-500 text-white'}`}>
                                    {isAdmin ? 'ADMIN' : isMember ? 'REGULAR' : 'PENDING'}
                                </span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto sm:border-l sm:pl-6 border-slate-100">
                        <button
                            onClick={handleLogout}
                            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <span>🚪</span> ログアウト
                        </button>
                    </div>
                </div>
            </div>

            {isAdmin ? (
                <AdminPortal user={user} />
            ) : isMember ? (
                // 在籍メンバー（承認済み）は常にポータル画面（メニュー）を表示
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
                            <div className="text-6xl mb-4">✨</div>
                            <h3 className="text-2xl font-bold text-shuyukan-blue mb-2">ご入会ありがとうございます。</h3>
                            <p className="text-gray-700 font-medium">利用申請を送信しました。<br />管理者が承認するまで今しばらくお待ちください。</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="mb-4">
                                    <span className="text-6xl text-shuyukan-blue">📝</span>
                                </div>
                                <h3 className="text-2xl font-bold text-shuyukan-blue mb-2">部員ポータル利用申請</h3>
                                <p className="text-gray-500">部員専用ページを表示するため、情報を入力してください</p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                                <form onSubmit={handleRequestSubmit} className="space-y-6">
                                    {/* 部員との関係 */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">部員との関係 *</label>
                                        <select
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue text-lg"
                                            value={formData.relation}
                                            onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                                        >
                                            <option>本人</option>
                                            <option>保護者</option>
                                            <option>その他</option>
                                        </select>
                                    </div>

                                    {/* 保護者の場合: 保護者名と部員名 */}
                                    {formData.relation === '保護者' ? (
                                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">保護者氏名 (申請者) *</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                        value={formData.guardianLastName}
                                                        onChange={(e) => setFormData({ ...formData, guardianLastName: e.target.value })}
                                                        placeholder="姓"
                                                    />
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                        value={formData.guardianFirstName}
                                                        onChange={(e) => setFormData({ ...formData, guardianFirstName: e.target.value })}
                                                        placeholder="名"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">部員氏名 (お子様) *</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                        value={formData.memberLastName}
                                                        onChange={(e) => setFormData({ ...formData, memberLastName: e.target.value })}
                                                        placeholder="姓"
                                                    />
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                        value={formData.memberFirstName}
                                                        onChange={(e) => setFormData({ ...formData, memberFirstName: e.target.value })}
                                                        placeholder="名"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">ふりがな (部員)</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                        value={formData.lastNameFurigana}
                                                        onChange={(e) => setFormData({ ...formData, lastNameFurigana: e.target.value })}
                                                        placeholder="せい"
                                                    />
                                                    <input
                                                        type="text"
                                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                        value={formData.firstNameFurigana}
                                                        onChange={(e) => setFormData({ ...formData, firstNameFurigana: e.target.value })}
                                                        placeholder="めい"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">生年月日 (部員) *</label>
                                                <div className="flex gap-2">
                                                    <select
                                                        className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                        value={formData.birthYear}
                                                        onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                                                    >
                                                        {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                                            <option key={y} value={y}>{y}年</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        className="w-24 border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                        value={formData.birthMonth}
                                                        onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                                                    >
                                                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                                            <option key={m} value={m}>{m}月</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        className="w-24 border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                        value={formData.birthDay}
                                                        onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                                                    >
                                                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                                            <option key={d} value={d}>{d}日</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">氏名 *</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                        value={formData.lastName}
                                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                        placeholder="姓"
                                                    />
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                        value={formData.firstName}
                                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                        placeholder="名"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">ふりがな</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                        value={formData.lastNameFurigana}
                                                        onChange={(e) => setFormData({ ...formData, lastNameFurigana: e.target.value })}
                                                        placeholder="せい"
                                                    />
                                                    <input
                                                        type="text"
                                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                        value={formData.firstNameFurigana}
                                                        onChange={(e) => setFormData({ ...formData, firstNameFurigana: e.target.value })}
                                                        placeholder="めい"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">生年月日 *</label>
                                                <div className="flex gap-2">
                                                    <select
                                                        className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                        value={formData.birthYear}
                                                        onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                                                    >
                                                        {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                                            <option key={y} value={y}>{y}年</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        className="w-24 border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                        value={formData.birthMonth}
                                                        onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                                                    >
                                                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                                            <option key={m} value={m}>{m}月</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        className="w-24 border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                        value={formData.birthDay}
                                                        onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                                                    >
                                                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                                            <option key={d} value={d}>{d}日</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 学年・区分 - 追加 */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">学年・区分 *</label>
                                        <select
                                            required
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue text-lg"
                                            value={formData.grade}
                                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                        >
                                            <option value="">選択してください</option>
                                            {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>

                                    {/* メールアドレス */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            メールアドレス (Gmail推奨) *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                            value={formData.email || user?.email || ''}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="example@gmail.com"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            ※ ログインに使用するGoogleアカウントのアドレスを入力してください。
                                        </p>
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
