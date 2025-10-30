/**
 * ProductList Stories - Storybook
 *
 * ✅ components2/ProductList.tsx と全く同じファイルを使用
 * ✅ server-only imports の問題を回避（そもそもimportしていない）
 * ✅ モックデータだけをStory側で用意
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ProductList, Product } from './ProductList';

// モックデータ
const mockProducts: Product[] = [
  { id: 1, name: 'ノートPC', price: 120000, category: '電化製品', inStock: true },
  { id: 2, name: 'ワイヤレスマウス', price: 3500, category: '電化製品', inStock: true },
  { id: 3, name: 'デスク', price: 25000, category: '家具', inStock: true },
  { id: 4, name: 'オフィスチェア', price: 45000, category: '家具', inStock: false },
  { id: 5, name: 'モニター', price: 35000, category: '電化製品', inStock: true },
  { id: 6, name: 'キーボード', price: 8000, category: '電化製品', inStock: true },
  { id: 7, name: '本棚', price: 15000, category: '家具', inStock: true },
  { id: 8, name: 'デスクライト', price: 6000, category: '照明', inStock: false },
  { id: 9, name: 'ノート', price: 500, category: '文房具', inStock: true },
  { id: 10, name: 'ペン', price: 300, category: '文房具', inStock: true },
];

const meta = {
  title: 'Production Pattern/ProductList',
  component: ProductList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# 商品リストコンポーネント

このコンポーネントは **本番でもStorybookでも全く同じファイル** を使用しています。

## 使い方

### 本番環境 (Next.js)
\`\`\`tsx
// app/products/page.tsx (Server Component)
import { db } from '@/lib/server-only-db'; // ← Server Componentでのみimport
import { ProductList } from '@/components2/ProductList';

async function ProductsPage() {
  const products = await db.products.findAll(); // サーバー側でデータ取得
  return <ProductList products={products} />;   // Client Componentに渡す
}
\`\`\`

### Storybook
\`\`\`tsx
// ProductList.stories.tsx
export const Default: Story = {
  args: {
    products: mockProducts // モックデータを渡す
  }
};
\`\`\`

## 重要なポイント

- ✅ ProductList.tsx は \`server-only\` をimportしない
- ✅ データ取得は Server Component (Page) で行う
- ✅ ProductList は表示とUIロジック（フィルタ・ソート）に集中
- ✅ 本番とStorybookで **同じファイル** を使用
- ✅ コードの差分は生まれない
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    products: {
      description: '表示する商品リスト',
    },
    onProductClick: {
      description: '商品がクリックされた時のコールバック',
      action: 'onProductClick',
    },
  },
} satisfies Meta<typeof ProductList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルトの表示
 *
 * 本番では: Server Componentでdb.query()したデータを渡す
 * Storybookでは: このモックデータを渡す
 */
export const Default: Story = {
  args: {
    products: mockProducts,
  },
};

/**
 * クリックイベント付き
 */
export const WithClickHandler: Story = {
  args: {
    products: mockProducts,
    onProductClick: (product) => {
      alert(`商品がクリックされました: ${product.name}\n本番では詳細ページに遷移など`);
    },
  },
};

/**
 * 少ない商品数
 */
export const FewProducts: Story = {
  args: {
    products: mockProducts.slice(0, 3),
  },
};

/**
 * 商品なし
 */
export const NoProducts: Story = {
  args: {
    products: [],
  },
};

/**
 * すべて在庫切れ
 */
export const AllOutOfStock: Story = {
  args: {
    products: mockProducts.map(p => ({ ...p, inStock: false })),
  },
};

/**
 * 単一カテゴリ
 */
export const SingleCategory: Story = {
  args: {
    products: mockProducts.filter(p => p.category === '電化製品'),
  },
};

/**
 * 高額商品のみ
 */
export const ExpensiveProducts: Story = {
  args: {
    products: mockProducts.filter(p => p.price >= 20000),
  },
};
