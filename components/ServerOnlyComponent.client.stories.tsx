/**
 * ケースB の対策版ストーリー
 *
 * 変更点:
 * 1. server-only モジュールを import しない Client Component を使用
 * 2. データを args として渡す
 * 3. Storybook で問題なく表示される
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ServerOnlyComponentClient } from './ServerOnlyComponent.client';

const meta = {
  title: 'Workarounds/Case B: Server-Only Imports (Fixed)',
  component: ServerOnlyComponentClient,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### 対策: Client Component + Props（server-only を import しない）

元の Server-Only Component は \`server-only\` パッケージでマークされた
モジュールを import しているため、Storybook で表示できませんが、
データを props として受け取る Client Component を作成することで解決できます。

#### 変更点

**Before (動かない):**
\`\`\`tsx
// ServerOnlyComponent.tsx
import { db } from '@/lib/server-only-db'; // ❌ server-only パッケージ

export default async function ServerOnlyComponent() {
  const products = await db.query(); // ❌ Storybookで動かない
  return <div>{products.map(...)}</div>;
}
\`\`\`

**After (動く):**
\`\`\`tsx
// ServerOnlyComponent.client.tsx
'use client';

// server-only モジュールは import しない

interface Props {
  products: Product[];
}

export function ServerOnlyComponentClient({ products }: Props) {
  return <div>{products.map(...)}</div>; // ✅ Storybookで動く
}
\`\`\`

#### Next.jsでの使用方法

Server Component から Client Component を呼び出します：

\`\`\`tsx
// app/page.tsx (Server Component)
import { db } from '@/lib/server-only-db'; // サーバーでのみimport可能
import { ServerOnlyComponentClient } from './ServerOnlyComponent.client';

export default async function Page() {
  const products = await db.query(); // サーバーでデータ取得
  return <ServerOnlyComponentClient products={products} />; // Clientに渡す
}
\`\`\`

✅ Storybook でもモックデータを使って表示できます！
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ServerOnlyComponentClient>;

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルトのストーリー
export const Default: Story = {
  args: {
    products: [
      { id: 1, name: 'Laptop', price: 1200, stock: 5 },
      { id: 2, name: 'Mouse', price: 25, stock: 50 },
      { id: 3, name: 'Keyboard', price: 75, stock: 30 },
    ],
  },
};

// 在庫切れの商品を含む
export const WithOutOfStock: Story = {
  args: {
    products: [
      { id: 1, name: 'Laptop', price: 1200, stock: 0 },
      { id: 2, name: 'Mouse', price: 25, stock: 50 },
      { id: 3, name: 'Keyboard', price: 75, stock: 0 },
    ],
  },
};

// 商品が1つだけ
export const SingleProduct: Story = {
  args: {
    products: [
      { id: 1, name: 'Gaming PC', price: 2500, stock: 3 },
    ],
  },
};

// 空の商品リスト
export const EmptyList: Story = {
  args: {
    products: [],
  },
};
