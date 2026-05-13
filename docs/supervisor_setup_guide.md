# Supervisor Setup Guide — 祐介さん専用セットアップ手順

このドキュメントは、CEO（Claude Code）が物理的に実行できない **アカウント所有者操作** をまとめたものです。AGENT_CHARTER §3 の 🔴 RED 案件に該当するものを中心に、祐介さんが手を動かす必要がある作業を **コピペできる粒度** で書いています。

最終更新：2026-05-13

---

## チェックリスト（最初の2週間で完了したいもの）

- [ ] **1. Node.js のインストール**（〜10分／このセクションの推奨案で実施）
- [ ] **2. Firebase プロジェクト作成**（〜20分）
- [ ] **3. Vercel アカウント連携**（〜15分）
- [ ] （後回し）GitHub Secrets 登録（Firebase / Vercel の鍵を CI に渡す用）

ドメイン取得（cheerchoreo.app など、年¥1,500）と Apple ログイン（Apple Developer Program、年 $99）は **Phase 1 後半** に再検討するため、本ガイドからは外しています。

---

## 1. Node.js のインストール

CEO（Claude Code）が Next.js を立ち上げるのに Node.js が必要です。祐介さんの Mac には現在 Node がインストールされていないので、入れていただく必要があります。

### 推奨：nvm 経由でインストール（管理者パスワード不要、後で消しやすい）

1. ターミナルで以下を実行（nvm = Node Version Manager のインストーラ）：

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   ```

2. ターミナルを **一度閉じて開き直す**（または `source ~/.zshrc` を実行）。

3. LTS 版 Node をインストール：

   ```bash
   nvm install --lts
   nvm use --lts
   ```

4. 動作確認：

   ```bash
   node --version    # v22.x.x のような表示
   npm --version     # 10.x.x のような表示
   ```

完了したら Cowork で「Node 入れた」と一言ください。CEO 側で Next.js のスキャフォールドを開始します。

### 代替：Homebrew 経由（既に brew を使っている場合）

```bash
brew install node@22
```

### 代替：公式 .pkg インストーラ

<https://nodejs.org/en/download> から LTS 版の macOS Installer (.pkg) をダウンロード → 実行。管理者パスワードが必要。

---

## 2. Firebase プロジェクト作成（Q1）

### 何のため？
ユーザー認証（Google ログイン）、データベース（振付の保存）、ファイルストレージ（音源アップロード）の3つを Firebase で提供します。**初期は無料 Spark プラン** で運用、ユーザー増加に応じて従量課金（Blaze プラン）へ。

### 手順

1. <https://console.firebase.google.com/> にアクセス（Google アカウントでログイン、祐介さんの普段のアカウントで OK）

2. **「プロジェクトを追加」** をクリック

3. プロジェクト名：`cheer-choreo-staging`（あとで `cheer-choreo-prod` も追加します。まずは staging から）

4. Google Analytics は **無効** で OK（不要）

5. プロジェクト作成完了したら、左メニューの **「Authentication」** → **「Sign-in method」** タブ
   - **Google** を有効化（プロジェクトサポートメール：祐介さんのメール）
   - **メール/パスワード** を有効化

6. 左メニュー **「Firestore Database」** → **「データベースの作成」**
   - モード：**本番環境モード**（CEO 側でセキュリティルールを書きます）
   - ロケーション：**asia-northeast1（東京）**

7. 左メニュー **「Storage」** → **「始める」**
   - 同じく本番環境モード、東京リージョン

8. 左メニュー上の **歯車アイコン → プロジェクトの設定**
   - 下にスクロール → **「アプリ」セクション → ウェブアプリ（</> アイコン）を追加**
   - ニックネーム：`cheer-choreo-web`
   - 「Firebase Hosting も設定」は **チェック不要**
   - **登録後に表示される `firebaseConfig` のコードブロックを丸ごとコピー** して Cowork で CEO に送ってください

```javascript
// 例：こんな感じのものが表示されます（実際の値は別物）
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "cheer-choreo-staging.firebaseapp.com",
  projectId: "cheer-choreo-staging",
  storageBucket: "cheer-choreo-staging.appspot.com",
  messagingSenderId: "...",
  appId: "1:...:web:..."
};
```

※ この config 値は **API キーですが Firebase の仕様上クライアントに露出する前提のもの** で、セキュリティはセキュリティルールで担保します。普通に Cowork に貼っても OK ですが、念のため DM 推奨。

### 後で：本番プロジェクト

同じ手順で `cheer-choreo-prod` を作成。Phase 1 終盤（M3）で staging が安定したら追加します。

---

## 3. Vercel アカウント連携（Q2）

### 何のため？
Next.js アプリのホスティング（自動デプロイ）。**Hobby プラン無料** で開始。

### 手順

1. <https://vercel.com/signup> にアクセス
2. **「Continue with GitHub」** を選択（祐介さんの `yusukenakamura1109` アカウントで連携）
3. アカウント作成後、ダッシュボードで **「Add New...」 → 「Project」** をクリック
4. **「Import Git Repository」** で `yusukenakamura1109/cheer-choreo` を選択
   - 表示されない場合は **「Adjust GitHub App Permissions」** から Vercel に本リポジトリへのアクセスを許可
5. プロジェクト設定画面：
   - **Project Name**：`cheer-choreo-staging`
   - **Framework Preset**：Next.js（自動検出）
   - **Root Directory**：`./`
   - **Environment Variables**：ここで Firebase config を入れます（CEO 側からキーリストを送るので、それを貼ってください）。以下は予定キー：
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`
6. **「Deploy」** をクリック（初回はスキャフォールド前なのでビルド失敗します。それで OK、後で CEO がコードを push したら自動で再ビルドされます）

### ドメイン

デフォルトで `cheer-choreo-staging-xxx.vercel.app` のようなランダム URL が割り当てられます。独自ドメイン（`staging.cheerchoreo.app` 等）は **ドメイン取得後**（Q3）に紐付け。

---

## 4. GitHub Secrets 登録（後で）

Vercel 連携完了後、CI から本番デプロイするための鍵を GitHub Secrets に登録します。具体的な値リストは CEO から指示します。

---

## CEO（Claude Code）からの連絡待ち項目

セットアップが終わったら、Cowork チャットで以下を CEO に伝えてください：

1. ✅ Node.js 入れた
2. ✅ Firebase staging 作成完了 → `firebaseConfig` の中身（DMで）
3. ✅ Vercel プロジェクト作成完了 → プロジェクト URL（`https://vercel.com/yusukenakamura1109/cheer-choreo-staging` のような）

CEO 側で受け取り次第、Next.js スキャフォールドを push → Vercel が自動デプロイ → staging URL が動き始めます。

---

## トラブルシュート

| 症状 | 対処 |
|---|---|
| `nvm: command not found` | ターミナルを開き直す。それでもダメなら `~/.zshrc` の末尾に `export NVM_DIR="$HOME/.nvm"` と `[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"` が入っているか確認 |
| Firebase の Authentication で Google が有効化できない | プロジェクトサポートメールが未入力。歯車 → プロジェクトの設定 → 全般 で設定 |
| Vercel で「Build failed」 | スキャフォールド前なので正常。CEO のコード push 待ち |
| GitHub App Permissions が反映されない | Vercel ダッシュボード → Settings → Git Integration から GitHub を一度解除して再連携 |

困ったら遠慮なく Cowork チャットで「Setup #1 の手順 3 でつまずいた」のように具体的に質問してください。
