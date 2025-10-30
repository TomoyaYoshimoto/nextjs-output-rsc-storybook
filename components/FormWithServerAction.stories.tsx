/**
 * このストーリーは正常に動作します
 *
 * 理由:
 * Next.jsのビルドプロセスが'use server'を検出すると、
 * Server Actionsを自動的にクライアント側で実行可能な形に変換します
 */

import type { Meta, StoryObj } from '@storybook/react';
import FormWithServerAction from './FormWithServerAction';

const meta = {
  title: 'Working Examples/Server Actions (Auto-converted)',
  component: FormWithServerAction,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Server Actionsは動作する！

このコンポーネントは \`'use server'\` ディレクティブを使用した
Server Actionsを含んでいますが、**Storybookでも正常に動作します**。

#### なぜ動作するのか？

Next.jsは \`'use server'\` を検出すると、ビルド時に以下の処理を行います：

1. Server Action関数をAPIエンドポイントに自動変換
2. クライアント側には、そのエンドポイントを呼び出すプロキシ関数を生成
3. フォームの \`action\` 属性に自動生成されたエンドポイントURLを設定

つまり、Storybookが読み込む時点で、Server Actionは既に
**クライアント側で実行可能な通常の関数**に変換されています。

#### 注意点

- **Next.js devサーバーが起動している必要があります**
- 実際のServer処理は Next.jsサーバー側で実行されます
- \`console.log\` はサーバー側のログに出力されます

**✅ このストーリーは問題なく動作します**
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormWithServerAction>;

export default meta;
type Story = StoryObj<typeof meta>;

// このストーリーは正常に動作します
export const Default: Story = {};
