import React, { useEffect, useState } from 'react';
import { db } from '../services/mockDb';

export default function AdminDashboard({ user }) {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        db.getAllMembers().then(setMembers);
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-shuyukan-blue">会員管理 (管理者用)</h2>
                <button className="bg-shuyukan-blue text-white px-4 py-2 rounded hover:bg-shuyukan-gold transition">
                    + 新規登録
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">氏名</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">段位</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">会費</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {members.map((m) => (
                            <tr key={m.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{m.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{m.grade}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${m.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {m.status === 'active' ? '在籍' : '休会'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {m.payment === 'late' ? (
                                        <span className="text-red-500 font-bold">未納</span>
                                    ) : (
                                        <span className="text-gray-400">済</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button className="text-shuyukan-blue hover:text-shuyukan-gold mr-4">編集</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
