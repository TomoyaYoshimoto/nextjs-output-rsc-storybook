/**
 * Products Page - Server Component
 *
 * ✅ ここでデータ取得を行う（server-only importsもここで使える）
 * ✅ ProductListコンポーネントにデータを渡す
 * ✅ ProductList自体は「表示」だけに集中
 *
 * 本番環境でのserver-only imports対策の例
 */

import { ProductList, Product } from '@/components2/ProductList';
// import { db } from '@/lib/server-only-db'; // ← 本番ではここでimport可能

// サーバー側でデータ取得（server-only importsを使える）
async function fetchProducts(): Promise<Product[]> {
  // 実際の本番では、ここでserver-only moduleを使える
  // const products = await db.products.findAll(); // ← これが動く
  // return products;

  // このデモでは静的なモックデータを返す
  return [
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
}

// Server Component（デフォルトでasyncが使える）
export default async function ProductsPage() {
  // ✅ サーバー側でデータ取得（server-only modulesが使える）
  const products = await fetchProducts();

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>商品一覧</h1>

      <div style={{
        background: '#f0f9ff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #bae6fd',
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#0369a1' }}>
          📋 このページの仕組み
        </h2>
        <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>app/products/page.tsx</strong> (このファイル) = Server Component</li>
          <li>→ <code>fetchProducts()</code> でサーバー側でデータ取得</li>
          <li>→ ここで <code>server-only</code> パッケージを使ったDBアクセスが可能</li>
          <li>→ <code>&lt;ProductList products={'{products}'} /&gt;</code> にデータを渡す</li>
          <li><strong>components2/ProductList.tsx</strong> = Client Component</li>
          <li>→ propsで受け取ったデータを表示</li>
          <li>→ 検索・フィルタ・ソートなどのインタラクション</li>
        </ul>
      </div>

      <div style={{
        background: '#f0fdf4',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #bbf7d0',
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#15803d' }}>
          ✅ server-only 問題の解決方法
        </h2>
        <div style={{ lineHeight: '1.8' }}>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>ケースB（components/ServerOnlyComponent.tsx）の問題:</strong>
          </p>
          <ul style={{ margin: '0 0 15px 0', paddingLeft: '20px' }}>
            <li>❌ Client Component内で <code>server-only</code> をimport → Storybookでエラー</li>
          </ul>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>このパターン（components2/ProductList.tsx）の解決策:</strong>
          </p>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            <li>✅ ProductList.tsx は <code>server-only</code> をimportしない</li>
            <li>✅ Server Component (このファイル) で <code>server-only</code> を使う</li>
            <li>✅ ProductList にはデータだけを渡す</li>
            <li>✅ 本番でもStorybookでも <strong>同じProductList.tsxを使用</strong></li>
          </ul>
        </div>
      </div>

      {/* ✅ 同じProductListコンポーネントを使用 */}
      <ProductList
        products={products}
        onProductClick={(product) => {
          console.log('商品クリック:', product);
          // 本番ではここで詳細ページへ遷移など
          // router.push(`/products/${product.id}`);
        }}
      />

      <div style={{ marginTop: '30px', padding: '15px', background: '#fef3c7', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          💡 <strong>確認方法:</strong> <code>http://localhost:3000/products</code> にアクセス（Next.js dev server起動中）
        </p>
      </div>
    </div>
  );
}
