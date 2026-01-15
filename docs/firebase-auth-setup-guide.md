# Firebase認証 & 会員API セットアップガイド

## 概要

Googleアカウントによる管理者認証と、Google Sheetsからの会員データ取得を設定します。

---

## Part 1: Firebaseプロジェクトの作成

### 1. Firebaseコンソールへアクセス

1. [Firebase Console](https://console.firebase.google.com/) を開く
2. **<shuyukan.info@gmail.com>** でログイン
3. 「プロジェクトを追加」をクリック

### 2. プロジェクト設定

1. プロジェクト名: `shuyukan-site`
2. Googleアナリティクス: 無効でOK（後で有効化可能）
3. 「プロジェクトを作成」をクリック

### 3. ウェブアプリを追加

1. プロジェクト設定（⚙️アイコン）→ 「アプリを追加」
2. 「ウェブ」（</>アイコン）を選択
3. アプリのニックネーム: `修猷館ウェブサイト`
4. Firebase Hostingは**チェックしない**
5. 「アプリを登録」をクリック
6. 表示される設定情報をコピー

### 4. 認証を有効化

1. 左メニュー「Authentication」→「始める」
2. 「Sign-in method」タブ
3. 「Google」を選択 → 有効化
4. プロジェクトのサポートメール: `shuyukan.info@gmail.com`
5. 「保存」

---

## Part 2: 環境変数の設定

プロジェクトの `.env` ファイルに以下を追加：

```
# Firebase設定（Firebaseコンソールからコピー）
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=shuyukan-site.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=shuyukan-site
VITE_FIREBASE_STORAGE_BUCKET=shuyukan-site.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# 会員データAPI（Google Sheets Apps Script）
VITE_MEMBER_API_URL=https://script.google.com/macros/s/xxxxx/exec
```

---

## Part 3: 会員データAPIの作成

### 1. 会員データベースのスプレッドシートを開く

既存の `修猷館_会員データベース` を開く

### 2. Apps Scriptを作成

1. メニュー → **拡張機能** → **Apps Script**
2. 以下のコードを貼り付け：

```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('会員マスター');
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  // ヘッダーを英語キーにマッピング
  const keyMap = {
    '会員番号': 'id',
    '世帯ID': 'familyId',
    '氏名': 'name',
    'ふりがな': 'furigana',
    '生年月日': 'birthDate',
    '性別': 'gender',
    '学年': 'grade',
    '会員種別': 'memberType',
    '段級位': 'rank',
    '入会日': 'joinDate',
    'ステータス': 'status',
    '備考': 'notes'
  };
  
  const json = data.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      const key = keyMap[header] || header;
      obj[key] = row[index];
    });
    return obj;
  }).filter(row => row.id); // 空行を除外
  
  return ContentService
    .createTextOutput(JSON.stringify(json))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 3. デプロイ

1. 「デプロイ」→「新しいデプロイ」
2. 種類: 「ウェブアプリ」
3. 実行者: 「自分」
4. アクセス: 「全員」
5. 「デプロイ」をクリック
6. URLをコピーし、`.env` の `VITE_MEMBER_API_URL` に設定

---

## Part 4: 動作確認

1. 開発サーバーを再起動: `npm run dev`
2. `/login` にアクセス
3. Googleでログイン
4. `shuyukan.info@gmail.com` でログイン成功
5. `/member` で会員一覧が表示されることを確認

---

## トラブルシューティング

**Q: ログインできない**

- Firebaseコンソールで認証が有効化されているか確認
- `.env` のFirebase設定が正しいか確認
- 開発サーバーを再起動

**Q: 会員データが表示されない**

- Apps ScriptのURLが正しく設定されているか確認
- スプレッドシートのシート名が「会員マスター」になっているか確認

**Q: 「このアカウントには管理者権限がありません」**

- `src/services/firebase.js` の `ADMIN_EMAILS` に登録されているか確認
