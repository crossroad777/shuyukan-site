# Gmail → スプレッドシート 自動保存 セットアップガイド

特定の送信者からのメールを自動的にスプレッドシートに保存する仕組みを構築します。

---

## 概要

```
[先生からのメール] → [Gmail受信] → [Apps Scriptが自動検知]
                                         ↓
                                 [スプレッドシートに保存]
                                 （日付、件名、本文）
```

---

## 手順1：保存先スプレッドシートを作成

1. **Googleドライブ**にアクセス  
   → [https://drive.google.com](https://drive.google.com)

2. 「**+ 新規**」→「**Googleスプレッドシート**」→「空白のスプレッドシート」

3. 名前を設定：`先生からの情報まとめ`

4. 1行目（ヘッダー）を入力：

| A | B | C | D |
|---|---|---|---|
| 受信日時 | 送信者 | 件名 | 本文 |

1. スプレッドシートを開いた状態で、**URLのIDをコピー**  
   （URLの `https://docs.google.com/spreadsheets/d/`**ここの部分**`/edit` の太字部分）

---

## 手順2：Apps Scriptプロジェクトを作成

1. [https://script.google.com](https://script.google.com) にアクセス
2. 「**新しいプロジェクト**」をクリック
3. プロジェクト名を「メール自動保存」に変更

---

## 手順3：コードを貼り付け

以下のコードを貼り付け、**2箇所を編集**してください：

```javascript
function saveEmailsToSheet() {
  // ===== ここを編集 =====
  const SPREADSHEET_ID = 'ここにスプレッドシートIDを貼り付け';
  const SENDER_EMAIL = 'yodo201488ms@beach.ocn.ne.jp'; // 対象の先生のメールアドレス
  // =======================
  
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
  
  // 過去24時間のメールを検索
  const query = `from:${SENDER_EMAIL} newer_than:1d`;
  const threads = GmailApp.search(query);
  
  if (threads.length === 0) {
    console.log('新しいメールはありません');
    return;
  }
  
  // 既存のメールID一覧を取得（重複防止）
  const existingIds = getExistingMessageIds(sheet);
  
  threads.forEach(thread => {
    const messages = thread.getMessages();
    messages.forEach(message => {
      const messageId = message.getId();
      
      // 重複チェック
      if (existingIds.has(messageId)) {
        return;
      }
      
      // スプレッドシートに追加
      sheet.appendRow([
        message.getDate(),
        message.getFrom(),
        message.getSubject(),
        message.getPlainBody().substring(0, 5000), // 本文（最大5000文字）
        messageId // 重複防止用ID（E列、非表示推奨）
      ]);
      
      console.log('保存:', message.getSubject());
    });
  });
}

function getExistingMessageIds(sheet) {
  const ids = new Set();
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const range = sheet.getRange(2, 5, lastRow - 1, 1); // E列
    const values = range.getValues();
    values.forEach(row => {
      if (row[0]) ids.add(row[0]);
    });
  }
  return ids;
}
```

---

## 手順4：編集箇所

### 1. スプレッドシートID

手順1でコピーしたIDを貼り付け：

```javascript
const SPREADSHEET_ID = '1ABC...xyz'; // 実際のIDに置き換え
```

### 2. 先生のメールアドレス

対象の先生のメールアドレスを入力：

```javascript
const SENDER_EMAIL = 'sensei@example.com'; // 実際のアドレスに置き換え
```

---

## 手順5：権限を承認

1. **保存**（Ctrl + S）
2. 上部の「**実行**」ボタンをクリック
3. 「**権限を確認**」→ Googleアカウントを選択
4. 「**詳細**」→「**〇〇（安全ではないページ）に移動**」
5. 「**許可**」をクリック

---

## 手順6：自動実行を設定（トリガー）

1. 左メニューの「**トリガー**」（時計アイコン）をクリック
2. 「**+ トリガーを追加**」をクリック
3. 以下を設定：
   - 実行する関数：`saveEmailsToSheet`
   - イベントのソース：「時間主導型」
   - 時間ベースのトリガーのタイプ：「時間ベースのタイマー」
   - 間隔：「1時間ごと」（または「6時間ごと」）
4. 「**保存**」

---

## 完成

これで、指定したメールアドレスからのメールが**自動的にスプレッドシートに保存**されます。

### 確認方法

1. 対象の先生からメールを受信
2. 1時間以内にスプレッドシートを確認
3. 新しい行にメールが追加されているはず

---

## トラブルシューティング

**Q: メールが保存されない**

- 送信者のメールアドレスが正確か確認
- Gmailで該当メールが受信できているか確認
- Apps Scriptの実行ログを確認（エラーがないか）

**Q: 同じメールが重複して保存される**

- E列（メッセージID）が正しく保存されているか確認

**Q: 本文が長すぎて切れる**

- `substring(0, 5000)` の数値を増やす（最大50000程度）
