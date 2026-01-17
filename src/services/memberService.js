/**
 * Member Database Service
 * Google SheetsのApps Script APIから会員データを取得・更新
 */

const MEMBER_API_URL = import.meta.env.VITE_MEMBER_API_URL;

// モックデータ（ローカル状態として保持）
let mockMembers = [
    {
        id: 'S001',
        familyId: 'F001',
        name: '鈴木 健太',
        email: 'suzuki.test@example.com',
        furigana: 'すずき けんた',
        birthDate: '2015-08-20',
        gender: '男',
        grade: '小学4年',
        memberType: '少年部',
        rank: '2級',
        joinDate: '2023-04-01',
        status: '在籍',
        notes: ''
    },
    {
        id: 'A001',
        familyId: 'F003',
        name: '山田 太郎',
        email: 'shuyukan.info@gmail.com', // 管理者テスター用
        furigana: 'やまだ たろう',
        birthDate: '1985-05-10',
        gender: '男',
        grade: '一般',
        memberType: '一般部',
        rank: '三段',
        joinDate: '2020-04-01',
        status: '在籍',
        notes: ''
    }
];

/**
 * 全会員データを取得
 * @returns {Promise<Array>} 会員配列
 */
export async function fetchMembers() {
    if (!MEMBER_API_URL) {
        console.warn('VITE_MEMBER_API_URL is not configured, using mock data');
        return [...mockMembers];
    }

    try {
        const url = new URL(MEMBER_API_URL);
        url.searchParams.append('action', 'getMembers');
        console.log('[MemberService] Fetching from:', url.toString());

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // GAS側からエラーオブジェクト（{error: "..."}）が返ってきた場合
        if (data && data.error) {
            console.error('[MemberService] API Error:', data.error);
            return [...mockMembers];
        }

        console.log('[MemberService] Data loaded successfully');
        return data;
    } catch (error) {
        console.error('[MemberService] Fetch Error:', error);
        return [...mockMembers];
    }
}

/**
 * 在籍中の会員のみ取得
 * @returns {Promise<Array>} 在籍会員配列
 */
export async function fetchActiveMembers() {
    const members = await fetchMembers();
    return members.filter(m => m.status === '在籍' || m.status === 'active');
}

/**
 * 会員種別ごとに取得
 * @param {string} type - '少年部' | '一般部'
 * @returns {Promise<Array>} フィルタされた会員配列
 */
export async function fetchMembersByType(type) {
    const members = await fetchMembers();
    return members.filter(m => m.memberType === type);
}

/**
 * メールアドレスで会員を検索
 * @param {string} email - メールアドレス
 * @returns {Promise<Object|null>} 会員オブジェクト
 */
export async function fetchMemberByEmail(email) {
    const members = await fetchMembers();
    return members.find(m => m.email === email) || null;
}

/**
 * 新規会員を追加
 * @param {Object} memberData - 会員データ
 * @returns {Promise<Object>} 追加された会員
 */
export async function addMember(memberData) {
    if (!MEMBER_API_URL) {
        // モックデータに追加
        const newMember = {
            ...memberData,
            id: generateMemberId(memberData.memberType),
            joinDate: memberData.joinDate || new Date().toISOString().split('T')[0],
            status: memberData.status || '在籍'
        };
        mockMembers.push(newMember);
        console.log('会員を追加しました（モック）:', newMember);
        return newMember;
    }

    try {
        const response = await fetch(MEMBER_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'add', ...memberData })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('会員追加エラー:', error);
        throw error;
    }
}

/**
 * 利用申請を送信
 * @param {Object} requestData - 申請データ (name, furigana, role)
 * @returns {Promise<Object>} 結果
 */
export async function requestJoin(requestData) {
    return addMember({
        ...requestData,
        status: '承認待ち',
        joinDate: new Date().toISOString().split('T')[0],
        notes: 'ポータルからの申請'
    });
}

/**
 * 会員情報を更新
 * @param {string} memberId - 会員番号
 * @param {Object} memberData - 更新データ
 * @returns {Promise<Object>} 更新された会員
 */
export async function updateMember(memberId, memberData) {
    if (!MEMBER_API_URL) {
        // モックデータを更新
        const index = mockMembers.findIndex(m => m.id === memberId);
        if (index === -1) {
            throw new Error('会員が見つかりません');
        }
        mockMembers[index] = { ...mockMembers[index], ...memberData };
        console.log('会員を更新しました（モック）:', mockMembers[index]);
        return mockMembers[index];
    }

    try {
        const response = await fetch(MEMBER_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update', id: memberId, ...memberData })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('会員更新エラー:', error);
        throw error;
    }
}

/**
 * 会員を削除
 * @param {string} memberId - 会員番号
 * @returns {Promise<boolean>} 成功/失敗
 */
export async function deleteMember(memberId) {
    if (!MEMBER_API_URL) {
        // モックデータから削除
        const index = mockMembers.findIndex(m => m.id === memberId);
        if (index === -1) {
            throw new Error('会員が見つかりません');
        }
        const deleted = mockMembers.splice(index, 1);
        console.log('会員を削除しました（モック）:', deleted[0]);
        return true;
    }

    try {
        const response = await fetch(MEMBER_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id: memberId })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error('会員削除エラー:', error);
        throw error;
    }
}

/**
 * 会員番号を自動生成
 * @param {string} memberType - '少年部' | '一般部'
 * @returns {string} 新しい会員番号
 */
function generateMemberId(memberType) {
    const prefix = memberType === '少年部' ? 'S' : 'A';
    const existingIds = mockMembers
        .filter(m => m.id.startsWith(prefix))
        .map(m => parseInt(m.id.slice(1), 10));
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return `${prefix}${String(maxId + 1).padStart(3, '0')}`;
}

