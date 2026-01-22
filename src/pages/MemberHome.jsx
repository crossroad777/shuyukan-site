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

/**
 * 初回プロフィール登録フォーム
 */
function ProfileSetupForm({ user, onComplete }) {
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: user.memberData?.name || user.name || '',
        furigana: user.memberData?.furigana || '',
        birthDate: user.memberData?.birthDate || '',
        phone: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { setupProfile } = await import('../services/memberService');
            const result = await setupProfile(user.email, formData);
            // 成功でもエラーでも完了フラグを設定してループ防止
            localStorage.setItem('profileSetupDone_' + user.email, 'true');
            if (result.success) {
                // ページリロードせずに状態で切り替え
                onComplete();
            } else {
                console.error('Profile setup failed:', result.error);
                // エラーでも部員画面に進む（データは後で再入力可能）
                onComplete();
            }
        } catch (error) {
            console.error('Profile setup error:', error);
            // エラーでも完了とみなしてループ防止
            localStorage.setItem('profileSetupDone_' + user.email, 'true');
            onComplete();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-8 animate-fade-in">
            <div className="bg-white border-2 border-shuyukan-gold rounded-2xl p-6 shadow-xl">
                <div className="text-center mb-6">
                    <div className="text-4xl mb-3">✨</div>
                    <h3 className="text-xl font-bold text-shuyukan-blue mb-2">ご登録ありがとうございます！</h3>
                    <p className="text-sm text-gray-600">
                        簡単なプロフィールを入力して開始しましょう。
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">氏名 *</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-lg shadow-sm"
                            placeholder="山田 太郎"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">ふりがな *</label>
                        <input
                            type="text"
                            name="furigana"
                            required
                            value={formData.furigana}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-lg shadow-sm"
                            placeholder="やまだ たろう"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">生年月日 *</label>
                        <div className="flex gap-2">
                            <select
                                required
                                value={formData.birthDate ? formData.birthDate.split('-')[0] : ''}
                                onChange={(e) => {
                                    const parts = (formData.birthDate || '--').split('-');
                                    parts[0] = e.target.value;
                                    handleChange({ target: { name: 'birthDate', value: parts.join('-') } });
                                }}
                                className="flex-1 border-gray-300 rounded-lg shadow-sm"
                            >
                                <option value="">年</option>
                                {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                    <option key={y} value={y}>{y}年</option>
                                ))}
                            </select>
                            <select
                                required
                                value={formData.birthDate ? formData.birthDate.split('-')[1] : ''}
                                onChange={(e) => {
                                    const parts = (formData.birthDate || '--').split('-');
                                    parts[1] = e.target.value;
                                    handleChange({ target: { name: 'birthDate', value: parts.join('-') } });
                                }}
                                className="w-20 border-gray-300 rounded-lg shadow-sm"
                            >
                                <option value="">月</option>
                                {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(m => (
                                    <option key={m} value={m}>{parseInt(m)}月</option>
                                ))}
                            </select>
                            <select
                                required
                                value={formData.birthDate ? formData.birthDate.split('-')[2] : ''}
                                onChange={(e) => {
                                    const parts = (formData.birthDate || '--').split('-');
                                    parts[2] = e.target.value;
                                    handleChange({ target: { name: 'birthDate', value: parts.join('-') } });
                                }}
                                className="w-20 border-gray-300 rounded-lg shadow-sm"
                            >
                                <option value="">日</option>
                                {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(d => (
                                    <option key={d} value={d}>{parseInt(d)}日</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">電話番号 *</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border-gray-300 rounded-lg shadow-sm"
                            placeholder="090-0000-0000"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-shuyukan-blue text-white font-bold py-4 rounded-xl hover:bg-shuyukan-gold hover:text-shuyukan-blue transition shadow-lg disabled:opacity-50 text-lg"
                        >
                            {submitting ? '保存中...' : '登録して開始する'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


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
    // プロフィール設定完了フラグ（Reactの状態で管理）
    const [profileSetupCompleted, setProfileSetupCompleted] = useState(() => {
        // 初期値: localStorageにフラグがあればtrue
        return !!localStorage.getItem('profileSetupDone_' + user?.email);
    });
    const [formData, setFormData] = useState({
        name: '',
        furigana: '',
        relation: '本人',
        grade: '',
        guardianName: '',
        memberName: '',
        email: ''
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

        // メールアドレスのバリデーション
        const emailToUse = formData.email || user.email;
        if (!emailToUse) {
            alert('メールアドレスを入力してください。');
            return;
        }

        setSubmitting(true);
        try {
            const { requestJoin } = await import('../services/memberService');

            // 保護者の場合は部員名をnameに、保護者名をguardianNameに
            const submitData = {
                name: formData.relation === '保護者' ? formData.memberName : formData.name,
                furigana: formData.furigana,
                email: emailToUse,
                guardianName: formData.relation === '保護者' ? formData.guardianName : '',
                grade: formData.grade,
                notes: `申請者区分: ${formData.relation}`,
                memberType: formData.relation === '保護者' ? '少年部' : '一般部'
            };

            await requestJoin(submitData);
            setSubmitted(true);
            setTimeout(() => {
                window.location.reload();
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
            {/* ロール識別ヘッダー */}
            <div className={`mb-8 p-1 rounded-xl shadow-sm border ${isAdmin ? 'bg-red-50 border-red-100' : isMember ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl shadow-sm ${isAdmin ? 'bg-red-600 text-white' : isMember ? 'bg-blue-600 text-white' : 'bg-gray-500 text-white'}`}>
                            <span className="text-2xl">{isAdmin ? '🛡️' : isMember ? '👤' : '⌛'}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold font-serif text-slate-800">{user.name} 様</h2>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${isAdmin ? 'bg-red-600 text-white shadow-sm' : isMember ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-500 text-white'}`}>
                                    {isAdmin ? 'ADMINISTRATOR' : isMember ? 'REGULAR MEMBER' : 'PENDING'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <span>🚪</span> ログアウト
                        </button>
                    </div>
                </div>
            </div>

            {isAdmin ? (
                <AdminPortal user={user} />
            ) : isMember ? (
                // 在籍メンバーかつプロフィール未設定の場合（状態とlocalStorageフラグをチェック）
                (!user.memberData?.birthDate && !profileSetupCompleted) ? (
                    <ProfileSetupForm user={user} onComplete={() => setProfileSetupCompleted(true)} />
                ) : (
                    <MemberPortal user={user} />
                )
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
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                    value={formData.guardianName}
                                                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                                                    placeholder="例：山田 花子"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">部員氏名 (お子様) *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                    value={formData.memberName}
                                                    onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
                                                    placeholder="例：山田 太郎"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">ふりがな (部員)</label>
                                                <input
                                                    type="text"
                                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                    value={formData.furigana}
                                                    onChange={(e) => setFormData({ ...formData, furigana: e.target.value })}
                                                    placeholder="例：やまだ たろう"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">氏名 (フルネーム) *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="例：山田 太郎"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">ふりがな</label>
                                                <input
                                                    type="text"
                                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-shuyukan-blue focus:ring-shuyukan-blue"
                                                    value={formData.furigana}
                                                    onChange={(e) => setFormData({ ...formData, furigana: e.target.value })}
                                                    placeholder="例：やまだ たろう"
                                                />
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
