# お知らせ投稿用Googleフォーム セットアップガイド

管理者がフォームから簡単にお知らせを投稿し、サイトに自動反映させる仕組みを構築します。

---

## 手順1：Googleフォームを作成

1. **Googleドライブ**にアクセス  
   → [https://drive.google.com](https://drive.google.com)

2. 左上「**+ 新規**」→「**Googleフォーム**」→「空白のフォーム」をクリック

3. フォームのタイトルを設定：

   ```
   【管理者用】お知らせ投稿フォーム
   ```

---

## 手順2：フォームの項目を設定

以下の項目を順番に追加してください。

### 項目1: タイトル

- 質問タイプ：**記述式**
- 質問文：`タイトル`
- 必須：✅ オン

### 項目2: カテゴリ

- 質問タイプ：**ラジオボタン**
- 質問文：`カテゴリ`
- 選択肢：
  - 体験会
  - 大会
  - 行事
  - お知らせ
- 必須：✅ オン

### 項目3: 本文

- 質問タイプ：**段落**
- 質問文：`本文`
- 必須：✅ オン

### 項目4: 画像

- 質問タイプ：**ファイルのアップロード**
- 質問文：`画像（任意）`
- ファイル形式：画像のみ
- ファイル数：1
- 必須：オフ

### 項目5: 固定表示

- 質問タイプ：**チェックボックス**
- 質問文：`トップページに固定表示する`
- 選択肢：`はい、固定表示する`
- 必須：オフ

---

## 手順3：スプレッドシートに連携

1. フォーム編集画面で「**回答**」タブをクリック
2. 右上の**緑色のスプレッドシートアイコン**をクリック
3. 「**新しいスプレッドシートを作成**」を選択
4. 名前：`お知らせ管理シート`
5. 「**作成**」をクリック

これで、フォームの回答が自動的にスプレッドシートに保存されます。

---

## 手順4：Apps Scriptでウェブアプリを作成

1. 作成されたスプレッドシートを開く
2. メニュー → **拡張機能** → **Apps Script**
3. 以下のコードを貼り付け：

```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  // 列名のマッピング（フォームの列名に合わせて調整）
  const json = data.map((row, index) => {
    return {
      id: index + 1,
      date: formatDate(row[0]), // タイムスタンプ
      title: row[1],            // タイトル
      category: row[2],         // カテゴリ
      content: row[3],          // 本文
      image: row[4] || null,    // 画像URL
      isPinned: row[5] === 'はい、固定表示する',
      link: '#'
    };
  }).reverse(); // 新しい順に並べる
  
  return ContentService
    .createTextOutput(JSON.stringify(json))
    .setMimeType(ContentService.MimeType.JSON);
}

function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}
```

1. **保存**（Ctrl + S）
2. **デプロイ** → **新しいデプロイ**
3. 種類：「**ウェブアプリ**」を選択
4. 説明：`お知らせAPI`
5. 次のユーザーとして実行：「**自分**」
6. アクセス権限：「**全員**」
7. **デプロイ** をクリック
8. **アクセスを承認** → Googleアカウントを選択 → 許可
9. 表示された**ウェブアプリのURL**をコピー

---

## 手順5：サイトに設定

プロジェクトフォルダの `.env` ファイルに以下を追加：

```
VITE_NEWS_API_URL=https://script.google.com/macros/s/xxxxx/exec
```

※ `xxxxx` は手順4でコピーしたURLに置き換え

---

## 運用方法

### お知らせを投稿する

1. Googleフォームを開く（ブックマーク推奨）
2. 各項目を入力
3. 「**送信**」をクリック
4. サイトをリロードすると反映される

### 体験会告知を目立たせる

- 「トップページに固定表示する」にチェックを入れる

---

## 補足：投稿フォームのURLを共有

フォームの編集画面 → 右上「**送信**」→ 🔗リンクアイコン → URLをコピー

このURLを管理者間で共有してください。
