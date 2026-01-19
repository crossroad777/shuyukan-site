import React, { useState, useEffect } from 'react';
import { fetchAccountingData, updateAccountingRecord, deleteAccountingRecord } from '../services/accountingService';

export default function AccountingDashboard() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddMode, setIsAddMode] = useState(false);
    const [formData, setFormData] = useState({
        日付: new Date().toISOString().split('T')[0],
        項目: '',
        種別: '収入',
        金額: 0,
        カテゴリ: '会費',
        備考: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await fetchAccountingData();
        setRecords(data);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await updateAccountingRecord(formData);
        if (success) {
            setIsAddMode(false);
            loadData();
            setFormData({
                日付: new Date().toISOString().split('T')[0],
                項目: '',
                種別: '収入',
                金額: 0,
                カテゴリ: '会費',
                備考: ''
            });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('このレコードを削除しますか？')) {
            const success = await deleteAccountingRecord(id);
            if (success) loadData();
        }
    };

    // 統計計算
    const totalIncome = records.filter(r => r.種別 === '収入').reduce((sum, r) => sum + (Number(r.金額) || 0), 0);
    const totalExpense = records.filter(r => r.種別 === '支出').reduce((sum, r) => sum + (Number(r.金額) || 0), 0);
    const balance = totalIncome - totalExpense;

    // 月別収支計算 (簡略化版)
    const monthlyData = records.reduce((acc, r) => {
        const month = r.日付.substring(0, 7);
        if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
        if (r.種別 === '収入') acc[month].income += Number(r.金額) || 0;
        else acc[month].expense += Number(r.金額) || 0;
        return acc;
    }, {});

    const sortedMonths = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
    const maxVal = Math.max(...sortedMonths.map(d => Math.max(d.income, d.expense)), 1);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-shuyukan-blue flex items-center gap-2">
                    <span className="text-3xl">💰</span> 会計・収支管理
                </h2>
                <button
                    onClick={() => setIsAddMode(!isAddMode)}
                    className={`px-6 py-2 rounded-xl font-bold transition-all shadow-md ${isAddMode ? 'bg-gray-100 text-gray-600' : 'bg-shuyukan-blue text-white hover:bg-opacity-90'
                        }`}
                >
                    {isAddMode ? 'キャンセル' : '+ 新規収支を登録'}
                </button>
            </div>

            {/* サマリーカード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                    <div className="text-emerald-600 text-sm font-bold uppercase tracking-wider mb-2">総収入</div>
                    <div className="text-3xl font-black text-emerald-700">¥{totalIncome.toLocaleString()}</div>
                </div>
                <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl">
                    <div className="text-rose-600 text-sm font-bold uppercase tracking-wider mb-2">総支出</div>
                    <div className="text-3xl font-black text-rose-700">¥{totalExpense.toLocaleString()}</div>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                    <div className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-2">現在の残高</div>
                    <div className="text-3xl font-black text-blue-700">¥{balance.toLocaleString()}</div>
                </div>
            </div>

            {isAddMode && (
                <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-shuyukan-blue/20 animate-slide-up">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        📥 新しい収支情報の入力
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">日付</label>
                            <input
                                type="date"
                                required
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-shuyukan-blue outline-none transition-all"
                                value={formData.日付}
                                onChange={e => setFormData({ ...formData, 日付: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">項目名</label>
                            <input
                                type="text"
                                required
                                placeholder="例：1月分会費"
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-shuyukan-blue outline-none transition-all"
                                value={formData.項目}
                                onChange={e => setFormData({ ...formData, 項目: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">種別</label>
                            <select
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-shuyukan-blue outline-none transition-all"
                                value={formData.種別}
                                onChange={e => setFormData({ ...formData, 種別: e.target.value })}
                            >
                                <option value="収入">収入 (+)</option>
                                <option value="支出">支出 (-)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">金額 (円)</label>
                            <input
                                type="number"
                                required
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-shuyukan-blue outline-none transition-all"
                                value={formData.金額}
                                onChange={e => setFormData({ ...formData, 金額: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">カテゴリ</label>
                            <select
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-shuyukan-blue outline-none transition-all"
                                value={formData.カテゴリ}
                                onChange={e => setFormData({ ...formData, カテゴリ: e.target.value })}
                            >
                                <option value="会費">会費</option>
                                <option value="連盟費">連盟費</option>
                                <option value="施設料">施設使用料</option>
                                <option value="用具購入">用具・備品</option>
                                <option value="大会・遠征">大会・遠征</option>
                                <option value="イベント">行事・イベント</option>
                                <option value="その他">その他</option>
                            </select>
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">備考</label>
                            <input
                                type="text"
                                placeholder="詳細な内容があれば記入"
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-shuyukan-blue outline-none transition-all"
                                value={formData.備考}
                                onChange={e => setFormData({ ...formData, 備考: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-3 flex justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => setIsAddMode(false)}
                                className="px-6 py-2 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                className="px-10 py-3 bg-shuyukan-blue text-white rounded-xl font-bold shadow-lg hover:bg-opacity-90 transition-all hover:-translate-y-0.5"
                            >
                                登録を確定する
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 簡易月別グラフ (CSS/SVG) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span>📈</span> 月別収支推移
                    </h3>
                    {sortedMonths.length > 0 ? (
                        <div className="flex items-end gap-4 h-64 px-4 overflow-x-auto">
                            {sortedMonths.map(d => (
                                <div key={d.month} className="flex-1 min-w-[60px] flex flex-col items-center group">
                                    <div className="w-full flex items-end justify-center gap-1.5 h-full relative">
                                        <div
                                            className="w-4 bg-emerald-400 rounded-t-sm hover:bg-emerald-500 transition-all relative group/bar"
                                            style={{ height: `${(d.income / maxVal) * 100}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                                                +{d.income.toLocaleString()}
                                            </div>
                                        </div>
                                        <div
                                            className="w-4 bg-rose-400 rounded-t-sm hover:bg-rose-500 transition-all relative group/bar2"
                                            style={{ height: `${(d.expense / maxVal) * 100}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/bar2:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                                                -{d.expense.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-2 font-bold">{d.month}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-gray-300 italic border-2 border-dashed border-gray-50 rounded-xl">
                            データがありません
                        </div>
                    )}
                    <div className="mt-6 flex justify-center gap-6 text-xs font-bold">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-emerald-400 rounded-full"></span>
                            <span className="text-emerald-700">収入 (Income)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-rose-400 rounded-full"></span>
                            <span className="text-rose-700">支出 (Expense)</span>
                        </div>
                    </div>
                </div>

                {/* カテゴリ別支出内訳 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <span>📊</span> 支出カテゴリ内訳
                        </h3>
                        <span className="text-xs text-shuyukan-gold font-bold bg-shuyukan-gold/10 px-2 py-1 rounded-full uppercase tracking-tighter">Total Expense</span>
                    </div>

                    {totalExpense > 0 ? (
                        <div className="space-y-4">
                            {Object.entries(
                                records.filter(r => r.種別 === '支出').reduce((acc, r) => {
                                    const cat = r.カテゴリ || 'その他';
                                    acc[cat] = (acc[cat] || 0) + (Number(r.金額) || 0);
                                    return acc;
                                }, {})
                            )
                                .sort((a, b) => b[1] - a[1])
                                .map(([cat, val], idx) => {
                                    const percentage = (val / totalExpense) * 100;
                                    const colors = ['bg-rose-500', 'bg-orange-400', 'bg-amber-400', 'bg-shuyukan-gold', 'bg-shuyukan-blue', 'bg-gray-400'];
                                    return (
                                        <div key={cat} className="group">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-bold text-gray-700">{cat}</span>
                                                <span className="text-sm font-bold text-gray-400">¥{val.toLocaleString()} <span className="text-[10px] ml-1">({percentage.toFixed(0)}%)</span></span>
                                            </div>
                                            <div className="w-full bg-gray-50 h-2.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${colors[idx % colors.length]} rounded-full transition-all duration-1000 group-hover:brightness-110`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-gray-300 italic border-2 border-dashed border-gray-50 rounded-xl">
                            支出データがありません
                        </div>
                    )}
                </div>
            </div>

            {/* 履歴テーブル */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-700">取引履歴</h3>
                    <span className="text-xs text-gray-400">{records.length} 件のデータ</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/30 text-left">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">日付</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">項目</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">カテゴリ</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase text-right">金額</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">備考</th>
                                <th className="px-1 py-1"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-300 italic">取引履歴がありません</td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.ID} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600 font-mono italic">{record.日付}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-800">{record.項目}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-lg uppercase">
                                                {record.カテゴリ}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-black text-right ${record.種別 === '収入' ? 'text-emerald-600' : 'text-rose-600'
                                            }`}>
                                            {record.種別 === '収入' ? '+' : '-'}¥{Number(record.金額).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400 truncate max-w-[150px]">{record.備考}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(record.ID)}
                                                className="text-gray-300 hover:text-rose-500 p-2 rounded-lg transition-colors scale-0 group-hover:scale-100"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
