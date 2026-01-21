import React, { useState, useEffect } from 'react';
import { fetchInquiries, replyToInquiry } from '../services/inquiryService';

export default function InquiryManager() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('未対応');
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        loadInquiries();
    }, []);

    const loadInquiries = async () => {
        setLoading(true);
        const data = await fetchInquiries();
        setInquiries(data);
        setLoading(false);
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!selectedInquiry || !replyMessage) return;

        setSending(true);
        try {
            await replyToInquiry(selectedInquiry.id, selectedInquiry.email, replyMessage);
            setMessage({ text: '返信を送信しました。', type: 'success' });
            setSelectedInquiry(null);
            setReplyMessage('');
            await loadInquiries();
        } catch (error) {
            setMessage({ text: '送信に失敗しました: ' + error.message, type: 'error' });
        } finally {
            setSending(false);
        }
    };

    const templates = [
        {
            label: '体験入会（案内）',
            text: `お問い合わせありがとうございます。豊中修猷館剣道部です。
体験入会はいつでも大歓迎です！
直近の稽古日は ○月○日(曜) 9:00〜11:00 となっております。
場所は修猷館道場です。
当日は動きやすい服装でお越しください。竹刀などの道具はお貸し出しいたします。
当日お会いできるのを楽しみにしております。`
        },
        {
            label: '一般問い合わせ（受付）',
            text: `お問い合わせありがとうございます。豊中修猷館剣道部 事務局です。
内容を賜りました。担当者にて確認の上、追って改めてご連絡させていただきます。
今しばらくお待ちいただけますようお願い申し上げます。`
        }
    ];

    const filteredInquiries = inquiries.filter(i => {
        if (filter === 'all') return true;
        if (filter === '未対応') return i.status === '未対応' || !i.status;
        return i.status === filter;
    });

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-shuyukan-blue mb-6 border-b pb-4 flex items-center gap-2">
                <span>📬 お問い合わせ管理</span>
                {inquiries.filter(i => i.status === '未対応' || !i.status).length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        未対応 {inquiries.filter(i => i.status === '未対応' || !i.status).length}件
                    </span>
                )}
            </h2>

            {message.text && (
                <div className={`p-4 rounded-xl mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex gap-2 mb-6">
                {['未対応', '対応済み', 'all'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === f ? 'bg-shuyukan-blue text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        {f === 'all' ? 'すべて' : f}
                    </button>
                ))}
                <button
                    onClick={loadInquiries}
                    className="ml-auto text-gray-400 hover:text-shuyukan-blue transition-colors"
                    title="更新"
                >
                    🔄
                </button>
            </div>

            {loading ? (
                <div className="py-20 text-center text-gray-400 animate-pulse">データ読み込み中...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 一覧セクション */}
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {filteredInquiries.length === 0 ? (
                            <div className="py-20 text-center text-gray-300 bg-gray-50 rounded-2xl border-2 border-dashed">
                                対象のデータはありません
                            </div>
                        ) : (
                            filteredInquiries.map((inquiry) => (
                                <div
                                    key={inquiry.id}
                                    onClick={() => setSelectedInquiry(inquiry)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedInquiry?.id === inquiry.id ? 'border-shuyukan-blue bg-blue-50' : 'border-gray-100 hover:border-gray-300 bg-white'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${inquiry.status === '未対応' || !inquiry.status ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {inquiry.status || '未対応'}
                                        </span>
                                        <span className="text-[10px] text-gray-400">{inquiry.date}</span>
                                    </div>
                                    <div className="font-bold text-gray-800">{inquiry.name} <span className="text-gray-400 text-xs font-normal">({inquiry.type})</span></div>
                                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{inquiry.content}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* 詳細・返信セクション */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col min-h-[500px]">
                        {selectedInquiry ? (
                            <>
                                <div className="mb-6 space-y-2">
                                    <div className="text-xs text-gray-400">お問い合わせ詳細</div>
                                    <div className="font-bold text-xl text-shuyukan-blue">{selectedInquiry.name} 様</div>
                                    <div className="text-sm text-gray-500">{selectedInquiry.email}</div>
                                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap mt-4 border">
                                        {selectedInquiry.content}
                                    </div>
                                    {selectedInquiry.notes && (
                                        <div className="mt-4 pt-4 border-t text-xs text-gray-400 whitespace-pre-wrap">
                                            <span className="font-bold">履歴:</span><br />
                                            {selectedInquiry.notes}
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleReply} className="mt-auto space-y-4">
                                    <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                                        {templates.map((t, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setReplyMessage(t.text)}
                                                className="whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] px-2 py-1 rounded border border-gray-300 transition-colors"
                                            >
                                                📋 {t.label}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        placeholder="返信内容を入力してください..."
                                        className="w-full h-40 p-4 rounded-xl border focus:ring-2 focus:ring-shuyukan-blue focus:border-shuyukan-blue text-sm"
                                        required
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={sending || !replyMessage}
                                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${sending ? 'bg-gray-400' : 'bg-gradient-to-r from-shuyukan-blue to-teal-600 hover:from-blue-700 hover:to-teal-700 hover:scale-[1.02]'}`}
                                    >
                                        {sending ? '送信中...' : '✉️  この内容で即レスする'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                                <span className="text-6xl mb-4">👈</span>
                                <p>お問い合わせを選択してください</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
