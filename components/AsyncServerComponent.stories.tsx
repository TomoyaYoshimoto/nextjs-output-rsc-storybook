/**
 * このストーリーは意図的にエラーを発生させます
 *
 * エラーの原因:
 * AsyncServerComponent は async function なので、
 * Storybookのクライアント環境では直接レンダリングできません
 */

import type { Meta, StoryObj } from '@storybook/react';
import AsyncServerComponent from './AsyncServerComponent';

const meta = {
  title: 'RSC Problems/Case A: Async Server Component',
  component: AsyncServerComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### 問題: Async Server Componentのレンダリング

このコンポーネントは \`async function\` として定義されています。
React Server Componentsでは、コンポーネント内で直接 \`await\` を使用できますが、
Storybookはクライアントサイドで動作するため、このパターンをサポートしていません。

**期待されるエラー:**
- "Objects are not valid as a React child"
- または Promise related errors
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AsyncServerComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// このストーリーはエラーを起こします
export const Default: Story = {};
