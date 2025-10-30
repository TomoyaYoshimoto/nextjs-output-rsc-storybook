/**
 * ProductList - Client Component
 *
 * ✅ 本番でもStorybookでも同じファイルを使う
 * ✅ データはpropsで受け取るだけ（server-only importsなし）
 * ✅ フィルタリング・ソートなどのUIロジックに集中
 */
'use client';

import { useState, useMemo } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

interface ProductListProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

export function ProductList({ products, onProductClick }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');

  // カテゴリの一覧を取得
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  // フィルタリング＆ソート
  const filteredProducts = useMemo(() => {
    let result = products;

    // 検索フィルター
    if (searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // カテゴリフィルター
    if (categoryFilter !== 'all') {
      result = result.filter(p => p.category === categoryFilter);
    }

    // ソート
    result = [...result].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return a.price - b.price;
      }
    });

    return result;
  }, [products, searchTerm, categoryFilter, sortBy]);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* コントロールパネル */}
      <div style={{
        background: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
      }}>
        <input
          type="text"
          placeholder="商品名で検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            flex: '1',
            minWidth: '200px',
          }}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'すべてのカテゴリ' : cat}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        >
          <option value="name">名前順</option>
          <option value="price">価格順</option>
        </select>
      </div>

      {/* 結果の件数 */}
      <p style={{ marginBottom: '15px', color: '#666' }}>
        {filteredProducts.length}件の商品
      </p>

      {/* 商品リスト */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
      }}>
        {filteredProducts.map(product => (
          <div
            key={product.id}
            onClick={() => onProductClick?.(product)}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '15px',
              cursor: onProductClick ? 'pointer' : 'default',
              transition: 'box-shadow 0.2s',
              background: product.inStock ? 'white' : '#f9f9f9',
            }}
            onMouseEnter={(e) => {
              if (onProductClick) {
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
              {product.name}
            </h3>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
              カテゴリ: {product.category}
            </p>
            <p style={{
              margin: '10px 0 0 0',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#0070f3',
            }}>
              ¥{product.price.toLocaleString()}
            </p>
            <div style={{
              marginTop: '10px',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              display: 'inline-block',
              background: product.inStock ? '#dcfce7' : '#fee2e2',
              color: product.inStock ? '#15803d' : '#991b1b',
            }}>
              {product.inStock ? '在庫あり' : '在庫切れ'}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#999',
        }}>
          条件に一致する商品が見つかりません
        </div>
      )}
    </div>
  );
}
