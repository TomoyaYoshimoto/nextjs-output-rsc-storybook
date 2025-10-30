/**
 * サーバーサイド専用のデータベースモジュール
 * server-only パッケージによりクライアントでのimportを防ぐ
 */

import 'server-only';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

// サーバーサイドでのみ利用可能な擬似データベース
class ServerOnlyDatabase {
  private products: Product[] = [
    { id: 1, name: 'Laptop', price: 1200, stock: 5 },
    { id: 2, name: 'Mouse', price: 25, stock: 50 },
    { id: 3, name: 'Keyboard', price: 75, stock: 30 },
  ];

  // 本番環境では実際のDB接続を行う想定
  async query(): Promise<Product[]> {
    // サーバーサイドでのみ実行される処理をシミュレート
    console.log('[SERVER] Database query executed');
    return this.products;
  }

  async getById(id: number): Promise<Product | undefined> {
    console.log(`[SERVER] Database query for ID: ${id}`);
    return this.products.find(p => p.id === id);
  }
}

export const db = new ServerOnlyDatabase();
