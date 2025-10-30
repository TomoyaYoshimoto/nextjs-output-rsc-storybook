/**
 * ケースB の対策版: Client Component
 *
 * この対策:
 * - server-only モジュールを import しない
 * - データを props として受け取る Client Component を作成
 * - Storybook で問題なく表示できる
 */

'use client';

// server-only モジュールは import しない
// import { db } from '@/lib/server-only-db'; // ❌ これを削除

// 型定義のみ import（または再定義）
export interface Product {
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
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">
          Server-Only Component (Client Version)
        </h2>
        <div className="text-sm text-gray-600">
          <p className="mb-3">
            このコンポーネントはserver-onlyモジュールをimportせず、
            データをpropsで受け取ります
          </p>
          <div className="space-y-2">
            <h3 className="font-semibold">Products:</h3>
            {products.map((product: Product) => (
              <div key={product.id} className="pl-3 border-l-2 border-blue-500">
                <p><strong>{product.name}</strong></p>
                <p className="text-xs">Price: ${product.price} | Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-green-600">
          ✓ このコンポーネントはClient Componentなので、Storybookで動作します
        </p>
      </div>
    </div>
  );
}
