# ARCHITECTURE — 技術設計書

このドキュメントは、Cheer Choreo の商用版（Phase 1 以降）の技術設計を記載します。

---

## 1. システム構成

```
┌─────────────────────────────────────────────────────────┐
│  Browser (Next.js Client)                                │
│  ・React コンポーネント                                  │
│  ・Zustand 状態管理                                      │
│  ・Firebase SDK                                          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼ HTTPS
┌─────────────────────────────────────────────────────────┐
│  Vercel Edge / Next.js Server                            │
│  ・SSR / ISR                                             │
│  ・API Routes（必要に応じて）                            │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌────────────────┐  ┌────────────────────┐
│ Firebase Auth  │  │ Firestore (DB)     │
│ Google/Apple/  │  │ ・users            │
│ Email          │  │ ・teams            │
│                │  │ ・formations       │
└────────────────┘  │ ・members          │
                    └────────────────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ Firebase Storage   │
                    │ ・音源ファイル     │
                    │ ・プロフィール画像 │
                    └────────────────────┘

         決済：Stripe（Firebase Extensions 経由）
         監視：Sentry, Posthog, Firebase Analytics
```

---

## 2. データモデル（Firestore）

### users
```
users/{userId}
  email: string
  displayName: string
  photoURL: string?
  plan: "free" | "pro" | "team"
  currentTeamId: string?
  createdAt: timestamp
  updatedAt: timestamp
  emailVerified: boolean
  stripeCustomerId: string?
  preferences: {
    matMode: "usa" | "jca"
    viewMode: "top" | "front"
    locale: "ja" | "en"
  }
```

### teams
```
teams/{teamId}
  name: string
  description: string
  ownerId: string  // user id
  coachIds: string[]  // ユーザーID 配列
  plan: "free" | "team"
  logoURL: string?
  createdAt: timestamp
  updatedAt: timestamp
  settings: {
    defaultMatMode: "usa" | "jca"
    timeZone: string
  }
  stats: {
    formationsCount: number
    membersCount: number
  }
```

### teams/{teamId}/members
チームに所属する選手（cheerleader）。ユーザーアカウントを持たない場合もある。
```
teams/{teamId}/members/{memberId}
  name: string
  role: "base" | "top" | "spotter" | "backspot"
  height: number?  // cm
  weight: number?  // kg
  notes: string?
  photoURL: string?
  active: boolean
  joinedAt: timestamp
```

### teams/{teamId}/formations
振付の単位（1ステージ・1演技）。
```
teams/{teamId}/formations/{formationId}
  name: string
  description: string?
  matMode: "usa" | "jca"
  audio: {
    storageURL: string?
    bpm: number
    offsetSec: number
    loopStartSec: number?
    loopEndSec: number?
  }
  visibility: "private" | "team" | "public"
  sharedWith: string[]  // userIds
  ownerId: string
  createdAt: timestamp
  updatedAt: timestamp
  tags: string[]
  thumbnail: string?  // 1stフレームのスクショ
```

### teams/{teamId}/formations/{formationId}/frames
1隊形分のデータ。サブコレクション。
```
teams/{teamId}/formations/{formationId}/frames/{frameId}
  order: number  // 並び順
  name: string
  counts: number
  positions: {
    [memberId]: {
      x: number  // 0-1 正規化
      y: number  // 0-1 正規化
      level: "ground" | "shoulder" | "extension"
      bodyPos: "basic" | "liberty" | "heelStretch" | "scorpion" | "arabesque" | "bowAndArrow"
    }
  }
  stunts: [
    {
      id: string
      type: "prep" | "extension" | "liberty" | "halfUp" | "fullUp" | ...
      topId: string
      baseIds: string[]
      spotterId: string?
      backspotId: string?
    }
  ]
  createdAt: timestamp
```

### subscriptions（Stripe 連携）
```
users/{userId}/subscriptions/{subId}
  status: "active" | "trialing" | "canceled" | "past_due"
  plan: "pro_monthly" | "pro_yearly" | "team_monthly" | "team_yearly"
  currentPeriodEnd: timestamp
  cancelAtPeriodEnd: boolean
  stripeSubscriptionId: string
```

---

## 3. Firestore セキュリティルール（概要）

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザー：自分のみ
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // チーム：オーナー or コーチ
    match /teams/{teamId} {
      allow read: if isTeamMember(teamId);
      allow update: if isTeamCoach(teamId);
      allow delete: if isTeamOwner(teamId);
      allow create: if request.auth != null;
    }

    // メンバー：チームコーチ管理
    match /teams/{teamId}/members/{memberId} {
      allow read: if isTeamMember(teamId);
      allow write: if isTeamCoach(teamId);
    }

    // 振付：チーム内 or 共有相手 or 公開
    match /teams/{teamId}/formations/{formationId} {
      allow read: if isTeamMember(teamId)
                  || resource.data.visibility == "public"
                  || request.auth.uid in resource.data.sharedWith;
      allow write: if isTeamCoach(teamId);

      match /frames/{frameId} {
        allow read: if isTeamMember(teamId);
        allow write: if isTeamCoach(teamId);
      }
    }

    function isTeamMember(teamId) {
      return request.auth != null && (
        request.auth.uid == get(/databases/$(database)/documents/teams/$(teamId)).data.ownerId
        || request.auth.uid in get(/databases/$(database)/documents/teams/$(teamId)).data.coachIds
      );
    }
    function isTeamCoach(teamId) { return isTeamMember(teamId); }
    function isTeamOwner(teamId) {
      return request.auth != null
        && request.auth.uid == get(/databases/$(database)/documents/teams/$(teamId)).data.ownerId;
    }
  }
}
```

実装時に細かい制限（プランごとの作成数上限など）を追加。

---

## 4. 認証フロー

### サインアップ
1. ユーザーが「サインアップ」ボタン
2. Google / Apple / Email を選択
3. Firebase Auth で認証
4. 初回ログイン時、`users/{userId}` ドキュメント作成（trigger 関数 or クライアント）
5. オンボーディング画面（チーム作成 or 既存チームに参加）

### ログイン
1. 「ログイン」ボタン
2. Firebase Auth で認証
3. 現在のチーム（`currentTeamId`）を読み込み、ダッシュボードへ

### チーム招待
1. オーナーが招待リンクを発行（招待トークン付き）
2. 招待リンクを受け取った人がログイン
3. トークン検証 → `teams/{teamId}/coachIds` に追加

---

## 5. プラン制限の実装

### Free プラン
- チーム数：1
- メンバー数：5
- 振付数：3
- 音源：30秒まで
- 共有：閲覧のみ

### Pro プラン（¥980/月 or ¥9,800/年）
- チーム数：1
- メンバー数：無制限
- 振付数：無制限
- 音源：制限なし
- 共有：閲覧＋コメント
- 動画書き出し（MP4）
- PDF書き出し

### Team プラン（¥4,800/月 or ¥48,000/年）
- チーム数：複数
- 複数コーチが編集権限
- チームメンバー履歴
- 共有：閲覧＋編集（共同編集）
- カスタムロゴ
- 大会用テンプレート

実装：`lib/plan-limits.ts` でチェック関数を一元管理。

---

## 6. 音源の扱い

- アップロード：`firebase/storage` に保存（ファイル名は `{teamId}/{formationId}/audio.{ext}`）
- 再生：クライアント側の `<audio>` で `storageURL` を読み込み
- BPM 検出：クライアントで Web Audio API を使う（β版ロジック流用）
- 著作権：ユーザーが自分の権利範囲内で使用することを利用規約で明記

---

## 7. リアルタイム同期

複数コーチが同時編集する場合：
- Firestore の `onSnapshot` で各フレームをリッスン
- 楽観的更新（クライアント側で即反映、サーバー確認は非同期）
- コンフリクト解決：ラストライターウィンズ（簡易）
- 後日 CRDT（Yjs）導入を検討

---

## 8. パフォーマンス目標

| 指標 | 目標 |
|---|---|
| 初回ロード（モバイル 3G） | 3秒以内 |
| 隊形編集の操作反応 | 100ms以内 |
| 再生中のフレームレート | 60fps |
| データ書き込みレイテンシ | 500ms以内 |

→ Next.js の SSR + キャッシュ、Firestore のローカルキャッシュ活用。

---

## 9. テスト戦略

- **ユニットテスト**：Vitest（採点ロジック、座標計算、プラン判定）
- **コンポーネントテスト**：React Testing Library
- **E2Eテスト**：Playwright（主要ユーザーフロー）
- **手動テスト**：iPhone Safari / iPad Safari / Android Chrome 必須

---

## 10. CI/CD

- **CI**：GitHub Actions（lint, typecheck, test）
- **CD**：Vercel 自動デプロイ
- **ステージング**：`main` ブランチ → staging.cheerchoreo.app
- **本番**：release タグ → cheerchoreo.app

---

## 11. 監視・ロギング

- **エラー監視**：Sentry
- **プロダクト分析**：Posthog（または Mixpanel）
- **インフラ監視**：Firebase Console
- **アップタイム**：Better Uptime（無料枠）

---

## 12. セキュリティ・コンプライアンス

- HTTPS 必須
- パスワードは Firebase Auth 管理（自社で保持しない）
- 個人情報（選手の名前・写真）は Firestore セキュリティルールでチーム内のみアクセス可
- 退会時：30日後にデータ完全削除
- 利用規約・プライバシーポリシーを別途整備（弁護士レビュー推奨）

---

## 13. 将来的な拡張ポイント

- **モバイルアプリ**：React Native（コードベースの一部を共有）
- **AI 補助**：「この曲に合う振付を提案」「採点条件を満たす配置を提案」
- **動画書き出し**：サーバー側で MP4 生成（Lambda + ffmpeg）
- **ライブ配信**：大会の振付をリアルタイムで観客に共有
