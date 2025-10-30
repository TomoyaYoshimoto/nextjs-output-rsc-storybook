/**
 * ケースC: Server Actions
 *
 * この問題: 'use server' ディレクティブを使用したServer Actionsは
 * Storybookのクライアント環境では動作しない
 */

import { SubmitButton } from './SubmitButton';

// Server Action（サーバーサイドでのみ実行）
async function submitForm(formData: FormData): Promise<void> {
  'use server';

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  // サーバーサイド処理をシミュレート
  console.log('[SERVER ACTION] Form submitted:', { name, email });

  // 実際のアプリケーションではDBへの保存やAPIコールを行う
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('[SERVER ACTION] Completed successfully');
}

export default function FormWithServerAction() {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">
          Form with Server Action
        </h2>
        <form action={submitForm} className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <SubmitButton />
        </form>
        <p className="text-xs text-blue-600">
          ✓ このフォームはServer Actionを使用しています
        </p>
      </div>
    </div>
  );
}
