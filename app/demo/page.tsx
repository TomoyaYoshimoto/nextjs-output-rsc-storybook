/**
 * Demo Page - Server Component
 *
 * ✅ ここでデータ取得を行う（async/await）
 * ✅ UserProfileコンポーネントにデータを渡す
 * ✅ UserProfile自体は「表示」だけに集中
 *
 * 本番環境での使い方の例
 */

import { UserProfile, User } from '@/components2/UserProfile';

// サーバー側でデータ取得
async function fetchUser(): Promise<User> {
  // 実際の本番では、ここでDBやAPIから取得
  // await db.user.findFirst({ where: { id: 1 } });
  // await fetch('https://api.example.com/users/1');

  // このデモでは外部APIから取得
  const res = await fetch('https://jsonplaceholder.typicode.com/users/1', {
    cache: 'no-store', // 毎回最新データを取得
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }

  return res.json();
}

// Server Component（デフォルトでasyncが使える）
export default async function DemoPage() {
  // ✅ サーバー側でデータ取得
  const user = await fetchUser();

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>本番環境での使用例</h1>

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
          <li><strong>app/demo/page.tsx</strong> (このファイル) = Server Component</li>
          <li>→ <code>fetchUser()</code> でサーバー側でデータ取得</li>
          <li>→ <code>&lt;UserProfile user={'{user}'} /&gt;</code> にデータを渡す</li>
          <li><strong>components2/UserProfile.tsx</strong> = Client Component</li>
          <li>→ propsで受け取ったデータを表示</li>
          <li>→ インタラクション（展開/折りたたみ）を処理</li>
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
          ✅ 重要ポイント
        </h2>
        <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>UserProfile.tsx は <strong>本番でもStorybookでも全く同じファイル</strong>を使用</li>
          <li>本番: Server Componentから実データを渡す</li>
          <li>Storybook: Story側からモックデータを渡す</li>
          <li>→ <strong>コードの差分は生まれない</strong></li>
        </ul>
      </div>

      {/* ✅ 同じUserProfileコンポーネントを使用 */}
      <UserProfile
        user={user}
        onEdit={() => {
          console.log('Edit clicked - 本番ではこここで編集処理を実装');
        }}
      />

      <div style={{ marginTop: '30px', padding: '15px', background: '#fef3c7', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          💡 <strong>確認方法:</strong> <code>http://localhost:3000/demo</code> にアクセス（Next.js dev server起動中）
        </p>
      </div>
    </div>
  );
}
