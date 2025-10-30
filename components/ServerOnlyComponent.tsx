/**
 * ケースB: Server-only imports
 *
 * この問題: 'server-only' パッケージでマークされたモジュールは
 * クライアント環境でimportするとエラーが発生する
 */

import { db, type Product } from '@/lib/server-only-db';

export default async function ServerOnlyComponent() {
  // server-only モジュールを使用してデータを取得
  const products = await db.query();

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">
          Server-Only Component
        </h2>
        <div className="text-sm text-gray-600">
          <p className="mb-3">
            このコンポーネントはserver-onlyパッケージを使用しています
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
        <p className="text-xs text-blue-600">
          ✓ このコンポーネントはserver-only DBモジュールをimportしています
        </p>
      </div>
    </div>
  );
}
