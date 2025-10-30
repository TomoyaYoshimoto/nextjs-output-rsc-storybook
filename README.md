# RSC & Storybook 互換性問題のデモ

このプロジェクトは、React Server Components (RSC) と Storybook の互換性問題を再現するためのデモ環境です。

## 環境

- **Next.js**: 16.0.1 (App Router)
- **React**: 19.2.0
- **Storybook**: 10.0.1
- **TypeScript**: 5.x

## 問題ケース

### ケースA: Async Server Component

**ファイル**: [`components/AsyncServerComponent.tsx`](components/AsyncServerComponent.tsx)

**問題**:
- RSCでは `async function` としてコンポーネントを定義し、直接 `await` を使用できる
- Storybookはクライアント環境で動作するため、async componentを直接レンダリングできない

**期待されるエラー**:
```
Objects are not valid as a React child
```

### ケースB: Server-Only Imports

**ファイル**:
- [`components/ServerOnlyComponent.tsx`](components/ServerOnlyComponent.tsx)
- [`lib/server-only-db.ts`](lib/server-only-db.ts)

**問題**:
- `server-only` パッケージでマークされたモジュールをimport
- クライアント環境でimportされるとエラーをスロー

**期待されるエラー**:
```
This module cannot be imported from a Client Component module
```

### ケースC: Server Actions（実は動作する）

**ファイル**: [`components/FormWithServerAction.tsx`](components/FormWithServerAction.tsx)

**結果**:
- `'use server'` ディレクティブを使用したServer Actions
- **Next.jsのビルドプロセスが自動的に変換するため、Storybookでも動作する**

**理由**:
Next.jsは`'use server'`を検出すると、ビルド時に以下の処理を行います：
1. Server Action関数をAPIエンドポイントに自動変換
2. クライアント側には、そのエンドポイントを呼び出すプロキシ関数を生成
3. Storybookが読み込む時点で、既にクライアント側で実行可能な形に変換済み

**注意**: Next.js devサーバーが起動している必要があります

## セットアップ

### 依存関係のインストール

```bash
npm install
```

### Next.js アプリケーションの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、3つのケースすべてが正常に動作します。

### Storybook の起動

```bash
npm run storybook
```

ブラウザで [http://localhost:6006](http://localhost:6006) を開くと、問題が発生します。

## 問題の確認方法

1. **Next.js での確認** (正常に動作):
   ```bash
   npm run dev
   ```
   すべてのコンポーネントが正しく表示されます。

2. **Storybook での確認** (エラーが発生):
   ```bash
   npm run storybook
   ```
   各ストーリーでエラーまたは予期しない動作が発生します。

## プロジェクト構造

```
.
├── app/
│   ├── page.tsx                                  # メインページ（3つのケースを表示）
│   └── api/
│       └── submit/
│           └── route.ts                          # Server Action用APIルート
├── components/
│   ├── AsyncServerComponent.tsx                  # ケースA: Async Server Component（❌エラー）
│   ├── AsyncServerComponent.stories.tsx          # ケースAのストーリー（❌エラー発生）
│   ├── AsyncServerComponent.client.tsx           # ケースA: 対策版（✅動作）
│   ├── AsyncServerComponent.client.stories.tsx   # ケースAの対策版ストーリー（✅動作）
│   │
│   ├── ServerOnlyComponent.tsx                   # ケースB: Server-Only Imports（❌エラー）
│   ├── ServerOnlyComponent.stories.tsx           # ケースBのストーリー（❌エラー発生）
│   ├── ServerOnlyComponent.client.tsx            # ケースB: 対策版（✅動作）
│   ├── ServerOnlyComponent.client.stories.tsx    # ケースBの対策版ストーリー（✅動作）
│   │
│   ├── FormWithServerAction.tsx                  # ケースC: Server Actions（✅動作）
│   ├── FormWithServerAction.stories.tsx          # ケースCのストーリー（✅正常動作）
│   ├── SubmitButton.tsx                          # クライアントコンポーネント（補助）
│   └── SubmitButton.stories.tsx                  # 正常に動作するストーリー（比較用）
├── lib/
│   └── server-only-db.ts                         # server-onlyモジュール
├── .storybook/
│   └── main.ts                                   # Storybook設定
├── README.md                                     # このファイル
├── DIFF_GUIDE.md                                 # Before/After差分ガイド（推奨）
└── WORKAROUNDS.md                                # 対策方法の詳細ドキュメント
```

## 回避策（詳細）

実際のプロジェクトでは、以下のような回避策が有効です：

1. **ケースA**: データをpropsとして渡すClient Componentラッパーを作成
2. **ケースB**: モック実装を使用するか、Webpack aliasでモジュールを置き換え
3. **ケースC**: 対策不要（自動的に動作する）

### 📚 ドキュメント

- **[DIFF_GUIDE.md](DIFF_GUIDE.md)** - Before/After の差分で対策方法を理解（推奨）
- **[WORKAROUNDS.md](WORKAROUNDS.md)** - 詳細な実装方法とコード例

### 🎯 実装済みの対策例

このリポジトリには、実際に動作する対策版も含まれています：

- `components/AsyncServerComponent.client.tsx` + ストーリー
- `components/ServerOnlyComponent.client.tsx` + ストーリー

Storybook の「Workarounds」カテゴリーで実際に動作を確認できます。

## 学習ポイント

- **Async Server Components と Server-Only Imports** は Storybook で直接使用できない
- **Server Actions** は Next.js のビルドプロセスにより自動変換されるため、Storybook でも動作する
- Storybook でコンポーネントをテストする場合は、以下のアプローチが有効：
  1. データと表示ロジックを分離（Client Component + props）
  2. モックデータを使用
  3. MSW などでAPIをモック
- RSCの利点（サーバーサイドでのデータフェッチ、server-onlyコードの実行など）は Storybook では再現が難しいため、適切な分離設計が重要

## 参考リンク

- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Storybook Next.js Framework](https://storybook.js.org/docs/get-started/frameworks/nextjs)
