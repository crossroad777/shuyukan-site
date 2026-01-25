/**
 * 豊中修猷館 - デプロイ前APIチェックスクリプト
 * 
 * 使用方法:
 *   node scripts/check-api.js
 * 
 * このスクリプトは、Vercelにデプロイする前にAPIが動作するか確認します。
 * CORSエラーは発生しませんが、APIが応答するかを確認できます。
 */

const API_URL = process.env.VITE_MEMBER_API_URL ||
    'https://script.google.com/macros/s/AKfycbyG0TXwYvXuiVeSmJti2atnaJ17OT4RA86p-J18i4IqdOmutP6jvWUUSW2mSOp-QKTuxw/exec';

async function checkAPI() {
    console.log('🔍 豊中修猷館 API チェック');
    console.log('━'.repeat(50));
    console.log(`📡 API URL: ${API_URL}`);
    console.log('');

    try {
        // getDebugInfo を呼び出してAPIの状態を確認
        const response = await fetch(`${API_URL}?action=getDebugInfo`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        console.log('✅ API接続成功！');
        console.log('');
        console.log('📊 接続状態:');
        console.log(`   - 会員マスター: ${data.connected?.member || '未確認'}`);
        console.log(`   - ニュース: ${data.connected?.news || '未確認'}`);
        console.log('');

        if (data.memberSheets) {
            console.log(`📋 会員シート一覧: ${data.memberSheets.join(', ')}`);
        }

        console.log('');
        console.log('✨ デプロイ準備完了！');
        return true;

    } catch (error) {
        console.error('');
        console.error('❌ API接続エラー！');
        console.error(`   エラー: ${error.message}`);
        console.error('');
        console.error('━'.repeat(50));
        console.error('🔧 トラブルシューティング:');
        console.error('');
        console.error('1. Apps Script が正しくデプロイされているか確認');
        console.error('   → https://script.google.com でプロジェクトを開く');
        console.error('   → 「デプロイ」→「デプロイを管理」');
        console.error('');
        console.error('2. アクセス設定を確認');
        console.error('   → 「次のユーザーとして実行」: 自分');
        console.error('   → 「アクセスできるユーザー」: 全員');
        console.error('');
        console.error('3. URLが正しいか確認');
        console.error('   → .env ファイルの VITE_MEMBER_API_URL を確認');
        console.error('');
        return false;
    }
}

// Node.jsで直接実行された場合
checkAPI().then(success => {
    process.exit(success ? 0 : 1);
});
