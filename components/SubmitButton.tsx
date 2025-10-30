/**
 * クライアントコンポーネント: フォーム送信ボタン
 * useFormStatusを使用するためクライアントコンポーネントが必要
 */

'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
