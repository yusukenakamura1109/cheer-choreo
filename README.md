# Cheer Choreo

チアリーディングの振付（フォーメーション・スタンツ・音源同期）を iPad / スマホ / PC で直感的に作れるWebアプリ。

![status](https://img.shields.io/badge/status-beta-orange)
![license](https://img.shields.io/badge/license-Proprietary-blue)

---

## 🎯 何ができるアプリ？

- **USA 9マット / JCA 7マット** の実寸フィールドで隊形を作成
- **真上ビュー / 正面ビュー（人型表示）** を自由に切替
- **スタンツ構成**（エクステンション・リバティ・ヒールストレッチなど）
- **音源同期再生**（BPM自動検出・速度0.5x〜1.5x・区間ループ）
- **1カウント単位で隊形遷移を確認・編集**
- **構成条件の自動チェック**（参考レベル判定）
- **チーム共有**（β以降）

ターゲットユーザー：チアリーディングのコーチ、振付担当、チームキャプテン、AllStarジムのインストラクター。

---

## 🌐 公開URL

- **β版（現行）**：[https://yusukenakamura1109.github.io/cheer-choreo/](https://yusukenakamura1109.github.io/cheer-choreo/)
- **本番版（予定）**：TBD（独自ドメイン取得後）

---

## 📂 リポジトリ構成

| ディレクトリ／ファイル | 内容 |
|---|---|
| `CLAUDE.md` | プロジェクトの中核ドキュメント（必読） |
| `ARCHITECTURE.md` | 技術設計・データモデル |
| `ROADMAP.md` | 開発フェーズ計画 |
| `HANDOFF_GUIDE.md` | チーム編成・運営ガイド |
| `marketing_plan.md` | 市場分析・販売戦略 |
| `操作チートシート.md` | β版ユーザー向け操作ガイド |
| `index.html` | 現行β版（単一HTMLファイル、GitHub Pages 配信） |
| `app/` | Next.js アプリケーション（Phase1以降） |
| `components/` | React コンポーネント |
| `lib/` | ユーティリティ・ロジック |

---

## 🚀 開発を始める

### 必要なもの

- Node.js 20+ / npm or pnpm
- Firebase アカウント（無料）
- Git
- VSCode（推奨）+ Claude Code（推奨）

### セットアップ手順

```bash
# 1. クローン
git clone https://github.com/yusukenakamura1109/cheer-choreo.git
cd cheer-choreo

# 2. 依存パッケージのインストール（Phase1以降）
npm install

# 3. 環境変数の設定
cp .env.example .env.local
# .env.local に Firebase の設定を入力

# 4. 開発サーバー起動
npm run dev
```

開発サーバーは `http://localhost:3000` で起動します。

### β版の確認（現状）

`index.html` をブラウザにドラッグ&ドロップするだけで動きます（追加セットアップ不要）。

---

## 🛠 主要コマンド

```bash
npm run dev        # 開発サーバー
npm run build      # プロダクションビルド
npm run start      # プロダクションサーバー
npm run lint       # ESLint
npm run typecheck  # TypeScript 型チェック
npm run test       # ユニットテスト
npm run test:e2e   # E2Eテスト（Playwright）
```

---

## 👥 開発体制

- **プロダクトオーナー**：祐介
- **開発**：Claude Code を活用する開発チーム（募集中）
- **デザイン**：β版 UI ベースに進化

---

## 📝 ライセンス

本リポジトリは独自プロプライエタリ・ライセンスです。無断複製・改変・再配布は禁止されています。
コーチや関係者へのβ版アプリの共有は許可されています（販売目的でなければ）。

---

## 🤝 コントリビューション

開発チームメンバー向けの貢献ガイドは `CLAUDE.md` 内の「コーディング規約」を参照してください。

---

## 📞 お問い合わせ

- 機能リクエスト・バグ報告：GitHub Issues
- パートナーシップ・取材：（プロダクトオーナーの連絡先）

---

**現在は β段階。本格機能は ROADMAP.md の Phase1 以降で実装予定。**
