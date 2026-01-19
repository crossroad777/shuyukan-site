import React, { useState, useEffect } from 'react';
import { fetchMembers } from '../services/memberService';
import { fetchAttendance, updateAttendance } from '../services/attendanceService';
import {
    CheckCircle,
    Clock,
    XCircle,
    UserPlus,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Search,
    Check
} from 'lucide-react';

const AttendanceDashboard = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [members, setMembers] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadData();
    }, [date]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [membersRes, attendanceRes] = await Promise.all([
                fetchMembers(),
                fetchAttendance(date)
            ]);

            if (membersRes.success) {
                // 在籍中または承認待ちの会員のみ表示
                const activeMembers = membersRes.data.filter(m =>
                    m.status === '在籍' || m.status === '在籍中' || m.status === '承認待ち'
                );
                setMembers(activeMembers);
            }

            if (attendanceRes.success) {
                // 会員番号をキーにした出席マップを作成
                const attMap = {};
                attendanceRes.data.forEach(item => {
                    attMap[item['会員番号']] = item;
                });
                setAttendance(attMap);
            }
        } catch (err) {
            setError('データの取得に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    const handleAttendance = async (member, status) => {
        try {
            const res = await updateAttendance({
                memberId: member.id,
                memberName: member.name,
                date: date,
                status: status,
                time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
            });

            if (res.success) {
                setMessage(`${member.name}さんを「${status}」で記録しました`);
                setTimeout(() => setMessage(null), 3000);
                loadData(); // 再読み込み
            }
        } catch (err) {
            setError('記録に失敗しました');
        }
    };

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.furigana && m.furigana.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusIcon = (status) => {
        switch (status) {
            case '出席': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case '遅刻': return <Clock className="w-5 h-5 text-orange-500" />;
            case '欠席': return <XCircle className="w-5 h-5 text-red-500" />;
            case '早退': return <CheckCircle className="w-5 h-5 text-blue-500" />;
            default: return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-red-600" />
                    稽古出欠管理
                </h2>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            const d = new Date(date);
                            d.setDate(d.getDate() - 1);
                            setDate(d.toISOString().split('T')[0]);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <ChevronLeft />
                    </button>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border rounded px-2 py-1 focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <button
                        onClick={() => {
                            const d = new Date(date);
                            d.setDate(d.getDate() + 1);
                            setDate(d.toISOString().split('T')[0]);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {message && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-200 animate-in fade-in slide-in-from-top-2">
                    {message}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border text-center flex flex-col justify-center relative overflow-hidden group">
                    <div className="text-sm text-gray-400 font-bold uppercase tracking-tighter mb-1">本日対象者</div>
                    <div className="text-3xl font-black text-gray-800">{members.length}</div>
                    <div className="absolute bottom-0 left-0 h-1 bg-gray-100 w-full"></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border text-center flex flex-col justify-center relative overflow-hidden group">
                    <div className="text-sm text-green-500 font-bold uppercase tracking-tighter mb-1">出席済</div>
                    <div className="text-3xl font-black text-green-600">
                        {Object.values(attendance).filter(a => a['備考'] === '出席' || a['備考'] === '出席済').length}
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 bg-green-500 w-full" style={{ width: `${(Object.values(attendance).filter(a => a['備考'] === '出席' || a['備考'] === '出席済').length / Math.max(members.length, 1)) * 100}%` }}></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border text-center flex flex-col justify-center relative overflow-hidden group">
                    <div className="text-sm text-orange-500 font-bold uppercase tracking-tighter mb-1">遅刻・早退</div>
                    <div className="text-3xl font-black text-orange-600">
                        {Object.values(attendance).filter(a => a['備考'] === '遅刻' || a['備考'] === '早退').length}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border text-center flex flex-col justify-center relative overflow-hidden group">
                    <div className="text-sm text-gray-300 font-bold uppercase tracking-tighter mb-1">未記録 / 欠席</div>
                    <div className="text-3xl font-black text-gray-300">
                        {members.length - Object.values(attendance).filter(a => ['出席', '出席済', '遅刻', '早退'].includes(a['備考'])).length}
                    </div>
                </div>
            </div>

            {/* Attendance Progress Ring (Visual enhancement) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">本日の出席率</h3>
                    <p className="text-sm text-gray-400">対象者数に対する出席報告済みの割合です</p>
                </div>
                <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="40"
                            cy="40"
                            r="34"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-100"
                        />
                        <circle
                            cx="40"
                            cy="40"
                            r="34"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 34}
                            strokeDashoffset={2 * Math.PI * 34 * (1 - (Object.values(attendance).filter(a => ['出席', '出席済', '遅刻', '早退'].includes(a['備考'])).length / Math.max(members.length, 1)))}
                            className="text-red-500 transition-all duration-1000"
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="absolute text-sm font-black text-red-600">
                        {Math.round((Object.values(attendance).filter(a => ['出席', '出席済', '遅刻', '早退'].includes(a['備考'])).length / Math.max(members.length, 1)) * 100)}%
                    </span>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="名前またはふりがなで検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                />
            </div>

            {/* Members List */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">読み込み中...</div>
                ) : filteredMembers.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">該当する部員が見つかりません</div>
                ) : (
                    <div className="divide-y">
                        {filteredMembers.sort((a, b) => a.name.localeCompare(b.name, 'ja')).map(member => {
                            const record = attendance[member.id];
                            const isMarked = !!record;

                            return (
                                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${isMarked ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            {isMarked ? <Check /> : member.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold flex items-center gap-2">
                                                {member.name}
                                                {record && (
                                                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                                        {record['出席時刻']}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-400 uppercase tracking-wider">{member.id} / {member.memberType}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {isMarked ? (
                                            <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200">
                                                {getStatusIcon(record['備考'])}
                                                <span className="text-sm font-medium">{record['備考']}</span>
                                                <button
                                                    onClick={() => handleAttendance(member, '未出席')} // TODO: 削除機能
                                                    className="ml-2 p-1 hover:bg-green-200 rounded-full"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleAttendance(member, '出席')}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:scale-95 transition-all text-sm font-bold shadow-sm"
                                                >
                                                    出席
                                                </button>
                                                <div className="relative group">
                                                    <button className="px-2 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm">
                                                        ▼
                                                    </button>
                                                    <div className="absolute right-0 top-full mt-1 bg-white shadow-xl border rounded-lg hidden group-hover:block z-10 w-32 overflow-hidden">
                                                        <button onClick={() => handleAttendance(member, '遅刻')} className="w-full text-left px-4 py-2 hover:bg-orange-50 text-orange-700 text-sm">遅刻</button>
                                                        <button onClick={() => handleAttendance(member, '早退')} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-700 text-sm">早退</button>
                                                        <button onClick={() => handleAttendance(member, '欠席')} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-700 text-sm">欠席</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Guest/Trial Button */}
            <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2 font-bold">
                <UserPlus className="w-5 h-5" />
                体験・ゲストを追加 (準備中)
            </button>
        </div>
    );
};

export default AttendanceDashboard;
