# Phase 1 計画書 — MVP（Web SaaS・個人向け）

**起草日**：2026-05-13
**起草者**：Claude Code（CEO / 技術責任者）
**承認待ち**：祐介（Supervisor）

このドキュメントは ROADMAP.md の Phase 1 を着手可能なタスクに分解した実行計画書。

---

## 0. ゴールの再確認

> 個人コーチが自分のアカウントを作って、自分の振付を保存・編集・共有できる Web SaaS（MVP）。

### DoD（ROADMAP より抜粋）
- [ ] サインアップ → 振付作成 → 共有 まで一連の流れが動く
- [ ] iPhone Safari / iPad Safari / Chrome（PC/Mobile）で動作確認済
- [ ] β版コーチ20人にフィードバック収集
- [ ] エラー率 < 1%、ページロード（モバイル 3G）< 3秒

---

## 1. マイルストーン（30 / 60 / 90 日）

期間：2026-05-13 〜 2026-08-13（90日）

### 🪜 M1：基盤＋認証＋フロア骨格（Day 1–30、〜2026-06-12）

> 「ログインしてダッシュボードに入り、空のフロアが見える」段階

- リポジトリ整備（不整合修正、`.gitignore`、ドキュメント参照パス統一）
- Next.js 15 + TypeScript strict + Tailwind + shadcn/ui スキャフォルド
- Zustand 状態管理セットアップ
- Vitest + React Testing Library + Playwright スケルトン
- GitHub Actions CI（lint / typecheck / test）
- Firebase プロジェクト連携（Auth / Firestore / Storage の初期化）
- Vercel デプロイ連携（staging.cheerchoreo.app）
- Google ログイン、サインアップ、ログアウト
- `users/{userId}` ドキュメント自動生成
- オンボーディング（チーム名入力 → `teams/{teamId}` 作成）
- 認証保護のダッシュボードルート
- フロア描画（USA 9マット / JCA 7マット、真上ビュー）
- メンバー CRUD（Firestore `teams/{teamId}/members`）
- Firestore セキュリティルール v1

**M1 完了の判定**：Google アカウントでサインアップしてチーム作成し、メンバー登録後に空のフロアが iPhone Safari と PC Chrome で表示できる。staging URL を Supervisor に共有してレビュー依頼。

---

### 🪜 M2：振付エディタ・コア（Day 31–60、〜2026-07-12）

> 「複数フレームで隊形遷移を組み、音源同期で再生できる」段階

- 正面ビュー（人型表示）
- フレーム CRUD（`teams/{teamId}/formations/{formationId}/frames`）
- フレーム並び替え（drag）、カウント設定
- メンバー配置のドラッグ＆タップ移動
- スタンツ構造（prep / extension / liberty / heelStretch / scorpion / arabesque / bowAndArrow）
- スタンツのレベル（ground / shoulder / extension）切替
- Undo / Redo（Zustand + 履歴スタック）
- 音源アップロード（Firebase Storage）
- BPM 検出（Web Audio API、β版ロジックを `lib/audio-utils.ts` に移植）
- 再生（速度 0.5x〜1.5x、区間ループ、オフセット同期）
- 採点判定（簡易ルール、`lib/stunt-rules.ts` に集約、ユニットテスト必須）
- 自動保存（編集ごとに Firestore に書き込み、500ms デバウンス）

**M2 完了の判定**：1曲分の振付（5フレーム以上）を作成 → 保存 → リロード後も復元される。再生で音源と隊形遷移が同期する。

---

### 🪜 M3：共有・仕上げ・β投入（Day 61–90、〜2026-08-13）

> 「閲覧専用 URL で他人に振付を見せられる」「β版コーチ20人が使える」段階

- 振付一覧ダッシュボード
- 振付詳細・編集画面の動線整備
- 「閲覧専用 URL」発行（トークン付き、`visibility: "public"` の代替フロー）
- QRコード自動生成
- SNS シェアボタン（X / LINE）
- Apple ログイン（条件付き：Q6 の回答次第）
- メール+パスワードログイン
- ヘルプモーダル / 操作カード / フォーメーションプリセット移植
- ダークモード仕上げ
- 日本語ローカライズ完璧化（i18n キー化、ja-JP）
- エラーハンドリング・ローディング表示
- レスポンシブ：iPhone Safari / iPad Safari / Android Chrome 動作確認
- E2E テスト：サインアップ → 振付作成 → 共有 の主要フロー
- パフォーマンス計測：モバイル 3G < 3秒、編集操作 < 100ms
- β版コーチ20人へ staging 招待 → アンケート回収
- リリースノート起草、Phase 1 → Phase 2 引き継ぎメモ

**M3 完了の判定**：DoD すべてチェック済み。Supervisor とのレビュー MTG を提案。

---

## 2. 最初の2週間の詳細タスク（GitHub Issue 粒度）

各タスクに権限レベル（🟢 GREEN / 🟡 YELLOW / 🔴 RED）と推定所要時間（h）を付記。

### Week 1（2026-05-13 〜 2026-05-19）：足場固め

| # | タスク | レベル | 見積 | 備考 |
|---|---|---|---|---|
| 1 | リポジトリ参照パスの整合（`demo/cheer_choreo_demo.html` → `index.html` or 逆。Supervisor Q5 回答後） | 🟢 | 0.5h | 文書修正のみ |
| 2 | `.gitignore` 追加（Node / Next.js / `.env*` / `.DS_Store`） | 🟢 | 0.2h | |
| 3 | Next.js 15（App Router）+ TypeScript strict プロジェクト初期化 | 🟡 | 2h | 主要ライブラリ追加。事後報告 |
| 4 | Tailwind CSS + shadcn/ui セットアップ | 🟡 | 1.5h | |
| 5 | Zustand 導入 + 初期 store スケルトン | 🟡 | 1h | |
| 6 | ESLint + Prettier 設定（プロジェクト規約に合わせる） | 🟢 | 1h | |
| 7 | Vitest + React Testing Library 導入 | 🟡 | 1.5h | |
| 8 | Playwright 導入 + 最小スモークテスト（`/` が200を返す） | 🟡 | 1.5h | |
| 9 | GitHub Actions CI：`lint` / `typecheck` / `test` を PR で走らせる | 🟡 | 2h | |
| 10 | ベースレイアウト（header / theme provider / 認証コンテキスト） | 🟢 | 2h | |
| 11 | ダークモード切替（システム連動＋手動） | 🟢 | 1h | |

**Week 1 終了時の状態**：ローカルで `npm run dev` が立ち上がり、空のホームページが表示される。CI が green。

---

### Week 2（2026-05-20 〜 2026-05-26）：認証＋初回 Firestore 書き込み

| # | タスク | レベル | 見積 | 備考 |
|---|---|---|---|---|
| 12 | Firebase プロジェクト作成（Supervisor 側で実施 → config 共有） | 🔴 | — | Q1：Supervisor 承認・実施待ち |
| 13 | `.env.example` テンプレ作成、`.env.local` でローカル動作 | 🟢 | 0.5h | |
| 14 | `lib/firebase/` 初期化ユーティリティ | 🟡 | 1h | |
| 15 | Google ログインフロー（`signInWithPopup`） | 🟡 | 2h | |
| 16 | 認証ガード HOC / hook（`useAuth`） | 🟡 | 1.5h | |
| 17 | `users/{userId}` 初回ログイン時自動生成（client trigger） | 🟡 | 1.5h | |
| 18 | オンボーディング画面：チーム名入力 → `teams/{teamId}` 作成 | 🟡 | 3h | |
| 19 | ダッシュボードルート（認証必須、`/dashboard`） | 🟢 | 1h | |
| 20 | ログアウト機能 | 🟢 | 0.3h | |
| 21 | Firestore セキュリティルール v1（`users` / `teams` 基本ルール）＋ローカル emulator テスト | 🟡 | 2.5h | |
| 22 | Vercel プロジェクト連携・staging 自動デプロイ | 🔴 | — | Q2：Supervisor 承認・実施待ち |
| 23 | 初回 E2E：サインアップ → オンボーディング → ダッシュボード | 🟡 | 2h | |

**Week 2 終了時の状態**：staging.cheerchoreo.app（仮 URL）で Google ログイン → チーム作成 → ダッシュボード遷移ができる。

---

## 3. 権限レベル別サマリー

| レベル | 件数 | 内容 |
|---|---|---|
| 🟢 GREEN（黙々と実行） | 9 | 設定・スケルトン・誤字修正 |
| 🟡 YELLOW（事後報告） | 12 | ライブラリ追加、API 実装、Firestore ルール |
| 🔴 RED（承認必須） | 2 | Firebase プロジェクト作成、Vercel 連携 |

RED 2件は外部サービスの **アカウント連携**（祐介さんのアカウントで作成する必要があるためコスト発生ではない）。両方とも無料プラン（Firebase Spark / Vercel Hobby）で開始可能。

---

## 4. リスク・前提条件

| リスク | 影響 | 対策 |
|---|---|---|
| Firebase / Vercel アカウントの連携待ち | Week 2 がブロック | 並行して β版（index.html）のロジック切り出し（`lib/audio-utils.ts`、`lib/stunt-rules.ts` の骨格）を進める |
| β版（index.html）が単一ファイル4,000行 | 機能移植時に解読コストが高い | 機能単位で grep → 切り出し → ユニットテスト化 |
| Apple ログインに Apple Developer Program 加入が必要（年 $99） | RED 案件、Phase 1 必須かどうか不明 | Q6：Google + Email のみで MVP リリースし、Apple は Phase 1.5 で追加する選択肢を提案 |
| `marketing_plan.md` 未アップロード | 市場戦略のコンテキスト不足 | Q9：別途共有依頼 |
| index.html を `demo/` に移すと GitHub Pages の URL が変わる | β版を共有中のコーチに影響 | Q5：方針確定後に GitHub Pages 設定も同時調整 |

---

## 5. 採用判断（人を雇うか）

ROADMAP では「フルスタックエンジニア1名、月¥40〜80万 × 3ヶ月」を想定。AGENT_CHARTER は Claude Code 単独で進める前提だが、以下のタスクは人間が必要：

- 🚫 Firebase / Vercel / ドメインの **アカウント所有者としての操作**（祐介さんが対応）
- 🚫 利用規約・プライバシーポリシーの**弁護士レビュー**
- 🚫 β版コーチへの**ヒアリング・関係維持**
- 🚫 Apple Developer Program 加入手続き

Claude Code が代行できる範囲（コード実装・テスト・ドキュメント・PR）で Phase 1 はカバー可能と判断。Q10：人間エンジニアの追加採用は **Phase 2 開始時に再評価** することを提案。

---

## 6. KPI 目標（Phase 1 自己評価）

| 指標 | 目標 |
|---|---|
| Phase 1 完了率 | 30日後 30% / 60日後 60% / 90日後 100% |
| デイリーログ記入率 | 作業日の100% |
| 週次レポート提出 | 100%（金曜中） |
| PR 平均サイズ | 500行以下 |
| テストカバレッジ | 80%以上 |
| 重大バグ（本番影響） | 0件 |
| 依存パッケージ脆弱性（High以上） | 0件常時維持 |

---

## 7. 次のアクション

1. Supervisor に本計画書をレビュー依頼（応答末尾の質問10件と併せて）
2. 質問 #1（Firebase）/ #2（Vercel）の承認・実施
3. 承認後、Week 1 タスク #1〜#11 を着手
4. ブロック解消前は、ドキュメント整合（#1）と `.gitignore`（#2）を先行
