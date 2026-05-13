export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-zinc-950">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1 text-xs font-semibold tracking-wide text-pink-600 dark:text-pink-300">
          Cheer Choreo · Phase 1 MVP（開発中）
        </span>

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          チアの振付を、
          <br />
          <span className="text-pink-500">クラウドで作る。</span>
        </h1>

        <p className="max-w-xl text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-400">
          フォーメーション、スタンツ、音源同期を 1 つの画面で。
          <br />
          コーチ・振付担当・キャプテンのための SaaS、Phase 1（MVP）を構築中です。
        </p>

        <div className="flex flex-col items-center gap-3 text-sm text-zinc-500 dark:text-zinc-500">
          <p>
            現行 β 版は{" "}
            <a
              href="https://yusukenakamura1109.github.io/cheer-choreo/"
              className="font-medium text-pink-600 underline-offset-4 hover:underline dark:text-pink-400"
            >
              こちら（GitHub Pages）
            </a>
            。
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            ※ このページは Next.js 16 のスキャフォールド直後の placeholder です。認証・ダッシュボードは順次実装中。
          </p>
        </div>
      </main>
    </div>
  );
}
