---
description: Apps Script再デプロイ後のURL更新とVercelデプロイ
---

# Apps Script URL更新ワークフロー

Apps Scriptを再デプロイした後、必ず以下の手順でフロントエンドを更新してください。

## 1. 新しいURLを取得

Apps Scriptの「デプロイ」→「デプロイを管理」から最新のウェブアプリURLをコピー

## 2. ローカル環境変数を更新

// turbo

```bash
# .env ファイルを編集
# VITE_MEMBER_API_URL と VITE_NEWS_API_URL を新しいURLに変更
```

## 3. Vercel環境変数を更新

```bash
# 古い変数を削除
npx vercel env rm VITE_MEMBER_API_URL production -y
npx vercel env rm VITE_NEWS_API_URL production -y

# 新しい変数を追加（URLを実際の値に置き換える）
echo "新しいURL" | npx vercel env add VITE_MEMBER_API_URL production
echo "新しいURL" | npx vercel env add VITE_NEWS_API_URL production
```

## 4. 再デプロイ

```bash
npx vercel --prod
```

## 5. 確認

ブラウザでハードリロード（Ctrl+Shift+R）して会員データが表示されるか確認
