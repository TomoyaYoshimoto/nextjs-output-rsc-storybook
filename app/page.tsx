import AsyncServerComponent from '@/components/AsyncServerComponent';
import ServerOnlyComponent from '@/components/ServerOnlyComponent';
import FormWithServerAction from '@/components/FormWithServerAction';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            RSC & Storybook 互換性問題のデモ
          </h1>
          <p className="text-lg text-gray-600">
            React Server Components が Storybook で動作しない3つのケース
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">
              ケースA: Async Component
            </h3>
            <AsyncServerComponent />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">
              ケースB: Server-Only Imports
            </h3>
            <ServerOnlyComponent />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">
              ケースC: Server Actions
            </h3>
            <FormWithServerAction />
          </div>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">これらのコンポーネントについて</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ <strong>ケースA:</strong> async/awaitを使用したServer Component</li>
            <li>✓ <strong>ケースB:</strong> server-onlyパッケージを使用したコンポーネント</li>
            <li>✓ <strong>ケースC:</strong> Server Actionsを使用したフォーム</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            Next.jsではこれらすべてが正常に動作しますが、Storybookでは問題が発生します。
          </p>
        </div>
      </div>
    </div>
  );
}
