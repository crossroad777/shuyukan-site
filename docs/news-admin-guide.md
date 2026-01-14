# お知らせ管理セットアップガイド

## 概要

Googleスプレッドシートでお知らせを管理し、サイトに自動反映させる仕組みです。

---

## セットアップ手順

### 1. Googleスプレッドシートを作成

1. [Google Sheets](https://sheets.google.com) にアクセス
2. 新しいスプレッドシートを作成
3. シート名を「お知らせ」に変更
4. 1行目（ヘッダー）に以下の列を作成：

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| id | date | title | category | content | isPinned |

### 2. データ入力例

| id | date | title | category | content | isPinned |
|---|---|---|---|---|---|
| 1 | 2026.01.15 | 体験入部 随時受付中！ | 体験会 | 初心者大歓迎。見学・体験は土日で受付中です。 | TRUE |
| 2 | 2026.01.12 | 冬季大会のお知らせ | 大会 | 2月に冬季市民大会が開催されます。 | FALSE |
| 3 | 2026.01.10 | 1月の稽古日程 | お知らせ | 1月の稽古日程を更新しました。 | FALSE |

**カテゴリ例：**

- 体験会
- 大会
- 行事
- お知らせ

**isPinned（固定表示）：**

- `TRUE` → ホームページ上部に目立つバナーで表示
- `FALSE` → 通常のお知らせとして表示

---

### 3. Apps Scriptでウェブアプリを作成

1. スプレッドシートのメニュー → **拡張機能** → **Apps Script**
2. 以下のコードを貼り付け：

```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('お知らせ');
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  const json = data.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      if (header === 'isPinned') {
        obj[header] = row[index] === true || row[index] === 'TRUE';
      } else {
        obj[header] = row[index];
      }
    });
    obj.link = '#'; // 必要に応じてリンク列も追加可
    return obj;
  });
  
  return ContentService
    .createTextOutput(JSON.stringify(json))
    .setMimeType(ContentService.MimeType.JSON);
}
```

1. **デプロイ** → **新しいデプロイ**
2. 種類：「ウェブアプリ」を選択
3. アクセス権限：「全員」に設定
4. **デプロイ** をクリック
5. 表示されたURLをコピー

---

### 4. サイトにURLを設定

プロジェクトのルートに `.env` ファイルを作成（または編集）：

```
VITE_NEWS_API_URL=https://script.google.com/macros/s/xxxxxxxxx/exec
```

※ `xxxxxxxxx` 部分は、デプロイ時に発行されたURLに置き換えてください。

---

## 運用方法

### お知らせを追加する

1. Googleスプレッドシートを開く
2. 新しい行にデータを入力
3. 保存 → サイトに自動反映（リロード時）

### 体験会告知を目立たせる

- `isPinned` を `TRUE` にするとホームページ上部にバナー表示

---

## トラブルシューティング

**Q: サイトに反映されない**

- ブラウザのキャッシュをクリアしてください
- スプレッドシートのURLが正しく設定されているか確認

**Q: エラーが表示される**

- Apps Scriptのアクセス権限が「全員」になっているか確認
