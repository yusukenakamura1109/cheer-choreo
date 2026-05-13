# Learnings — Cheer Choreo

Claude Code が作業を通じて得た学び・気づき・再利用したい知見を蓄積する。次セッションの自分（または別のエージェント）が読んで即座にキャッチアップできる粒度で書く。

カテゴリ：
- **技術**：ライブラリの罠、Firebase / Next.js の挙動、パフォーマンスの落とし穴 等
- **ドメイン**：チアリーディング業界・JCA/USA 規定・コーチの現場知見
- **運営**：自律運営での失敗・成功パターン、Supervisor とのやり取りの最適化
- **意思決定**：似た判断を繰り返さないためのルール化候補

形式：

```
## [カテゴリ] タイトル（YYYY-MM-DD）
- 状況：何が起きた／何を試した
- 学び：次回に活かすべき点
- 関連：commit / PR / Issue 参照
```

---

## [技術] β版に永続化を後付けするときの整理ポイント（2026-05-13）

- 状況：3,143 行の単一 HTML（`index.html`）に localStorage / JSON / URL の3経路で振付の永続化と共有を追加。
- 学び：
  - **シリアライズは1関数に集約**（`serializeFullState`）。localStorage / JSON DL / URL エンコード が全部これを通る形にすると schema 進化が楽。
  - **`applyFullState` は受信入口を統一**。URL ハッシュ・localStorage・FileReader の3経路すべて同じ検証＋適用フロー。schema バージョン（`v: 1`）を入れて将来のマイグレーションに備えた。
  - **`_autoSaveSuppressed` フラグ**で初期ロード中の循環書き込み（load → apply → snapshot → autosave → 上書き）を防ぐ。
  - **URL-safe base64 + UTF-8**：`btoa` は ASCII 限定なので `TextEncoder` でバイト化してから base64、さらに `+/=` を `-_` に置換。受信側は逆順。
  - **`history` 変数名衝突**：β版の undo 履歴が `let history = []` で宣言されており、`history.replaceState(...)` を呼ぶときに `window.history` を明示しないと undefined.replaceState で落ちる。
  - **rAF 初期化の頑健化**：プレビューツール環境では `requestAnimationFrame` コールバックが遅延・スキップされることがある。`rAF + setTimeout(_, 50)` の二段構え＋一度だけ実行ガード（`_appInitialized`）で安全に。
- 関連：commit （β version persistence）。`index.html` の `/* ======== Persistence */` 直下〜 init 末尾。

## [運営] Supervisor の「任せる」を判断レベルに変換する（2026-05-13）

- 状況：Supervisor が「よくわからないので任せます」と返答。AGENT_CHARTER §3 の判断レベルに沿って独自に進める必要があった。
- 学び：
  - 「任せる」≠ 全権承認。**コスト発生（年¥1,500 のドメイン、$99/年 Apple Dev Program 等）は別途確認**する方が安全（RED の中でも価格関連は §3 で 48h 自動進行から除外されている）。
  - **物理的に実行できないステップ**（祐介さんの Google/Vercel アカウントでの操作）は、Supervisor 向け手順書を作って渡す＋自分は手前まで進める。
  - **Supervisor が見える成果**を優先：Next.js 足場固め（見えない）より、現行β版の改善（触ってすぐわかる）の方が信頼維持に直結。
- 関連：`docs/supervisor_setup_guide.md`、β永続化コミット

## [運営] CEO セッション起動時の文脈ロード順序（2026-05-13）

- 状況：初回セッション。AGENT_CHARTER §10 の指示通り `CLAUDE.md → AGENT_CHARTER.md → ROADMAP.md → docs/daily_log.md` の順で読了。
- 学び：今後の新セッションでも同じ順序を踏襲する。`docs/daily_log.md` の直近3日分は短いので必ず全文読む。`index.html` は 3,143行と大きいので **grep でピンポイント参照** に留め、全文読みは避ける（リファレンス実装の特定機能を確認するときだけ該当区間を `offset/limit` で読む）。
- 関連：本日の初回コミット
