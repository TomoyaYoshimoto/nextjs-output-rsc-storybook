/**
 * このストーリーは意図的にエラーを発生させます
 *
 * エラーの原因:
 * ServerOnlyComponent は 'server-only' パッケージを使用している
 * モジュールをimportしているため、クライアント環境で実行できません
 */

import type { Meta, StoryObj } from '@storybook/react';
import ServerOnlyComponent from './ServerOnlyComponent';

const meta = {
  title: 'RSC Problems/Case B: Server-Only Imports',
  component: ServerOnlyComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### 問題: Server-Only Modules

このコンポーネントは \`server-only\` パッケージでマークされた
モジュール（lib/server-only-db.ts）をimportしています。

\`server-only\` パッケージは、クライアント環境でimportされると
エラーをスローするように設計されています。

**期待されるエラー:**
- "This module cannot be imported from a Client Component module"
- ビルドエラーまたはランタイムエラー
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ServerOnlyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// このストーリーはエラーを起こします
export const Default: Story = {};
