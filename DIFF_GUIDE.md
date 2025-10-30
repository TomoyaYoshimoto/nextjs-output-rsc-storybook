# 対策の差分ガイド

このドキュメントでは、RSC コンポーネントを Storybook で動作させるための変更点を、
Before/After の差分形式で示します。

## ケースA: Async Server Component の対策

### 📁 ファイル構成の変更

```diff
components/
  ├── AsyncServerComponent.tsx          # 元のファイル（動かない）
+ ├── AsyncServerComponent.client.tsx   # 対策版（動く）
  ├── AsyncServerComponent.stories.tsx  # 元のストーリー（エラー）
+ └── AsyncServerComponent.client.stories.tsx  # 対策版ストーリー（動く）
```

### 📝 コード差分

#### Before: AsyncServerComponent.tsx（動かない）

```tsx
// ❌ Storybookで動かない
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(): Promise<User> {
  const res = await fetch('https://jsonplaceholder.typicode.com/users/1', {
    cache: 'no-store'
  });
  return res.json();
}

export default async function AsyncServerComponent() {
  // ❌ async/await はStorybookで動かない
  const user = await fetchUser();

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold">Async Server Component</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}
```

#### After: AsyncServerComponent.client.tsx（動く）

```tsx
// ✅ Storybookで動く
'use client'; // 追加: Client Component として宣言

interface User {
  id: number;
  name: string;
  email: string;
}

// 追加: Props インターフェース
interface Props {
  user: User;
}

// 変更: データをpropsとして受け取る
export function AsyncServerComponentClient({ user }: Props) {
  // async/await を削除
  // データはpropsから取得

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold">Async Server Component (Client Version)</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}
```

### 🔑 主な変更点

| 項目 | Before | After |
|------|--------|-------|
| **コンポーネント種類** | Server Component（暗黙的） | `'use client'` で明示的な Client Component |
| **関数の種類** | `async function` | 通常の `function`（非同期なし） |
| **データ取得** | コンポーネント内で `await fetchUser()` | props で受け取る |
| **エクスポート** | `export default async function` | `export function` |

### 📖 Storybook での使用方法

```tsx
// AsyncServerComponent.client.stories.tsx
export const Default: Story = {
  args: {
    user: {  // モックデータをargsで渡す
      id: 1,
      name: 'Leanne Graham',
      email: 'leanne@example.com',
    },
  },
};
```

### 🔄 Next.js での使用方法（本番）

```tsx
// app/page.tsx (Server Component)
import { AsyncServerComponentClient } from './AsyncServerComponent.client';

export default async function Page() {
  // Server Component でデータ取得
  const user = await fetchUser();

  // Client Component にデータを渡す
  return <AsyncServerComponentClient user={user} />;
}
```

---

## ケースB: Server-Only Imports の対策

### 📁 ファイル構成の変更

```diff
components/
  ├── ServerOnlyComponent.tsx           # 元のファイル（動かない）
+ ├── ServerOnlyComponent.client.tsx    # 対策版（動く）
  ├── ServerOnlyComponent.stories.tsx   # 元のストーリー（エラー）
+ └── ServerOnlyComponent.client.stories.tsx  # 対策版ストーリー（動く）

lib/
  └── server-only-db.ts                 # server-only パッケージを使用
```

### 📝 コード差分

#### Before: ServerOnlyComponent.tsx（動かない）

```tsx
// ❌ Storybookで動かない
import { db, type Product } from '@/lib/server-only-db'; // ❌ server-only import

export default async function ServerOnlyComponent() {
  // ❌ server-only モジュールを使用
  const products = await db.query();

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold">Server-Only Component</h2>
      {products.map((product: Product) => (
        <div key={product.id}>
          <p><strong>{product.name}</strong></p>
          <p>Price: ${product.price} | Stock: {product.stock}</p>
        </div>
      ))}
    </div>
  );
}
```

#### After: ServerOnlyComponent.client.tsx（動く）

```tsx
// ✅ Storybookで動く
'use client'; // 追加: Client Component として宣言

// 削除: server-only モジュールのimport
// import { db } from '@/lib/server-only-db'; ❌

// 型定義のみ再定義（または別ファイルから import）
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

// 追加: Props インターフェース
interface Props {
  products: Product[];
}

// 変更: データをpropsとして受け取る
export function ServerOnlyComponentClient({ products }: Props) {
  // db.query() を削除
  // データはpropsから取得

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold">Server-Only Component (Client Version)</h2>
      {products.map((product: Product) => (
        <div key={product.id}>
          <p><strong>{product.name}</strong></p>
          <p>Price: ${product.price} | Stock: {product.stock}</p>
        </div>
      ))}
    </div>
  );
}
```

### 🔑 主な変更点

| 項目 | Before | After |
|------|--------|-------|
| **コンポーネント種類** | Server Component | `'use client'` で Client Component |
| **server-only import** | `import { db } from '@/lib/server-only-db'` | import を削除 |
| **関数の種類** | `async function` | 通常の `function` |
| **データ取得** | コンポーネント内で `await db.query()` | props で受け取る |
| **型定義** | server-only モジュールから import | ローカルで再定義 |

### 📖 Storybook での使用方法

```tsx
// ServerOnlyComponent.client.stories.tsx
export const Default: Story = {
  args: {
    products: [  // モックデータをargsで渡す
      { id: 1, name: 'Laptop', price: 1200, stock: 5 },
      { id: 2, name: 'Mouse', price: 25, stock: 50 },
      { id: 3, name: 'Keyboard', price: 75, stock: 30 },
    ],
  },
};
```

### 🔄 Next.js での使用方法（本番）

```tsx
// app/page.tsx (Server Component)
import { db } from '@/lib/server-only-db'; // Server Component でのみ使用可能
import { ServerOnlyComponentClient } from './ServerOnlyComponent.client';

export default async function Page() {
  // Server Component でデータ取得
  const products = await db.query();

  // Client Component にデータを渡す
  return <ServerOnlyComponentClient products={products} />;
}
```

---

## ケースC: Server Actions（対策不要）

### ✅ 変更なし

Server Actions は Next.js のビルドプロセスで自動的に変換されるため、
**そのまま Storybook で動作します**。対策は不要です。

```tsx
// FormWithServerAction.tsx
async function submitForm(formData: FormData) {
  'use server'; // ✅ これだけでOK

  const name = formData.get('name') as string;
  console.log('[SERVER ACTION] Form submitted:', name);
}

export default function FormWithServerAction() {
  return <form action={submitForm}>{/* ... */}</form>;
}
```

**注意**: Next.js dev サーバーが起動している必要があります。

---

## まとめ: 共通の対策パターン

### 🎯 基本方針

1. **データ取得と表示を分離**
   - データ取得: Server Component
   - 表示ロジック: Client Component

2. **Props でデータを渡す**
   - Server Component → Client Component へデータを props で渡す
   - Storybook では args でモックデータを渡す

3. **Client Component を作成**
   - `'use client'` ディレクティブを追加
   - `async function` を通常の `function` に変更
   - server-only な処理をすべて削除

### 📂 ファイル命名規則

- **元のファイル**: `ComponentName.tsx` (Server Component)
- **対策版ファイル**: `ComponentName.client.tsx` (Client Component)
- **元のストーリー**: `ComponentName.stories.tsx` (エラー発生)
- **対策版ストーリー**: `ComponentName.client.stories.tsx` (正常動作)

### ✅ チェックリスト

対策版を作成する際の確認項目：

- [ ] `'use client'` ディレクティブを追加
- [ ] `async` キーワードを削除
- [ ] `await` による非同期処理を削除
- [ ] server-only な import を削除
- [ ] Props インターフェースを定義
- [ ] データを props として受け取るように変更
- [ ] Storybook で args を使ってモックデータを渡す
- [ ] 複数のストーリーバリエーションを作成

---

## 比較表

| 項目 | 元の Server Component | 対策版 Client Component |
|------|----------------------|------------------------|
| **Storybook** | ❌ エラー | ✅ 動作する |
| **Next.js** | ✅ 動作する | ✅ 動作する |
| **データ取得** | コンポーネント内 | props 経由 |
| **非同期処理** | `async`/`await` | なし |
| **server-only** | 使用可能 | 使用不可 |
| **ファイル名** | `*.tsx` | `*.client.tsx` |

---

## 実際のファイルを比較

このリポジトリには、以下のファイルが含まれています：

### 動かない版（問題を示す）
- `components/AsyncServerComponent.tsx`
- `components/AsyncServerComponent.stories.tsx`
- `components/ServerOnlyComponent.tsx`
- `components/ServerOnlyComponent.stories.tsx`

### 動く版（対策を示す）
- `components/AsyncServerComponent.client.tsx` ✅
- `components/AsyncServerComponent.client.stories.tsx` ✅
- `components/ServerOnlyComponent.client.tsx` ✅
- `components/ServerOnlyComponent.client.stories.tsx` ✅

Storybook で「RSC Problems」と「Workarounds」を比較して、
差分を実際に確認してください！
