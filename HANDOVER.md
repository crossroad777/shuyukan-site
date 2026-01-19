# 開発引継ぎ資料 (Handover Document)

豊中修猷館ウェブサイトおよび部員ポータル開発の引継ぎ資料です。後任の方は、必ず本ドキュメントを一読してから着手してください。

## 1. 環境情報・システム構造

### 管理者・アカウント情報

| サービス | アカウント / 管理場所 | 役割 |
| --- | --- | --- |
| **Google Drive** | `shuyukan.info@gmail.com` | 部員データベース（スプレッドシート）の保存場所 |
| **Git / Vercel / Firebase** | `kotani.tatsuhiro@gmail.com` | ソースコード、ホスティング、コンソール管理 |
| **ポータル構造設計** | [portal-ux-design.md](file:///c:/Users/kotan/Desktop/shuyukan/shuyukan-react-starter-runnable/shuyukan-react-starter/docs/portal-ux-design.md) | **※着手前に必ず熟読すること** |

### 技術スタック

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend/API**: Google Apps Script (GAS)
- **Database**: Google Sheets (API経由)
- **Auth**: Firebase Authentication (拡張予定)
- **Hosting**: Vercel (検討継続)

---

## 2. 現在のステータスと動作確認済み事項

### 実装済みの機能・改善

- **UI/UX刷新**: 入会案内LP、親向けメリットページ、SNSロゴ適用。
- **スマホ最適化**: スワイプ用◀▶ガイド、レスポンシブな改行/配置、メニューのスクロール修正。
- **お知らせ機能**: 投稿から7日以内であれば自動で点滅する「NEW」バッジを表示。
- **動作確認**: 管理者画面（承認、お問い合わせ、統計）および部員画面（出欠、会計）のUI・遷移が正常に動作することを確認済み。

---

## 3. 次の課題・宿題リスト (TODO)

詳細なタスク一覧は [task.md](file:///C:/Users/kotan/.gemini/antigravity/brain/16800a32-1451-4cd5-9014-7aafb9a18b2b/task.md) を参照してください。

### A. 認証・セキュリティ (最優先)

- **Googleログイン**: Google推奨のベストプラクティスに準拠した実装。
- **承認・ロール**: 新規登録の承認制（pending→approved）と権限管理。
- **防御・監査**: レート制限、reCAPTCHA、操作ログの記録。
- **メールリマインド**: 重要なお知らせや、未承認リクエストがある際の**メール通知機能**の実装（宿題）。
- **バッジの視認性改善**: 「NEW」バッジやポータルの通知バッジがより直感的に伝わるよう、デザインや表示条件を再検討（宿題）。

### B. インフラ・SEO

- **ホスティング検討**: Vercel以外も含めた最適な公開環境の選定。
- **SEO対策**: メタタグの整備、検索エンジンへの最適化。

### C. コンテンツ・外部連携

- **Googleカレンダー**: 月表示・閲覧専用の埋め込み。
- **指導者紹介**: 理念に沿った文言の確定と写真の差し替え。
- **スマホログインボタン**: アクセス性を考慮した配置。

---

## 4. 開発・デプロイ上の注意点

- **実際のファイルの展開**: `src/` 以下がメインコードです。`npm run dev` で開発環境が起動します。
- **GASのデプロイ**: `docs/unified_apps_script.gs` の修正後は、Google Apps Scriptエディタ上で「新しいデプロイ」を必ず行ってください。
- **現在、コード上に致命的なエラー（ビルド落ち等）は残っていません。**

---

## 5. 参考資料

- [member-database-guide.md](file:///c:/Users/kotan/Desktop/shuyukan/shuyukan-react-starter-runnable/shuyukan-react-starter/docs/member-database-guide.md): DB構造
- [gas_deployment_guide.md](file:///c:/Users/kotan/Desktop/shuyukan/shuyukan-react-starter-runnable/shuyukan-react-starter/docs/gas_deployment_guide.md): デプロイ手順
