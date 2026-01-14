/**
 * Mock Database integration.
 * In production, this would communicate with Google Sheets or Firebase.
 */

// Initial Mock Data
const INITIAL_MEMBERS = [
    { id: 'M001', name: '修猷 太郎', role: 'admin', grade: '八段', email: 'sensei@shuyukan.com', status: 'active', payment: 'ok' },
    { id: 'M002', name: '福岡 次郎', role: 'member', grade: '二段', email: 'jiro@example.com', status: 'active', payment: 'late' },
    { id: 'M003', name: '西新 花子', role: 'member', grade: '一級', email: 'hanako@example.com', status: 'active', payment: 'ok' },
    { id: 'M004', name: '早良 健太', role: 'member', grade: '初心者', email: 'kenta@example.com', status: 'pause', payment: 'ok' },
];

class MockDB {
    constructor() {
        // Load from localStorage or use initial data
        const saved = localStorage.getItem('shuyukan_members');
        this.members = saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    }

    _save() {
        localStorage.setItem('shuyukan_members', JSON.stringify(this.members));
    }

    async getMemberByEmail(email) {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 500));
        return this.members.find(m => m.email === email);
    }

    async getAllMembers() {
        await new Promise(r => setTimeout(r, 500));
        return [...this.members];
    }

    async updateMember(id, updates) {
        await new Promise(r => setTimeout(r, 300));
        this.members = this.members.map(m => m.id === id ? { ...m, ...updates } : m);
        this._save();
        return this.members.find(m => m.id === id);
    }

    // Temporary auth simulation
    async authenticate(email, password) {
        // Any password works for demo
        const member = await this.getMemberByEmail(email);
        if (member) {
            return {
                id: member.id,
                name: member.name,
                role: member.role,
                grade: member.grade
            };
        }
        return null;
    }
}

export const db = new MockDB();
