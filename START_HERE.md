# 🚀 START HERE — Cheer Choreo 自律運営版スタートガイド

このプロジェクトは **Claude Code を CEO に任命して自律運営** します。
あなた（祐介さん）は **Supervisor（取締役）** として方向性指示・承認だけを担当。

---

## あなたがやることは、たった2ステップ

---

## ✅ ステップ1：GitHub に運営マニュアル一式をアップロード（10分）

すでに `cheer-choreo` リポジトリ作成済みなので、そこに以下の7ファイルをアップロードします。

1. ブラウザで <https://github.com/yusukenakamura1109/cheer-choreo> を開く
2. 画面真ん中の **「+」ボタン** → **「Upload files」**
3. 以下のファイルを **全部一気にドラッグ&ドロップ**：

   - `START_HERE.md` ← このファイル
   - `CLAUDE.md`
   - `AGENT_CHARTER.md` ← 自律運営マニュアル（重要）
   - `README.md`
   - `ARCHITECTURE.md`
   - `ROADMAP.md`
   - `HANDOFF_GUIDE.md`

4. 一番下までスクロール → 緑の **「Commit changes」** ボタン

完了！

---

## ✅ ステップ2：Claude Code を起動して、CEOに任命する

Mac でターミナルを開いて、次のコマンドを順に打つだけ：

```bash
# Claude Code をインストール（初回のみ）
npm install -g @anthropic-ai/claude-code

# リポジトリをダウンロード
cd ~/Desktop
git clone https://github.com/yusukenakamura1109/cheer-choreo.git
cd cheer-choreo

# Claude Code を起動
claude
```

立ち上がったら、**下の「CEO任命プロンプト」をまるごとコピーして貼り付け** → Enter

これで Claude Code が CEO として自律的にプロジェクトを進めます。
あなたは週1回、レポートを見るだけ。

---

# 📋 CEO任命プロンプト（コピペ用）

> 💡 Claude Code が起動した直後の最初のメッセージとして、これを丸ごとコピペしてください。

```
あなたは今から「Cheer Choreo」プロジェクトのCEO／技術責任者です。

【最重要】
まず以下のファイルを順に読み、本プロジェクトの全文脈を理解してください：

1. AGENT_CHARTER.md（自律運営マニュアル・最優先で読む）
2. CLAUDE.md
3. ROADMAP.md
4. ARCHITECTURE.md
5. README.md
6. demo/cheer_choreo_demo.html（現行β版・リファレンス実装）

【あなたの役割】
- CEO / 技術責任者として、本プロジェクトの開発を自律的に推進する
- AGENT_CHARTER.md の判断レベル（GREEN/YELLOW/RED）に従って意思決定する
- 私（祐介・Supervisor）には、必要なときだけ承認・確認を求める

【最初のタスク】
1. すべてのファイルを読み終えたら、現状把握サマリーを作成してください
2. ROADMAP.md の Phase 1（MVP）を着手するための具体的な作業計画を立ててください
   - 30日 / 60日 / 90日 のマイルストーン
   - 最初の2週間の詳細タスク（GitHub Issue として切り出せる粒度）
3. 以下のディレクトリ・ファイルを初期化してください：
   - docs/daily_log.md（デイリーログ）
   - docs/weekly_reports/（週次レポート格納）
   - docs/learnings.md（学びの蓄積）
4. 計画書を docs/phase1_plan.md として作成し、コミットしてください
5. 私への質問・確認事項があれば箇条書きでまとめてください

【作業の進め方】
- 以降、AGENT_CHARTER.md の運営ルールに完全に従ってください
- デイリーログ・週次レポートを必ず記録すること
- GREEN は黙々と実行、YELLOW は事後報告、RED は必ず承認待ち
- 不明点は遠慮なく質問

【最初の確認】
最初に「AGENT_CHARTER.md を読みました。CEOとして任命を承諾します」と返答し、その後に上記タスクを実行してください。

よろしくお願いします。
```

---

# 🔍 あなた（Supervisor）の週次ルーチン（30分／週）

Claude Code が動き始めたら、あなたは週1回これだけやればOK：

### 毎週金曜 or 月曜（30分）

1. **週次レポートを読む**
   - GitHub の `docs/weekly_reports/` フォルダの最新ファイルを開く
   - 「サマリー」「KPI」「Supervisor への確認事項」だけ見る（5分）

2. **RED ラベルのPRを承認 or 差し戻す**
   - GitHub のPR一覧で `[RED]` タグのものを開く（10分）
   - 「決裁案」を見て、推奨案でOKなら承認コメント
   - 別の案がいいなら「○○の案で進めて」とコメント

3. **緊急の確認事項に返答**
   - Cowork チャットや GitHub Issues に緊急通知があれば対応（10分）

4. **β版を触ってみる**（任意・5分）
   - ステージング URL に新機能が出ていれば触ってみる
   - 違和感あれば Issue 作成

---

# 🆘 困ったとき

| 状況 | やること |
|---|---|
| Claude Code が止まっている | `claude` を再起動して「再開してください」と入力 |
| 進捗が見えない | デイリーログ `docs/daily_log.md` を確認 |
| 大きな決断を求められた | RED 案件の決裁案を3案比較して選ぶだけ |
| 開発の方向性に違和感 | Cowork チャットで「○○について軌道修正したい」と Claude Code に伝える |
| Claude Code が暴走しそう | `AGENT_CHARTER.md` の権限ルールを引用して制限を再確認させる |

---

# 📊 何が起きているか把握する方法

| 知りたいこと | 見るべき場所 |
|---|---|
| 今日 Claude Code が何をしたか | `docs/daily_log.md` |
| 今週の成果と来週の計画 | `docs/weekly_reports/` |
| 全体の進捗 | `ROADMAP.md` の更新差分 |
| 学び・気づき | `docs/learnings.md` |
| 自分の承認が必要なもの | GitHub の `[RED]` ラベル PR 一覧 |
| 進行中の作業 | GitHub の Open PR / Open Issues |

---

# 📞 Claude Code への追加指示（必要な時だけ）

途中で方向修正したくなったら、Cowork でこのフォーマットで伝えれば OK：

```
@Claude Code

【方向修正】
（やめたいこと、変えたいことを書く）

【新しい方針】
（こっちで進めて、と書く）

【理由】
（なぜか説明）

AGENT_CHARTER.md に従って、対応案を提示してください。
```

---

# 🎯 これでできるようになること

- ✅ Claude Code が CEO として自律的に開発を進める
- ✅ 週次レポートで全体把握ができる
- ✅ 大事な決断（RED）だけあなたが承認
- ✅ あなたは **マーケ・コーチへの営業・ビジネス判断** に集中できる
- ✅ 開発者を雇う必要がない（Claude Code が代行）
- ✅ プロジェクトの全状況が GitHub に記録される

---

# 📚 補足資料

詳しく知りたいときに読むファイル：

| ファイル | 何が書いてある？ |
|---|---|
| **AGENT_CHARTER.md** | Claude Code の権限・判断基準・報告ルール（最重要） |
| **CLAUDE.md** | プロジェクト全体の文脈 |
| **ARCHITECTURE.md** | 技術設計・データモデル |
| **ROADMAP.md** | フェーズ別計画 |
| **HANDOFF_GUIDE.md** | （将来）人間の開発者を追加で雇う時の参考 |
| **marketing_plan.md** | 販売戦略・市場分析 |

---

**🎯 今すぐ：ステップ1（GitHubアップロード）から始めましょう。**

つまずいたら **このページの該当ステップの番号** を教えてください。すぐサポートします。
