/**
 * ケースA: Async Server Component
 *
 * この問題: Storybookはクライアント環境で動作するため、
 * async componentを直接レンダリングできない
 */

interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(): Promise<User> {
  // 実際のAPIコール（サーバーサイドでのみ実行可能）
  const res = await fetch('https://jsonplaceholder.typicode.com/users/1', {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }

  return res.json();
}

export default async function AsyncServerComponent() {
  // このawaitはReact Server Componentでのみ可能
  const user = await fetchUser();

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg">
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">
          Async Server Component
        </h2>
        <div className="text-sm text-gray-600">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        <p className="text-xs text-blue-600">
          ✓ このコンポーネントはサーバーサイドで非同期にデータを取得しています
        </p>
      </div>
    </div>
  );
}
