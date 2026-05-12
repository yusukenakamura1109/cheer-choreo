# CLAUDE.md

このファイルは、Claude Code（または将来の他のAIコーディングエージェント）がこのプロジェクトで作業する際の中核的な文脈となるドキュメントです。新しいセッションを開始したら、まずこのファイルを読んでください。

---

## 1. プロダクトの概要

**Cheer Choreo** はチアリーディングコーチ・振付担当・チームキャプテン向けの**振付作成・共有SaaS**です。

### ユーザーが解決したい課題
- 振付の隊形（フォーメーション）を紙やホワイトボードで書いていて、共有・修正が面倒
- スタンツの構成条件（JCA・USA規定）を満たしているか確認しづらい
- 音源との同期確認が大会直前まで難しい
- チーム全体に振付を可視化して伝えるのが大変

### コア機能
- マット規格（USA 9マット ／ JCA 7マット）でのフォーメーション設計
- 真上ビュー＋正面ビュー（人型表示）の切替
- スタンツ（エクステンション・リバティ・ヒールストレッチ等）の構成
- 音源同期再生（BPM自動検出・速度変更・区間ループ）
- カウント単位の隊形遷移と Undo/Redo
- 構成条件の自動判定（簡易採点）

### ターゲット市場
- **国内**：JCA・全日本選手権関連チーム約 1,500〜2,000校、AllStar ジム 80〜120団体、コーチ層 3,000〜5,000人
- **海外**：USA市場（USASF）で日本の10〜20倍規模

詳細なマーケティング戦略・ペルソナ・収益試算は `marketing_plan.md` 参照。

---

## 2. 現在の状態（重要）

### `/demo/cheer_choreo_demo.html`
**単一のHTMLファイルで動く体験版（β版）です。** 約 4,000 行・自己完結型（外部依存ゼロ）。
- すべての機能はクライアントサイド JavaScript で実装
- データは**ブラウザのメモリ上のみ**（リロードで消える）
- 認証・データベース・サーバーサイドのロジック **なし**
- 1ファイルで配布可能、Netlify Drop / Cloudflare Pages / GitHub Pages にドラッグ＆ドロップで公開できる

### このデモの位置づけ
- ✅ プロダクトの **UX・機能性** を実証するリファレンス
- ✅ コーチへのデモ・フィードバック収集用
- ❌ 商用プロダクトのコードベースとして **そのまま使えない**

### 商用版に向けた変換
本格運用には以下が必要：
1. **マルチテナント対応**（複数チーム・複数コーチが独立して使える）
2. **認証システム**（Google・Apple・メール）
3. **クラウド保存**（Firestore or Supabase Postgres）
4. **リアルタイム同期**（コーチ間で同じ振付を共同編集）
5. **決済**（Stripe サブスクリプション）
6. **ストレージ**（音源ファイル）
7. **モバイル最適化＋PWA**（オフライン対応）

詳細は `ARCHITECTURE.md` 参照。

---

## 3. 推奨技術スタック

| レイヤー | 採用 | 理由 |
|---|---|---|
| **フロント** | Next.js 15+ (App Router) + TypeScript + React | エンジニアの確保しやすさ・SSR/ISR・Firebase連携の良さ |
| **スタイリング** | Tailwind CSS + shadcn/ui | 高速開発・モバイル対応の容易さ |
| **状態管理** | Zustand or React Context | 軽量・学習コスト低 |
| **データベース** | Firebase Firestore | リアルタイム同期がデフォルト・運用コスト低 |
| **認証** | Firebase Auth | Google/Apple/Email 一括対応 |
| **ストレージ** | Firebase Storage | 音源アップロード |
| **決済** | Stripe + Firebase Extensions | 業界標準・日本語ドキュメント充実 |
| **ホスティング** | Vercel | Next.js との親和性最高 |
| **モニタリング** | Sentry + Posthog | エラー追跡＋プロダクト分析 |

### Firebase でなく Supabase を選ぶ場合
- Postgres ベース・OSS 系を好む場合
- データ移行の自由度を重視する場合
- 学習材料は若干少なめ

### なぜ Next.js + Firebase か（代替案との比較）
- **vs SvelteKit**：エンジニアプールが小さい
- **vs Nuxt (Vue)**：Firebase/Firestore のサポート量で Next.js が有利
- **vs React Native**：Web First の方が初期コスト低、PWA でモバイル対応可

---

## 4. ディレクトリ構造（提案）

```
cheer-choreo/
├── CLAUDE.md              # このファイル
├── README.md              # 公開用 README
├── ARCHITECTURE.md        # 技術設計
├── ROADMAP.md             # 開発フェーズ
├── HANDOFF_GUIDE.md       # 非エンジニア向け運用ガイド
├── marketing_plan.md      # マーケ計画
├── demo/
│   └── cheer_choreo_demo.html  # 現行β版（リファレンス）
├── app/                   # Next.js App Router
│   ├── (auth)/            # ログイン・サインアップ
│   ├── (dashboard)/       # ダッシュボード
│   ├── [team]/            # チーム別ルート
│   │   ├── formations/    # 振付一覧
│   │   └── members/       # メンバー管理
│   └── api/               # API Routes
├── components/
│   ├── ui/                # shadcn/ui
│   ├── floor/             # フロア描画（マット・人）
│   ├── stunt/             # スタンツ関連
│   ├── timeline/          # タイムライン
│   ├── music/             # 音源パネル
│   └── auth/              # 認証UI
├── lib/
│   ├── firebase/          # Firebase初期化・ヘルパー
│   ├── stunt-rules.ts     # スタンツ採点ロジック
│   └── audio-utils.ts     # BPM検出など
├── types/                 # TypeScript型定義
├── public/                # 静的ファイル
└── tests/                 # テスト
```

---

## 5. コーディング規約

### TypeScript
- `strict: true` 必須
- `any` 禁止（やむを得ない場合は `unknown` 経由）
- 型はディレクトリ内 `types.ts` または `types/` に集約

### React コンポーネント
- 関数コンポーネント + Hooks のみ
- ファイル 1 つに 1 コンポーネント
- Props は型で明示
- サーバーコンポーネント vs クライアントコンポーネントを意識（`"use client"` 明示）

### ファイル命名
- コンポーネント：`PascalCase.tsx`
- フック：`useXxx.ts`
- ユーティリティ：`kebab-case.ts`
- 定数：`UPPER_SNAKE_CASE`

### Git
- ブランチ：`feature/xxx`、`fix/xxx`、`docs/xxx`
- コミットメッセージ：Conventional Commits（`feat:`, `fix:`, `docs:`, `chore:`）
- PR は必ずレビュー1人以上 → main マージ

### Claude Code 利用時のルール
- 変更前後で関連ファイルの整合性をチェック
- 大きな変更は PR を分けて段階的に
- セキュリティ関連（認証・決済・課金）の変更は必ず人間レビュー
- テスト追加を忘れない

---

## 6. データモデル（Firestore）

詳細は `ARCHITECTURE.md` の「データモデル」セクション参照。要約：

```
users/{userId}
  email, displayName, photoURL, plan, currentTeamId

teams/{teamId}
  name, description, ownerId, coachIds[], plan, createdAt

teams/{teamId}/members/{memberId}
  name, role, height?, photoURL?

teams/{teamId}/formations/{formationId}
  name, matMode, frames[], audio, sharedWith[], updatedAt

teams/{teamId}/formations/{formationId}/frames/{frameId}
  name, counts, positions, stunts
```

**重要：** セキュリティルールでチーム内データはチームメンバーのみアクセス可能にする。

---

## 7. よくあるタスクの進め方

### 新機能を追加するとき
1. `ROADMAP.md` で該当 Phase の要件を確認
2. `ARCHITECTURE.md` のデータモデルに変更が必要か確認
3. ブランチを切る：`feature/your-feature`
4. コンポーネント作成（既存パターンに従う）
5. Firestore セキュリティルール更新（必要なら）
6. テスト書く
7. PR 出す

### バグ修正のとき
1. Issue 化（再現手順を書く）
2. デモ HTML で同じ症状が出るか確認（出るなら根本問題の可能性）
3. 修正＋テスト
4. PR

### スタンツ採点ロジックを更新するとき
- ロジックは `lib/stunt-rules.ts` に集約
- 規定変更時はここを修正
- ユニットテスト必須
- リリース前に実際のコーチ・公認審判に確認推奨

---

## 8. デプロイ

### 開発環境
```bash
npm install
cp .env.example .env.local
# Firebase の設定を入力
npm run dev
```

### ステージング
- `main` ブランチへの push で自動デプロイ（Vercel）
- URL: `https://staging.cheerchoreo.app`

### 本番
- `main` から手動で release タグを切る
- タグ push で本番デプロイ
- URL: `https://cheerchoreo.app`（または独自ドメイン）

---

## 9. ローカル開発前の確認事項

新しい開発者がジョインしたら：
1. このファイル全体を読む
2. `README.md` でセットアップ
3. `ARCHITECTURE.md` でデータモデルを理解
4. `ROADMAP.md` で現在のフェーズを確認
5. デモ HTML をブラウザで開いて触ってみる（プロダクトの感覚を掴む）

---

## 10. 連絡先・意思決定者

- **プロダクトオーナー**：祐介（GitHub: yusukenakamura1109）
- **重要な意思決定**：オーナー承認必須
  - 価格設定の変更
  - 利用規約・プライバシーポリシーの変更
  - ブランディング変更
  - パートナーシップ

---

## 11. 参考ドキュメント

リポジトリ内：
- `README.md` - 開発開始の手順
- `ARCHITECTURE.md` - 技術設計詳細
- `ROADMAP.md` - フェーズ別計画
- `HANDOFF_GUIDE.md` - チーム編成・運営
- `marketing_plan.md` - 市場分析・販売戦略
- `操作チートシート.md` - β版の操作方法（ユーザー向け）
- `demo/cheer_choreo_demo.html` - リファレンス実装

外部：
- Firebase Console: https://console.firebase.google.com/
- Vercel Dashboard: https://vercel.com/dashboard
- Stripe Dashboard: https://dashboard.stripe.com/

---

## 12. このドキュメントの更新ルール

- メジャー変更（アーキテクチャ・データモデル・技術選定）があれば必ず更新
- 月1回見直す
- PR で変更し、オーナー承認を経てマージ
