# 開発引継ぎ資料 (Handover Document)

豊中修猷館ウェブサイトおよび部員ポータル開発の引継ぎ資料です。

## 1. 環境情報・アカウント

| サービス | アカウント / 管理者 / URL | 備考 |
| --- | --- | --- |
| **Google Drive** | <shuyukan.info@gmail.com> | スプレッドシート（DB）の保存場所 |
| **Git / Vercel / Firebase** | <kotani.tatsuhiro@gmail.com> | ソースコード管理・ホスティング |
| **部員ポータルURL** | <https://shuyukan-portal.vercel.app/> | 本番環境 |
| **Apps Script (API)** | 上記Gmail紐付けのGAS | <https://script.google.com/macros/s/.../exec> |

---

## 2. 重要ドキュメント

開発に着手する前に、必ず以下のファイルを読み込み、構造を理解してください。

1. [portal-ux-design.md](file:///c:/Users/kotan/Desktop/shuyukan/shuyukan-react-starter-runnable/shuyukan-react-starter/docs/portal-ux-design.md): ポータルの権限設計とUI思想
2. [member-database-guide.md](file:///c:/Users/kotan/Desktop/shuyukan/shuyukan-react-starter-runnable/shuyukan-react-starter/docs/member-database-guide.md): データベース（スプレッドシート）の構造と編集手順
3. [unified_apps_script.gs](file:///c:/Users/kotan/Desktop/shuyukan/shuyukan-react-starter-runnable/shuyukan-react-starter/docs/unified_apps_script.gs): バックエンドAPIのソースコード

---

## 3. 現在のステータスと解決済みの課題

### 直近で修正・対応した内容 (2026/01/19)

- **「白くなるエラー」の修正**: お知らせの日付パースが厳密すぎてISO形式以外でクラッシュしていた問題を [NewsSection.jsx](file:///c:/Users/kotan/Desktop/shuyukan/shuyukan-react-starter-runnable/shuyukan-react-starter/src/components/NewsSection.jsx) で修正。
- **日付表示の統一**: 「月/日」形式（例: 1/13）への統一。
- **GASの堅牢化**: スプレッドシートの列が追加・移動されてもデータ取得が壊れないよう、[MEMBER_KEY_MAP] による動的マッピングを [unified_apps_script.gs] に実装。
- **Facebook連携**: ホームページに公式Facebookの投稿枠（Facebook Page Plugin）を追加、およびフッターにリンクを追加。
- **ドキュメント修正**: [member-database-guide.md] の記述エラー（Markdown Lintエラー）をすべて解消。

---

## 4. 残タスク・懸案事項（次にやるべきこと）

### A. GASの再デプロイ（最優先）

私が修正した [unified_apps_script.gs] の内容はローカルファイルに保存されていますが、**本番環境で反映させるには、Google Apps Scriptのエディタへコピー＆ペーストし、「新しいデプロイ」を完了させる必要があります。**
これをしないと、スプレッドシートの列を操作した際に再度システムが壊れる可能性があります。

### B. 未実装の機能

- **指導者写真の差し替え**: 現在はプレースホルダーです。
- **指導者紹介の文言調整**: 指導者の方から提供された文章への更新が必要です。
- **会計・出欠のグラフ表示強化**: [AccountingDashboard.jsx] などで、より詳細な統計が見れると便利です。

### C. 現在の「エラー」について

ユーザーから報告された「謎の数字と記号（JSONデータ）」は、単なる**エディタの自動修正レポート**であり、バグではありません。現在はすべて修正済みで、コードとしてのエラー箇所は残っていません。

---

## 5. 技術スタック

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend/DB**: Google Apps Script + Google Sheets API
- **Auth**: Firebase Authentication (Email/Password)
- **Deployment**: Vercel

## 6. 開発の注意点

- **CORS対策**: GASへのPOST送信は `Content-Type: 'text/plain'` で送ることで、プリフライト（OPTIONS）リクエストを回避する実装になっています（[attendanceService.js] 参照）。
- **認証**: 会員・管理者でUIを切り分けています。
