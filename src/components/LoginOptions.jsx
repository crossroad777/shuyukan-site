import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginOptions({ onGoogleLogin, onLineLogin }) {
    const { loginWithEmail, loading, liffError } = useAuth();
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState(null);

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!email) return;

        console.log('[LoginOptions] handleEmailLogin triggered for:', email);
        setError(null);
        try {
            const result = await loginWithEmail(email);
            console.log('[LoginOptions] loginWithEmail result:', result);
            if (result.success) {
                setEmailSent(true);
            } else {
                const msg = result.error || '送信に失敗しました。しばらく時間をおいてお試しください。';
                setError(msg);
                alert(msg); // ユーザーに確実に伝えるためのデバッグ用
                console.error('[LoginOptions] Email login failed:', result);
            }
        } catch (err) {
            const msg = 'エラーが発生しました: ' + err.message;
            setError(msg);
            alert(msg); // デバッグ用
            console.error('[LoginOptions] Unexpected error:', err);
        }
    };

    if (emailSent) {
        return (
            <div className="bg-blue-50 border-2 border-blue-200 p-8 rounded-2xl text-center shadow-inner animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl animate-bounce">✉️</span>
                </div>
                <h4 className="font-black text-2xl text-blue-900 mb-3">送信が完了しました！</h4>
                <p className="text-base text-blue-800 leading-relaxed mb-6 font-medium">
                    <span className="block font-bold text-shuyukan-blue mb-2 underline decoration-2">{email}</span>
                    宛にログイン用リンクを送信しました。<br />
                    メールボックス（または迷惑メールフォルダ）を確認し、リンクをクリックしてログインしてください。
                </p>
                <div className="pt-4 border-t border-blue-100">
                    <button
                        onClick={() => setEmailSent(false)}
                        className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <span>←</span> 入力し直す・別のメールアドレスを使う
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Google Login */}
            <button
                onClick={onGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-shuyukan-blue transition shadow-sm disabled:opacity-50"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="font-bold text-gray-700">Googleでログイン</span>
            </button>

            {/* LINE Login */}
            <button
                onClick={onLineLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#06C755] text-white border-2 border-[#06C755] rounded-lg hover:bg-[#05b34c] transition shadow-sm disabled:opacity-50"
            >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M24 10.304c0-4.58-4.57-8.304-12-8.304s-12 3.724-12 8.304c0 4.1 3.63 7.533 8.535 8.196.33.068.78.22 1.004.498.23.284.15.73.07 1.005l-.316 1.838c-.1.54-.45 2.1 1.95 1.144 2.4-1.144 12.924-7.6 12.924-12.88zM8.58 13.916c-.198 0-.36-.16-.36-.36V7.72c0-.198.16-.36.36-.36.198 0 .36.162.36.36v5.835c0 .198-.162.36-.36.36zm2.844-3.56L9.65 13.56c-.05.11-.143.193-.252.193-.2 0-.36-.216-.36-.36 0-.01.005-.022.01-.033l1.737-3.84v-1.8c0-.198.162-.36.36-.36.198 0 .36.16.36.36v1.8c0 .11-.05.215-.152.26zm2.744 3.56h-2.16c-.198 0-.36-.16-.36-.36s.162-.36.36-.36h1.8v-2.028h-1.8c-.198 0-.36-.16-.36-.36s.162-.36.36-.36h1.8V8.44h-1.8c-.198 0-.36-.162-.36-.36s.162-.36.36-.36h2.16c.198 0 .36.162.36.36v5.476c0 .198-.162.36-.36.36zm3.945-3.56L16.34 13.56c-.05.11-.143.193-.252.193-.2 0-.36-.216-.36-.36 0-.01.005-.022.01-.033l1.737-3.84v-1.8c0-.198.162-.36.36-.36.198 0 .36.16.36.36v1.8c0 .11-.05.215-.152.26z" />
                </svg>
                <span className="font-bold">LINEでログイン</span>
            </button>
            {/* LIFF Error Display */}
            {liffError && (
                <p className="text-[10px] text-red-500 text-center mt-1">
                    LINE設定エラー: {liffError}
                </p>
            )}

            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">またはメールでログイン</span>
                </div>
            </div>

            {/* Email Login (Magic Link) */}
            <form onSubmit={handleEmailLogin} className="space-y-3">
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-shuyukan-blue focus:outline-none transition text-center"
                    />
                </div>
                {error && <p className="text-xs text-red-600 text-center">{error}</p>}
                <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full py-4 bg-shuyukan-blue text-white font-black rounded-xl hover:bg-blue-700 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-lg active:scale-95"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <span>✉️</span>
                    )}
                    ログイン用リンクを送る
                </button>
                <p className="text-[10px] text-gray-400 text-center">
                    Yahoo、iCloud、Outlook等の方はこちらをご利用ください。<br />
                    パスワード不要で、メールのリンクからログインできます。
                </p>
            </form>
        </div>
    );
}
