/**
 * ケースA の対策版: Client Component
 *
 * この対策:
 * - データを props として受け取る Client Component を作成
 * - Storybook で問題なく表示できる
 * - Server Component は別ファイルに残し、そこからこのコンポーネントを呼ぶ
 */

'use client';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Props {
  user: User;
}

export function AsyncServerComponentClient({ user }: Props) {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg">
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">
          Async Server Component (Client Version)
        </h2>
        <div className="text-sm text-gray-600">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        <p className="text-xs text-green-600">
          ✓ このコンポーネントはClient Componentなので、Storybookで動作します
        </p>
      </div>
    </div>
  );
}
