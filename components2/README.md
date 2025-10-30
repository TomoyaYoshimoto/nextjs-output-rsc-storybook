# Production Pattern: 本番環境でのベストプラクティス

このフォルダ (`components2/`) には、**本番環境で実際に使用するパターン**の実装例が含まれています。

## 🎯 重要なポイント

### ✅ 同じファイルを本番でもStorybookでも使う

```
components2/
├── UserProfile.tsx          # ← 本番でもStorybookでも同じファイル
└── UserProfile.stories.tsx  # ← モックデータを渡すだけ
```

**コードの差分は生まれません！**

---

## 📁 ファイル構成

```
components2/
├── UserProfile.tsx              # Client Component (共通)
├── UserProfile.stories.tsx      # Storybook用Story
├── ProductList.tsx              # Client Component (共通)
└── ProductList.stories.tsx      # Storybook用Story

app/
├── demo/
│   └── page.tsx                 # Server Component (本番用)
└── products/
    └── page.tsx                 # Server Component (本番用)
```

---

## 🔄 パターン1: Async Server Component 対策

### 問題（`components/` フォルダの例）

```tsx
// ❌ Storybookで動かない
export default async function AsyncServerComponent() {
  const user = await fetchUser(); // async/await が問題
  return <div>{user.name}</div>;
}
```

### 解決策（`components2/` フォルダの実装）

#### 1. Client Component（共通ファイル）

```tsx
// components2/UserProfile.tsx
'use client';

interface Props {
  user: User; // ← propsで受け取る
}

export function UserProfile({ user }: Props) {
  return <div>{user.name}</div>; // ✅ 表示だけに集中
}
```

#### 2. Next.js本番環境での使用

```tsx
// app/demo/page.tsx (Server Component)
import { UserProfile } from '@/components2/UserProfile';

export default async function DemoPage() {
  const user = await fetchUser(); // ← サーバー側でデータ取得
  return <UserProfile user={user} />; // ← Client Componentに渡す
}
```

#### 3. Storybookでの使用

```tsx
// components2/UserProfile.stories.tsx
import { UserProfile } from './UserProfile';

export const Default = {
  args: {
    user: { id: 1, name: 'Test User', ... } // ← モックデータ
  }
};
```

### ✅ 結果

- **UserProfile.tsx は本番でもStorybookでも全く同じファイル**
- 本番: Server Component から実データを渡す
- Storybook: Story から モックデータを渡す
- **コードの差分なし！**

---

## 🔄 パターン2: Server-Only Imports 対策

### 問題（`components/` フォルダの例）

```tsx
// ❌ Storybookで動かない
import { db } from '@/lib/server-only-db'; // ← server-only が問題

export default async function ServerOnlyComponent() {
  const products = await db.query();
  return <div>...</div>;
}
```

### 解決策（`components2/` フォルダの実装）

#### 1. Client Component（共通ファイル）

```tsx
// components2/ProductList.tsx
'use client';

// ← server-only をimportしない

interface Props {
  products: Product[]; // ← propsで受け取る
}

export function ProductList({ products }: Props) {
  // UIロジック（フィルタ・ソート）
  return <div>{products.map(...)}</div>; // ✅ 表示に集中
}
```

#### 2. Next.js本番環境での使用

```tsx
// app/products/page.tsx (Server Component)
import { db } from '@/lib/server-only-db'; // ← ここでimport可能
import { ProductList } from '@/components2/ProductList';

export default async function ProductsPage() {
  const products = await db.products.findAll(); // ← server-onlyを使える
  return <ProductList products={products} />; // ← Client Componentに渡す
}
```

#### 3. Storybookでの使用

```tsx
// components2/ProductList.stories.tsx
import { ProductList } from './ProductList';

const mockProducts = [
  { id: 1, name: 'Product A', price: 1000, ... },
  // ...
];

export const Default = {
  args: {
    products: mockProducts // ← モックデータ
  }
};
```

### ✅ 結果

- **ProductList.tsx は本番でもStorybookでも全く同じファイル**
- `server-only` imports は Server Component (Page) でのみ使用
- ProductList は表示とUIロジックに集中
- **コードの差分なし！**

---

## 🎬 動作確認

### 1. Next.js（本番環境）で確認

```bash
npm run dev
```

- http://localhost:3000/demo - UserProfile の例
- http://localhost:3000/products - ProductList の例

### 2. Storybook で確認

```bash
npm run storybook
```

- **Production Pattern** カテゴリを開く
- UserProfile, ProductList の各バリエーションを確認

---

## 📊 比較: 教育用 vs 本番用

| 項目 | `components/` (教育用) | `components2/` (本番用) |
|------|----------------------|----------------------|
| **目的** | 問題と解決策を見せる | 実際の開発パターン |
| **ファイル数** | 2つ（問題版と解決版） | 1つ（共通ファイル） |
| **本番コード** | `.tsx` (Server Component) | `.tsx` (Client Component) |
| **Storybook用** | `.client.tsx` (別ファイル) | 同じファイルを使用 |
| **差分** | ある（別ファイル） | なし（同じファイル） |
| **使い分け** | 学習・デモ用 | 実際のプロジェクト用 |

---

## 🏗️ 実際のプロジェクトでの設計指針

### 1. データ取得と表示を分離

```tsx
// ✅ Good: 責務の分離
app/
  users/
    page.tsx          // データ取得 (Server Component)
components/
  UserList.tsx        // 表示 (Client Component)
```

### 2. Client Component の設計

```tsx
'use client';

// ✅ propsで受け取る
interface Props {
  data: SomeData;
}

// ✅ UIロジックに集中
export function MyComponent({ data }: Props) {
  const [filter, setFilter] = useState('');
  // インタラクション、状態管理など
  return <div>...</div>;
}
```

### 3. Server Component での使用

```tsx
// app/page.tsx
import { db } from '@/lib/db'; // ← server-only OK
import { MyComponent } from '@/components/MyComponent';

export default async function Page() {
  const data = await db.query(); // ← データ取得
  return <MyComponent data={data} />; // ← 渡す
}
```

### 4. Storybook での使用

```tsx
// MyComponent.stories.tsx
export const Default = {
  args: {
    data: mockData // ← モックデータ
  }
};
```

---

## ❓ よくある質問

### Q1: Storybookのために処理を変える必要がある？

**A: いいえ。** UI部分を最初から Client Component として設計します。本番でもStorybookでも同じファイルを使います。

### Q2: 本番との差分が生まれる？

**A: いいえ。** 同じ Client Component ファイルを本番でもStorybookでも使うので、差分は生まれません。

### Q3: どのコンポーネントを Client Component にすべき？

**A:** 以下の場合は Client Component にします：
- `useState`, `useEffect` などのフックを使う
- イベントハンドラ（onClick, onChange）を使う
- ブラウザAPIを使う
- **Storybookでテストしたい**

### Q4: Server Component はどこで使う？

**A:**
- Page Component（`app/` ディレクトリ）
- データ取得が必要な場所
- `server-only` パッケージを使う場所

---

## 📚 まとめ

### ✅ ベストプラクティス

1. **データ取得（Server Component）と表示（Client Component）を分離**
2. **Client Component は props でデータを受け取る**
3. **本番でもStorybookでも同じファイルを使う**
4. **server-only imports は Server Component (Page) でのみ使用**
5. **Storybook ではモックデータを渡すだけ**

### ❌ アンチパターン

1. Client Component 内で `async/await` を使う
2. Client Component 内で `server-only` をimport
3. Storybook用に別ファイルを作る（`.client.tsx` など）
4. 本番コードとStorybook用コードで差分を作る

---

## 🔗 関連ドキュメント

- [DIFF_GUIDE.md](../DIFF_GUIDE.md) - 問題版と解決版の差分比較（教育用）
- [WORKAROUNDS.md](../WORKAROUNDS.md) - 詳細な対策方法
- [README.md](../README.md) - プロジェクト全体の説明
