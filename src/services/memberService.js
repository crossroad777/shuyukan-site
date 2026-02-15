/**
 * Member Database Service
 * Google SheetsのApps Script APIから会員データを取得・更新
 */

const MEMBER_API_URL = import.meta.env.VITE_MEMBER_API_URL;

// モックデータ（ローカル状態として保持 - 本番版では空）
let mockMembers = [];

/**
 * オブジェクトをBase64エンコードする（UTF-8対応）
 */
const toBase64 = (obj) => {
    try {
        const json = JSON.stringify(obj);
        return window.btoa(unescape(encodeURIComponent(json)));
    } catch (e) {
        console.error('Base64 encoding error:', e);
        return "";
    }
};

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

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error('[MemberService] Non-JSON response received:', text.substring(0, 200));
            throw new Error('APIから正しくない形式の応答が返されました（App Scriptの権限設定を確認してください）');
        }

        const data = await response.json();

        // GAS側からエラーオブジェクト（{success: false, error: "..."}）が返ってきた場合
        if (data && data.success === false) {
            console.error('[MemberService] API Error:', data.error);
            throw new Error(data.error || '不明なAPIエラー');
        }

        const members = data.data || (Array.isArray(data) ? data : null);

        if (!Array.isArray(members)) {
            console.error('[MemberService] Unexpected data format:', data);
            throw new Error('データの形式が正しくありません');
        }

        console.log('[MemberService] Data loaded successfully:', members.length, 'members');
        return members;
    } catch (error) {
        console.error('[MemberService] Fetch Error Details:', {
            message: error.message,
            stack: error.stack,
            url: MEMBER_API_URL
        });
        // エラーを再スローして、UI側でエラー表示ができるようにする
        throw error;
    }
}

/**
 * 在籍中の会員のみ取得
 * @returns {Promise<Array>} 在籍会員配列
 */
export async function fetchActiveMembers() {
    const members = await fetchMembers();
    if (!Array.isArray(members)) return [];
    return members.filter(m => {
        const s = String(m.status || '').trim();
        return s === '在籍' || s === 'active' || s === '';
    });
}

/**
 * 会員種別ごとに取得
 * @param {string} type - '少年部' | '一般部'
 * @returns {Promise<Array>} フィルタされた会員配列
 */
export async function fetchMembersByType(type) {
    const members = await fetchMembers();
    if (!Array.isArray(members)) return [];
    return members.filter(m => m.memberType === type);
}

/**
 * メールアドレスで会員を検索
 * @param {string} email - メールアドレス
 * @returns {Promise<Object|null>} 会員オブジェクト
 */
export async function fetchMemberByEmail(email) {
    const members = await fetchMembers();
    if (!Array.isArray(members)) return null;
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
        const url = new URL(MEMBER_API_URL);
        url.searchParams.append('action', 'memberAdd');
        url.searchParams.append('data64', toBase64(memberData));

        const response = await fetch(url.toString(), {
            method: 'GET',
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data && data.success === false) {
            throw new Error(data.error || '会員の追加に失敗しました');
        }
        console.log('[MemberService] Member added successfully via GET');
        return data;
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
 * 初回プロフィール・世帯情報を登録
 * @param {string} email - 会員のメールアドレス
 * @param {Object} data - プロフィールデータ
 * @returns {Promise<Object>} 結果
 */
export async function setupProfile(email, data) {
    if (!MEMBER_API_URL) {
        console.log('プロフィールを更新しました（モック）:', data);
        return { success: true };
    }

    try {
        const url = new URL(MEMBER_API_URL);
        url.searchParams.append('action', 'setupProfile');
        url.searchParams.append('email', email);
        url.searchParams.append('data64', toBase64(data));

        const response = await fetch(url.toString(), {
            method: 'GET',
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('プロフィール登録エラー:', error);
        throw error;
    }
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
        const url = new URL(MEMBER_API_URL);
        url.searchParams.append('action', 'memberUpdate');
        url.searchParams.append('id', memberId);
        url.searchParams.append('data64', toBase64(memberData));

        console.log(`[MemberService] Updating member ${memberId}:`, {
            memberId,
            memberData,
            role: memberData.role
        });

        const response = await fetch(url.toString(), {
            method: 'GET',
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`[MemberService] Update response:`, data);
        return data;

        if (data && data.success === false) {
            throw new Error(data.error || '会員の更新に失敗しました');
        }
        console.log('[MemberService] Member updated successfully via GET');
        return data;
    } catch (error) {
        console.error('会員更新エラー:', error);
        throw error;
    }
}

/**
 * 会員を承認（ステータスを「在籍」に変更）
 * @param {string} memberId - 会員番号
 * @returns {Promise<Object>} 結果
 */
export async function approveMember(memberId) {
    if (!MEMBER_API_URL) {
        return updateMember(memberId, { status: '在籍' });
    }

    try {
        const url = new URL(MEMBER_API_URL);
        url.searchParams.append('action', 'approveMember');
        url.searchParams.append('id', memberId);

        const response = await fetch(url.toString(), {
            method: 'GET',
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.success === false) {
            throw new Error(data.error || '承認に失敗しました');
        }
        console.log('[MemberService] Member approved successfully via GET');
        return data;
    } catch (error) {
        console.error('会員承認エラー:', error);
        throw error;
    }
}

/**
 * 管理者向けサマリーカウントを取得
 * @returns {Promise<Object>} {pendingMembers: number, newInquiries: number}
 */
export async function fetchSummaryCounts() {
    if (!MEMBER_API_URL) {
        const members = await fetchMembers();
        const pendingCount = members.filter(m => m.status === '承認待ち').length;
        return { pendingMembers: pendingCount, newInquiries: 0 };
    }

    try {
        const url = new URL(MEMBER_API_URL);
        url.searchParams.append('action', 'getSummaryCounts');

        const response = await fetch(url.toString());
        const data = await response.json();
        return data.data || { pendingMembers: 0, newInquiries: 0 };
    } catch (error) {
        console.error('サマリーカウント取得エラー:', error);
        return { pendingMembers: 0, newInquiries: 0 };
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
        const url = new URL(MEMBER_API_URL);
        url.searchParams.append('action', 'memberDelete');
        url.searchParams.append('id', memberId);

        const response = await fetch(url.toString(), {
            method: 'GET',
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.success === false) {
            throw new Error(data.error || '会員の削除に失敗しました');
        }
        console.log('[MemberService] Member deleted successfully via GET');
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

