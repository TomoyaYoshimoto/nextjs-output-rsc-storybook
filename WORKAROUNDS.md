# RSC × Storybook 問題の対策方法

このドキュメントでは、React Server Components (RSC) を Storybook で表示する際の問題と、その対策方法を説明します。

## 問題ケース一覧

### ✅ ケースA: Async Server Component
### ✅ ケースB: Server-Only Imports
### ✅ ケースC: Server Actions（実は問題なし）

---

## ケースA: Async Server Component の対策

### 問題

```tsx
// ❌ Storybookではエラーになる
export default async function AsyncServerComponent() {
  const data = await fetchData();
  return <div>{data.title}</div>;
}
```

**エラー**: `Objects are not valid as a React child`

### 対策方法

#### 対策1: Client Component ラッパーを作成

データを props で受け取る Client Component を作成します。

```tsx
// AsyncServerComponent.client.tsx
'use client';

interface Props {
  data: {
    id: number;
    name: string;
    email: string;
  };
}

export function AsyncServerComponentClient({ data }: Props) {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-900">
        Async Server Component
      </h2>
      <div className="text-sm text-gray-600">
        <p><strong>ID:</strong> {data.id}</p>
        <p><strong>Name:</strong> {data.name}</p>
        <p><strong>Email:</strong> {data.email}</p>
      </div>
    </div>
  );
}
```

```tsx
// AsyncServerComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { AsyncServerComponentClient } from './AsyncServerComponent.client';

const meta = {
  title: 'Components/AsyncServerComponent',
  component: AsyncServerComponentClient,
} satisfies Meta<typeof AsyncServerComponentClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
};
```

#### 対策2: MSW (Mock Service Worker) を使用

Storybook で API をモックします。

```bash
npm install msw msw-storybook-addon --save-dev
```

```tsx
// .storybook/preview.tsx
import { initialize, mswLoader } from 'msw-storybook-addon';

initialize();

export const loaders = [mswLoader];
```

```tsx
// AsyncServerComponent.stories.tsx
import { http, HttpResponse } from 'msw';

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://api.example.com/users/1', () => {
          return HttpResponse.json({
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
          });
        }),
      ],
    },
  },
};
```

---

## ケースB: Server-Only Imports の対策

### 問題

```tsx
// ❌ Storybookではエラーになる
import { db } from '@/lib/server-only-db'; // server-only パッケージ

export default async function ServerOnlyComponent() {
  const products = await db.query();
  return <div>{/* ... */}</div>;
}
```

**エラー**: `This module cannot be imported from a Client Component module`

### 対策方法

#### 対策1: モックデータを使う Client Component を作成

```tsx
// ServerOnlyComponent.client.tsx
'use client';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Props {
  products: Product[];
}

export function ServerOnlyComponentClient({ products }: Props) {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-900">
        Server-Only Component
      </h2>
      <div className="space-y-2">
        {products.map((product) => (
          <div key={product.id} className="pl-3 border-l-2 border-blue-500">
            <p><strong>{product.name}</strong></p>
            <p className="text-xs">Price: ${product.price} | Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

```tsx
// ServerOnlyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ServerOnlyComponentClient } from './ServerOnlyComponent.client';

const meta = {
  title: 'Components/ServerOnlyComponent',
  component: ServerOnlyComponentClient,
} satisfies Meta<typeof ServerOnlyComponentClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    products: [
      { id: 1, name: 'Laptop', price: 1200, stock: 5 },
      { id: 2, name: 'Mouse', price: 25, stock: 50 },
      { id: 3, name: 'Keyboard', price: 75, stock: 30 },
    ],
  },
};
```

#### 対策2: Webpack エイリアスでモックに置き換え

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
  // ... 他の設定
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/lib/server-only-db': path.resolve(__dirname, '../lib/server-only-db.mock.ts'),
      };
    }
    return config;
  },
};

export default config;
```

```ts
// lib/server-only-db.mock.ts
// server-only を import しないモック版
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const mockProducts: Product[] = [
  { id: 1, name: 'Laptop', price: 1200, stock: 5 },
  { id: 2, name: 'Mouse', price: 25, stock: 50 },
  { id: 3, name: 'Keyboard', price: 75, stock: 30 },
];

class MockDatabase {
  async query(): Promise<Product[]> {
    console.log('[MOCK DB] Query executed');
    return mockProducts;
  }

  async getById(id: number): Promise<Product | undefined> {
    console.log(`[MOCK DB] Query for ID: ${id}`);
    return mockProducts.find(p => p.id === id);
  }
}

export const db = new MockDatabase();
```

---

## ケースC: Server Actions（動作する）

### 動作する理由

Next.js のビルドプロセスが `'use server'` を検出すると、Server Actions を自動的に以下のように変換します：

1. **Server Action 関数を API エンドポイントに変換**
2. **クライアント側には、そのエンドポイントを呼び出すプロキシ関数を生成**
3. **フォームの `action` 属性に自動生成された URL を設定**

そのため、Storybook でも正常に動作します。

### 注意点

- **Next.js dev サーバーが起動している必要があります**
- `console.log` はサーバー側のログに出力されます
- 実際の処理はサーバー側で実行されます

### 使用例

```tsx
// FormWithServerAction.tsx
import { SubmitButton } from './SubmitButton';

async function submitForm(formData: FormData) {
  'use server';

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  console.log('[SERVER ACTION] Form submitted:', { name, email });
  // ✅ これは Next.js サーバー側で実行される
}

export default function FormWithServerAction() {
  return (
    <form action={submitForm}>
      {/* ... */}
    </form>
  );
}
```

**✅ Storybook で問題なく動作します**（Next.js サーバーが起動中の場合）

---

## まとめ

| ケース | 問題 | 推奨対策 |
|--------|------|----------|
| **Async Server Component** | Promise がレンダリングされる | Client Component ラッパー + props |
| **Server-Only Imports** | server-only がエラーを投げる | Client Component + モックデータ |
| **Server Actions** | （問題なし） | そのまま使用可能 |

## ベストプラクティス

1. **表示ロジックと データ取得を分離**
   - Server Component: データ取得
   - Client Component: 表示ロジック

2. **Storybook 用の Client Component を作成**
   - `*.client.tsx` という命名規則を使う
   - props でデータを受け取る設計にする

3. **モックデータを用意**
   - 実際のデータ構造に基づいたモックを作成
   - 複数のバリエーションを用意してストーリーに活用

4. **Server Actions は変換に任せる**
   - Next.js の自動変換を信頼する
   - Storybook でも通常通り動作する
